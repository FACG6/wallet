const tape = require('tape');
const supertest = require('supertest');
const {
  sign,
} = require('jsonwebtoken');
const build = require('../src/database/dbBuild');

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

tape('test add Expenses from /my-wallet route, case1 : there is no cookies', (test) => {
  supertest(app)
    .post('/my-wallet')
    .send({
      catId: '1',
      price: '50',
      date: '2019-03-01',
      description: '',
    })
    .expect(302)
    .expect('location', '/')
    .end((error) => {
      if (error) test.error(error);
    });
  test.end();
});

tape('test add Expenses from /my-wallet route, case2 : there is empty income data expect description is optional', (test) => {
  supertest(app)
    .post('/my-wallet')
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJzaG9yb3VxIiwic3RhcnQiOiIyMDE5LTAzLTAxIiwiZW5kIjoiMjAxOS0wMy0zMCIsImNhdGVnb3J5SWQiOlsyLDMsMV0sImlhdCI6MTU1MzQ0Nzg4NX0.c6o_OsIkQwv0DbsNHiweW-v7VDvYEOH-3Grke-eiVrg')
    .send({
      catId: '1',
      price: '',
      date: '2019-03-01',
      description: '',
    })
    .expect(200)
    .end((error, response) => {
      if (error) test.error(error);
      test.equal(response.text, '{"error":"Please fill all fields"}', 'the response must be "Please fill all fields"');
    });
  test.end();
});

tape('test add Expenses from /my-wallet route, case3 : all fields is filled but the date not between the period of budget', (test) => {
  supertest(app)
    .post('/my-wallet')
    .send({
      catId: '1',
      price: '50',
      date: '2019-02-01',
      description: '',
    })
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJzaG9yb3VxIiwic3RhcnQiOiIyMDE5LTAzLTAxIiwiZW5kIjoiMjAxOS0wMy0zMCIsImNhdGVnb3J5SWQiOlsyLDMsMV0sImlhdCI6MTU1MzQ0Nzg4NX0.c6o_OsIkQwv0DbsNHiweW-v7VDvYEOH-3Grke-eiVrg')
    .expect(200)
    .end((error, response) => {
      if (error) test.error(error);
      test.equal(response.text, '{"error":"Please enter date between 2019-03-01 and 2019-03-30"}', 'the response must be {"error":"Please enter date between 2019-03-01 and 2019-03-30"}');
    });
  test.end();
});

tape('test add Expenses from /my-wallet route, case4 : all fields is filled but the category not in the plan', (test) => {
  supertest(app)
    .post('/my-wallet')
    .send({
      catId: '6',
      price: '50',
      date: '2019-03-01',
      description: '',
    })
    .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGxhbklkIjoxLCJzdGFydCI6IjIwMTktMDMtMDEiLCJlbmQiOiIyMDE5LTAzLTMxIiwiY2F0ZWdvcmllc0lkIjpbMSwzLDJdLCJpYXQiOjE1NTM1NDIxNDJ9.67R2G5zPBlrHgPc9Or-w1D1QpNCya_2dbKDHzi0JC-o')
    .expect(200)
    .end((error, response) => {
      if (error) test.error(error);
      test.equal(response.text, '{"error":"Sorry this category not in your budget"}', 'the response must be {"error":"Sorry this category not in your budget"}');
    });
  test.end();
});

tape('test add Expenses from /my-wallet route, case5 : all fields is filled with correct data', (test) => {
  runBuild()
    .then(() => {
      supertest(app)
        .post('/my-wallet')
        .send({
          catId: '1',
          price: '50',
          date: '2019-03-02',
          description: '',
        })
        .set('Cookie', 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGxhbklkIjoxLCJzdGFydCI6IjIwMTktMDMtMDEiLCJlbmQiOiIyMDE5LTAzLTMxIiwiY2F0ZWdvcmllc0lkIjpbMSwzLDJdLCJpYXQiOjE1NTM1NDIxNDJ9.67R2G5zPBlrHgPc9Or-w1D1QpNCya_2dbKDHzi0JC-o')
        .expect(200)
        .end((error, response) => {
          if (error) test.error(error);
          test.equal(response.text, '{"price":50}', 'the response must be {"price":50}');
        });
      test.end();
    })
    .catch((error) => {
      test.error(error);
      test.end();
    });
});

tape('testing "/my-wallet/plan/add-income": POST REQUEST; case1: No cookie', (assert) => {
  supertest(app)
    .post('/my-wallet/plan/add-income')
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
        reason: 'login',
      }, 'ERR: login');
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
// tape('testing "/my-wallet/plan/add-plan" route; POST REQUEST: case2, has a session cookie', (assert) => {
//   runBuild()
//     .then(supertest(app)
//       .post('/my-wallet/plan/add-plan')
//       .set('Cookie', ['jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJpc3JhYSIsImlhdCI6MTU1MzU4OTMxM30.f26Q09cdyRcQ5h-0M3-Q6FpZsEC8gxxNJA_buWKs_9o;session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmNvbWUiOiIxMjAwMCIsInN0YXJ0RGF0ZSI6IjIwMTktMDItMjgiLCJlbmREYXRlIjoiMjAxOS0wMy0yOSIsImlhdCI6MTU1MzI4NzkwMH0.fLi0iz1piSTDs1i7O6ebFjAZ_aZNlHH_1wL2-MJaoEs'])
//       .send({
//         categories: ['1'],
//         budgets: ['100'],
//       })
//       .expect(200)
//       .expect('content-type', /application\/json/)
//       .end((err, response) => {
//         if (err) assert.error(err);
//         assert.deepEqual(response.body, {
//           login: true,
//           state: 'success',
//         }, 'Success');
//         assert.end();
//       }))
//     .catch((error) => {
//       assert.error(error);
//       assert.end();
//     });
// });

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
    .catch((error) => {
      assert.error(error);
      assert.end();
    });
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

tape('testing /my-wallet/transactions/1; case 1: user is not logged in', (assert) => {
  supertest(app)
    .get('/my-wallet/transactions/1')
    .expect(302)
    .expect('location', '/')
    .end((err) => {
      if (err) assert.error(err);
      assert.end();
    });
});

tape('testing /my-wallet/transactions/1; case 2: user is logged in but has no plan', (assert) => {
  const cookie = sign({
    id: 2,
    username: 'israa',
  }, process.env.SECRET);
  supertest(app)
    .get('/my-wallet/transactions/1')
    .set('Cookie', `jwt=${cookie}`)
    .expect(302)
    .expect('location', '/my-wallet')
    .end((err) => {
      if (err) assert.error(err);
      assert.end();
    });
});

tape('testing /my-wallet/transactions/1; case 3: user is logged in but has not selected categories yet for the plan', (assert) => {
  const cookie = sign({
    id: 1,
    username: 'israa',
    planId: 1,
  }, process.env.SECRET);
  supertest(app)
    .get('/my-wallet/transactions/1')
    .set('Cookie', `jwt=${cookie}`)
    .expect(302)
    .expect('location', '/my-wallet')
    .end((err) => {
      if (err) assert.error(err);
      assert.end();
    });
});

tape('testing /my-wallet/transactions/1; case 1: user is logged in and has a plan', (assert) => {
  const cookie = sign({
    id: 1,
    username: 'shrorouq',
    planId: 1,
    categoriesId: [1, 2, 3],
    income: 5000,
    starting: '2019-03-01',
    ending: '2019-03-31',
  }, process.env.SECRET);
  supertest(app)
    .get('/my-wallet/transactions/2')
    .set('Cookie', `jwt=${cookie}`)
    .expect(200)
    .expect('content-type', /html/)
    .end((err, response) => {
      if (err) assert.error(err);
      assert.equal(response.text.includes('<title>Your Transactions</title>'), true, 'title should be your transactions');
      assert.end();
    });
});

tape('testing of signup page', (test) => {
  build()
    .then(() => {
      supertest(app)
        .post('/sign-up')
        .send({
          username: 'khader',
          password: 'khader',
          email: 'khader@khader.com',
        })
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8')
        .end((err, response) => {
          if (err) test.error(err);
          test.equal(response.text.includes('{"state":true}'), true, 'the response must be {"state":true} ');
          test.end();
        });
    })
    .catch((err) => {
      test.error(err);
    });
  });

