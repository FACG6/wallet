/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
const checkbox = document.querySelectorAll('.plan_form--checkbox');
const input = document.querySelectorAll('.plan_form--input');
const addButton = document.querySelector('#addButton');
const error = document.getElementById('error');

// Check Fetch Response //
function checkResponse(result) {
  if (result.state === 'ERR') {
    if (result.reason === 'login') renderLogin();
    else if (result.reason === 'HasPlan') renderError('You\'ve already made a plan');
    else if (result.reason === 'Empty') renderError('Select a category or fill empty fields');
    else if (result.reason === 'Invalid') renderError('Invalid Values. Enter numbers only!');
    else if (result.reason === 'No Income') renderIncomeSwal();
    else renderError("Oops! Something wen't wrong. Try another time!");
  } else renderSuccess();
}

// Render Error //
function renderError(message) {
  error.textContent = message;
}

// Render Success Popup//
function renderSuccess() {
  Swal.fire({
    title: 'Success',
    text: 'Your plan has been added successfully!',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Okay',
  }).then((result) => {
    if (result.value) {
      window.location.href = '/my-wallet';
    }
  });
}

// Render No Income Popup//
function renderIncomeSwal() {
  Swal.fire({
    title: 'Warning',
    type: 'Warning',
    text: 'You haven\'t yet set your income. Add your income now!',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Add',
  }).then((result) => {
    if (result.value) {
      window.location.href = '/my-wallet/plan/add-income';
    }
  });
}

// Event Listener to each checkbox to toggle disabled attribute from inputs //
for (let i = 0; i < checkbox.length; i++) {
  checkbox[i].addEventListener('click', () => {
    const category = input[i];
    category.placeholder = '';
    category.value = '';
    category.toggleAttribute('disabled');
    category.classList.toggle('active');
  });
}

// Event Listener for Add Button //
addButton.addEventListener('click', (e) => {
  e.preventDefault();
  const checkedInputs = document.querySelectorAll('.active');
  const categories = [];
  const budgets = [];

  if (checkedInputs.length === 0) return renderError('Please select some categories for your plan!');

  // To collect all values of inputs that are not disabled //
  checkedInputs.forEach((checked) => {
    if (!checked.value) {
      error.textContent = '';
      checked.placeholder = 'Enter a budget';
      return;
    }
    if (!validator.isFloat(checked.value) || checked.value <= 0) {
      error.textContent = '';
      checked.value = '';
      checked.placeholder = 'Invalid value';
      return;
    }
    // Push categories and budgets to the arrays //
    checked.placeholder = '';
    categories.push(checked.getAttribute('catId'));
    budgets.push(checked.value);
  });

  // Send Ajax request in case all inputs are filled //
  if (checkedInputs.length === categories.length) {
    request('/my-wallet/plan/add-plan', 'POST', { categories, budgets })
      .then(response => response.json())
      .then(result => checkResponse(result))
      .catch(() => renderError('Internal Server Error!'));
  } else renderError('Fill Empty Fields');
});
