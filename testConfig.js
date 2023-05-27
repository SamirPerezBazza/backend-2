import { config } from 'dotenv';
const mongoose = require('mongoose');

// Configuración de la base de datos de prueba

// Función para configurar la base de datos de prueba
async function setupDatabase() {
  config();
  await mongoose
    .connect(process.env.MONGO_URL || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected.');
    })
    .catch((err) => {
      console.log('There was an error with connection!');
      console.log(err);
    });
}

// Función para limpiar y restablecer la base de datos de prueba
async function clearDatabase() {
  await mongoose.connection.dropDatabase();
}

// Exporta las funciones de configuración y limpieza de la base de datos
module.exports = {
  setupDatabase,
};
