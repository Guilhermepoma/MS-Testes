<?php
/**
 * API Voluntários - Dashboard MS
 * Gerencia cadastro de voluntários
 */

require_once '../database/config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            // Listar todos os voluntários em ordem alfabética
            $stmt = $db->query("
                SELECT id, nome, foto_url, ano_participacao 
                FROM voluntarios 
                ORDER BY nome ASC
            ");
            $voluntarios = $stmt->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => $voluntarios
            ]);
            break;
            
        case 'POST':
            // Adicionar novo voluntário
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['nome']) || !isset($data['ano_participacao'])) {
                throw new Exception('Dados incompletos');
            }
            
            $stmt = $db->prepare("
                INSERT INTO voluntarios (nome, foto_url, ano_participacao) 
                VALUES (:nome, :foto_url, :ano_participacao)
            ");
            
            $stmt->execute([
                ':nome' => $data['nome'],
                ':foto_url' => $data['foto_url'] ?? 'assets/images/avatar-default.png',
                ':ano_participacao' => $data['ano_participacao']
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Voluntário adicionado com sucesso',
                'id' => $db->lastInsertId()
            ]);
            break;
            
        case 'PUT':
            // Atualizar voluntário
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                throw new Exception('ID não fornecido');
            }
            
            $stmt = $db->prepare("
                UPDATE voluntarios 
                SET nome = :nome, 
                    foto_url = :foto_url, 
                    ano_participacao = :ano_participacao 
                WHERE id = :id
            ");
            
            $stmt->execute([
                ':id' => $data['id'],
                ':nome' => $data['nome'],
                ':foto_url' => $data['foto_url'],
                ':ano_participacao' => $data['ano_participacao']
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Voluntário atualizado com sucesso'
            ]);
            break;
            
        case 'DELETE':
            // Remover voluntário(s)
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['ids']) || !is_array($data['ids'])) {
                throw new Exception('IDs não fornecidos');
            }
            
            $placeholders = implode(',', array_fill(0, count($data['ids']), '?'));
            $stmt = $db->prepare("DELETE FROM voluntarios WHERE id IN ($placeholders)");
            $stmt->execute($data['ids']);
            
            echo json_encode([
                'success' => true,
                'message' => 'Voluntário(s) removido(s) com sucesso',
                'deleted' => $stmt->rowCount()
            ]);
            break;
            
        default:
            throw new Exception('Método não suportado');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro: ' . $e->getMessage()
    ]);
}
?>
