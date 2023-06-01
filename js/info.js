var userID = sessionStorage.getItem("userID");
if(userID === null) {
    //alert("用户未登录！");
    window.location.href = "../html/error.html";
} else {
    // 个人信息
    $.ajax({
        method : 'get',
        url : "../php/info.php",
        dataType : "text",
        data : {
            UserID : userID,
            myAPI : "userInfo",
        },
        success : function(ret) {
            //console.log(ret);
            //未查询到该用户(id非数字或无对应数据)
            if(ret == "no") {
                //TOkDO:跳转
                window.location.href = "../html/error.html";
            } else {
                //显示
                var obj = JSON.parse(ret);
                showUserInfo(obj);
                //console.log(title);
                loadIssueItems(userID);
                loadPaidItems(userID);
            }
        },
    })
    
    
    var money = document.getElementById('money');
    //console.log(money);
    var rechargeField = document.querySelector('#money');
    money.oninput = function(){
        // console.log("rechargeOK");
        var rechargeError = document.getElementById('rechargeError');
        if(rechargeField.value.length!=0&&!isValidRecharge(rechargeField.value)) {
            rechargeError.textContent = "金额应为正整数";
            rechargeError.style.display = 'block';
        } else {
            rechargeError.style.display = 'none';
        }
    }
    
    var recharge = document.getElementById('recharge');
    recharge.onclick = function() {
        if(rechargeField.value.length!=0&&!isValidRecharge(rechargeField.value)) {
            myAlert('','金额应为正整数',function(){});
            return;
        } else if(rechargeField.value.length!=0) {
            myConfirm('','确认充值：'+rechargeField.value,function(ret){
                console.log(ret);
                if(ret) {
                    rechargeMoney(rechargeField.value);
                }
            });
        }
    }

    var reinfo = document.getElementById('reinfo');
    reinfo.onclick = function() {
        var items = document.getElementsByClassName('items')[0];
        items.innerHTML = "";
        showreInfo();
    }

    var reusername = document.getElementById('reusername');
    reusername.onclick = function() {
        var items = document.getElementsByClassName('items')[0];
        items.innerHTML = "";
        changeusrnm();
    }

    var repassword = document.getElementById('repassword');
    repassword.onclick = function() {
        var items = document.getElementsByClassName('items')[0];
        items.innerHTML = "";
        changepswd();
    }

}

function showreInfo() {
    // TOkDO: 展示表单，填充信息，保存按钮
    var items = document.getElementsByClassName('items')[0];
    var form = document.createElement('form');

    var email = '<div class="form-control"><label for="email">邮箱</label><input type="email" id="email" name="email"><div id="emailError" class="error"></div></div>';
    form.innerHTML += email;
    var phone = '<div class="form-control"><label for="phone">手机号</label><input type="text" id="phone" name="phone"><div id="phoneError" class="error"></div></div>';
    form.innerHTML += phone;
    var address = '<div class="form-control"><label for="address">地址</label><input type="text" id="address" name="address"></div>';
    form.innerHTML += address;
    var sex = '<div class="form-control"><label for="sex">性别</label><select type="text" id="sex" name="sex"><option disabled selected>请选择</option><option>男</option><option>女</option><option>保密</option></select></div>';
    form.innerHTML += sex;
    var birthday = '<div class="form-control"><label for="birthday">出生日期</label><input type="date" id="birthday" name="birthday"></div>';
    form.innerHTML += birthday;
    var nationality = '<div class="form-control"><label for="nationality">国籍</label><select type="text" id="nationality" name="nationality"><option disabled selected>请选择</option></select></div>';
    form.innerHTML += nationality;

    var submit = '<button id="saveinfo">保存</button>';
    form.innerHTML += submit;
    items.appendChild(form);

    // 填充表单原有信息
    getOldInfo(userID);

}

function getOldInfo(userID) {
    var flag = true;
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
    }

    $.ajax({
        method : 'get',
        url : "../php/info.php",
        dataType : "text",
        data : {
            UserID : userID,
            myAPI : "update",
        },
        success : function(ret) {
            // console.log(ret);
            var obj = JSON.parse(ret);
            console.log(obj);

            document.getElementById('email').value = obj.Email;
            document.getElementById('phone').value = obj.Phone;
            document.getElementById('address').value = obj.Address;
            document.getElementById('sex').value = obj.Sex;
            document.getElementById('birthday').value = obj.Birthday;
            // document.getElementById('nationality').value = obj.Country;
            var opt=document.createElement("option");
            opt.innerHTML=obj.Country;
            document.getElementById('nationality').appendChild(opt);
            opt.selected = true;

            var email = document.getElementById('email');
            var emailField = document.querySelector('#email');
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
            var phoneField = document.querySelector('#phone');
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

            var addressField = document.querySelector('#address');
            var birthdayField = document.querySelector('#birthday');
            var nationalityField = document.querySelector('#nationality');
            var sexField = document.querySelector('#sex');            

            // 保存
            var saveinfo = document.getElementById('saveinfo');
            saveinfo.onclick = function() {
                event.preventDefault();
                console.log("post new")
                
                //TOkDO: check邮箱，手机号
                if (emailField.value!="" && !isValidEmail(emailField.value)) {
                    myAlert('','请输入合法的邮箱！',function(){});
                    return;
                }
            
                if (phoneField.value!="" && !isValidPhone(phoneField.value)) {
                    myAlert('','请输入合法的手机号！',function(){});
                    return;
                }
            
                var newData = {};
                newData["myAPI"] = "update";
                newData["UserID"] = userID;

                newData["Email"] = emailField.value;
                newData["Phone"] = phoneField.value;
                newData["Address"] = addressField.value;
                // newData["Birthday"] = birthdayField.value;
                if(birthdayField.value!="")newData["Birthday"] = birthdayField.value;
                newData["Sex"] = sexField.value;
                newData["Country"] = nationalityField.value;

                console.log(newData);

                $.ajax({
                    method : 'post',
                    url : "../php/info.php",
                    dataType : "text",
                    data : newData,
                    success : function(ret) {
                        //obj = JSON.parse(ret);
                        console.log(ret);            
                        if(ret == "success") {
                            displayAlert('success','修改成功！',1500);
                            //TOkDO: 跳转个人中心
                            setTimeout(function(){window.location.href='../html/info.html';},1500);
                        } else {
                            
                        }
                    }
                })
        
        
            };
            
        },
    })
}

function changeusrnm() {
    var items = document.getElementsByClassName('items')[0];
    var form = document.createElement('form');

    var div_username = '<div class="form-control"><label for="username" class="must">用户名</label><input type="text" id="username" name="username" required><div id="usernameError" class="error"></div></div>';
    form.innerHTML += div_username;

    var submit = '<button id="saveinfo">保存</button>';
    form.innerHTML += submit;
    items.appendChild(form);

    // 填充表单原有信息
    document.getElementById('username').value = sessionStorage.getItem("username");

    var username = document.getElementById('username');
    var usernameField = document.querySelector('#username');
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

    // 保存
    var saveinfo = document.getElementById('saveinfo');
    saveinfo.onclick = function() {
        event.preventDefault();
        console.log("post new")
        
        if (!isValidUsername(usernameField.value)) {
            myAlert('','请输入合法的用户名！',function(){});
            return;
        }

        $.ajax({
            method : 'post',
            url : "../php/info.php",
            dataType : "text",
            data : {
                myAPI : "newusername",
                UserID : userID,
                UserName : usernameField.value,
            },
            success : function(ret) {
                //obj = JSON.parse(ret);
                console.log(ret);   
                if(ret == "already") {
                    myAlert('','用户名已存在',function(){});
                } else if(ret == "success") {
                    displayAlert('success','修改成功！',1500);
                    sessionStorage.setItem("username",usernameField.value);
                    setTimeout(function(){window.location.href='../html/info.html';},1500);
                }
            }
        })
    }
}

function changepswd() {
    var items = document.getElementsByClassName('items')[0];
    var form = document.createElement('form');
    
    // 输入原有密码，再跳转
    var div_pwd = '<div class="form-control"><label for="password" class="must">旧密码</label><input type="password" id="password" name="password" required></div>';
    form.innerHTML += div_pwd;

    var submit = '<button id="checkpwd">提交</button>';
    form.innerHTML += submit;
    items.appendChild(form);

    var checkpwd = document.getElementById('checkpwd');
    var passwordField = document.querySelector('#password');
    checkpwd.onclick = function() {
        event.preventDefault();
        
        $.ajax({
            method : 'post',
            url : "../php/info.php",
            dataType : "text",
            data : {
                myAPI : "checkpwd",
                UserID : userID,
                Pass : passwordField.value,
            },
            success : function(ret) {
                console.log(ret);   
                if(ret == "no") {
                    myAlert('','密码错误',function(){});
                } else if(ret == "yes") {
                    items.innerHTML = "";
                    setNewPwd();
                }
            }
        })
    }
}

function setNewPwd() {
    var items = document.getElementsByClassName('items')[0];
    var form = document.createElement('form');
    
    // 新密码、确认密码
    var div_pwd = '<div class="form-control"><label for="password" class="must">密码</label><span id="password-strength">密码强度：</span><span id="weak" class="strength">弱</span><span id="medium" class="strength">中</span><span id="strong" class="strength">强</span><input type="password" id="password" name="password" required><div id="passwordError" class="error"></div></div>';
    form.innerHTML += div_pwd;

    var div_cfmpwd = '<div class="form-control"><label for="password" class="must">确认密码</label><input type="password" id="confirm-password" name="confirm-password" required><div id="confirm-passwordError" class="error"></div></div>';
    form.innerHTML += div_cfmpwd;

    var submit = '<button id="savepwd">提交</button>';
    form.innerHTML += submit;
    items.appendChild(form);

    var passwordField = document.querySelector('#password');
    var confirmPasswordField = document.querySelector('#confirm-password');

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
        if(birthdayPwd(passwordField.value)) {
            passwordError.textContent = "密码中含有生日，建议修改";
            passwordError.style.display = 'block';
        }
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

    var savepwd = document.getElementById('savepwd');
    savepwd.onclick = function() {
        event.preventDefault();
        
        if (!isValidPassword(passwordField.value) || passwordField.value.length<8 || passwordField.value.length>30) {
            myAlert('','请输入合法的密码！',function(){});
            return;
        }
        if (!isValidConfirmPassword(passwordField.value, confirmPasswordField.value)) {
            myAlert('','两次输入的密码不匹配！',function(){});
            return;
        }

        $.ajax({
            method : 'post',
            url : "../php/info.php",
            dataType : "text",
            data : {
                myAPI : "savepwd",
                UserID : userID,
                Pass : passwordField.value,
            },
            success : function(ret) {
                console.log(ret);   
                // if(ret == "no") {
                //     myAlert('','密码错误',function(){});
                // } else if(ret == "yes") {
                //     items.innerHTML = "";
                //     setNewPwd();
                // }
                if(ret == "success") {
                    displayAlert('success','修改成功！',1500);
                    setTimeout(function(){window.location.href='../html/info.html';},1500);
                }
            }
        })
    }
}

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

//TO-DO:
function birthdayPwd(password) {
    var birthday = document.getElementById('birthday');
    if(birthday.lastChild!="<br>") {
        var day = birthday.innerText.split('-');
        var banned = day[1]+day[2];
        console.log(banned);
        return password.includes(banned);
    }
    return false;
}

function isValidPassword(password) {
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

function isValidConfirmPassword(password, confirmPassword) {
    return password === confirmPassword;
}

function isValidUsername(username) {
    var regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(username);
}

function isValidEmail(email) {
    var regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return regex.test(email);
}

function isValidPhone(phone) {
    var regex = /^1[3578]\d{9}$/;
    return regex.test(phone);
}

function showUserInfo(obj) {
    // console.log("infoOK")
    // 可能为null的信息
    var list = [];
    list["username"] = sessionStorage.getItem("username");
    list["Name"] = obj.Name;
    list["Address"] = obj.Address;
    list["Country"] = obj.Country;
    list["Phone"] = obj.Phone;
    list["Email"] = obj.Email;
    list["Sex"] = obj.Sex;
    list["Birthday"] = obj.Birthday;
    list["Balance"] = obj.Balance;

    var name = [];

    name["用户名"] = "username";
    name["真实姓名"] = "Name";
    name["地址"] = "Address";
    name["国籍"] = "Country";
    name["手机号"] = "Phone";
    name["邮箱"] = "Email";
    name["性别"] = "Sex";
    name["生日"] = "Birthday";
    name["账户余额"] = "Balance";

    var userinfo = document.getElementsByName('info');
    console.log(userinfo);
    // console.log(optional.length);
    userinfo.forEach((element)=>{
        // console.log(element);
        // console.log(element.firstChild.innerHTML);
        var key = name[element.firstChild.innerHTML];
        if(list[key]) {
            element.innerHTML += list[key];
            element.style.display = 'block';
        }
    })
    //optional[0].style.display = 'block';
}

function isValidRecharge(recharge) {
    var regex = /^[1-9][0-9]*$/;
    return regex.test(recharge);
}

function rechargeMoney(money) {
    $.ajax({
        method : 'post',
        url : "../php/info.php",
        dataType : "text",
        data : {
            UserID : userID,
            Money : money,
            myAPI : "recharge",
        },
        success : function(ret) {
            console.log(ret);
            // var line = document.getElementsByName(paintingID);
            // line[0].style.display = 'none';
            if(ret == "no") {
                // 没有该用户账户
                myAlert('','用户账户出现错误',function(){});
            } else if(ret == "success") {
                //window.location.reload();
                var balance = document.getElementById('balance');
                //var node = document.createTextNode(1);
                //balance.replaceChild(node,balance.lastChild);
                var old = balance.lastChild;
                var temp = document.createElement("div");
                temp.appendChild(old);
                var newMoney = parseFloat(temp.innerHTML) + parseFloat(money);
                var node = document.createTextNode(parseFloat(newMoney));
                balance.appendChild(node);
            }
        }
    });
}

function loadIssueItems(userID) {
    $.ajax({
        method : 'get',
        url : "../php/info.php",
        dataType : "text",
        data : {
            UserID : userID,
            myAPI : "issueInfo",
        },
        success : function(ret) {
            //console.log(ret);
            //无商品
            if(ret == "no") {
                //window.location.href = "../html/error.html";
            } else {
                //显示
                var obj = JSON.parse(ret);
                //showUserInfo(obj);
                //console.log(obj);
                obj.forEach(element => {
                    //console.log(element);
                    showIssueItem(element);
                })

                var mod = document.getElementsByClassName('modify');
                // console.log(mod);
                // console.log(del[0].attributes.getNamedItem('painting').value);//paintingID
                var arr = Array.from(mod);
                console.log(arr);
                arr.forEach(element => {
                    // 修改TOkDO:
                    element.onclick = function() {
                        console.log("click");
                        var paintingID = element.attributes.getNamedItem('painting').value;
                        window.location.href = "../html/issue.html?id="+paintingID;
                    }
                });
            }
        },
    })    
}

function showIssueItem(element) {
    // console.log("here")
    var items = document.getElementById('issueitems');
    var imagesrc = "../image/square-medium/"+element.ImageFileName+".jpg";
    var title = element.Title;
    var price = element.MSRP;
    var saled = (element.Saled==0)?"未售出":"已售出";
    var div_item1 = '<tbody name="';
    var div_item2 = '"><tr><td><img alt="艺术品图片" src="';
    var div_item3 = '" class="issue-item-image"></td><td>'
    var div_item4 = '</td><td>';
    var div_item5 = '</td><td>';
    var div_item6 = '</td><td><button class="modify" painting="';
    var div_item7 = '">修改</button></td></div></tr></tbody>';
    if(!element.Saled) {
        var div_item = div_item1+element.PaintingID+div_item2+imagesrc+div_item3+title+div_item4+price+div_item5+saled+div_item6+element.PaintingID+div_item7;
    } else {
        var div_item = div_item1+element.PaintingID+div_item2+imagesrc+div_item3+title+div_item4+price+div_item5+saled+div_item5+"</td>";
    }
    
    items.innerHTML += div_item;
}

function loadPaidItems(userID) {
    $.ajax({
        method : 'get',
        url : "../php/info.php",
        dataType : "text",
        data : {
            UserID : userID,
            myAPI : "paidInfo",
        },
        success : function(ret) {
            //console.log(ret);
            if(ret == "no") {
                //无商品
                //window.location.href = "../html/error.html";
            } else {
                //显示
                var obj = JSON.parse(ret);
                //showUserInfo(obj);
                //console.log(obj);
                obj.forEach(element => {
                    //console.log(element);
                    showPaidItem(element);
                })
            }
        },
    })    
}

function showPaidItem(element) {
    //console.log("here")
    var items = document.getElementById('paiditems');
    var imagesrc = "../image/square-medium/"+element.ImageFileName+".jpg";
    var title = element.Title;
    var price = element.MSRP;
    var div_item1 = '<tbody name="';
    var div_item2 = '"><tr><td><img alt="艺术品图片" src="';
    var div_item3 = '" class="issue-item-image"></td><td>'
    var div_item4 = '</td><td>';

    var div_item = div_item1+element.PaintingID+div_item2+imagesrc+div_item3+title+div_item4+price+"</td>";
    
    items.innerHTML += div_item;
}