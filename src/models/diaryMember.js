// 김서영_60221302_고급웹final

module.exports = (sequelize, DataTypes) => {
  const DiaryMember = sequelize.define(
    "DiaryMember",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      diaryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("member", "owner"),
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
  };

  return DiaryMember;
};
