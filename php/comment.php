<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");

if(isset($_GET['id'])) {
    $id = $_GET['id'];
    $myAPI = $_GET['myAPI'];
    // 加载评论
    if($myAPI == "load") {
        $results = array();
        $stmt = $conn->prepare("SELECT * FROM comments WHERE PaintingID = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                //$info = getPaintingInfo($row["PaintingID"],$conn);
                $row["UserName"] = getUserName($row["UserID"],$conn);
                $row["Replies"] = getReplies($row["CommentID"],$conn);
                $results[] = $row;
            }
            // $list["results"] = $results;
            echo json_encode(($results));
            //echo "here";
        } else {
            echo "no";
        }
    }

}

if(isset($_POST["myAPI"])) {
    // 发布评论
    if($_POST["myAPI"] == "comment") {
        // echo $_POST["ReviewDate"];
        $PaintingID = $_POST['PaintingID'];
        $UserID = $_POST['UserID'];
        $ReviewDate = $_POST['ReviewDate'];
        $Comment = $_POST['Comment'];
        $Hierarchy = $_POST['Hierarchy'];

        $stmt = $conn->prepare("INSERT INTO comments (PaintingID,UserID,ReviewDate,Comment,Hierarchy) VALUES (?,?,?,?,?)");
        $stmt->bind_param("iissi",$PaintingID,$UserID,$ReviewDate,$Comment,$Hierarchy);
        $stmt->execute();
        echo "success";
    }

    // $results = array();
    // $stmt = $conn->prepare("SELECT * FROM comments WHERE PaintingID = ?");
    // $stmt->bind_param("i", $id);
    // $stmt->execute();
    // $result = $stmt->get_result();

    // if ($result->num_rows > 0) {
    //     while ($row = $result->fetch_assoc()) {
    //         //$info = getPaintingInfo($row["PaintingID"],$conn);
    //         $row["UserName"] = getUserName($row["UserID"],$conn);
    //         $row["Replies"] = getReplies($row["CommentID"],$conn);
    //         $results[] = $row;
    //     }
    //     // $list["results"] = $results;
    //     echo json_encode(($results));
    //     //echo "here";
    // } else {
    //     echo "no";
    // }
}

// 获取二级评论
function getReplies($CommentID,$conn) {
    $results = array();
    $stmt = $conn->prepare("SELECT * FROM comments WHERE ReplyCommentID = ?");
    $stmt->bind_param("i", $CommentID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            //$info = getPaintingInfo($row["PaintingID"],$conn);
            $row["UserName"] = getUserName($row["UserID"],$conn);
            if($row["ReplyUserID"]) {
                $row["ReplyUserName"] = getUserName($row["ReplyUserID"],$conn);
            }
            $results[] = $row;
        }
        // $list["results"] = $results;
        return $results;
        //echo "here";
    } else {
        return null;
    }
}

function getUserName($id,$conn) {
    if($id === null) return;
    $sql = "SELECT UserName FROM customerlogon WHERE CustomerID = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row["UserName"];
    }
    return null;
}