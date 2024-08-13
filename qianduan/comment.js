const commentList = document.querySelector('.comment-list');
let commentsLoaded = false;
const urlParams = new URLSearchParams(window.location.search);
const taskName = urlParams.get('taskName');
const username = localStorage.getItem('username');
document.addEventListener('DOMContentLoaded', function () {

  const addCommentButton = document.querySelector('.add-comment button');
  const addTextarea = document.querySelector('.add-comment textarea');


  if (taskName) {
    const taskNameElement = document.getElementById('task-name');
    taskNameElement.textContent = taskName;
    taskNameElement.style.fontSize = '80px';
    taskNameElement.style.fontWeight = 'bold';
    taskNameElement.style.color = '#1e4d2b';
    taskNameElement.style.textAlign = 'center';
    taskNameElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
  }
  if (!commentsLoaded) {
    loadCommentsFromLocalStorage(taskName);
    commentsLoaded = true;
  }
  loadAttachments(taskName);
  addCommentButton.addEventListener('click', function (event) {
    const commentText = addTextarea.value.trim();
    if (commentText) {
      addComment(commentText, taskName, username);
      addTextarea.value = '';
    }
  });

  commentList.addEventListener('click', function (event) {
    const editButton = event.target.closest('.comment-actions button:first-child');
    const deleteButton = event.target.closest('.comment-actions button:last-child');

    if (editButton) {
      const comment = editButton.closest('.comment');
      const content = comment.querySelector('.comment-content');
      const originalText = content.textContent;

      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = originalText;
      editInput.select();

      content.textContent = '';
      content.appendChild(editInput);

      editInput.addEventListener('blur', function () {
        const newText = this.value.trim();
        if (newText) {
          content.textContent = newText;

          saveCommentsToLocalStorage(taskName);
        }
        editInput.remove();
      });

      editInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.blur();
        }
      });
    }

    if (deleteButton) {
      const comment = deleteButton.closest('.comment');
      const commentContent = comment.querySelector('.comment-content').textContent;
      removeCommentFromLocalStorage(taskName, commentContent);
      comment.remove();
    }

    const fileUploadInput = document.createElement('input');
    fileUploadInput.type = 'file';
    fileUploadInput.style.display = 'none';
    document.body.appendChild(fileUploadInput);

    fileUploadInput.addEventListener('change', handleFileSelect);
  });


});
function saveCommentsToLocalStorage(taskName) {

  localStorage.removeItem(`comments-${taskName}`);


  const comments = [];
  const commentContents = commentList.querySelectorAll('.comment-content');
  commentContents.forEach(element => {
    comments.push(element.textContent);
  });
  const commentData = {
    taskName: taskName,
    username: username,
    comments: comments
  };
  localStorage.setItem(`comments-${taskName}`, JSON.stringify(commentData));
}
function removeCommentFromLocalStorage(taskName, commentContent) {
  const commentsStr = localStorage.getItem(`comments-${taskName}`);
  if (commentsStr) {
    let commentData = JSON.parse(commentsStr);
    commentData.comments = commentData.comments.filter(c => c !== commentContent);

    if (commentData.comments.length === 0) {
      localStorage.removeItem(`comments-${taskName}`);
    } else {
    
      localStorage.setItem(`comments-${taskName}`, JSON.stringify(commentData));
    }

    const commentElements = commentList.querySelectorAll('.comment');
    for (let i = commentElements.length - 1; i >= 0; i--) {
      const element = commentElements[i];
      if (element.querySelector('.comment-content').textContent === commentContent) {
        commentList.removeChild(element);
        break;
      }
    }
  }
}
function loadCommentsFromLocalStorage(taskName) {
  const commentsStr = localStorage.getItem(`comments-${taskName}`);
  if (commentsStr) {
    const commentsObj = JSON.parse(commentsStr);
    commentsObj.comments.forEach(text => {
      addComment(text, commentsObj.taskName, commentsObj.username);
    });
  }
}
function addComment(text, taskName, username) {
  const newComment = createCommentElement(text, username);
  commentList.appendChild(newComment);

  let commentData = localStorage.getItem(`comments-${taskName}`);
  if (commentData) {
    commentData = JSON.parse(commentData);
    commentData.comments.push(text);
  } else {
    commentData = {
      taskName: taskName,
      username: username,
      comments: [text]
    };
  }
  localStorage.setItem(`comments-${taskName}`, JSON.stringify(commentData));
  saveCommentsToLocalStorage(taskName);
}

function createCommentElement(text, author) {
  const comment = document.createElement('div');
  comment.classList.add('comment');
  comment.innerHTML = `
    <div class="comment-author">${author}</div>
    <div class="comment-time">刚刚</div>
    <div class="comment-content">${text}</div>
    <div class="comment-actions">
      <button class="edit-button">编辑</button>
      <button class="delete-button">删除</button>
    </div>
  `;
  return comment;
}














document.getElementById('file-upload').addEventListener('change', handleFileSelect);

function handleFileSelect(event, taskName) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileContent = e.target.result;
      const attachmentData = {
        taskName: taskName,
        filename: file.name,
        fileContent: fileContent
      };
      localStorage.setItem(`attachment-${taskName}-${file.name}`, JSON.stringify(attachmentData));
      console.log('Attachment uploaded successfully:', attachmentData);
    };
    reader.readAsDataURL(file);
  }
}

function loadAttachments(taskName) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(`attachment-${taskName}`)) {
      const attachmentData = JSON.parse(localStorage.getItem(key));
      displayAttachment(attachmentData);
    }
  }
}

function displayAttachment(attachmentData) {
  const attachmentsList = document.getElementById('attachments-list');
  const attachmentElement = document.createElement('div');
  attachmentElement.classList.add('attachment');
  attachmentElement.innerHTML = `
    <div class="filename">${attachmentData.filename}</div>
    <img src="${attachmentData.fileContent}" alt="Attachment" />
  `;
  attachmentsList.appendChild(attachmentElement);
}