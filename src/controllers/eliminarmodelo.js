const db = require('../db/conexion');

exports.eliminar_modelo = async (req, res) => {

    const script = `
    
    -- BORRAR BASE DE DATOS

    DROP DATABASE IF EXISTS BD1PY1;

    -- BORRAR TABLA CIUDADANO

    DROP TABLE IF EXISTS BD1PY1.CIUDADANO;

    -- BORRAR TABLA PARTIDO

    DROP TABLE IF EXISTS BD1PY1.PARTIDO;

    -- BORRAR TABLA CARGO

    DROP TABLE IF EXISTS BD1PY1.CARGO;

    -- BORRAR TABLA CANDIDATO

    DROP TABLE IF EXISTS BD1PY1.CANDIDATO;

    -- BORRAR TABLA VOTO

    DROP TABLE IF EXISTS BD1PY1.VOTO;

    -- BORRAR TABLA DETALLE VOTO

    DROP TABLE IF EXISTS BD1PY1.DETALLE_VOTO;

    -- BORRAR TABLA DEPARTAMENTO

    DROP TABLE IF EXISTS BD1PY1.DEPARTAMENTO;

    -- BORRAR TABLA MESA

    DROP TABLE IF EXISTS BD1PY1.MESA;

    `;

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
            body: { res: true, message: 'Modelo Eliminado: BD1PY1' },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            body: { res: false, message: 'Error al Eliminar: BD1PY1', error },
        });
    }
}
