<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");

$id = $_GET['id'];
// echo $id;

$stmt = $conn->prepare("SELECT * FROM paintings WHERE PaintingID = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    // TOkDO: id获取name等
    $row["ArtistName"] = getArtist($row["ArtistID"],$conn);
    $row["UserName"] = getIssueUser($row["IssueUserID"],$conn);
    $ge = getGenreNEra($id,$conn);
    $row["GenreName"] = $ge["GenreName"];
    $row["EraName"] = $ge["EraName"];
    $row["ShapeName"] = getShape($row["ShapeID"],$conn);
    $row["SubjectName"] = getSubject($id,$conn);

    echo json_encode($row);
} else {
    echo "no";
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

function getShape($id,$conn) {
    if($id === null) return;
    $sql = "SELECT ShapeName FROM shapes WHERE ShapeID = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row["ShapeName"];
    }
    return null;
}

function getIssueUser($id,$conn) {
    if($id === null) return;
    $sql = "SELECT UserName FROM customerlogon WHERE CustomerID = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row["UserName"];
    }
    return null;
}

function getGenreNEra($id,$conn) {
    //id为paintingID
    if($id === null) return;
    $sql = "SELECT GenreID FROM paintinggenres WHERE PaintingID = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $GenreID = $row["GenreID"];
        $sql = "SELECT GenreName,EraID FROM genres WHERE GenreID = $GenreID";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $ans["GenreName"] = $row["GenreName"];
        $EraID = $row["EraID"];
        $sql = "SELECT EraName FROM eras WHERE EraID = $EraID";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $ans["EraName"] = $row["EraName"];
        return $ans;
    }
    return null;
}

function getSubject($id,$conn) {
    //id为paintingID
    if($id === null) return;
    $sql = "SELECT SubjectID FROM paintingsubjects WHERE PaintingID = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $SubjectID = $row["SubjectID"];
        $sql = "SELECT SubjectName FROM subjects WHERE SubjectID = $SubjectID";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        return $row["SubjectName"];;
    }
    return null;
}
