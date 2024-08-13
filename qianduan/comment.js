document.addEventListener('DOMContentLoaded', function () {
    const commentList = document.querySelector('.comment-list');
    const addCommentButton = document.querySelector('.add-comment button');
    const addTextarea = document.querySelector('.add-comment textarea');
  
   
    addCommentButton.addEventListener('click', function () {
      const commentText = addTextarea.value.trim();
      if (commentText) {
        addComment(commentText);
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
          }
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
        comment.remove();
      }
    });
  });
  
  function addComment(text) {
    const newComment = createCommentElement(text);
    const commentList = document.querySelector('.comment-list');
    commentList.appendChild(newComment);
  }
  
  function createCommentElement(text) {
    const comment = document.createElement('div');
    comment.classList.add('comment');
    comment.innerHTML = `
      <div class="comment-author">用户</div>
      <div class="comment-time">刚刚</div>
      <div class="comment-content">${text}</div>
      <div class="comment-actions">
        <button>编辑</button>
        <button>删除</button>
      </div>
    `;
    return comment;
  }
document.getElementById('file-upload').addEventListener('change', handleFileSelect);
function handleFileSelect(event) {
  const file = event.target.files[0]; 
  if (file) {
    
    const reader = new FileReader();

    reader.onload = function(e) {
     
      console.log(e.target.result);
      
    };

    reader.readAsText(file); 
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/create_user', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('File uploaded successfully:', data);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  }
}
