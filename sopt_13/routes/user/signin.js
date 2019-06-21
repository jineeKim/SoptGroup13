var express = require('express');
var router = express.Router();

const util = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const authUtil = require('../../module/utils/authUtils');

const jwtUtils = require('../../module/jwt');

const crypto = require('crypto-promise');
const pool = require('../../module/pool');

router.post('/', async (req, res) => {
    const selectIdQuery = 'SELECT * FROM user WHERE id = ?';
    const selectResult = await pool.queryParam_Parse(selectIdQuery, [req.body.id]);
    const pwd = req.body.password;


    if (req.body.id === null || !req.body.password) {
        res.status(statusCode.OK).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        if (!selectResult) {
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.ID_OR_PW_NULL_VALUE));
        } else {
            if (selectResult[0] == null) {
                res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.NO_USER));
            } else {
                const hashedPw = await crypto.pbkdf2(pwd.toString(), selectResult[0].salt, 1000, 32, 'SHA512');
                
                if (selectResult[0].password == hashedPw.toString('base64')) {
                    const tokens = jwtUtils.sign(selectResult[0]);
                    //const refreshToken = tokens.refreshToken;
                    const refreshTokenUpdateQuery = "UPDATE user SET token = ? WHERE id= ?";
                    const refreshTokenUpdateResult = await pool.queryParam_Parse(refreshTokenUpdateQuery, [tokens.token, req.body.id]);

                    //res.status(statusCode.OK).send(util.successTrue(statusCode.OK, resMessage.CREATE_TOKEN, tokens));

                    if (refreshTokenUpdateResult)
                        res.status(200).send(util.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS, tokens.token));
                } else {
                    res.status(200).send(util.successFalse(statusCode.OK, resMessage.MISS_MATCH_PW));
                }
            }
        }
    }
});

module.exports = router;