const loginError = document.getElementById('login_error');

// Popup to Login: Not finished Yet //
function renderLogin(location) {
  Swal.fire({
    title: 'LOGIN',
    text: 'Please login to your account to start adding your plan!',
    html: '<div class="login--form"><div class="form--item"><label class="login--label" for="email">Email</label><input type="email" class="login--input" id="email" name="email" type="email" value=""></div><div class="form--item"><label for="password" class="login--label">Password</label><input type="password" class="login--input" type="password" type="text" value="" id="password"></div><div class="form--item"><p>Don\'t have an account? <a class="login--anchor" href="/signup">Sign up</a></p></div></div>',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Login',
    customClass: {
      popup: 'popup-custom',
      actions: 'actions-class',
      confirmButton: 'swal2--button confirm-button-custom',
      cancelButton: 'swal2--button',
    },
  }).then((confirm) => {
    if (confirm.value) {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      // Validation?? //
      request('/login', 'POST', {
        email,
        password,
      })
        // Will be edited after making login route. //
        .then(response => response.json())
        .then((result) => {
          if (result.state === 'success' && location) window.location.href = location;
          if (result.state === 'ERR') loginError.textContent = result.errorMsg;
        })
        .catch(() => {
          loginError.textContent = 'Oops, something went wrong. Try another time.';
        });
    }
  });
}

// Fetch Function //
function request(endpoint, method, reqBody) {
  return fetch(endpoint, {
    method,
    body: JSON.stringify(reqBody),
    headers: {
      'content-type': 'application/json',
    },
  });
}
// Generic Swal //
function renderSwal(location, type, title, text, confirm) {
  Swal.fire({
    title,
    type,
    text,
    confirmButtonText: confirm,
  }).then((result) => {
    if (result.value && location) {
      window.location.href = location;
    }
  });
}

function calculateExp(totalExp, price, progress, amount) {
  totalExp.textContent = (Number(totalExp.textContent) + price).toFixed(2);
  progress.value = ((totalExp.textContent * 100) / amount.textContent).toFixed(2);
}

function comapreColor(progress) {
  if (progress.value > 70) {
    progress.classList.remove(progress.classList[2]);
    progress.classList.add('red');
  } else if (progress.value > 50) {
    progress.classList.remove(progress.classList[2]);
    progress.classList.add('orange');
  } else {
    progress.classList.remove(progress.classList[2]);
    progress.classList.add('green');
  }
}

function fireToast(text) {
  Swal.fire({
    position: 'top-end',
    showConfirmButton: false,
    timer: 10000,
    showCloseButton: true,
    text,
    customClass: { popup: 'popup-add' },
  });
}
