<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");

if (isset($_POST['IssueUserID'])){
    $Title = $_POST['Title'];
    $LastName = $_POST['LastName'];
    $YearOfWork = $_POST['YearOfWork'];
    $GenreID = $_POST['GenreID'];
    $Width = $_POST['Width'];
    $Height = $_POST['Height'];
    $MSRP = $_POST['MSRP'];
    $Description = $_POST['Description'];
    $ImageFileName = $_POST['ImageFileName'];
    $IssueUserID = $_POST['IssueUserID'];

    //echo json_encode($_POST);
    
    //$ArtistID = insertArtist($LastName,$conn);
    $stmt = $conn->prepare("INSERT INTO artists (LastName) VALUES (?)");
    $stmt->bind_param("s", $LastName);
    $stmt->execute();
    // $result = $stmt->get_result();

    $sql_id = "SELECT max(ArtistID) FROM artists";
    $row = $conn->query($sql_id)->fetch_assoc();
    $ArtistID = $row["max(ArtistID)"];

    $stmt = $conn->prepare("INSERT INTO paintings (ArtistID,ImageFileName,Title,YearOfWork,Width,Height,MSRP,`Description`,IssueUserID) 
    VALUES (?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("issiiidsi",$ArtistID,$ImageFileName,$Title,$YearOfWork,$Width,$Height,$MSRP,$Description,$IssueUserID);
    $stmt->execute();
    // $result = $stmt->get_result();
    // if($result === false){
    //     echo "fail";
    //     return;
    // }

    // $sql= "INSERT INTO paintings (ArtistID,ImageFileName,Title,YearOfWork,Width,Height,MSRP,`Description`,IssueUserID)
    //     VALUES ('$ArtistID','$ImageFileName','$Title','$YearOfWork','$Width','$Height','$MSRP','$Description','$IssueUserID')";
    // if($conn->query($sql) === false || $conn->query($sql2) === false){
    //     // echo "<script>alert('数据插入失败，请稍后再试')</script>";
    //     echo "fail";
    // }

    $sql_id = "SELECT max(PaintingID) FROM paintings";
    $row = $conn->query($sql_id)->fetch_assoc();
    $PaintingID = $row["max(PaintingID)"];

    //TOkDO:genre
    $stmt = $conn->prepare("INSERT INTO paintinggenres (PaintingID,GenreID) VALUES (?,?)");
    $stmt->bind_param("ii", $PaintingID,$GenreID);
    $stmt->execute();
    echo "success";
}

function insertArtist($LastName,$conn) {
    $stmt = $conn->prepare("INSERT INTO artists (LastName) VALUES (?)");
    $stmt->bind_param("s", $LastName);
    $stmt->execute();
    $result = $stmt->get_result();
    if($result === false){
        // echo "<script>alert('数据插入失败，请稍后再试')</script>";
        return null;
    }
    $sql_id = "SELECT max(ArtistID) FROM artists";
    $row = $conn->query($sql_id)->fetch_assoc();
    return $row["max(ArtistID)"];
}
