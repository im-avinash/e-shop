module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, { tableName: 'cart_items', timestamps: false });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.User, { foreignKey: 'user_id' });
    CartItem.belongsTo(models.Item, { foreignKey: 'item_id' });
  };

  return CartItem;
};
