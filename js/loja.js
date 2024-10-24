// URL da API backend
const API_URL = 'http://localhost:8080/loja';

let editandoLojaId = null; 


document.getElementById('lojaForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const razaoSocial = document.getElementById('razaoSocial').value;
    const telefone = document.getElementById('telefone').value;


    
    const loja = {
        razaoSocial: razaoSocial,
        telefone: telefone,
       
    };

   
    if (editandoLojaId) {
        
        loja.id = editandoLojaId; 

        try {
            const response = await fetch(`${API_URL}/editar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loja)
            });

            if (response.ok) {
                alert('Loja editada com sucesso!');
                listarLojas(); 
                resetForm(); 
            } else {
                alert('Erro ao editar loja.');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    } else {
        
        try {
            const response = await fetch(`${API_URL}/salvar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loja)
            });

            if (response.ok) {
                alert('Loja cadastrada com sucesso!');
                listarLojas(); 
            } else {
                alert('Erro ao cadastrar loja.');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
});


async function listarLojas() {
    try {
        const response = await fetch(`${API_URL}/listar`);
        const lojas = await response.json();

        const tabela = document.getElementById('lojaTable').getElementsByTagName('tbody')[0];
        tabela.innerHTML = ''; 

        lojas.forEach(loja => {
            const linha = tabela.insertRow();
            linha.insertCell(0).innerHTML = loja.id;
            linha.insertCell(1).innerHTML = loja.razaoSocial;
            linha.insertCell(2).innerHTML = loja.telefone;
           

           
            const acoesCell = linha.insertCell(3);
            acoesCell.innerHTML = `
                <button class="btn btn-warning btn-sm" onclick="editarLoja('${loja.id}', '${loja.razaoSocial}', '${loja.telefone}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirLoja('${loja.id}')">Excluir</button>
            `;
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}


async function excluirLoja(id) {
    if (confirm('Tem certeza que deseja excluir esta Loja?')) {
        try {
            const response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'POST',
            });

            if (response.ok) {
                alert('Loja excluído com sucesso!');
                listarLojas(); 
            } else {
                alert('Erro ao excluir Loja.');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
}


function editarLoja(id, razaoSocial, telefone) {
   
    document.getElementById('razaoSocial').value = razaoSocial;
    document.getElementById('telefone').value = telefone;
    

   
    editandoLojaId = id;
}


function resetForm() {
    document.getElementById('lojaForm').reset();
    editandoLojaId = null; 
}


window.onload = listarLojas;
