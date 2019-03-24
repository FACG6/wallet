/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* global Swal */

const loginError = document.getElementById('login_error');

// Popup to Login: Not finished Yet //
function renderLogin() {
  Swal.fire({
    title: 'LOGIN',
    html: '<label>Email</lable><br><input id="email" name="email" type="email" value=""><br><label>Password</label><br><input type="password" type="text" value="" id="password"><br><div id="login_error"></div><br>Don\'t have an account? <a href="/signup">Sign up</a>',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Login!',
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
          if (result.state === 'success') window.location.href = '/my-wallet/plan/add-income';
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
