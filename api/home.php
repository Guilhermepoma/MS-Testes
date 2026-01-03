<?php
/**
 * API Home - Dashboard MS
 * Retorna dados para a página inicial
 */

require_once '../database/config.php';

try {
    $db = getDB();

    // Obter configurações gerais
    $stmt = $db->query("SELECT chave, valor FROM configuracoes");
    $configs = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // Obter dados de toneladas por ano para o gráfico
    $stmt = $db->query("SELECT ano, toneladas, cor FROM toneladas_ano ORDER BY ano ASC");
    $toneladas = $stmt->fetchAll();

    // Calcular total de toneladas
    $totalToneladas = array_sum(array_column($toneladas, 'toneladas'));

    // Obter total de voluntários
    $stmt = $db->query("SELECT COUNT(*) as total FROM voluntarios");
    $totalVoluntarios = $stmt->fetch()['total'];

    // Preparar dados do gráfico
    $graficoData = [
        'labels' => array_column($toneladas, 'ano'),
        'data' => array_column($toneladas, 'toneladas'),
        'colors' => array_column($toneladas, 'cor')
    ];

    // Resposta
    echo json_encode([
        'success' => true,
        'data' => [
            'cards' => [
                'total_kg' => number_format($totalToneladas * 1000, 0, ',', '.'),
                'total_voluntarios' => $totalVoluntarios,
                'total_edicoes' => count($toneladas)
            ],
            'grafico' => $graficoData
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao carregar dados: ' . $e->getMessage()
    ]);
}
?>