import mongoose from "mongoose";    
const dburl = `${process.env.MONGO_URI}${process.env.DB_NAME}`;

// Set up Schema and Model
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String]
});
const Project = mongoose.model("Project", ProjectSchema);
await mongoose.connect(dburl);

async function initializeProjects() {
  const count = await Project.countDocuments();
  if (count === 0) { 
    let projectArray = [
      {
        title: "Simply Recipes",
        description: "A mobile-first digital cookbook application featuring a clean design.",
        techStack: ["HTML", "CSS", "JavaScript"]
      },
      {
        title: "Basketball Game",
        description: "An interactive web basketball game with hit/miss bounding calculations.",
        techStack: ["HTML", "CSS", "JavaScript"]
      },
      {
        title: "Whack-a-Mouse Web Game",
        description: "A single-page web game built to demonstrate front-end logic.",
        techStack: ["HTML", "CSS", "JavaScript"]
      }
    ];
    await Project.insertMany(projectArray); 
    console.log("Projects initialized.");
  }
}  

// Get all Projects from the collection
async function getProjects() {
  return await Project.find({}); 
}
// Function to add a project from a form submit
async function addProject(title, description, techStack) {
  const parsedStack = techStack.split(",").map(tech => tech.trim());
  await Project.create({ title, description, techStack: parsedStack });
}
// Function to delete a project by its unique ID
async function deleteProject(id) {
  await Project.findByIdAndDelete(id);
}
export default {
  initializeProjects,
  getProjects,
  addProject,
  deleteProject
};