const User = require('./User');
const Company = require('./Company');
const Tender = require('./Tender');

// Define associations here
User.hasOne(Company, { foreignKey: 'userId', onDelete: 'CASCADE' });
Company.belongsTo(User, { foreignKey: 'userId' });

Company.hasMany(Tender, { foreignKey: 'company_id', onDelete: 'CASCADE' });
Tender.belongsTo(Company, { foreignKey: 'company_id' });

User.hasMany(Tender, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Tender.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  User,
  Company,
  Tender
};