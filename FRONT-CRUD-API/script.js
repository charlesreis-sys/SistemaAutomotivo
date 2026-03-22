const cardContainer = document.getElementById('cardContainer');
const mainButton = document.querySelector('.form-container button');

let veiculos = [];

async function loadCards() {
    try {
        const response = await fetch('http://localhost:8080/api/veiculos/listarVeiculos');
        if (!response.ok) throw new Error('Erro ao buscar dados');
        veiculos = await response.json();
        renderCards();
    } catch (error) {
        console.error("Erro ao carregar veículos:", error);
    }
}

function renderCards() {
    cardContainer.innerHTML = "";

    veiculos.forEach((veiculo) => {
        const card = document.createElement('div');
        card.className = "card";

        card.innerHTML = `
            <div class="card-header">
                <h3>${veiculo.marca} ${veiculo.modelo}</h3>
                <span class="badge">${veiculo.status || 'N/A'}</span>
            </div>
            <div class="card-body">
                <p><strong>ID:</strong> #${veiculo.id}</p>
                <p><strong>Ano:</strong> ${veiculo.anoFabricacao}</p>
                <p><strong>Cor:</strong> ${veiculo.cor}</p>
                <p><strong>Quilometragem:</strong> ${veiculo.quilometragem?.toLocaleString() || 0} km</p>
                <p><strong>Preço:</strong> R$ ${veiculo.preco?.toLocaleString() || '0,00'}</p>
                <p><strong>Estoque:</strong> ${veiculo.quantidadeEstoque} unidades</p>
            </div>
            <div class="card-footer">
                <button class="btn-edit" onclick="prepararEdicao(${veiculo.id})">Editar</button>
                <button class="btn-delete" onclick="deleteVeiculo(${veiculo.id})">Deletar</button>
            </div>
        `;
        cardContainer.appendChild(card);
    });
}

async function addVeiculo() {
    const data = getFormData();

    if (!data.marca || !data.modelo) {
        alert("Marca e Modelo são obrigatórios!");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/veiculos/cadastrarVeiculos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Veículo cadastrado com sucesso!");
            clearForm();
            loadCards();
        } else {
            const erro = await response.text();
            console.error("Erro do servidor:", erro);
            alert("Erro ao salvar: " + erro);
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}

function prepararEdicao(id) {
    const veiculo = veiculos.find(v => v.id === id);
    if (!veiculo) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.getElementById('marcaInput').value = veiculo.marca;
    document.getElementById('modeloInput').value = veiculo.modelo;
    document.getElementById('anoInput').value = veiculo.anoFabricacao;
    document.getElementById('corInput').value = veiculo.cor;
    document.getElementById('kmInput').value = veiculo.quilometragem;
    document.getElementById('precoInput').value = veiculo.preco;
    document.getElementById('estoqueInput').value = veiculo.quantidadeEstoque;
    document.getElementById('statusInput').value = veiculo.status;

    mainButton.textContent = "Salvar Alterações";
    mainButton.onclick = () => saveEdit(id);
    mainButton.classList.add('editing');
}

async function saveEdit(id) {
    const data = getFormData();
    try {
        const response = await fetch(`http://localhost:8080/api/veiculos/editarVeiculos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            clearForm();
            loadCards();
        }
    } catch (error) {
        console.error("Erro ao editar:", error);
    }
}

async function deleteVeiculo(id) {
    if (!confirm("Tem certeza que deseja excluir este veículo?")) return;
    try {
        const response = await fetch(`http://localhost:8080/api/veiculos/deletarVeiculos/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) loadCards();
    } catch (error) {
        console.error("Erro ao deletar:", error);
    }
}

function getFormData() {
    return {
        marca: document.getElementById('marcaInput').value,
        modelo: document.getElementById('modeloInput').value,
        anoFabricacao: parseInt(document.getElementById('anoInput').value) || 0,
        cor: document.getElementById('corInput').value,
        quilometragem: parseInt(document.getElementById('kmInput').value) || 0,
        preco: parseInt(document.getElementById('precoInput').value) || 0,
        quantidadeEstoque: parseInt(document.getElementById('estoqueInput').value) || 0,
        status: document.getElementById('statusInput').value
    };
}

function clearForm() {
    const inputs = ['marcaInput', 'modeloInput', 'anoInput', 'corInput', 'kmInput', 'precoInput', 'estoqueInput', 'statusInput'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = "";
    });
    
    mainButton.textContent = "Adicionar Veículo";
    mainButton.onclick = addVeiculo;
    mainButton.classList.remove('editing');
}

mainButton.onclick = addVeiculo;
loadCards();
