const express = require('express');

const Actions = require('../helpers/actionModel.js');
const Projects = require('../helpers/projectModel.js');
const router = express.Router();

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
});

router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project)
})

router.post("/", validateProject, (req, res) => {
    Projects.insert({ name: req.body.name, description: req.body.description })
        .then(project => {
            res.status(201).json(project);
        })
        .catch(err => {
            res
                .status(500)
                .json({ message: "We encountered an error while adding the project" });
        });
});

router.delete('/:id', validateProjectId, (req, res) => {
    Projects.remove(req.params.id)
        .then(data => {
            if (data) {
                res.status(200).json({ message: 'project removed' })
            } else {
                res.status(404).json({ message: 'project not in database' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'error while removing project' })
        })
});

router.put('/:id', validateProject, validateProjectId, (req, res) => {
    Projects.update(req.params.id, req.body)
        .then(project => {
            if (project) {
                res.status(200).json(project);
            } else {
                res.status(404).json({ message: 'project does not exist' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'error updating project info' })
        })
});

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
    const { id } = req.params;
    const newAction = { ...req.body, project_id: id };
    Actions.insert(newAction)
        .then(action => {
            res.status(201).json(action);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error creating an action for the project' })
        })
});

//custom middleware
// validate body of request to create a new action
function validateAction(req, res, next) {
    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: "missing action data" });
    } else if (!req.body.description) {
        res.status(400).json({ message: 'missing required description field' });
    } else if (!req.body.notes) {
        res.status(400).json({ message: 'missing required notes field' });
    } else {
        next();
    }
}

// validate body of request to create new project
function validateProject(req, res, next) {
    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: "missing project data" });
    } else if (!req.body.name) {
        res.status(400).json({ message: 'missing required name field' });
    } else if (!req.body.description) {
        res.status(400).json({ message: 'missing required description field' });
    } else {
        next();
    }
};

// validate id of project
function validateProjectId(req, res, next) {
    Projects.get(req.params.id)
        .then(project => {
            if (!project) {
                res.status(400).json({ message: 'invalid project ID' })
            } else {
                req.project = project;
                next();
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'encountered an error validating project ID' })
        })
};
module.exports = router; 