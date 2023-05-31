<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");

if(isset($_GET["myAPI"])) {
    // 新发布
    if($_GET["myAPI"] == "newIssue") {
        $stmt = $conn->prepare("SELECT * FROM paintings WHERE IssueUserID > 0 ORDER BY PaintingID DESC LIMIT 0,5");
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $row["ArtistName"] = getArtist($row["ArtistID"],$conn);
                $results[] = $row;
            }
            // $list["results"] = $results;
            echo json_encode(($results));
            //echo "here";
        } else {
            echo "no";
        }
    }

    // 猜你喜欢
    if($_GET["myAPI"] == "popular") {
        $stmt = $conn->prepare("SELECT * FROM paintings WHERE Visit > 200 order by RAND() LIMIT 0,10");
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $row["ArtistName"] = getArtist($row["ArtistID"],$conn);
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

function getArtist($id,$conn) {
    if($id === null) return;
    $sql = "SELECT FirstName,LastName FROM artists WHERE ArtistID = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if($row["FirstName"]) {
            return $row["FirstName"]." ".$row["LastName"];
        } else {
            return $row["LastName"];
        }
        
    }
    return null;
}