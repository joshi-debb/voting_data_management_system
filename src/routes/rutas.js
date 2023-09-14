const express = require('express');
const router = express.Router();

const { crear_modelo } = require('../controllers/crearmodelo');
const { eliminar_modelo } = require('../controllers/eliminarmodelo');
const { cargar_tab_temp } = require('../controllers/cargartabtemp');
const { consulta_1 } = require('../controllers/consulta1');


router.get('/crearmodelo', crear_modelo)
router.get('/eliminarmodelo', eliminar_modelo)
router.get('/cargartabtemp', cargar_tab_temp)
router.get('/consulta1', consulta_1)

module.exports = router;
