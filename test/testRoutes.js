const tape = require('tape');
const supertest = require('supertest');
const app = require('../src/app');
const runBuild = require('../src/database/dbBuild');

tape('Test pre-tour page', (test) => {
  supertest(app)
    .get('/my-wallet')
    .expect(200)
    .expect('content-type', 'text/html; charset=utf-8')
    .end((err, response) => {
      if (err) test.error(err);
      test.equal(response.text.includes('<title>Pre-tour</title>'), true, 'the title of page must be pre-tour');
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
    .get('/my-wallet/plan/add-income')
    .expect(200)
    .expect('content-type', /html/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.equal(response.text.includes('<title>Wallet || Plan</title>'), true, 'Should include title "Wallet || Plan"');
      assert.end();
    });
});

tape('testing plan route; case3: user has a cookie', (assert) => {
  supertest(app)
    .get('/my-wallet/plan/add-income')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInVzZXJuYW1lIjoiaXNyYWEiLCJpYXQiOjE1NTMxODY2NTV9.4vJRACp1K0sALHvcTCH9lidKtdUDLQI3r_B4V4AS_K0')
    .expect(200)
    .expect('content-type', /html/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.equal(response.text.includes('<title>Wallet || Plan</title>'), true, 'Should include title "Wallet || Plan"');
      assert.end();
    });
});

tape('testing plan route; case3: user has a cookie and planId in the token', (assert) => {
  supertest(app)
    .get('/my-wallet/plan/add-income')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBsYW5JZCI6MiwiaWF0IjoxNTUzMTA0NDU3fQ.y_qqXnk-64bgghpDSHaExVYmkuOoXOeON2XO4XRQPZ0')
    .expect(200)
    .expect('content-type', /html/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.equal(response.text.includes('<title>Wallet || Plan</title>'), true, 'Should include title "Wallet || Plan"');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-income" route; case4: cookie is modified', (assert) => {
  supertest(app)
    .get('/my-wallet/plan/add-income')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCpXVCJ9.eyJ1c2VySWQiOjEsInBsYW5JZCI6MiwiaWF0IjoxNTUzMTA0NDU3fQ.y_qqXnk-64bgghpDSHaExVYmkuOoXOeON2XO4XRQPZ0')
    .expect(302)
    .expect('location', '/')
    .end((err) => {
      if (err) assert.error(err);
      assert.end();
    });
});
tape.onFinish(() => {
  process.exit(0);
});

tape('testing "/my-wallet/plan/add-income": POST REQUEST; case1: No cookie', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-income')
    .send({ income: 12000, starting: '2019/02/29', ending: '2019/03/29' })
    .expect(401)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, { state: 'ERR', reason: 'login' }, 'ERR: login');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-income": POST REQUEST; case2: Has cookie and PlanId', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-income')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBsYW5JZCI6MiwiaWF0IjoxNTUzMTA0NDU3fQ.y_qqXnk-64bgghpDSHaExVYmkuOoXOeON2XO4XRQPZ0')
    .send({
      income: 12000,
      starting: '2019/02/29',
      ending: '2019/03/29',
    })
    .expect(401)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, {
        state: 'ERR',
        reason: 'HasPlan',
      }, 'ERR: HasPlan');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-income": POST REQUEST; case3: Modified Cookie', (assert) => {
  runBuild()
    .then(supertest(app)
      .post('/my-wallet/plan/add-income')
      .set('Cookie', 'jwt=eyJhbGciIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBsYW5JZCI6MiwiaWF0IjoxNTUzMTA0NDU3fQ.y_qqXnk-64bgghpDSHaExVYmkuOoXOeON2XO4XRQPZ0')
      .send({
        income: 12000,
        starting: '2019/02/29',
        ending: '2019/03/29',
      })
      .expect(302)
      .expect('location', '/')
      .end((err) => {
        if (err) assert.error(err);
        assert.end();
      }))
    .catch((err) => {
      assert.error(err);
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-income": POST REQUEST; case4: Logged User with cookie but no planId', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-income')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI3OTM2NH0.LlZmUN5oJLwTKPpepg1bkItZdKleElNRCBrtqpElsYc')
    .send({
      income: '12000',
      starting: '2019/02/28',
      ending: '2019/03/29',
    })
    .expect(200)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, {
        login: true,
        state: 'success',
      }, 'Success');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-income": POST REQUEST; case5: Validation 1', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-income')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI3OTM2NH0.LlZmUN5oJLwTKPpepg1bkItZdKleElNRCBrtqpElsYc')
    .send({
      income: '',
      starting: '2019/02/28',
      ending: '2019/03/29',
    })
    .expect(200)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, {
        state: 'ERR',
        reason: 'Empty',
      }, 'ERR: Empty');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-income": POST REQUEST; case6: Validation 3', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-income')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI3OTM2NH0.LlZmUN5oJLwTKPpepg1bkItZdKleElNRCBrtqpElsYc')
    .send({
      income: '12000',
      starting: '2019',
      ending: '2019/03/29',
    })
    .expect(200)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, {
        state: 'ERR',
        reason: 'Invalid',
        errMsg: 'Date is invalid',
      }, 'ERR: Invalid Date');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-income": POST REQUEST; case6: Validation 4', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-income')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI3OTM2NH0.LlZmUN5oJLwTKPpepg1bkItZdKleElNRCBrtqpElsYc')
    .send({
      income: '12000',
      starting: '2018/05/28',
      ending: '2018/03/29',
    })
    .expect(200)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, {
        state: 'ERR',
        reason: 'Invalid',
        errMsg: 'From date should be greater than To date',
      }, 'ERR: Invalid Date');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-income": POST REQUEST; case6: Validation 5', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-income')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI3OTM2NH0.LlZmUN5oJLwTKPpepg1bkItZdKleElNRCBrtqpElsYc')
    .send({
      income: '12000',
      starting: '2019/01/19',
      ending: '2019/02/19',
    })
    .expect(200)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, {
        state: 'ERR',
        reason: 'Invalid',
        errMsg: 'To date should be greater than today',
      }, 'ERR: Invalid Date');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-income": POST REQUEST; case6: Date Format is different', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-income')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI3OTM2NH0.LlZmUN5oJLwTKPpepg1bkItZdKleElNRCBrtqpElsYc')
    .send({
      income: '12000',
      starting: '2019-03-19',
      ending: '2019-04-19',
    })
    .expect(200)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.equal(response.headers['set-cookie'][0].includes('session'), true, 'contains a session cookie');
      assert.deepEqual(response.body, {
        login: true,
        state: 'success',
      }, 'Success');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-plan" route; case2: has cookie, no planId', (assert) => {
  supertest(app)
    .get('/my-wallet/plan/add-plan')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI3OTM2NH0.LlZmUN5oJLwTKPpepg1bkItZdKleElNRCBrtqpElsYc')
    .expect(200)
    .expect('content-type', /html/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.equal(response.text.includes('<title>Wallet || Plan</title>'), true, 'Should have title: "Wallet || Plan" ');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-plan" route; POST REQUEST: case1, no cookie', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-plan')
    .send({
      categories: [1, 2, 3],
      amount: [100, 200, 400],
    })
    .expect(401)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, {
        state: 'ERR',
        reason: 'login',
      }, 'ERR: login');
      assert.end();
    });
});
tape('testing "/my-wallet/plan/add-plan" route; POST REQUEST: case2, has a session cookie', (assert) => {
  runBuild()
    .then(supertest(app)
      .post('/my-wallet/plan/add-plan')
      .set('Cookie', ['jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzU4OTMxM30.f26Q09cdyRcQ5h-0M3-Q6FpZsEC8gxxNJA_buWKs_9o;session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmNvbWUiOiIxMjAwMCIsInN0YXJ0RGF0ZSI6IjIwMTktMDItMjgiLCJlbmREYXRlIjoiMjAxOS0wMy0yOSIsImlhdCI6MTU1MzI4NzkwMH0.fLi0iz1piSTDs1i7O6ebFjAZ_aZNlHH_1wL2-MJaoEs'])
      .send({
        categories: ['1'],
        budgets: ['100'],
      })
      .expect(200)
      .expect('content-type', /application\/json/)
      .end((err, response) => {
        if (err) assert.error(err);
        assert.deepEqual(response.body, {
          login: true,
          state: 'success',
        }, 'Success');
        assert.end();
      }))
    .catch();
});

tape('testing "/my-wallet/plan/add-plan" route; POST REQUEST: case3, No sesssion', (assert) => {
  runBuild()
    .then(supertest(app)
      .post('/my-wallet/plan/add-plan')
      .set('Cookie', ['jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI4OTA1OX0.jHDeiu5RLT63P21Y326r907J06CAROGm0ESF_qrBVuQ'])
      .send({
        categories: ['1'],
        budgets: ['100'],
      })
      .expect(401)
      .expect('content-type', /application\/json/)
      .end((err, response) => {
        if (err) assert.error(err);
        assert.deepEqual(response.body, {
          state: 'ERR',
          reason: 'No Income',
        }, 'ERR:No Income');
        assert.end();
      }))
    .catch();
});

tape('testing "/my-wallet/plan/add-plan": POST REQUEST; case5: Validation 1', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-plan')
    .set('Cookie', ['jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI4OTA1OX0.jHDeiu5RLT63P21Y326r907J06CAROGm0ESF_qrBVuQ;session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmNvbWUiOiIxMjAwMCIsInN0YXJ0RGF0ZSI6IjIwMTktMDItMjgiLCJlbmREYXRlIjoiMjAxOS0wMy0yOSIsImlhdCI6MTU1MzI4NzkwMH0.fLi0iz1piSTDs1i7O6ebFjAZ_aZNlHH_1wL2-MJaoEs'])
    .send({
      categories: [],
      budgets: [],
    })
    .expect(200)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, {
        state: 'ERR',
        reason: 'Empty',
      }, 'ERR: Empty');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-plan": POST REQUEST; case5: Validation 2', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-plan')
    .set('Cookie', ['jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI4OTA1OX0.jHDeiu5RLT63P21Y326r907J06CAROGm0ESF_qrBVuQ;session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmNvbWUiOiIxMjAwMCIsInN0YXJ0RGF0ZSI6IjIwMTktMDItMjgiLCJlbmREYXRlIjoiMjAxOS0wMy0yOSIsImlhdCI6MTU1MzI4NzkwMH0.fLi0iz1piSTDs1i7O6ebFjAZ_aZNlHH_1wL2-MJaoEs'])
    .send({
      categories: ['1'],
      budgets: ['-10'],
    })
    .expect(200)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, {
        state: 'ERR',
        reason: 'Invalid',
      }, 'ERR: Invalid');
      assert.end();
    });
});

tape('testing "/my-wallet/plan/add-plan": POST REQUEST; case5: Validation 3', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-plan')
    .set('Cookie', ['jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzI4OTA1OX0.jHDeiu5RLT63P21Y326r907J06CAROGm0ESF_qrBVuQ;session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmNvbWUiOiIxMjAwMCIsInN0YXJ0RGF0ZSI6IjIwMTktMDItMjgiLCJlbmREYXRlIjoiMjAxOS0wMy0yOSIsImlhdCI6MTU1MzI4NzkwMH0.fLi0iz1piSTDs1i7O6ebFjAZ_aZNlHH_1wL2-MJaoEs'])
    .send({
      categories: ['1', '2'],
      budgets: ['1000'],
    })
    .expect(200)
    .expect('content-type', /application\/json/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.deepEqual(response.body, {
        state: 'ERR',
        reason: 'Invalid',
      }, 'ERR: Invalid');
      assert.end();
    });
});
