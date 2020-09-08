BEGIN;

TRUNCATE
JURPS_users,
JURPS_characters
RESTART IDENTITY CASCADE;

INSERT INTO JURPS_users (user_name, email, password )
VALUES
('dunder', 'dunder@mifflin.com', 'mifflin'),
('admin', 'admin@admin.admin', '$2y$12$MIVZHt0G9wkA4Rqf8NSFpuLtX/x.Xryn5qC.Ss5M2BlnpOa.2bo.O');

INSERT INTO JURPS_characters(name, race, class, strength, dexterity, intelligence, health, hit_points, will, perception, fatigue_points, user_id)
VALUES
('Lur, ofOmicron Persei 8','Omicronian','Ruler',20,7,10,18,50,8,7,14,1),
('Firelord Ozai','Human','Fire Bender',15,12,15,15,32,17,10,12,1),
('Snuffleupagus','Muppet','Beast',20,20,20,20,20,20,20,20,1),
('Hubert J Farnsworth','Human','Scientist',4,2,20,5,10,7,1,1,1),
('Link','Hylian','Warrior',15,15,10,15,40,15,15,20,1),
('BJ Blaskowicz','Human','Doom Slayer',15,15,15,5,30,15,15,15,1),
('R2-D2','Droid','Utility Droid',5,14,20,10,22,20,20,20,1),
('Cthulu','Old One','Gret Old One',50,50,50,50,400,50,50,50,1),
('Remy LeBeaux','Mutant','Ranged',15,18,12,15,35,18,18,15,1);

COMMIT;
