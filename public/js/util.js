function formataData(data, padrao){
    
    let novaData = data.split("-");
    let dia = novaData[2].length == 1? "0" +novaData[2]:novaData[2];
    let mes = novaData[1].length == 1? "0" +novaData[1]:novaData[1];
    let ano = novaData[0];

    let retorno = padrao == 'BR'? `${dia}/${mes}/${ano}` : `${ano}`;
    return retorno;
}

module.exports = formataData;