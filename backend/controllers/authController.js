const bcrypt = require("bcrypt");
const db = require("../db");


exports.register = async (req, res) => {
    const { firstName, lastName, email, phone, address, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            "INSERT INTO users (first_name, last_name, email, phone, address, password) VALUES (?, ?, ?, ?, ?, ?)",
            [firstName, lastName, email, phone, address, hashedPassword],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Usuario registrado correctamente" });
            }
        );
    } catch (err) {
        res.status(500).json({ error: "Error al registrar usuario" });
    }
};

exports.login = (req, res) => {
    const { email, password, isAdmin } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

        const user = results[0];
        if (!user.password) return res.status(401).json({ error: "Usuario sin contraseña configurada" });

        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });
        if (isAdmin && !user.is_admin) return res.status(403).json({ error: "No tienes permisos de administrador" });

        res.json({ message: "Login exitoso", user: { id: user.id, email: user.email, isAdmin: user.is_admin } });
    });
};
