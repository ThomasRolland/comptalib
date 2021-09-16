'use strict';

const jwt           = require('jsonwebtoken');
const config         = require('../config/config');
const { User }      = require('../models/index');

function yourSelfOnly() {
    return (req, res, next) => {
        const token = req.headers['oauth_token'];

        if (token) {
            jwt.verify(token, config.SECRET_KEY, function(err, user) {
                if (err) {
                    res.status(400).json({ code: 400, data: null, message: "Bad request : oauth_token is invalid"})
                }
                else {
                    const id_user = user.id_user.toString();

                    if (id_user !== undefined) {
                        req.id_user = id_user;

                        User.findByPk( id_user ).then(
                            async (result) => {
                                if (req.params.id === id_user) {
                                    next();
                                }
                                else {
                                    res.status(403).json({ code: 403, data: null, message: "Bad request : Unauthorized"})
                                }
                            }).catch(
                                (result) => {
                                    res.status(500).json({ code: 500, data: result, message: "Bad request : something went wrong" });
                                })
                    }
                    else {
                        res.status(500).json({ code: 500, data: null, message: "Bad request : something went wrong"})
                    }
                }
            });
        }
        else {
            res.status(200).json({ code: 200, data: null, message: "Not found: Token Not found"})
        }
    }
}

module.exports.yourSelfOnly = yourSelfOnly;
