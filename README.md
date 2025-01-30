# Instalando o Sistema

Este documento fornece instruções detalhadas para configurar e executar o sistema completo, incluindo tanto o **backend** quanto o **frontend**, utilizando **Docker** e outras ferramentas necessárias. Siga os passos abaixo para configurar o ambiente de desenvolvimento do zero.

---

## **1. Requisitos do Sistema**

Certifique-se de que os seguintes softwares estão instalados no seu sistema:

- **Docker** e **Docker Compose**
- **Git**
- **Node.js** (versão 14 ou superior) e **npm**
- **Composer** (para gerenciamento de dependências PHP, caso não utilize o Docker para o backend)

---

## **2. Estrutura do Projeto**

A estrutura do projeto está organizada da seguinte maneira:

```
brindeme/
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── tests/
│   ├── vendor/
│   ├── .env
│   ├── composer.json
│   ├── Dockerfile
│   └── phpunit.xml
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── Dockerfile
├── docker/
│   ├── mysql/
│   ├── sqls/
│   └── docker-compose.yml
└── README.md
```

---

## **3. Configuração Inicial**

### **3.1 Clonar o Repositório**

Clone o repositório e navegue até o diretório do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd brindeme
```

### **3.2 Configurar os Arquivos `.env`**

#### **3.2.1 Backend**

Crie o arquivo `.env` para o backend com base no exemplo fornecido:

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário, ajustando as configurações de banco de dados, chave da aplicação, etc.

#### **3.2.2 Frontend**

Crie o arquivo `.env` para o frontend com base no exemplo fornecido (se existir):

```bash
cd ../frontend
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário, ajustando as configurações de API, URLs, chaves de serviços externos, etc.

---

## **4. Subindo o Ambiente Docker**

### **4.1 Subir os Contêineres**

Na raiz do projeto (onde está o `docker-compose.yml`), execute:

```bash
docker-compose up -d
```

Este comando iniciará os serviços definidos no `docker-compose.yml`, incluindo o backend e o banco de dados MySQL.

### **4.2 Verificar os Contêineres Ativos**

Para confirmar se os contêineres estão rodando corretamente:

```bash
docker ps
```

Os seguintes serviços devem estar ativos:

- `backend`
- `mysql`

O **Laravel** (backend) estará disponível em: **http://localhost:8000**

---

## **5. Configuração do Backend no Primeiro Uso**

### **5.1 Instalar Dependências**

Caso não esteja utilizando Docker para o backend ou se as dependências precisarem ser instaladas manualmente:

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
```

*Nota: Se você estiver utilizando Docker para o backend, estas etapas devem ser executadas dentro do contêiner do backend.*

### **5.2 Executar o Job de Atualização de Preços**

Certifique-se de que os **jobs** do Laravel estão configurados para serem processados corretamente. Você pode iniciar o **worker** de filas com:

```bash
docker exec -it <CONTAINER_ID_DO_BACKEND> php artisan queue:work
```

Substitua `<CONTAINER_ID_DO_BACKEND>` pelo ID ou nome do contêiner do backend.

---

## **6. Configuração do Frontend**

### **6.1 Navegar para o Diretório do Frontend**

```bash
cd ../frontend
```

### **6.2 Instalar Dependências**

Instale as dependências do projeto frontend usando **npm**:

```bash
npm install
```

### **6.3 Configurar Variáveis de Ambiente**

Assegure-se de que o arquivo `.env` do frontend está corretamente configurado com as URLs da API e quaisquer outras variáveis necessárias.

### **6.4 Rodar o Frontend**

Inicie o servidor de desenvolvimento do frontend:

```bash
npm start
```

O frontend estará disponível em: **http://localhost:3000**

*Nota: Se você estiver utilizando Docker para o frontend, ajuste as instruções conforme necessário para construir e rodar o contêiner do frontend.*

---

## **7. Testando a Aplicação**

### **7.1 Rodar Testes Automatizados no Backend**

Execute os testes diretamente no contêiner do backend:

```bash
docker exec -it <CONTAINER_ID_DO_BACKEND> php artisan test
```

### **7.2 Testando Notificações no Log e Banco**

Entre no contêiner do backend e inicie o Tinker:

```bash
docker exec -it <CONTAINER_ID_DO_BACKEND> php artisan tinker
```

Execute os comandos abaixo para testar notificações:

```php
use App\Models\User;
use App\Notifications\PriceUpdateCompleted;

$user = User::first();
$user->notify(new PriceUpdateCompleted(10));

// Verifique notificações no banco
$user->notifications;

// Verifique logs
exit
docker exec -it <CONTAINER_ID_DO_BACKEND> cat storage/logs/laravel.log
```

---

## **8. Encerrando os Serviços**

### **8.1 Parar os Contêineres**

Para parar todos os serviços Docker:

```bash
docker-compose down
```

### **8.2 Remover Dados Persistidos (Opcional)**

Se necessário, exclua os volumes persistentes do MySQL para limpar os dados:

```bash
docker-compose down -v
```

*Aviso: Este comando removerá todos os dados armazenados nos volumes, incluindo o banco de dados.*

---

## **10. Resumo do Fluxo de Trabalho**

1. **Clonar o Repositório:**
   - Utilize `git clone` para obter o código fonte do projeto.

2. **Configurar Arquivos `.env`:**
   - Configure os arquivos de ambiente tanto para o backend quanto para o frontend.

3. **Subir os Contêineres Docker:**
   - Utilize `docker-compose up -d` para iniciar os serviços necessários.

4. **Instalar Dependências:**
   - No backend, rode `composer install` e migrações.
   - No frontend, rode `npm install` e inicie o servidor.

5. **Testar a Aplicação:**
   - Execute testes automatizados e verifique as funcionalidades no navegador.

6. **Encerrar os Serviços:**
   - Use `docker-compose down` para parar os contêineres quando necessário.

---

## **11. Exemplos de Uso**

### **11.1. Aplicando um Aumento de 50% no Backend**

1. **Acesse o Frontend:**
   - Navegue até **http://localhost:3000/modify-prices**.

2. **Inserir o Percentual:**
   - Digite **50** para aplicar um aumento de 50% nos preços dos produtos.

3. **Submeter o Formulário:**
   - Clique em **"Atualizar Preços"**.

4. **Verificar no Backend:**
   - Confirme nos logs do backend que os preços foram atualizados corretamente.

5. **Verificar no Frontend:**
   - Navegue até **http://localhost:8000/products** para ver os preços atualizados.

### **11.2. Aplicando um Desconto de 10%**

1. **Acesse o Frontend:**
   - Navegue até **http://localhost:3000/modify-prices**.

2. **Inserir o Percentual:**
   - Digite **-10** para aplicar um desconto de 10% nos preços dos produtos.

3. **Submeter o Formulário:**
   - Clique em **"Atualizar Preços"**.

4. **Verificar no Backend:**
   - Confirme nos logs do backend que os preços foram atualizados corretamente.

5. **Verificar no Frontend:**
   - Navegue até **http://localhost:8000/products** para ver os preços atualizados.

