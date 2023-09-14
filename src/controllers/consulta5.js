const db = require('../db/conexion');
const config = require('../db/config')
const mysql = require('mysql2/promise')


exports.consulta_5 = async (req, res) => {

    const scriptConsulta = `

    -- CANTIDAD DE VOTACIONES POR DEPARTAMENTO

    SELECT 
        D.nombre_departamento AS 'DEPARTAMENTO',
        COUNT(*) AS 'VOTOS'
    FROM
        BD1PY1.VOTO V
            INNER JOIN
        BD1PY1.MESA M ON V.id_mesa = M.id_mesa
            INNER JOIN
        BD1PY1.DEPARTAMENTO D ON M.id_departamento = D.id_departamento
    GROUP BY D.nombre_departamento;

    
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
            res: true,
            data: rows, // Los resultados de la consulta
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            body: { res: false, message: 'Error en consulta 5: ', error },
        });
    }
}

