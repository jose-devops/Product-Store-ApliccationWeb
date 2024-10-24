// URL da API backend
const API_URL = 'http://localhost:8080/produto';

let editandoProdutoId = null; // Armazena o ID do produto que está sendo editado

// Função para cadastrar ou editar um produto
document.getElementById('produtoForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const preco = document.getElementById('preco').value;

    // Criar o objeto do produto
    const produto = {
        nome: nome,
        descricao: descricao,
        preco: parseFloat(preco)
    };

    // Verificar se estamos editando ou criando um novo produto
    if (editandoProdutoId) {
        // Editando o produto existente
        produto.id = editandoProdutoId; // Adiciona o ID ao objeto produto

        try {
            const response = await fetch(`${API_URL}/editar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });

            if (response.ok) {
                alert('Produto editado com sucesso!');
                listarProdutos(); // Atualizar a lista de produtos
                resetForm(); // Limpar o formulário após editar
            } else {
                alert('Erro ao editar produto.');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    } else {
        // Criando um novo produto
        try {
            const response = await fetch(`${API_URL}/salvar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });

            if (response.ok) {
                alert('Produto cadastrado com sucesso!');
                listarProdutos(); // Atualizar a lista de produtos
            } else {
                alert('Erro ao cadastrar produto.');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
});

// Função para listar os produtos
async function listarProdutos() {
    try {
        const response = await fetch(`${API_URL}/listar`);
        const produtos = await response.json();

        const tabela = document.getElementById('produtosTable').getElementsByTagName('tbody')[0];
        tabela.innerHTML = ''; // Limpar a tabela antes de preencher

        produtos.forEach(produto => {
            const linha = tabela.insertRow();
            linha.insertCell(0).innerHTML = produto.id;
            linha.insertCell(1).innerHTML = produto.nome;
            linha.insertCell(2).innerHTML = produto.descricao;
            linha.insertCell(3).innerHTML = produto.preco.toFixed(2);

            // Ações (Editar e Excluir)
            const acoesCell = linha.insertCell(4);
            acoesCell.innerHTML = `
                <button class="btn btn-warning btn-sm" onclick="editarProduto('${produto.id}', '${produto.nome}', '${produto.descricao}', '${produto.preco}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirProduto('${produto.id}')">Excluir</button>
            `;
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para excluir um produto
async function excluirProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            const response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'POST',
            });

            if (response.ok) {
                alert('Produto excluído com sucesso!');
                listarProdutos(); // Atualizar a lista de produtos
            } else {
                alert('Erro ao excluir produto.');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
}

// Função para editar um produto
function editarProduto(id, nome, descricao, preco) {
    // Preencher o formulário com os dados do produto selecionado
    document.getElementById('nome').value = nome;
    document.getElementById('descricao').value = descricao;
    document.getElementById('preco').value = preco;

    // Armazenar o ID do produto que está sendo editado
    editandoProdutoId = id;
}

// Função para resetar o formulário
function resetForm() {
    document.getElementById('produtoForm').reset();
    editandoProdutoId = null; // Limpar o ID do produto que estava sendo editado
}

// Chama a função listarProdutos quando a página carrega
window.onload = listarProdutos;
