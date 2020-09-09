CREATE TABLE jurps_characters(
  id SERIAL PRIMARY KEY,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  race TEXT NOT NULL,
  cclass TEXT NOT NULL,
  strength INTEGER NOT NULL,
  dexterity INTEGER NOT NULL,
  intelligence INTEGER NOT NULL,
  health INTEGER NOT NULL,
  hit_points INTEGER NOT NULL,
  will INTEGER NOT NULL,
  perception INTEGER NOT NULL,
  fatigue_points INTEGER NOT NULL,
  abilities TEXT ,
  background_story TEXT,
  user_id INTEGER
        REFERENCES jurps_users(id) ON DELETE CASCADE NOT NULL
);
