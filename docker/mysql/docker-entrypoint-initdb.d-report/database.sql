SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

USE `codechallenge`;

SET NAMES utf8mb4;

CREATE TABLE `records` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `user_balance` varchar(255) NOT NULL,
  `operation_response` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `active` tinyint NOT NULL,
  `operation_type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_16e06c5aad86dc7910a363a07c` (`user_id`,`active`),
  FULLTEXT KEY `IDX_97ebb3dd2ca90d60a109f9cdbc` (`amount`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;