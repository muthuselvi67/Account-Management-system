<?php

require_once "database.php";

$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo "DATABASE CONNECTION SUCCESS";
} else {
    echo "DATABASE CONNECTION FAILED";
}

?>