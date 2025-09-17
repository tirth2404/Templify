const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  mongoose.connection.on('connected', () => console.log('✅ Mongo connected'));
  mongoose.connection.on('error', (e) => console.error('❌ Mongo error', e));
  mongoose.connection.on('disconnected', () => console.log('⚠️ Mongo disconnected'));
  await mongoose.connect(uri);
}

module.exports = { connectDb };


