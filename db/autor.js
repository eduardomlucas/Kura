//# serve para referenciar e para o ER #

const Sequelize = require('sequelize');
const conexao = require('./conexao');
const mangas = require('./mangas');

const autor = conexao.define('autor', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {type: Sequelize.STRING}

});

autor.belongsTo(mangas)

mangas.hasMany(autor,{ 
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

autor.sync({force: false});

module.exports = autor;