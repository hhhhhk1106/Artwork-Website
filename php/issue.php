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

    echo json_encode($_POST);
    
    // if($code != $_SESSION['authcode']) {
    //     echo "<script>alert('验证码错误！重新填写');window.location.href='zhuce.html'</script>";
    //     //判断验证码是否填写正确
    // } else 

    // $stmt = $conn->prepare("SELECT * FROM customerlogon WHERE UserName = ?");
    // $stmt->bind_param("s", $username);
    // $stmt->execute();
    // $result = $stmt->get_result();

    // $sql= "INSERT INTO user (username, password, sex, salt) VALUES ('a','b', null,'')";
    // if ($conn->query($sql) === TRUE) {
    //     echo "New record created successfully";
    // } else {
    //     echo "Error: " . $sql . "<br>" . $conn->error;
    // }


    // if($result->num_rows === 1){
    //     // echo "<script>myAlert('','用户名已存在',function(){})</script>";
    //     echo "already";
    // } else {
    //     //echo $birthday;   //TODO: date-joined
    //     $sql= "INSERT INTO customerlogon (UserName, Pass, Salt, State)
    //     VALUES ('$username','$password','$salt', 1)";
    //     //插入数据库
    //     $result = $conn->query($sql);
    //     if($result === false){
    //         // echo "<script>alert('数据插入失败，请稍后再试')</script>";
    //         echo "fail";
    //     }
    //     $sql_id = "SELECT max(CustomerID) FROM customerlogon";
    //     $row = $conn->query($sql_id)->fetch_assoc();
    //     $id = $row["max(CustomerID)"];
    //     //echo $id;
    //     //var_dump($id);
    //     $sql= "INSERT INTO customers (CustomerID, Address, Country, Phone, Email, Sex, Birthday)
    //     VALUES ('$id','$address','$nationality','$phone','$email','$sex','$birthday')";
    //     $sql2= "INSERT INTO account (UserID) VALUES ('$id')";
    //     if($conn->query($sql) === false || $conn->query($sql2) === false){
    //         // echo "<script>alert('数据插入失败，请稍后再试')</script>";
    //         echo "fail";
    //     }else{
    //         // echo "<script>alert('注册成功！');location='../html/login.html'</script>";
    //         echo "success";
    //     }
    // }

}