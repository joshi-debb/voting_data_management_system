const db = require('../db/conexion');
const script = require('../db/script');

exports.crear_modelo = async (req, res) => {
    try {
        // Eliminar los comentarios del script SQL
        const scriptWithoutComments = script.replace(/(--.*)/g, '');

        // Ejecutar el script SQL sin comentarios
        const sqlCommands = scriptWithoutComments.split(";").map(command => command.trim());

        for (let i = 0; i < sqlCommands.length; i++) {
            sql = sqlCommands[i];
            if (sql.length === 0) {
                continue;
            }
            await db.query(sql,[]);
        }

        res.status(200).json({
            body: { res: true, message: 'Modelo Creado: BD1PY1' },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            body: { res: false, message: 'Error al Crear Modelo: BD1PY1', error },
        });
    }
}
