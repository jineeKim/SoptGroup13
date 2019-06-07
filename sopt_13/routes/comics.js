var express = require("express");
var router = express.Router();

const util = require("../module/utils/utils");
const statusCode = require("../module/utils/statusCode");
const resMessage = require("../module/utils/responseMessage");
const pool = require("../module/pool");

// 특정 comic을 클릭했을 때 관련된 에피소드 목록을 보내준다.
router.get("/list/:comicIdx", async (req, res) => {
    const comicIdx = req.params.comicIdx;
    const selectComicQuery = "SELECT * FROM episodes WHERE comicIdx = ?";
    const selectComicResult = await pool.queryParam_Parse(selectComicQuery, [
        comicIdx
    ]);

    if (!selectComicResult)
        return res
            .status(200)
            .send(util.successFalse(statusCode.NOT_FOUND, resMessage.NO_COMIC));

    res
        .status(200)
        .send(
            util.successTrue(
                statusCode.OK,
                resMessage.EPISODE_LIST_LOAD_SUCCESS,
                selectComicResult
            )
        );
});

//만화 좋아요
// comicIdx를 사용하여 특정 comic의 like 갯수를 +1 한다.

router.post("/like/:comicIdx", async (req, res) => {
    const comicIdx = req.params.comicIdx;
    const selectComicQuery = "SELECT * FROM comics WHERE comicIdx = ?";
    const selectComicResult = await pool.queryParam_Parse(selectComicQuery, [
        comicIdx
    ])[0];

    if (!selectComicResult)
        return res
            .status(200)
            .send(util.successFalse(statusCode.NOT_FOUND, resMessage.NO_COMIC));

    const updatedLikes = selectComicResult.likes + 1;

    const updateLikesQuery = "UPDATE comics SET likes = ? WHERE comicIdx = ?";
    const updateLikesResult = await pool.queryParam_Parse(updateLikesQuery, [
        updatedLikes,
        comicIdx
    ]);

    res
        .status(200)
        .send(util.successTrue(statusCode.OK, resMessage.LIKE_SUCCESS));
});

// 만화 상세 보여주기
// episodeIdx를 가지고 특정 에피소드를 불러온다.
router.get("/episode/:episodeIdx", async (req, res) => {
    const episodeIdx = req.params.episodeIdx;
    const selectEpisodeQuery = "SELECT * FROM episodes WHERE episodeIdx = ?";
    const selectEpisodeResult = await pool.queryParam_Parse(selectEpisodeQuery, [
        episodeIdx
    ]);

    if (!selectEpisodeResult)
        return res
            .status(200)
            .send(util.successFalse(statusCode.NOT_FOUND, resMessage.NO_EPISODE));

    res
        .status(200)
        .send(
            util.successTrue(
                statusCode.OK,
                resMessage.EPISODE_LOAD_SUCCESS,
                selectComicResult
            )
        );
});

module.exports = router;
