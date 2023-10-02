CREATE TABLE `tag_geolocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag_ref` int NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tag_ref_idx` (`tag_ref`),
  CONSTRAINT `tag_ref` FOREIGN KEY (`tag_ref`) REFERENCES `tag` (`id`)
)