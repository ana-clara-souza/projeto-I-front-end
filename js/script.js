//api
const API_URL = "https://api.astroworldmc.com/api/v1/enchantments";

const inputBusca = document.getElementById("campoBusca");
const btnBuscar = document.getElementById("btnBuscar");
const btnPesquisaCabecalho = document.getElementById("btnPesquisaCabecalho");
const mensagem = document.getElementById("mensagem");

const resultadoDiv = document.getElementById("resultado-container");
const listaFavoritos = document.getElementById("favoritos-container");

let favoritos = [];
let todosEncantamentos = [];

// iniciar
document.addEventListener("DOMContentLoaded", async () => {
  await carregarAPI();
  carregarFavoritos();
});

async function carregarAPI() {
  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }
    const json = await resposta.json();

    //segurança caso venha dentro de "data"
    todosEncantamentos = json.data || json;

    console.log("API carregada:", todosEncantamentos);

  } catch (erro) {
    console.error(erro);
    mensagem.textContent = "Erro ao chmar api";
  }
}

async function realizarBusca() {
  const termo = inputBusca.value.trim();

  //validação min 3  caracteres
  if (termo.length < 3) {
    mensagem.textContent = "Digite pelo menos 3 caracteres.";
    resultadoDiv.innerHTML = "";
    return;
  }

  mensagem.textContent = "Buscando...";
  resultadoDiv.innerHTML = "";

  try {
    const resposta = await fetch(`${API_URL}?search=${encodeURIComponent(termo)}`);
    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }
    const json = await resposta.json();
    const filtrados = json.data || json;

    if (!filtrados || filtrados.length === 0) {
      mensagem.textContent = "Nenhum encantamento encontrado.";
      return;
    }

    mensagem.textContent = "";
    renderizarResultados(filtrados);
  } catch (erro) {
    console.error(erro);
    mensagem.textContent = "Erro ao buscar na API.";
  }
}

btnBuscar.addEventListener("click", realizarBusca);

if (btnPesquisaCabecalho) {
  btnPesquisaCabecalho.addEventListener("click", () => {
    realizarBusca();
    inputBusca.scrollIntoView({ behavior: "smooth" });
    inputBusca.focus();
  });
}

inputBusca.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    realizarBusca();
  }
});

function renderizarResultados(lista) {
  resultadoDiv.innerHTML = "";

  lista.forEach(item => {
    const nome = item.name || item.nome || item.title;

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${nome}</h3>
      <p>${item.description || "Sem descrição"}</p>

      <button class="btn-favoritar">
        Favoritar
      </button>
    `;

    const btnFavoritar = card.querySelector(".btn-favoritar");
    btnFavoritar.addEventListener("click", () => {
      adicionarFavorito(nome);
    });

    resultadoDiv.appendChild(card);
  });
}

function adicionarFavorito(nome) {
  if (favoritos.includes(nome)) return;

  favoritos.push(nome);
  salvarFavoritos();
  renderizarFavoritos();
}


function salvarFavoritos() {
  localStorage.setItem("favoritos-minecraft", JSON.stringify(favoritos));
}

function carregarFavoritos() {
  const dados = localStorage.getItem("favoritos-minecraft");

  if (dados) {
    favoritos = JSON.parse(dados);
    renderizarFavoritos();
  }
}

function removerFavorito(nome) {
  favoritos = favoritos.filter(item => item !== nome);
  salvarFavoritos();
  renderizarFavoritos();
}


function renderizarFavoritos() {
  listaFavoritos.innerHTML = "";

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = "<p>Nenhum favorito ainda.</p>";
    return;
  }

  favoritos.forEach(nome => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${nome}</h3>

      <button class="btn-remover">
        Remover
      </button>
    `;

    const btnRemover = card.querySelector(".btn-remover");
    btnRemover.addEventListener("click", () => {
      removerFavorito(nome);
    });

    listaFavoritos.appendChild(card);
  });
}