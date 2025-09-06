module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10,2),
    image_url: DataTypes.STRING,
  }, { tableName: 'items', timestamps: false });

  Item.associate = (models) => {
    Item.belongsTo(models.Category, { foreignKey: 'category_id' });
    Item.hasMany(models.CartItem, { foreignKey: 'item_id' });
  };

  return Item;
};
