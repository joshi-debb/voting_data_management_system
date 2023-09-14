const db = require('../db/conexion');
const config = require('../db/config')
const mysql = require('mysql2/promise')
const fs = require('fs');
const path = require('path');
const filePath_Ciudadanos = path.join(__dirname, '../data/ciudadanos.csv');
const filePath_Candidatos = path.join(__dirname, '../data/candidatos.csv');
const filePath_Partidos = path.join(__dirname, '../data/partidos.csv');
const filePath_Cargos = path.join(__dirname, '../data/cargos.csv');
const filePath_Votaciones = path.join(__dirname, '../data/votaciones.csv');
const filePath_Mesas = path.join(__dirname, '../data/mesas.csv');
const filePath_Departamentos = path.join(__dirname, '../data/departamentos.csv');


exports.cargar_tab_temp = async (req, res) => {

    const scriptCrearTablasTemp = `
    
    -- Tabla temporal para Ciudadanos

    CREATE TEMPORARY TABLE BD1PY1.CIUDADANOTMP (
        dpi VARCHAR(13) NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        apellido VARCHAR(50) NOT NULL,
        direccion VARCHAR(100) NOT NULL,
        telefono VARCHAR(10) NOT NULL,
        edad INT NOT NULL,
        genero VARCHAR(1) NOT NULL,

        PRIMARY KEY (dpi)
    );
    
    -- Tabla temporal para Candidatos
        
    CREATE TEMPORARY TABLE BD1PY1.CANDIDATOTMP (
        id_candidato INT NOT NULL AUTO_INCREMENT,
        nombres_candidato VARCHAR(50) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        id_partido INT NOT NULL,
        id_cargo INT NOT NULL,

        PRIMARY KEY (id_candidato)
    );

    -- Tabla temporal para Partidos

    CREATE TEMPORARY TABLE BD1PY1.PARTIDOTMP (
        id_partido INT NOT NULL AUTO_INCREMENT,
        nombre_partido VARCHAR(50) NOT NULL,
        siglas VARCHAR(20) NOT NULL,
        fundacion DATE NOT NULL,

        PRIMARY KEY (id_partido)
    );

    -- Tabla temporal para Cargos

    CREATE TEMPORARY TABLE BD1PY1.CARGOTMP (
        id_cargo INT NOT NULL AUTO_INCREMENT,
        cargo VARCHAR(100) NOT NULL,

        PRIMARY KEY (id_cargo)
    );

    -- Tabla temporal para Votaciones

    CREATE TEMPORARY TABLE BD1PY1.VOTOTMP (
        id_votacion INT NOT NULL AUTO_INCREMENT,
        fechayhora DATETIME NOT NULL,
        dpi VARCHAR(13) NOT NULL,
        id_mesa INT NOT NULL,

        PRIMARY KEY (id_votacion)
    );


    CREATE TEMPORARY TABLE BD1PY1.DETALLE_VOTOTMP (
        id_detalle_voto INT NOT NULL AUTO_INCREMENT,
        id_votacion INT NOT NULL,
        id_candidato INT NOT NULL,

        PRIMARY KEY (id_detalle_voto)

    );

    -- Tabla temporal para Mesas

    CREATE TEMPORARY TABLE BD1PY1.MESATMP (
        id_mesa INT NOT NULL AUTO_INCREMENT,
        id_departamento INT NOT NULL,

        PRIMARY KEY (id_mesa)
    );

    -- Tabla temporal para Departamentos

    CREATE TEMPORARY TABLE BD1PY1.DEPARTAMENTOTMP (
        id_departamento INT NOT NULL AUTO_INCREMENT,
        nombre_departamento VARCHAR(50) NOT NULL,

        PRIMARY KEY (id_departamento)
    );

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

        // carga de datos csv a tablas temporales
        // ---------------------------------------------------------------------------------------------

        // Cargar datos de ciudadanos
        const datosClientes = fs.readFileSync(filePath_Ciudadanos, 'utf-8');
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

            // Insertar los datos en la tabla temporal
            await db.querywithoutclose(connection, `INSERT INTO BD1PY1.CIUDADANOTMP (dpi, nombre, apellido, direccion, telefono, edad, genero ) VALUES (?, ?, ?, ?, ?, ?, ?)`, [dpi, nombre, apellido, direccion, telefono, edad, genero]);
        }

    
        // Cargar datos de partidos
        const datosPartidos = fs.readFileSync(filePath_Partidos, 'utf-8');
        const lines3 = datosPartidos.split('\n');
        for (let i = 1; i < lines3.length; i++) {
            const fields = lines3[i].split(',');
            const id_partido = fields[0];
            const nombre_partido = fields[1];
            const siglas = fields[2];
            const fecha_fundac = fields[3];

            //Convertir la fecha de fundacion
            const fundacion = convertirFecha(fecha_fundac);


            //Insertar los datos en la tabla temporal
            await db.querywithoutclose(connection, `INSERT INTO BD1PY1.PARTIDOTMP (id_partido, nombre_partido, siglas, fundacion ) VALUES (?, ?, ?, ?)`, [id_partido, nombre_partido, siglas, fundacion]);
        }

        // Cargar datos de cargos
        const datosCargos = fs.readFileSync(filePath_Cargos, 'utf-8');
        const lines4 = datosCargos.split('\n');
        for (let i = 1; i < lines4.length; i++) {
            const fields = lines4[i].split(',');
            const id_cargo = fields[0];
            const cargo = fields[1];

            //Insertar los datos en la tabla temporal
            await db.querywithoutclose(connection, `INSERT INTO BD1PY1.CARGOTMP (id_cargo, cargo ) VALUES (?, ?)`, [id_cargo, cargo]);
        }

        // Cargar datos de candidatos
        const datosCandidatos = fs.readFileSync(filePath_Candidatos, 'utf-8');
        const lines2 = datosCandidatos.split('\n');
        for (let i = 1; i < lines2.length; i++) {
            const fields = lines2[i].split(',');
            const id_candidato = fields[0];
            const nombres_candidato = fields[1];
            const fecha_nac = fields[2];

            //Convertir la fecha de nacimiento
            const fecha_nacimiento = convertirFecha(fecha_nac);

            const id_partido = fields[3];
            const id_cargo = fields[4];

            //Insertar los datos en la tabla temporal
            await db.querywithoutclose(connection, `INSERT INTO BD1PY1.CANDIDATOTMP (id_candidato, nombres_candidato, fecha_nacimiento, id_partido, id_cargo ) VALUES (?, ?, ?, ?, ?)`, [id_candidato, nombres_candidato, fecha_nacimiento, id_partido, id_cargo]);
        }
            

        // Cargar datos de mesas
        const datosMesas = fs.readFileSync(filePath_Mesas, 'utf-8');
        const lines5 = datosMesas.split('\n');
        for (let i = 1; i < lines5.length; i++) {
            const fields = lines5[i].split(',');
            const id_mesa = fields[0];
            const id_departamento = fields[1];

            //Insertar los datos en la tabla temporal
            await db.querywithoutclose(connection, `INSERT INTO BD1PY1.MESATMP (id_mesa, id_departamento ) VALUES (?, ?)`, [id_mesa, id_departamento]);
        }

        // Cargar datos de departamentos
        const datosDepartamentos = fs.readFileSync(filePath_Departamentos, 'utf-8');
        const lines6 = datosDepartamentos.split('\n');
        for (let i = 1; i < lines6.length; i++) {
            const fields = lines6[i].split(',');
            const id_departamento = fields[0];
            const nombre_departamento = fields[1];

            //Insertar los datos en la tabla temporal
            await db.querywithoutclose(connection, `INSERT INTO BD1PY1.DEPARTAMENTOTMP (id_departamento, nombre_departamento ) VALUES (?, ?)`, [id_departamento, nombre_departamento]);
        }

        // Cargar datos de votaciones
        const datosVotaciones = fs.readFileSync(filePath_Votaciones, 'utf-8');
        const lines7 = datosVotaciones.split('\n');

        const existingDPIs = new Set(); // Utiliza un Set para mantener un registro de los DPIs existentes

        for (let i = 1; i < lines7.length; i++) {
            const fields = lines7[i].split(',');
            const id_votacion = fields[0];
            const id_candidato = fields[1];
            const dpi = fields[2];
            const id_mesa = fields[3];
            const fyh = fields[4];

            const fechayhora = convertirFechaHora(fyh);

            // Verificar si el DPI ya existe en la tabla temporal
            if (!existingDPIs.has(dpi)) {
                // Insertar los datos en la tabla temporal
                await db.querywithoutclose(connection, `INSERT INTO BD1PY1.VOTOTMP (fechayhora, dpi, id_mesa ) VALUES (?, ?, ?)`, [fechayhora, dpi, id_mesa]);
                existingDPIs.add(dpi); // Agregar el DPI al Set para evitar duplicados
            }

            //Insertar los datos en la tabla temporal
            await db.querywithoutclose(connection, `INSERT INTO BD1PY1.DETALLE_VOTOTMP (id_votacion, id_candidato ) VALUES (?, ?)`, [id_votacion, id_candidato]);
            
        }

        // por ultimo pasamos los datos de la tabla temporal a la tabla original
        //------------------------------------------------------------------------------------------

        await db.querywithoutclose(connection, `INSERT INTO BD1PY1.CIUDADANO (dpi, nombre, apellido, direccion, telefono, edad, genero) SELECT dpi, nombre, apellido, direccion, telefono, edad, genero FROM BD1PY1.CIUDADANOTMP`, []);
        await db.querywithoutclose(connection, `INSERT INTO BD1PY1.PARTIDO (id_partido, nombre_partido, siglas, fundacion) SELECT id_partido, nombre_partido, siglas, fundacion FROM BD1PY1.PARTIDOTMP`, []);
        await db.querywithoutclose(connection, `INSERT INTO BD1PY1.CARGO (id_cargo, cargo) SELECT id_cargo, cargo FROM BD1PY1.CARGOTMP`, []);
        await db.querywithoutclose(connection, `INSERT INTO BD1PY1.CANDIDATO (id_candidato, nombres, fecha_nac, id_partido, id_cargo) SELECT id_candidato, nombres_candidato, fecha_nacimiento, id_partido, id_cargo FROM BD1PY1.CANDIDATOTMP`, []);
        await db.querywithoutclose(connection, `INSERT INTO BD1PY1.DEPARTAMENTO (id_departamento, nombre_departamento) SELECT id_departamento, nombre_departamento FROM BD1PY1.DEPARTAMENTOTMP`, []);
        await db.querywithoutclose(connection, `INSERT INTO BD1PY1.MESA (id_mesa, id_departamento) SELECT id_mesa, id_departamento FROM BD1PY1.MESATMP`, []);

        await db.querywithoutclose(connection, `INSERT INTO BD1PY1.VOTO (fechayhora, dpi, id_mesa) SELECT fechayhora, dpi, id_mesa FROM BD1PY1.VOTOTMP`, []);        
        await db.querywithoutclose(connection, `INSERT INTO BD1PY1.DETALLE_VOTO (id_votacion, id_candidato) SELECT id_votacion, id_candidato FROM BD1PY1.DETALLE_VOTOTMP`, []);


        // Cierra la conexión
        await connection.end();

        res.status(200).json({
            body: { res: true, message: 'Carga masiva de datos a tabla temporal, Cargar datos a modelo: BD1PY1 & Eliminar datos de tabla temporal Realizados con exito!' },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            body: { res: false, message: 'Error en carga masiva: ', error },
        });
    }
}



function convertirFecha(fecha) {
    const aux = limpiarCaracterR(fecha);

    const partes = aux.split('/');
    if (partes.length === 3) {
        const dia = partes[0];
        const mes = partes[1];
        const anio = partes[2];
        return `${anio}-${mes}-${dia}`;
    }
    return fecha; // Si no se puede convertir, devuelve la fecha original
}

function convertirFechaHora(fechaHoraSucia) {
    const partes = fechaHoraSucia.split(' ');
    if (partes.length === 2) {
        const fechaPartes = partes[0].split('/');
        const horaPartes = partes[1].split(':');
        if (fechaPartes.length === 3 && horaPartes.length === 2) {
            const anio = fechaPartes[2];
            const mes = fechaPartes[1];
            const dia = fechaPartes[0];
            const hora = horaPartes[0];
            const minutos = horaPartes[1];
            return `${anio}-${mes}-${dia} ${hora}:${minutos}:00`;
        }
    }
    return null; // Devuelve null si no se puede convertir
}

function limpiarCaracterR(cadena) {
    // Utiliza una expresión regular para reemplazar todos los caracteres "\r" con una cadena vacía.
    return cadena.replace(/\r/g, '');
}