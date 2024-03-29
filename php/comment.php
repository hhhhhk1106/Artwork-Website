<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");

if(isset($_GET['myAPI'])) {
    $myAPI = $_GET['myAPI'];
    // 加载评论
    if($myAPI == "load") {
        $id = $_GET['id'];
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

    if($myAPI == "getlike") {
        $CommentID = $_GET['CommentID'];
        $results = array();
        // $num = 0;
        $stmt = $conn->prepare("SELECT COUNT(*) FROM likes WHERE CommentID = ?");
        $stmt->bind_param("i", $CommentID);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $num = $result["COUNT(*)"];
        $results["num"] = $num;
        $liked = 0;

        if(isset($_GET['UserID'])) {
            $UserID = $_GET['UserID'];
            $stmt = $conn->prepare("SELECT * FROM likes WHERE CommentID = ? AND UserID = ?");
            $stmt->bind_param("ii", $CommentID, $UserID);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows == 0) {
                $liked = 0;
            } else {
                $liked = 1;
            }
        }
        $results["liked"] = $liked;

        echo json_encode($results);
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

    // 回复
    if($_POST["myAPI"] == "reply") {
        // echo $_POST["ReviewDate"];
        $ReplyCommentID = $_POST['ReplyCommentID'];
        $UserID = $_POST['UserID'];
        $ReviewDate = $_POST['ReviewDate'];
        $Comment = $_POST['Comment'];
        $Hierarchy = $_POST['Hierarchy'];

        $stmt = $conn->prepare("INSERT INTO comments (ReplyCommentID,UserID,ReviewDate,Comment,Hierarchy) VALUES (?,?,?,?,?)");
        $stmt->bind_param("iissi",$ReplyCommentID,$UserID,$ReviewDate,$Comment,$Hierarchy);
        if(isset($_POST['ReplyUserID'])) {
            $ReplyUserID = $_POST['ReplyUserID'];
            $stmt = $conn->prepare("INSERT INTO comments (ReplyCommentID,UserID,ReviewDate,Comment,Hierarchy,ReplyUserID) VALUES (?,?,?,?,?,?)");
            $stmt->bind_param("iissii",$ReplyCommentID,$UserID,$ReviewDate,$Comment,$Hierarchy,$ReplyUserID);
        }
        $stmt->execute();
        echo "success";
    }

    // 删除
    if($_POST["myAPI"] == "delete") {
        // echo $_POST["ReviewDate"];
        $UserID = $_POST['UserID'];
        $CommentID = $_POST['CommentID'];

        // $stmt2 = $conn->prepare("UPDATE shoppingcart SET `State` = 1 WHERE `id` = ?");
        $stmt = $conn->prepare("UPDATE comments SET `State` = 1 WHERE CommentID = ? AND UserID = ?");
        $stmt->bind_param("ii",$CommentID,$UserID);
        $stmt->execute();
        echo "success";
    }

    // 点赞
    if($_POST["myAPI"] == "like") {
        // echo $_POST["ReviewDate"];
        $CommentID = $_POST['CommentID'];
        $UserID = $_POST['UserID'];
        $stmt = $conn->prepare("SELECT * FROM likes WHERE CommentID = ? AND UserID = ?");
        $stmt->bind_param("ii", $CommentID, $UserID);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows == 0) {
            $stmt = $conn->prepare("INSERT INTO likes (CommentID,UserID) VALUES (?,?)");
            $stmt->bind_param("ii",$CommentID,$UserID);
            $stmt->execute();
        } else {
            $stmt = $conn->prepare("DELETE FROM likes WHERE CommentID = ? AND UserID = ?");
            $stmt->bind_param("ii",$CommentID,$UserID);
            $stmt->execute();
        }
        echo "success";
    }
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