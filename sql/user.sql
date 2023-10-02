CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pfp_link` varchar(200) DEFAULT NULL,
  `pfp_thumb_link` varchar(200) DEFAULT NULL,
  `header_link` varchar(200) DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(500) DEFAULT NULL,
  `join_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `username_idx` (`username`)
) 