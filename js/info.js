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
    
    // 商品相关信息
}

function showUserInfo(obj) {
    console.log("infoOK")
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
    // name["username"] = "用户名";
    // name["Name"] = "真实姓名";
    // name["Address"] = "地址";
    // name["Country"] = "国籍";
    // name["Phone"] = "手机号";
    // name["Email"] = "邮箱";
    // name["Sex"] = "性别";
    // name["Birthday"] = "生日";
    // name["Balance"] = "账户余额";

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
        console.log(element);
        console.log(element.firstChild.innerHTML);
        var key = name[element.firstChild.innerHTML];
        if(list[key]) {
            element.innerHTML += list[key];
            element.style.display = 'block';
        }

        // console.log(element.lastElementChild.id);
        // if(element != null) {
        //     // document.getElementById(item).innerHTML = list[item];
        //     // element.style.display = 'flex';
        //     console.log(element.name);
        // }
    })
    //optional[0].style.display = 'block';
}