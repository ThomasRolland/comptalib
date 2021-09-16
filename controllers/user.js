'use strict';

const TokenGenerator        = require('uuid-token-generator');
const bcrypt                = require('bcryptjs');
const jwt                   = require('jsonwebtoken');
const auth                  = require('../middleware/auth.js');
const config                 = require('../config/config');
const router                = require('express').Router();
const { Op }                = require("sequelize");
const { User, Company }              = require('../models/index');


/**
 * @swagger
 * /user:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     name: Get all user
 *     summary: Return all user
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       403:
 *         description: 'Unauthorized : Authorization information is missing or invalid.'
 *       5xx:
 *         description: Unexpected error.
 */
router.get("/", (req, res) =>
    User.findAll({
        include: [Company]
    }).then(
        (result) =>
            res.status(200).json(
                {
                    code: 200,
                    data: result,
                    message: ""}
            )
    )
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     name: Get one user by id
 *     summary: Return one user by id
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       403:
 *         description: 'Unauthorized : Authorization information is missing or invalid.'
 *       5xx:
 *         description: Unexpected error.
 */
router.get("/:id",  async (req, res) =>
    User.findByPk(
        req.params.id, {
            include: [Company]
        }).then(
        async (result) => {
            res.status(200).json(
                {
                    code: 200,
                    data: result,
                    message: ""
                }
            )
        })
);

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     name: Create one user
 *     summary: Create one user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *                  type: string
 *             password:
 *                  type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       403:
 *         description: 'Unauthorized : Authorization information is missing or invalid.'
 *       5xx:
 *         description: Unexpected error.
 */
router.post("/", async (req, res) => {
    let user
    try {
        user = await User.create({
            username:       req.body.username,
            password:       bcrypt.hashSync(req.body.password.trim(), 10),
        })
    } catch(err) {
        if (err.errors) {
            return res.status(400).json({ code: 500, data: null, message: err.errors[0].message });
        } else {
            return res.status(400).json({ code: 500, data: err, message: 'Bad request : something went wrong' });
        }
    }
    user.dataValues.oauth_token = jwt.sign({id_user: user.id}, config.SECRET_KEY, { expiresIn: '2 days' });
    return res.status(200).json({ code: 200, data: user, message: "" });
});

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags:
 *       - User
 *     name: Update one user
 *     summary: Update one user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *                  type: string
 *             imageUrl:
 *                  type: string
 *             videoUrl:
 *                  type: string
 *             description:
 *                  type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       403:
 *         description: 'Unauthorized : Authorization information is missing or invalid.'
 *       5xx:
 *         description: Unexpected error.
 */
router.put("/:id", auth.yourSelfOnly(),async (req, res) => {
    let user
    try {
        user = await User.update({
            username:          req.body.username,
            password:          bcrypt.hashSync(req.body.password.trim(), 10),
        },  {
            where: {
                id: req.params.id
            }
        })
    } catch(err) {
        if (err.errors) {
            return res.status(400).json({ code: 500, data: null, message: err.errors[0].message });
        } else {
            return res.status(400).json({ code: 500, data: err, message: 'Bad request : something went wrong' });
        }
    }
    return res.status(200).json({ code: 200, data: await User.findByPk(req.params.id), message: "" });
});


/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     name: Delete one user
 *     summary: Delete one user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       5xx:
 *         description: Unexpected error.
 */
router.delete("/:id", auth.yourSelfOnly(), (req, res) =>
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then( (result) => {
        res.status(200).json({ code: 200, data: result, message: ""})
    })
);



/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Users
 *     name: User login
 *     summary: Logs in a user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       403:
 *         description: 'Unauthorized : Authorization information is missing or invalid.'
 *       5xx:
 *         description: Unexpected error.
 */
router.post("/login", function(req, res) {
    let username = req.body.username;
    if (username) {
        User.findOne({
            where: {
                username:  username
            }
        }).then(async (result) => {
            if (result && result.length !== 0)
            {
                if (req.body.password) {
                    if (bcrypt.compareSync(req.body.password, result.password)) {
                        result.dataValues.oauth_token = jwt.sign({id_user: result.id}, config.SECRET_KEY, { expiresIn: '2 days' });
                        res.status(200).json({ code: 200, data: result, message: ""})
                    }
                    else {
                        res.status(400).json({ code: 400, data: null, message: "Bad request : username and password doesn't match"})
                    }
                }
                else {
                    res.status(400).json({ code: 400, data: null, message: "Bad request : send password"})
                }
            } else {
                res.status(400).json({ code: 400, data: null, message: "Bad request : email and password doesn't match"})
            }
        })
    }
    else {
        res.status(400).json({ code: 400, data: null, message: "Bad request : send username"})
    }
});

module.exports = router;
