<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit;
}

try {
    // Auto-heal: Ensure table exists
    $createTableQuery = "CREATE TABLE IF NOT EXISTS running_costs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rc_id VARCHAR(50) NOT NULL UNIQUE,
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        frequency VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($createTableQuery);

    $query = "SELECT * FROM running_costs ORDER BY date DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $num = $stmt->rowCount();
    
    $costs_arr = [];
    
    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $cost_item = [
                "id" => $row['id'],
                "category" => $row['category'],
                "amount" => $row['amount'],
                "frequency" => $row['frequency'],
                "date" => $row['date'],
                "description" => $row['description'],
                "submittedAt" => date('M j, Y', strtotime($row['created_at']))
            ];
            
            array_push($costs_arr, $cost_item);
        }
        
        http_response_code(200);
        echo json_encode($costs_arr);
    } else {
        http_response_code(200);
        echo json_encode([]); // Return empty array if no records
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error retrieving running costs.", "error" => $e->getMessage()]);
}
?>
