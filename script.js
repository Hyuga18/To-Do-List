    // Current task being edited
            let currentEditIndex = -1;
            
            // Load tasks from localStorage and display them
        function loadTasks() {
        const personalList = document.getElementById('personal-task-list');
        const businessList = document.getElementById('business-task-list');
        const completedList = document.getElementById('completed-task-list');

        personalList.innerHTML = '';
        businessList.innerHTML = '';
        completedList.innerHTML = '';

        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

        tasks.forEach((task, idx) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.category === 'Business' ? 'business' : ''} ${task.done ? 'done' : ''}`;

            li.innerHTML = `
                <div class="task-main">
                    <div class="task-category-icon">
                        <i class="fas ${task.category === 'Business' ? 'fa-graduation-cap' : 'fa-user'}"></i>
                    </div>
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="task-btn edit" aria-label="Edit task"><i class="fas fa-pencil-alt"></i></button>
                        <button class="task-btn delete" aria-label="Delete task"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                ${task.notes ? `<div class="task-notes">${task.notes}</div>` : ''}
                <div class="task-checkbox-container">
                    <input type="checkbox" class="task-checkbox" id="task-${idx}" ${task.done ? 'checked' : ''}>
                    <label for="task-${idx}" class="checkbox-custom"></label>
                </div>
            `;

            // Add event listeners
            li.querySelector('.task-checkbox').addEventListener('change', () => toggleDone(idx));
            li.querySelector('.delete').addEventListener('click', () => removeTask(idx));
            li.querySelector('.edit').addEventListener('click', () => openEditModal(idx));

            if (task.done) {
                completedList.appendChild(li);
            } else if (task.category === 'Business') {
                businessList.appendChild(li);
            } else {
                personalList.appendChild(li);
            }
        });

        updateStats();
    }       
            function removeTask(idx) {
                let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                tasks.splice(idx, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                loadTasks();
            }
            
            function toggleDone(idx) {
                let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                tasks[idx].done = !tasks[idx].done;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                loadTasks();
            }
            
            function openEditModal(idx) {
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                const task = tasks[idx];
                
                document.getElementById('edit-task-text').value = task.text;
                document.getElementById('edit-task-notes').value = task.notes || '';
                document.getElementById('edit-task-category').value = task.category;
                
                currentEditIndex = idx;
                document.getElementById('edit-modal').classList.add('active');
            }
            
            function closeEditModal() {
                document.getElementById('edit-modal').classList.remove('active');
                currentEditIndex = -1;
            }
            
            function saveEditedTask() {
                if (currentEditIndex === -1) return;
                
                const newText = document.getElementById('edit-task-text').value.trim();
                const newNotes = document.getElementById('edit-task-notes').value.trim();
                const newCategory = document.getElementById('edit-task-category').value;
                
                if (newText !== '') {
                    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                    tasks[currentEditIndex] = {
                        text: newText,
                        notes: newNotes,
                        category: newCategory,
                        done: tasks[currentEditIndex].done
                    };
                    
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    loadTasks();
                    closeEditModal();
                }
            }
            
            function updateStats() {
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                const personalCount = tasks.filter(task => task.category === 'Personal').length;
                const businessCount = tasks.filter(task => task.category === 'Business').length;
                
                // Update progress
                const doneCount = tasks.filter(task => task.done).length;
                const totalCount = tasks.length;
                const completionPercentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
                
                document.querySelector('.progress-header span:last-child').textContent = `${completionPercentage}%`;
                document.querySelector('.progress-fill').style.width = `${completionPercentage}%`;
            }
            
            document.addEventListener('DOMContentLoaded', function() {
                loadTasks();
                
                // Add new task
                document.getElementById('add-task-btn').addEventListener('click', function() {
                    const taskInput = document.getElementById('task-input');
                    const taskNotes = document.getElementById('task-notes');
                    const taskCategory = document.getElementById('task-category');
                    const taskText = taskInput.value.trim();
                    
                    if (taskText !== '') {
                        let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                        tasks.push({
                            text: taskText,
                            notes: taskNotes.value.trim(),
                            category: taskCategory.value,
                            done: false
                        });
                        
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                        taskInput.value = '';
                        taskNotes.value = '';
                        loadTasks();
                    }
                });
                
                // Add task on Enter key
                document.getElementById('task-input').addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        document.getElementById('add-task-btn').click();
                    }
                });
                
                // Floating action button
                document.getElementById('add-fab-btn').addEventListener('click', function() {
                    document.getElementById('task-input').focus();
                });
                
                // Modal functionality
                document.getElementById('modal-close').addEventListener('click', closeEditModal);
                document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
                document.getElementById('save-edit').addEventListener('click', saveEditedTask);
                
                // Close modal when clicking outside
                document.getElementById('edit-modal').addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeEditModal();
                    }
                });
            });