DROP SCHEMA IF EXISTS dac;
CREATE SCHEMA IF NOT EXISTS dac;

USE dac;

CREATE TABLE events (
	event_id VARCHAR(10) NOT NULL,
	event_name VARCHAR(100) NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	PRIMARY KEY (event_id)
);

INSERT INTO events VALUES('PYTHON101', 'Fundamentals of Python', '2021-02-14', '2021-02-15');
INSERT INTO events VALUES('ML101', 'Introductory Machine Learning', '2021-03-20', '2021-03-21');
INSERT INTO events VALUES('ML102', 'Advanced Machine Learning', '2021-04-01', '2021-04-02');

CREATE TABLE registration (
	first_name VARCHAR(20) NOT NULL,
	last_name VARCHAR(20) NOT NULL,
	email VARCHAR(50) NOT NULL,
	sim_id INT(8) NOT NULL,
	event_id VARCHAR(10) NOT NULL,
	attended BOOLEAN NOT NULL,
	PRIMARY KEY (sim_id, event_id), /* One person can only attend 1 event at a time */
	CONSTRAINT FK_registration 
		FOREIGN KEY (event_id) REFERENCES events(event_id)
);
