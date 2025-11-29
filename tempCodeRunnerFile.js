const express = require("express");
const { sequelize } = require("./models");

const app = express();

// DB 연결 테스트
sequelize
  .authenticate()
  .then(() => console.log("✅ DB Connected Successfully"))
  .catch((err) => console.error("❌ DB Connection Failed:", err));

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
