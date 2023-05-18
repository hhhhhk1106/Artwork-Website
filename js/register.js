// select the registration form and its input fields
var registrationForm = document.querySelector('form');
var usernameField = document.querySelector('#username');
var emailField = document.querySelector('#email');
var passwordField = document.querySelector('#password');
var confirmPasswordField = document.querySelector('#confirm-password');

var password_conf = document.getElementById('confirm-password');
password_conf.onblur = function(){
  // console.log(passwordField.value);
  // console.log(confirmPasswordField.value);
  if (!isValidConfirmPassword(passwordField.value, confirmPasswordField.value)) {
    alert('两次输入的密码不匹配！');
    return;
  }
}
// add an event listener to the form submit button
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

  // if all input fields are valid, redirect to the login page
  window.location.href = 'login.html';
});

// function to validate the username
function isValidUsername(username) {
  // check if the username contains only letters, numbers, or underscores
  var regex = /^[a-zA-Z0-9_]+$/;
  return regex.test(username);
}

// function to validate the email
function isValidEmail(email) {
  // check if the email is in the correct format
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// function to validate the password
function isValidPassword(password) {
  // check if the password is at least 8 characters long and contains at least one uppercase letter, one lowercase letter, and one number
  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
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
    // 添加更多国籍...
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

