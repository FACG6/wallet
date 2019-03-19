BEGIN;

  DROP TABLE IF EXISTS users, categories, plans, category_plan, expenses;

  CREATE TABLE users
  (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );

  CREATE TABLE plans
  (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    income FLOAT NOT NULL,
    starting TEXT NOT NULL,
    ending TEXT NOT NULL
  );

  CREATE TABLE categories
  (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE category_plan
  (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES plans(id),
    cat_id INTEGER REFERENCES categories(id),
    amount FLOAT NOT NULL
  );

  CREATE TABLE expenses
  (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES plans(id),
    cat_id INTEGER REFERENCES categories(id),
    price FLOAT NOT NULL,
    date TEXT NOT NULL,
    description TEXT
  );

  INSERT INTO categories
    (name)
  VALUES
    ('Clothes'), ('Bills'), ('Food'), ('Fuel'), ('Education'), ('Health'), ('Gifts'), ('Parties'), ('Drinks'), ('Transports');

  COMMIT;