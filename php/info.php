<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");


if(isset($_GET["UserID"])&&isset($_GET["myAPI"])) {
    $userID = $_GET['UserID'];
    $myAPI = $_GET["myAPI"];

    if($myAPI == "userInfo") {
        $stmt = $conn->prepare("SELECT * FROM customers WHERE CustomerID = ?");
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            // 用户名、真实姓名、邮箱、手机号、地址、性别、生日、国籍、余额（充值
            // Address Country Phone Email Sex Birthday
            $row["Name"] = null;
            if($row["FirstName"]) $row["Name"] = $row["FirstName"]." ".$row["LastName"];
            $row["Balance"] = getBalance($userID,$conn);
            echo json_encode($row);
        } else {
            echo "no";
        }  
    }

    // TODO: 个人信息：已发布、已售出、已购买
    if($myAPI == "paintingInfo") {
        $stmt = $conn->prepare("SELECT * FROM customers WHERE CustomerID = ?");
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows === 1) {
            //
            echo json_encode($row);
        } else {
            echo "no";
        }          
    }
  
}



function getBalance($id,$conn) {
    // id为userID
    if($id === null) return;
    $sql = "SELECT Balance FROM account WHERE UserID = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row["Balance"];
    }
    return null;
}