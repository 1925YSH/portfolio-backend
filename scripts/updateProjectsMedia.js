const mongoose = require('../node_modules/mongoose');
const path = require('path');
require('../node_modules/dotenv').config({ path: path.join(__dirname, '../.env') });
const Project = require('../models/Project');

async function updateDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const updates = [
    { title: 'AI CareerOS', demo: 'https://career-os.vercel.app', image: 'projects/career-os.jpg' },
    { title: 'Food Delivery App', demo: 'https://food-app-blush-eight.vercel.app/', image: 'projects/food-delivery.jpg' },
    { title: 'Quick.ai', demo: 'https://quick-ai-client-gold.vercel.app', image: 'projects/quick-ai.jpg' },
    { title: 'Weather App', demo: 'https://1925ysh.github.io/Weather-app/', image: 'projects/weather-app.jpg' },
    { title: 'Gym Web Page', demo: 'https://1925ysh.github.io/GYM-Project/', image: 'projects/gym-project.jpg' },
    { title: 'E-Agro Platform', demo: 'https://eagro.vercel.app/', image: 'projects/e-agro.jpg' }
  ];

  for (const u of updates) {
    const res = await Project.findOneAndUpdate(
      { title: { $regex: new RegExp(u.title.split(' ')[0], 'i') } },
      { demo: u.demo, image: u.image },
      { new: true }
    );
    console.log('Updated:', u.title, '=> demo:', res?.demo, 'image:', res?.image);
  }

  await mongoose.disconnect();
}

updateDB().catch(console.error);

