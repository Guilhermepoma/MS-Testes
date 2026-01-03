# como rodar o projeto com docker

pra subir o projeto na sua máquina é só seguir esses passos:

### requisitos
1. docker desktop instalado e rodando
2. git instalado

### como subir
1. abra o terminal na pasta do projeto
2. rode o comando:
   ```bash
   docker compose up -d
   ```
3. instale o banco de dados (precisa fazer isso uma vez):
   acesse no navegador: http://localhost:8080/database/install.php

4. acesse o site:
   http://localhost:8080

### acessos
- login do sistema: http://localhost:8080/private/login.html

### comandos úteis
- parar o projeto: `docker compose down`
- ver se tá rodando: `docker ps`
