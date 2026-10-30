
import mongoose from "mongoose";

const dburl = `${process.env.MONGO_URI}${process.env.DB_NAME}`;

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  techStack: {
    type: [String],
    default: []
  },
  liveLink: {
    type: String,
    default: ""
  }
});

const Project = mongoose.model("Project", ProjectSchema);

// Connect to MongoDB
async function connect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dburl);
  }
}

// Initialize default projects
async function initializeProjects() {
  await connect();

  const count = await Project.countDocuments();

  if (count === 0) {
    const projectArray = [
      {
        title: "SafeEntry",
        description:
          "A full-stack community and visitor management web platform featuring role-based access control for residents, guards, and administrators.",
        techStack: [
          "React",
          "Node.js",
          "Express",
          "MongoDB",
          "REST API"
        ],
        liveLink: "https://safeentry4home.netlify.app"
      }
    ];

    await Project.insertMany(projectArray);
    console.log("Projects initialized.");
  }
}

// Get all projects
async function getProjects() {
  await connect();
  return await Project.find({});
}

// Add project
async function addProject(title, description, techStack, liveLink = "") {
  await connect();

  const parsedStack = Array.isArray(techStack)
    ? techStack
    : techStack.split(",").map(tech => tech.trim());

  await Project.create({
    title,
    description,
    techStack: parsedStack,
    liveLink
  });
}

// Update project
async function updateProject(id, updates) {
  await connect();

  return await Project.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,
      runValidators: true
    }
  );
}

// Delete project
async function deleteProject(id) {
  await connect();
  return await Project.findByIdAndDelete(id);
}

export default {
  initializeProjects,
  getProjects,
  addProject,
  updateProject,
  deleteProject
};
