// var div = document.querySelector('div');
// var a =location.search.substr(1);
// var arr = a.split('=');
// div.innerHTML = '欢迎您'+arr[1];

var username = sessionStorage.getItem("username");
var userID = sessionStorage.getItem("userID");
console.log("username");
console.log(username);

changeLoginCSS(username);

var logout = document.getElementById('logout');
logout.onclick = function() {
  //console.log("exit!");
  sessionStorage.clear();   //清除所有session值
  //window.location.reload();
  $.ajax({
		method : 'post',
		url : "../php/logout.php",
		success : function(ret) {
			if(ret=="success"){
				console.log("success");
			}else{
			}
		},
  })
}

function changeLoginCSS(username) {
  var nav_in = document.getElementById('logged-in');
  var nav_out = document.getElementById('logged-out');
  if(username === null) {
    //未登录
    nav_in.style.display = 'none';
    nav_out.style.display = 'block';
  } else {
    //已登录
    nav_in.style.display = 'block';
    nav_out.style.display = 'none';
  }
}