<?php
/**
 * API Upload - Dashboard MS
 * Gerencia upload de arquivos
 */

header('Content-Type: application/json; charset=utf-8');

try {
    if (!isset($_FILES['imagem'])) {
        throw new Exception('Nenhum arquivo enviado');
    }
    
    $file = $_FILES['imagem'];
    
    // Validar arquivo
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WEBP.');
    }
    
    // Validar tamanho (máximo 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        throw new Exception('Arquivo muito grande. Tamanho máximo: 5MB');
    }
    
    // Gerar nome único
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_') . '.' . $extension;
    
    // Definir diretório de upload
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $targetPath = $uploadDir . $filename;
    
    // Mover arquivo
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception('Erro ao salvar arquivo');
    }
    
    // Retornar URL relativa
    $url = 'uploads/' . $filename;
    
    echo json_encode([
        'success' => true,
        'message' => 'Upload realizado com sucesso',
        'url' => $url,
        'filename' => $filename
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro no upload: ' . $e->getMessage()
    ]);
}
?>
