var id = getUrlParam('id');
console.log(id);

if(id === null) {
    //TOkDO: 跳转到默认页？显示空detail页？
    //console.log("nope");
    window.location.href = "../html/error.html";
} else {
    $.ajax({
        method : 'get',
        url : "../php/detail.php",
        dataType : "text",
        data : {
            id : id
        },
        success : function(ret) {
            // console.log(ret);
            //未查询到该painting(id非数字或无对应数据)
            if(ret == "no") {
                //TOkDO:跳转
                window.location.href = "../html/error.html";
            } else {
                //显示
                var obj = JSON.parse(ret);
                showInfo(obj);
                //console.log(title);
            }
        },
    })
}

var retlast = document.getElementById('ret');
retlast.onclick = function() {
    window.history.back();
}

var addShoppingCart = document.querySelectorAll('form')[1];
// console.log(addShoppingCart);
addShoppingCart.addEventListener('submit', function(event) {
    // prevent the default form submission behavior
    event.preventDefault();

    // 判断session
    var userID = sessionStorage.getItem("userID");
    if(userID === null) {
        myAlert('','用户未登录！',function(){});
        //alert("用户未登录！");
        return;
    }

    // post
    $.ajax({
        method : 'post',
        url : "../php/shoppingcart.php",
        dataType : "text",
        data : {
            UserID : userID,
            PaintingID : id,
            myAPI : "add",
        },
        success : function(ret) {
            // console.log(ret);
            //未查询到该painting(id非数字或无对应数据)
            if(ret == "success") {
                // console.log("yeah");
                displayAlert('success','添加成功',1500);
                //alert("添加成功");
                //window.location.href = "../html/error.html";
            } else if(ret == "already") {
                myAlert('','购物车中已有该艺术品',function(){});
                //alert("购物车中已有该艺术品");
            } else {
                //显示
                // var obj = JSON.parse(ret);
                // console.log(obj);
            }
        },
    })
});

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null; //返回参数值
}

function showInfo(obj) {
    // 可能为null的信息
    var list = [];
    list["description"] = obj.Description;
    list["excerpt"] = obj.Excerpt;
    list["wiki"] = obj.WikiLink;
    list["issuedate"] = obj.IssueDate;
    list["issueuser"] = obj.UserName;
    list["genre"] = obj.GenreName;
    list["era"] = obj.EraName;
    list["subject"] = obj.SubjectName;
    list["shape"] = obj.ShapeName;


    // set CSS
    var productImage = document.getElementById('product-image');
    productImage.src = obj.ImageLink;
    productImage.src = "../image/large/"+obj.ImageFileName+".jpg";
    var productImage2 = document.getElementById('product-image2');
    productImage2.src = obj.ImageLink;
    productImage2.src = "../image/large/"+obj.ImageFileName+".jpg";
    //var artist = document.getElementById('artist').innerHTML;
    document.getElementById('title').innerHTML = obj.Title;
    document.getElementById('artist').innerHTML = obj.ArtistName;
    document.getElementById('price').innerHTML = obj.MSRP;
    document.getElementById('visit').innerHTML = obj.Visit;
    document.getElementById('size').innerHTML = obj.Width+" * "+obj.Height;
    document.getElementById('saled').innerHTML = (obj.Saled===0?"未售出":"已售出");
    document.getElementById('year').innerHTML = obj.YearOfWork;

    // 可能为null的信息
    var optional = document.getElementsByName('optional');
    // console.log("here");
    // console.log(optional.length);
    optional.forEach((element)=>{
        // console.log(element.lastElementChild.id);
        var item = element.lastElementChild.id;
        if(list[item] != null) {
            document.getElementById(item).innerHTML = list[item];
            element.style.display = 'flex';
        }
    })
    if(list['wiki'] != null) {
        document.getElementById('wiki').href = list['wiki'];
    }
    if(obj.Saled != 0) {
        //已售出不能购买
        var addCartButton = document.getElementById('addCart');
        addCartButton.style.display = "none";
    }
    //optional[0].style.display = 'block';
}

function crossOrigin(url) {
    $(function () {
        $.ajax({
            type: "get",
            async: false,
            url: url,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "callback",
            success: function (data) {
                var json = JSON.stringify(data);
                console.log(json);
            },
            error: function (err) {
                console.log(err);
            }
        });
    });

}