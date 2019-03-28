const loginError = document.getElementById('login_error');

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
    confirmButtonColor: '#108A40',
  }).then((result) => {
    if (result.value && location) {
      window.location.href = location;
    }
  });
}

// Render Login // 

function renderLogin() {
  renderSwal('/login', null, 'Login!', 'Please login to your account!', 'Login');
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
