// 김서영_60221302_고급웹final

const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const { User } = require("../models");

module.exports = (passport) => {
  // 로그인 시 최초 1번 실행됨
  // 사용자 전체 정보를 세션에 저장하지 않고 user.id만 저장
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 요청이 들어올 때마다 실행됨
  // 세션에 저장된 id로 DB에서 유저 정보를 찾아 req.user에 넣어줌
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // 각각의 로그인 전략(로컬 / 카카오)을 passport에 연결
  local(passport);
  kakao(passport);
};
