DROP TABLE IF EXISTS menu;
DROP TABLE IF EXISTS class;
DROP TABLE IF EXISTS class_menu;
DROP TABLE IF EXISTS set_menu;
DROP TABLE IF EXISTS coupon;

CREATE TABLE message (
	id INTEGER PRIMARY KEY,
	pkey TEXT,
	userId TEXT,
	userName TEXT,
	body TEXT,
	createdAt TEXT
);

-- CREATE TABLE channel {
-- 	id INTEGER PRIMARY KEY,
-- 	pkey TEXT,
-- }

-- CREATE TABLE channel_message (
-- 	id INTEGER PRIMARY KEY,
-- 	channelId INTEGER,
-- 	userId TEXT,
-- 	userName TEXT,
-- 	body TEXT,
-- 	createdAt TEXT
-- );

-- CREATE TABLE channel_user {
-- 	channelId TEXT,
-- 	userId TEXT,
-- 	userName TEXT
-- }
