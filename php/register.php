<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");

if (isset($_POST['username'])&&isset($_POST['password'])){

    $username = $_POST['username'];
    $password = $_POST['password'];
    $email = isset($_POST['email'])?$_POST['email']:NULL;
    // $code = $_POST['code'];
    $phone = isset($_POST['phone'])?$_POST['phone']:NULL;
    $address = isset($_POST['address'])?$_POST['address']:NULL;
    $birthday = isset($_POST['birthday'])?$_POST['birthday']:NULL;
    $sex = isset($_POST['sex'])?$_POST['sex']:NULL;
    $nationality = isset($_POST['nationality'])?$_POST['nationality']:NULL;
    
    // if($code != $_SESSION['authcode']) {
    //     echo "<script>alert('验证码错误！重新填写');window.location.href='zhuce.html'</script>";
    //     //判断验证码是否填写正确
    // } else 

    $stmt = $conn->prepare("SELECT * FROM user WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    // $sql= "INSERT INTO user (username, password, sex, salt) VALUES ('a','b', null,'')";
    // if ($conn->query($sql) === TRUE) {
    //     echo "New record created successfully";
    // } else {
    //     echo "Error: " . $sql . "<br>" . $conn->error;
    // }
    //TODO: 加盐
    $salt = 0;

    if($result->num_rows === 1){
        echo "<script>alert('用户名已存在')</script>";
    } else {
        echo $birthday;
        $sql= "INSERT INTO user (username, password, salt, email, phone, address, sex, nationality)
        VALUES ('$username','$password','$salt','$email','$phone','$address','$sex','$nationality')";
        //插入数据库
        if($conn->query($sql) === false){
            echo "<script>alert('数据插入失败，请稍后再试')</script>";
        }else{
            echo "<script>alert('注册成功！');location='../html/login.html'</script>";
        }
    }

}

require '../html/register.html';