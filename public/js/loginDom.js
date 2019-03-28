const send = document.getElementById('send');
const error = document.getElementById('login_error');

send.addEventListener('click', (e) => {
  e.preventDefault();
  const errorMessage = document.querySelector('.error');
  if (errorMessage) {
    errorMessage.remove();
  }
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  error.textContent = '';

  if (!validator.isEmail(email)) {
    error.textContent = 'Please Enter Valid Email';
    return '';
  }
  const data = {
    email,
    password,
  };
  request('/login', 'POST', data)
    .then(res => res.json())
    .then((res) => {
      if (res.error) {
        error.textContent = res.error;
      } else {
        window.location.href = '/my-wallet';
      }
    })
    .catch(() => {
      error.textContent = 'Cant Find the user';
    });
});
