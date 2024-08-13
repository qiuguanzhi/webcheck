document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    if (!username) {
      showError('用户名不能为空！');
      return;
    }

    localStorage.setItem('username', username);

  
    showSuccess('登录成功，正在跳转到任务列表...');

    // 直接跳转到任务列表页面
    window.location.href = 'tasklist.html';
  });

  function showError(message) {
    console.error(message);
   
  }

  function showSuccess(message) {
    console.log(message);
  
  }
});