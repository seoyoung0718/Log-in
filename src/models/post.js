// 김서영_60221302_고급웹final

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      diaryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: false,
      tableName: "Posts",
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    Post.belongsTo(models.Diary, {
      foreignKey: "diaryId",
      onDelete: "CASCADE",
    });

    models.User.hasMany(Post, { foreignKey: "userId" });
    models.Diary.hasMany(Post, { foreignKey: "diaryId" });
  };

  return Post;
};
