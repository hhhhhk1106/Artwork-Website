document.write('<script src="../js/box.js"></script>');
//TODO: document.write('<audio src="../music/宇多田ヒカル-One Last Kiss.mp3" id="music" autoplay="autoplay" controls="controls" preload="auto"></audio>');

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
        window.location.reload();
			}else{
			}
		},
  })
}

// var music = document.getElementById('music');
// music.click();

var search = document.getElementById('search');
search.onclick = function() {
  console.log("searchOK")
  $.ajax({
    method : 'get',
    url : "../php/search.php",
    dataType : "text",
    success : function(ret) {
        console.log(ret);
        var serachtext = document.getElementById('serachtext').value;

        window.location.href = "../html/search.html";
        if(serachtext) {
            window.location.href = "../html/search.html?keyword="+serachtext;
        }
        //window.location.href = '../html/search.html';
        // if(ret == "no") {
        //     //TOkDO:跳转
        //     window.location.href = "../html/error.html";
        // } else {
        //     //显示

        // }
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