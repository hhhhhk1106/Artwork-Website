// select the registration form and its input fields
var registrationForm = document.querySelector('form');
var usernameField = document.querySelector('#username');
var emailField = document.querySelector('#email');
var passwordField = document.querySelector('#password');
var confirmPasswordField = document.querySelector('#confirm-password');
var phoneField = document.querySelector('#phone');
var captchaField = document.querySelector('#captcha');
var addressField = document.querySelector('#address');
var birthdayField = document.querySelector('#birthday');
var nationalityField = document.querySelector('#nationality');
var sexField = document.querySelector('#sex');

var username = document.getElementById('username');
username.oninput = function(){
  var usernameError = document.getElementById('usernameError');
  if (usernameField.value.length == 0) {
    usernameError.textContent = "请输入用户名";
    usernameError.style.display = 'block';
  } else if(!isValidUsername(usernameField.value)) {
    usernameError.textContent = "用户名不合法,只能包含字母数字下划线";
    usernameError.style.display = 'block';
  } else {
    usernameError.style.display = 'none';
  }
}

var password = document.getElementById('password');
password.oninput = function(){
  var passwordError = document.getElementById('passwordError');
  if (passwordField.value.length == 0) {
    passwordError.textContent = "请输入密码";
    passwordError.style.display = 'block';
  } else if(passwordField.value.length < 8) {
    passwordError.textContent = "密码至少8位";
    passwordError.style.display = 'block';
  } else if(passwordField.value.length > 30) {
    passwordError.textContent = "密码不应超过30位";
    passwordError.style.display = 'block';
  } else if(!isValidPassword(passwordField.value)) {
    passwordError.textContent = "密码中含有非法字符 * ~ ` # $ % & \\ \' \" ; ? 空格";
    passwordError.style.display = 'block';
  } else {
    passwordError.style.display = 'none';
    var level = passwordStrengthLevel(passwordField.value);
    if(level == 1) {
      passwordError.textContent = "密码强度低，可使用字母数字下划线组合";
      passwordError.style.display = 'block';
    }
    changeStrengthCSS(level);
  }
  //TOkDO: 密码强弱提示
}

var password_conf = document.getElementById('confirm-password');
password_conf.onblur = function(){
  var confirmPasswordError = document.getElementById('confirm-passwordError');
  if (!isValidConfirmPassword(passwordField.value, confirmPasswordField.value)) {
    confirmPasswordError.textContent = "两次输入的密码不匹配";
    confirmPasswordError.style.display = 'block';
  } else {
    confirmPasswordError.style.display = 'none';
  }
}

var email = document.getElementById('email');
email.oninput = function(){
  var emailError = document.getElementById('emailError');
  if (emailField.value.length == 0) {
    emailError.style.display = 'none';
  } else if (!isValidEmail(emailField.value)) {
    emailError.textContent = "请输入合法的邮箱";
    emailError.style.display = 'block';
  } else {
    emailError.style.display = 'none';
  }
}

var phone = document.getElementById('phone');
phone.oninput = function(){
  var phoneError = document.getElementById('phoneError');
  if (phoneField.value.length == 0) {
    phoneError.style.display = 'none';
  } else if (!isValidPhone(phoneField.value)) {
    phoneError.textContent = "请输入合法的手机号";
    phoneError.style.display = 'block';
  } else {
    phoneError.style.display = 'none';
  }
}

// displayAlert('success','注册成功！',1500);
// myAlert('','请输入合法的用户名！',null);
// myConfirm('','请输入合法的用户名！',null);
// 提交时验证：alert
var issubmit = true;
registrationForm.addEventListener('submit', function(event) {
  // prevent the default form submission behavior
  event.preventDefault();

  if(issubmit) {
    issubmit = false;
    setTimeout(function() {
      issubmit = true;
    }, 3000);

  // validate the input fields
  if (!isValidUsername(usernameField.value)) {
    //alert('请输入合法的用户名！');
    myAlert('','请输入合法的用户名！',function(){
      // console.log("??");
    });
    return;
  }
  if (!isValidPassword(passwordField.value) || passwordField.value.length<8 || passwordField.value.length>30) {
    //alert('请输入合法的密码！');
    myAlert('','请输入合法的密码！',function(){});
    return;
  }
  if (!isValidConfirmPassword(passwordField.value, confirmPasswordField.value)) {
    //alert('两次输入的密码不匹配！');
    myAlert('','两次输入的密码不匹配！',function(){});
    return;
  }
  // console.log(emailField.value);
  if (emailField.value!="" && !isValidEmail(emailField.value)) {
    //alert('请输入合法的邮箱！');
    myAlert('','请输入合法的邮箱！',function(){});
    return;
  }

  if (phoneField.value!="" && !isValidPhone(phoneField.value)) {
    //alert('请输入合法的手机号！');
    myAlert('','请输入合法的手机号！',function(){});
    return;
  }

  $.ajax({
    method : 'post',
    url : "../php/register.php",
    dataType : "text",
    data : {
      username : usernameField.value,
      password : passwordField.value,
      captcha : captchaField.value,
      email : emailField.value,
      phone : phoneField.value,
      address : addressField.value,
      birthday : birthdayField.value,
      sex : sexField.value,
      nationality : nationalityField.value,
    },
    success : function(ret) {
      console.log(ret);
      if(ret == "already") {
        myAlert('','用户名已存在',function(){});
      } else if(ret == "captchaExpired") {
				myAlert('','验证码已经过期，<br>请刷新页面重试。',function(){});
			} else if(ret == "captchaWrong") {
				myAlert('','您输入的验证码不正确！<br>请刷新页面重试。',function(){});
      } else if(ret == "success") {
        displayAlert('success','注册成功！',1500);
        // displayAlert('success','2秒后跳转',1500);  // css被挡住了
        setTimeout(function(){window.location.href='../html/login.html';},1500);
      } else {
        myAlert('','注册失败，请稍后再试',function(){});
      }
      // var line = document.getElementsByName(paintingID);
      // line[0].style.display = 'none';
    }
  })

  } else {
		myAlert('','点击过于频繁，请稍后再试',function(){});
	}

});

// function to validate the username
function isValidUsername(username) {
  // check if the username contains only letters, numbers, or underscores
  var regex = /^[a-zA-Z0-9_-]+$/;
  return regex.test(username);
}

// function to validate the email
function isValidEmail(email) {
  // check if the email is in the correct format
  // var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  return regex.test(email);
}

// function to validate the password
function isValidPassword(password) {
  // check if the password is at least 8 characters long and contains at least one uppercase letter, one lowercase letter, and one number
  //var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  var banned = /^[a-zA-Z0-9_-]+[^ *~`#$%&\\'";?$\x22]+$/;
  return banned.test(password);
}

function passwordStrengthLevel(password) {
  var level = 0;
  if (/[a-z]/.test(password)) level++;
  if (/[A-Z]/.test(password)) level++;
  if (/\d/.test(password)) level++;
  if(/[^0-9a-zA-Z]/.test(password)) level++;
  return level;
}

function changeStrengthCSS(level) {
  var weak = document.getElementById('weak');
  var medium = document.getElementById('medium');
  var strong = document.getElementById('strong');
  switch(level) {
    case 0:
      weak.className=medium.className=strong.className="strength";
      break;
    case 1:
      weak.className="weak";
      medium.className=strong.className="strength";
      break;
    case 2:
      weak.className=medium.className="medium";
      strong.className="strength";
      break;
    case 3:
    case 4:
      weak.className=medium.className=strong.className="strong"; 
      break;
  }
}

function isValidPhone(phone) {
  // 中国运营商
  var regex = /^1[3578]\d{9}$/;
  return regex.test(phone);
}

// function to validate the confirm password
function isValidConfirmPassword(password, confirmPassword) {
  // check if the confirm password matches the password
  return password === confirmPassword;
}

var sex = document.getElementById('sex');
sex.onchange = function() {
  sex.style.color = "black";
}

var birthday = document.getElementById('birthday');
birthday.onchange = function() {
  birthday.style.color = "black";
}

var nationality = document.getElementById('nationality');
nationality.onchange = function() {
  nationality.style.color = "black";
}

// 定义国籍选项的数据
var nationalities = [
  "阿根廷",
  "巴基斯坦",
  "巴西",
  "波兰",
  "丹麦",
  "德国",
  "俄罗斯",
  "埃及",
  "法国",
  "菲律宾",
  "哈萨克斯坦",
  "韩国",
  "荷兰",
  "美国",
  "日本",
  "瑞士",
  "沙特阿拉伯",
  "乌克兰",
  "希腊",
  "新加坡",
  "西班牙",
  "意大利",
  "印度",
  "英国",
  "智利",
  "中国",
];
var language = "zh-CN"; // 设置语言，可以根据需要修改
var flag = true;
// 将下拉框添加到页面的某个元素中
var select_nationality = document.getElementById("nationality");
select_nationality.onfocus = function(){
  if(flag) {
    for(var x=0;x<nationalities.length;x++){
      var opt=document.createElement("option");
      opt.innerHTML=nationalities[x];
      // console.log(nationalities[x]);
      select_nationality.appendChild(opt);
    }
    flag = false;
  }
  return;
}

