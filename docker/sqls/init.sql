-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS brindeme;

-- Criar usuário se não existir
CREATE USER IF NOT EXISTS 'bme_desafio'@'%' IDENTIFIED BY 'bme_desafio';

-- Conceder permissões ao usuário
GRANT ALL PRIVILEGES ON brindeme.* TO 'bme_desafio'@'%' WITH GRANT OPTION;

-- Atualizar privilégios
FLUSH PRIVILEGES;
