CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
);

SELECT setval('partners_id_seq', 1000);

CREATE TABLE partners_users (
    partner_id INT NOT NULL, 
    user_id INT NOT NULL, 
    PRIMARY KEY (partner_id, user_id), 
    FOREIGN KEY (partner_id) REFERENCES partners (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
