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
    $captcha = isset($_POST['captcha']) ? trim($_POST['captcha']) : '';
    //获取Session中的验证码
    session_start();
    if(empty($_SESSION['captcha'])){  //如果Session中不存在验证码，则退出
        echo 'captchaExpired';
        return;
        // exit('验证码已经过期，请返回并刷新页面重试。');
    }
    //获取验证码并清除Session中的验证码
    $true_captcha = $_SESSION['captcha'];
    unset($_SESSION['captcha']); //限制验证码只能验证一次，防止重复利用
    //忽略字符串的大小写，进行比较
    if(strtolower($captcha) !== strtolower($true_captcha)){
        echo 'captchaWrong';
        return;
        // exit('您输入的验证码不正确！请返回并刷新页面重试。');
    }
    //验证码验证通过，继续判断用户名和密码

    // 设置参数值
    $username = $_POST['username'];
    $password = $_POST['password'];

    // 创建预处理语句
    $stmt = $conn->prepare("SELECT * FROM customerlogon WHERE UserName = ?");
    // 绑定参数
    $stmt->bind_param("s", $username);
    // 执行查询
    $stmt->execute();
    // 处理结果
    $result = $stmt->get_result();

    // echo $username;
    // echo $password;

    if($result->num_rows === 1) {     
        //var_dump($result->fetch_assoc());
        $row = $result->fetch_assoc();
        $salt = $row['Salt'];
        $password = hash("sha256", $password . $salt);
        if($password === $row['Pass']) {
            //session_start();
            $ret = array();
            $ret['username'] = $_POST['username'];
            $userID = $row['CustomerID'];
            $ret['userID'] = $userID;
            // 设置js中的session
            // echo "<script>sessionStorage.setItem('username','$username')</script>";
            // echo "<script>sessionStorage.setItem('userID','$userID')</script>";
            echo json_encode($ret);
            // echo "<script>console.log(sessionStorage.getItem('userID'))</script>";
            // echo "<script>alert('欢迎');location='../html/main.html'</script>";
        } else {
            // echo "<script>alert('密码错误')</script>";
            echo "wrong";
        }
        
    } else {
        //echo "用户名或者密码错误<br>";
        // echo "<script>alert('用户名不存在')</script>";
        echo "no";
    }
   
}
 
 
// require '../html/login.html';