const db = require('../db/conexion');
const config = require('../db/config')
const mysql = require('mysql2/promise')


exports.consulta_9 = async (req, res) => {

    const scriptConsulta = `

    -- TOP 5 DE MESAS MAS FRECUENTADAS

    SELECT 
        VOTACION.id_mesa AS 'No Mesa',
        DEP.nombre_departamento AS Departamento,
        COUNT(VOTACION.id_votacion) AS 'Cantidad Votos'
    FROM
        bd1py1.voto VOTACION
            INNER JOIN
        bd1py1.mesa MESA ON VOTACION.id_mesa = MESA.id_mesa
            INNER JOIN
        bd1py1.departamento DEP ON MESA.id_departamento = DEP.id_departamento
    GROUP BY VOTACION.id_mesa
    ORDER BY COUNT(VOTACION.id_votacion) DESC
    LIMIT 5;


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
            consulta: '9',
            rows: rows.length,
            return: rows, // Los resultados de la consulta
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            body: { res: false, message: 'Error en consulta 9: ', error },
        });
    }
}

