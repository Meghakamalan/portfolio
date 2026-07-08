import mongoose from "mongoose";

const dbUrl = `${process.env.MONGO_URI}${process.env.DB_NAME}`;

// set up Schema and model
const SkillSchema = new mongoose.Schema({
    name: String,
    category: String
});
const Skill = mongoose.model("Skill", SkillSchema);

await mongoose.connect(dbUrl);

// Function to initialize Skill collection with some sample data.
async function initializeSkills() {
    const count = await Skill.countDocuments();
    if (count === 0) {
        let skillArray = [
            {
                name: "JavaScript",
                category: "Frontend"
            },
            {
                name: "HTML",
                category: "Frontend"
            },
            {
                name: "CSS",
                category: "Frontend"
            },
            {
                name: "Python",
                category: "Backend"
            },
            {
                name: "ASP.NET",
                category: "Backend"
            }
        ];
        await Skill.insertMany(skillArray);
        console.log("Skills initialized.");
    }
}

// Get all Skills from the collection
async function getSkills() {
    return await Skill.find({});
}

// Function to add a single skill from a form submit
async function addSkill(name, category) {
    await Skill.create({ name, category});
}

// Function to delete a skill by its unique ID
async function deleteSkill(id) {
    await Skill.findByIdAndDelete(id);
}

export default {
    initializeSkills,
    getSkills,
    addSkill,
    deleteSkill
};