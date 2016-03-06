
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: album_links
CREATE TABLE album_links (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "key" TEXT UNIQUE, album_id INTEGER REFERENCES albums (id) ON DELETE CASCADE, expiration INTEGER, params TEXT);

-- Table: photo_links
CREATE TABLE photo_links (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "key" TEXT UNIQUE, photo_id INTEGER REFERENCES photos (id) ON DELETE CASCADE, expiration INTEGER, params TEXT);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;