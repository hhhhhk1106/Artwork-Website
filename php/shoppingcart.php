<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");

if(isset($_POST["UserID"])&&isset($_POST["PaintingID"])&&isset($_POST["myAPI"])) {
    $UserID = $_POST["UserID"];
    $PaintingID = $_POST["PaintingID"];
    $myAPI = $_POST["myAPI"];

    // 添加
    if($myAPI == "add") {
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

    // 删除
    if($myAPI == "delete") {
        // $stmt = $conn->prepare("SELECT * FROM shoppingcart WHERE UserID = ? AND PaintingID = ?");
        // $stmt->bind_param("ii", $UserID, $PaintingID);
        // $stmt->execute();
        // $result = $stmt->get_result();

        $stmt = $conn->prepare("DELETE FROM shoppingcart WHERE UserID = ? AND PaintingID = ?");
        $stmt->bind_param("ii", $UserID, $PaintingID);
        $stmt->execute();
        $result = $stmt->get_result();
        // echo $result;

        // if($result->num_rows > 0) {
        //     echo "already";
        // } else {
        //     // 无该条购物车记录
        //     // echo "success";
        // }
    }
}

// TOkDO: 展示购物车
if(isset($_GET["UserID"])&&isset($_GET["myAPI"])) {
    $UserID = $_GET["UserID"];
    $myAPI = $_GET["myAPI"];
    if($myAPI == "show") {
        // echo "SHOW";
        $stmt = $conn->prepare("SELECT * FROM shoppingcart WHERE UserID = ?");
        $stmt->bind_param("i", $UserID);
        $stmt->execute();
        $result = $stmt->get_result();
        $list = array();
        if($result->num_rows > 0) {
            while ($row = $result->fetch_array()) {
                // 添加缩略图 名称 价格
                $info = getPaintingInfo($row["PaintingID"],$conn);
                if($info) {
                    //$row["ImageLink"] = $info["ImageLink"];
                    $row["ImageFileName"] = $info["ImageFileName"];
                    $row["Title"] = $info["Title"];
                    $row["MSRP"] = $info["MSRP"];
                    $list[] = $row;
                }
            }
            echo json_encode($list);
        } else {
            // 该用户未添加过购物车
            echo "no";
        }
    }
}

// TODO: 删除购物车


function getPaintingInfo($id,$conn) {
    if($id === null) return;
    $stmt = $conn->prepare("SELECT ImageFileName,Title,ROUND(MSRP,2) as MSRP FROM paintings WHERE PaintingID = ?");
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