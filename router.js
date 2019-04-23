const express = require('express');
const db = require('./data/db');

//Initialize router object
const router = express.Router();


router.get('/', (req, res) => {
    db.find()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).send({
                error: "The posts information could not be retrieved."
            })
        });
});

router.post('/', (req, res) => {
    if (req.body.contents === undefined || req.body.title === undefined) {
        res.status(400).send({
            error: "Please provide title and contents for the post."
        });
    } else {
        db.insert({
                title: req.body.title,
                contents: req.body.contents
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
                    error: "There was an error while saving the post to the database"
                });
            });
    }
});

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(response => {
            if (response.length === 0) {
                res.status(404).send({
                    error: "The post with the specified ID does not exist."
                });
            } else {
                res.status(200).send({
                    data: response
                });
            }
        })
        .catch(error => {
            res.status(500).send({
                error: "The post information could not be retrieved."
            })
        });
});

router.put('/:id', (req, res) => {

    let postEditing;

    db.findById(req.params.id)
        .then((response) => {
            if (response === undefined) {
                res.status(404).send({
                    error: "The post with the specified ID does not exist."
                });
            } else if (req.body.contents === undefined || req.body.title === undefined) {
                res.status(400).send({
                    error: "Please provide title and contents for the post."
                });
            } else {
                postEditing = response[0];
                return db.update(req.params.id, {
                    title: req.body.title,
                    contents: req.body.contents
                });
            }
        })
        .then(response => {
            return db.findById(postEditing.id);
        })
        .then(response => {
            res.status(200).send({
                data: response
            });
        })
        .catch(error => {
            res.status(500).send({
                error: "The post information could not be modified."
            })
        });
});

router.delete('/:id', (req, res) => {

    let postDeleted;

    db.findById(req.params.id)
        .then((response) => {
            if (response.length === 0) {
                res.status(404).send({
                    error: "The post with the specified ID does not exist."
                });
            } else {
                postDeleted = response;
                return db.remove(req.params.id);
            }
        })
        .then(response => {
            res.status(200).send({
                data: postDeleted
            });
        })
        .catch(error => {
            res.status(500).send({
                error: "The post could not be removed."
            });
        });
});

module.exports = router;