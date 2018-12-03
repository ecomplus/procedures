CREATE TABLE IF NOT EXISTS `stores` (
  `id` MEDIUMINT UNSIGNED NOT NULL DEFAULT 0
  PRIMARY KEY (`id`)
) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `stock_control` (
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `store_id` MEDIUMINT UNSIGNED NOT NULL,
  `product_id` CHAR(24) NOT NULL,
  `variation_id` CHAR(24) NOT NULL,
  `last_read_quantity` DECIMAL(11,4) NOT NULL DEFAULT 0,
  `last_read_record` CHAR(24) NULL,
  PRIMARY KEY (`product_id`, `variation_id`),
  FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;
