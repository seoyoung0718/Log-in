module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define("GroupMember", {
    // id 자동 생성됨
  });

  return GroupMember;
};
