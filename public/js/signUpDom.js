const signUp = document.getElementById('sign-up');
const error = document.getElementById('signupError');

signUp.addEventListener('click', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  error.textContent = '';

  // ------ Check All Fileds ------
  if (!email || !username || !password || !confirmPassword) {
    error.textContent = 'Please Fill All Fileds';
    return '';
  }

  // ------ Check Username ------
  if (!validator.isAlphanumeric(username)) {
    error.textContent = 'Invalid username pattern !';
    return '';
  }

  // ------ Check password and confirm ------
  if (!(password === confirmPassword)) {
    error.textContent = 'Passwords are not match !';
    return '';
  }

  const data = {
    email,
    username,
    password,
  };

  request('/sign-up', 'POST', data)
    .then(response => response.json())
    .then((response) => {
      if (response.error) {
        error.textContent = response.error;
      } else {
        window.location.href = '/my-wallet';
      }
    })
    .catch(() => {
      error.textContent = 'Can not send data !';
    });
});
