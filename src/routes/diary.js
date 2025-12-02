const express = require("express");
const router = express.Router();
const { Diary, DiaryMember, User, Post, Sequelize } = require("../models");
const { isLoggedIn } = require("./middlewares");
const { Op } = Sequelize;

// 다이어리 검색
router.get("/search", isLoggedIn, async (req, res) => {
  const keyword = req.query.keyword;

  const diaries = await Diary.findAll({
    where: {
      title: { [Op.like]: `%${keyword}%` },
    },
  });

  res.render("searchResult", { diaries });
});

// 다이어리 생성 페이지
router.get("/create", isLoggedIn, (req, res) => {
  res.render("diary/createDiary");
});

// 다이어리 생성 처리
router.post("/create", isLoggedIn, async (req, res) => {
  const { title, description } = req.body;

  const diary = await Diary.create({ title, description });

  // 만든 사람이 자동으로 멤버(승인 완료)
  await DiaryMember.create({
    userId: req.user.id,
    diaryId: diary.id,
    role: "owner",
    status: "approved",
  });

  res.redirect("/");
});

// 다이어리 상세 조회
router.get("/:id", isLoggedIn, async (req, res) => {
  const diaryId = req.params.id;

  try {
    // 1) 다이어리 기본 정보
    const diary = await Diary.findOne({
      where: { id: diaryId },
      include: [
        {
          model: DiaryMember,
          include: [{ model: User, attributes: ["id", "nick"] }],
        },
        {
          model: Post,
          include: [{ model: User }],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!diary) {
      return res.status(404).send("해당 다이어리가 없습니다.");
    }

    // 2) 현재 접속한 유저가 이 다이어리 멤버인지 확인
    const isMember = await DiaryMember.findOne({
      where: { diaryId, userId: req.user.id, status: "approved" },
    });

    res.render("diary/diaryDetail", {
      diary,
      isMember: !!isMember,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

module.exports = router;
