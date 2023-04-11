SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

USE `codechallenge`;

SET NAMES utf8mb4;

CREATE TABLE `operations` (
  `id` varchar(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `cost` varchar(255) NOT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_35ac7a4391b2f2add7bcec475b` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `operations` (`id`, `type`, `cost`, `active`) VALUES
('724216b0-d75b-11ed-9316-0242ac130004',	'+',	'1',	1),
('75a7263d-d75b-11ed-9316-0242ac130004',	'-',	'2',	1),
('7bd56ab0-d75b-11ed-9316-0242ac130004',	'*',	'3',	1),
('8000583c-d75b-11ed-9316-0242ac130004',	'/',	'4',	1),
('8861b96a-d75b-11ed-9316-0242ac130004',	'√',	'5',	1),
('8d44fce2-d75b-11ed-9316-0242ac130004',	'random_string',	'6',	1);

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `balance` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;