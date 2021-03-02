
$(function() { // quando o documento estiver pronto/carregado 
    function exibir_usuarios() {
        $.ajax({
            url: 'http://localhost:5000/ver_usuario',
            method: 'GET',
            dataType: 'json', 
            success: montar, 
            error: function() {
                alert("erro ao ler dados, verifique o backend");
            }
        });
    
        function montar (user_json) {
            $('#corpoTabelaUsers').empty();
            mostrar_conteudo("tabelaUsers");       
            for (var i in user_json) { 
                lin = '<tr>' + 
                '<td>' + user_json[i].nome + '</td>' + 
                '<td>' + user_json[i].email + '</td>' + 
                '</tr>';
                $('#corpoTabelaUsers').append(lin);
            }
        }
    }
    function exibir_jogos() {
        $.ajax({
            url: 'http://127.0.0.1:5000/buscar',
            method: 'GET',
            dataType: 'json', 
            success: mostrar_jogos, 
            error: function() {
            alert("erro ao ler dados, verifique o backend");
            }
        });
        function mostrar_jogos (jogos_json) {
            $('#jogos').empty();
            mostrar_conteudo("conteudoInicial");       
            for (var i in jogos_json) {
                lin = '<div class="card">' + 
                '<div class="card-body">'+'<h3 class ="card-title">' + jogos_json[i].titulo + '</h3>' + 
                '<p>' + jogos_json[i].descricao + '</p>' +
                '<p>' + jogos_json[i].genero + '</p>' + 
                '<p>' + jogos_json[i].preco_atual + '</p>' +
                '<button htef="#" id="btComprar" type="button" value = "'+ jogos_json[1].codigo_produto +'">Add Ao Carrinho</button>'+
                '</div>'  + '</div>';
                $('#jogos').append(lin);
            }
        }
    }
    function exibir_carrinho() {
        $.ajax({
            url: 'http://127.0.0.1:5000/carrinho',
            method: 'GET',
            dataType: 'json', 
            success: mostrar_carrinho, 
            error: function() {
            alert("Usuario não esta logado , verifique o seu logn e tente novamente");
            }
        });
        function mostrar_carrinho(carrinho_json) {
                $('#jogos').empty();
                mostrar_conteudo("conteudoInicial");
                for (var i in carrinho_json) {
                    lin = '<div class="card">' + 
                    '<div class="card-body">'+'<h3 class ="card-title">' + carrinho_json[i].titulo + '</h3>' + 
                    '<p>' + carrinho_json[i].descricao + '</p>' +
                    '<p>' + carrinho_json[i].genero + '</p>' + 
                    '<p>' + carrinho_json[i].preco_atual + '</p>' +
                    '</div>'  + '</div>';
                    $('#jogos').append(lin);
            }
        
    }
    }
    // função que mostra um conteúdo e esconde os outros
    function mostrar_conteudo(identificador) {
        // esconde todos os conteúdos
        $("#tabelaUsers").addClass('invisible');
        $("#conteudoInicial").addClass('invisible');
        // torna o conteúdo escolhido visível
        $("#"+identificador).removeClass('invisible'); 
             
    }

    $(document).on("click", "#linkVerUsuario", function() {
        exibir_usuarios();
    });
    $(document).on("click", "#linkVerCarrinho", function() {
        exibir_carrinho();
    });
    $(document).on("click", "#linkLimparCarrinho", function() {
        $.ajax({
            url: 'http://localhost:5000/limpar_carrinho',
            type: 'POST',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'application/json', // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            success: carrinhoDeletado, // chama a função listar para processar o resultado
            error: erroAoExcluir
        });
        function carrinhoDeletado (retorno) {
            if (retorno.resultado == "ok") { 
                // informar resultado de sucesso
                alert("Jogos Deletados com sucesso!");
            } else {
                // informar mensagem de erro
                alert(retorno.resultado + ":" + retorno.detalhes);
            }            
        }
        function erroAoExcluir (retorno) {
            // informar mensagem de erro
            alert("ERRO: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });
    $(document).on("click", "#btDeletarUsuario", function() {
        cpf = $("#campoDCPF").val();
        var dados = JSON.stringify({cpf : cpf});
        $.ajax({
            url: 'http://localhost:5000/deletar_usuario',
            type: 'POST',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'application/json', // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            success: usuarioDeletado, // chama a função listar para processar o resultado
            error: erroAoExcluir
        });
        function usuarioDeletado (retorno) {
            if (retorno.resultado == "ok") { 
                // informar resultado de sucesso
                alert("Usuario Deletado com sucesso!");
            } else {
                // informar mensagem de erro
                alert(retorno.resultado + ":" + retorno.detalhes);
            }            
        }
        function erroAoExcluir (retorno) {
            // informar mensagem de erro
            alert("ERRO: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });
    $(document).on("click", "#btDeletarJogo", function() {
        titulo = $("#campoTitulo").val();
        var dados = JSON.stringify({titulo : titulo});
        $.ajax({
            url: 'http://localhost:5000/deletar_produto',
            type: 'POST',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'application/json', // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            success: jogoDeletado, // chama a função listar para processar o resultado
            error: erroAoExcluir
        });
        function jogoDeletado (retorno) {
            if (retorno.resultado == "ok") { 
                // informar resultado de sucesso
                alert("Jogo Deletado com sucesso!");
            } else {
                // informar mensagem de erro
                alert(retorno.resultado + ":" + retorno.detalhes);
            }            
        }
        function erroAoExcluir (retorno) {
            // informar mensagem de erro
            alert("ERRO: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });
    $(document).on("click", "#btComprar", function() {
        codigo_produto = $("#btComprar").val();
        var dados = JSON.stringify({codigo_produto : codigo_produto});
        $.ajax({
            url: 'http://localhost:5000/add_carrinho',
            type: 'POST',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'application/json', // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            error: erroAoExcluir
    });
        function erroAoExcluir (retorno) {
            // informar mensagem de erro
            alert("ERRO: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });

    $(document).on("click", "#linkInicio", function() {
        exibir_jogos();
    });
    $(document).on("click", "#linkVerCarrinho", function() {
        exibir_carrinho();
    });

    $(document).on("click", "#btIncluirJogo", function() {
        //pegar dados da tela
        preco_atual = $("#campoPrecoAtual").val();
        preco_normal = $("#campoPrecoNormal").val();
        preco_promocao = $("#campoPrecoPromocao").val();
        genero = $("#campoGenero").val();
        caminho_foto = $("#campoCaminhofoto").val();
        descricao = $("#campoDescricao").val();
        titulo = $("#campoTitulo").val();
        // preparar dados no formato json
        var dados = JSON.stringify({ preco_atual : preco_atual, preco_normal : preco_normal, preco_promocao : preco_promocao, genero : genero,  caminho_foto : caminho_foto, descricao : descricao, titulo : titulo});
        // fazer requisição para o back-end
        $.ajax({
            url: 'http://localhost:5000/cadastro_produto',
            type: 'POST',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'application/json', // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            success: jogoIncluido, // chama a função listar para processar o resultado
            error: erroAoIncluir
        });
        function jogoIncluido (retorno) {
            if (retorno.resultado == "ok") { 
                // informar resultado de sucesso
                alert("Jogo incluído com sucesso!");
                // limpar os campos
                $("#campoPrecoAtual").val("");
                $("#campoPrecoNormal").val("");
                $("#campoPrecoPromocao").val("");
                $("#campoGenero").val("");
                $("#campoCaminhofoto").val("");
                $("#campoDescricao").val("");
                $("#campoTitulo").val("");
            } else {
                // informar mensagem de erro
                alert(retorno.resultado + ":" + retorno.detalhes);
            }            
        }
        function erroAoIncluir (retorno) {
            // informar mensagem de erro
            alert("ERRO: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });
    $(document).on("click", "#btIncluirUsuario", function() {
        //pegar dados da tela
        nome = $("#campoNome").val();
        cpf = $("#campoCPF").val();
        caminho_foto = $("#campoCaminhoFoto").val();
        cidade = $("#campoCidade").val();
        estado = $("#campoEstado").val();
        cep = $("#campoCEP").val();
        rua = $("#campoRua").val();
        numero_imovel = $("#campoNumeroImovel").val();
        data_de_nacimento = $("#campoDataDeNacimento").val();
        email = $("#campoEmail").val();
        senha = $("#campoSenhaInclude").val();
        sexo = $("#campoSexo").val();
        // preparar dados no formato json
        var dados = JSON.stringify({ usuario : nome, senha: senha, cpf : cpf, caminho_foto : caminho_foto, cidade:cidade, estado:estado, cep:cep, rua:rua, numero_imovel:numero_imovel, data_de_nacimento:data_de_nacimento, email: email, sexo:sexo});
        // fazer requisição para o back-end
        $.ajax({
            url: 'http://localhost:5000/cadastrar',
            type: 'POST',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'application/json', // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            success: userIncluido, // chama a função listar para processar o resultado
            error: erroAoIncluir
        });
        function  userIncluido (retorno) {
            if (retorno.resultado == "ok") { // a operação deu certo?
                alert("Pessoa incluída com sucesso!");
                // limpar os campos
                $("#campoNome").val("");
                $("#campoEmail").val("");
                $("#campoCpf").val("");
                $("#campoCaminhoFoto").val("");
                $("#campoCidade").val("");
                $("#campoEstado").val("");
                $("#campoCep").val("");
                $("#campoRua").val("");
                $("#campoNumeroImovel").val("");
                $("#campoDataNacimento").val("");
                $("#campoSenhaInclude").val("");
                $("#campoSexo").val(""); 
            } else {
                // informar mensagem de erro
                alert(retorno.resultado + ":" + retorno.detalhes);
            }            
        }
        function erroAoIncluir (retorno) {
            // informar mensagem de erro
            alert("ERRO: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });
    $(document).on("click", "#btLogarUsuario", function() {
        nome = $("#campoNomeDoUsuario").val()
        senha = $("#campoSenha").val()
        var dados = JSON.stringify({ nome: nome, senha: senha});
        $.ajax({
            url: 'http://localhost:5000/logar',
            type: 'POST',
            dataType: 'json', // os dados são recebidos no formato json
            contentType: 'application/json', // tipo dos dados enviados
            data: dados, // estes são os dados enviados
            success: colocarUsuarioCorrente, // chama a função listar para processar o resultado
            error: erroAoLogar
        });
        function colocarUsuarioCorrente (user_json) {       
            $('#navUsuarioFuncoes').empty();
            lin = '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src='+ user_json.caminho_foto +'height="32" width="32">'+'</a>' + 
            '<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">'+
            '<a class="dropdown-item" href="#">' + user_json.nome + '</a>' + 
            '<a class="dropdown-item" href="#" id="linkSair">' + "Sair" + '</a>' ;
            $('#navUsuarioFuncoes').append(lin);
            exibir_jogos();
            mostrar_conteudo("conteudoInicial");
                // informar mensagem de erro
        }
        function erroAoLogar (retorno) {
            // informar mensagem de erro
            alert("ERRO: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });
    $(document).on("click", "#linkSair", function() {
        $.ajax({
            url: 'http://localhost:5000/sair',
            type: 'GET',
            dataType: 'json', // os dados são recebidos no formato json
            success: userLogout, // chama a função listar para processar o resultado
            error: erroAoSair
        });
        function  userLogout (retorno) {
            if (retorno.resultado == "ok") { // a operação deu certo?
                // informar resultado de sucesso
                $.ajax({
                    url: 'http://127.0.0.1:5000/buscar',
                    method: 'GET',
                    dataType: 'json', 
                    success: colocarUsuarioCorrente, 
                    error: function() {
                    alert("erro ao ler dados, verifique o backend");
                    }
                });
            } else {
                // informar mensagem de erro
                alert(retorno.resultado + ":" + retorno.detalhes);
            }            
        }
        function colocarUsuarioCorrente () {
            mostrar_conteudo("conteudoInicial");       
                lin =  '<a class="nav-link dropdown-toggle" href=" " id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="{{url_for("static", filename=current_user.caminho_foto)}}" height="32" width="32"></a>'+
                '<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink" >'+
                '<a class="dropdown-item" href="#" data-toggle="modal" data-target="#modalIncluirUsuario">Inscreva-se</a>'+
                '<a class="dropdown-item" href="#" data-toggle="modal" data-target="#modalLogarUsuario">Login</a>';
                $('#navUsuarioFuncoes').append(lin);
        }
    });
    // código a ser executado quando a janela de inclusão de pessoas for fechada
    $('#modalIncluirjogo').on('hide.bs.modal', function (e) {
        // se a página de listagem não estiver invisível
        if (! $("#tabelaPessoas").hasClass('invisible')) {
            // atualizar a página de listagem
            exibir_usuarios();
        }
    });

    // a função abaixo é executada quando a página abre
    mostrar_conteudo("conteudoInicial");
    exibir_jogos();
 
});