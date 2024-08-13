document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    if (!username) {
      showError('用户名不能为空！');
      return;
    }

    
    try {
      const response = await fetch('http://localhost:7001/api/create_user', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showError(`发生错误：${errorData.message || '未知错误'}`);
        return;
      }

      const data = await response.json();
      showSuccess(data.message);
      window.location.href = 'tasklist.html';
    } catch (error) {
      console.error('登录请求失败:', error);
      showError('登录失败，请稍后重试。');
    }
  });

  function showError(message) {
   
    console.error(message);

  }

  function showSuccess(message) {
   
    console.log(message);
   
  }
});