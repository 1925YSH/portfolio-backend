const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Project = require('../models/Project');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is missing');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const githubLinks = "https://github.com/1925YSH/careerOS-frontend, https://github.com/1925YSH/careerOs-backend";

    const updated = await Project.findOneAndUpdate(
      { title: 'AI CareerOS' },
      {
        title: "AI CareerOS",
        description: "An autonomous career intelligence operating system featuring transparent hybrid AI job matching, autonomous career portal web ingestion, an ATS resume diagnostic center, 7-day interview roadmaps, employer recruitment pipelines, and Stripe monetization.",
        techStack: [
          "Next.js 15 (App Router)",
          "TypeScript",
          "Tailwind CSS",
          "Node.js",
          "Express.js",
          "MongoDB Atlas",
          "AWS S3",
          "Google Gemini 1.5",
          "Stripe"
        ],
        image: "uploads/career-os-preview.png",
        github: githubLinks,
        demo: ""
      },
      { upsert: true, new: true }
    );

    console.log('✅ Updated AI CareerOS in MongoDB:');
    console.log('ID:', updated._id);
    console.log('GitHub Links:', updated.github);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
