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
            console.log(ret);
            //未查询到该用户(id非数字或无对应数据)
            if(ret == "no") {
                //TOkDO:跳转
                window.location.href = "../html/error.html";
            } else {
                //显示
                var obj = JSON.parse(ret);
                showUserInfo(obj);
                //console.log(title);
            }
        },
    })
    
    
    var money = document.getElementById('money');
    console.log(money);
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
    // 中国运营商
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
                var node = document.createTextNode(newMoney);
                balance.appendChild(node);
            }
        }
    });
}