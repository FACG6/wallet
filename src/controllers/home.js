exports.get = (req, res) => {
  res.render('home', { title: 'Wallet', stylesheet: '/css/home.css', layout: 'home' });
};
