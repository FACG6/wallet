exports.getPlan = (req, res) => {
  const { plan, stylesheet, script } = req;
  res.render(plan, {
    title: 'Wallet || Plan',
    stylesheet,
    script,
  });
};
