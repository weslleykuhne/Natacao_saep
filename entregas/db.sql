DROP DATABASE IF EXISTS saep_db;
CREATE DATABASE saep_db;
USE saep_db;

create table responsavel(
id int auto_increment primary key,
nome varchar(100),
cpf VARBINARY(255) not null,
email varchar(100) not null,
telefone varchar(20) not null
);

insert into responsavel(nome, cpf, email, telefone) values
('Helena Souza', aes_encrypt('111.222.333-44', 'chave123'), 'helena@email.com', '(48) 99999-9901'),
('Igor Martins', aes_encrypt('222.333.444-55', 'chave123'), 'igor@email.com', '(48) 99999-9902'),
('Joana Lima', aes_encrypt('333.444.555-66', 'chave123'), 'joana@email.com', '(48) 99999-9903');

create table filhos(
id int auto_increment primary key,
id_responsavel int,
nome varchar(100) not null, 
data_nascimento date not null,
nivel_natacao enum('iniciante', 'intermediário', 'avançado'),
foreign key (id_responsavel) references responsavel(id)
);

insert into filhos(nome, id_responsavel, data_nascimento, nivel_natacao) values
('Felipe Souza', 1, '2010-01-01', 'iniciante'),
('Valentina Martins', 2, '2010-02-02', 'intermediário'),
('Luan Lima', 3,  '2010-03-03', 'avançado');

create table agendamentos(
 id int auto_increment primary key,
 filhos_id int not null,
 professor varchar(100) not null,
 data_atendimento date not null,
 horario time not null,
 FOREIGN KEY(filhos_id) REFERENCES filhos(id)
 );
 
INSERT INTO agendamentos(filhos_id, professor, data_atendimento, horario) VALUES
(3, 'Rafael', '2026-11-12', '09:00:00'),
(1, 'Sabrina', '2026-11-10', '14:00:00'),
(2, 'Rafael', '2026-11-11', '10:30:00');

CREATE TABLE usuarios(
 id INT AUTO_INCREMENT PRIMARY KEY,
 nome VARCHAR(100) NOT NULL,
 login VARCHAR(50) NOT NULL UNIQUE,
 senha VARCHAR(64) NOT NULL
);
INSERT INTO usuarios(nome, login, senha) VALUES
('Administrador', 'admin', SHA2('123', 256)),
('Bruna Costa', 'bruna', SHA2('123', 256)),
('Diego Ramos', 'diego', SHA2('123', 256));


