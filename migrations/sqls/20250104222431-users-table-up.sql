CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
);

CREATE INDEX users_email_ids ON users (email);
SELECT setval('users_id_seq', 1000);

