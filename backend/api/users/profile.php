<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit;
}

// Auto-heal: Ensure table and columns exist
try {
    $createTableQuery = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
        employee_id VARCHAR(50),
        department VARCHAR(100),
        position VARCHAR(100),
        avatar LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($createTableQuery);

    // Try to add the columns if they don't exist (for existing tables)
    try {
        $db->exec("ALTER TABLE users ADD COLUMN employee_id VARCHAR(50)");
    } catch (PDOException $e) {}
    try {
        $db->exec("ALTER TABLE users ADD COLUMN department VARCHAR(100)");
    } catch (PDOException $e) {}
    try {
        $db->exec("ALTER TABLE users ADD COLUMN position VARCHAR(100)");
    } catch (PDOException $e) {}
    try {
        $db->exec("ALTER TABLE users ADD COLUMN avatar LONGTEXT");
    } catch (PDOException $e) {}

    // Ensure at least one admin user exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = 'admin@learnlike.in' OR email = 'admin@example.com'");
    $stmt->execute();
    if ($stmt->rowCount() == 0) {
        $insert = "INSERT INTO users (name, email, password, role, employee_id, department, position) 
                   VALUES ('Admin User', 'admin@example.com', 'hashed_password', 'admin', 'EMP-0087', 'Administration', 'Chief Executive Officer')";
        $db->exec($insert);
    }
} catch(PDOException $e) {
    // Ignore schema errors
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // We assume we are fetching the admin profile for now. In a real app, this would use a session/token.
        $query = "SELECT email, employee_id, department, position, avatar FROM users ORDER BY id ASC LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode([
                "email" => $row['email'],
                "employeeId" => $row['employee_id'] ?? '',
                "department" => $row['department'] ?? '',
                "position" => $row['position'] ?? '',
                "avatar" => $row['avatar'] ?? ''
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Profile not found."]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error retrieving profile.", "error" => $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->email) && !empty($data->employeeId)) {
            // Updating the first user (admin)
            $query = "UPDATE users SET 
                        email = :email, 
                        employee_id = :employee_id, 
                        department = :department, 
                        position = :position,
                        avatar = :avatar
                      ORDER BY id ASC LIMIT 1"; 
                      
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":email", $data->email);
            $stmt->bindParam(":employee_id", $data->employeeId);
            $stmt->bindParam(":department", $data->department);
            $stmt->bindParam(":position", $data->position);
            
            $avatar = isset($data->avatar) ? $data->avatar : null;
            $stmt->bindParam(":avatar", $avatar);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(["message" => "Profile updated successfully."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update profile."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error updating profile.", "error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
?>
