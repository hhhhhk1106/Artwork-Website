// select the registration form and its input fields
var registrationForm = document.querySelector('form');
var usernameField = document.querySelector('#username');
var emailField = document.querySelector('#email');
var passwordField = document.querySelector('#password');
var confirmPasswordField = document.querySelector('#confirm-password');
var phoneField = document.querySelector('#phone');

var username = document.getElementById('username');
username.oninput = function(){
  var usernameError = document.getElementById('usernameError');
  if (usernameField.value.length == 0) {
    usernameError.textContent = "请输入用户名";
    usernameError.style.display = 'block';
  } else if(!isValidUsername(usernameField.value)) {
    usernameError.textContent = "用户名不合法,只能包含字母数组下划线";
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
    passwordError.textContent = "密码中含有非法字符 * ~ ` # $ % & \\ \' \" ; ? $";
    passwordError.style.display = 'block';
  } else {
    passwordError.style.display = 'none';
    var level = passwordStrengthLevel(passwordField.value);
    changeStrengthCSS(level);
  }
  //TODO: 密码强弱提示
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
  if (phoneError.value.length == 0) {
    phoneError.style.display = 'none';
  } else if (!isValidPhone(phoneField.value)) {
    phoneError.textContent = "请输入合法的手机号";
    phoneError.style.display = 'block';
  } else {
    phoneError.style.display = 'none';
  }
}

// 提交时验证：alert
registrationForm.addEventListener('submit', function(event) {
  // prevent the default form submission behavior
  event.preventDefault();

  // validate the input fields
  if (!isValidUsername(usernameField.value)) {
    alert('请输入合法的用户名！');
    return;
  }
  if (!isValidPassword(passwordField.value)) {
    alert('请输入合法的密码！');
    return;
  }
  if (!isValidConfirmPassword(passwordField.value, confirmPasswordField.value)) {
    alert('两次输入的密码不匹配！');
    return;
  }
  // console.log(emailField.value);
  if (emailField.value!="" && !isValidEmail(emailField.value)) {
    alert('请输入合法的邮箱！');
    return;
  }

  if (phoneField.value!="" && !isValidPhone(phoneField.value)) {
    alert('请输入合法的手机号！');
    return;
  }

  // if all input fields are valid, redirect to the login page
  //window.location.href = 'login.html';
  this.submit();
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
  var banned = /^[a-zA-Z0-9_-]+[^*~`#$%&\\'";?$\x22]+$/;
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

// 定义国籍选项的数据
var nationalities = [
    "中国",
    "美国",
    "加拿大",
    "英国",
    "法国"
    // TODO: 添加更多国籍...
];
var language = "zh-CN"; // 设置语言，可以根据需要修改
// 将下拉框添加到页面的某个元素中
var select_nationality = document.getElementById("nationality");
select_nationality.onfocus = function(){
  for(var x=0;x<nationalities.length;x++){
    var opt=document.createElement("option");
    opt.innerHTML=nationalities[x];
    // console.log(nationalities[x]);
    select_nationality.appendChild(opt);
  }
}

