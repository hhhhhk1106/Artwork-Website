<?php
header('content-type:text/html;charset=utf-8');

$servername = "localhost:3306";
$conn = new mysqli($servername, "root", "123456");
if ($conn->connect_error) {
    die("Conn failed: " . $conn->connect_error);
}
// echo "Conn established";
$conn->select_db("art");
 
//判断表单是否提交,用户名密码是否提交
if (isset($_POST['username'])&&isset($_POST['password'])){//登录表单已提交
    
    //获取用户输入的验证码
    // $captcha = isset($_POST['captcha']) ? trim($_POST['captcha']) : '';
    // //获取Session中的验证码
    // session_start();
    // if(empty($_SESSION['captcha'])){  //如果Session中不存在验证码，则退出
    //     exit('验证码已经过期，请返回并刷新页面重试。');
    // }
    //获取验证码并清除Session中的验证码
    // $true_captcha = $_SESSION['captcha'];
    // unset($_SESSION['captcha']); //限制验证码只能验证一次，防止重复利用
    // //忽略字符串的大小写，进行比较
    // if(strtolower($captcha) !== strtolower($true_captcha)){
    //     exit('您输入的验证码不正确！请返回并刷新页面重试。');
    // }
    //验证码验证通过，继续判断用户名和密码

    //获取用户输入的用户名密码
    // $username=$_POST["username"];
    // $password=$_POST["password"];

    // $sql = "SELECT * FROM user";
    // $result = $conn->query($sql);
    // $rows = $result->fetch_array();
    // if($rows) {
    //     //拿着提交过来的用户名和密码去数据库查找，看是否存在此用户名以及其密码
    //       if ($username == $rows["username"] && $password == $rows["password"]) {
    //         //echo "验证成功！<br>";
    //         session_start();
    //         $_SESSION['username']=$_POST['username'];
    //         echo "<script>alert('欢迎');location='../html/main.html'</script>";
    //       } else {
    //         //echo "用户名或者密码错误<br>";
    //         echo "<script>alert('账号不存在或密码错误，点击前往注册');location='../html/register.html'</script>";
    //         //echo "<a href='login.html'>返回</a>";
    //       }
    //   }

    // 设置参数值
    $username = $_POST['username'];
    $password = $_POST['password'];

    //TODO: salt

    // 创建预处理语句
    $stmt = $conn->prepare("SELECT * FROM user WHERE username = ? AND password = ?");
    // 绑定参数
    $stmt->bind_param("ss", $username, $password);
    // 执行查询
    $stmt->execute();
    // 处理结果
    $result = $stmt->get_result();

    // echo $username;
    // echo $password;

    if($result->num_rows === 1) {        
        session_start();
        $_SESSION['username'] = $_POST['username'];
        echo "<script>alert('欢迎');location='../html/main.html'</script>";
    } else {
        //echo "用户名或者密码错误<br>";
        echo "<script>alert('用户名或密码错误')</script>";
        //echo "<a href='login.html'>返回</a>";
    }
   
}
 
 
require '../html/login.html';