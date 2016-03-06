
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;


-- Table: albums
CREATE TABLE albums (id INTEGER PRIMARY KEY ASC AUTOINCREMENT NOT NULL, title TEXT, created_on INTEGER, modified_on INTEGER, params TEXT, cover INTEGER);

-- Table: albums_photos
CREATE TABLE albums_photos (album_id INTEGER REFERENCES albums (id) ON DELETE CASCADE, photo_id INTEGER REFERENCES photos (id) ON DELETE CASCADE);



COMMIT TRANSACTION;
PRAGMA foreign_keys = on;