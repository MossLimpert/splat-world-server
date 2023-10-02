CREATE TABLE `tag` (
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
)