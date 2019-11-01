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

router.get

router.post("/", validateProject, (req, res) => {
    Projects.insert(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res
                .status(500)
                .json({ message: "We encountered an error while adding the project" });
        });
});

router.delete('/:id', (req, res) => {
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

router.put('/:id', validateProject, (req, res) => {
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

router.post('/:id/actions', validateAction, (req, res) => {
    const info = { ...req.body, project_id: req.params.id };
    Projects.getProjectActions(req.params.id)
    .then(actions => {
        if (actions[0]) {
            Actions.insert(info)
            .then(action => {
                if (action) {
                    res.status(201).json(action);
                } else {
                    res.status(404).json({message: 'Error retrieving project'})
                }
            })
            .catch(error => {
                res.status(500).json({message: 'Error creating project action'})
            })
        } else {
            res.status(404).json({message: 'Error retrieving project'})
        }
    })
    .catch(error => {
        res.status(500).json({message:'Error retrieving actions for post'})
    })
})

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

module.exports = router; 