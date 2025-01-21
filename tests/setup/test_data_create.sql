INSERT INTO users (
  id,
  name,
  email,
  password
) VALUES ( 
    1,
    'Test User 1',
    'test1@test.com',
    '$2b$10$1eqaVmy2dJVP/WX2vTkPdehCuM34WAYsmQ0IrSVai27/VBPyjWJGu'
  ),
  (
    2,
    'Test User 2',
    'test2@test.com',
    '$2b$10$1eqaVmy2dJVP/WX2vTkPdehCuM34WAYsmQ0IrSVai27/VBPyjWJGu'
  ),
  (
    3,
    'Test User 3',
    'test3@test.com',
    '$2b$10$1eqaVmy2dJVP/WX2vTkPdehCuM34WAYsmQ0IrSVai27/VBPyjWJGu'
  );

INSERT INTO partners (
  id,
  name
) VALUES (
    10, 
    'Test Partner 10'
  ), 
  (
    20,
    'Test Partner 20'
  );

INSERT INTO partners_users (
  user_id,
  partner_id
) VALUES (
    1,
    10
  ),
  (
    2,
    10
  ),
  (
    1,
    20
  );

INSERT INTO partners_invitations (
  id,
  inviter_user_id,
  invitee_user_id,
  partner_id,
  status
) VALUES (
    1,
    1,
    2,
    10,
    'accepted'
  ),
  (
    2,
    1,
    3,
    20,
    'declined'
  ),
  (
    3,
    1,
    3,
    20,
    'pending'
  );
