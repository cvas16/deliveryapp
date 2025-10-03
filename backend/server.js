import express from "express";

import cors from "cors";

import path from "path";

import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";

import restaurantRoutes from "./routes/restaurants.js";

import adminRoutes from "./routes/admin.js";

import orderRoutes from "./routes/order.js";

import deliveryPersonRoutes from "./routes/deliveryPerson.js";

const app = express();

app.use(cors());

app.use(express.json());

// Servir frontend (para evitar problemas CORS y poder abrir http://localhost:3000/)

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));

// Rutas API

app.use("/api/auth", authRoutes);

app.use("/api/restaurants", restaurantRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/delivery-persons", deliveryPersonRoutes);

// Ruta raíz

app.get("/api/health", (req, res) => res.json({ ok: true, message: "API funcionando" }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Servidor corriendo en http://localhost:3000`);

});
