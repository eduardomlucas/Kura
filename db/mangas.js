const Sequelize = require('sequelize');
const conexao = require('./conexao');
const categorias = require('./categorias');

const mangas = conexao.define('mangas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: Sequelize.STRING,
    capitulo: Sequelize.INTEGER,
    status: Sequelize.STRING,
    lancamento: Sequelize.DataTypes.DATEONLY

});

categorias.hasMany(mangas, {
    onDelete: 'RESTRICT', //verifica se tem um manga associado a uma categoria
    onUpdate: 'CASCADE'
})

mangas.belongsTo(categorias);

mangas.sync( {force: false} );

module.exports = mangas;