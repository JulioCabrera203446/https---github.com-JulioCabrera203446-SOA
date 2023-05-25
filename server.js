const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0912',
  database: 'api_rest'
});

connection.connect((err) => {
  if (err) {
    console.log('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// GET - Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  connection.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.log('Error al obtener los usuarios:', err);
      res.status(500).send('Error al obtener los usuarios');
    } else {
      res.send(results);
    }
  });
});

// POST - Agregar un nuevo usuario
app.post('/usuarios', (req, res) => {
  const { nombre, correoElectronico, contraseña } = req.body;
  connection.query('INSERT INTO usuarios SET ?', { nombre, correoElectronico, contraseña }, (err, results) => {
    if (err) {
      console.log('Error al agregar un nuevo usuario:', err);
      res.status(500).send('Error al agregar un nuevo usuario');
    } else {
      res.send('Usuario agregado exitosamente');
    }
  });
});

// DELETE - Eliminar un usuario por su ID
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM usuarios WHERE id = ?', id, (err, results) => {
    if (err) {
      console.log('Error al eliminar un usuario:', err);
      res.status(500).send('Error al eliminar un usuario');
    } else if (results.affectedRows === 0) {
      res.send('No se encontró ningún usuario con el ID proporcionado');
    } else {
      res.send('Usuario eliminado exitosamente');
    }
  });
});

// PUT - Actualizar un usuario por su ID
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, correoElectronico, contraseña } = req.body;
  connection.query('UPDATE usuarios SET nombre = ?, correoElectronico = ?, contraseña = ? WHERE id = ?', [nombre, correoElectronico, contraseña, id], (err, results) => {
  if (err) {
    console.log('Error al actualizar un usuario:', err);
    res.status(500).send('Error al actualizar un usuario');
  } else if (results.affectedRows === 0){
    res.send('No se encontró ningún usuario con el ID proporcionado');
  } else {
    res.send('Usuario actualizado exitosamente');
  }
  });
});
// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log('Servidor iniciado en el puerto ${PORT}');
});
