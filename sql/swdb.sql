CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pfp_link` varchar(200) DEFAULT NULL,
  `pfp_thumb_link` varchar(200) DEFAULT NULL,
  `header_link` varchar(200) DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(500) DEFAULT NULL,
  `join_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `username_idx` (`username`)
); 

CREATE TABLE IF NOT EXISTS `crew` (
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
);

CREATE TABLE IF NOT EXISTS `crew_member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_ref` int DEFAULT NULL,
  `crew` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_ref_idx` (`user_ref`),
  KEY `crew_ref_idx` (`crew`),
  CONSTRAINT `crew` FOREIGN KEY (`crew`) REFERENCES `crew` (`id`),
  CONSTRAINT `user_ref` FOREIGN KEY (`user_ref`) REFERENCES `user` (`id`)
);

CREATE TABLE IF NOT EXISTS `tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ab_link` varchar(200) DEFAULT NULL,
  `img_link` varchar(200) DEFAULT NULL,
  `img_thumb_link` varchar(200) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `crew_ref` int DEFAULT NULL,
  `create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint DEFAULT '1',
  `saved` tinyint DEFAULT '1',
  `author_ref` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author_ref_idx` (`author_ref`),
  KEY `crew_ref_idx` (`crew_ref`),
  CONSTRAINT `author_ref` FOREIGN KEY (`author_ref`) REFERENCES `user` (`id`),
  CONSTRAINT `crew_ref` FOREIGN KEY (`crew_ref`) REFERENCES `crew` (`id`)
);

CREATE TABLE IF NOT EXISTS `tag_geolocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag_ref` int NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tag_ref_idx` (`tag_ref`),
  CONSTRAINT `tag_ref` FOREIGN KEY (`tag_ref`) REFERENCES `tag` (`id`)
);