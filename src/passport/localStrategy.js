// 김서영_60221302_고급웹final

// Passport 로컬 로그인 전략 설정 파일
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // 로그인 폼에서 사용할 필드명
        passwordField: "password", // 로그인 폼에서 사용할 비밀번호 필드명
      },
      async (email, password, done) => {
        try {
          // 1) 이메일과 provider가 local인 유저 조회
          const exUser = await User.findOne({
            where: { email, provider: "local" },
          });

          // 해당 이메일 없으면 실패 처리
          if (!exUser) {
            return done(null, false, { message: "가입된 이메일이 없습니다." });
          }

          // 2) 비밀번호 비교 (bcrypt 사용)
          const result = await bcrypt.compare(password, exUser.password);

          // 비밀번호 일치 → 로그인 성공
          if (result) {
            return done(null, exUser);
          }

          // 비밀번호 불일치 → 실패
          return done(null, false, {
            message: "비밀번호가 일치하지 않습니다.",
          });
          // 서버 오류 → 실패 처리
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
