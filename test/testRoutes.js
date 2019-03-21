const test = require('tape');
const supertest = require('supertest');

const app = require('../src/app');

test('testing home route; case1: user has no cookie', (assert) => {
  supertest(app)
    .get('/')
    .expect(200)
    .expect('content-type', /html/)
    .end((err, response) => {
      if (err) assert.error(err);
      else {
        assert.equal(response.text.includes('<title>Wallet</title>'), true, 'Should include title "Wallet"');
        assert.end();
      }
    });
});

test('testing home route; case2: user has a cookie', (assert) => {
  supertest(app)
    .get('/')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBsYW5JZCI6MiwiaWF0IjoxNTUzMTA0NDU3fQ.y_qqXnk-64bgghpDSHaExVYmkuOoXOeON2XO4XRQPZ0')
    .expect(302)
    .expect('location', '/my-wallet')
    .end((err) => {
      if (err) assert.error(err);
      assert.end();
    });
});
