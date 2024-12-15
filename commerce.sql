-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 15 déc. 2024 à 13:01
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `commerce`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Fruits', 'Catégorie pour les fruits'),
(2, 'Légumes', 'Catégorie pour les légumes'),
(3, 'Céréales', 'Catégorie pour les céréales');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total`, `order_date`) VALUES
(1, 1, 20.99, '2024-12-15 08:04:57'),
(2, 1, 20.99, '2024-12-15 08:05:02'),
(3, 1, 20.99, '2024-12-15 08:05:02'),
(4, 1, 20.99, '2024-12-15 08:05:02'),
(5, 1, 20.99, '2024-12-15 08:05:02'),
(6, 1, 20.99, '2024-12-15 08:05:03'),
(7, 1, 20.99, '2024-12-15 08:05:03'),
(8, 1, 20.99, '2024-12-15 08:05:03'),
(9, 1, 20.99, '2024-12-15 08:05:04'),
(10, 1, 20.99, '2024-12-15 08:05:04'),
(11, 1, 20.99, '2024-12-15 08:05:04'),
(12, 1, 20.99, '2024-12-15 08:05:04'),
(13, 1, 20.99, '2024-12-15 08:05:04'),
(14, 1, 20.99, '2024-12-15 08:05:04'),
(15, 1, 20.99, '2024-12-15 08:05:05'),
(16, 1, 20.99, '2024-12-15 08:05:05'),
(17, 1, 20.99, '2024-12-15 08:05:05'),
(18, 1, 20.99, '2024-12-15 08:05:05'),
(19, 1, 20.99, '2024-12-15 08:05:05'),
(20, 1, 20.99, '2024-12-15 08:05:05'),
(21, 1, 20.99, '2024-12-15 08:05:06'),
(22, 1, 20.99, '2024-12-15 08:05:06'),
(23, 1, 20.99, '2024-12-15 08:05:06'),
(24, 1, 20.99, '2024-12-15 08:05:06'),
(25, 1, 20.99, '2024-12-15 08:05:06'),
(26, 1, 20.99, '2024-12-15 08:05:06'),
(27, 1, 20.99, '2024-12-15 11:07:18'),
(28, 1, 20.99, '2024-12-15 11:07:19'),
(29, 1, 20.99, '2024-12-15 11:07:19'),
(30, 1, 20.99, '2024-12-15 11:07:19'),
(31, 1, 20.99, '2024-12-15 11:07:19');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 5, 1, 20.99),
(2, 2, 5, 1, 20.99),
(3, 3, 5, 1, 20.99),
(4, 4, 5, 1, 20.99),
(5, 5, 5, 1, 20.99),
(6, 6, 5, 1, 20.99),
(7, 7, 5, 1, 20.99),
(8, 8, 5, 1, 20.99),
(9, 9, 5, 1, 20.99),
(10, 10, 5, 1, 20.99),
(11, 11, 5, 1, 20.99),
(12, 12, 5, 1, 20.99),
(13, 13, 5, 1, 20.99),
(14, 14, 5, 1, 20.99),
(15, 15, 5, 1, 20.99),
(16, 16, 5, 1, 20.99),
(17, 17, 5, 1, 20.99),
(18, 18, 5, 1, 20.99),
(19, 19, 5, 1, 20.99),
(20, 20, 5, 1, 20.99),
(21, 21, 5, 1, 20.99),
(22, 22, 5, 1, 20.99),
(23, 23, 5, 1, 20.99),
(24, 24, 5, 1, 20.99),
(25, 25, 5, 1, 20.99),
(26, 26, 5, 1, 20.99),
(27, 27, 5, 1, 20.99),
(28, 28, 5, 1, 20.99),
(29, 29, 5, 1, 20.99),
(30, 30, 5, 1, 20.99),
(31, 31, 5, 1, 20.99);

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `stock` int DEFAULT NULL,
  `image_name_1` varchar(255) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `subcategory_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `stock`, `image_name_1`, `category_id`, `subcategory_id`) VALUES
(5, 'Produit Exemple', 20.99, 'Description de l\'exemple', 100, 'latour.jpg', 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
CREATE TABLE IF NOT EXISTS `subcategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `created_at`) VALUES
(1, 'Hadesib', '$2b$10$NY/7JmfoeF1SZqDluisnXeXjMzYm.Stc265UewPYNRwmQSFpm0Cki', 'jackeboyeur244@gmail.com', 'user', '2024-12-14 14:50:20');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
