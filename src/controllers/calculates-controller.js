const controller = {};

controller.calculateSalary = (req, res, next) => {
  res.send('<h1>Calculate Salary</h1>');
}


module.exports = controller;
