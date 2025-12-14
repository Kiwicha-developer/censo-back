exports.getAllUsers = async (req, res) => {
  try {
    const db = req.db; 
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios." });
  }
};

exports.createUser = async (req, res) => {
  try {
    const db = req.db;
    const { dni, pass, nombre } = req.body;

    // Codificar contraseña en Base64
    const encodedPass = Buffer.from(pass, 'utf8').toString('base64');

    const docRef = await db.collection('users').add({
      dni,
      pass: encodedPass,
      nombre
    });

    res.status(201).json({ id: docRef.id, dni, nombre });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};