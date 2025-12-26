exports.dataByDiscapacidad = async (req, res) => {
  try {
    const db = req.db;
    const personTotSnap = await db.collection("person").get()
    const personSnap = await db
    .collection("person")
    .where("discapacidad", "==", true)
    .get();


    const total = personTotSnap.size;

    return res.status(200).json({
    nodiscapacitados:total - personSnap.size,
    discapacitados: personSnap.size
    });
  } catch (error) {
    console.error("Error al obtener personas:", error);
    return res.status(500).json({ error: "Error al obtener personas." });
  }
};

exports.dataByEstadoCivil = async (req, res) => {
  try {
    const db = req.db;
    const solterosSnap = await db.collection("person").where("estadoCivil","==","Soltero(a)").get();
    const casadosSnap = await db.collection("person").where("estadoCivil","==","Casado(a)").get();
    const convivienteSnap = await db.collection("person").where("estadoCivil","==","Conviviente").get();
    const divorciadoSnap = await db.collection("person").where("estadoCivil","==","Divorciado").get();
    const viudoSnap = await db.collection("person").where("estadoCivil","==","Viudo(a)").get();

    return res.status(200).json({
    solteros:solterosSnap.size,
    casados:casadosSnap.size,
    convivientes:convivienteSnap.size,
    divorciados:divorciadoSnap.size,
    viudos:viudoSnap.size
    });
  } catch (error) {
    console.error("Error al obtener personas:", error);
    return res.status(500).json({ error: "Error al obtener personas." });
  }
};

exports.dataByGeneros = async (req, res) => {
  try {
    const db = req.db;
    const hombresSnap = await db.collection("person").where("sexo","==","Masculino").get();
    const muejrSnap = await db.collection("person").where("sexo","==","Femenino").get();
    const noBinSnap = await db.collection("person").where("sexo","==","No binario").get();
    const otrosSnap = await db.collection("person").where("sexo","==","Prefiero no decir").get();

    return res.status(200).json({
    femenino:muejrSnap.size,
    masculino:hombresSnap.size,
    nobinario:noBinSnap.size,
    otros:otrosSnap.size,
    });
  } catch (error) {
    console.error("Error al obtener personas:", error);
    return res.status(500).json({ error: "Error al obtener personas." });
  }
};

exports.dataByEstudios = async (req, res) => {
  try {
    const db = req.db;
    const primariaSnap = await db.collection("person").where("estudios","==","Primaria").get();
    const secundariaSnap = await db.collection("person").where("estudios","==","Secundaria").get();
    const tecnicoSnap = await db.collection("person").where("estudios","==","Técnico").get();
    const uniSnap = await db.collection("person").where("estudios","==","Universitario").get();
    const maestriaSnap = await db.collection("person").where("estudios","==","Posgrado").get();

    return res.status(200).json({
    primaria:primariaSnap.size,
    secundaria:secundariaSnap.size,
    tecnico:tecnicoSnap.size,
    universitario:uniSnap.size,
    maestria:maestriaSnap.size,
    });
  } catch (error) {
    console.error("Error al obtener personas:", error);
    return res.status(500).json({ error: "Error al obtener personas." });
  }
};