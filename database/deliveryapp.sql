-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-10-2025 a las 09:55:32
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `deliveryapp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `delivery_persons`
--

CREATE TABLE `delivery_persons` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `status` enum('available','busy','disconnected','resting') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `delivery_persons`
--

INSERT INTO `delivery_persons` (`id`, `full_name`, `phone`, `vehicle_type`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Juan Pérez', '987654321', 'Moto', 'busy', '2025-10-02 20:30:59', '2025-10-03 06:17:35'),
(2, 'María García', '987654322', 'Bicicleta', 'available', '2025-10-02 20:30:59', '2025-10-02 21:25:16'),
(3, 'Carlos López', '987654323', 'Auto', 'available', '2025-10-02 20:30:59', '2025-10-02 20:30:59'),
(4, 'Ana Rodríguez', '987654324', 'Moto', 'resting', '2025-10-02 20:30:59', '2025-10-02 20:30:59'),
(5, 'Pedro Sánchez', '987654325', 'Bicicleta', 'available', '2025-10-02 20:30:59', '2025-10-02 20:30:59'),
(6, 'Santiago', '987654321', 'Moto', 'available', '2025-10-02 21:29:02', '2025-10-02 21:29:02'),
(7, 'Pedro', '234 123 543', 'Auto', 'available', '2025-10-03 04:53:51', '2025-10-03 04:53:51'),
(8, 'Sebastian', '974654321', 'Bicicleta', 'available', '2025-10-03 06:08:13', '2025-10-03 06:08:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `restaurant_id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','preparing','delivering','delivered','cancelled') DEFAULT 'pending',
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `restaurant_id`, `category`, `total`, `status`, `items`, `created_at`) VALUES
(1, 1, 1, 'Pizzas', 25.50, 'delivered', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":25.50}]', '2025-09-20 23:00:00'),
(2, 1, 1, 'Pizzas', 14.00, 'preparing', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":14.00}]', '2025-09-21 00:30:00'),
(3, 1, 1, 'Pizzas', 12.00, 'pending', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":12.00}]', '2025-09-21 01:15:00'),
(4, 1, 1, 'Pizzas', 28.00, 'preparing', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":20.00}]', '2025-09-21 02:45:00'),
(5, 1, 1, 'Pizzas', 13.50, 'cancelled', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":18.00}]', '2025-09-21 17:00:00'),
(6, 1, 1, 'Pizzas', 22.00, 'delivered', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":15.00}]', '2025-09-21 23:30:00'),
(7, 1, 1, 'Pizzas', 15.00, 'delivered', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":30.00}]', '2025-09-22 00:00:00'),
(8, 1, 1, 'Pizzas', 18.50, 'cancelled', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":10.00}]', '2025-09-22 01:00:00'),
(9, 1, 1, 'Pizzas', 20.00, 'delivered', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":28.00}]', '2025-09-22 02:00:00'),
(10, 1, 1, 'Pizzas', 16.00, 'delivered', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":22.00}]', '2025-09-22 22:00:00'),
(11, 1, 2, 'Hamburguesas', 18.00, 'delivered', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":16.00}]', '2025-09-20 22:30:00'),
(12, 1, 2, 'Hamburguesas', 9.50, 'delivered', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":24.00}]', '2025-09-20 23:45:00'),
(13, 1, 2, 'Hamburguesas', 11.00, 'pending', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":19.00}]', '2025-09-21 00:20:00'),
(14, 1, 2, 'Hamburguesas', 20.00, 'delivered', '[{\"productName\":\"Pizza\",\"quantity\":1,\"totalPerUnit\":21.00}]', '2025-09-21 01:50:00'),
(15, 1, 2, 'Hamburguesas', 8.00, 'cancelled', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":12.00}]', '2025-09-21 18:00:00'),
(16, 1, 2, 'Hamburguesas', 16.50, 'delivered', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":18.00}]', '2025-09-21 22:15:00'),
(17, 1, 2, 'Hamburguesas', 10.50, 'preparing', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":14.00}]', '2025-09-21 23:40:00'),
(18, 1, 2, 'Hamburguesas', 14.00, 'cancelled', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":16.00}]', '2025-09-22 00:10:00'),
(19, 1, 2, 'Hamburguesas', 19.00, 'delivered', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":20.00}]', '2025-09-22 01:30:00'),
(20, 1, 2, 'Hamburguesas', 12.00, 'delivered', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":11.00}]', '2025-09-22 21:45:00'),
(21, 1, 2, 'Hamburguesas', 17.00, 'delivered', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":22.00}]', '2025-09-19 22:00:00'),
(22, 1, 2, 'Hamburguesas', 21.00, 'delivered', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":17.00}]', '2025-09-19 23:20:00'),
(23, 1, 2, 'Hamburguesas', 9.00, 'preparing', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":19.00}]', '2025-09-20 00:00:00'),
(24, 1, 2, 'Hamburguesas', 13.50, 'delivered', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":15.00}]', '2025-09-20 01:10:00'),
(25, 1, 2, 'Hamburguesas', 15.00, 'cancelled', '[{\"productName\":\"Hamburguesa\",\"quantity\":1,\"totalPerUnit\":21.00}]', '2025-09-18 22:40:00'),
(26, 1, 3, 'Sushi', 28.00, 'delivering', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":8.50}]', '2025-09-21 00:00:00'),
(27, 1, 3, 'Sushi', 15.00, 'delivered', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":12.00}]', '2025-09-21 01:30:00'),
(28, 1, 3, 'Sushi', 12.00, 'cancelled', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":15.00}]', '2025-09-21 02:00:00'),
(29, 1, 3, 'Sushi', 35.00, 'delivered', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":18.00}]', '2025-09-22 00:20:00'),
(30, 1, 3, 'Sushi', 18.00, 'cancelled', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":20.00}]', '2025-09-22 01:10:00'),
(31, 1, 3, 'Sushi', 24.50, 'delivered', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":22.00}]', '2025-09-22 02:40:00'),
(32, 1, 3, 'Sushi', 16.00, 'delivered', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":17.00}]', '2025-09-23 00:15:00'),
(33, 1, 3, 'Sushi', 30.00, 'cancelled', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":25.00}]', '2025-09-23 01:45:00'),
(34, 1, 3, 'Sushi', 13.50, 'delivered', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":19.00}]', '2025-09-20 00:30:00'),
(35, 1, 3, 'Sushi', 27.00, 'preparing', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":21.00}]', '2025-09-20 02:00:00'),
(36, 1, 3, 'Sushi', 14.00, 'delivered', '[{\"productName\":\"Sushi\",\"quantity\":1,\"totalPerUnit\":23.00}]', '2025-09-19 00:50:00'),
(37, 1, 3, 'Sushi', 29.50, 'delivering', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":10.00}]', '2025-09-19 01:20:00'),
(38, 1, 3, 'Sushi', 17.50, 'cancelled', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":12.00}]', '2025-09-18 00:10:00'),
(39, 1, 3, 'Sushi', 25.00, 'delivered', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":8.00}]', '2025-09-18 02:30:00'),
(40, 1, 3, 'Sushi', 20.00, 'delivered', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":15.00}]', '2025-09-17 01:00:00'),
(41, 1, 4, 'Tacos', 7.50, 'preparing', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":20.00}]', '2025-09-20 23:20:00'),
(42, 1, 4, 'Tacos', 8.00, 'delivered', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":18.00}]', '2025-09-21 00:40:00'),
(43, 1, 4, 'Tacos', 6.50, 'cancelled', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":16.00}]', '2025-09-21 01:50:00'),
(44, 1, 4, 'Tacos', 15.00, 'delivered', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":14.00}]', '2025-09-21 23:10:00'),
(45, 1, 4, 'Tacos', 9.00, 'cancelled', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":22.00}]', '2025-09-22 00:30:00'),
(46, 1, 4, 'Tacos', 12.50, 'delivered', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":19.00}]', '2025-09-22 01:40:00'),
(47, 1, 4, 'Tacos', 7.00, 'delivered', '[{\"productName\":\"Taco\",\"quantity\":1,\"totalPerUnit\":17.00}]', '2025-09-22 23:50:00'),
(48, 1, 4, 'Tacos', 10.50, 'pending', '[{\"productName\":\"Pasta\",\"quantity\":1,\"totalPerUnit\":20.00}]', '2025-09-20 00:20:00'),
(49, 1, 4, 'Tacos', 8.50, 'delivering', '[{\"productName\":\"Pasta\",\"quantity\":1,\"totalPerUnit\":25.00}]', '2025-09-19 01:00:00'),
(50, 1, 4, 'Tacos', 14.00, 'delivered', '[{\"productName\":\"Pasta\",\"quantity\":1,\"totalPerUnit\":18.00}]', '2025-09-18 02:10:00'),
(51, 1, 5, 'Pastas', 13.50, 'delivered', '[{\"productName\":\"Pasta\",\"quantity\":1,\"totalPerUnit\":22.00}]', '2025-09-21 00:10:00'),
(52, 1, 5, 'Pastas', 15.00, 'delivered', '[{\"productName\":\"Pasta\",\"quantity\":1,\"totalPerUnit\":28.00}]', '2025-09-21 01:40:00'),
(53, 1, 5, 'Pastas', 12.50, 'cancelled', '[{\"productName\":\"Pasta\",\"quantity\":1,\"totalPerUnit\":24.00}]', '2025-09-22 00:50:00'),
(54, 1, 5, 'Pastas', 18.00, 'delivering', '[{\"productName\":\"Pasta\",\"quantity\":1,\"totalPerUnit\":30.00}]', '2025-09-22 02:20:00'),
(55, 1, 5, 'Pastas', 14.50, 'delivering', '[{\"productName\":\"Pasta\",\"quantity\":1,\"totalPerUnit\":26.00}]', '2025-09-20 01:30:00'),
(56, 1, 1, 'Pizzas', 25.50, 'delivering', '[{\"productName\":\"Pasta\",\"quantity\":1,\"totalPerUnit\":32.00}]', '2025-09-20 23:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `restaurant_id`, `category_id`, `name`, `description`, `price`, `image_url`, `is_available`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Pizza Margherita', 'Tomate, mozzarella y albahaca fresca', 12.00, NULL, 1, 1, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(2, 1, 1, 'Pizza Pepperoni', 'Pepperoni con queso mozzarella', 14.00, NULL, 1, 2, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(3, 1, 1, 'Pizza Hawaiana', 'Jamón, piña y queso', 13.50, NULL, 1, 3, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(4, 2, 2, 'Hamburguesa Clásica', 'Carne, lechuga, tomate, cebolla', 8.50, NULL, 1, 1, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(5, 2, 2, 'Hamburguesa BBQ', 'Carne, salsa BBQ, cebolla caramelizada', 10.00, NULL, 1, 2, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(6, 2, 3, 'Papas Fritas', 'Papas crujientes con sal', 4.50, NULL, 1, 1, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(7, 3, 4, 'Combo Sushi (20 piezas)', 'Variedad de sushi fresco', 28.00, NULL, 1, 1, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(8, 3, 4, 'Sashimi Salmón', 'Salmón fresco cortado finamente', 15.00, NULL, 1, 2, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(9, 3, 4, 'Rollo California', 'Cangrejo, aguacate, pepino', 12.00, NULL, 1, 3, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(10, 4, 6, 'Tacos al Pastor', 'Carne al pastor con piña', 7.50, NULL, 1, 1, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(11, 4, 6, 'Tacos de Pollo', 'Pollo marinado con especias', 8.00, NULL, 1, 2, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(12, 4, 6, 'Quesadillas', 'Tortilla con queso derretido', 6.50, NULL, 1, 3, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(13, 5, 7, 'Spaghetti Carbonara', 'Pasta con huevo, bacon y queso', 13.50, NULL, 1, 1, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(14, 5, 7, 'Lasaña de Carne', 'Lasaña tradicional italiana', 15.00, NULL, 1, 2, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(15, 5, 7, 'Fettuccine Alfredo', 'Pasta en salsa cremosa', 12.50, NULL, 1, 3, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(16, 6, 8, 'Arroz Chino Especial', 'Arroz frito con vegetales', 11.00, NULL, 1, 1, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(17, 6, 8, 'Pollo Agridulce', 'Pollo en salsa agridulce', 12.50, NULL, 1, 2, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(18, 6, 8, 'Chop Suey', 'Verduras salteadas estilo chino', 10.50, NULL, 1, 3, '2025-09-22 01:34:42', '2025-09-22 01:34:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_categories`
--

CREATE TABLE `product_categories` (
  `id` int(11) NOT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `product_categories`
--

INSERT INTO `product_categories` (`id`, `restaurant_id`, `name`, `description`, `display_order`, `is_active`, `created_at`) VALUES
(1, 1, 'Pizzas', NULL, 1, 1, '2025-09-22 01:34:42'),
(2, 2, 'Hamburguesas', NULL, 1, 1, '2025-09-22 01:34:42'),
(3, 2, 'Acompañamientos', NULL, 2, 1, '2025-09-22 01:34:42'),
(4, 3, 'Sushi', NULL, 1, 1, '2025-09-22 01:34:42'),
(5, 3, 'Combos', NULL, 2, 1, '2025-09-22 01:34:42'),
(6, 4, 'Tacos', NULL, 1, 1, '2025-09-22 01:34:42'),
(7, 5, 'Pastas', NULL, 1, 1, '2025-09-22 01:34:42'),
(8, 6, 'Platos', NULL, 1, 1, '2025-09-22 01:34:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `restaurants`
--

CREATE TABLE `restaurants` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `zone_id` int(11) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `delivery_time_min` int(11) DEFAULT 30,
  `delivery_time_max` int(11) DEFAULT 45,
  `delivery_fee` decimal(8,2) DEFAULT 3.00,
  `minimum_order` decimal(8,2) DEFAULT 0.00,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `restaurants`
--

INSERT INTO `restaurants` (`id`, `name`, `description`, `image_url`, `category_id`, `zone_id`, `rating`, `delivery_time_min`, `delivery_time_max`, `delivery_fee`, `minimum_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Pizza Palace', 'Pizza', 'https://res.cloudinary.com/dvk2jclev/image/upload/v1759476277/descarga_njllxr.jpg', 1, 1, 4.5, 25, 35, 3.00, 0.00, 1, '2025-09-22 01:34:42', '2025-10-03 07:24:57'),
(2, 'Burger House', 'Hamburguesas', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=200&fit=crop', 2, 2, 4.2, 20, 30, 2.50, 0.00, 1, '2025-09-22 01:34:42', '2025-09-22 01:34:42'),
(3, 'Sushi Master', 'Sushi', 'https://res.cloudinary.com/dvk2jclev/image/upload/v1759470438/descarga_q6qoht.jpg', 3, 3, 4.8, 30, 40, 4.00, 0.00, 1, '2025-09-22 01:34:42', '2025-10-03 05:47:34'),
(4, 'Taco Loco', 'Mexicana', 'https://res.cloudinary.com/dvk2jclev/image/upload/v1759086302/images_gwzy90.jpg', 4, 1, 4.3, 25, 35, 2.50, 0.00, 1, '2025-09-22 01:34:42', '2025-09-28 19:05:14'),
(5, 'Pasta Italia', 'Italiana', 'https://res.cloudinary.com/dvk2jclev/image/upload/v1759470488/descarga_1_swep91.jpg', 5, 2, 4.6, 30, 40, 3.50, 0.00, 1, '2025-09-22 01:34:42', '2025-10-03 05:48:18'),
(6, 'Dragon Wok', 'China', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=200&fit=crop', 6, 3, 4.1, 35, 45, 3.00, 0.00, 1, '2025-09-22 01:34:42', '2025-09-22 01:34:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `restaurant_categories`
--

CREATE TABLE `restaurant_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `restaurant_categories`
--

INSERT INTO `restaurant_categories` (`id`, `name`, `description`, `image_url`, `created_at`) VALUES
(1, 'Pizza', 'Pizzerías y comida italiana', NULL, '2025-09-22 01:34:42'),
(2, 'Hamburguesas', 'Restaurantes de hamburguesas', NULL, '2025-09-22 01:34:42'),
(3, 'Sushi', 'Restaurantes de comida japonesa', NULL, '2025-09-22 01:34:42'),
(4, 'Mexicana', 'Comida mexicana', NULL, '2025-09-22 01:34:42'),
(5, 'Italiana', 'Comida italiana', NULL, '2025-09-22 01:34:42'),
(6, 'China', 'Comida china', NULL, '2025-09-22 01:34:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `address`, `password`, `is_admin`, `created_at`, `updated_at`) VALUES
(1, 'Sebas', 'ir', 'prueba@correo.com', '913 245 609', 'upn', '$2b$10$jrtotEd6r7JTuhzD0WWVzeicukh8O9aZf3syGB1jlFYSVvCeKmpqW', 0, '2025-09-22 00:32:54', '2025-09-29 00:31:53'),
(3, 'admin', 'pere<', 'admin@demo.com', '987634512', 'upn', '$2b$10$ijN9c8fsbPUEZo2H1oCc7ezrIfe1N/a.jjN6SGbXZTYzqc.HWuU2S', 1, '2025-10-02 22:20:55', '2025-10-02 22:21:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zones`
--

CREATE TABLE `zones` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `zones`
--

INSERT INTO `zones` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Zona Norte', 'Zona norte de la ciudad', '2025-09-22 01:34:42'),
(2, 'Centro', 'Centro de la ciudad', '2025-09-22 01:34:42'),
(3, 'Zona Sur', 'Zona sur de la ciudad', '2025-09-22 01:34:42');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `delivery_persons`
--
ALTER TABLE `delivery_persons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_delivery_persons_status` (`status`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_orders_user` (`user_id`),
  ADD KEY `idx_orders_restaurant` (`restaurant_id`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_created` (`created_at`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_products_restaurant` (`restaurant_id`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_available` (`is_available`);

--
-- Indices de la tabla `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `restaurant_id` (`restaurant_id`);

--
-- Indices de la tabla `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_restaurants_category` (`category_id`),
  ADD KEY `idx_restaurants_zone` (`zone_id`),
  ADD KEY `idx_restaurants_active` (`is_active`);

--
-- Indices de la tabla `restaurant_categories`
--
ALTER TABLE `restaurant_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `zones`
--
ALTER TABLE `zones`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `delivery_persons`
--
ALTER TABLE `delivery_persons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `restaurant_categories`
--
ALTER TABLE `restaurant_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `zones`
--
ALTER TABLE `zones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`);

--
-- Filtros para la tabla `product_categories`
--
ALTER TABLE `product_categories`
  ADD CONSTRAINT `product_categories_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `restaurants`
--
ALTER TABLE `restaurants`
  ADD CONSTRAINT `restaurants_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `restaurant_categories` (`id`),
  ADD CONSTRAINT `restaurants_ibfk_2` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
