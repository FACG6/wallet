exports.get = (req, res) => {
  res.render('home', { stylesheet: '/css/home.css', layout: 'home' });
};
