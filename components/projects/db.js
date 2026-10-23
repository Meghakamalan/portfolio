import mongoose from "mongoose";

const dburl = `${process.env.MONGO_URI}${process.env.DB_NAME}`;

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String]
});

const Project = mongoose.model("Project", ProjectSchema);

async function connect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dburl);
  }
}

async function initializeProjects() {
  await connect();
  const count = await Project.countDocuments();
  if (count === 0) { 
    const projectArray = [
{
  title: "SafeEntry",
  description: "A full-stack community and visitor management web platform featuring role-based access control for residents, guards, and administrators.",
  techStack: ["React", "Node.js", "Express", "MongoDB", "REST API"]
}
      
    ];
    await Project.insertMany(projectArray); 
    console.log("Projects initialized.");
  }
}   

async function getProjects() {
  await connect();
  return await Project.find({}); 
}

async function addProject(title, description, techStack) {
  await connect();
  const parsedStack = techStack.split(",").map(tech => tech.trim());
  await Project.create({ title, description, techStack: parsedStack });
}

async function deleteProject(id) {
  await connect();
  await Project.findByIdAndDelete(id);
}

export default {
  initializeProjects,
  getProjects,
  addProject,
  deleteProject
};