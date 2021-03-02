#config : serve para acessar o banco de dados
class Config:
    SECRET_KEY= "PC06050907"
    SQLALCHEMY_DATABASE_URI = 'sqlite:///banco_dados/app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    MAIL_USERNAME = "kronergamer@gmail.com"
    MAIL_PASSWORD = "kroner9paulo1475963"
    UPLOAD_FOLDER = 'C:/Users/Paulo/Desktop/Codigos/Site/app/static/images/perfil/'
