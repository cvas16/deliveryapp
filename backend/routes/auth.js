// backend/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, phone, address, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, address, password)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phone || null, address || null, hashed]
    );

    return res.status(201).json({ success: true, userId: result.insertId , message: "Usuario registrado correctamente" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "El correo ya está registrado" });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password, isAdmin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Faltan campos" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Contraseña incorrecta" });

    if (isAdmin && !user.isAdmin) {
      return res.status(403).json({ success: false, message: "No tienes permisos de administrador" });
    }

    // enviar user sin password
    const payload = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      isAdmin: !!user.is_admin
    };

    return res.json({ success: true, message: "Login exitoso", user: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
});

export default router;
