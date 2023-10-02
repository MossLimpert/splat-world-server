CREATE TABLE `crew_member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_ref` int DEFAULT NULL,
  `crew` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_ref_idx` (`user_ref`),
  KEY `crew_ref_idx` (`crew`),
  CONSTRAINT `crew` FOREIGN KEY (`crew`) REFERENCES `crew` (`id`),
  CONSTRAINT `user_ref` FOREIGN KEY (`user_ref`) REFERENCES `user` (`id`)
)