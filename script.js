let dado = null;
let janelaChat = null;
let nomeUsuario = null;
let ultimaMensagem = null;
let objetoUltimaMsg = null;
let objetoUltimaMsgAtualizada = null;
let atualizou = false;

function entrarNoSite(nomeUsuario){
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name: nomeUsuario})
    requisicao.then(criaEstruturaSite);
    requisicao.catch(falhaNaEntrada);
}

function falhaNaEntrada(){
    alert("Digite outro nome. Este já está em uso!")
    window.location.reload();
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
    renderizaMensagem();
}

function renderizaMensagem() {
    let tipoMensagem = null;
    janelaChat.innerHTML = "";
    for (let i = 0; i < dado.length; i++) {
        if (dado[i].type === 'status') {
            tipoMensagem = 'status-sala';
            janelaChat.innerHTML += `<div class = 'mensagem ${tipoMensagem}'>
            <span class = "hora">(${dado[i].time}) </span>  <span class = "usuario">${dado[i].from}</span> ${dado[i].text}
            </div>`;
        } else if (dado[i].type === 'private_message') {
            tipoMensagem = 'reservada';
            mensagemPrivada(i, tipoMensagem); //faz a checagem e so mostra a msg se o from ou o to é o nomedeusuario
        }else {
            tipoMensagem = "";
            janelaChat.innerHTML += `<div class = 'mensagem ${tipoMensagem}'>
            <span class = "hora">(${dado[i].time}) </span>  <span class = "usuario">${dado[i].from}</span> para <span class = "usuario"> ${dado[i].to}: </span>${dado[i].text}
            </div>`;
        }
        pegaDadoUltimaMensagem(i)
    }
}

function mensagemPrivada(i, tipoMensagem){
    if(dado[i].to === nomeUsuario || dado[i].from === nomeUsuario){
        janelaChat.innerHTML += `<div class = 'mensagem ${tipoMensagem}'> 
            <span class = "hora">(${dado[i].time})</span>  <span class = "usuario">${dado[i].from}</span>  reservadamente para <span class = "usuario"> ${dado[i].to}</span>: Oi gatinha quer tc? 
            </div>`;
    }else{
        janelaChat.innerHTML += "";
    }
}

function pegaDadoUltimaMensagem(i){
    ultimaMensagem = document.querySelectorAll('.mensagem') 
    if (i === (dado.length - 1) && atualizou === false){
        objetoUltimaMsg = {from: dado[i].from, to: dado[i].to, type: dado[i].type, time: dado[i].time, text: dado[i].text}
        atualizou = true;
    }else if (i === (dado.length-1) && atualizou === true){
        atualizou = false;
        objetoUltimaMsgAtualizada = {from: dado[i].from, to: dado[i].to, type: dado[i].type, time: dado[i].time, text: dado[i].text}
    }
}

function atualizaChat() {
    pegaMensagemServidor();
    if (objetoUltimaMsgAtualizada !== null && objetoUltimaMsg.time === objetoUltimaMsgAtualizada.time){
        
    }else{
        ultimaMensagem[ultimaMensagem.length-1].scrollIntoView();
    }
}

function pegaMensagemDigitada(){
    let mensagemDigitada = document.querySelector('input').value; //fazer ela ser global
    let dadosUsuario = {
        from: nomeUsuario,
	    to: 'Todos',
	    text: mensagemDigitada,
	    type: "message" // ou "private_message" para o bônus
    }

    //no momento envia mensagem privada apenas para uma pessoa. quando incluir o bonus trocar o to e o tipe
    enviaMensagemServidor(dadosUsuario);
    mensagemDigitada = '';
}

function enviaMensagemServidor(dado){
    let promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', dado);
    promessa.then(pegaMensagemServidor);
    promessa.catch(falhaEnvioMensagem)
}

function falhaEnvioMensagem(){
    window.location.reload()
}

function criaEstruturaSite(){
    const site = document.body;
    site.innerHTML = `
    <header class='header'>
        <img src="./imagens/logo 1.png" alt="Logo da UOL">
        <ion-icon name="people"></ion-icon>
    </header>
    <main>
    
    </main>

    <footer>
        <input class='caixa-texto' type="text" placeholder="Escreva aqui..." />
        <button onclick="pegaMensagemDigitada()">
            <ion-icon name="paper-plane-outline"></ion-icon>
        </button>
    </footer>`
    janelaChat = document.querySelector('main');
    pegaMensagemServidor();
    setInterval(checarPresencaUsuario, 5000);
    setInterval(atualizaChat, 3000);
}

function criaTelaInicial(){
    const site = document.body;
    site.innerHTML = `
    <section class='tela inicial'>
        <img src="./imagens/logo 2.png" alt="logo da uol">
        <input type="text" placeholder="Digite seu nome">
        <button onclick = "pegaNomeUsuario()">Entrar</button>
    </section>`
}

function pegaNomeUsuario(){
    const input = document.querySelector('input');
    nomeUsuario = input.value;
    entrarNoSite(nomeUsuario);
}

criaTelaInicial();
