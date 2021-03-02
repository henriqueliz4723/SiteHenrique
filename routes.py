#routes : cria as rotas de html nos metodos
from app import app ,db
from app import mail
from flask import request, jsonify
from flask_mail import Message 
from app.banco_de_dados import Modelo_produto, Modelo_user, Modelo_carrinho
from os import path
global usuario_corrente 
usuario_corrente=None


@app.route("/logar" ,methods=["POST","GET"])
def logar():
    dados = request.get_json()
    user = Modelo_user.query.filter_by(usuario = dados["nome"]).first()
    print(user)
    if user is not None and user.check_senha(dados["senha"]):
        global usuario_corrente
        user.carrinho = user.cpf
        usuario_corrente = user
        print(usuario_corrente.carrinho)
        user_json = user.json()
        user_json = jsonify(user_json)
        user_json.headers.add("Access-Control-Allow-Origin", "*")
        return user_json 
        
@app.route("/sair", methods=["post","get"])
def logout():
    global usuario_corrente
    usuario_corrente = None
@app.route("/carrinho", methods=["post","get"])
def mostrar_carrinho():
    global usuario_corrente
    print(usuario_corrente)
    if usuario_corrente is not None:
        carrinho = Modelo_carrinho.query.filter_by(codigo_carrinho = usuario_corrente.cpf).first()  
        jogos = Modelo_produto.query.filter_by(codigo_produto = carrinho.jogos)
        carrinho_json = [x.json() for x in jogos]
        carrinho_json = jsonify(carrinho_json)
        carrinho_json.headers.add("Access-Control-Allow-Origin", "*")
        return carrinho_json    
@app.route('/cadastrar',methods=["post","get"])
def cadastrar():  
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    dados = request.get_json()
    try:
        usuario = Modelo_user(**dados)
        usuario.preferencia = 1
        usuario.carteira = 0 
        usuario.set_administrador()
        usuario.set_carrinho(None)
        usuario.set_jogo(None)
        db.session.add(usuario)
        db.session.commit()
    except Exception as e:
        resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta

@app.route('/cadastro_produto',methods=["POST","GET"])
def cadastrar_produto():
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    dados = request.get_json()
    try:
        produto = Modelo_produto(**dados)
        produto.gerar_codigoproduto()
        db.session.add(produto)
        db.session.commit()
    except Exception as e:
        resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta
@app.route('/deletar_produto',methods=["POST","GET"])
def deletar_produto():
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    dados = request.get_json()
    print(dados)
    try:
        produto = Modelo_produto.query.filter_by(titulo = dados["titulo"]).first()
        print(produto)
        db.session.delete(produto)
        db.session.commit()
    except Exception as e:
        resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta
@app.route('/deletar_usuario',methods=["POST","GET"])
def deletar_usuario():
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    dados = request.get_json()
    print(dados)
    try:
        user = Modelo_user.query.filter_by(cpf = dados["cpf"]).first()
        carrinho = Modelo_carrinho.query.filter_by(codigo_carrinho  = dados["cpf"]).first()
        print(user)
        db.session.delete(carrinho)
        db.session.delete(user)
        db.session.commit()
    except Exception as e:
        resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta
@app.route('/limpar_carrinho',methods=["POST","GET"])
def limpar_carrinho():
    resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
    dados = request.get_json()
    print(dados)
    try:
        carrinho = Modelo_carrinho.query.filter_by(codigo_carrinho  = dados["codigo_carrinho"]).first()
        print(carrinho)
        carrinho.apagar()
    except Exception as e:
        resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta
@app.route("/add_carrinho", methods=["POST","GET"])
def adicionar_jogo_carrinho():
    global usuario_corrente
    carrinho = None
    if usuario_corrente is not None :
        resposta = jsonify({"resultado": "ok", "detalhes": "ok"})
        dados = request.get_json()
        try:
            produto = dados["codigo_produto"]
            usuario_corrente.carrinho.jogos.append(produto)
            carrinho = usuario_corrente.carrinho.json()
            carrinho.headers.add("Access-Control-Allow-Origin", "*")
        except Exception as e:
            resposta = jsonify({"resultado":"erro", "detalhes":str(e)})
        resposta.headers.add("Access-Control-Allow-Origin", "*")
        return resposta, carrinho 
    resposta = jsonify({"resultado": "Error", "detalhes": " Usuario não logado"})
    resposta.headers.add("Access-Control-Allow-Origin", "*")
    return resposta 

@app.route("/buscar", methods=["POST","GET"])
def buscar():
    jogos = Modelo_produto.query.all()
    jogos_json  = [x.json() for x in jogos]
    jogos_json = jsonify(jogos_json)
    jogos_json.headers.add("Access-Control-Allow-Origin", "*")
    return jogos_json    

@app.route("/ver_usuario", methods=["POST","GET"])
def ver_usuarios():
    users = Modelo_user.query.all()
    users_json  = [x.json() for x in users]
    users_json = jsonify(users_json)
    users_json.headers.add("Access-Control-Allow-Origin", "*")
    return users_json    

