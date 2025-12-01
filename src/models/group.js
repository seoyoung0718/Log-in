module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define("Group", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
  });

  Group.associate = (models) => {
    Group.hasMany(models.Diary, { foreignKey: "groupId" });

    Group.belongsToMany(models.User, {
      through: models.GroupMember,
      foreignKey: "groupId",
    });
  };

  return Group;
};
