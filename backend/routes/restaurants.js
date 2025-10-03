// backend/routes/restaurants.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// Obtener todos los restaurantes con filtros
router.get("/", async (req, res) => {
  try {
    const { category, zone, search } = req.query;

    let query = `
      SELECT
        r.id,
        r.name,
        r.description,
        r.category_id,
        r.zone_id,
        r.is_active,
        r.rating,
          r.image_url,
        rc.name as category_name,
        z.name as zone_name
      FROM restaurants r
      LEFT JOIN restaurant_categories rc ON r.category_id = rc.id
      LEFT JOIN zones z ON r.zone_id = z.id
      WHERE r.is_active = 1
    `;

    const params = [];

    if (category && category !== 'all') {
      query += ` AND r.category_id = ?`;
      params.push(category);
    }

    if (zone && zone !== 'all') {
      query += ` AND r.zone_id = ?`;
      params.push(zone);
    }

    if (search) {
      query += ` AND (r.name LIKE ? OR r.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY r.rating DESC, r.name`;

    const [restaurants] = await pool.query(query, params);

    res.json({
      success: true,
      data: restaurants
    });
  } catch (error) {
    console.error("Error obteniendo restaurantes:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// Obtener restaurante específico con sus productos
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener información del restaurante
    const [restaurants] = await pool.query(`
      SELECT
        r.*,
        rc.name as category_name,
        z.name as zone_name
      FROM restaurants r
      LEFT JOIN restaurant_categories rc ON r.category_id = rc.id
      LEFT JOIN zones z ON r.zone_id = z.id
      WHERE r.id = ? AND r.is_active = 1
    `, [id]);

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado"
      });
    }

    const restaurant = restaurants[0];

    // Obtener categorías de productos del restaurante
    const [categories] = await pool.query(`
      SELECT * FROM product_categories
      WHERE restaurant_id = ? AND is_active = 1
      ORDER BY display_order, name
    `, [id]);

    // Obtener productos por categoría
    const [products] = await pool.query(`
      SELECT
        p.*,
        pc.name as category_name
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.restaurant_id = ? AND p.is_available = 1
      ORDER BY p.category_id, p.display_order, p.name
    `, [id]);

    // Agrupar productos por categoría
    const productsByCategory = categories.map(category => ({
      ...category,
      products: products.filter(product => product.category_id === category.id)
    }));

    res.json({
      success: true,
      data: {
        restaurant,
        categories: productsByCategory
      }
    });
  } catch (error) {
    console.error("Error obteniendo restaurante:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// Obtener productos de un restaurante específico
router.get("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el restaurante existe
    const [restaurants] = await pool.query(`
      SELECT id FROM restaurants WHERE id = ? AND is_active = 1
    `, [id]);

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado"
      });
    }

    // Obtener categorías de productos del restaurante
    const [categories] = await pool.query(`
      SELECT * FROM product_categories
      WHERE restaurant_id = ? AND is_active = 1
      ORDER BY display_order, name
    `, [id]);

    // Obtener productos por categoría
    const [products] = await pool.query(`
      SELECT
        p.*,
        pc.name as category_name
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.restaurant_id = ? AND p.is_available = 1
      ORDER BY p.category_id, p.display_order, p.name
    `, [id]);

    // Agrupar productos por categoría
    const productsByCategory = categories.map(category => ({
      ...category,
      products: products.filter(product => product.category_id === category.id)
    }));

    res.json({
      success: true,
      data: productsByCategory
    });
  } catch (error) {
    console.error("Error obteniendo productos del restaurante:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// Obtener categorías de restaurantes
router.get("/meta/categories", async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT * FROM restaurant_categories
      ORDER BY name
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// Obtener zonas
router.get("/meta/zones", async (req, res) => {
  try {
    const [zones] = await pool.query(`
      SELECT * FROM zones
      ORDER BY name
    `);

    res.json({
      success: true,
      data: zones
    });
  } catch (error) {
    console.error("Error obteniendo zonas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// Actualizar estado de restaurante (activar/desactivar)
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "El campo is_active debe ser un booleano"
      });
    }

    // Verificar que el restaurante existe
    const [restaurants] = await pool.query(`
      SELECT id FROM restaurants WHERE id = ?
    `, [id]);

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado"
      });
    }

    // Actualizar el estado del restaurante
    await pool.query(`
      UPDATE restaurants SET is_active = ? WHERE id = ?
    `, [is_active, id]);

    res.json({
      success: true,
      message: "Estado del restaurante actualizado correctamente"
    });
  } catch (error) {
    console.error("Error actualizando estado del restaurante:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// Buscar restaurantes y productos
router.get("/search/:term", async (req, res) => {
  try {
    const { term } = req.params;
    const searchTerm = `%${term}%`;

    // Buscar restaurantes
    const [restaurants] = await pool.query(`
      SELECT
        r.*,
        rc.name as category_name,
        z.name as zone_name,
        'restaurant' as type
      FROM restaurants r
      LEFT JOIN restaurant_categories rc ON r.category_id = rc.id
      LEFT JOIN zones z ON r.zone_id = z.id
      WHERE r.is_active = 1
      AND (r.name LIKE ? OR r.description LIKE ?)
      ORDER BY r.rating DESC
    `, [searchTerm, searchTerm]);

    // Buscar productos
    const [products] = await pool.query(`
      SELECT
        p.*,
        r.name as restaurant_name,
        r.rating as restaurant_rating,
        'product' as type
      FROM products p
      JOIN restaurants r ON p.restaurant_id = r.id
      WHERE p.is_available = 1
      AND r.is_active = 1
      AND (p.name LIKE ? OR p.description LIKE ?)
      ORDER BY p.name
    `, [searchTerm, searchTerm]);

    res.json({
      success: true,
      data: {
        restaurants,
        products,
        total: restaurants.length + products.length
      }
    });
  } catch (error) {
    console.error("Error en búsqueda:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});
// Crear restaurante
router.post("/", async (req, res) => {
  try {
    const { name, category_id, zone_id, image_url, description, rating } = req.body;
    if (!name || !category_id || !zone_id) {
      return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
    }
    await pool.query(
      `INSERT INTO restaurants (name, category_id, zone_id, image_url, description, rating, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [name, category_id, zone_id, image_url || '', description || '', rating || 0]
    );
    res.json({ success: true, message: "Restaurante creado correctamente" });
  } catch (error) {
    console.error("Error creando restaurante:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

// Editar restaurante
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, zone_id, image_url, description, rating } = req.body;
    // Verificar que el restaurante existe
    const [restaurants] = await pool.query(`SELECT id FROM restaurants WHERE id = ?`, [id]);
    if (restaurants.length === 0) {
      return res.status(404).json({ success: false, message: "Restaurante no encontrado" });
    }
    await pool.query(
      `UPDATE restaurants SET name = ?, category_id = ?, zone_id = ?, image_url = ?, description = ?, rating = ? WHERE id = ?`,
      [name, category_id, zone_id, image_url || '', description || '', rating || 0, id]
    );
    res.json({ success: true, message: "Restaurante actualizado correctamente" });
  } catch (error) {
    console.error("Error actualizando restaurante:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});
export default router;
