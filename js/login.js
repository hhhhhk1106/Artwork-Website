// var registrationForm = document.querySelector('form');
// registrationForm.addEventListener('submit', function(event) {
//     // prevent the default form submission behavior
//     event.preventDefault();
//     ulogin();
  
//     // if all input fields are valid, redirect to the login page
//     //window.location.href = 'login.html';
// 	console.log("bb");
//     this.submit();
//   });

// function ulogin(){//TOxDO:
//     console.log("aa");
// 	//获取用户名和密码,登录成功以后，把用户名存储在session里面，然后显示在首页里面
// 	var username=$("#username").val();
// 	var password=$("#password").val();
// 	var captcha=$("#captcha").val();
// 	$.ajax({
// 		method : 'post',
// 		url : "../php/login.php",
// 		dataType : "text",
// 		data : {
// 			username : username,
// 			password : password,
// 			captcha : captcha
// 		},
// 		success : function(ret) {
// 			console.log("-here");
// 			//提示注册成功
// 			if(ret=="success"){
// 				//关闭模态框
// 				 //$("#close_lo").click(); 
// 				 //把用户名密码存储在session里面，首页显示用户名称
// 				//  localStorage.setItem("username",username);	
// 				//  load_data();
// 				sessionStorage.setItem()
// 				console.log("success");
// 			}else{
// 				// alert("用户名或者密码输入错误，请重新输入");
// 				// $("#password").val('');
// 				console.log("x");
// 			}
			
			 
// 		},
// 	})	
// }