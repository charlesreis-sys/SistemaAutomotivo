const cardContainer = document.getElementById('cardContainer');
const mainButton = document.querySelector('.form-container button');
const searchInput = document.getElementById('searchInput');
const API = "http://localhost:8080/api/veiculos";

let veiculos = [];
let editId = null;

async function loadVeiculos() {
    try {
        const response = await fetch(`${API}/listarVeiculos`);
        if (!response.ok) throw new Error("Erro ao buscar dados");
        veiculos = await response.json();
        renderCards();
    } catch (error) {
        console.error("Erro:", error);
        cardContainer.innerHTML = "<p style='color:red;'>Erro ao conectar com o servidor. Verifique se a API está rodando.</p>";
    }
}

function renderCards() {

    const search = searchInput ? searchInput.value.toLowerCase().trim() : "";

    cardContainer.innerHTML = "";

    const filtrados = veiculos.filter(v => {

        if (search === "") return true;

        const marca = (v.marca || "").toLowerCase();
        const modelo = (v.modelo || "").toLowerCase();
        const cor = (v.cor || "").toLowerCase();
        const status = (v.status || "").toLowerCase();

        if (search === "disponivel" || search === "indisponivel") {
            return status === search;
        }


        return (
            marca.includes(search) ||
            modelo.includes(search) ||
            cor.includes(search) ||
            status.includes(search)
        );
    });

    if (filtrados.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum veículo encontrado para esta busca.</p>";
        return;
    }

    filtrados.forEach((v) => {
        const card = document.createElement('div');
        card.className = "card";

        const valor = typeof v.preco === 'string' ? parseFloat(v.preco) : v.preco;
        const precoFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const statusClass = v.status === "disponivel" ? "status-disponivel" : "status-indisponivel";

        card.innerHTML = `
            <h3>${v.marca} ${v.modelo}</h3>
            <p><strong>Ano:</strong> ${v.ano} | <strong>Cor:</strong> ${v.cor}</p>
            <p><strong>Preço:</strong> ${precoFormatado}</p>
            <p><strong>KM:</strong> ${v.quilometragem.toLocaleString()} km</p>
            <p><strong>Status:</strong> <span class="${statusClass}">${v.status}</span></p>
            <p><strong>Estoque:</strong> ${v.quantidadeEstoque}</p>
        `;

        const btnContainer = document.createElement('div');
        btnContainer.className = "card-buttons";

        const venderBtn = document.createElement('button');
        venderBtn.textContent = "Vender";
        venderBtn.className = "btn-vender";
        venderBtn.onclick = () => venderVeiculo(v);

        const editBtn = document.createElement('button');
        editBtn.textContent = "Editar";
        editBtn.className = "btn-editar";
        editBtn.onclick = () => editVeiculo(v);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Deletar";
        deleteBtn.className = "btn-deletar";
        deleteBtn.onclick = () => deleteVeiculo(v.id);

        btnContainer.append(venderBtn, editBtn, deleteBtn);
        card.appendChild(btnContainer);
        cardContainer.appendChild(card);
    });
}

function clearSearch() {
    searchInput.value = "";
    renderCards();
}

function filterAvailable() {
    searchInput.value = "disponivel";
    renderCards();
}

async function addVeiculo() {
    const estoqueDigitado = Number(document.getElementById('estoqueInput').value);

    if (estoqueDigitado < 1) {
        alert("⚠️ O estoque mínimo para cadastro deve ser 1.");
        return;
    }

    const veiculo = {
        marca: document.getElementById('marcaInput').value,
        modelo: document.getElementById('modeloInput').value,
        ano: Number(document.getElementById('anoInput').value),
        cor: document.getElementById('corInput').value,
        preco: parseFloat(document.getElementById('precoInput').value),
        quilometragem: Number(document.getElementById('kmInput').value),
        quantidadeEstoque: estoqueDigitado,
        status: "disponivel"
    };

    try {
        let url = `${API}/cadastrarVeiculos`;
        let method = "POST";

        if (editId !== null) {
            url = `${API}/editarVeiculos/${editId}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(veiculo)
        });

        if (response.ok) {
            alert(editId ? "✅ Atualizado com sucesso!" : "✅ Cadastrado com sucesso!");
            loadVeiculos();
            clearForm();
            resetButton();
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

async function venderVeiculo(v) {
    if (v.quantidadeEstoque <= 0) {
        alert("❌ Veículo indisponível no estoque!");
        return;
    }

    if (!confirm(`Confirmar venda de ${v.marca} ${v.modelo}?`)) return;

    const novoEstoque = v.quantidadeEstoque - 1;
    const atualizado = {
        ...v,
        quantidadeEstoque: novoEstoque,
        status: novoEstoque === 0 ? "indisponivel" : "disponivel"
    };

    try {
        const response = await fetch(`${API}/editarVeiculos/${v.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(atualizado)
        });

        if (response.ok) {
            loadVeiculos();
        }
    } catch (error) {
        console.error("Erro ao vender:", error);
    }
}

function editVeiculo(v) {
    document.getElementById('marcaInput').value = v.marca;
    document.getElementById('modeloInput').value = v.modelo;
    document.getElementById('anoInput').value = v.ano;
    document.getElementById('corInput').value = v.cor;
    document.getElementById('precoInput').value = v.preco;
    document.getElementById('kmInput').value = v.quilometragem;
    document.getElementById('estoqueInput').value = v.quantidadeEstoque;

    editId = v.id;
    mainButton.textContent = "Salvar Alterações";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetButton() {
    editId = null;
    mainButton.textContent = "Cadastrar";
}

async function deleteVeiculo(id) {
    if (!confirm("Excluir este veículo permanentemente?")) return;
    try {
        const res = await fetch(`${API}/deletarVeiculos/${id}`, { method: 'DELETE' });
        if (res.ok) loadVeiculos();
    } catch (error) {
        console.error("Erro ao deletar:", error);
    }
}

function clearForm() {
    const campos = ['marcaInput', 'modeloInput', 'anoInput', 'corInput', 'precoInput', 'kmInput', 'estoqueInput'];
    campos.forEach(id => document.getElementById(id).value = "");
}

searchInput.addEventListener('input', renderCards);
loadVeiculos();
