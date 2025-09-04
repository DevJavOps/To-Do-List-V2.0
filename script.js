const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const resetBtn = document.getElementById('reset-btn');
const recycleList = document.getElementById('recycled-list'); // No change needed, ul remains 'recycled-list'
const restoreBtn = document.getElementById('restore-btn');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskText = input.value.trim();
    if (taskText) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = taskText;
        li.appendChild(span);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete-btn';
        delBtn.onclick = function() {
            // Moves the deleted task into the recycle bin
            list.removeChild(li);
            const recycledLi = document.createElement('li');
            recycledLi.className = 'recycled-task';
            // Add checkbox and label
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'recycle-checkbox';
            recycledLi.appendChild(checkbox);
            const recycledSpan = document.createElement('span');
            recycledSpan.className = 'task-text';
            recycledSpan.textContent = span.textContent;
            recycledLi.appendChild(recycledSpan);
            recycleList.appendChild(recycledLi);
            // Add event for custom order
            checkbox.addEventListener('change', function() {
                if (checkbox.checked) {
                    checkbox.dataset.checkedAt = Date.now();
                } else {
                    delete checkbox.dataset.checkedAt;
                }
            });
        };
        li.appendChild(delBtn);
        list.appendChild(li);
        input.value = '';
    }
});

restoreBtn.addEventListener('click', function() {
    const mode = document.getElementById('restore-mode-select').value;
    let recycledItems = Array.from(recycleList.querySelectorAll('li'));
    // Only keep checked
    recycledItems = recycledItems.filter(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        return checkbox && checkbox.checked;
    });
    if (mode === 'stack') {
        // Restore in reverse order (LIFO)
        recycledItems.reverse();
    } else if (mode === 'queue') {
        // Restore in original order (FIFO)
        // Already in order
    } else if (mode === 'custom') {
        // Custom: restore in the order the user checked them
        recycledItems.sort((a, b) => {
            const aTime = a.querySelector('input[type="checkbox"]').dataset.checkedAt || 0;
            const bTime = b.querySelector('input[type="checkbox"]').dataset.checkedAt || 0;
            return aTime - bTime;
        });
    }
    recycledItems.forEach(function(item) {
        const restoredLi = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = item.querySelector('.task-text').textContent;
        restoredLi.appendChild(span);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete-btn';
        delBtn.onclick = function() {
            // Moves the deleted task into the recycle bin
            list.removeChild(restoredLi);
            const recycledLi = document.createElement('li');
            recycledLi.className = 'recycled-task';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'recycle-checkbox';
            recycledLi.appendChild(checkbox);
            const recycledSpan = document.createElement('span');
            recycledSpan.className = 'task-text';
            recycledSpan.textContent = span.textContent;
            recycledLi.appendChild(recycledSpan);
            recycleList.appendChild(recycledLi);
            // Add event for custom order
            checkbox.addEventListener('change', function() {
                if (checkbox.checked) {
                    checkbox.dataset.checkedAt = Date.now();
                } else {
                    delete checkbox.dataset.checkedAt;
                }
            });
        };
        restoredLi.appendChild(delBtn);
        list.appendChild(restoredLi);
        recycleList.removeChild(item);
    });
});

resetBtn.addEventListener('click', function() {
    list.innerHTML = '';
    recycleList.innerHTML = '';
});
