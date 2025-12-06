// 김서영_60221302_고급웹final

module.exports = (sequelize, DataTypes) => {
  const Diary = sequelize.define(
    "Diary",
    {
      title: {
        type: DataTypes.STRING(50),
        allowNull: false, // 그룹이자 다이어리의 이름
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true, // 그룹 소개글
      },
    },
    {
      timestamps: true,
      paranoid: false,
    }
  );

  Diary.associate = (models) => {
    // DiaryMember 연결 (그룹 멤버들)
    Diary.hasMany(models.DiaryMember, {
      foreignKey: "diaryId",
      onDelete: "CASCADE",
    });

    // Post 연결 (그룹 내 작성된 게시글)
    Diary.hasMany(models.Post, {
      foreignKey: "diaryId",
      onDelete: "CASCADE",
    });
  };

  return Diary;
};
