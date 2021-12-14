const Sequelize = require('sequelize');

const conexao = new Sequelize('bancomangas','postgres','h74ga32324', {
    host: 'localhost',
    dialect: 'postgres',
    timezone: '-03:00'
});


module.exports = conexao; //exporta o conexão js