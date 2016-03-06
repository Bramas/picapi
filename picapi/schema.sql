--
-- Fichier généré par SQLiteStudio v3.0.7sur dim. mars 6 10:23:56 2016
--
-- Encodage texte utilisé: windows-1252
--

PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: photos_tags
CREATE TABLE photos_tags (photo_id INTEGER REFERENCES photos (id) ON DELETE CASCADE, tag_id INTEGER REFERENCES tags (id) ON DELETE CASCADE, PRIMARY KEY (photo_id, tag_id));

-- Table: photos
CREATE TABLE photos (id INTEGER PRIMARY KEY ASC AUTOINCREMENT, secret TEXT NOT NULL, o_secret TEXT NOT NULL, title TEXT NOT NULL, extension TEXT, description TEXT, captured_on INTEGER, captured_month INTEGER, captured_year INTEGER, created_on INTEGER, modified_on INTEGER, filesize INTEGER, width INTEGER, height INTEGER, rating INTEGER, metadata TEXT, attachments TEXT, params TEXT, storage TEXT NOT NULL DEFAULT local);

-- Table: tags
CREATE TABLE tags (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, value TEXT UNIQUE ON CONFLICT IGNORE);

-- Table: users
CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, role TEXT);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
