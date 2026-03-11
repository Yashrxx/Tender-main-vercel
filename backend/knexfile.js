// knexfile.js
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'your_password_here',
      database: 'b2b_platform',
    },
  },
};