const KakaoStrategy = require("passport-kakao").Strategy;
const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
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
