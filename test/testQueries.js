const tape = require('tape');
const { checkEmail } = require('../src/database/queries/checkEmail');
const { insert } = require('../src/database/queries/insertUser');
const selectPlan = require('../src/database/queries/selectPlan');
const build = require('../src/database/dbBuild');

tape('test of check email query', (test) => {
  build()
    .then(() => checkEmail('khader@khader.com'))
    .then((result) => {
      test.deepEqual(result.rows, [], 'the result must empty');
    })
    .catch((err) => {
      test.error(err);
    });
  test.end();
});

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
      test.end();
    });
});

tape('test of insert user', (test) => {
  build()
    .then(() => insert('khader', 'khader@khader.com', 'khader'))
    .then((result) => {
      test.equal(result.rows[0].username, 'khader', 'the username must be khader');
    })
    .catch((err) => {
      test.error(err);
    });
  test.end();
});
