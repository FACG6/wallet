BEGIN;

  DROP TABLE IF EXISTS "user", category, "plan", category_plan, expense;

  CREATE TABLE "user"
  (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );

  CREATE TABLE "plan"
  (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    income FLOAT NOT NULL,
    starting TEXT NOT NULL,
    ending TEXT NOT NULL
  );

  CREATE TABLE category
  (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE category_plan
  (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES "plan"(id),
    cat_id INTEGER REFERENCES category(id),
    amount FLOAT NOT NULL
  );

  CREATE TABLE expense
  (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES "plan"(id),
    cat_id INTEGER REFERENCES category(id),
    price FLOAT NOT NULL,
    date TEXT NOT NULL,
    description TEXT
  );
  INSERT INTO category
    (name)
  VALUES
    ('Clothes'),
    ('Food'),
    ('Fuel'),
    ('Parties'),
    ('Education'),
    ('Bills'),
    ('Gifts'),
    ('Health'),
    ('Drinks'),
    ('Transport');
  INSERT INTO "user"
    (username, password, email)
  VALUES
    ('shorouq', 'shrooq', 'shrooq@hotmail.com');
  INSERT INTO "plan"
    (user_id, income, starting, ending)
  VALUES
    (1, 5000, '2019-03-01', '2019-03-31');
  INSERT INTO category_plan
    (plan_id, cat_id, amount)
  VALUES
    (1, 1, 200),
    (1, 2, 300),
    (1, 3, 200);
  INSERT INTO expense
    (plan_id, cat_id, price, date, description)
  VALUES
    (1, 2, 50, '2019-03-2', 'purchase clothes'),
    (1, 3, 50, '2019-03-2', 'purchase clothes'),
    (1, 2, 50, '2019-03-2', 'purchase clothes');
  COMMIT;
