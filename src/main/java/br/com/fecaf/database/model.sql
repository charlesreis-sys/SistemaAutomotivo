CREATE DATABASE db_concessionaria;

USE db_concessionaria;

CREATE TABLE tbl_veiculo (

    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    ano YEAR NOT NULL,
    cor VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quilometragem INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    quantidade_estoque INT NOT NULL DEFAULT 0

);

INSERT INTO veiculo
(modelo, marca, ano, cor, preco, quilometragem, status, quantidade_estoque)
VALUES
    ('Civic', 'Honda', 2022, 'Preto', 125000.00, 15000, disponivel, 3);