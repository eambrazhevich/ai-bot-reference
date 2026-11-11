-- Schema for the planned database. The app keeps its data in memory for now.
CREATE TABLE products (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  price NUMERIC(10, 2)
);

CREATE TABLE cart_lines (
  product_id TEXT NOT NULL REFERENCES products (id),
  quantity   INTEGER NOT NULL
);
