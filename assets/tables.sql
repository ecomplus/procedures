CREATE TABLE IF NOT EXISTS `order_items` (
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `store_id` MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
  `order_id` CHAR(24) NOT NULL,
  `item_id` CHAR(24) NULL,
  `product_id` CHAR(24) NOT NULL,
  `variation_id` CHAR(24) NOT NULL,
  `quantity` DECIMAL(11,4) NOT NULL DEFAULT 0,
  `quantity_decreased` TINYINT NOT NULL DEFAULT 0,
  `price` DECIMAL(14,5) NOT NULL DEFAULT 0,
  PRIMARY KEY (`order_id`, `product_id`, `variation_id`),
  INDEX (`quantity_decreased`)
) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `order_buyers` (
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `store_id` MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
  `order_id` CHAR(24) NOT NULL,
  `customer_id` CHAR(24) NOT NULL,
  PRIMARY KEY (`order_id`, `customer_id`)
) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;
