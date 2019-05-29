var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const pool = require('../../module/pool');
const crypto = require('crypto-promise');

router.post('/', async (req, res) => {
    const selectIdQuery = 'SELECT id FROM user WHERE id = ?';
    const selectIdResult = await pool.queryParam_Parse(selectIdQuery, [req.body.id]);
    const id = req.body.id;
    const name = req.body.name;
    const pwd = req.body.password;

    if (selectIdResult[0] == null) {
        if (id.length > 20 || pwd.length > 20) {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.SENTENCE_LENGTH_ERROR));
        } else {
            if (name.length > 4) {
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NAME_LENGTH_ERROR));
            } else {
                const buf = await crypto.randomBytes(64);
                const salt = buf.toString('base64');
                const hashedPw = await crypto.pbkdf2(pwd.toString(), salt, 1000, 32, 'SHA512');
                
                const insertSignupQuery = 
                'INSERT INTO user (id, name, password, salt) VALUES (?, ?, ?, ?)';
                const insertSignupResult = await pool.queryParam_Parse(insertSignupQuery, [req.body.id, req.body.name, hashedPw.toString('base64'), salt]);

                if (!insertSignupResult) {
                    res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.CREATED_USER_FAIL));
                } else {
                    res.status(200).send(util.successTrue(statusCode.OK, resMessage.CREATED_USER_SUCCESS));
                }
            }
        }
    } else {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_USER));
    }
});

module.exports = router;