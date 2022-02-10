let dado = null;
const janelaChat = document.querySelector('main');
let nomeUsuario = null;
let ultimaMensagem = null;
let ultimaMensagemHTML = null;

function entrarNoSite(){
    nomeUsuario = prompt('Qual é o seu nome?');
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name: nomeUsuario})
    requisicao.catch(falhaNaEntrada);
}

function falhaNaEntrada(){
    alert("Digite outro nome. Este já está em uso!")
    entrarNoSite();
}

function checarPresencaUsuario(){
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name: nomeUsuario})
}

function pegaMensagemServidor() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(pegaDadosMensagens);
}

function pegaDadosMensagens(objeto) {
    dado = objeto.data;
    console.log(objeto.data)
    objetoUltimaMensagem = dado[dado.length-1].time;
    renderizaMensagem();
}

function renderizaMensagem() {
    let tipoMensagem = null;
    janelaChat.innerHTML = null;

    for (let i = 0; i < dado.length; i++) {
        if (dado[i].type === 'status') {
            tipoMensagem = 'status-sala';
            janelaChat.innerHTML += `<div class = 'mensagem ${tipoMensagem}'>
            <span class = "hora">(${dado[i].time}) </span>  <span class = "usuario">${dado[i].from}</span> ${dado[i].text}
            </div>`;
        } else if (dado[i].type === 'private_message') {
            tipoMensagem = 'reservada';
            janelaChat.innerHTML += `<div class = 'mensagem reservada'> 
            <span class = "hora">(${dado[i].time})</span>  <span class = "usuario">${dado[i].from}</span>  reservadamente para <span class = "usuario"> ${dado[i].to}</span>: Oi gatinha quer tc? 
            </div>`;
        } else {
            tipoMensagem = "";
            janelaChat.innerHTML += `<div class = 'mensagem ${tipoMensagem}'>
            <span class = "hora">(${dado[i].time}) </span>  <span class = "usuario">${dado[i].from}</span> para <span class = "usuario"> ${dado[i].to}: </span>${dado[i].text}
            </div>`;
        }
        pegaDadoUltimaMensagem(i)
    }

}

function pegaDadoUltimaMensagem(i){
    if (i === dado.length - 1){
        ultimaMensagem = document.querySelectorAll('.mensagem') 
        ultimaMensagemHTML = ultimaMensagem[i].innerHTML;
    }
}

function atualizaChat() {
    pegaMensagemServidor();
    ultimaMensagem[dado.length-1].scrollIntoView();
}

entrarNoSite();
setInterval(checarPresencaUsuario, 5000);
pegaMensagemServidor();
setInterval(atualizaChat, 3000)