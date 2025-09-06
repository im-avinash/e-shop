module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, unique: true },
  }, { tableName: 'categories', timestamps: false });

  Category.associate = (models) => {
    Category.hasMany(models.Item, { foreignKey: 'category_id' });
  };

  return Category;
};