//CONFIGURACION
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/firebase');

const app = express();
//RUTAS
const testRoute = require('./routes/test');
const userRoute = require('./routes/UserRoute');
const loginRoute = require('./routes/LoginRoute');
const personaRoute = require('./routes/PersonaRoute');
const dataRoute = require("./routes/DataRoute");
//PUERTOS
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use((req, res, next) => {
  req.db = db;
  next();
});

// app.use(express.json());

app.use('/test', testRoute);
app.use('/user', userRoute);
app.use('/login', loginRoute);
app.use('/persona', personaRoute);
app.use('/data',dataRoute);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
