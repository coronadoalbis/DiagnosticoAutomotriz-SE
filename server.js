const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();


app.use(cors());

// Middleware para procesar datos JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__d3 .irname, 'public', 'index.html'));
});
0
// Conexión con SQLite
 const db = new sqlite3.Database('./diagnostics.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conexión con SQLite establecida');
    db.run(`
      CREATE TABLE IF NOT EXISTS diagnostics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symptoms TEXT,
        vehicleType TEXT,
        mileage INTEGER,
        result TEXT
      );
    `);
  }
});

// Rmostrar todos los diagnósticos en formato json
app.get('/api/show-database', (req, res) => {
  db.all('SELECT * FROM diagnostics', [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error al consultar la base de datos');
    }
    res.status(200).json(rows);
  });
});

app.post('/api/diagnose', (req, res) => {
  const { symptoms, vehicleType, mileage } = req.body;

  // Buscar diagnóstico 
  const query = `SELECT result FROM diagnostics WHERE symptoms = ? AND vehicleType = ? LIMIT 1`;
  db.get(query, [symptoms, vehicleType], (err, row) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err.message);
      return res.status(500).json({ error: 'Error al realizar el diagnóstico' });
    }

    if (row) {
      // devolver resultado
      return res.status(200).json({ message: row.result });
    } else {
      console.log(req.body.symptoms, req.body.vehicleType, req.body.mileage);
      // Si no se encuentra, devolver un mensaje predeterminado
      return res.status(200).json({ message: 'No se pudo determinar un diagnóstico preciso.' });
    }
  });
});

app.get('/api/diagnostics', (req, res) => {
  db.all('SELECT * FROM diagnostics', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los diagnósticos' });
    }
    res.status(200).json(rows);
  });
});

// eliminar un diagnóstico por ID
app.delete('/api/diagnostics/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM diagnostics WHERE id = ?', id, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el diagnóstico' });
    }
    res.status(200).json({ message: 'Diagnóstico eliminado correctamente' });
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
