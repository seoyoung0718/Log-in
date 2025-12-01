const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({
            where: { email, provider: "local" },
          });

          if (!exUser) {
            return done(null, false, { message: "가입된 이메일이 없습니다." });
          }

          const result = await bcrypt.compare(password, exUser.password);

          if (result) {
            return done(null, exUser);
          }

          return done(null, false, {
            message: "비밀번호가 일치하지 않습니다.",
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
