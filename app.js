const express = require("express");
const { sequelize } = require("./src/models");

const app = express();

// 테이블 생성
sequelize
  .sync({ force: false })
  .then(() => console.log("데이터베이스 연결 성공 ✅"))
  .catch((err) => console.error("데이터베이스 연결 실패 ❌", err));

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
