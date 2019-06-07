var express = require('express');
var router = express.Router();

const util = require('../module/utils/utils');
const statusCode = require('../module/utils/statusCode');
const resMessage = require('../module/utils/responseMessage');

const upload = require('../config/multer');
const pool = require('../module/pool');

router.post('/postComics', upload.single('photo'), async (req, res) => {
    const insertComicsQuery = 'INSERT INTO comics(title, photo, likes, author, flag) VALUES(?, ?, ?, ?, ?)';

    var resultQuery = await pool.queryParam_Parse(insertComicsQuery, 
            [req.body.title, req.file.location, req.body.likes, req.body.author, req.body.flag]);
    
    if (!resultQuery) {
        console.log(err);
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.SAVE_FAIL));
    } else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.SAVE_SUCCESS));
    }
});

router.post('/:flag', async (req, res) => {
    const selectFlagQuery = 'SELECT title, photo, likes, author FROM comics WHERE flag = ?';
    console.log(req.params.flag);
    if(req.params.flag <4 && req.params.flag >0)
        var selectResult = await pool.queryParam_Parse(selectFlagQuery, [req.params.flag]);
    else
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.BAD_PARAMS));
    
    if (!selectResult) {
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.LOAD_FAIL));
    } else {
        if (selectResult[0] == null) {
            res.status(200).send(util.successFalse(statusCode.NOT_FOUND, resMessage.NULL_VALUE));
        } else {
            const values = [];

            for (let i = 0; i < selectResult.length; i++) {
                values[i] = selectResult[i];
                console.log(`${i} :: ${values[i]}`);
            }
            
            res.status(200).send(util.successTrue(statusCode.Ok, resMessage.LOAD_SUCCESS, values));
        }
    }
});

router.post('/postImg', upload.array('imgs'), async (req, res) => {
    const imgs = req.files;
    const insertImgQuery = 'INSERT INTO mainImgs(images) VALUES(?)';
    const values = [];

    for (let i = 0; i < imgs.length; i++) {
        values[i] = req.files[i].location;
        console.log(`${i} :: ${values[i]}`);
    }
    for (var i = 0; i < values.length; i++) {
        var resultQuery = await pool.queryParam_Parse(insertImgQuery, [values[i]]);
        console.log(`DB insert=> ${i} :: ${values[i]}`);
    }
    if (!resultQuery) {
        console.log(err);
        res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.SAVE_FAIL));
    } else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.SAVE_SUCCESS));
    }
});

router.post('/images', async (req, res) => {
    const selectImgsQuery = 'SELECT * FROM mainImgs';
    const selectResult = await pool.queryParam_Parse(selectImgsQuery, [req.body.images]);

    if(!selectResult){
        res.status(200).send(util.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR));
    }else{
        if (selectResult[0] == null) {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.NULL_VALUE));
        } else {
            const values = [];

            for (let i = 0; i < selectResult.length; i++) {
                values[i] = selectResult[i];
                console.log(`${i} :: ${values[i]}`);
            }
            res.status(200).send(util.successTrue(statusCode.Ok, resMessage.LOAD_SUCCESS, values));
        }
    }
});

module.exports = router;