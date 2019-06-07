var express = require("express");
var router = express.Router();
const pool = require("../module/pool");
const moment = require("moment");

const util = require("../module/utils/utils");
const statusCode = require("../module/utils/statusCode");
const resMessage = require("../module/utils/responseMessage");
const upload = require("../config/multer");

// 댓글 목록 보여주기

router.get("/:episodeidx", async (req, res) => {
    const episodeIdx = req.params.episodeIdx;
    console.log(req.params.episodeIdx);
    const selectCommentsQuery = "SELECT * FROM comments WHERE episodeIdx = ?";
    const selectCommentsResult = await pool.queryParam_Parse(selectCommentsQuery, [
        episodeIdx
    ]);

    if (!selectCommentsResult)
        return res
            .status(200)
            .send(util.successFalse(statusCode.NOT_FOUND, resMessage.NO_COMMENT));

    res
        .status(200)
        .send(
            util.successTrue(
                statusCode.OK,
                resMessage.COMMENTS_LOAD_SUCCESS,
                selectCommentsResult
            )
        );
});

// 댓글 쓰기
router.post("/write/:episodeidx", upload.single("img"), async (req, res) => {
    const content = req.body.content;
    const image = req.body.image;
    const episodeIdx = req.params.episodeIdx;
    const timestamp = moment.now();

    const createCommentQuery = `INSERT INTO comments (episodeIdx, image, content, timestamp) VALUES (?, ?, ?, ?)`;
    const createCommentResult = await pool.queryParam_Parse(createCommentQuery, [
        episodeIdx,
        image,
        content,
        timestamp
    ]);

    res
        .status(200)
        .send(
            util.successTrue(statusCode.CREATED, resMessage.COMMENTS_CREATE_SUCCESS)
        );
});

module.exports = router;
