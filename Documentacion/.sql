-- Descripcion: Script para crear la base de datos del proyecto

-- CREAR BASE DE DATOS

CREATE SCHEMA IF NOT EXISTS BD1PY1;

--  CREAR TABLA CIUDADANO

CREATE TABLE IF NOT EXISTS BD1PY1.CIUDADANO (
  dpi VARCHAR(13) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  telefono VARCHAR(10) NOT NULL,
  edad INT NOT NULL,
  genero VARCHAR(1) NOT NULL,

  PRIMARY KEY (dpi)

);

-- CREAR TABLA PARTIDO

CREATE TABLE IF NOT EXISTS BD1PY1.PARTIDO (
    id_partido INT NOT NULL AUTO_INCREMENT,
    nombre_partido VARCHAR(50) NOT NULL,
    siglas VARCHAR(10) NOT NULL,
    fundacion DATE NOT NULL,

    PRIMARY KEY (id_partido)
);

-- CREAR TABLA CARGO

CREATE TABLE IF NOT EXISTS BD1PY1.CARGO (
    id_cargo INT NOT NULL AUTO_INCREMENT,
    cargo VARCHAR(100) NOT NULL,

    PRIMARY KEY (id_cargo)
);

-- CREAR TABLA CANDIDATO
    
CREATE TABLE IF NOT EXISTS BD1PY1.CANDIDATO (
    id_candidato INT NOT NULL AUTO_INCREMENT,
    nombres VARCHAR(50) NOT NULL,
    fecha_nac DATE NOT NULL,
    id_partido INT NOT NULL,
    id_cargo INT NOT NULL,

    PRIMARY KEY (id_candidato),
    FOREIGN KEY (id_partido) REFERENCES PARTIDO(id_partido),
    FOREIGN KEY (id_cargo) REFERENCES CARGO(id_cargo)
    
);

-- CREAR TABLA DEPARTAMENTO

CREATE TABLE IF NOT EXISTS BD1PY1.DEPARTAMENTO (
    id_departamento INT NOT NULL AUTO_INCREMENT,
    nombre_departamento VARCHAR(50) NOT NULL,

    PRIMARY KEY (id_departamento)
);

-- CREAR TABLA MESA

CREATE TABLE IF NOT EXISTS BD1PY1.MESA (
    id_mesa INT NOT NULL AUTO_INCREMENT,
    id_departamento INT NOT NULL,

    PRIMARY KEY (id_mesa),
    FOREIGN KEY (id_departamento) REFERENCES DEPARTAMENTO(id_departamento)

);

-- CREAR TABLA VOTO

CREATE TABLE IF NOT EXISTS BD1PY1.VOTO (
    id_votacion INT NOT NULL AUTO_INCREMENT,
    fechayhora DATETIME NOT NULL,
    dpi VARCHAR(13) NOT NULL,
    id_mesa INT NOT NULL,

    PRIMARY KEY (id_votacion),
    FOREIGN KEY (dpi) REFERENCES CIUDADANO(dpi),
    FOREIGN KEY (id_mesa) REFERENCES MESA(id_mesa)
);

-- CREAR TABLA DETALLE_VOTO

CREATE TABLE IF NOT EXISTS BD1PY1.DETALLE_VOTO (
    id_detalle_voto INT NOT NULL AUTO_INCREMENT,
    id_votacion INT NOT NULL,
    id_candidato INT NOT NULL,
    PRIMARY KEY (id_detalle_voto),
    FOREIGN KEY (id_votacion)
        REFERENCES VOTO (id_votacion),
    FOREIGN KEY (id_candidato)
        REFERENCES CANDIDATO (id_candidato)
);


-- Descripcion: Script para crear las tablas temporales del proyecto

-- CREAR TABLA TEMPORAL PARA CIUDADANOS

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

-- CREAR TABLA TEMPORAL PARA CANDIDATOS
    
CREATE TEMPORARY TABLE BD1PY1.CANDIDATOTMP (
    id_candidato INT NOT NULL AUTO_INCREMENT,
    nombres_candidato VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    id_partido INT NOT NULL,
    id_cargo INT NOT NULL,

    PRIMARY KEY (id_candidato)
);

-- CREAR TABLA TEMPORAL PARA PARTIDOS

CREATE TEMPORARY TABLE BD1PY1.PARTIDOTMP (
    id_partido INT NOT NULL AUTO_INCREMENT,
    nombre_partido VARCHAR(50) NOT NULL,
    siglas VARCHAR(20) NOT NULL,
    fundacion DATE NOT NULL,

    PRIMARY KEY (id_partido)
);

-- CREAR TABLA TEMPORAL PARA CARGOS

CREATE TEMPORARY TABLE BD1PY1.CARGOTMP (
    id_cargo INT NOT NULL AUTO_INCREMENT,
    cargo VARCHAR(100) NOT NULL,

    PRIMARY KEY (id_cargo)
);

-- CREAR TABLA TEMPORAL PARA VOTACIONES

CREATE TEMPORARY TABLE BD1PY1.VOTOTMP (
    id_votacion INT NOT NULL AUTO_INCREMENT,
    fechayhora DATETIME NOT NULL,
    dpi VARCHAR(13) NOT NULL,
    id_mesa INT NOT NULL,

    PRIMARY KEY (id_votacion)
);

-- CREAR TABLA TEMPORAL PARA DETALLE DE VOTACIONES

CREATE TEMPORARY TABLE BD1PY1.DETALLE_VOTOTMP (
    id_detalle_voto INT NOT NULL AUTO_INCREMENT,
    id_votacion INT NOT NULL,
    id_candidato INT NOT NULL,

    PRIMARY KEY (id_detalle_voto)

);

-- CREAR TABLA TEMPORAL PARA MESAS

CREATE TEMPORARY TABLE BD1PY1.MESATMP (
    id_mesa INT NOT NULL AUTO_INCREMENT,
    id_departamento INT NOT NULL,

    PRIMARY KEY (id_mesa)
);

-- CREAR TABLA TEMPORAL PARA DEPARTAMENTOS

CREATE TEMPORARY TABLE BD1PY1.DEPARTAMENTOTMP (
    id_departamento INT NOT NULL AUTO_INCREMENT,
    nombre_departamento VARCHAR(50) NOT NULL,

    PRIMARY KEY (id_departamento)
);

-- Descripcion: Script para insertar datos en las tablas temporales del proyecto
-- Datos extraidos de archivos .csv

-- INSERTAR DATOS EN LA TABLA TEMPORAL CIUDADANOTMP
INSERT INTO BD1PY1.CIUDADANOTMP (dpi, nombre, apellido, direccion, telefono, edad, genero ) VALUES (?, ?, ?, ?, ?, ?, ?), [dpi, nombre, apellido, direccion, telefono, edad, genero];

-- INSERTAR DATOS EN LA TABLA TEMPORAL PARTIDOTMP
INSERT INTO BD1PY1.PARTIDOTMP (id_partido, nombre_partido, siglas, fundacion ) VALUES (?, ?, ?, ?), [id_partido, nombre_partido, siglas, fundacion];

-- INSERTAR DATOS EN LA TABLA TEMPORAL CARGOTMP
INSERT INTO BD1PY1.CARGOTMP (id_cargo, cargo ) VALUES (?, ?), [id_cargo, cargo];

-- INSERTAR DATOS EN LA TABLA TEMPORAL CANDIDATOTMP
INSERT INTO BD1PY1.CANDIDATOTMP (id_candidato, nombres_candidato, fecha_nacimiento, id_partido, id_cargo ) VALUES (?, ?, ?, ?, ?), [id_candidato, nombres_candidato, fecha_nacimiento, id_partido, id_cargo];

-- INSERTAR DATOS EN LA TABLA TEMPORAL MESATMP
INSERT INTO BD1PY1.MESATMP (id_mesa, id_departamento ) VALUES (?, ?), [id_mesa, id_departamento];

-- INSERTAR DATOS EN LA TABLA TEMPORAL DEPARTAMENTOTMP
INSERT INTO BD1PY1.DEPARTAMENTOTMP (id_departamento, nombre_departamento ) VALUES (?, ?), [id_departamento, nombre_departamento];

-- INSERTAR DATOS EN LA TABLA TEMPORAL VOTOTMP
INSERT INTO BD1PY1.VOTOTMP (fechayhora, dpi, id_mesa ) VALUES (?, ?, ?), [fechayhora, dpi, id_mesa];

-- INSERTAR DATOS EN LA TABLA TEMPORAL DETALLE_VOTOTMP
INSERT INTO BD1PY1.DETALLE_VOTOTMP (id_votacion, id_candidato ) VALUES (?, ?), [id_votacion, id_candidato];


-- Descripcion: Script para insertar datos en las tablas del proyecto
-- Datos extraidos de las tablas temporales

-- INSERTAR DATOS EN LA TABLA CIUDADANO
INSERT INTO BD1PY1.CIUDADANO (dpi, nombre, apellido, direccion, telefono, edad, genero ) SELECT dpi, nombre, apellido, direccion, telefono, edad, genero FROM BD1PY1.CIUDADANOTMP;

-- INSERTAR DATOS EN LA TABLA PARTIDO
INSERT INTO BD1PY1.PARTIDO (id_partido, nombre_partido, siglas, fundacion ) SELECT id_partido, nombre_partido, siglas, fundacion FROM BD1PY1.PARTIDOTMP;

-- INSERTAR DATOS EN LA TABLA CARGO
INSERT INTO BD1PY1.CARGO (id_cargo, cargo ) SELECT id_cargo, cargo FROM BD1PY1.CARGOTMP;

-- INSERTAR DATOS EN LA TABLA CANDIDATO
INSERT INTO BD1PY1.CANDIDATO (id_candidato, nombres, fecha_nac, id_partido, id_cargo ) SELECT id_candidato, nombres_candidato, fecha_nacimiento, id_partido, id_cargo FROM BD1PY1.CANDIDATOTMP;

-- INSERTAR DATOS EN LA TABLA MESA
INSERT INTO BD1PY1.MESA (id_mesa, id_departamento ) SELECT id_mesa, id_departamento FROM BD1PY1.MESATMP;

-- INSERTAR DATOS EN LA TABLA DEPARTAMENTO
INSERT INTO BD1PY1.DEPARTAMENTO (id_departamento, nombre_departamento ) SELECT id_departamento, nombre_departamento FROM BD1PY1.DEPARTAMENTOTMP;

-- INSERTAR DATOS EN LA TABLA VOTO
INSERT INTO BD1PY1.VOTO (fechayhora, dpi, id_mesa ) SELECT fechayhora, dpi, id_mesa FROM BD1PY1.VOTOTMP;

-- INSERTAR DATOS EN LA TABLA DETALLE_VOTO
INSERT INTO BD1PY1.DETALLE_VOTO (id_votacion, id_candidato ) SELECT id_votacion, id_candidato FROM BD1PY1.DETALLE_VOTOTMP;


-- Descripcion: Script para realizar consultas en las tablas del proyecto

-- CONSULTA 1
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


-- CONSULTA 2
-- NUMERO DE CANDIDATOS A DIPUTADOS (LISTA NACIONAL, DISTRITO ELECTORAL, PARLAMENTO CENTROAMERICANO).

    SELECT
        bd1py1.partido.nombre_partido AS Partido,
        COUNT(bd1py1.candidato.id_partido) AS Cantidad
    FROM
        bd1py1.candidato
            INNER JOIN
        bd1py1.partido ON bd1py1.candidato.id_partido = bd1py1.partido.id_partido
    WHERE
        bd1py1.candidato.id_cargo = 3
            OR bd1py1.candidato.id_cargo = 4
            OR bd1py1.candidato.id_cargo = 5
    GROUP BY bd1py1.partido.nombre_partido;


-- CONSULTA 3
-- NOMBRE DE LOS CANDIDATOS A ALCALDE POR PARTIDO

    SELECT 
        bd1py1.candidato.nombres AS Nombre,
        bd1py1.partido.nombre_partido AS Partido
    FROM
        bd1py1.candidato
            INNER JOIN
        bd1py1.partido ON bd1py1.candidato.id_partido = bd1py1.partido.id_partido
    WHERE
        bd1py1.candidato.id_cargo = 6;


-- CONSULTA 4
-- CANTIDAD DE CANDIDATOS POR PARTIDO (PRESIDENTES, VICEPRESIDENTES, DIPUTADOS, ALCALDES)

    SELECT
        bd1py1.partido.nombre_partido AS Partido,
        COUNT(bd1py1.candidato.id_partido) AS Cantidad
    FROM
        bd1py1.candidato
            INNER JOIN
        bd1py1.partido ON bd1py1.candidato.id_partido = bd1py1.partido.id_partido
    WHERE
        bd1py1.candidato.id_partido != -1
    GROUP BY bd1py1.partido.nombre_partido;


-- CONSULTA 5
-- CANTIDAD DE VOTACIONES POR DEPARTAMENTO

    SELECT 
        DEP.nombre_departamento AS 'Departamento',
        COUNT(*) AS 'No Votos'
    FROM
        BD1PY1.VOTO VOT
            INNER JOIN
        BD1PY1.MESA M ON VOT.id_mesa = M.id_mesa
            INNER JOIN
        BD1PY1.DEPARTAMENTO DEP ON M.id_departamento = DEP.id_departamento
    GROUP BY DEP.nombre_departamento;


-- CONSULTA 6
-- CANTIDAD DE VOTOS NULOS

    SELECT
        CAST(COUNT(*) / 5 AS SIGNED) AS 'Votos Nulos'
    FROM
        BD1PY1.DETALLE_VOTO
    WHERE
        id_candidato = -1;
    

-- CONSULTA 7
-- TOP 10 DE EDAD DE CIUDADANOS QUE REALIZARON SU VOTO
    
    SELECT 
        COUNT(Votacion.dpi) AS Cantidad, Persona.edad AS Edad
    FROM
        bd1py1.ciudadano Persona
            INNER JOIN
        bd1py1.voto Votacion ON Persona.dpi = Votacion.dpi
    GROUP BY Persona.edad
    ORDER BY COUNT(Votacion.dpi) DESC
    LIMIT 10;


-- CONSULTA 8
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


-- CONSULTA 9
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


-- CONSULTA 10
-- TOP 5 HORA MAS CONCURRIDA PARA VOTAR

    SELECT 
        HOUR(VOTACION.fechayhora) AS Hora, COUNT(VOTACION.id_votacion) AS 'Cantidad Votos'
    FROM
        bd1py1.voto VOTACION
    GROUP BY HOUR(VOTACION.fechayhora)
    ORDER BY COUNT(VOTACION.id_votacion) DESC
    LIMIT 5;


-- CONSULTA 11
-- CANTIDAD DE VOTOS POR GENERO (M|F)

    SELECT 
        Genero, COUNT(*) AS  'Cantidad Votos'
    FROM
        bd1py1.ciudadano C
            JOIN
        bd1py1.voto V ON C.dpi = V.dpi
    GROUP BY genero;


