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

    console.log(userData);
    if(userData.activo == false){
      return  res.status(403).json({ error: "Usuario desactivado" });
    }

    const token = jwt.sign(
      { id: userDoc.id, dni: userData.dni }, 
      process.env.JWT_SECRET || "clave_secreta_super_segura", 
      { expiresIn: "4h" } 
    );

    return  res.status(200).json({
      id: userDoc.id,
      nombre: userData.nombre,
      dni: userData.dni,
      rol: userData.rol,
      activo: userData.activo,
      token
    });
  } catch (error) {
    console.error("Error en login:", error);
    return  res.status(500).json({ error: "Error interno del servidor" });
  }
};
