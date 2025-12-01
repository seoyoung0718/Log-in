const path = require("path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { sequelize } = require("./src/models");
require("dotenv").config();

const app = express();

// 뷰 엔진
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// body 파서
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// passport 전략 설정
require("./src/passport")(passport);

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// DB 연결 및 테이블 생성
sequelize
  .sync({ force: true })
  .then(() => console.log("데이터베이스 연결 성공 ✅"))
  .catch((err) => console.error("데이터베이스 연결 실패 ❌", err));

// 라우터 연결
const pageRouter = require("./src/routes/page");
const authRouter = require("./src/routes/auth");
app.use("/", pageRouter);
app.use("/auth", authRouter);

// 9. 서버 시작
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
