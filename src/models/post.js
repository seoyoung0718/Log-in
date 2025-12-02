module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true, // createdAt / updatedAt 자동 생성
      paranoid: false,
    }
  );

  Post.associate = (models) => {
    // 글 작성자
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    // 어떤 다이어리(그룹)에 속한 글인지
    Post.belongsTo(models.Diary, {
      foreignKey: "diaryId",
      onDelete: "CASCADE",
    });

    // 역방향 관계
    models.User.hasMany(Post, { foreignKey: "userId" });
    models.Diary.hasMany(Post, { foreignKey: "diaryId" });
  };

  return Post;
};
