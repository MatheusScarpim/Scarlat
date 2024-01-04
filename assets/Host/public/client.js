const socket = io()
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

let variaveis = objectParametros()


window.addEventListener('beforeunload', () => {
    socket.disconnect();
});

window.addEventListener('unload', () => {
    socket.disconnect();
});


sendNumber()


function sendNumber() {
    let dados = objectParametros()
    var valorNumero = dados["telefone"];
    console.log(valorNumero)

    let numeroBody = {
        "number": valorNumero
    }
    socket.emit("sendnumber", numeroBody)
}

function sendMessage(message) {
    let dados = objectParametros()
    var valorNumero = dados["telefone"];
    let msg = {
        number: valorNumero,
        message: message.trim(),
        name: "Scarlat"
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('sendmessage', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.name}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    console.log(msg)
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

socket.on('protocolos', (protocolos) => {
    console.log("tentou")
    arrumarProtolocos(protocolos)
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

function limparMensagem() {
    var divMensagem = document.querySelector('.message__area');

    if (divMensagem) {
        divMensagem.innerHTML = '';
    }
}

function arrumarProtolocos(response) {
    let chatBox = document.querySelector("body > div > div")
    chatBox.innerHTML = "";
    response.forEach(protocolo => {
        chatBox.insertAdjacentHTML(
            'beforeend',
            `<a href="/chat/${protocolo.PROTOCOLO_ID}/${protocolo.NUMERO}/${protocolo.NOME}" class="list-group-item list-group-item-action list-group-item-light rounded-0 border border-dark =">
            <div class="media"><img src="data:image/png;charset=utf-8;base64,${protocolo.FOTOPERFIL}" alt="user"
                    width="50" class="rounded-circle">
                <div class="media-body ml-4">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                        <h6 class="mb-0">${protocolo.NOME}</h6>
                        <small class="small font-weight-bold">${protocolo.ULTIMO_CONTATO}</small>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-1">
                        <p class="font-italic mb-0 text-small">${protocolo.ULTIMA_MENSAGEM}</p>
                            <div class="circle">
                                <span class="number">${protocolo.NAO_LIDAS}</span>
                            </div>

                        </div>
                </div>
            </div>
        </a>`
        );
    });
}

function objectParametros() {
    var urlAtual = window.location.href;

    var urlObjeto = new URL(urlAtual);

    var segmentos = urlObjeto.pathname.split('/');

    var chatID = segmentos[2];
    var telefone = segmentos[3];
    var nome = segmentos[4];

    return {
        "telefone": telefone,
        "protocolo": chatID,
        "nome": nome
    }
}