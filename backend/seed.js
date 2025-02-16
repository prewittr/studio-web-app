// backend/seed.js
const mongoose = require('mongoose');
const Suite = require('./models/Suite');

mongoose.connect('mongodb://localhost:27017/studio-web-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to DB');

    // Clear existing suite data
    await Suite.deleteMany({});

    // Create 8 sauna suites
    const saunaSuites = [];
    for (let i = 1; i <= 8; i++) {
      saunaSuites.push({
        name: `Sauna Suite ${i}`,
        type: 'sauna',
        suiteNumber: i,
      });
    }

    // Create 2 red light bed suites
    const redlightSuites = [];
    for (let i = 1; i <= 2; i++) {
      redlightSuites.push({
        name: `Red Light Bed Suite ${i}`,
        type: 'redlight',
        suiteNumber: i,
      });
    }

    const allSuites = [...saunaSuites, ...redlightSuites];

    await Suite.insertMany(allSuites);
    console.log('Database seeded with suites:', allSuites);
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
