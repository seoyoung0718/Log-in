// 김서영_60221302_고급웹final

const express = require("express");
const router = express.Router();
const { Post } = require("../models");
const { isLoggedIn } = require("./middlewares");

router.get("/create/:diaryId", isLoggedIn, (req, res) => {
  const { diaryId } = req.params;
  res.render("createPost", { diaryId });
});

// 게시글 생성
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const { diaryId, title, content } = req.body;

    // 필수값 체크
    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용을 입력하세요." });
    }

    // 새 게시글 등록
    const post = await Post.create({
      diaryId,
      userId: req.user.id,
      title,
      content,
    });

    return res.redirect(`/diary/${diaryId}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 게시글 수정
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({ message: "게시글 없음" });
    }

    // 작성자 본인만 수정 가능
    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: "수정 권한 없음" });
    }

    await post.update({
      title: req.body.title,
      content: req.body.content,
    });

    res.json({ message: "게시글 수정 완료", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 게시글 삭제
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({ message: "게시글 없음" });
    }

    // 작성자 본인만 삭제 가능
    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: "삭제 권한 없음" });
    }

    await post.destroy();
    res.json({ message: "게시글 삭제 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
