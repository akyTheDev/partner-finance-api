CREATE TABLE partners_invitations (
  id SERIAL PRIMARY KEY,
  inviter_user_id INT REFERENCES users(id),
  invitee_user_id INT REFERENCES users(id),
  partner_id INT REFERENCES partners(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, 
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
);

SELECT setval('partners_invitations_id_seq', 1000);



