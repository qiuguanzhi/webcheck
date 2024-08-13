document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;

    if (username) {
      try {
      
        const response = await fetch('/submit-username', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ username }) 
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          window.location.href = 'tasklist.html'; 
        }
      } catch (error) {
        console.error('Error:', error);
        alert('登录失败，请稍后重试。');
      }
    } else {
      alert('请输入用户名！');
    }
  });
});