exports.getPersonasByDate = async (req,res) => {
    try {
    const db = req.db; 
    const {startdate,enddate} = req.query;

    const personasRef = db.collection('personas');
    const snapshot = await personasRef
                    .where('fecha', '>=', new Date(startdate))
                    .where('fecha', '<=', new Date(enddate))
                    .get();
    
    const personas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(personas);
  } catch (error) {
    console.error("Error al obtener personas:", error);
    res.status(500).json({ error: "Error al obtener personas." });
  }
}

exports.createPersona = async (req,res) =>{
    try {
    const db = req.db; 
    const {nombres,doc} = req.body;

    //aca faltaaaaa

    res.status(200).json(personas);
  } catch (error) {
    console.error("Error al crear persona:", error);
    res.status(500).json({ error: "Error al crear persona." });
  }
}