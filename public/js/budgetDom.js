/* eslint-disable no-undef */

const nextButton = document.getElementById('nextButton');
const error = document.getElementById('error');

nextButton.addEventListener('click', (e) => {
  e.preventDefault();
  const income = document.getElementById('budget').value.trim();
  const starting = document.getElementById('starting').value.trim();
  const ending = document.getElementById('ending').value.trim();

  // Validation //
  if (!income || !starting || !ending) error.textContent = 'All Fields are required';
  else if (!validator.isFloat(income) || income <= 0) error.textContent = 'Income is invalid';
  else if (new Date(ending) <= new Date(starting)) error.textContent = 'Second Date should be greater than first date';
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
        if (!result.login) renderLogin(); // Check if the user is logged in //
        if (result.state === 'ERR') error.textContent = result.errMsg;
        if (result.state === 'success') window.location.href = '/my-wallet/plan/add-plan';
      })
      .catch(() => {
        error.textContent = 'Oops, something went wrong. Try again or another trime';
      });
  }
});
