const express = require("express");
const helmet = require("helmet");

const server = express();

const Projects = require("./data/helpers/projectModel.js");
const Actions = require("./data/helpers/actionModel.js");

server.use(express.json());
server.use(helmet());

server.get("/", (req, res) => {
  res.send(`
    <h2>Claire's API Project!</h2>
  `);
});

server.get("/projects", async (req, res) => {
  try {
    const projects = await Projects.find(req.query);
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "the project information could not be received."
    });
  }
});

server.get("/projects/:project_id/:id", async (req, res) => {
  try {
    const actions = await Actions.find(req.query);
    const project = await Projects.getProjectActions(req.params.id);
    if (project) {
      res.status(200).json(actions);
    } else {
      res.status(404).json({
        error: "The project with the specified ID does not exist"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "the action information could not be received"
    });
  }
});

server.post("/projects", async (req, res) => {
  try {
    const { name, description, completed } = await Projects.insert(req.body);
    if (!name || !description) {
      res.status(400).json({
        error: "Please provide name and description for the project."
      });
    } else {
      Projects.insert({ name, description, completed }).then(addedProject => {
        res.status(201).json(addedProject);
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The project information could not be retreived"
    });
  }
});

server.post("/projects/:project_id/:id", async (req, res) => {
  try {
    const { project_id, description, notes, completed } = await Actions.insert(
      req.body
    );
    if (!project_id || !description || !notes) {
      res
        .status(400)
        .json({ message: "Please provide project ID, description, and notes" });
    } else {
      Actions.insert({ project_id, description, notes, completed }).then(
        addedAction => {
          res.status(201).json(addedAction);
        }
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The action information could not be retreived"
    });
  }
});

server.delete("/projects/:id", async (req, res) => {
  try {
    const deleted = await Projects.remove(req.params.id);
    if (deleted > 0) {
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

server.delete("/projects/:project_id/:id", async (req, res) => {
  try {
    const deleted = await Actions.remove(req.params.id);
    if (deleted > 0) {
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

server.put("/projects/:id", async (req, res) => {
  try {
    const { name, description, completed } = project;
    const project = await Projects.update(req.params.id, req.body);
    if (!name || !description) {
      res.status(400).json({
        message: "Please provide name and description for the project"
      });
    } else {
      Projects.update(id, project).then(updatedProject => {
        if (updatedProject) {
          res.status(200).json(updatedProject);
        } else {
          res.status(404).json({
            message: "The project with the specified ID does not exist"
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The project information could not be received"
    });
  }
});

server.put("/projects/:project_id/:id", async (req, res) => {
  try {
    const { name, description, notes, completed } = action;
    const action = await Actions.update(req.params.id, req.body);
    if (!name || !description || !notes) {
      res.status(400).json({
        message: "Please provide name, description, and notes for the action."
      });
    } else {
      Actions.update(id, action).then(updatedAction => {
        if (updatedAction) {
          res.status(200).json(updatedAction);
        } else {
          res.status(404).json({
            message: "The action with the specified ID does not exist"
          });
        }
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
