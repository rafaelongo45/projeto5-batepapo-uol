function pegaMensagemServidor(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(pegaDadosMensagens);
}

function pegaDadosMensagens(objeto){
    const dado = objeto.data;
    console.log(objeto.data) //tirar depois
    console.log(objeto.data[0].type); //tirar depois
    setInterval(separaMensagemPorTipo(dado), 3000);
}

function separaMensagemPorTipo(dado){
    let tipoMensagem = null;
    for(let i = 0; i < dado.length; i++){
        renderizaMensagem(dado, tipoMensagem, i);
    }
}

function renderizaMensagem(dado, tipoMensagem, i){
    const janelaChat = document.querySelector('main');
    if (dado[i].type === 'status'){
        tipoMensagem = 'status-sala';
        janelaChat.innerHTML += `<div class = 'mensagem ${tipoMensagem}'>
        <span class = "hora">(${dado[i].time}) </span>  <span class = "usuario">${dado[i].from}</span> ${dado[i].text}
        </div>`;
    }else if (dado[i].type === 'private'){
        tipoMensagem = 'reservada';
        janelaChat.innerHTML += `<div class = 'mensagem reservada'> 
        <span class = "hora">(${dado[i].time})</span>  <span class = "usuario">${dado[i].from}</span>  reservadamente para <span class = "usuario"> ${dado[i].to}: Oi gatinha quer tc? 
        </div>`;
    }else{
        tipoMensagem = "";
        janelaChat.innerHTML += `<div class = 'mensagem ${tipoMensagem}'>
        <span class = "hora">(${dado[i].time}) </span>  <span class = "usuario">${dado[i].from}</span> para <span class = "usuario"> ${dado[i].to}: </span>${dado[i].text}
        </div>`;
    }
}

pegaMensagemServidor();