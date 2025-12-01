module.exports = (sequelize, DataTypes) => {
  const Diary = sequelize.define("Diary", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Diary.associate = (models) => {
    Diary.belongsTo(models.User, { foreignKey: "userId" });
    Diary.belongsTo(models.Group, { foreignKey: "groupId" });
  };

  return Diary;
};
