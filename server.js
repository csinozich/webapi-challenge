const express = require("express");
const helmet = require("helmet");

const server = express();

const projectDB = require("./data/helpers/projectModel.js");
const actionDB = require("./data/helpers/actionModel.js");

server.use(express.json());
server.use(helmet());

server.get("/", (req, res) => {
  res.send(`
    <h2>Claire's API Project!</h2>
  `);
});

//get projects and actions
server.get("/api/projects", async (req, res) => {
  try {
    const projects = await projectDB.get(req.query);
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "the project information could not be received."
    });
  }
});

server.get("/api/actions", async (req, res) => {
  try {
    const actions = await actionsDb.get(req.query);
    res.status(200).json(actions);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "the action information could not be received"
    });
  }
});

//get projects and actions by id:
server.get("/api/projects/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const project = await projectDB.get(id);
    if (id) {
      res.status(200).json(project);
    } else {
      res.status(400).json({
        message: "the project with that ID does not exist"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Unable to retreive project"
    });
  }
});

server.get("/api/actions/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const action = await actionDB.get(id);
    if (id) {
      res.status(200).json(action);
    } else {
      res.status(400).json({
        message: "the action with that ID does not exist"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "unable to retreive action"
    });
  }
});

//get all actions for project
server.get("/api/projects/:id/actions", (req, res) => {
  let { id } = req.params;
  projectDB
    .getProjectActions(id)
    .then(projectActions => {
      if (!projectActions.length) {
        res.status(404).json({
          error: "the actions for this project do not exist"
        });
      } else {
        res.status(200).json(projectActions);
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Unable to retreive information"
      });
    });
});

//add projects and actions
server.post("/api/projects", async (req, res) => {
  let { name, description } = req.body;
  try {
    const addedProject = projectDB.insert({ name, description });
    if (!name || !description) {
      res.status(400).json({
        error: "Please provide name and description for the project."
      });
    } else {
      res.status(200).json(addedProject);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The project information could not be retreived"
    });
  }
});

server.post("/api/actions", async (req, res) => {
  let { project_id, notes, description } = req.body;
  try {
    if (!project_id || !description || !notes) {
      res
        .status(400)
        .json({ message: "Please provide project ID, description, and notes" });
    } else {
      const addedAction = actionDB.insert(req.body);
      res.status(200).json(addedAction);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The action information could not be retreived"
    });
  }
});

//delete projects and actions
server.delete("/api/projects/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const deleted = await projectDB.get(id);
    if (deleted > 0) {
      await projectDB.remove(id);
      res.status(200).json({
        message: "the project has been deleted"
      });
    } else {
      res.status(404).json({
        message: "the project with the specified ID does not exist"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The project could not be removed"
    });
  }
});

server.delete("/api/actions/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const deleted = await actionsDB.get(id);
    if (deleted > 0) {
      await actionDB.remove(id);
      res.status(200).json({
        message: "the action has been deleted"
      });
    } else {
      res.status(404).json({
        message: "the action with the specified ID does not exist"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The action could not be removed"
    });
  }
});

//update projects and actions
server.put("/api/projects/:id", async (req, res) => {
  let { id } = req.params;
  let { name, description, completed } = req.body;
  try {
    const project = await projectDB.get(id);
    if (!name || !description) {
      res.status(400).json({
        message: "Please provide name and description for the project"
      });
    } else {
      await projectDB.update(id, { name, description, completed });
      res.status(200).json({
        message: "the project has been updated"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The project information could not be received"
    });
  }
});

server.put("/api/actions/:id", async (req, res) => {
  let { id } = req.params;
  let { project_id, notes, description } = req.body;
  try {
    const action = await actionDB.get(id);
    if (!name || !description || !notes) {
      res.status(400).json({
        message: "Please provide name, description, and notes for the action."
      });
    } else {
      await actionDB.update(id, req.body);
      res.status(200).json({
        message: "the action has been updated"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The action information could not be received."
    });
  }
});

module.exports = server;
