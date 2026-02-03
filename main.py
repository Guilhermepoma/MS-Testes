import mysql.connector
from mysql.connector import Error
import os

# ===============================
# CONFIGURAÇÃO DO BANCO (Railway)
# ===============================
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "tramway.proxy.rlwy.net"),
    "port": int(os.getenv("DB_PORT", 41938)),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASS", "GVftXVCIehgmeVfZnZhpGIngqTmCEQjB"),
    "database": os.getenv("DB_NAME", "railway"),
}

# ===============================
# SQL DE CRIAÇÃO + INSERTS
# ===============================
SQL_SCRIPT = """
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO usuarios (username, password, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@dashboard.com');

CREATE TABLE IF NOT EXISTS imagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url_imagem VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL DEFAULT '2025',
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria)
);

INSERT IGNORE INTO imagens (url_imagem, categoria) VALUES 
('assets/images/dashboard_imgs/placeholder1.jpg', '2025'),
('assets/images/dashboard_imgs/placeholder2.jpg', '2025'),
('assets/images/dashboard_imgs/placeholder3.jpg', '2025'),
('assets/images/dashboard_imgs/placeholder4.jpg', '2024'),
('assets/images/dashboard_imgs/placeholder5.jpg', '2024'),
('assets/images/dashboard_imgs/placeholder6.jpg', '2024');

CREATE TABLE IF NOT EXISTS toneladas_ano (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ano INT NOT NULL UNIQUE,
    toneladas DECIMAL(10, 2) NOT NULL,
    cor VARCHAR(7) DEFAULT '#034794',
    INDEX idx_ano (ano)
);

INSERT IGNORE INTO toneladas_ano (ano, toneladas, cor) VALUES 
(2019, 10.00, '#034794'),
(2020, 12.00, '#0056b3'),
(2021, 14.00, '#f7d708'),
(2022, 16.00, '#f76b07'),
(2023, 18.00, '#28a745'),
(2024, 20.00, '#6f42c1'),
(2025, 22.00, '#d11507');

CREATE TABLE IF NOT EXISTS voluntarios_ano (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ano INT NOT NULL UNIQUE,
    quantidade INT NOT NULL,
    cor VARCHAR(7) DEFAULT '#034794',
    INDEX idx_ano (ano)
);

INSERT IGNORE INTO voluntarios_ano (ano, quantidade, cor) VALUES 
(2019, 50, '#034794'),
(2020, 75, '#0056b3'),
(2021, 100, '#f7d708'),
(2022, 150, '#f76b07'),
(2023, 200, '#28a745'),
(2024, 300, '#6f42c1'),
(2025, 500, '#d11507');

CREATE TABLE IF NOT EXISTS voluntarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    foto_url VARCHAR(255) DEFAULT 'assets/images/avatar-default.png',
    ano_participacao INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nome (nome),
    INDEX idx_ano (ano_participacao)
);

INSERT IGNORE INTO voluntarios (nome, foto_url, ano_participacao) VALUES 
('Ana Silva', 'assets/images/avatar1.jpg', 2025),
('Bruno Costa', 'assets/images/avatar2.jpg', 2025),
('Carlos Mendes', 'assets/images/avatar3.jpg', 2024),
('Diana Oliveira', 'assets/images/avatar4.jpg', 2024),
('Eduardo Santos', 'assets/images/avatar5.jpg', 2023),
('Fernanda Lima', 'assets/images/avatar6.jpg', 2025),
('Gabriel Rocha', 'assets/images/avatar7.jpg', 2024),
('Helena Martins', 'assets/images/avatar8.jpg', 2025);

CREATE TABLE IF NOT EXISTS configuracoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chave VARCHAR(50) NOT NULL UNIQUE,
    valor VARCHAR(255) NOT NULL,
    descricao TEXT
);

INSERT IGNORE INTO configuracoes (chave, valor, descricao) VALUES 
('total_edicoes', '15', 'Número total de edições do projeto'),
('total_kg', '9999', 'Total de quilogramas arrecadados'),
('total_voluntarios', '500', 'Quantidade total de voluntários ativos');
"""

# ===============================
# EXECUÇÃO
# ===============================
def run_migration():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        statements = [s.strip() for s in SQL_SCRIPT.split(";") if s.strip()]

        for stmt in statements:
            cursor.execute(stmt)

        conn.commit()
        print("✅ Banco inicializado com sucesso!")

    except Error as e:
        print("❌ Erro ao executar migration:", e)

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    run_migration()
