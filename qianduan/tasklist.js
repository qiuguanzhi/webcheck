document.addEventListener('DOMContentLoaded', function () {
    const createBoardForm = document.getElementById('create-board-form');
    const boardsContainer = document.getElementById('boards-container');

   
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
        <!-- 任务列表容器 -->
        <div class="dropzone">
            <div class="board-tasks">
                <ul class="task-list">
                    <!-- 创建任务表单，内嵌于看板中 -->
                    
                </ul>
            </div>
        </div>
        <form class="board-create-card-form">
            <input type="text" id="card-name" placeholder="输入任务名称" required>
            <button type="submit" disabled>创建任务</button>
        </form>
                    
        `;

     
        newBoard.querySelector('.board-create-card-form').addEventListener('submit', function (event) {
            event.preventDefault();
            const cardName = newBoard.querySelector('#card-name').value.trim();
            if (cardName) {
                createTask(cardName, newBoard);
                this.reset(); 
            } else {
                alert('请输入任务名称');
            }
        });

      
        newBoard.addEventListener('click', function () {
            const cardForm = newBoard.querySelector('.board-create-card-form');
            cardForm.style.display = 'block'; 
            cardForm.querySelector('button').disabled = false; 
        });

        boardsContainer.appendChild(newBoard);
    }




    function createTask(name, board) {
        const taskList = board.querySelector('.task-list');
        const newTask = document.createElement('li');
        newTask.classList.add('task-item');
    
      
        const taskName = document.createElement('span');
        taskName.textContent = name;
        taskName.contentEditable = false;
        taskName.addEventListener('click', function(event) {
          
            event.preventDefault();
            event.stopPropagation();
        });
    
      
        const editTrigger = document.createElement('span');
        editTrigger.textContent = '...';
        editTrigger.title = '点击编辑任务';
    
       
        editTrigger.addEventListener('click', function(event) {
            event.stopPropagation();
            taskName.contentEditable = true;
            taskName.focus(); 
            editTrigger.style.display = 'none'; 
        });
    
       
        taskName.addEventListener('blur', function() {
            taskName.contentEditable = false; 
            editTrigger.style.display = 'inline'; 
        });
    
        
        newTask.appendChild(taskName);
        newTask.appendChild(editTrigger);
    
        
        newTask.addEventListener('click', function() {
            window.location.href = 'comment.html';
        });
    
        taskList.appendChild(newTask);

    }

    
});