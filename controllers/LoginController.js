const jwt = require('jsonwebtoken');
exports.login = async (req, res) => {
  try {
    const db = req.db;
    const { dni, pass } = req.body; 

    const encodedPass = Buffer.from(pass, 'utf8').toString('base64');

    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('dni', '==', dni)
      .where('pass', '==', encodedPass)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Credenciales inválidas" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const token = jwt.sign(
      { id: userDoc.id, dni: userData.dni }, 
      process.env.JWT_SECRET || "clave_secreta_super_segura", 
      { expiresIn: "4h" } 
    );

    res.status(200).json({
      id: userDoc.id,
      nombre: userData.nombre,
      dni: userData.dni,
      token
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};