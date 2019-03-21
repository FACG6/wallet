module.exports = (req, res, next) => {
  if (!req.plan) {
    req.plan = 'budget';
    req.stylesheet = '/css/budget.css';
    req.script = '/js/budget.js';
    next();
  } else {
    req.stylesheet = '/css/plan.css';
    req.script = '/js/plan.js';
    next();
  }
};
