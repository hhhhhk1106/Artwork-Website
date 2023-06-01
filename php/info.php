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

    // TOkDO: 个人信息：已发布、已售出
    if($myAPI == "issueInfo") {
        $stmt = $conn->prepare("SELECT * FROM paintings WHERE IssueUserID = ?");
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        $list = array();
        if($result->num_rows > 0) {
            while ($row = $result->fetch_array()) {
                $list[] = $row;
            }
            echo json_encode($list);
        } else {
            echo "no";
        }          
    }

    // TODO: 已下单
    if($myAPI == "paidInfo") {
        $stmt = $conn->prepare("SELECT * FROM shoppingcart WHERE UserID = ? AND `State` = 1");
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        $list = array();
        if($result->num_rows > 0) {
            while ($row = $result->fetch_array()) {
                $info = getPaintingInfo($row["PaintingID"],$conn);
                $row["ImageFileName"] = $info["ImageFileName"];
                $row["Title"] = $info["Title"];
                $row["MSRP"] = $info["MSRP"];
                $list[] = $row;
            }
            echo json_encode($list);
        } else {
            echo "no";
        }          
    }

    if($myAPI == "update") {
        $stmt = $conn->prepare("SELECT * FROM customers WHERE CustomerID = ?");
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows === 1) {
            $row = $result->fetch_array();
            echo json_encode($row);
        } else {
            echo "no";
        }          
    }
}

if(isset($_POST["UserID"])&&isset($_POST["myAPI"])) {
    $userID = $_POST['UserID'];
    $myAPI = $_POST["myAPI"];

    if($myAPI == "recharge") {
        $money = $_POST["Money"];

        $stmt = $conn->prepare("SELECT * FROM account WHERE UserID = ?");
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            $balance = $row["Balance"] + $money;
            $stmt = $conn->prepare("UPDATE account SET `Balance` = ? WHERE `id` = ?");
            $stmt->bind_param("ii", $balance, $row["id"]);
            $stmt->execute();
            echo "success";
        } else {
            echo "no";
        }
        return;
    }

    if($myAPI == "update") {
        if(isset($_POST['Email'])) {
            $Email = $_POST['Email'];
            $stmt = $conn->prepare("UPDATE customers SET Email = ? WHERE `CustomerID` = ?");
            $stmt->bind_param("si", $Email, $userID);
            $stmt->execute();
        }
        if(isset($_POST['Phone'])) {
            $Phone = $_POST['Phone'];
            $stmt = $conn->prepare("UPDATE customers SET Phone = ? WHERE `CustomerID` = ?");
            $stmt->bind_param("si", $Phone, $userID);
            $stmt->execute();
        }
        if(isset($_POST['Address'])) {
            $Address = $_POST['Address'];
            $stmt = $conn->prepare("UPDATE customers SET Address = ? WHERE `CustomerID` = ?");
            $stmt->bind_param("si", $Address, $userID);
            $stmt->execute();
        }

        if(isset($_POST['Birthday'])) {
            $Birthday = $_POST['Birthday'];
            // echo $_POST['Birthday'];
            $stmt = $conn->prepare("UPDATE customers SET Birthday = ? WHERE `CustomerID` = ?");
            $stmt->bind_param("si", $Birthday, $userID);
            $stmt->execute();
        } else {
            $stmt = $conn->prepare("UPDATE customers SET Birthday = null WHERE `CustomerID` = ?");
            $stmt->bind_param("i", $userID);
            $stmt->execute();
        }
        if(isset($_POST['Sex'])) {
            $Sex = $_POST['Sex'];
            $stmt = $conn->prepare("UPDATE customers SET Sex = ? WHERE `CustomerID` = ?");
            $stmt->bind_param("si", $Sex, $userID);
            $stmt->execute();
        }
        if(isset($_POST['Country'])) {
            $Country = $_POST['Country'];
            $stmt = $conn->prepare("UPDATE customers SET Country = ? WHERE `CustomerID` = ?");
            $stmt->bind_param("si", $Country, $userID);
            $stmt->execute();
        }

        echo "success";
        return;      
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

function getPaintingInfo($id,$conn) {
    if($id === null) return;
    $stmt = $conn->prepare("SELECT ImageFileName,Title,ROUND(MSRP,2) as MSRP FROM paintings WHERE PaintingID = ? AND Saled = 1");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        return $row;
    } else {
        return;
    }
}