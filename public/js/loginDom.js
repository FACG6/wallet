const send = document.getElementById('login');
const form = document.getElementById('form');

send.addEventListener('click', (e) => {
  e.preventDefault();
  const errorMessage = document.querySelector('.error');
  if (errorMessage) {
    errorMessage.remove();
  }
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const error = document.createElement('p');
  error.classList.add('error');
  if (!password || !email) {
    error.textContent = 'Please Fill All Fields';
    form.insertBefore(error, send);
    return '';
  }
  if (!validator.isEmail(email)) {
    error.textContent = 'Please Enter Valid Email';
    form.insertBefore(error, send);
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
        form.insertBefore(error, send);
      } else {
        window.location.href = '/my-wallet';
      }
    })
    .catch(() => {
      error.textContent = 'Cant Find the user';
    });
});
