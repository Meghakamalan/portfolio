import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// import dotenv from "dotenv";


import projectDb from "./components/projects/db.js";
import skillDb from "./components/skills/db.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors()); // Allow requests from React frontend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8888;

// Run sample initialization on launch
await projectDb.initializeProjects();
await skillDb.initializeSkills();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- VIEW / RENDERING ROUTES ---
app.get("/admin", (req, res) => {
  res.render("index", { title: "Dashboard Overview" });
});

app.get("/admin/projects", async (req, res) => {
  const projects = await projectDb.getProjects();
  res.render("projects", { title: "Manage Projects", projects });
});

app.get("/admin/skills", async (req, res) => {
  const skills = await skillDb.getSkills();
  res.render("skills", { title: "Manage Skills", skills });
});
app.get("/admin/projects/add", (req, res) => {
  res.render("addproject", { title: "Add Project" });
});

app.get("/admin/skills/add", (req, res) => {
  res.render("addskill", { title: "Add Skill" });
});

// --- CONTROLLER ACTION POST METHODS ---
app.post("/admin/projects/add", async (req, res) => {
  const { title, description, techStack } = req.body;
  await projectDb.addProject(title, description, techStack);
  res.redirect("/admin/projects");
});

app.post("/admin/projects/delete/:id", async (req, res) => {
  await projectDb.deleteProject(req.params.id);
  res.redirect("/admin/projects");
});

app.post("/admin/skills/add", async (req, res) => {
  const { name, category} = req.body;
  await skillDb.addSkill(name, category);
  res.redirect("/admin/skills");
});

app.post("/admin/skills/delete/:id", async (req, res) => {
  await skillDb.deleteSkill(req.params.id);
  res.redirect("/admin/skills");
});

// --- REST API PLUGS ---
app.get("/api/projects", async (req, res) => {
  const data = await projectDb.getProjects();
  res.json(data);
});

app.get("/api/skills", async (req, res) => {
  const data = await skillDb.getSkills();
  res.json(data);
});

app.get("/", (req, res) => res.redirect("/admin"));

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));