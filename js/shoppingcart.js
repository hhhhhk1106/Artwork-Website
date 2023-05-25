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
                console.log("no sc");
                //window.location.href = "../html/error.html";
            } else {
                //显示
                var obj = JSON.parse(ret);
                console.log(obj);
                console.log(obj.length);
                // TODO: 展示
                obj.forEach(element => {
                    // console.log(element);
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
                });
                var del = document.getElementsByClassName('remove-btn');
                console.log(del.length);
                console.log(del);
                console.log(del[0].attributes.getNamedItem('painting').value);//paintingID

                var arr = Array.from(del);
                console.log(arr);
                arr.forEach(element => {
                    element.onclick = function() {
                        // console.log(element.attributes.getNamedItem('painting').value);
                        // 寄 怎么改啊
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
                                // console.log(line[0]);
                                line[0].style.display = 'none';
                            }
                        });
                    }
                });
            }
        },
    });
    // var del = document.getElementsByClassName('remove-btn');
    // console.log(del.length);
    // console.log(del);
    
}


// del.forEach(element => {
//     element.onclick = function() {
//         console.log(element);
//     }
// });