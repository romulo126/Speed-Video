
function adicionarControlesDeVelocidade(video) {
    // Verifica se os botões já foram adicionados para evitar duplicação
    if (video.parentElement.querySelector('.speed-control')) return;

    // Cria o container para os botões e o contador de velocidade
    const container = document.createElement('div');
    container.className = 'speed-control';

    // Cria o contador de velocidade
    const speedDisplay = document.createElement('span');
    speedDisplay.textContent = video.playbackRate.toFixed(2) + 'x';
    speedDisplay.className = 'speed-display';
    speedDisplay.style.marginLeft = '10px';

    // Cria o botão de aumentar a velocidade
    const speedUpButton = document.createElement('button');
    speedUpButton.textContent = '+';
    speedUpButton.className = 'speed-up';
    speedUpButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que o vídeo seja pausado
        video.playbackRate += 0.25;
        speedDisplay.textContent = video.playbackRate.toFixed(2) + 'x'; // Atualiza o contador
    });

    // Cria o botão de diminuir a velocidade
    const speedDownButton = document.createElement('button');
    speedDownButton.textContent = '-';
    speedDownButton.className = 'speed-down';
    speedDownButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que o vídeo seja pausado
        video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
        speedDisplay.textContent = video.playbackRate.toFixed(2) + 'x'; // Atualiza o contador
    });

    // Cria o botão de configurações
    const configButton = document.createElement('button');
    configButton.textContent = '⚙';
    configButton.className = 'config-button';
    configButton.addEventListener('click', (event) => {
        event.stopPropagation();
        abrirConfiguracoes();
    });

    // Adiciona os botões ao container
    container.appendChild(speedUpButton);
    container.appendChild(speedDownButton);
    container.appendChild(speedDisplay);
    container.appendChild(configButton);

    // Estilo do container
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.background = 'rgba(0, 0, 0, 0.5)';
    container.style.color = 'white';
    container.style.padding = '5px';
    container.style.borderRadius = '5px';
    container.style.display = 'flex';
    container.style.gap = '5px';

    // Estilo dos botões
    speedUpButton.style.background = 'none';
    speedUpButton.style.border = 'none';
    speedUpButton.style.color = 'white';
    speedUpButton.style.fontSize = '20px';
    speedUpButton.style.cursor = 'pointer';

    speedDownButton.style.background = 'none';
    speedDownButton.style.border = 'none';
    speedDownButton.style.color = 'white';
    speedDownButton.style.fontSize = '20px';
    speedDownButton.style.cursor = 'pointer';

    configButton.style.background = 'none';
    configButton.style.border = 'none';
    configButton.style.color = 'white';
    configButton.style.fontSize = '20px';
    configButton.style.cursor = 'pointer';

    // Estilo do contador de velocidade
    speedDisplay.style.color = 'white';
    speedDisplay.style.fontSize = '20px';

    // Torna o container interativo, mas não interfere com o vídeo
    container.style.pointerEvents = 'auto';

    // Coloca o container dentro do elemento pai do vídeo
    
    video.parentElement.style.position = 'relative';
    video.parentElement.appendChild(container);

    // Adiciona controles de teclado para o vídeo
    document.addEventListener('keydown', (event) => {
        if (localStorage.getItem("speedVideoUp") === null || localStorage.getItem("speedVideoReset") === null || localStorage.getItem("speedVideoDown") === null) {
            localStorage.setItem('speedVideoUp', 'a');
            localStorage.setItem('speedVideoDown', 'd');
            localStorage.setItem('speedVideoReset', 's');
        }

        switch(event.key) {
            case localStorage.getItem('speedVideoUp'):
                video.playbackRate += 0.25;
                break;
            case localStorage.getItem('speedVideoDown'):
                video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
                break;
            case localStorage.getItem('speedVideoReset'):
                video.playbackRate = 1.0;
                break;
        }

        speedDisplay.textContent = video.playbackRate.toFixed(2) + 'x'; // Atualiza o contador
    });
}

function observarMutacoes() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'VIDEO') {
                        adicionarControlesDeVelocidade(node);
                    } else if (node.querySelectorAll) {
                        const videos = node.querySelectorAll('video');
                        videos.forEach(video => adicionarControlesDeVelocidade(video));
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Também verificar vídeos já presentes na página
    const videos = document.querySelectorAll('video');
    videos.forEach(video => adicionarControlesDeVelocidade(video));
}

function abrirConfiguracoes() {
    // Verifica se a div de configuração já existe
    if (document.querySelector('.config-popup')) return;

    const configDiv = document.createElement('div');
    configDiv.className = 'config-popup';
    configDiv.style.position = 'fixed';
    configDiv.style.top = '50%';
    configDiv.style.left = '50%';
    configDiv.style.transform = 'translate(-50%, -50%)';
    configDiv.style.background = 'rgba(0, 0, 0, 0.8)';
    configDiv.style.color = 'white';
    configDiv.style.padding = '20px';
    configDiv.style.borderRadius = '10px';
    configDiv.style.zIndex = '10000';
    configDiv.style.textAlign = 'center';
    configDiv.style.display = 'flex';
    configDiv.style.gap = '10px';

    // Adiciona o texto "Config"
    const configText = document.createElement('div');
    configText.textContent = 'X';
    configText.style.marginRight = '10px';
    configText.style.alignSelf = 'center';
    configText.id = 'fecharConfigSpeed';
    configText.style.cursor = 'pointer'; 

    const inputButtonSalvar = document.createElement('button');
    inputButtonSalvar.textContent = 'Salvar';
    inputButtonSalvar.style.flex = '1';
    inputButtonSalvar.style.padding = '5px';
    inputButtonSalvar.style.borderRadius = '5px';
    inputButtonSalvar.style.border = 'none';

    const inputButtonReset = document.createElement('button');
    inputButtonReset.textContent = 'Resetar';
    inputButtonReset.style.flex = '1';
    inputButtonReset.style.padding = '5px';
    inputButtonReset.style.borderRadius = '5px';
    inputButtonReset.style.border = 'none';
    

    // Adiciona o primeiro campo de input
    const inputField1 = document.createElement('input');
    inputField1.type = 'text';
    inputField1.placeholder = 'Tecla para aumentar a velocidade do video';
    inputField1.style.flex = '1';
    inputField1.style.padding = '5px';
    inputField1.style.borderRadius = '5px';
    inputField1.style.border = 'none';
    inputField1.id = 'speedVideoInputUp';

    // Adiciona o segundo campo de input
    const inputField2 = document.createElement('input');
    inputField2.type = 'text';
    inputField2.placeholder = 'Tecla para resetar a velocidade do video';
    inputField2.style.flex = '1';
    inputField2.style.padding = '5px';
    inputField2.style.borderRadius = '5px';
    inputField2.style.border = 'none';
    inputField2.id = 'speedVideoInputReset';

    // Adiciona o terceiro campo de input
    const inputField3 = document.createElement('input');
    inputField3.type = 'text';
    inputField3.placeholder = 'Tecla para diminuir a velocidade do video';
    inputField3.style.flex = '1';
    inputField3.style.padding = '5px';
    inputField3.style.borderRadius = '5px';
    inputField3.style.border = 'none';
    inputField3.id = 'speedVideoInputDown';

    // Adiciona os elementos à div de configuração
    configDiv.appendChild(configText);
    configDiv.appendChild(inputField1);
    configDiv.appendChild(inputField2);
    configDiv.appendChild(inputField3);
    configDiv.appendChild(inputButtonSalvar);
    configDiv.appendChild(inputButtonReset);

    document.body.appendChild(configDiv);

    function salvarConfig() {
        let speedVideoInputUp = document.getElementById("speedVideoInputUp").value;
        let speedVideoInputDown = document.getElementById("speedVideoInputDown").value;
        let speedVideoInputReset = document.getElementById("speedVideoInputReset").value;

        localStorage.setItem('speedVideoUp', speedVideoInputUp);
        localStorage.setItem('speedVideoDown',speedVideoInputDown);
        localStorage.setItem('speedVideoReset', speedVideoInputReset);

        fecharConfiguracoes();
    }

    function fecharConfiguracoes() {
        configDiv.remove();
    }

    function resetConfig(){
        localStorage.setItem('speedVideoUp', 'a');
        localStorage.setItem('speedVideoDown', 'd');
        localStorage.setItem('speedVideoReset', 's');

        fecharConfiguracoes();
    }

    // Previne o fechamento ao clicar dentro da div
    configDiv.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    inputButtonSalvar.addEventListener('click', salvarConfig);
    inputButtonReset.addEventListener('click', resetConfig);
    configText.addEventListener('click', fecharConfiguracoes);
}


// Executa a função de observação ao carregar a página
window.addEventListener('load', observarMutacoes);
