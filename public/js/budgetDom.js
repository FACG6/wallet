/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */

const nextButton = document.getElementById('nextButton');
const error = document.getElementById('error');

nextButton.addEventListener('click', (e) => {
  e.preventDefault();
  const income = document.getElementById('budget').value.trim();
  const starting = document.getElementById('starting').value.trim();
  const ending = document.getElementById('ending').value.trim();

  // Validation //
  if (!income || !starting || !ending) renderError('All Fields are required');
  else if (!validator.isFloat(income) || income <= 0) renderError('Income is invalid');
  else if (new Date(ending) <= new Date(starting)) renderError('Last Date should be greater than first date');
  else if (new Date(ending) <= new Date()) renderError('Last date should be greater than today');
  else {
    const reqBody = {
      income,
      starting,
      ending,
    };
    // Fetch Request //
    request('/my-wallet/plan/add-income', 'POST', reqBody)
      .then(response => response.json())
      .then((result) => {
        if (result.state === 'ERR') {
          if (result.reason === 'login') renderLogin();
          else if (result.reason === 'HasPlan') renderError('You\'ve already made a plan');
          else if (result.reason === 'Empty') renderError('Select a category or fill empty fields');
          else if (result.reason === 'Invalid') renderError(result.errMsg);
          else renderError('Oops, something went wrong. Try another time');
        }
        if (result.state === 'success') window.location.href = '/my-wallet/plan/add-plan';
      })
      .catch(() => {
        error.textContent = 'Oops, something went wrong. Try again or another trime';
      });
  }
});

function renderError(ms) {
  error.textContent = ms;
}
