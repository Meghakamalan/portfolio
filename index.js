
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import projectDb from "./components/projects/db.js";
import skillDb from "./components/skills/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8888;

// ------------------------------------
// MIDDLEWARE
// ------------------------------------

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------
// PUG CONFIGURATION
// ------------------------------------

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// ------------------------------------
// DATABASE INITIALIZATION
// ------------------------------------

await projectDb.initializeProjects();
await skillDb.initializeSkills();

// ------------------------------------
// ADMIN DASHBOARD ROUTES
// ------------------------------------

app.get("/admin", (req, res) => {
  res.render("index", {
    title: "Dashboard Overview"
  });
});

// View all projects
app.get("/admin/projects", async (req, res) => {
  try {
    const projects = await projectDb.getProjects();

    res.render("projects", {
      title: "Manage Projects",
      projects
    });
  } catch (error) {
    console.error("Error loading projects:", error);
    res.status(500).send("Failed to load projects");
  }
});

// View all skills
app.get("/admin/skills", async (req, res) => {
  try {
    const skills = await skillDb.getSkills();

    res.render("skills", {
      title: "Manage Skills",
      skills
    });
  } catch (error) {
    console.error("Error loading skills:", error);
    res.status(500).send("Failed to load skills");
  }
});

// Add project page
app.get("/admin/projects/add", (req, res) => {
  res.render("addproject", {
    title: "Add Project"
  });
});

// Add skill page
app.get("/admin/skills/add", (req, res) => {
  res.render("addskill", {
    title: "Add Skill"
  });
});

// ------------------------------------
// PROJECT POST ROUTES
// ------------------------------------

// Add project with live URL
app.post("/admin/projects/add", async (req, res) => {
  try {
    const {
      title,
      description,
      techStack,
      liveLink
    } = req.body;

    await projectDb.addProject(
      title,
      description,
      techStack,
      liveLink || ""
    );

    res.redirect("/admin/projects");
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).send("Failed to add project");
  }
});

// Delete project
app.post("/admin/projects/delete/:id", async (req, res) => {
  try {
    await projectDb.deleteProject(req.params.id);
    res.redirect("/admin/projects");
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).send("Failed to delete project");
  }
});

// ------------------------------------
// SKILL POST ROUTES
// ------------------------------------

// Add skill
app.post("/admin/skills/add", async (req, res) => {
  try {
    const { name, category } = req.body;

    await skillDb.addSkill(name, category);

    res.redirect("/admin/skills");
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).send("Failed to add skill");
  }
});

// Delete skill
app.post("/admin/skills/delete/:id", async (req, res) => {
  try {
    await skillDb.deleteSkill(req.params.id);
    res.redirect("/admin/skills");
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).send("Failed to delete skill");
  }
});

// ------------------------------------
// REST API ROUTES
// ------------------------------------

// Get all projects (includes liveLink)
app.get("/api/projects", async (req, res) => {
  try {
    const data = await projectDb.getProjects();
    res.json(data);
  } catch (error) {
    console.error("Error fetching projects:", error);

    res.status(500).json({
      error: "Failed to fetch projects"
    });
  }
});

// Get all skills
app.get("/api/skills", async (req, res) => {
  try {
    const data = await skillDb.getSkills();
    res.json(data);
  } catch (error) {
    console.error("Error fetching skills:", error);

    res.status(500).json({
      error: "Failed to fetch skills"
    });
  }
});

// ------------------------------------
// HOME ROUTE
// ------------------------------------

app.get("/", (req, res) => {
  res.redirect("/admin");
});

// ------------------------------------
// START SERVER
// ------------------------------------

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
