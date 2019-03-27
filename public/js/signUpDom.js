const signUp = document.getElementById('sign-up');
const signupContainer = document.querySelector('.signup-container');

signUp.addEventListener('click', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  const errorMessage = document.querySelector('.error');
  if (errorMessage) {
    errorMessage.remove();
  }
  const error = document.createElement('p');
  error.classList.add('error');

  // ------ Check All Fileds ------
  if (!email || !username || !password || !confirmPassword) {
    error.textContent = 'Please Fill All Fileds';
    signupContainer.insertBefore(error, signUp);
    return '';
  }

  // ------ Check Username ------
  if (!validator.isAlphanumeric(username)) {
    error.textContent = 'Invalid username pattern !';
    signupContainer.insertBefore(error, signUp);
    return '';
  }

  // ------ Check password and confirm ------
  if (!(password === confirmPassword)) {
    error.textContent = 'Passwords are not match !';
    signupContainer.insertBefore(error, signUp);
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
        signupContainer.insertBefore(error, signUp);
      } else {
        window.location.href = '/my-wallet';
      }
    })
    .catch(() => {
      error.textContent = 'Can not send data !';
    });
});
