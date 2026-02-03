<?php
require 'config.php';

$pdo = getDB();
$stmt = $pdo->query("SELECT * FROM usuarios");
echo json_encode($stmt->fetchAll(), JSON_PRETTY_PRINT);