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

try {
    // 1. Get Total Revenue
    $query_revenue = "SELECT SUM(amount) as total FROM transactions WHERE type = 'income' AND status = 'completed'";
    $stmt_revenue = $db->prepare($query_revenue);
    $stmt_revenue->execute();
    $revenue_row = $stmt_revenue->fetch(PDO::FETCH_ASSOC);
    $total_revenue = $revenue_row['total'] ? $revenue_row['total'] : 0;

    // 2. Get Total Students
    $query_students = "SELECT COUNT(*) as total FROM students WHERE status = 'active'";
    $stmt_students = $db->prepare($query_students);
    $stmt_students->execute();
    $students_row = $stmt_students->fetch(PDO::FETCH_ASSOC);
    $total_students = $students_row['total'] ? $students_row['total'] : 0;

    // 3. Get Pending Payments
    $query_pending = "SELECT SUM(amount) as total FROM transactions WHERE status = 'pending'";
    $stmt_pending = $db->prepare($query_pending);
    $stmt_pending->execute();
    $pending_row = $stmt_pending->fetch(PDO::FETCH_ASSOC);
    $pending_payments = $pending_row['total'] ? $pending_row['total'] : 0;

    // 4. Get Total Expenses
    $query_expenses = "SELECT SUM(amount) as total FROM transactions WHERE type = 'expense' AND status = 'completed'";
    $stmt_expenses = $db->prepare($query_expenses);
    $stmt_expenses->execute();
    $expenses_row = $stmt_expenses->fetch(PDO::FETCH_ASSOC);
    $total_expenses = $expenses_row['total'] ? $expenses_row['total'] : 0;

    // 5. Get Recent Transactions
    $query_recent = "SELECT id, title, amount, type, status, transaction_date FROM transactions ORDER BY transaction_date DESC LIMIT 5";
    $stmt_recent = $db->prepare($query_recent);
    $stmt_recent->execute();
    
    $recent_transactions = [];
    while ($row = $stmt_recent->fetch(PDO::FETCH_ASSOC)) {
        // Format for frontend
        $recent_transactions[] = [
            "id" => $row['id'],
            "name" => $row['title'],
            "date" => date('M j, Y', strtotime($row['transaction_date'])),
            "amount" => ($row['type'] == 'income' ? '+' : '-') . '₹' . number_format($row['amount'], 2),
            "status" => ucfirst($row['status']),
            "type" => $row['type']
        ];
    }

    // Prepare response
    $response = [
        "stats" => [
            "totalRevenue" => [
                "value" => '₹' . number_format($total_revenue, 0),
                "change" => "+0.0%",
                "isPositive" => true
            ],
            "totalStudents" => [
                "value" => number_format($total_students, 0),
                "change" => "+0.0%",
                "isPositive" => true
            ],
            "pendingPayments" => [
                "value" => '₹' . number_format($pending_payments, 0),
                "change" => "-0.0%",
                "isPositive" => false
            ],
            "totalExpenses" => [
                "value" => '₹' . number_format($total_expenses, 0),
                "change" => "+0.0%",
                "isPositive" => false
            ]
        ],
        "recentTransactions" => $recent_transactions
    ];

    http_response_code(200);
    echo json_encode($response);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error retrieving dashboard data.", "error" => $e->getMessage()]);
}
?>
