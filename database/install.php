<?php
/**
 * Script de Instalação do Banco de Dados
 * Dashboard MS
 * 
 * Execute este arquivo uma vez para criar o banco de dados e as tabelas
 */

// Configurações
$host = 'localhost';
$dbname = 'dashboard_ms';
$user = 'root';
$pass = '';

try {
    // Conectar ao MySQL sem selecionar banco
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Ler o arquivo SQL
    $sql = file_get_contents(__DIR__ . '/schema.sql');
    
    // Executar os comandos SQL
    $pdo->exec($sql);
    
    echo json_encode([
        'success' => true,
        'message' => 'Banco de dados instalado com sucesso!',
        'database' => $dbname
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao instalar banco de dados: ' . $e->getMessage()
    ]);
}
?>
