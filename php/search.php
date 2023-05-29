<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");

$myAPI = $_GET['myAPI'];
$page = $_GET['page'];
$limit = $_GET['limit'];
// 计算分页的起始偏移量
$offset = ($page - 1) * $limit;

if($myAPI == "all") {
    $list = array();
    $results = array();
    $sql = "SELECT COUNT(PaintingID) FROM paintings";
    $result = $conn->query($sql);
    // $list["total"] = $result->fetch_assoc()["COUNT(PaintingID)"];
    $list["now"] = $page;

    $sql = "SELECT * FROM paintings";
    if(isset($_GET['keyword'])&&$_GET['keyword']!='') {
        $list["keyword"] = $_GET['keyword'];
        $keyword = $_GET['keyword'];
        $type = "title";
        if(isset($_GET['type'])&&$_GET['type']=="artist") {
            $type = $_GET['type'];
        }
        $list["type"] = $type;
        // WHERE title LIKE '%$keyword%'
        if($type == "title") { //价格从低到高
            $sql = $sql." WHERE Title LIKE '%$keyword%'";
        } else if($type == "artist") {
            $sql = "SELECT * FROM paintings,artists WHERE paintings.ArtistID = artists.ArtistID AND (artists.FirstName LIKE '%$keyword%' OR artists.LastName LIKE '%$keyword%')";
        }
    }
    if(isset($_GET['order'])) {
        $list["order"] = $_GET['order'];
        $order = $_GET['order'];
        if($order == "price") { //价格从低到高
            $sql = $sql." ORDER BY MSRP";
        } else if($order == "price-desc") {
            $sql = $sql." ORDER BY MSRP DESC";
        } else if($order == "year") {
            $sql = $sql." ORDER BY YearOfWork";
        } else if($order == "year-desc") {
            $sql = $sql." ORDER BY YearOfWork DESC";
        } else if($order == "visit") {
            $sql = $sql." ORDER BY Visit";
        } else if($order == "visit-desc") {
            $sql = $sql." ORDER BY Visit DESC";
        } else if($order == "size") {
            $sql = $sql." ORDER BY Width*Height";
        } else if($order == "size-desc") {
            $sql = $sql." ORDER BY Width*Height DESC";
        }
    }
    $result = $conn->query($sql);
    $sql_total = "SELECT FOUND_ROWS()";
    $result_total = $conn->query($sql_total);
    $list["total"] = $result_total->fetch_assoc()["FOUND_ROWS()"];
    $sql = $sql . " LIMIT $offset, $limit";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            //$info = getPaintingInfo($row["PaintingID"],$conn);
            $row["ArtistName"] = getArtist($row["ArtistID"],$conn);
            $results[] = $row;
        }
        $list["results"] = $results;
        echo json_encode(($list));
        //echo "here";
    } else {
        echo "0";
    }
}

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