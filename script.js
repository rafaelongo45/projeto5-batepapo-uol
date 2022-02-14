let dado = null;
let janelaChat = null;
let nomeUsuario = null;
let ultimaMensagem = null;
let objetoUltimaMsg = null;
let objetoUltimaMsgAtualizada = null;
let atualizou = false;
let mensagemPara = "Todos";
let tipoMensagem = "message";

function criaTelaInicial() {
    const site = document.body;
    site.innerHTML = `
    <section class='tela inicial'>
        <img src="./imagens/logo 2.png" alt="logo da uol">
        <input type="text" placeholder="Digite seu nome" data-identifier="enter-name">
        <button onclick = "pegaNomeUsuario()" data-identifier="start">Entrar</button>
    </section>`
}

function pegaNomeUsuario() {
    const input = document.querySelector('input');
    nomeUsuario = input.value;
    entrarNoSite(nomeUsuario);
}

function entrarNoSite(nomeUsuario) {
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', { name: nomeUsuario })
    requisicao.then(criaEstruturaSite);
    requisicao.catch(falhaNaEntrada);
}

function falhaNaEntrada() {
    alert("Digite outro nome. Este já está em uso!")
    window.location.reload();
}

function criaEstruturaSite() {
    const site = document.body;
    site.innerHTML = `
    <header class='header'>
        <img src="./imagens/logo 1.png" alt="Logo da UOL">
        <button onclick = "mostraUsuarios()"><ion-icon name="people"></ion-icon></button>
    </header>
    <main class = "">
    
    </main>

    <footer>
        <input class='caixa-texto' type="text" placeholder="Escreva aqui..." />
        <button onclick="pegaMensagemDigitada()" data-identifier="send-message">
            <ion-icon name="paper-plane-outline"></ion-icon>
        </button>
    </footer>
    <aside class = "" onclick = "voltaChat()"> </aside>
    <menu class = "nao-aparece">
        <div class = "listaUsuarios"></div>

        <section class = "visibilidade"></section>
    </menu>`

    janelaChat = document.querySelector('main');
    verificaTipoMsg();
    pegaMensagemServidor();
    setInterval(checarPresencaUsuario, 5000);
    setInterval(atualizaChat, 3000);
}

function verificaTipoMsg() {
    const input = document.querySelector('input');
    if (tipoMensagem === 'message') {
        input.placeholder = `Enviando para ${mensagemPara} (publicamente)`

    } else {
        input.placeholder = `Enviando para ${mensagemPara} (reservadamente)`
    }
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
            janelaChat.innerHTML += `<div class = 'mensagem ${tipoMensagem}' data-identifier="message">
            <span class = "hora">(${dado[i].time}) </span>  <span class = "usuario">${dado[i].from}</span> ${dado[i].text}
            </div>`;
        } else if (dado[i].type === 'private_message') {
            tipoMensagem = 'reservada';
            mensagemPrivada(i, tipoMensagem);
        } else {
            tipoMensagem = "";
            janelaChat.innerHTML += `<div class = 'mensagem ${tipoMensagem}' data-identifier="message">
            <span class = "hora">(${dado[i].time}) </span>  <span class = "usuario">${dado[i].from}</span> para <span class = "usuario"> ${dado[i].to}: </span>${dado[i].text}
            </div>`;
        }
        pegaDadoUltimaMensagem(i)
    }
}

function mensagemPrivada(i, tipoMensagem) {
    if (dado[i].to === nomeUsuario || dado[i].from === nomeUsuario) {
        janelaChat.innerHTML += `<div class = 'mensagem ${tipoMensagem}' data-identifier="message"> 
            <span class = "hora">(${dado[i].time})</span>  <span class = "usuario">${dado[i].from}</span>  reservadamente para <span class = "usuario"> ${dado[i].to}</span>: ${dado[i].text} 
            </div>`;
    } else {
        janelaChat.innerHTML += "";
    }
}

function pegaDadoUltimaMensagem(i) {
    ultimaMensagem = document.querySelectorAll('.mensagem')
    if (i === (dado.length - 1) && atualizou === false) {
        objetoUltimaMsg = { from: dado[i].from, to: dado[i].to, type: dado[i].type, time: dado[i].time, text: dado[i].text }
        atualizou = true;
    } else if (i === (dado.length - 1) && atualizou === true) {
        atualizou = false;
        objetoUltimaMsgAtualizada = { from: dado[i].from, to: dado[i].to, type: dado[i].type, time: dado[i].time, text: dado[i].text }
    }
}

function checarPresencaUsuario() {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', { name: nomeUsuario })
}

function atualizaChat() {
    pegaMensagemServidor();
    if (objetoUltimaMsgAtualizada !== null && objetoUltimaMsg.time === objetoUltimaMsgAtualizada.time) {

    } else {
        ultimaMensagem[ultimaMensagem.length - 1].scrollIntoView();
    }
}

function pegaMensagemDigitada() {
    let mensagemDigitada = document.querySelector('input').value;
    let dadosUsuario = {
        from: nomeUsuario,
        to: mensagemPara,
        text: mensagemDigitada,
        type: tipoMensagem
    }
    enviaMensagemServidor(dadosUsuario);
}

function enviaMensagemServidor(dado) {
    let promessa = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', dado);
    promessa.then(pegaMensagemServidor);
    promessa.catch(falhaEnvioMensagem)
}

function falhaEnvioMensagem() {
    window.location.reload()
}

function mostraUsuarios() {
    const site = document.body;
    const barraLateral = document.querySelector('menu');
    const background = document.querySelector('aside');
    barraLateral.classList.remove('nao-aparece')
    barraLateral.classList.add('barra-lateral');
    background.classList.add('novo-corpo');
    site.classList.add('no-scroll');
    mostraParticipantesBarra();
    setInterval(mostraParticipantesBarra, 10000);
}

function mostraParticipantesBarra() {
    const menu = document.querySelector('menu');
    menu.innerHTML = `<b>Escolha um contato para enviar a mensagem:</b>
    <p onclick = "itemEscolhido(this)" data-identifier="participant"><span><ion-icon name="people"></ion-icon> </span> Todos <span class = "check nao-aparece "> <ion-icon name="checkmark-outline"></ion-icon></span></p>
    <div class = "listaUsuarios"></div>`
    const usuarios = document.querySelector('.listaUsuarios');
    for (let i = 0; i < dado.length; i++) {
        usuarios.innerHTML += `<p onclick = "itemEscolhido(this)" data-identifier="participant"><span><ion-icon name="person-circle"> </ion-icon></span> ${dado[i].from} <span class = "check nao-aparece "> <ion-icon name="checkmark-outline"></ion-icon></span></p>`
    }

    menu.innerHTML += `<section class = "visibilidade"><b>Escolha a visibilidade:</b>
    <p onclick = "visibilidadeEscolhida(this)" data-identifier="visibility"> <span><ion-icon name="lock-open"></ion-icon></span> Público<span class = "check nao-aparece "> <ion-icon name="checkmark-outline"></ion-icon></span></p>
    <p onclick = "visibilidadeEscolhida(this)" data-identifier="visibility"> <span><ion-icon name="lock-closed"></ion-icon></span> Reservadamente <span class = "check nao-aparece "> <ion-icon name="checkmark-outline"></ion-icon></span></p>
    </section>`
}

function voltaChat() {
    const site = document.body;
    const barraLateral = document.querySelector('menu');
    const background = document.querySelector('aside');
    barraLateral.classList.add('nao-aparece')
    barraLateral.classList.remove('barra-lateral');
    background.classList.remove('novo-corpo');
    site.classList.remove('no-scroll');
}

function itemEscolhido(elemento) {
    const checkMark = elemento.querySelector('.check');
    const temIcone = document.querySelector('.escolhido');

    if (temIcone !== null) {
        temIcone.classList.add('nao-aparece');
        temIcone.classList.remove('escolhido');
    }
    checkMark.classList.remove('nao-aparece');
    checkMark.classList.add('escolhido');

    mensagemPara = elemento.innerText;
    verificaTipoMsg()
}

function visibilidadeEscolhida(elemento) {
    const checkMark = elemento.querySelector('.check');
    const temIcone = document.querySelector('.visibilidade .escolhido');

    if (temIcone !== null) {
        temIcone.classList.add('nao-aparece');
        temIcone.classList.remove('escolhido');
    }
    checkMark.classList.remove('nao-aparece');
    checkMark.classList.add('escolhido');

    if (elemento.innerText === "Reservadamente") {
        tipoMensagem = "private_message";
    } else {
        tipoMensagem = "message"
    }
    verificaTipoMsg()
}

criaTelaInicial();
