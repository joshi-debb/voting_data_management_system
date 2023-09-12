const db = require('../db/conexion');
const config = require('../db/config')
const mysql = require('mysql2/promise')
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/ciudadanos.csv');

exports.crearTabtemp = async (req, res) => {

    const scriptCrearTablasTemp = `
    -- Tabla temporal para Ciudadanos
    CREATE TEMPORARY TABLE BD1PY1.CIUDADANOTMP (
        dpi VARCHAR(100) NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        apellido VARCHAR(50) NOT NULL,
        direccion VARCHAR(200) NOT NULL,
        telefono VARCHAR(10) NOT NULL,
        edad VARCHAR(2) NOT NULL,
        genero VARCHAR(1) NOT NULL
    );`;

    
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

        // carga de datos csv a tabla temporal
        const datosClientes = fs.readFileSync(filePath, 'utf-8');
        const lines = datosClientes.split('\n');
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(',');
            const dpi = fields[0];
            const nombre = fields[1];
            const apellido = fields[2];
            const direccion = fields[3];
            const telefono = fields[4];
            const edad = fields[5];
            const genero = fields[6];

            //console.log("vamos dentro: ",dpi, nombre, apellido, direccion, telefono, edad, genero);
            // Insertar los datos en la tabla temporal
            await db.querywithoutclose(connection, `INSERT INTO BD1PY1.CIUDADANOTMP (dpi, nombre, apellido, direccion, telefono, edad, genero ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [dpi, nombre, apellido, direccion, telefono, edad, genero]);
        }

        const tempClientesData = await db.querywithoutclose(connection, `SELECT * FROM BD1PY1.CIUDADANOTMP`, []);
        console.log(tempClientesData);

        // // por ultimo pasamos los datos de la tabla temporal a la tabla clientes
        await db.querywithoutclose(connection, `INSERT INTO BD1PY1.CIUDADANO (dpi, nombre, apellido, direccion, telefono, edad, genero) SELECT dpi, nombre, apellido, direccion, telefono, edad, genero FROM BD1PY1.CIUDADANOTMP`, []);

        // Cierra la conexión
        await connection.end();

        res.status(200).json({
            body: { res: true, message: 'Carga masiva de datos a tabla temporal exitosa!' },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            body: { res: false, message: 'Ocurrio un problema con la carga masiva :[', error },
        });
    }
}
