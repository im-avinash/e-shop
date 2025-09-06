module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password_hash: DataTypes.STRING,
  }, { tableName: 'users', timestamps: false });

  User.associate = (models) => {
    User.hasMany(models.CartItem, { foreignKey: 'user_id' });
  };

  return User;
};
