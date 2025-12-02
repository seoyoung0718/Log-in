module.exports = (sequelize, DataTypes) => {
  const DiaryMember = sequelize.define(
    "DiaryMember",
    {
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        // 기본값 제거! → 요청할 때 직접 넣도록
      },
      role: {
        type: DataTypes.ENUM("member", "leader"),
        allowNull: false,
        defaultValue: "member",
      },
    },
    {
      timestamps: true,
      paranoid: false,
    }
  );

  DiaryMember.associate = (models) => {
    DiaryMember.belongsTo(models.User, { foreignKey: "userId" });
    DiaryMember.belongsTo(models.Diary, { foreignKey: "diaryId" });

    models.Diary.hasMany(DiaryMember, { foreignKey: "diaryId" });
    models.User.hasMany(DiaryMember, { foreignKey: "userId" });
  };

  return DiaryMember;
};
