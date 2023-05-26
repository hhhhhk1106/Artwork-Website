var registrationForm = document.querySelector('form');
var usernameField = document.querySelector('#username');
var passwordField = document.querySelector('#password');
var captchaField = document.querySelector('#captcha');



registrationForm.addEventListener('submit', function(event) {
    // prevent the default form submission behavior
    event.preventDefault();
    ulogin();
  
    // if all input fields are valid, redirect to the login page
    //window.location.href = 'login.html';
	console.log("bb");
    // this.submit();
  });

function ulogin(){
	$.ajax({
		method : 'post',
		url : "../php/login.php",
		dataType : "text",
		data : {
			username : usernameField.value,
			password : passwordField.value,
			captcha : captchaField.value,
		},
		success : function(ret) {
			console.log(ret);
			//提示注册成功
			if(ret == "no"){
				// 用户名不存在
				myAlert('','用户名不存在',function(){});
			} else if(ret == "wrong") {
				// 密码错误
				myAlert('','密码错误',function(){});
				console.log("x");
			} else if(ret == "captchaExpired") {
				myAlert('','验证码已经过期，<br>请刷新页面重试。',function(){});
			} else if(ret == "captchaWrong") {
				myAlert('','您输入的验证码不正确！<br>请刷新页面重试。',function(){});
			} else {
				var obj = JSON.parse(ret);
                console.log(obj);
				// 成功，set session，跳转
				sessionStorage.setItem("username",obj.username);
				sessionStorage.setItem("userID",obj.userID);
				window.location.href = "../html/main.html";
			}
			
			 
		},
	})	
}