const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./diagnostics.db');


const addDiagnostic = (symptoms, vehicleType, mileage, result) => {
  db.run(
    `INSERT INTO diagnostics (symptoms, vehicleType, mileage, result) VALUES (?, ?, ?, ?)`,
    [symptoms, vehicleType, mileage, result],
    function (err) {
      if (err) {
        return console.error('Error al añadir el diagnóstico:', err.message);
      }
      console.log('Diagnóstico añadido con ID:', this.lastID);
    }
  );
};

const listDiagnostics = () => {
  db.all('SELECT * FROM diagnostics', [], (err, rows) => {
    if (err) {
      return console.error('Error al obtener los diagnósticos:', err.message);
    }
    console.table(rows);
  });
};

const deleteDiagnostic = (id) => {
  db.run('DELETE FROM diagnostics WHERE id = ?', id, function (err) {
    if (err) {
      return console.error('Error al eliminar el diagnóstico:', err.message);
    }
    console.log(`Diagnóstico con ID ${id} eliminado correctamente.`);
  });
};

const [,, command, ...args] = process.argv;

switch (command) {
  case 'add':
    addDiagnostic(args[0], args[1], args[2], args[3]);
    break;
  case 'list':
    listDiagnostics();
    break;
  case 'delete':
    deleteDiagnostic(args[0]);
    break;
  default:
    console.log('Comando no reconocido. Usa "add", "list" o "delete".');
    console.log('Ejemplos:');
    console.log('  node user-cli.js add "motor" "sedan" 15000 "Revisión sugerida"');
    console.log('  node user-cli.js list');
    console.log('  node user-cli.js delete 1');
    break;
}

db.close();
