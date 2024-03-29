var keyword = getUrlParam('keyword');
console.log(keyword);
if(keyword) {
    document.getElementById('serachtext').value=keyword;
}

var currentPage = 1;
var perPage = 10;
var totalPageNum = 0;
var order = null;
var type = "title";

getPageItems(currentPage,perPage,keyword);

function getPageItems(nowPage,perPage,keyword,order) {
    console.log(keyword);
    // if(keyword == null) {
    if(true) {
        $.ajax({
            method : 'get',
            url : "../php/search.php",
            dataType : "text",
            data : {
                myAPI : "all",
                page : nowPage,
                limit : perPage,
                keyword : keyword,
                order : order,
                type : type,
            },
            success : function(ret) {
                //console.log(ret);
                var obj = JSON.parse(ret);
                console.log(obj);
                if(ret == "0") {
                    //window.location.href = "../html/error.html";
                    // TOkDO: 找到0个结果
                    var totalinfo = document.getElementById("totalinfo");
                    totalinfo.innerHTML = "无符合条件的结果";
                } else {
                    //显示
                    var results = obj.results;
                    var total = obj.total;
                    var totalinfo = document.getElementById("totalinfo");
                    totalinfo.innerHTML = "共搜到 "+total+" 个结果";
                    var pagenow = document.getElementById("pagenow");
                    currentPage = Number(obj.now);
                    pagenow.innerHTML = "第 "+currentPage+" 页";
                    var totalpage = document.getElementById("totalpage");
                    totalPageNum = Math.ceil(total/10);
                    totalpage.innerHTML = "共 "+Math.ceil(total/10)+" 页，";
                    results.forEach(element => {
                        loadItem(element);
                        // console.log(total);
                    });
                    // var obj = JSON.parse(ret);
                    // console.log(obj);
                    checkBound();
                }
            },
        })
    } else {
        // TOkDO: 关键词、排序
    }    
}

// 上一页
var prev = document.getElementsByClassName('be-pager-prev');
// console.log(prev);
prev[0].onclick = function() {
    console.log(this);
    emptyItems();
    getPageItems(currentPage-1,perPage,keyword,order);
}
// 下一页
var next = document.getElementsByClassName('be-pager-next');
next[0].onclick = function() {
    console.log(this);
    emptyItems();
    getPageItems(currentPage+1,perPage,keyword,order);
}
// 首页
var first = document.getElementById('firstpage');
first.onclick = function() {
    console.log(this);
    emptyItems();
    getPageItems(1,perPage,keyword,order);
}
// 尾页
var last = document.getElementById('lastpage');
last.onclick = function() {
    console.log(this);
    emptyItems();
    getPageItems(totalPageNum,perPage,keyword,order);
}

// 首位页禁止上下一页
function checkBound() {
    if(totalPageNum == 1) {
        // 在首页
        prev[0].style.display = "none";
        next[0].style.display = "none";
    } else if(currentPage == totalPageNum) {
        // 在尾页
        prev[0].style.display = "inline-block";
        next[0].style.display = "none";
    } else if(currentPage == 1) {
        prev[0].style.display = "none";
        next[0].style.display = "inline-block";
    } else {
        prev[0].style.display = "inline-block";
        next[0].style.display = "inline-block";
    }
}

// 页数跳转
// function jumpToPage() {
//     var jump = document.getElementById('pageelevator').value;
//     console.log(jump);
// }
var jump = document.getElementById('pageelevator');
jump.onkeydown = function() {
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
        // console.log(jump.value);
        // console.log(Number.isInteger(parseInt(jump.value)));
        // TOkDO: 范围
        var jumpPage = parseInt(jump.value);
        if(Number.isInteger(jumpPage)) {
            emptyItems();
            if(jumpPage < 1) {
                jumpPage = 1;
            } else if (jumpPage > totalPageNum) {
                jumpPage = totalPageNum;
            }
            getPageItems(jumpPage,perPage,keyword,order);
        } else {}
    }
    
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

function emptyItems() {
    var items = document.getElementById('searchresults');
    items.innerHTML = "";
    //items.innerHTML = "<thead><tr><td>艺术品图片</td><td>艺术品名称</td><td>价格</td></tr></thead>";
}

// TOkDO: 重构
function loadItem(element) {
    //var items = document.getElementById('searchitems');
    var items = document.getElementById('searchresults');
    var imagesrc = "../image/square-medium/"+element.ImageFileName+".jpg";
    var title = element.Title;
    var price = element.MSRP;

    // TOkDO: 作者，描述

    var div = document.createElement("div");
    div.className = "result";
    div.name = element.PaintingID;
    var a = document.createElement("a");
    a.href = "../html/detail.html?id="+element.PaintingID;
    a.ariaLabel = "点击查看关于"+title+"的更多信息";
    //var tr = document.createElement("tr");
    //var td_img = document.createElement("td");
    var img_node = document.createElement("img");
    img_node.src = imagesrc;
    img_node.className = "item-image";
    img_node.alt = title;
    //td_img.appendChild(img_node);
    a.appendChild(img_node);
    div.appendChild(a);

    var div_info = document.createElement("div");
    div_info.className = "info";
    var h2_name = document.createElement("h2");
    h2_name.innerHTML = title;
    div_info.appendChild(h2_name);
    var h3_artist_price = document.createElement("h4");
    h3_artist_price.innerHTML = "作者："+element.ArtistName + "&emsp;&emsp;价格："+price;
    div_info.appendChild(h3_artist_price);

    var p_des = document.createElement("p");
    p_des.innerHTML = element.Description;
    if(element.Description == null) {
        p_des.innerHTML = "no description";
    }
    p_des.className = "description";
    div_info.appendChild(p_des);

    //a.appendChild(tr);
    div.appendChild(div_info);
    items.appendChild(div);

}

var sort = document.getElementById('order');
sort.onchange = function() {
    // console.log(sort.value);
    emptyItems();
    order = sort.value;
    getPageItems(currentPage,perPage,keyword,order);
}

var entry = document.getElementById('entry');
entry.onchange = function() {
    // console.log(sort.value);
    emptyItems();
    type = entry.value;
    getPageItems(currentPage,perPage,keyword,order);
}

var search = document.getElementById('search');
search.onclick = function() {
    var serachtext = document.getElementById('serachtext').value;

    window.location.href = "../html/search.html";
    if(serachtext) {
        window.location.href = "../html/search.html?keyword="+serachtext;
    }
}


