document.addEventListener('DOMContentLoaded', () => {

  // ===================== DADOS DO CAÇA-FILMES =====================
  const ICONES = ['🎬', '🍿', '🎞️', '👽', '🔪', '🏎️', '📼', '⭐'];

  const CATALOGO_SORTEIO = [
    { titulo: "Fronteira 88", genero: "Ação / Fuga", icone: "🏎️" },
    { titulo: "Alien: O Oitavo Passageiro", genero: "Ficção Científica", icone: "👽" },
    { titulo: "Psicose", genero: "Suspense / Terror", icone: "🔪" },
    { titulo: "Curtindo a Vida Adoidado", genero: "Comédia", icone: "🍿" },
    { titulo: "Blade Runner 1982", genero: "Cyberpunk / Ficção", icone: "📼" },
    { titulo: "Pulp Fiction", genero: "Crime / Cult", icone: "🎬" },
    { titulo: "Mad Max 2", genero: "Ação Pós-Apocalíptica", icone: "⭐" },
    { titulo: "Poltergeist", genero: "Terror Clássico", icone: "🎞️" }
  ];

  const stripElements = [
    document.getElementById('strip0'),
    document.getElementById('strip1'),
    document.getElementById('strip2')
  ];

  const btnSpin = document.getElementById('btnSpin');
  const leverKnob = document.getElementById('leverKnob');
  const resultBox = document.getElementById('resultBox');
  const revealedContent = document.getElementById('revealedContent');
  const campoFita = document.getElementById('campoFita');

  const ALTURA_ITEM = 108; // Mesma altura .mini no CSS
  const ITENS_POR_ROLO = 24; 

  // Preenche cada rolo com sequências repetidas de ícones para dar o efeito de carretel
  function inicializarRolos() {
    stripElements.forEach((strip) => {
      strip.innerHTML = '';
      for (let i = 0; i < ITENS_POR_ROLO; i++) {
        const div = document.createElement('div');
        div.className = 'mini';
        div.textContent = ICONES[i % ICONES.length];
        strip.appendChild(div);
      }
      strip.style.transition = 'none';
      strip.style.transform = 'translateY(0px)';
    });
  }

  inicializarRolos();

  let girando = false;

  btnSpin.addEventListener('click', girarCacaNiquel);

  function girarCacaNiquel() {
    if (girando) return;
    girando = true;
    btnSpin.disabled = true;

    // Animação da alavanca lateral
    leverKnob.classList.add('lever-pulled');
    setTimeout(() => leverKnob.classList.remove('lever-pulled'), 400);

    // Feedback de carregamento
    resultBox.querySelector('.placeholder').style.display = 'block';
    resultBox.querySelector('.placeholder').textContent = '> Sintonizando frequências VHS...';
    revealedContent.style.display = 'none';

    // Escolhe um filme aleatório do catálogo
    const filmeEscolhido = CATALOGO_SORTEIO[Math.floor(Math.random() * CATALOGO_SORTEIO.length)];

    // Define índice de parada para cada rolo (desfasados)
    const paradas = [
      Math.floor(Math.random() * (ITENS_POR_ROLO - 6)) + 3,
      Math.floor(Math.random() * (ITENS_POR_ROLO - 6)) + 3,
      Math.floor(Math.random() * (ITENS_POR_ROLO - 6)) + 3
    ];

    // Força o ícone sorteado na posição de parada
    stripElements.forEach((strip, index) => {
      const idxParada = paradas[index];
      const filhos = strip.children;
      if (filhos[idxParada]) {
        filhos[idxParada].textContent = filmeEscolhido.icone;
      }

      // Reinicia antes do giro
      strip.style.transition = 'none';
      strip.style.transform = 'translateY(0px)';

      // Dispara a animação com tempos diferentes
      setTimeout(() => {
        const duracao = 1.3 + (index * 0.45); // 1.3s, 1.75s, 2.2s
        strip.style.transition = `transform ${duracao}s cubic-bezier(.12,.8,.32,1)`;
        strip.style.transform = `translateY(-${idxParada * ALTURA_ITEM}px)`;
      }, 30);
    });

    // Quando o último rolo parar
    setTimeout(() => {
      resultBox.querySelector('.placeholder').style.display = 'none';
      revealedContent.innerHTML = `JACKPOT! 🎰 <br><strong>${filmeEscolhido.titulo}</strong> (${filmeEscolhido.genero})`;
      revealedContent.style.display = 'block';

      // Preenche o campo de locação automaticamente
      if (campoFita) {
        campoFita.value = filmeEscolhido.titulo;
      }

      girando = false;
      btnSpin.disabled = false;
    }, 2400);
  }

  // ===================== FILTRO DE PRATELEIRA =====================
  const botoesGenero = document.querySelectorAll('.genre-btn');
  const quadrosFilmes = document.querySelectorAll('.film-frame');

  botoesGenero.forEach(botao => {
    botao.addEventListener('click', () => {
      botoesGenero.forEach(b => b.classList.remove('active'));
      botao.classList.add('active');

      const filtro = botao.getAttribute('data-filter').toLowerCase();

      quadrosFilmes.forEach(filme => {
        const generoFilme = (filme.getAttribute('data-genre') || '').toLowerCase();
        if (filtro === 'todos' || generoFilme === filtro) {
          filme.style.display = 'flex';
        } else {
          filme.style.display = 'none';
        }
      });
    });
  });

  // ===================== FORMULÁRIO DE ENVIO =====================
  const formLocacao = document.getElementById('formLocacao');
  if (formLocacao) {
    formLocacao.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('📼 Pedido registrado no sistema Rebobina! Verifique seu comprovante para emissão do despacho.');
    });
  }

});