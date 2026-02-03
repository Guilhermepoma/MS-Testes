<?php
/**
 * Script de Instalação do Banco de Dados
 * Dashboard MS
 * Execute este arquivo UMA VEZ
 */

header('Content-Type: application/json; charset=utf-8');

// Configurações
$host   = getenv('DB_HOST') ?: 'tramway.proxy.rlwy.net';
$port   = getenv('DB_PORT') ?: '41938';
$dbname = getenv('DB_NAME') ?: 'railway';
$user   = getenv('DB_USER') ?: 'root';
$pass   = getenv('DB_PASS') ?: 'GVftXVCIehgmeVfZnZhpGIngqTmCEQjB';

try {
    // Conexão correta com Railway
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Ler SQL
    $sql = file_get_contents(__DIR__ . '/schema.sql');

    if (!$sql) {
        throw new Exception("Arquivo schema.sql não encontrado");
    }

    // Executar comandos
    $pdo->exec($sql);

    echo json_encode([
        'success' => true,
        'message' => 'Banco de dados instalado com sucesso!'
    ]);

} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}