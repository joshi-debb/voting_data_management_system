const db = require('../db/conexion');
const config = require('../db/config')
const mysql = require('mysql2/promise')


exports.consulta_1 = async (req, res) => {

    const scriptConsulta = `

    -- NOMBRE DE LOS CANDIDATOS A PRESIDENTE Y VICEPRESIDENTE POR PARTIDO

    SELECT 
        PRES.nombres AS Presidente,
        VICE.nombres AS Vicepresidente,
        PART.siglas AS Partido
    FROM
        bd1py1.candidato PRES
            INNER JOIN
        bd1py1.candidato VICE ON PRES.id_partido = VICE.id_partido
            AND PRES.id_cargo = 1
            AND VICE.id_cargo = 2
            INNER JOIN
        bd1py1.partido PART ON PRES.id_partido = PART.id_partido;
    
    `;

     
    try {
        // Crear una conexión que se cerrará automáticamente al terminar
        const connection = await mysql.createConnection(config.db);
        // Eliminar los comentarios del script SQL
        const scriptWithoutComments = scriptConsulta.replace(/(--.*)/g, '');

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
        const [rows] = await connection.query(scriptConsulta);


        // Cierra la conexión
        await connection.end();

        res.status(200).json({
            consulta: '1',
            rows: rows.length,
            return: rows, // Los resultados de la consulta
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            body: { res: false, message: 'Error en consulta 1: ', error },
        });
    }
}

