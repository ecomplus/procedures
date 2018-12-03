CREATE TABLE IF NOT EXISTS `stock_control` (
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `store_id` MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
  `product_id` CHAR(24) NOT NULL,
  `variation_id` CHAR(24) NOT NULL,
  `last_read_quantity` DECIMAL(11,4) NOT NULL DEFAULT 0,
  `last_read_record` CHAR(24) NULL,
  PRIMARY KEY (`product_id`, `variation_id`)
) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;
