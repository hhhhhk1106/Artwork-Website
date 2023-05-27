var userID = sessionStorage.getItem("userID");
if(userID === null) {
    //alert("用户未登录！");
    window.location.href = "../html/error.html";
} else {
    $.ajax({
        method : 'get',
        url : "../php/shoppingcart.php",
        dataType : "text",
        data : {
            UserID : userID,
            myAPI : "show",
        },
        success : function(ret) {
            // console.log(ret);
            if(ret == "no") {
                // 购物车为空
                // console.log("no sc");
                //window.location.href = "../html/error.html";
            } else {
                //显示
                var obj = JSON.parse(ret);
                // console.log(obj);
                // console.log(obj.length);
                // TOkDO: 展示
                var total = 0.0;
                obj.forEach(element => {
                    loadItem(element);
                    if(element.MSRP != "已售出") total = 0.00 + parseFloat(element.MSRP) + total;
                    // console.log(total);
                });
                var del = document.getElementsByClassName('remove-btn');
                // console.log(del.length);
                // console.log(del);
                console.log("total");
                console.log(total);
                var Total = document.getElementById('total');
                Total.innerText = total;
                // console.log(del[0].attributes.getNamedItem('painting').value);//paintingID

                var arr = Array.from(del);
                // console.log(arr);
                arr.forEach(element => {
                    // 删除
                    element.onclick = function() {
                        // var msg = "确认删除";
                        myConfirm('','确认删除？',function(ret){
                            console.log(ret);
                            if(ret) {
                                deleteCart(element,userID);
                            }
                        });
                        // myAlert('','he',function(){
                        //     console.log("alert");
                        // })
                    }
                });
            }
        },
    });
    
    var buy = document.getElementById('buy');
    buy.onclick = function() {
        // console.log("buyOK");
        myConfirm('','确认购买所有艺术品？',function(ret){
            console.log(ret);
            if(ret) {
                //payAll-TkDO: 1.1
                var Total = document.getElementById('total');
                var total = Total.innerText;
                // console.log(total);
                payAll(total);
            }
        });
    }

}

function loadItem(element) {
    var cart = document.getElementById('cartitems');
    var imagesrc = "../image/square-medium/"+element.ImageFileName+".jpg";
    var title = element.Title;
    var price = element.MSRP;
    var div_item1 = '<tbody name="';
    var div_item2 = '"><tr><td><img alt="艺术品图片" src="';
    var div_item3 = '" class="cart-item-image"></td><td>'
    var div_item4 = '</td><td>';
    var div_item5 = '</td><td><button class="remove-btn" painting="';
    var div_item6 = '">删除</button></td></div></tr></tbody>';
    
    var div_item = div_item1+element.PaintingID+div_item2+imagesrc+div_item3+title+div_item4+price+div_item5+element.PaintingID+div_item6;
    cart.innerHTML += div_item;
    if(price == "已售出") {
        var item_saled = document.getElementsByName(element.PaintingID);
        item_saled[0].style.backgroundColor = "#eee";
    }
}

function deleteCart(element,userID) {
    var paintingID = element.attributes.getNamedItem('painting').value;
    $.ajax({
        method : 'post',
        url : "../php/shoppingcart.php",
        dataType : "text",
        data : {
            UserID : userID,
            PaintingID : paintingID,
            myAPI : "delete",
        },
        success : function(ret) {
            console.log(ret);
            var line = document.getElementsByName(paintingID);
            line[0].style.display = 'none';
        }
    });
}

function payAll(total) {
    //确认余额TOkDO: 1.0
    // 查询余额，和总价比较，不足则alert；足够则扣款
    // 购物车表查询userid所有state为0，在painting表设置为售出、购物车表更新state为1
    // 之后发布写完：查询到的painting有发布者，则增加对方账户余额
    $.ajax({
        method : 'post',
        url : "../php/shoppingcart.php",
        dataType : "text",
        data : {
            UserID : userID,
            Total : total,
            myAPI : "pay",
        },
        success : function(ret) {
            console.log(ret);
            if(ret == "no") {
                // 没有该用户账户
                myAlert('','用户账户出现错误',function(){});
            } else if(ret == "notEnough") {
                // 余额不足
                myAlert('','账户余额不足',function(){});
            } else if(ret == "success") {
                // 成功
                displayAlert('success','购买成功！',1500);
                setTimeout(function(){window.location.href='../html/info.html';},1500);
            }
        }
    });
}

// function calculateTotal() {
//     var total = 0;

// }