const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'sfit',
    password: 'admin',
    host: 'localhost',
    port: '5432',
    database: 'nodelogin'
});

module.exports = pool;


