exports.server = (err, req, res, next) => {
  res.status(500).render('error', {
    layout: 'error',
    stylesheet: 'error.css',
    imgUrl: 'https://cdn.dribbble.com/users/890487/screenshots/3355813/500-error-.jpg',
  });
};

exports.client = (req, res) => {
  res.status(404).render('error', {
    imgUrl: 'http://salmasnli.com/Content/Common/404.png',
    layout: 'error',
    stylesheet: 'error.css',
  });
};
