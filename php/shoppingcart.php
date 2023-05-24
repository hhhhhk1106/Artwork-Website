<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");

if(isset($_POST["UserID"])&&isset($_POST["PaintingID"])) {
    $UserID = $_POST["UserID"];
    $PaintingID = $_POST["PaintingID"];

    // 检查购物车中是否已有
    $stmt = $conn->prepare("SELECT * FROM shoppingcart WHERE UserID = ? AND PaintingID = ?");
    $stmt->bind_param("ii", $UserID, $PaintingID);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0) {
        echo "already";
    } else {
        // 添加
        $stmt = $conn->prepare("INSERT INTO shoppingcart (UserID, PaintingID) VALUES (?,?)");
        $stmt->bind_param("ii", $UserID, $PaintingID);
        $stmt->execute();
        echo "success";
    }
}
