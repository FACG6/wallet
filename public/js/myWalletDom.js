const addBtn = document.querySelectorAll('.profile__expenses-add-ico');

addBtn.forEach((add) => {
  add.addEventListener('click', (e) => {
    const catId = e.target.id;
    swal({
      title: 'Add new expenses',
      html: '<div class="form"><div><span>Price</span><input type="number" id="price" placeholder="price"></div>'
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
        const description = document.querySelector('#desc').value.trim();
        const error = document.querySelector('.error');
        if (!price || !date) {
          error.textContent = 'Please fill the price and date';
          return false;
        }
        if (!(/\d+/.test(price)) || !(/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date)) || description.search(/<[^>]*script/) !== -1) {
          error.textContent = 'ensure you put correct value please';
          return false;
        }
        return {
          catId, price, date, description,
        };
      },
    })
      .then((result) => {
        console.log(result.value);
        if (result.value) {
          return fetch('/my-wallet', {
            method: 'POST',
            body: JSON.stringify(result.value),
            headers: { 'Content-Type': 'application/json' },
          });
        }
      })
      .then(result => result.json())
      .then(() => {
        // to handle income data from the backend
      })
      .catch(() => {
        swal({
          title: 'there is error please try again',
          type: 'error',
        });
      });
  });
});
