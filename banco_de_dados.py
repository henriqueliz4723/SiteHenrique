from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from random import randint , choice 
from flask import jsonify

class Modelo_user(db.Model):
    usuario = db.Column(db.String(15),unique=True , nullable=False)
    cpf = db.Column(db.String(15),primary_key=True)    
    cidade = db.Column(db.String(15))
    estado = db.Column(db.String(15))
    cep = db.Column(db.String(15))  
    rua = db.Column(db.String(45))
    numero_imovel = db.Column(db.String(15))
    data_de_nacimento = db.Column(db.String(15),nullable=False)    
    email = db.Column(db.String(120), unique=True, nullable=False) 
    senha =db.Column(db.String(15),unique=True , nullable=False)
    sexo = db.Column(db.String(2), unique=False, nullable=False)
    carteira = db.Column(db.Integer(), nullable= True)
    jogos = db.Column(db.Text())
    carrinho = db.Column(db.Text())
    caminho_foto = db.Column(db.String(), nullable=True)
    is_administrador = db.Column(db.Boolean())
    preferencia = db.Column(db.Boolean())

    def set_jogo(self,jogo):
        if jogo is not None:
            auxiliar = self.jogos
            auxiliar+="/"+str(jogo.codigo_produto)
            self.jogos = auxiliar
        else:
            self.jogos = " "

    def get_id(self):
        return self.cpf
    def set_carrinho(self,jogo):
        if jogo is not None:
            self.carrinho +="/"+jogo[0]
        else:
            carrinho = Modelo_carrinho()
            carrinho.codigo_carrinho = self.cpf
            db.session.add(carrinho)
            db.session.commit()
            self.carrinho = carrinho.codigo_carrinho
  
    def set_senha(self, resposta):
        self.senha = generate_password_hash(self.senha) 


    def check_senha(self, password):
        return self.senha == password

    def __repr__(self):
        return 'Usuario com cpf {}'.format(self.usuario) 

    def set_administrador(self): 
        self.is_administrador = True
    def set_cpf(self,resposta):
        lista_cpfs=[]
        usuarios = Modelo_user.query.all()
        for usuario in usuarios:
            lista_cpfs.append(usuario[1])
        if self.cpf in lista_cpfs:
             resposta = jsonify({"resultado":"erro", "detalhes":"cpf já cadastrado"})
        return resposta 
    def set_email(self,resposta):
        lista_emails=[]
        usuarios = Modelo_user.query.all()
        for usuario in usuarios:
            lista_emails.append(usuario[8])
        if self.email in lista_emails:
            resposta = jsonify({"resultado":"erro", "detalhes":"email já cadastrado"})
        return resposta  
    def json(self):
        return {
        "nome" : self.usuario,
        "cpf" : self.cpf,
        "cidade" : self.cidade,
        "estado" : self.estado,
        "cep" :  self.cep,
        "rua" : self.rua,
        "numero imovel" : self.numero_imovel,
        "caminho_foto" : self.caminho_foto,
        "data_de_nacimento" : self.data_de_nacimento,
        "email" : self.email,
        "senha" : self.senha,
        "sexo" : self.sexo,
        "carteira" : self.carteira,
        "jogos" : self.jogos,
        "carrinho" : self.carrinho,
        "administrador" : self.is_administrador,
        "preferencia" : self.preferencia   
        }
class Modelo_produto(db.Model):
    codigo_produto = db.Column(db.String(15),primary_key=True)
    preco_promocao = db.Column(db.Integer(),nullable=False)
    preco_normal =  db.Column(db.Integer(),nullable=False)
    preco_atual = db.Column(db.Integer(),nullable=False)
    genero = db.Column(db.String(15),nullable=False)
    caminho_foto = db.Column(db.String, nullable=True)
    descricao = db.Column(db.String(120), nullable=False)
    titulo = db.Column(db.String(35),unique=True , nullable=False)
    # criador = db.Column(db.String(15))
    def gerar_codigoproduto(self):
        self.codigo_produto=""
        for i in range(15):
            codificador = str(choice(["A","B","C","D","E","F","G","H","I","J","K","L","M","N"
                                    ,"O","P","Q","R","S","T","U","V","W","X","Y","Z"])) 
            valor = randint(0,10)
            codigo = valor * (dicionario[codificador])
            self.codigo_produto += codificador + str(codigo) 
    def criar_promocao(self):
        if  self.preco_atual == self.preco_promocao:
           return "não foi possivel criar promoção por já estar em promoção"
        self.preco_atual = self.preco_promocao
    def tirar_promocao(self):
        if  self.preco_atual == self.preco_normal:
           return "não foi possivel tirar promoção por não estar em promoção"
        self.preco_atual = self.preco_normal
    def json(self):
        return {
        "codigo_produto" : self.codigo_produto,
        "descricao" : self.descricao,
        "titulo" : self.titulo,
        "preco_promocao" : self.preco_promocao,
        "preco_normal" :  self.preco_normal,
        "preco_atual" : self.preco_atual,
        "genero" : self.genero,
        "caminho_foto" : self.caminho_foto,
        }
class Modelo_carrinho(db.Model):
    codigo_carrinho = db.Column(db.String(15),primary_key=True)
    jogos = db.Column(db.Text(), nullable = True)
    def json(self):
        return {
            "codigo_carrinho": self.codigo_carrinho,
            "jogos" : self.jogos 
        }
    def apagar(self):
        self.jogos = None 
    def gerar_codigo(self):
        self.codigo_carrinho=""
        for i in range(15):
            codificador = str(choice(["A","B","C","D","E","F","G","H","I","J","K","L","M","N"
                                    ,"O","P","Q","R","S","T","U","V","W","X","Y","Z"])) 
            valor = randint(0,10)
            codigo = valor * (dicionario[codificador])
            self.codigo_carrinho += codificador + str(codigo) 




dicionario={ "A": 1,
            "B":2,
            "C":3,
            "D":4,
            "E":5,
            "F":6,
            "G":7,
            "H":8,
            "I":9,
            "J":10,
            "K":11,
            "L":12,
            "M":13,
            "N":14,
            "O":15,
            "P":16,
            "Q":17,
            "R":18,
            "S":19,
            "T":20,
            "U":21,
            "V":22,
            "W":23,
            "X":24,
            "Y":25,
            "Z":26
}







