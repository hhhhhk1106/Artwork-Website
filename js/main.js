$.ajax({
    method : 'get',
    url : "../php/main.php",
    dataType : "text",
    data : {
        myAPI : "newIssue",
    },
    success : function(ret) {
        // console.log(ret);
        if(ret == "no") {
            //TOkDO:跳转
            // window.location.href = "../html/error.html";
        } else {
            //显示
            var obj = JSON.parse(ret);
            console.log(obj);
            showIssue(obj);

        }
    },
})

getPopularItems();

var refresh = document.getElementById('refresh');
refresh.onclick = function() {
    var items = document.getElementById('searchresults');
    items.innerHTML = "";
    getPopularItems();
}

function getPopularItems() {
    $.ajax({
        method : 'get',
        url : "../php/main.php",
        dataType : "text",
        data : {
            myAPI : "popular",
        },
        success : function(ret) {
            //console.log(ret);
            var obj = JSON.parse(ret);
            console.log(obj);
            if(ret == "0") {

            } else {
                //显示
                // var results = obj.results;
                var arr = Array.from(obj);
                arr.forEach(element => {
                    loadItem(element);
                    // console.log(total);
                });
                // var obj = JSON.parse(ret);
                // console.log(obj);
            }
        },
    })
  
}

window.onload = function () {
    var imgList = document.querySelector('.imgList');
    var circle = document.querySelector('.circle');
    var thisIndex = 0;
    var imgListLi = imgList.children;
    var circleA = circle.children;
    var flag = true;
    imgList.style.width = imgList.children.length * 620 + 'px';
    for (var i = 0; i < imgList.children.length; i++) {
        var aNode = document.createElement('a');
        aNode.setAttribute('index', i);	//设置自定义属性
        if (i == 0) {
            aNode.className = 'hover';
        }
        circle.appendChild(aNode);
    }
    circle.addEventListener('click', function (e) {
        if (flag) {
            flag = false;
            // console.log(e.target);
            if (e.target.nodeName != 'A') {
                return false;
            }
            thisIndex = e.target.getAttribute('index');
            // imgList.style.left = -thisIndex * 620 + 'px';
            slow(imgList, -thisIndex * 620, function () {
                flag = true;
            });
            circleChange();
        }
    })
    function antoChange() {
        setInterval(function () {
            if (flag) {
                flag = false;
                if (thisIndex >= circleA.length) {
                    thisIndex = 0;
                }
                slow(imgList, -thisIndex * 620, function () {
                    flag = true;
                });
                circleChange();
                thisIndex++;
            }
        }, 3000);
    }
    function circleChange() {
        for (var i = 0; i < circleA.length; i++) {
            circleA[i].className = '';
        }
        circleA[thisIndex].className = 'hover';
    }
    function slow(obj, target, callback) {
        obj.myInter = setInterval(function () {
            var offsetLeft = obj.offsetLeft;
            var num = (target - offsetLeft) / 10;
            num > 0 ? num = Math.ceil(num) : num = Math.floor(num);
            if (offsetLeft == target) {
                clearInterval(obj.myInter);
                callback && callback();
            } else {
                obj.style.left = offsetLeft + num + 'px';
            }
        }, 10)
    }
    antoChange();
}

function showIssue(obj) {
    var imgList = document.getElementById('imgList');
    var lis = imgList.getElementsByTagName('li');
    // console.log(lis);
    var arr = Array.from(lis);
    var arr_obj = Array.from(obj);

    for(var i=0;i<arr.length;i++) {
        // console.log(arr[i]);
        // console.log(arr_obj[i]);
        var element = arr_obj[i];
        // img-info
        arr[i].firstElementChild.innerHTML += "<b>名称<b><br>";
        arr[i].firstElementChild.innerHTML += element.Title+"<br><br>";
        arr[i].firstElementChild.innerHTML += "<b>作者<b><br>";
        arr[i].firstElementChild.innerHTML += element.ArtistName+"<br><br>";
        arr[i].firstElementChild.innerHTML += "<b>价格<b><br>";
        arr[i].firstElementChild.innerHTML += element.MSRP+"<br><br>";
        arr[i].firstElementChild.innerHTML += "<b>简介<b><br>";
        arr[i].firstElementChild.innerHTML += element.Description+"<br>";
        arr[i].lastChild.href = "../html/detail.html?id="+element.PaintingID;
        arr[i].lastChild.firstChild.src = "../image/large/"+element.ImageFileName+".jpg";
    }
}

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