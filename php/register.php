<?php
header("Content-type:text/html;charset=utf-8");
$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
$conn->select_db("art");

if (isset($_POST['username'])&&isset($_POST['password'])){

    //获取用户输入的验证码
    $captcha = isset($_POST['captcha']) ? trim($_POST['captcha']) : '';
    //获取Session中的验证码
    session_start();
    if(empty($_SESSION['captcha'])){  //如果Session中不存在验证码，则退出
        exit('验证码已经过期，请返回并刷新页面重试。');
    }
    //获取验证码并清除Session中的验证码
    $true_captcha = $_SESSION['captcha'];
    unset($_SESSION['captcha']); //限制验证码只能验证一次，防止重复利用
    //忽略字符串的大小写，进行比较
    if(strtolower($captcha) !== strtolower($true_captcha)){
        exit('您输入的验证码不正确！请返回并刷新页面重试。');
    }
    //验证码验证通过，继续判断用户名和密码

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

    $stmt = $conn->prepare("SELECT * FROM customerlogon WHERE UserName = ?");
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
    $salt = getRandomString();
    $password = hash("sha256", $password . $salt);

    if($result->num_rows === 1){
        echo "<script>alert('用户名已存在')</script>";
    } else {
        //echo $birthday;   //TODO: date-joined
        $sql= "INSERT INTO customerlogon (UserName, Pass, Salt, State)
        VALUES ('$username','$password','$salt', 1)";
        //插入数据库
        $result = $conn->query($sql);
        if($result === false){
            echo "<script>alert('数据插入失败，请稍后再试')</script>";
        }
        $sql_id = "SELECT max(CustomerID) FROM customerlogon";
        $row = $conn->query($sql_id)->fetch_assoc();
        $id = $row["max(CustomerID)"];
        //echo $id;
        var_dump($id);
        $sql= "INSERT INTO customers (CustomerID, Address, Country, Phone, Email, Sex)
        VALUES ('$id','$address','$nationality','$phone','$email','$sex')";
        if($conn->query($sql) === false){
            echo "<script>alert('数据插入失败，请稍后再试')</script>";
        }else{
            echo "<script>alert('注册成功！');location='../html/login.html'</script>";
        }
    }

}

function getRandomString($length = 20) {
    if (function_exists('openssl_random_pseudo_bytes')) {
        $bytes = openssl_random_pseudo_bytes($length * 2);
        if ($bytes === false) {
            throw new RuntimeException('Unable to generate a random string');
        }
        return substr(str_replace(['/', '+', '='], '', base64_encode($bytes)), 0, $length);
    }
    $pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return substr(str_shuffle(str_repeat($pool, 5)), 0, $length);
}

require '../html/register.html';