const addBtn = document.querySelectorAll('.profile__expenses-add-ico');
const start = new Date(document.querySelector('.start').textContent);
const end = new Date(document.querySelector('.end').textContent);
const totalExp = document.querySelector('.totalExp');
const income = document.querySelector('.income');
const mainProgress = document.querySelector('#mainProgress');

addBtn.forEach((add) => {
  add.addEventListener('click', (e) => {
    const parent = e.target.parentElement.parentElement;
    parent.classList.add('selected');

    const total = parent.querySelector('.total');
    const amount = parent.querySelector('.amount');
    const progress = parent.querySelector('progress');

    const catId = e.target.id;
    Swal.fire({
      title: 'Add new expenses',
      html: '<div class="form"><div><span>Price</span><input type="number" id="price" placeholder="price" step="0.01"></div>'
          + '<div><span>Date</span><input type="date" id="date"></div>'
          + '<div><p>Description<p><textarea id="desc" placeholder="optional"></textarea></div> <p class="error"></p></div>',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Add',
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const price = document.querySelector('#price').value.trim();
        const date = document.querySelector('#date').value.trim();
        const toDate = new Date(date);
        const description = document.querySelector('#desc').value.trim();
        const error = document.querySelector('.error');
        // validation
        if (!price || !date) {
          error.textContent = 'Please fill the price and date';
          return false;
        }
        if (!(/\d+/.test(price)) || price < 0.00 || !(/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date)) || description.search(/<[^>]*script/) !== -1) {
          error.textContent = 'ensure you put correct value please';
          return false;
        }
        if (!(toDate >= start && toDate <= end)) {
          error.textContent = 'ensure you put date in the period of your income';
          return false;
        }
        return {
          catId, price, date, description,
        };
      },
    })
      .then((result) => {
        if (result.dismiss) {
          throw new Error(result.dismiss);
        } else {
          return request('/my-wallet', 'POST', result.value);
        }
      })
      .then(result => result.json())
      .then((response) => {
        parent.classList.remove('selected');
        if (response.error) {
          fireToast('error', response.error);
        } else {
          calculateExp(total, response.price, progress, amount);
          calculateExp(totalExp, response.price, mainProgress, income);
          comapreColor(progress);
          comapreColor(mainProgress);

          if (Number(total.textContent) > Number(amount.textContent)) {
            fireToast('warning', 'Add Successfully but the expenses exceed the plan of this category');
          } else {
            fireToast('success', 'Add Successfully');
          }
        }
      })
      .catch((error) => {
        parent.classList.remove('selected');
        if (error.message !== 'cancel' && error.message !== 'close') {
          fireToast('error', 'Some thing error try again');
        }
      });
  });
});
