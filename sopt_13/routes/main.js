var express = require('express');
var router = express.Router();

const util = require('../module/utils/utils');
const statusCode = require('../module/utils/statusCode');
const resMessage = require('../module/utils/responseMessage');

const upload = require('../config/multer');
const pool = require('../module/pool');


router.get('/:flag', async (req, res) => {

});

router.post('/postImg', upload.array('imgs'), async (req, res) => {
    const imgs = req.files;
    const insertContentsInfoQuery = 'INSERT INTO mainImgs(images) VALUES(?)';
    const values = [];

    for (let i = 0; i < imgs.length; i++) {
        values[i] = req.files[i].location;
        console.log(`${i} :: ${values[i]}`);
    }
    const insertTransaction = await pool.Transaction((connection) => {
        for (var i = 0; i < values.length; i++) {
            var resultQuery = connection.query(insertContentsInfoQuery, [values[i]]);
            console.log(`DB insert=> ${i} :: ${values[i]}`);
        }
        if (!resultQuery) {
            console.log(err);
            res.status(200).send(util.successFalse(statusCode.BAD_REQUEST, resMessage.SAVE_FAIL));
        } else {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.SAVE_SUCCESS));
        }
    });
});

router.post('/images', upload.array('imgs'), async (req, res) => {
    
});

module.exports = router;