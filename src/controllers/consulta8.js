const db = require('../db/conexion');
const config = require('../db/config')
const mysql = require('mysql2/promise')


exports.consulta_8 = async (req, res) => {

    const scriptConsulta = `

    -- TOP 10 DE CANDIDATOS MAS VOTADOS PARA PRESIDENTE Y VICEPRESIDENTE

    SELECT 
        GROUP_CONCAT(DISTINCT CAND.nombres) AS Presidente,
        GROUP_CONCAT(DISTINCT VICE.nombres) AS Vicepresidente,
        COUNT(DETVOT.id_votacion) AS 'Votos Totales'
    FROM
        bd1py1.detalle_voto DETVOT
            INNER JOIN
        bd1py1.candidato CAND ON DETVOT.id_candidato = CAND.id_candidato
            INNER JOIN
        bd1py1.candidato VICE ON CAND.id_partido = VICE.id_partido
            AND CAND.id_cargo = 1
            AND VICE.id_cargo = 2
            INNER JOIN
        bd1py1.partido PART ON CAND.id_partido = PART.id_partido
    GROUP BY PART.siglas
    ORDER BY COUNT(DETVOT.id_votacion) DESC
    LIMIT 10;
    
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
            consulta: '8',
            rows: rows.length,
            return: rows, // Los resultados de la consulta
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            body: { res: false, message: 'Error en consulta 8: ', error },
        });
    }
}

