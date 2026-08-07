<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->rc_id) &&
    !empty($data->category) &&
    !empty($data->amount) &&
    !empty($data->frequency) &&
    !empty($data->date)
) {
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

        $query = "INSERT INTO running_costs (rc_id, category, amount, frequency, date, description) 
                  VALUES (:rc_id, :category, :amount, :frequency, :date, :description)";
        
        $stmt = $db->prepare($query);
        
        $rc_id = htmlspecialchars(strip_tags($data->rc_id));
        $category = htmlspecialchars(strip_tags($data->category));
        $amount = htmlspecialchars(strip_tags($data->amount));
        $frequency = htmlspecialchars(strip_tags($data->frequency));
        $date = htmlspecialchars(strip_tags($data->date));
        $description = !empty($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;
        
        $stmt->bindParam(":rc_id", $rc_id);
        $stmt->bindParam(":category", $category);
        $stmt->bindParam(":amount", $amount);
        $stmt->bindParam(":frequency", $frequency);
        $stmt->bindParam(":date", $date);
        $stmt->bindParam(":description", $description);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Running cost was created."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create running cost."]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error creating running cost.", "error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Unable to create running cost. Data is incomplete."]);
}
?>
