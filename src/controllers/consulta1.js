const db = require('../db/conexion');
const config = require('../db/config')
const mysql = require('mysql2/promise')


exports.consulta_1 = async (req, res) => {

    const scriptCrearTablasTemp = `
        SELECT bd1py1.candidato.nombres, bd1py1.partido.nombre_partido
        FROM bd1py1.candidato
        INNER JOIN bd1py1.partido ON bd1py1.candidato.id_partido = bd1py1.partido.id_partido;
    `;

     
    try {
        // Crear una conexión que se cerrará automáticamente al terminar
        const connection = await mysql.createConnection(config.db);
        // Eliminar los comentarios del script SQL
        const scriptWithoutComments = scriptCrearTablasTemp.replace(/(--.*)/g, '');

        // Ejecutar el script SQL sin comentarios
        const sqlCommands = scriptWithoutComments.split(";").map(command => command.trim());

        for (let i = 0; i < sqlCommands.length; i++) {
            const sql = sqlCommands[i];
            if (sql.length === 0) {
                continue;
            }
            await db.querywithoutclose(connection, sql, []);
        }

        // Hacemos la consulta a la base de datos
        const [rows] = await connection.query(scriptCrearTablasTemp);


        // Cierra la conexión
        await connection.end();

        res.status(200).json({
            res: true,
            data: rows, // Los resultados de la consulta
        });

        // res.status(200).json({
        //     body: { res: true, message: 'recibimos la respuesta' },
        // });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            body: { res: false, message: 'Error en consulta 1: ', error },
        });
    }
}
