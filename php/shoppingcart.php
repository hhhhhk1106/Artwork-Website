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

if(isset($_POST["UserID"])&&isset($_POST["myAPI"])) {
    $UserID = $_POST["UserID"];
    $myAPI = $_POST["myAPI"];

    // 支付
    if($myAPI == "pay") {
        // TODO: 之后发布写完：查询到的painting有发布者，则增加对方账户余额
        $total = $_POST["Total"];
        // 查询余额
        $sql = "SELECT * FROM account WHERE UserID = $UserID";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if($total > $row["Balance"]) {
                // 余额不足
                echo "notEnough";
            } else {
                // 扣款、设置购物车state和艺术品saled
                $balance = $row["Balance"] - $total;
                $stmt = $conn->prepare("UPDATE account SET `Balance` = ? WHERE `id` = ?");
                $stmt->bind_param("ii", $balance, $row["id"]);
                $stmt->execute();

                $stmt1 = $conn->prepare("SELECT * FROM shoppingcart,paintings WHERE shoppingcart.UserID = ? AND shoppingcart.`State` = 0 AND shoppingcart.`PaintingID` = paintings.`PaintingID` AND paintings.`Saled` = 0");
                $stmt1->bind_param("i", $UserID);
                $stmt1->execute();
                $result1 = $stmt1->get_result();
                // echo json_encode($result1);
                $list = array();
                if($result1->num_rows > 0) {
                    // 设置购物车
                    while ($row1 = $result1->fetch_array()) {
                        //$list[] = $row["PaintingID"];
                        // echo $row1["PaintingID"];
                        $stmt2 = $conn->prepare("UPDATE shoppingcart SET `State` = 1 WHERE `id` = ?");
                        $stmt2->bind_param("i", $row1["id"]);
                        $stmt2->execute();

                        $stmt3 = $conn->prepare("UPDATE paintings SET Saled = 1 WHERE PaintingID = ?");
                        $stmt3->bind_param("i", $row1["PaintingID"]);
                        $stmt3->execute();

                        $stmt = $conn->prepare("SELECT IssueUserID,MSRP FROM paintings WHERE PaintingID = ?");
                        $stmt->bind_param("i", $row1["PaintingID"]);
                        $stmt->execute();
                        $result = $stmt->get_result();

                        if($result->num_rows === 1) {
                            $row = $result->fetch_assoc();
                            $IssueUserID = $row["IssueUserID"];
                            $MSRP = $row["MSRP"];
                            if($IssueUserID != null) {
                                $stmt = $conn->prepare("SELECT Balance FROM account WHERE UserID = ?");
                                $stmt->bind_param("i", $IssueUserID);
                                $stmt->execute();
                                $result = $stmt->get_result();
                                $row2 = $result->fetch_assoc();
                                $Balance1 = $row2["Balance"];
                                $Balance1 += $MSRP;

                                $stmt = $conn->prepare("UPDATE account SET Balance = ? WHERE UserID = ?");
                                $stmt->bind_param("di", $Balance1, $IssueUserID);
                                $stmt->execute();
                            }
                        }
                    }
                    // foreach($list as $key => $value) {
                    //     $stmt3 = $conn->prepare("UPDATE paintings SET Saled = 1 WHERE PaintingID = ?");
                    //     $stmt3->bind_param("i", $value);
                    //     $stmt3->execute();
                    // }
                }

                echo "success";
            }
        } else {
            echo "no";
        }

    }
}

// TOkDO: 展示购物车
if(isset($_GET["UserID"])&&isset($_GET["myAPI"])) {
    $UserID = $_GET["UserID"];
    $myAPI = $_GET["myAPI"];
    if($myAPI == "show") {
        // echo "SHOW";
        // 展示未购买商品
        $stmt = $conn->prepare("SELECT * FROM shoppingcart WHERE UserID = ? AND `State` = 0");
        $stmt->bind_param("i", $UserID);
        $stmt->execute();
        $result = $stmt->get_result();
        $list = array();
        if($result->num_rows > 0) {
            while ($row = $result->fetch_array()) {
                // 添加缩略图 名称 价格
                $info = getUnsaledPaintingInfo($row["PaintingID"],$conn);
                if($info) {
                    //$row["ImageLink"] = $info["ImageLink"];
                    $row["ImageFileName"] = $info["ImageFileName"];
                    $row["Title"] = $info["Title"];
                    $row["MSRP"] = $info["MSRP"];
                    $list[] = $row;
                }
                $info = getSaledPaintingInfo($row["PaintingID"],$conn);
                if($info) {
                    //$row["ImageLink"] = $info["ImageLink"];
                    $row["ImageFileName"] = $info["ImageFileName"];
                    $row["Title"] = $info["Title"];
                    $row["MSRP"] = "已售出";
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

// TOkDO: 删除购物车

function getSaledPaintingInfo($id,$conn) {
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

function getUnsaledPaintingInfo($id,$conn) {
    if($id === null) return;
    $stmt = $conn->prepare("SELECT ImageFileName,Title,ROUND(MSRP,2) as MSRP FROM paintings WHERE PaintingID = ? AND Saled = 0");
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