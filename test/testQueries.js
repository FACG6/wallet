const tape = require('tape');
const build = require('../src/database/dbBuild');
const selectPlan = require('../src/database/queries/selectPlan');

tape('test select plan', (test) => {
  build()
    .then(() => selectPlan.select(1))
    .then((result) => {
      test.equal(result.rowCount, 3, 'the number of rows must be 0');
      test.equal(result.rows[0].amount, 200, 'the amount of first expenses is 200');
      test.end();
    })
    .catch((error) => {
      test.error(error);
    });
});

tape.onFinish(() => {
  process.exit(0);
});
