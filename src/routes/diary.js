// 김서영_60221302_고급웹final

const express = require("express");
const router = express.Router();
const { Diary, DiaryMember, User, Post, Sequelize } = require("../models");
const { isLoggedIn } = require("./middlewares");
const { Op } = Sequelize;

// 다이어리 검색
router.get("/search", isLoggedIn, async (req, res) => {
  const keyword = (req.query.keyword || "").trim();

  // 1) 빈값 입력 방지
  if (!keyword) {
    return res.render("searchResult", { diaries: [], keyword });
  }

  try {
    const diaries = await Diary.findAll({
      where: {
        title: {
          [Op.like]: `%${keyword}%`,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.render("searchResult", { diaries, keyword });
  } catch (err) {
    console.error(err);
    res.status(500).send("검색 오류");
  }
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
    const diary = await Diary.findOne({
      where: { id: diaryId },
      include: [
        {
          model: DiaryMember,
          where: { status: "approved" },
          required: false,
          include: [{ model: User, attributes: ["id", "nick"] }],
        },
        {
          model: Post,
          include: [{ model: User, attributes: ["id", "nick"] }],
        },
      ],
      order: [[Post, "createdAt", "DESC"]],
    });

    if (!diary) {
      return res.status(404).send("해당 다이어리를 찾을 수 없습니다.");
    }

    // 현재 사용자 가입 상태
    const member = await DiaryMember.findOne({
      where: { diaryId, userId: req.user.id },
    });

    // 1) 가입 안 함
    if (!member) {
      return res.render("diary/diaryJoin", { diary });
    }

    // 2) 대기중
    if (member.status === "pending") {
      return res.render("diary/diaryJoinPending", { diary });
    }

    // 3) 거절됨
    if (member.status === "rejected") {
      return res.render("diary/diaryJoinRejected", { diary });
    }

    // 4) 승인됨 → 상세조회 허용
    return res.render("diary/diaryDetail", {
      diary,
      user: req.user,
      isMember: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// 다이어리 가입 신청
router.post("/:id/join", isLoggedIn, async (req, res) => {
  const diaryId = req.params.id;

  try {
    const exists = await DiaryMember.findOne({
      where: { diaryId, userId: req.user.id },
    });

    if (exists) {
      return res.send("이미 신청했거나 가입되어 있습니다.");
    }

    await DiaryMember.create({
      diaryId,
      userId: req.user.id,
      role: "member",
      status: "pending",
    });

    res.redirect(`/diary/${diaryId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("가입 신청 오류");
  }
});

router.get("/:id/members", isLoggedIn, async (req, res) => {
  const diaryId = req.params.id;

  const me = await DiaryMember.findOne({
    where: { diaryId, userId: req.user.id },
  });

  if (!me || me.role !== "owner") {
    return res.status(403).send("권한이 없습니다.");
  }

  const pendingMembers = await DiaryMember.findAll({
    where: { diaryId, status: "pending" },
    include: [{ model: User, attributes: ["nick"] }],
  });

  res.render("diary/diaryMembers", { pendingMembers, diaryId });
});

// 승인 라우터
router.post("/:id/members/:memberId/approve", isLoggedIn, async (req, res) => {
  const diaryId = req.params.id;
  const memberId = req.params.memberId;

  const me = await DiaryMember.findOne({
    where: { diaryId, userId: req.user.id },
  });

  if (!me || me.role !== "owner") {
    return res.status(403).send("권한이 없습니다.");
  }

  await DiaryMember.update({ status: "approved" }, { where: { id: memberId } });

  res.redirect(`/diary/${diaryId}/members`);
});

// 거절 라우터
router.post("/:id/members/:memberId/reject", isLoggedIn, async (req, res) => {
  const diaryId = req.params.id;
  const memberId = req.params.memberId;

  const me = await DiaryMember.findOne({
    where: { diaryId, userId: req.user.id },
  });

  if (!me || me.role !== "owner") {
    return res.status(403).send("권한이 없습니다.");
  }

  await DiaryMember.update({ status: "rejected" }, { where: { id: memberId } });

  res.redirect(`/diary/${diaryId}/members`);
});

module.exports = router;
