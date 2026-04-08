CREATE DATABASE Ejemplo;
USE Ejemplo;

CREATE TABLE estudiante (
id_estudiante INT PRIMARY KEY, // es un numero unico para cada estudiante
nombre VARCHAR(50), // para guardar el nombre
correo VARCHAR(50) // para guardar el correo
);

CREATE TABLE cronometro (
id_cronometro INT PRIMARY KEY, // numero unico del cronometro
tiempo_trabajo INT, // tiempo que trabaja (en numeros)
tiempo_descanso INT, // tiempo de descanso
estado VARCHAR(50), // estado como activo o pausado
id_estudiante INT // para saber a que estudiante pertenece
);

CREATE TABLE tarea (
id_tarea INT PRIMARY KEY, // numero unico de la tarea
nombre VARCHAR(50), // nombre de la tarea
descripcion VARCHAR(100), // explicacion de la tarea
estado VARCHAR(50) // estado de la tarea
);

CREATE TABLE notificacion (
id_notificacion INT PRIMARY KEY, // numero unico
tipo VARCHAR(50), // tipo de notificacion
mensaje VARCHAR(100), // mensaje que se muestra
id_cronometro INT, // relacion con cronometro
id_tarea INT // relacion con tarea
);
