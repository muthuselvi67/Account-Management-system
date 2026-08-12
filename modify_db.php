<?php
require_once "backend/config/database.php";

$database = new Database();
$conn = $database->getConnection();

if ($conn) {
    try {
        $query = "ALTER TABLE users ADD COLUMN employee_id VARCHAR(50), ADD COLUMN department VARCHAR(100), ADD COLUMN position VARCHAR(100)";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        echo "Table updated successfully.\n";
        
        // Also let's update the admin user with some default profile data
        $updateQuery = "UPDATE users SET employee_id = 'EMP-0087', department = 'Administration', position = 'Chief Executive Officer' WHERE email = 'admin@learnlike.in'";
        $stmt2 = $conn->prepare($updateQuery);
        $stmt2->execute();
        echo "Admin user updated successfully.\n";
    } catch (PDOException $e) {
        // If it already exists, just update
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "Columns already exist.\n";
            $updateQuery = "UPDATE users SET employee_id = 'EMP-0087', department = 'Administration', position = 'Chief Executive Officer' WHERE email = 'admin@learnlike.in'";
            $stmt2 = $conn->prepare($updateQuery);
            $stmt2->execute();
            echo "Admin user updated successfully.\n";
        } else {
            echo "Error: " . $e->getMessage();
        }
    }
} else {
    echo "Connection failed.";
}
?>
