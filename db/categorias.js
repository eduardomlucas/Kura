//.............................................IMPORTAÇÕES.................................................
const Sequelize = require('sequelize');
const conexao = require('./conexao');
//criando a tabela no banco
    //definindo os elementos da tabela
const categorias = conexao.define('categorias',{ 
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: Sequelize.STRING,
    descricao: Sequelize.STRING
})
//verifica se atabela ja foi criada
    //se sim não cria novamente:)
categorias.sync({force: false}); 

module.exports = categorias;