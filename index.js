const express = require('express')
const db = require('./data/db');

//Initialize serve object
const server = express();

//Implement JSON middleware
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Sanity check');
});

server.get('/api/users', (req, res) => {
    db.find()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).send({
                error: "The users information could not be retrieved."
            })
        });
});

server.post('/api/users', (req, res) => {
    if (req.body.bio === undefined || req.body.name === undefined) {
        res.status(400).send({
            error: "Please provide name and bio for the user."
        });
    } else {
        db.insert({
                name: req.body.name,
                bio: req.body.bio
            })
            .then(response => {
                return db.findById(response.id);
            })
            .then(response => {
                res.status(201).send({
                    data: response
                });
            })
            .catch(error => {
                res.status(500).send({
                    error: "There was an error while saving the user to the database"
                });
            });
    }
});

server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
        .then(response => {
            if (response.length === 0) {
                res.status(404).send({
                    error: "The user with the specified ID does not exist."
                });
            } else {
                res.status(200).send({
                    data: response
                });
            }
        })
        .catch(error => {
            res.status(500).send({
                error: "The user information could not be retrieved."
            })
        });
});

server.put('/api/users/:id', (req, res) => {

    let userEditing;

    db.findById(req.params.id)
        .then((response) => {
            if (response === undefined) {
                res.status(404).send({
                    error: "The user with the specified ID does not exist."
                });
            } else if (req.body.bio === undefined || req.body.name === undefined) {
                res.status(400).send({
                    error: "Please provide name and bio for the user."
                });
            } else {
                userEditing = response;
                return db.update(req.params.id, {
                    name: req.body.name,
                    bio: req.body.bio
                });
            }
        })
        .then(response => {
            return db.findById(userEditing.id);
        })
        .then(response => {
            res.status(200).send({
                data: response
            });
        })
        .catch(error => {
            res.status(500).send({
                error: "The user information could not be modified."
            })
        });
});

server.delete('/api/users/:id', (req, res) => {

    let userDeleted;

    db.findById(req.params.id)
        .then((response) => {
            if (response.length === 0) {
                res.status(404).send({
                    error: "The user with the specified ID does not exist."
                });
            } else {
                userDeleted = response;
                return db.remove(req.params.id);
            }
        })
        .then(response => {
            res.status(200).send({
                data: userDeleted
            });
        })
        .catch(error => {
            res.status(500).send({
                error: "The user could not be removed."
            });
        });
});

server.listen(5000, () => console.log('Server is running on localhost:5000'));
