
document.addEventListener('DOMContentLoaded', function () {
    const createBoardForm = document.getElementById('create-board-form');
    const boardsContainer = document.getElementById('boards-container');


    const username = localStorage.getItem('username');
    loadBoards();

    createBoardForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const boardName = document.getElementById('board-name').value.trim();
        if (boardName) {
            createBoard(boardName);
            createBoardForm.reset();
        } else {
            alert('请输入项目名称');
        }
    });

    function createBoard(name) {
        const newBoard = document.createElement('div');
        newBoard.classList.add('kanban-board');
        newBoard.innerHTML = `
          <h2>${name}</h2>
          <div class="dropzone">
              <div class="board-tasks">
                  <ul class="task-list">
                  </ul>
              </div>
          </div>
          <form class="board-create-card-form" style="display: none;">
            <input type="text" id="card-name" placeholder="输入任务名称" required>
            <button type="submit" disabled>创建任务</button>
          </form>
        `;


        boardsContainer.appendChild(newBoard);


        newBoard.querySelector('.board-create-card-form').addEventListener('submit', function (event) {
            event.preventDefault();
            const cardName = newBoard.querySelector('#card-name').value.trim();
            if (cardName) {
                createTask(cardName, newBoard);
                this.reset();

                this.style.display = 'none';
            }
        });


        newBoard.addEventListener('click', function () {
            const cardForm = newBoard.querySelector('.board-create-card-form');
            cardForm.style.display = 'block';
            cardForm.querySelector('button').disabled = false;
        });

        return newBoard;
    }

    function createTask(cardName, board) {
        const taskList = board.querySelector('.task-list');
        const newTask = document.createElement('li');
        newTask.classList.add('task-item');


        const taskName = document.createElement('span');
        taskName.textContent = cardName;
        taskName.contentEditable = false;
        taskName.addEventListener('click', function (event) {

            event.preventDefault();
            event.stopPropagation();
        });


        const editTrigger = document.createElement('span');
        editTrigger.textContent = '...';
        editTrigger.title = '点击编辑任务';





        editTrigger.addEventListener('click', function (event) {
            event.stopPropagation();
            const taskItem = taskName.parentNode;
            const board = taskItem.closest('.kanban-board');
            const boardName = board.querySelector('h2').textContent;
            const taskContent = taskName.textContent;
            removeTaskFromLocalStorage(taskContent, boardName);

            taskName.contentEditable = true;
            taskName.focus();
            editTrigger.style.display = 'none';
        });
        function removeTaskFromLocalStorage(taskContent, boardName) {
            let boardsData = JSON.parse(localStorage.getItem(`${username}-boards`)) || {};
            if (boardsData[boardName]) {
                const newTasks = boardsData[boardName].filter(task => task.content !== taskContent);
                boardsData[boardName] = newTasks;
                localStorage.setItem(`${username}-boards`, JSON.stringify(boardsData));
            }
        }
        taskName.addEventListener('blur', function (event) {
            taskName.contentEditable = false;
            editTrigger.style.display = 'inline';
            const newTaskName = taskName.textContent.trim();
            if (newTaskName === '') {
                taskName.textContent = event.target.previousSibling.textContent;
                return;
            }
        
            const taskItem = taskName.parentNode;
            const board = taskItem.closest('.kanban-board');
            const boardName = board.querySelector('h2').textContent;
        
            saveTaskToLocalStorage(newTaskName, boardName);
        });
        function saveTaskToLocalStorage(taskContent, boardName) {
            let boardsData = JSON.parse(localStorage.getItem(`${username}-boards`)) || {};
            const task = { content: taskContent };
            if (!boardsData[boardName]) {
                boardsData[boardName] = [];
            }
            boardsData[boardName].push(task);
            localStorage.setItem(`${username}-boards`, JSON.stringify(boardsData));
        }




        newTask.appendChild(taskName);
        newTask.appendChild(editTrigger);
        newTask.addEventListener('click', function () {
            const taskText = cardName;
            const encodedTaskText = encodeURIComponent(taskText);
            window.location.href = `comment.html?taskName=${encodedTaskText}`;
        });
        taskList.appendChild(newTask);
        saveBoards();
    }






    function saveBoards() {
        const boards = document.querySelectorAll('.kanban-board');
        let boardsData = {};

        boards.forEach(board => {
            const name = board.querySelector('h2').textContent;
            const tasks = Array.from(board.querySelectorAll('.task-list .task-item'))
                .map(task => {
                    const taskDetails = {
                        content: task.querySelector('span').textContent,
                    };
                    return taskDetails;
                });
            boardsData[name] = tasks;
        });

        localStorage.setItem(`${username}-boards`, JSON.stringify(boardsData));
    }

    function loadBoards() {

        const boardsData = JSON.parse(localStorage.getItem(`${username}-boards`));
        if (!username || !boardsData) {
            return;
        }

        Object.keys(boardsData).forEach(boardName => {
            const newBoard = createBoard(boardName);
            if (newBoard) {
                boardsData[boardName].forEach(taskDetails => {
                    createTask(taskDetails.content, newBoard);
                });
            }
        });
    }
    function removeTask(taskElement) {
        if (taskElement.classList.contains('task-item')) {
            taskElement.parentNode.removeChild(taskElement);
            saveBoards();
        }
    }

    document.addEventListener('contextmenu', function (event) {
        if (event.target.classList.contains('task-item')) {
            event.preventDefault();
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '删除';
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.fontSize = '12px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.position = 'fixed';
            deleteButton.style.top = `${event.pageY + 5}px`;
            deleteButton.style.left = `${event.pageX + 5}px`;

            deleteButton.addEventListener('click', function () {
                removeTask(event.target.closest('.task-item'));
                document.body.removeChild(deleteButton);
            });

            document.body.appendChild(deleteButton);
            deleteButton.addEventListener('click', function (e) {
                e.stopPropagation();
            });

            document.addEventListener('click', function () {
                if (deleteButton) {
                    document.body.removeChild(deleteButton);
                    deleteButton = null;
                }
            });
        }
    });

});