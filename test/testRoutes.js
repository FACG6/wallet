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
