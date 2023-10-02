CREATE TABLE `crew` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `joincode` varchar(45) NOT NULL,
  `owner` int DEFAULT NULL,
  `header_link` varchar(200) DEFAULT NULL,
  `color_r` bit(8) DEFAULT NULL,
  `color_g` bit(8) DEFAULT NULL,
  `color_b` bit(8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_idx` (`owner`),
  KEY `name_idx` (`name`),
  CONSTRAINT `owner` FOREIGN KEY (`owner`) REFERENCES `user` (`id`)
)