CREATE DATABASE newsApp_db;
USE newsApp_db;

CREATE TABLE IF NOT EXISTS articles
(
	userid varchar(255) NOT NULL,
	title varchar(255) NOT NULL,
	category varchar(20) NOT NULL,
	content TEXT(65535) NOT NULL
);

CREATE TABLE IF NOT EXISTS users
(
	username varchar(25) NOT NULL,
	password TEXT(65535) NOT NULL,
	role varchar(20) NOT NULL
);