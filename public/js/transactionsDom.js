const deleteIcon = document.querySelectorAll('.delete');

deleteIcon.forEach((element) => {
  element.addEventListener('click', (e) => {
    const { id } = e.target;
    Swal.fire({
      title: 'Delete Expense',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      preConfirm: () => ({ id }),
    })
      .then((result) => {
        if (result.dismiss) {
          throw new Error(result.dismiss);
        } else {
          const url = window.location.href.split('/');
          const catId = url[url.length - 1];
          return request(`/my-wallet/transactions/${catId}`, 'DELETE', result.value);
        }
      })
      .then(result => result.json())
      .then((result) => {
        if (result.error) {
          fireToast(result.error);
        } else {
          e.target.parentElement.parentElement.parentElement.remove();
          fireToast('Delete Successfully');
        }
      })
      .catch((error) => {
        if (error.message !== 'cancel' && error.message !== 'close') {
          fireToast('Some thing error try again');
        }
      });
  });
});
