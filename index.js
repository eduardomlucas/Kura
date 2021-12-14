//-------------------------------------------------------IMPORTAÇÕES----------------------------------------
//MODULO DO EXPRESS
const express = require ('express');
//MODULO DO SEQUELIZE (BD)
const Sequelize = require('sequelize');
//MODULO CONEXÃO (BD)
const conexao = require('./db/conexao');
//MÓDULO ARTISTAS
const categorias = require('./db/categorias');
//MÓDULO ALBUNS
const mangas = require('./db/mangas');
//MÓDULO formataData


const formataData = require('./public/js/util');
const { where } = require('sequelize');
const app = express();

const port = 5001;

//-------------------------------------------------------INICIALIZAÇÕES-----------------------------
app.use(express.static("public"));
app.use(express.urlencoded( {extended: false} ) );
app.set("view engine", "ejs");

conexao.authenticate();
//--------------------------------------------------TRATAMENTO DE REQUISIÇÕES--------------------------

//Index
    //renderizando a página inicial para o usuario
    //vai sair a função de renderizar os mangas (por enquanto fica pra usa de base)
app.get("/",function(req,res){
    mangas
        .findAll({order: ["id"]})
    .then(function(mangas){
        res.render("index", {mangas: mangas}) 
    })
});

//-------------------------------------------------------ARTISTAS------------------------------------------------
//Renderizando a página principal com os artistas
    //verificando os parametros da msg
    //findando do banco ordenando pelo name
    //e listar todas categorias já criadas
app.get("/categorias/lista/:mensagem?", function(req, res){ 
    categorias
        .findAll({order: ["nome"]})
        .then(function(categorias){
            if(req.params.mensagem)
                res.render("categorias/categorias",  {categorias: categorias,
                    mensagem: "Esta categoria não pode ser excluida, pois está vinculada a um mangá existente!"});
            else
                res.render("categorias/categorias",{categorias: categorias, mensagem: ""})
        })
                 
    });
//Adicionando uma nova vategoria
    //renderizar página da edição
    //e passar o parametro da msg para o usuário (IF do html) 
app.get("/categorias/novo", function(req,res){
    res.render("categorias/novo",{mensagem:""})
})    
//Salvando uma nova vategoria
    //pegando do corpo do site
    // colocando a descricao na coluna da tabela
    // após, renderiza a página novamente
    //passando a mensagem de conclusão como parâmetro!
app.post("/categorias/salvar", function(req,res){
        let nome = req.body.nome;
        let descricao = req.body.descricao;      
        categorias
            .create({nome: nome, descricao:descricao})   
            .then( 
                res.render("categorias/novo", {mensagem: "categoria incluída"}));
});
//Edição de uma categoria
    //pega o parametro do id da propria req
    //vai findar pela primary key qual é o id
    //após recebe o id que quer ser editado
    //e envia para a página de edição do objeto específico
app.get("/categorias/editar/:id", function(req,res){
    let id = req.params.id;
    categorias
        .findByPk(id)
        .then(function(categoria){
            res.render("categorias/editar",{categoria: categoria})
        })
})
//Atualizando
    //pegando o id por parametro no corpo da página
    //pegando a descricao por parametro no corpo da página
    //vai dar um update no banco após a edição (/ATUALIZAR)
    //function que redireciona para a listagem das categorias
app.post("/categorias/atualizar", function(req,res){
    let id = req.body.id;
    let nome = req.body.nome; 
    let descricao = req.body.descricao;
        categorias
            .update({nome: nome, descricao: descricao},{where: {id: id}}) 
            .then(function(){
                res.redirect("/categorias/lista");
            })
});
//Exclusão
    //destroy onde o id selecionado for igual ao do banco
    //redirect pra lista de categorias
    //erro caso tenha algum mangá associado a uma categoria
app.get("/categorias/excluir/:id", function(req,res){
    let id = req.params.id;
        categorias
            .destroy({where: { id : id } })
            .then(function(){
                res.redirect("/categorias/lista");
            })
            .catch(function(erro){
                if(erro instanceof Sequelize.ForeignKeyConstraintError){
                    res.redirect("/categorias/lista/erro");
                }
            })
    })  

//acesso
    //acessar a página de uma categoria específica
    //assim podendo visualizar todos os mangas atribuidos àquela categoria
    //ATRIBUIR FUNÇÕES PARA FAZER O WHERE E CADA CHAVE ESTRANGEIRA
app.get("/categorias/acesso/:id", function(req,res){
    let id = req.params.id;
    categorias
        .findByPk(id)
        .then(function(categoria){
            mangas
            //DENTRO DE MANGAS DAR UM GET NA FK DE CATEGORIAS E RENDER NA PÁGINA APENAS OS DAQUELA ESPECIFICA
                //ATUALIZAR O WHERE PARA FINDAR NO BANCO A FK E A PK
                .findAll( { where: {categoriaId: id},order: [ "nome" ] ,include: [{model: categorias}] } )
                .then(function(mangas){
                     res.render("categorias/acesso", {mangas:mangas, categoria:categoria, formataData:formataData});      
                })         
        })
})  
//-----------------------------------------------------MANGAS----------------------------------------------------
app.get("/mangas", function(req,res){
    mangas
        .findAll({order: ["id"], include: [{model: categorias}]})
        .then(function(mangas){
            res.render("mangas/mangas", {mangas: mangas, formataData: formataData})
        })
})
//Registro de um novo manga
    //se receber por paramaetro a msg será mostrada ao usuário
app.get("/mangas/novo/:mensagem?", function(req, res){ 
    categorias
        .findAll( {order: ["id"] } )
        .then(function(categorias){
            if(req.params.mensagem)    
                res.render("mangas/novo", {mensagem: "Manga registrado com sucesso.", categorias: categorias} );
            else
                res.render("mangas/novo", {mensagem: "", categorias:categorias} )    
           })   
});
//Salvando um novo manga
   //pegando as variaveis como parametros do POST (Express)
   //inserindo os valores no banco
   //redirecionando de volta para a página de novo 
   //com o parametro de inclusão para que seja disparada a function de mensagem da pagina NOVO
   //mostrando um alert demonstrando que foi salvo com sucesso
app.post("/mangas/salvar", function(req,res){
    let nome = req.body.nome;
    let capitulo = req.body.capitulo;
    let status = req.body.status;
    let lancamento = req.body.lancamento;
    let categoria = req.body.categoria;
    mangas
        .create({nome: nome, capitulo: capitulo, status: status, lancamento: lancamento, categoriaId: categoria})
        .then(          
            res.redirect("/mangas/novo/incluido")
        );
});
//Página de edição
    //da um find pela primary key (id)
    //renderiza a página de edição com o contato selecionado
app.get("/mangas/editar/:id", function(req,res){
    let id = req.params.id;
    mangas
        .findByPk(id)
        .then(function(manga){
            categorias
                    .findAll()
                    .then(function(categorias){
                        res.render("mangas/editar", {manga:manga, categorias:categorias, formataData:formataData});
                    })
            })
    });
//Atualizando
    //seta todas as variáveis que serão passadas no forms
    //após pegar todas as váriaveis que serão editadas
    //da um update no BD e redirect para a página de mangas
app.post("/mangas/atualizar",function(req,res){
    let id = req.body.id;
    let nome = req.body.nome;
    let capitulo = req.body.capitulo;
    let status = req.body.status;
    let lancamento = req.body.lancamento;
    let categoria = req.body.categoria;
    mangas
        .update({nome: nome, capitulo: capitulo, status: status, lancamento: lancamento,categoriaId: categoria},{where: {id: id}})
        .then(function(){
            res.redirect("/mangas");
        })
})
//Exclusão
    //destroy onde o ID selecionado for igual ao ID do BD
app.get("/mangas/excluir/:id",function(req,res){
    let id = req.params.id;
    mangas
        .destroy( {where: {id: id} })
        .then(function(){
            res.redirect("/mangas");
        })
})

app.get("/mangas/acesso/:id", function(req,res){
    let id = req.params.id;
    mangas
        .findByPk(id)
        .then(function(manga){
            categorias
                    .findAll()
                    .then(function(categorias){
                        res.render("mangas/acesso", {manga:manga, categorias:categorias, formataData:formataData});
                    })
            })
    });

app.get("/perfil",function(req,res){
    mangas
        .findAll({order: ["id"], include: [{model: categorias}]})
    .then(function(mangas){
        res.render("perfil", {mangas: mangas}) 
    })
})
//PORTA USADA
app.listen(port);
console.log('rodando na porta '  + `${port}`)