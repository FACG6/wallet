exports.get = (req, res) => {
  res.render('home', { title: 'Wallet', stylesheet: 'home.css', layout: 'home' });
};
