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
 * /company:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Company
 *     name: Get all company
 *     summary: Return all company
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
    Company.findAll({
        include: [User]
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
 * /company/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Company
 *     name: Get one company by id
 *     summary: Return one company by id
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
    Company.findByPk(
        req.params.id, {
            include: [User]
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
 * /company:
 *   post:
 *     tags:
 *       - Company
 *     name: Create one company
 *     summary: Create one company
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *                  type: string
 *             zipCode:
 *                  type: integer
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
    let company
    try {
        company = await Company.create({
            name:       req.body.name,
            zipCode:    req.body.zipCode
        })
    } catch(err) {
        if (err.errors) {
            return res.status(400).json({ code: 500, data: null, message: err.errors[0].message });
        } else {
            return res.status(400).json({ code: 500, data: err, message: 'Bad request : something went wrong' });
        }
    }
    return res.status(200).json({ code: 200, data: company, message: "" });
});

/**
 * @swagger
 * /company/{id}:
 *   put:
 *     tags:
 *       - Company
 *     name: Update one company
 *     summary: Update one company
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
 *             zipCode:
 *                  type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       403:
 *         description: 'Unauthorized : Authorization information is missing or invalid.'
 *       5xx:
 *         description: Unexpected error.
 */
router.put("/:id", async (req, res) => {
    let company
    try {
        company = await Company.update({
            name:          req.body.name,
            zipCode:       req.body.zipCode,
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
    return res.status(200).json({ code: 200, data: await Company.findByPk(req.params.id), message: "" });
});


/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     security:
 *     tags:
 *       - Company
 *     name: Delete one company
 *     summary: Delete one company
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
router.delete("/:id", (req, res) =>
    Company.destroy({
        where: {
            id: req.params.id
        }
    }).then( (result) => {
        res.status(200).json({ code: 200, data: result, message: ""})
    })
);


/**
 * @swagger
 * /company/addUser/{id}:
 *   delete:
 *     tags:
 *       - Company
 *     name: Delete one company
 *     summary: Delete one company
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
 *             userId:
 *                  type: array
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       5xx:
 *         description: Unexpected error.
 */
router.post("/addUser/:id", async (req, res) =>
{
    let company = await Company.findByPk(req.params.id)

    for (const item of req.body.userId) {
        const user = await User.findByPk(item)
        await company.addUser(user)
    }

    Company.findByPk(
        req.params.id, {
            include: [User]
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
});
module.exports = router;
