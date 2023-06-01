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
        // TODO:
        // console.log("re");
        var items = document.getElementsByClassName('items')[0];
        items.innerHTML = "";
        showreInfo();
    }

}

function showreInfo() {
    // TODO: 展示表单，填充信息，保存按钮
    var items = document.getElementsByClassName('items')[0];
    var form = document.createElement('form');
    // var div_email = document.createElement('div');
    // div_email.className = "form-control";
    // var label_email = document.createElement('label');
    // label_email.innerHTML = "邮箱";
    // div_email.appendChild(label_email);
    // var input_email = document.createElement('input');
    // input_email.type = "email";
    // input_email.id = "email";
    // input_email.name = "email";
    // div_email.appendChild(input_email);
    // var div_emailErr = document.createElement('div');
    // div_emailErr.id = "emailError";
    // div_emailErr.className = "error";
    // div_email.appendChild(div_emailErr);

    // form.appendChild(div_email);
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
                
                //TODO: check邮箱，手机号
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
                        // if(ret == "fail") {
                        // myAlert('','发布失败，请稍后重试',function(){});
                        // } else 
                        if(ret == "success") {
                            displayAlert('success','修改成功！',1500);
                            //TOkDO: 跳转个人中心
                            // setTimeout(function(){window.location.href='../html/info.html';},1500);
                        } else {
                            
                        }
                    }
                })
        
        
            };
            
        },
    })
}

var nationalities = [
    "中国",
    "美国",
    "加拿大",
    "英国",
    "法国"
];


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