import mongoose from "mongoose";

const dbUrl = `${process.env.MONGO_URI}${process.env.DB_NAME}`;

const SkillSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Skill = mongoose.model("Skill", SkillSchema);

async function connect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUrl);
  }
}

async function initializeSkills() {
  await connect();
  const count = await Skill.countDocuments();
  if (count === 0) {
    const skillArray = [
      { name: "JavaScript", category: "Frontend" },
      { name: "HTML", category: "Frontend" },
      { name: "CSS", category: "Frontend" },
      { name: "Python", category: "Backend" },
      { name: "ASP.NET", category: "Backend" }
    ];
    await Skill.insertMany(skillArray);
    console.log("Skills initialized.");
  }
}

async function getSkills() {
  await connect();
  return await Skill.find({});
}

async function addSkill(name, category) {
  await connect();
  await Skill.create({ name, category });
}

async function deleteSkill(id) {
  await connect();
  await Skill.findByIdAndDelete(id);
}

export default {
  initializeSkills,
  getSkills,
  addSkill,
  deleteSkill
};