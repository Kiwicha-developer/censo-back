exports.getAllUsers = async (req, res) => {
  try {
    const db = req.db; 
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return  res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return  res.status(500).json({ error: "Error al obtener usuarios." });
  }
};

exports.createUser = async (req, res) => {
  try {
    const db = req.db;
    const { dni, pass, nombre } = req.body;

    const userRef = db.collection("users");
    const snaUser = await userRef.where("dni", "==", dni).get();

    if (!snaUser.empty) {
      const userData = snaUser.docs[0].data();
      return res
        .status(409)
        .json({ error: `El usuario con el dni ${userData.dni} ya existe` });
    }

    // Codificar contraseña en Base64
    const encodedPass = Buffer.from(pass, "utf8").toString("base64");

    const docRef = await db.collection("users").add({
      dni,
      pass: encodedPass,
      nombre,
      rol: "usuario",
      activo: true,
    });

    return res.status(201).json({ id: docRef.id, dni, nombre });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const db = req.db;
    const {id, activo, nombre } = req.body;

    const userRef = db.collection("users").doc(id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(400).json({ error: "El usuario no se encontró" });
    }

    await userRef.update({
      nombre,
      activo
    });

    const updatedDoc = await userRef.get();
    const updatedUser = { id: updatedDoc.id, ...updatedDoc.data() };

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
