var id = getUrlParam('id');
console.log(id);

if(id === null) {
    //TODO: 跳转到默认页？显示空detail页？
    //console.log("nope");
} else {
    $.ajax({
        method : 'get',
        url : "../php/detail.php",
        dataType : "text",
        data : {
            id : id
        },
        success : function(ret) {
            console.log(ret);
            //未查询到该painting(id非数字或无对应数据)
            if(ret == "no") {
                //TODO:跳转
            } else {
                //显示
                var obj = JSON.parse(ret);
                showInfo(obj);
                //console.log(title);
            }
        },
    })
}

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
    // get info
    //var title = obj.Title;  //名称
    //var artist = obj.ArtistName;    //TOkDO:
    //var link = obj.ImageLink;  //图片
    var year = obj.YearOfWork;
    var price = obj.MSRP;
    var saled = obj.Saled;

    // 可能为null的信息
    var description = obj.Description;
    var excerpt = obj.Excerpt;
    var google = obj.GoogleLink;
    var issuedate = obj.IssueDate;
    var issueuser = obj.UserName; 
    var genre = obj.GenreName;
    var era = obj.EraName;
    var subject = obj.SubjectName;
    var shape = obj.ShapeName;

    // set CSS
    var productImage = document.getElementById('product-image');
    productImage.src = obj.ImageLink;;
    //var artist = document.getElementById('artist').innerHTML;
    document.getElementById('title').innerHTML = obj.Title;
    document.getElementById('artist').innerHTML = obj.ArtistName;
    document.getElementById('price').innerHTML = obj.MSRP;
    document.getElementById('saled').innerHTML = (obj.Saled===0?"未售出":"已售出");
    document.getElementById('year').innerHTML = obj.YearOfWork;
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