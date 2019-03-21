const tape = require('tape');
const supertest = require('supertest');
const app = require('../src/app');

tape('Test pre-tour page', (test) => {
  supertest(app)
    .get('/my-wallet')
    .expect(200)
    .expect('content-type', 'text/html; charset=utf-8')
    .end((err, response) => {
      if (err) test.error(err);
      test.equal(response.text.includes('<title>pre-tour</title>'), true, 'the title of page must be pre-tour');
      test.end();
    });
});

tape('Test My Wallet page', (test) => {
  supertest(app)
    .get('/my-wallet')
    .expect(200)
    .set('Cookie', ['jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTUzMTczNTM4fQ.j3x58-Yw23kHMzR2bqZb1AYxgVFyoss1G-UWeqLcDs0'])
    .expect('content-type', 'text/html; charset=utf-8')
    .end((err, response) => {
      if (err) test.error(err);
      test.equal(response.text.includes('<title>My Wallet</title>'), true, 'the title of page must be My Wallet');
      test.end();
    });
});

tape('testing home route; case1: user has no cookie', (assert) => {
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

tape('testing home route; case2: user has a cookie', (assert) => {
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

tape('testing plan route; case1: user has no cookie', (assert) => {
  supertest(app)
    .get('/my-wallet/plan')
    .expect(200)
    .expect('content-type', /html/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.equal(response.text.includes('<title>Wallet || Plan</title>'), true, 'Should incllude title"Wallet || Plan"');
      assert.end();
    });
});

tape('testing plan route; case2: user has a cookie', (assert) => {
  supertest(app)
    .get('/my-wallet/plan')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBsYW5JZCI6MiwiaWF0IjoxNTUzMTA0NDU3fQ.y_qqXnk-64bgghpDSHaExVYmkuOoXOeON2XO4XRQPZ0')
    .expect(302)
    .expect('content-type', /text\/plain/)
    .expect('location', '/my-wallet')
    .end((err) => {
      if (err) assert.error(err);
      assert.end();
    });
});
