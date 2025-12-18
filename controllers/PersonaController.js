const moment = require("moment");

exports.getPersonasByDate = async (req, res) => {
  try {
    const db = req.db;
    const { startdate, enddate, docuser } = req.query;

    const start = moment(startdate, ["YYYY-MM-DD", "DD-MM-YYYY"], true);
    const end = moment(enddate, ["YYYY-MM-DD", "DD-MM-YYYY"], true);

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ error: "Formato de fecha inválido." });
    }

    if (start.isAfter(end)) {
      return res.status(400).json({ error: "La fecha inicial no puede ser mayor a la final." });
    }

    const startDate = start.startOf("day").toDate();
    const endDate = end.endOf("day").toDate();

    const cleanDocUser = docuser?.trim();

    let userData = null;

    if (cleanDocUser) {
      const userSnap = await db
        .collection("users")
        .where("dni", "==", cleanDocUser)
        .limit(1)
        .get();

      if (userSnap.empty) {
        return res.status(200).json([]);
      }

      userData = {
        id: userSnap.docs[0].id,
        ...userSnap.docs[0].data()
      };
    }

    let query = db
      .collection("person")
      .where("fechaCreacion", ">=", startDate)
      .where("fechaCreacion", "<=", endDate);

    if (userData) {
      query = query.where("iduser", "==", userData.id);
    }

    const snapshot = await query.get();

    const personas = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        fechaCreacion: data.fechaCreacion
          ? moment(data.fechaCreacion.toDate()).format("DD-MM-YYYY")
          : null,
        fechaNam: data.fechaNam
          ? moment(data.fechaNam.toDate()).format("DD-MM-YYYY")
          : null,
        usuario: userData?.nombre ?? null
      };
    });

    return res.status(200).json(personas);
  } catch (error) {
    console.error("Error al obtener personas:", error);
    return res.status(500).json({ error: "Error al obtener personas." });
  }
};

exports.createPersona = async (req,res) =>{
    try {
    const db = req.db; 
    const {iduser,cantHijos,discapacidad,doc,estadoCivil,estudios,fechaNam,idioma,ingresos,nombres,ocupacion,origen,sexo} = req.body;

    const docSnap = await db.collection("person")
      .where("doc", "==", doc)
      .get();

    docSnap.forEach(doc => {
      console.log(doc.id, doc.data());
    });

    if (!docSnap.empty) {
      const personData = docSnap.docs[0].data();
      return res
        .status(409)
        .json({ error: `La persona con el documento ${personData.doc} ya existe` });
    }

    const newDocRef = await db.collection("person").add({
      iduser,
      cantHijos,
      discapacidad,
      doc,
      estadoCivil,
      estudios,
      fechaNam: moment(fechaNam, "DD-MM-YYYY").toDate(),
      idioma,
      ingresos,
      nombres,
      ocupacion,
      origen,
      sexo,
      fechaCreacion: new Date()
    });


    const newDocSnap = await newDocRef.get();

    const data = newDocSnap.data();

    return res.status(201).json({
      id: newDocSnap.id,
      ...data,
      fechaNam: data.fechaNam
        ? moment(data.fechaNam.toDate()).format("DD-MM-YYYY")
        : null,
      fechaCreacion: data.fechaCreacion
        ? moment(data.fechaCreacion.toDate()).format("DD-MM-YYYY")
        : null
    });

  } catch (error) {
    console.error("Error al crear persona:", error);
    res.status(500).json({ error: "Error al crear persona." });
  }
}

exports.deletePersona = async (req,res) =>{
  try {
    const db = req.db;
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    const docRef = db.collection("person").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "La persona no existe" });
    }

    await docRef.delete();

    return res.status(200).json({
      message: "Persona eliminada correctamente",
      id
    });

  } catch (error) {
    console.error("Error al eliminar persona:", error);
    return res.status(500).json({ error: "Error al eliminar persona." });
  }
}