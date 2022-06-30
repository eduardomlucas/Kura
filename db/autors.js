//# serve para referenciar e para o ER #

const Sequelize = require('sequelize');
const conexao = require('./conexao');


const autors = conexao.define('autors', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: Sequelize.STRING

});

autors.sync({force: false});

module.exports = autors;