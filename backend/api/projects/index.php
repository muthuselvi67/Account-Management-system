<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../../config/database.php";

/*
|--------------------------------------------------------------------------
| Handle OPTIONS request
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}


/*
|--------------------------------------------------------------------------
| Database connection
|--------------------------------------------------------------------------
*/

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);

    echo json_encode([
        "message" => "Database connection failed"
    ]);

    exit;
}


$method = $_SERVER["REQUEST_METHOD"];


/*
|--------------------------------------------------------------------------
| GET - Get all projects
|--------------------------------------------------------------------------
*/

if ($method === "GET") {

    try {

        $sql = "
            SELECT
                id,
                title,
                client_name,
                budget,
                start_date,
                end_date,
                status,
                created_at
            FROM projects
            ORDER BY id DESC
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute();

        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($projects);

    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([
            "message" => "Failed to fetch projects",
            "error" => $e->getMessage()
        ]);
    }

    exit;
}


/*
|--------------------------------------------------------------------------
| POST - Create project
|--------------------------------------------------------------------------
*/

if ($method === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {

        http_response_code(400);

        echo json_encode([
            "message" => "Invalid JSON data"
        ]);

        exit;
    }

    $title = trim($data["title"] ?? "");
    $client_name = trim($data["client_name"] ?? "");
    $budget = $data["budget"] ?? null;
    $start_date = $data["start_date"] ?? null;
    $end_date = $data["end_date"] ?? null;
    $status = $data["status"] ?? "planning";


    /*
    | Validate title
    */

    if ($title === "") {

        http_response_code(400);

        echo json_encode([
            "message" => "Project title is required"
        ]);

        exit;
    }


    /*
    | Validate status
    */

    $allowedStatuses = [
        "planning",
        "in-progress",
        "completed"
    ];

    if (!in_array($status, $allowedStatuses, true)) {

        http_response_code(400);

        echo json_encode([
            "message" => "Invalid project status"
        ]);

        exit;
    }


    try {

        $sql = "
            INSERT INTO projects
            (
                title,
                client_name,
                budget,
                start_date,
                end_date,
                status
            )
            VALUES
            (
                :title,
                :client_name,
                :budget,
                :start_date,
                :end_date,
                :status
            )
        ";

        $stmt = $db->prepare($sql);

        $stmt->bindValue(":title", $title);
        $stmt->bindValue(":client_name", $client_name);

        if ($budget === null || $budget === "") {
            $stmt->bindValue(":budget", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":budget", $budget);
        }

        if ($start_date === null || $start_date === "") {
            $stmt->bindValue(":start_date", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":start_date", $start_date);
        }

        if ($end_date === null || $end_date === "") {
            $stmt->bindValue(":end_date", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":end_date", $end_date);
        }

        $stmt->bindValue(":status", $status);

        $stmt->execute();

        $projectId = $db->lastInsertId();


        /*
        | Return newly created project
        */

        $stmt = $db->prepare("
            SELECT
                id,
                title,
                client_name,
                budget,
                start_date,
                end_date,
                status,
                created_at
            FROM projects
            WHERE id = :id
        ");

        $stmt->bindValue(":id", $projectId);
        $stmt->execute();

        $project = $stmt->fetch(PDO::FETCH_ASSOC);


        http_response_code(201);

        echo json_encode([
            "message" => "Project created successfully",
            "project" => $project
        ]);

    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([
            "message" => "Failed to create project",
            "error" => $e->getMessage()
        ]);
    }

    exit;
}


/*
|--------------------------------------------------------------------------
| PUT - Update project
|--------------------------------------------------------------------------
*/

if ($method === "PUT") {

    $id = $_GET["id"] ?? null;


    if (!$id || !is_numeric($id)) {

        http_response_code(400);

        echo json_encode([
            "message" => "Valid project ID is required"
        ]);

        exit;
    }


    $data = json_decode(file_get_contents("php://input"), true);


    if (!is_array($data)) {

        http_response_code(400);

        echo json_encode([
            "message" => "Invalid JSON data"
        ]);

        exit;
    }


    $title = trim($data["title"] ?? "");
    $client_name = trim($data["client_name"] ?? "");
    $budget = $data["budget"] ?? null;
    $start_date = $data["start_date"] ?? null;
    $end_date = $data["end_date"] ?? null;
    $status = $data["status"] ?? "planning";


    if ($title === "") {

        http_response_code(400);

        echo json_encode([
            "message" => "Project title is required"
        ]);

        exit;
    }


    $allowedStatuses = [
        "planning",
        "in-progress",
        "completed"
    ];


    if (!in_array($status, $allowedStatuses, true)) {

        http_response_code(400);

        echo json_encode([
            "message" => "Invalid project status"
        ]);

        exit;
    }


    try {

        /*
        | Check project exists
        */

        $check = $db->prepare("
            SELECT id
            FROM projects
            WHERE id = :id
        ");

        $check->bindValue(":id", $id);
        $check->execute();

        if (!$check->fetch()) {

            http_response_code(404);

            echo json_encode([
                "message" => "Project not found"
            ]);

            exit;
        }


        /*
        | Update project
        */

        $sql = "
            UPDATE projects
            SET
                title = :title,
                client_name = :client_name,
                budget = :budget,
                start_date = :start_date,
                end_date = :end_date,
                status = :status
            WHERE id = :id
        ";

        $stmt = $db->prepare($sql);

        $stmt->bindValue(":title", $title);
        $stmt->bindValue(":client_name", $client_name);

        if ($budget === null || $budget === "") {
            $stmt->bindValue(":budget", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":budget", $budget);
        }

        if ($start_date === null || $start_date === "") {
            $stmt->bindValue(":start_date", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":start_date", $start_date);
        }

        if ($end_date === null || $end_date === "") {
            $stmt->bindValue(":end_date", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":end_date", $end_date);
        }

        $stmt->bindValue(":status", $status);
        $stmt->bindValue(":id", $id);

        $stmt->execute();


        /*
        | Return updated project
        */

        $stmt = $db->prepare("
            SELECT
                id,
                title,
                client_name,
                budget,
                start_date,
                end_date,
                status,
                created_at
            FROM projects
            WHERE id = :id
        ");

        $stmt->bindValue(":id", $id);
        $stmt->execute();

        $project = $stmt->fetch(PDO::FETCH_ASSOC);


        echo json_encode([
            "message" => "Project updated successfully",
            "project" => $project
        ]);

    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([
            "message" => "Failed to update project",
            "error" => $e->getMessage()
        ]);
    }

    exit;
}


/*
|--------------------------------------------------------------------------
| DELETE - Delete project
|--------------------------------------------------------------------------
*/

if ($method === "DELETE") {

    $id = $_GET["id"] ?? null;


    if (!$id || !is_numeric($id)) {

        http_response_code(400);

        echo json_encode([
            "message" => "Valid project ID is required"
        ]);

        exit;
    }


    try {

        /*
        | Check project exists
        */

        $check = $db->prepare("
            SELECT id
            FROM projects
            WHERE id = :id
        ");

        $check->bindValue(":id", $id);
        $check->execute();

        if (!$check->fetch()) {

            http_response_code(404);

            echo json_encode([
                "message" => "Project not found"
            ]);

            exit;
        }


        /*
        | Delete project
        */

        $stmt = $db->prepare("
            DELETE FROM projects
            WHERE id = :id
        ");

        $stmt->bindValue(":id", $id);
        $stmt->execute();


        echo json_encode([
            "message" => "Project deleted successfully"
        ]);

    } catch (PDOException $e) {

        http_response_code(500);

        echo json_encode([
            "message" => "Failed to delete project",
            "error" => $e->getMessage()
        ]);
    }

    exit;
}


/*
|--------------------------------------------------------------------------
| Unsupported method
|--------------------------------------------------------------------------
*/

http_response_code(405);

echo json_encode([
    "message" => "Method not allowed"
]);

?>