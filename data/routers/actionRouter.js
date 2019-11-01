const express = require('express');

const Actions = require('../helpers/actionModel.js');
const router = express.Router();

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error retrieving actions'
            })
        })
});

router.delete('/:id', (req, res) => {
    Actions.remove(req.params.id)
        .then(data => {
            if (data) {
                res.status(200).json({ message: 'action removed' })
            } else {
                res.status(404).json({ message: 'action not in database' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'error while removing action' })
        })
});

router.put('/:id', validateAction, (req, res) => {
    Actions.update(req.params.id, req.body)
        .then(action => {
            if (action) {
                res.status(200).json(action);
            } else {
                res.status(404).json({ message: 'action does not exist' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'error updating action info' })
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


module.exports = router; 