DELETE FROM partners_invitations
  WHERE inviter_user_id in (1);

DELETE FROM partners_users 
  where user_id in (1,2);

DELETE FROM partners
  where id in (10,20);

DELETE FROM users
  where id in (1,2,3);

