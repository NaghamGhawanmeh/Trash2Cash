CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL,
  phone_number VARCHAR(15),
  points INTEGER DEFAULT 0,
  is_deleted SMALLINT DEFAULT 0
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL
);


CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  price_per_kg  DECIMAL(10,2),
  price_per_dimensions DECIMAL(10,2),
  points_per_kg INTEGER,
  is_deleted SMALLINT DEFAULT 0
  
);

CREATE TABLE requests (

  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES category(id),
  description TEXT,
  status VARCHAR(20) DEFAULT 'draft', //it will be active once he checkout
  weight DECIMAL (10,2) 
  length DECIMAL (10,2)
  width DECIMAL (10,2)
  height DECIMAL (10,2)
  predicted_price DECIMAL (10,2),
);


CREATE Table orders {
  id SERIAL PRIMARY KEY,
  request_id INTEGER REFERENCES requests(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending'
  collector_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  last_price INTEGER
  order_time TIMESTAMP 
  location VARCHAR(255)
  arrive_time TIMESTAMP
  predicted_price DECIMAL (10,2)
}
CREATE TABLE role_permission (
  role_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_role
  FOREIGN KEY (role_id) 
  REFERENCES roles(id) 
  ON DELETE CASCADE,
  CONSTRAINT fk_permission
  FOREIGN KEY (permission_id) 
  REFERENCES permissions(id) 
  ON DELETE CASCADE
);



CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  permission_name VARCHAR(255) NOT NULL,
  description TEXT
)
