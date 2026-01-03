<?php
/**
 * API Galeria - Dashboard MS
 * Gerencia imagens da galeria
 */

require_once '../database/config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            // Listar todas as imagens agrupadas por categoria
            $stmt = $db->query("
                SELECT id, url_imagem, categoria, data_upload 
                FROM imagens 
                ORDER BY categoria DESC, data_upload DESC
            ");
            $imagens = $stmt->fetchAll();
            
            // Agrupar por categoria
            $galeriaAgrupada = [];
            foreach ($imagens as $imagem) {
                $categoria = $imagem['categoria'];
                if (!isset($galeriaAgrupada[$categoria])) {
                    $galeriaAgrupada[$categoria] = [];
                }
                $galeriaAgrupada[$categoria][] = $imagem;
            }
            
            // Obter lista de categorias únicas
            $stmt = $db->query("SELECT DISTINCT categoria FROM imagens ORDER BY categoria DESC");
            $categorias = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'imagens' => $imagens,
                    'galeria_agrupada' => $galeriaAgrupada,
                    'categorias' => $categorias
                ]
            ]);
            break;
            
        case 'POST':
            // Adicionar nova imagem
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['url_imagem']) || !isset($data['categoria'])) {
                throw new Exception('Dados incompletos');
            }
            
            $stmt = $db->prepare("
                INSERT INTO imagens (url_imagem, categoria) 
                VALUES (:url_imagem, :categoria)
            ");
            
            $stmt->execute([
                ':url_imagem' => $data['url_imagem'],
                ':categoria' => $data['categoria']
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Imagem adicionada com sucesso',
                'id' => $db->lastInsertId()
            ]);
            break;
            
        case 'DELETE':
            // Remover imagem(ns)
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['ids']) || !is_array($data['ids'])) {
                throw new Exception('IDs não fornecidos');
            }
            
            $placeholders = implode(',', array_fill(0, count($data['ids']), '?'));
            $stmt = $db->prepare("DELETE FROM imagens WHERE id IN ($placeholders)");
            $stmt->execute($data['ids']);
            
            echo json_encode([
                'success' => true,
                'message' => 'Imagem(ns) removida(s) com sucesso',
                'deleted' => $stmt->rowCount()
            ]);
            break;
            
        case 'PUT':
            // Criar nova categoria ou atualizar imagem
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (isset($data['action']) && $data['action'] === 'create_category') {
                // Apenas retorna sucesso - categorias são criadas automaticamente ao adicionar imagens
                echo json_encode([
                    'success' => true,
                    'message' => 'Categoria criada com sucesso'
                ]);
            } else {
                throw new Exception('Ação não reconhecida');
            }
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
