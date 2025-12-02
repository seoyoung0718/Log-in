module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: true, // 이메일 없어도 됨 (카카오 로그인 대비)
        unique: false,
      },
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true, // 카카오는 비밀번호 없음
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "local", // local | kakao 등
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true, // 카카오는 snsId 값 저장
      },
    },
    {
      timestamps: true,
      paranoid: false,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.DiaryMember, { foreignKey: "userId" });
    User.hasMany(models.Post, { foreignKey: "userId" });
  };

  return User;
};
