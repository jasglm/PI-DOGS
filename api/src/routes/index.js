const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { getDogs } = require("../controllers/getDogs");
const { getDogsById } = require("../controllers/getDogsById");
const { searchDogsByName } = require("../controllers/getDogsByName");
const { getTemperaments } = require("../controllers/getTemperament");
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/dogs", getDogs);
router.get("/dogs/byname", searchDogsByName);
router.get("/dogs/:id", getDogsById);
router.get("/temperaments", getTemperaments);
module.exports = router;
