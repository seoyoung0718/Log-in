// 김서영_60221302_고급웹final

// Passport 카카오 로그인 전략 설정 파일
const KakaoStrategy = require("passport-kakao").Strategy;
const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID, // 카카오 REST API 키
        callbackURL: "/auth/kakao/callback", // 로그인 후 리다이렉트 URI
        prompt: "login", // 항상 카카오 로그인 창 띄우기
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 기존에 카카오로 가입한 유저 있는지 조회
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });

          // 이미 카카오로 가입된 유저 있으면 로그인
          if (exUser) return done(null, exUser);

          // 새 사용자 생성
          const newUser = await User.create({
            email: profile._json?.kakao_account?.email || null,
            nick: profile.displayName,
            snsId: profile.id,
            provider: "kakao",
          });

          return done(null, newUser);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
