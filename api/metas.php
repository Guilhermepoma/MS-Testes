<?php
/**
 * API Metas - Dashboard MS
 * Gerencia dados de metas (toneladas e voluntários por ano)
 */

require_once '../database/config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            // Obter dados de toneladas e voluntários
            $stmtToneladas = $db->query("
                SELECT ano, toneladas, cor 
                FROM toneladas_ano 
                ORDER BY ano ASC
            ");
            $toneladas = $stmtToneladas->fetchAll();
            
            $stmtVoluntarios = $db->query("
                SELECT ano, quantidade, cor 
                FROM voluntarios_ano 
                ORDER BY ano ASC
            ");
            $voluntarios = $stmtVoluntarios->fetchAll();
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'toneladas' => $toneladas,
                    'voluntarios' => $voluntarios
                ]
            ]);
            break;
            
        case 'POST':
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['tipo']) || !isset($data['ano']) || !isset($data['valor'])) {
        throw new Exception('Dados incompletos');
    }
    
    $cor = $data['cor'] ?? '#034794';
    
    if ($data['tipo'] === 'toneladas') {
        $stmt = $db->prepare("
            INSERT INTO toneladas_ano (ano, toneladas, cor) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE toneladas = ?, cor = ?");

        $stmt->execute([$data['ano'], $data['valor'], $cor, $data['valor'], $cor]);
        
    } else if ($data['tipo'] === 'voluntarios') {
        $stmt = $db->prepare("
            INSERT INTO voluntarios_ano (ano, quantidade, cor) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantidade = ?, cor = ?");

        $stmt->execute([$data['ano'], $data['valor'], $cor, $data['valor'], $cor]);
    } else {
        throw new Exception('Tipo inválido');
    }
    
    echo json_encode(['success' => true, 'message' => 'Registro salvo com sucesso']);
    break;
            
        case 'PUT':
            // Atualizar registro existente
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['tipo']) || !isset($data['id']) || !isset($data['valor']) || !isset($data['cor'])) {
                throw new Exception('Dados incompletos');
            }
            
            if ($data['tipo'] === 'toneladas') {
                $stmt = $db->prepare("
                    UPDATE toneladas_ano 
                    SET toneladas = :valor, cor = :cor 
                    WHERE id = :id
                ");
            } else if ($data['tipo'] === 'voluntarios') {
                $stmt = $db->prepare("
                    UPDATE voluntarios_ano 
                    SET quantidade = :valor, cor = :cor 
                    WHERE id = :id
                ");
            } else {
                throw new Exception('Tipo inválido');
            }
            
            $stmt->execute([
                ':id' => $data['id'],
                ':valor' => $data['valor'],
                ':cor' => $data['cor']
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Registro atualizado com sucesso'
            ]);
            break;
            
        case 'DELETE':
            // Remover registro
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['tipo']) || !isset($data['id'])) {
                throw new Exception('Dados incompletos');
            }
            
            if ($data['tipo'] === 'toneladas') {
                $stmt = $db->prepare("DELETE FROM toneladas_ano WHERE id = :id");
            } else if ($data['tipo'] === 'voluntarios') {
                $stmt = $db->prepare("DELETE FROM voluntarios_ano WHERE id = :id");
            } else {
                throw new Exception('Tipo inválido');
            }
            
            $stmt->execute([':id' => $data['id']]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Registro removido com sucesso'
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
