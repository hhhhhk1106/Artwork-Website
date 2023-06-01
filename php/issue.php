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

if (isset($_POST['PaintingID'])){
    $PaintingID = $_POST['PaintingID'];

    if (isset($_POST['myAPI'])){
        $PaintingID = $_POST['PaintingID'];
        $myAPI = $_POST['myAPI'];
    
        if($myAPI == "update") {
            $Title = $_POST['Title'];
            $LastName = $_POST['LastName'];
            $YearOfWork = $_POST['YearOfWork'];
            $GenreID = $_POST['GenreID'];
            $Width = $_POST['Width'];
            $Height = $_POST['Height'];
            $MSRP = $_POST['MSRP'];
            $Description = $_POST['Description'];
            //$ImageFileName = $_POST['ImageFileName'];

            // echo "UPDATEOK";
            // TOkDO: 修改
            // 作者，流派，其他
            $sql_id = "SELECT ArtistID FROM paintings WHERE `PaintingID` = $PaintingID";
            $row = $conn->query($sql_id)->fetch_assoc();
            $ArtistID = $row["ArtistID"];
            $stmt = $conn->prepare("UPDATE artists SET LastName = ? WHERE `ArtistID` = ?");
            $stmt->bind_param("si", $LastName, $ArtistID);
            $stmt->execute();

            $stmt = $conn->prepare("UPDATE paintinggenres SET GenreID = ? WHERE `PaintingID` = ?");
            $stmt->bind_param("si", $GenreID, $PaintingID);
            $stmt->execute();

            $stmt = $conn->prepare("UPDATE paintings SET Title=?,YearOfWork=?,Width=?,Height=?,MSRP=?,`Description`=? WHERE `PaintingID` = ?");
            $stmt->bind_param("siiidsi", $Title,$YearOfWork,$Width,$Height,$MSRP,$Description,$PaintingID);
            $stmt->execute();

            if(isset($_POST['ImageFileName'])) {
                $ImageFileName = $_POST['ImageFileName'];
                $stmt = $conn->prepare("UPDATE paintings SET ImageFileName = ? WHERE `PaintingID` = ?");
                $stmt->bind_param("si", $ImageFileName, $PaintingID);
                $stmt->execute();
            }
            //echo "eaaaaaaaaaaaaaa";
        }
        echo "success";
        return;
    }

    $UserID = $_POST['UserID'];
    $sql_id = "SELECT IssueUserID FROM paintings WHERE PaintingID = $PaintingID";
    $row = $conn->query($sql_id)->fetch_assoc();
    $IssueUserID = $row["IssueUserID"];
    //echo $IssueUserID;

    if($IssueUserID === $UserID) {
        echo "yes";
    } else {
        echo "no";
    }
    //echo $IssueUserID;
}

if (isset($_GET['myAPI'])){
    $PaintingID = $_GET['PaintingID'];
    $myAPI = $_GET['myAPI'];

    if($myAPI == "update") {
        // echo "UPDATEOK";
        // TOkDO: 获取painting信息，补充作者名，补充流派，补充图片？
        $stmt = $conn->prepare("SELECT * FROM paintings WHERE PaintingID = ?");
        $stmt->bind_param("i", $PaintingID);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            // TOkDO: id获取name等
            $row["ArtistName"] = getArtist($row["ArtistID"],$conn);
            $ge = getGenre($PaintingID,$conn);
            $row["GenreName"] = $ge["GenreName"];        
            echo json_encode($row);
        }
    }
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


function getGenre($id,$conn) {
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