<?php
/**
 * API Voluntários CSV - Dashboard MS
 * Importa e exporta dados de voluntários em formato CSV
 */

require_once '../database/config.php';

$action = $_GET['action'] ?? '';

try {
    $db = getDB();
    
    if ($action === 'export') {
        // Exportar para CSV
        $stmt = $db->query("
            SELECT nome, foto_url, ano_participacao 
            FROM voluntarios 
            ORDER BY nome ASC
        ");
        $voluntarios = $stmt->fetchAll();
        
        // Configurar headers para download
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="voluntarios_' . date('Y-m-d') . '.csv"');
        
        // Criar output
        $output = fopen('php://output', 'w');
        
        // Adicionar BOM para UTF-8
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // Cabeçalho
        fputcsv($output, ['nome', 'foto_url', 'ano_participacao'], ';');
        
        // Dados
        foreach ($voluntarios as $voluntario) {
            fputcsv($output, [
                $voluntario['nome'],
                $voluntario['foto_url'],
                $voluntario['ano_participacao']
            ], ';');
        }
        
        fclose($output);
        exit;
        
    } else if ($action === 'import') {
        // Importar de CSV
        if (!isset($_FILES['csv'])) {
            throw new Exception('Nenhum arquivo enviado');
        }
        
        $file = $_FILES['csv'];
        
        // Validar arquivo
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Erro no upload do arquivo');
        }
        
        // Ler arquivo
        $handle = fopen($file['tmp_name'], 'r');
        if (!$handle) {
            throw new Exception('Não foi possível abrir o arquivo');
        }
        
        // Pular cabeçalho
        $header = fgetcsv($handle, 1000, ';');
        
        $imported = 0;
        $errors = [];
        
        // Processar linhas
        while (($data = fgetcsv($handle, 1000, ';')) !== false) {
            // Validar dados
            if (count($data) < 3) {
                $errors[] = "Linha com dados incompletos: " . implode(';', $data);
                continue;
            }
            
            $nome = trim($data[0]);
            $foto_url = trim($data[1]);
            $ano_participacao = intval(trim($data[2]));
            
            if (empty($nome) || $ano_participacao < 2000) {
                $errors[] = "Dados inválidos: $nome, $ano_participacao";
                continue;
            }
            
            // Inserir no banco
            try {
                $stmt = $db->prepare("
                    INSERT INTO voluntarios (nome, foto_url, ano_participacao) 
                    VALUES (:nome, :foto_url, :ano_participacao)
                ");
                
                $stmt->execute([
                    ':nome' => $nome,
                    ':foto_url' => $foto_url ?: 'assets/images/avatar-default.png',
                    ':ano_participacao' => $ano_participacao
                ]);
                
                $imported++;
            } catch (Exception $e) {
                $errors[] = "Erro ao importar $nome: " . $e->getMessage();
            }
        }
        
        fclose($handle);
        
        echo json_encode([
            'success' => true,
            'message' => "$imported voluntário(s) importado(s) com sucesso",
            'imported' => $imported,
            'errors' => $errors
        ]);
        
    } else {
        throw new Exception('Ação não especificada');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro: ' . $e->getMessage()
    ]);
}
?>
