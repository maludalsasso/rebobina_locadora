document.addEventListener("DOMContentLoaded", () => {
  const combos = [
    {
      id: "terror",
      t: "Segunda do Terror",
      tag: "Para os corajosos que encaram o suspense sozinhos.",
      lbl: "SESSÃO INDIVIDUAL",
      c: "yellow",
      p: 32.0,
      o: 42.0,
      n: "01",
      who: "1 INGRESSO",
      films: ["Possessão (1981) - 21:00", "A Noite dos Mortos-Vivos - 18:30", "Psicose - 16:00"],
      inc: ["1 Ingresso na poltrona retrô", "1 Pipoca quentinha da bomboniere", "1 Refri lata ou garrafa 350ml", "1 Pacote de balas azedinhas"],
      img: "images/nofestaru.png"
    },
    {
      id: "romance",
      t: "Terça do Amor (Casal)",
      tag: "Dois lugares lado a lado, luz baixa e zero pressa.",
      lbl: "SESSÃO EM DUPLA",
      c: "pink",
      p: 58.0,
      o: 76.0,
      n: "02",
      who: "2 INGRESSOS",
      films: ["Antes do Amanhecer - 18:30", "Uma Linda Mulher - 21:00", "10 Coisas que Eu Odeio em Você - 16:00"],
      inc: ["2 Ingressos (poltronas reservadas)", "1 Pipoca balde grande amanteigada", "2 Refris gelados 350ml", "2 Brownies artesanais recheados"],
      img: "images/prettywoman.png"
    },
    {
      id: "infantil",
      t: "Tarde da Família",
      tag: "Aventuras clássicas para reunir a turma toda.",
      lbl: "COMBO FAMÍLIA (3 PESSOAS)",
      c: "mint",
      p: 79.0,
      o: 105.0,
      n: "03",
      who: "3 INGRESSOS",
      films: ["O Rei Leão - 16:00", "Toy Story - 18:30", "Curtindo a Vida Adoidado - 21:00"],
      inc: ["3 Ingressos na sala", "2 Pipocas grandes", "3 Bebidas (Refris ou Sucos)", "2 Pacotes de doces sortidos"],
      img: "images/gumball.png"
    },
    {
      id: "sala-vip",
      t: "Sala Secreta Fechada",
      tag: "A sala de cinema inteira só para você e seus 14 amigos.",
      lbl: "SESSÃO PRIVATIVA (15 LUGARES)",
      c: "yellow",
      p: 280.0,
      o: 360.0,
      n: "04",
      who: "15 INGRESSOS",
      films: ["Escolha Livre: Qualquer fita do acervo da Locadora!"],
      inc: ["Uso exclusivo da Sala (15 poltronas)", "Você escolhe o horário e o filme", "Combo balcão com pipoca para todos", "Clima privativo estilo cineclube"],
      img: "images/psicose.png"
    }
  ];

  const snacks = [
    { id: "pipoca", n: "Pipoca Grande Amanteigada", d: "Quentinha estourada na hora · 150g", p: 12.0, k: "popcorn", b: "CLÁSSICO DA SALA" },
    { id: "brownie", n: "Brownie Artesanal", d: "Chocolate meio amargo · 80g", p: 9.5, k: "brownie", b: "RECEITA DA CASA" },
    { id: "balas", n: "Balas Azedinhas Retrô", d: "Sortidas de frutas · 90g", p: 8.0, k: "candy", b: "PARA O FILME" },
    { id: "refri", n: "Refrigerante Gelado", d: "Lata ou garrafinha 350ml", p: 7.0, k: "drink", b: "TRINCHANDO" }
  ];

  const $ = id => document.getElementById(id);
  const money = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const icon = n => `<svg class="i"><use href="#${n}"/></svg>`;
  let cart = [], timer;

  // Renderiza Combos
  const containerCombos = $("combos");
  if (containerCombos) {
    containerCombos.innerHTML = combos.map(c => `
      <article class="combo ${c.c}">
        <div class="tape"></div>
        <div class="art">
          <img src="${c.img}" alt="${c.t}" onerror="this.src='images/sala-cinema.png'">
          <span class="n">COMBO ${c.n}</span>
          <span class="off">ECONOMIZE <b>${money(c.o - c.p)}</b></span>
        </div>
        <div class="body">
          <span class="lbl">${c.lbl} · ${c.who}</span>
          <h3>${c.t}</h3>
          <p class="tagline">${c.tag}</p>
          <ul class="incl">
            ${c.inc.map(i => `<li>${icon("check")} ${i}</li>`).join("")}
          </ul>
          <label for="f-${c.id}">FILME & HORÁRIO DA SESSÃO:</label>
          <select id="f-${c.id}">
            ${c.films.map(f => `<option value="${f}">${f}</option>`).join("")}
          </select>
          <div class="price">
            <div><s>Separados: ${money(c.o)}</s><strong>${money(c.p)}</strong></div>
            <em>${Math.round((1 - c.p / c.o) * 100)}% OFF</em>
          </div>
          <button class="add" data-combo="${c.id}">RESERVAR ESTA SESSÃO ${icon("plus")}</button>
        </div>
      </article>
    `).join("");
  }

  // Renderiza Snacks
  const containerSnacks = $("snacks");
  if (containerSnacks) {
    containerSnacks.innerHTML = snacks.map(s => `
      <article class="snack">
        <div class="pic"><svg><use href="#a-${s.k}"/></svg></div>
        <div>
          <small>${s.b}</small>
          <h3>${s.n}</h3>
          <p>${s.d}</p>
          <div class="row">
            <strong>${money(s.p)}</strong>
            <button data-snack="${s.id}" aria-label="Adicionar ${s.n}">${icon("plus")}</button>
          </div>
        </div>
      </article>
    `).join("");
  }

  function add(key, name, detail, price, original) {
    const it = cart.find(x => x.key === key);
    it ? it.q++ : cart.push({ key, name, detail, price, original, q: 1 });
    render();
    const t = $("toast");
    if (t) {
      t.textContent = `+ ${name} incluído na sua comanda.`;
      t.hidden = false;
      clearTimeout(timer);
      timer = setTimeout(() => t.hidden = true, 3000);
    }
  }

  function render() {
    if ($("count")) $("count").textContent = cart.reduce((s, x) => s + x.q, 0);
    if ($("cart-title")) $("cart-title").textContent = "Sua Reserva de Cinema";
    if ($("sum")) $("sum").hidden = !cart.length;

    const itemsBox = $("items");
    if (itemsBox) {
      itemsBox.innerHTML = cart.length ? cart.map(x => `
        <div class="item">
          <div>
            <h4>${x.name}</h4>
            <p>${x.detail}</p>
            <strong>${money(x.price * x.q)}</strong>
            <div class="qty">
              <button data-q="${x.key}|-1" aria-label="Diminuir">${icon("minus")}</button>
              <span>${x.q}</span>
              <button data-q="${x.key}|1" aria-label="Aumentar">${icon("plus")}</button>
            </div>
          </div>
          <button data-q="${x.key}|-99" aria-label="Remover">${icon("close")}</button>
        </div>
      `).join("") : `<p class="empty">Sua comanda está vazia.<br>Escolha um combo de cinema ou itens da bomboniere.</p>`;
    }

    if ($("tt")) $("tt").textContent = money(cart.reduce((s, x) => s + x.price * x.q, 0));
    if ($("sv")) $("sv").textContent = money(cart.reduce((s, x) => s + (x.original - x.price) * x.q, 0));
  }

  function emitirCupomFiscal() {
    const total = cart.reduce((s, x) => s + x.price * x.q, 0);
    const economia = cart.reduce((s, x) => s + (x.original - x.price) * x.q, 0);
    const codPedido = Math.floor(1000 + Math.random() * 9000);
    const agora = new Date();
    const dataHora = agora.toLocaleDateString("pt-BR") + " " + agora.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
    

    if ($("cart-title")) $("cart-title").textContent = "Ingresso & Comanda Emitidos!";
    if ($("sum")) $("sum").hidden = true;

    const itemsBox = $("items");
    if (itemsBox) {
      itemsBox.innerHTML = `
        <div class="cupom-fiscal" id="comanda-impressao">
          <div class="topo-fiscal">
            <h3>REBOBINA VEGAS LOCADORA</h3>
            <p>SALA DE CINEMA & CINECLUBE</p>
            <p>Rua das Fitas, 123 — Centro</p>
            <p>================================</p>
            <p><strong>CUPOM DE ENTRADA Nº #${codPedido}</strong></p>
            <p>DATA: ${dataHora}</p>
          </div>

          <table class="cupom-tabela">
            <thead>
              <tr>
                <th>ITEM / SESSÃO</th>
                <th style="text-align:center;">QTD</th>
                <th style="text-align:right;">VALOR</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(x => `
                <tr>
                  <td>
                    <strong>${x.name}</strong><br>
                    <small style="font-size:10px; color:#555;">${x.detail}</small>
                  </td>
                  <td style="text-align:center;">${x.q}</td>
                  <td style="text-align:right;">${money(x.price * x.q)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="cupom-totais">
            ${economia > 0 ? `
              <div class="cupom-linha">
                <span>DESCONTO COMBO:</span>
                <span>- ${money(economia)}</span>
              </div>
            ` : ""}
            <div class="cupom-linha destaque">
              <span>TOTAL PAGO:</span>
              <span>${money(total)}</span>
            </div>
            <div class="cupom-linha">
              <span>PAGAMENTO:</span>
              <span>BALCÃO / CONTA CORRENTE</span>
            </div>
          </div>

          <div class="cupom-rodape">
            <p>*** APRESENTE NO BALCÃO DA ENTRADA ***</p>
            <p>Entrada liberada 15 min antes da sessão.</p>
            <p>Pipocas e bebidas retiradas na bomboniere.</p>
            <p><em>Rebobine as fitas, aproveite a sessão!</em></p>
          </div>
          
            <button class="btn-imprimir" onclick="window.print()">IMPRIMIR TICKET (SALVAR PDF)</button>
        </div>
            <button type="button" class="btn-imprimir" style="background:#555; margin-top:8px;" onclick="document.getElementById('cart').close()">FECHAR CUPOM</button>
        </div>
      `;
    }

    cart = [];
    if ($("count")) $("count").textContent = 0;
  }

  // Delegação de eventos
  document.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;

    if (b.dataset.combo) {
      const c = combos.find(x => x.id === b.dataset.combo);
      const selFilme = $("f-" + c.id).value;
      add(`${c.id}:${selFilme}`, c.t, `${selFilme} (${c.who})`, c.p, c.o);
    } else if (b.dataset.snack) {
      const s = snacks.find(x => x.id === b.dataset.snack);
      add(s.id, s.n, s.d, s.p, s.p);
    } else if (b.dataset.q) {
      const [key, d] = b.dataset.q.split("|");
      const it = cart.find(x => x.key === key);
      if (it) {
        it.q += +d;
        cart = cart.filter(x => x.q > 0);
        render();
      }
    }
  });

  const btnOpen = $("open");
  const btnClose = $("btn-close-cart");
  const btnFinish = $("finish");
  const cartDialog = $("cart");
  const toastBox = $("toast");

  if (btnOpen && cartDialog) btnOpen.onclick = () => { if (toastBox) toastBox.hidden = true; render(); cartDialog.showModal(); };
  if (btnClose && cartDialog) btnClose.onclick = () => cartDialog.close();
  if (btnFinish) btnFinish.onclick = emitirCupomFiscal;
  if (cartDialog) cartDialog.addEventListener("click", e => { if (e.target === e.currentTarget) e.currentTarget.close(); });
  if (toastBox && btnOpen) toastBox.onclick = () => btnOpen.click();
});