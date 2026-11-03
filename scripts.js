// ===== Apresentação: A Implementação da IA na Medicina =====

const slides = Array.from(document.querySelectorAll('.slide'));
const trilha = document.getElementById('trilha');
const preenchimento = document.getElementById('preenchimento');
const contador = document.getElementById('contador');
const botaoAnterior = document.getElementById('anterior');
const botaoProximo = document.getElementById('proximo');

let atual = 0;
let nos = [];

// Monta a linha do tempo com um ponto para cada slide
function montarTimeline() {
  const total = slides.length;

  slides.forEach((slide, i) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'no';
    botao.style.left = (i / (total - 1)) * 100 + '%';
    botao.setAttribute('aria-label', `Ir para o slide ${i + 1}: ${slide.dataset.titulo}`);
    botao.innerHTML =
      '<span class="ponto"></span>' +
      `<span class="rotulo">${slide.dataset.titulo}</span>`;
    botao.addEventListener('click', () => irPara(i));
    trilha.appendChild(botao);
    nos.push(botao);
  });
}

// Anima números (ex.: 200 milhões) quando o slide aparece
function animarNumeros(slide) {
  slide.querySelectorAll('[data-contar]').forEach((el) => {
    const alvo = Number(el.dataset.contar);
    const duracao = 1200;
    const inicio = performance.now();

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      el.textContent = Math.round(alvo * progresso);
      if (progresso < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  });
}

// Vai para o slide de índice n
function irPara(n) {
  const indice = Math.max(0, Math.min(n, slides.length - 1));
  const mudou = indice !== atual || !slides[indice].classList.contains('ativo');
  atual = indice;

  slides.forEach((slide, i) => {
    slide.classList.toggle('ativo', i === atual);
    slide.classList.toggle('passado', i < atual);
  });

  nos.forEach((no, i) => {
    no.classList.toggle('ativo', i === atual);
    no.classList.toggle('feito', i < atual);
  });

  preenchimento.style.width = (atual / (slides.length - 1)) * 100 + '%';
  contador.textContent = `${atual + 1} / ${slides.length}`;
  botaoAnterior.disabled = atual === 0;
  botaoProximo.disabled = atual === slides.length - 1;
  botaoAnterior.style.opacity = atual === 0 ? 0.4 : 1;
  botaoProximo.style.opacity = atual === slides.length - 1 ? 0.4 : 1;

  if (mudou) animarNumeros(slides[atual]);

  history.replaceState(null, '', '#' + (atual + 1));
}

const proximo = () => irPara(atual + 1);
const anterior = () => irPara(atual - 1);

// Botões
botaoAnterior.addEventListener('click', anterior);
botaoProximo.addEventListener('click', proximo);

// Teclado
document.addEventListener('keydown', (evento) => {
  switch (evento.key) {
    case 'ArrowRight':
    case 'PageDown':
    case ' ':
      evento.preventDefault();
      proximo();
      break;
    case 'ArrowLeft':
    case 'PageUp':
      evento.preventDefault();
      anterior();
      break;
    case 'Home':
      irPara(0);
      break;
    case 'End':
      irPara(slides.length - 1);
      break;
    case 'f':
    case 'F':
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      break;
  }
});

// Gesto de deslizar (celular/tablet)
let toqueInicioX = 0;
document.addEventListener('touchstart', (e) => {
  toqueInicioX = e.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const diferenca = e.changedTouches[0].clientX - toqueInicioX;
  if (Math.abs(diferenca) > 60) {
    diferenca < 0 ? proximo() : anterior();
  }
}, { passive: true });

// Início: respeita o número do slide na URL (#3, por exemplo)
montarTimeline();
const inicial = parseInt(location.hash.replace('#', ''), 10);
irPara(Number.isNaN(inicial) ? 0 : inicial - 1);