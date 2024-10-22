
const script = `

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
  
  `;

module.exports = script;



