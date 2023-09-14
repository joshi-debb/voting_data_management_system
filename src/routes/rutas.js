const express = require('express');
const router = express.Router();

const { crear_modelo } = require('../controllers/crearmodelo');
const { eliminar_modelo } = require('../controllers/eliminarmodelo');
const { cargar_tab_temp } = require('../controllers/cargartabtemp');
const { consulta_1 } = require('../controllers/consulta1');
const { consulta_2 } = require('../controllers/consulta2');
const { consulta_3 } = require('../controllers/consulta3');
const { consulta_4 } = require('../controllers/consulta4');
const { consulta_5 } = require('../controllers/consulta5');
const { consulta_6 } = require('../controllers/consulta6');
// const { consulta_7 } = require('../controllers/consulta7');
// const { consulta_8 } = require('../controllers/consulta8');
// const { consulta_9 } = require('../controllers/consulta9');
// const { consulta_10 } = require('../controllers/consulta10');
const { consulta_11 } = require('../controllers/consulta11');


router.get('/crearmodelo', crear_modelo)
router.get('/eliminarmodelo', eliminar_modelo)
router.get('/cargartabtemp', cargar_tab_temp)
router.get('/consulta1', consulta_1)
router.get('/consulta2', consulta_2)
router.get('/consulta3', consulta_3)
router.get('/consulta4', consulta_4)
router.get('/consulta5', consulta_5)
router.get('/consulta6', consulta_6)
// router.get('/consulta7', consulta_7)
// router.get('/consulta8', consulta_8)
// router.get('/consulta9', consulta_9)
// router.get('/consulta10', consulta_10)
router.get('/consulta11', consulta_11)

module.exports = router;
