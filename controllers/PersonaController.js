const moment = require("moment");

exports.getPersonasByDate = async (req, res) => {
  try {
    const db = req.db; 
    const { startdate, enddate, docuser } = req.query;

    const start = moment(startdate, "DD/MM/YYYY");
    const end = moment(enddate, "DD/MM/YYYY");

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ error: "Formato de fecha inválido." });
    }
    if (start.isAfter(end)) {
      return res.status(400).json({ error: "La fecha inicial no puede ser mayor a la final." });
    }

    const userSnap = await db.collection("user")
      .where("dni", "==", docuser)
      .get();

    const userData = userSnap.empty ? null : {
      id: userSnap.docs[0].id,
      ...userSnap.docs[0].data()
    };

    let query = db.collection("person")
      .where("fechaCreacion", ">=", start.toDate())
      .where("fechaCreacion", "<=", end.toDate());

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
          ? moment(data.fechaCreacion.toDate()).format("DD/MM/YYYY") 
          : null,
        fechaNam: data.fechaNam 
          ? moment(data.fechaNam.toDate()).format("DD/MM/YYYY") 
          : null,
        usuario: userData ? userData.nombre : null
      };
    });

    return res.status(200).json(personas);
  } catch (error) {
    console.error("Error al obtener personas:", error);
    res.status(500).json({ error: "Error al obtener personas." });
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
      fechaNam: moment(fechaNam, "DD/MM/YYYY").toDate(),
      idioma,
      ingresos,
      nombres,
      ocupacion,
      origen,
      sexo,
      fechaCreacion: new Date()
    });

    //aca faltaaaaa

    const newDocSnap = await newDocRef.get();

    return res.status(201).json({ id: newDocSnap.id, ...newDocSnap.data() });
  } catch (error) {
    console.error("Error al crear persona:", error);
    res.status(500).json({ error: "Error al crear persona." });
  }
}