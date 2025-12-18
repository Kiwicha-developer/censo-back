const moment = require("moment");

exports.getPersonasByDate = async (req, res) => {
  try {
    const db = req.db; 
    const { startdate, enddate, iduser } = req.query;

    let query = db.collection("person")
      .where("fechaCreacion", ">=", moment(startdate, "DD/MM/YYYY").toDate())
      .where("fechaCreacion", "<=", moment(enddate, "DD/MM/YYYY").toDate());

    // Si viene iduser, agregamos filtro
    if (iduser) {
      query = query.where("iduser", "==", iduser);
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
          : null
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