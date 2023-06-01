var userID = sessionStorage.getItem("userID");
var id = getUrlParam('id');
var yearField = document.querySelector('#year');
var titleField = document.querySelector('#title');
var artistField = document.querySelector('#artist');
var genreField = document.querySelector('#genre');
var widthField = document.querySelector('#width');
var heightField = document.querySelector('#height');
var priceField = document.querySelector('#price');
var descriptionField = document.querySelector('#description');
var imageField = document.querySelector('#image');
Date.prototype.format = function(fmt) { 
    var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S" : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
    }
    return fmt; 
}
var registrationForm = document.querySelector('#product-form');
if(userID === null) {
    //alert("用户未登录！");
    window.location.href = "../html/error.html";
} else if(id != null) {
    //判断用户是否为该艺术品发布者并处理
    setButtonPos();
    window.onresize = function() {
        setButtonPos();
    }
    document.getElementById('imageinf').innerHTML="修改图片：(小于4M)";
    document.getElementById('subbut').innerHTML="保存";
    isOwner(id, userID);
    
} else {
    console.log("no id");
    setButtonPos();
    window.onresize = function() {
        setButtonPos();
    }
    
    // var submitButton = document.getElementById('subbut');
    // var realSubmit = document.getElementById('realsub');
    // submitButton.onclick = function() {
    //     realSubmit.click();
    //     registrationForm.submit();
    // }

    registrationForm.addEventListener('submit', function(event) {
        // prevent the default form submission behavior
        event.preventDefault();
        //console.log("subOK")
        // validate the input fields
        
        if (!isValidYear(yearField.value)) {
            //alert('请输入合法的用户名！');
            myAlert('','请输入合法年份',function(){
                // console.log("??");
            });
            return;
        }
        if (titleField.value.length > 50) {
            myAlert('','名称过长',function(){});
            return;
        }
        if (artistField.value.length > 30) {
            myAlert('','作者姓名过长',function(){});
            return;
        } 
    
        $.ajax({
            method : 'post',
            url : "../php/issue.php",
            dataType : "text",
            data : {
                Title : titleField.value,
                LastName : artistField.value,
                YearOfWork: yearField.value,
                GenreID : getGenreID(genreField.value),
                Width : widthField.value,
                Height : heightField.value,
                MSRP : priceField.value,
                Description : descriptionField.value,
                ImageFileName : addImage(),
                IssueUserID : userID,
            },
            success : function(ret) {
                //obj = JSON.parse(ret);
                console.log(ret);            
                if(ret == "fail") {
                myAlert('','发布失败，请稍后重试',function(){});
                } else if(ret == "success") {
                    displayAlert('success','发布成功！',1500);
                    //TOkDO: 跳转个人中心
                    setTimeout(function(){window.location.href='../html/info.html';},1500);
                } else {
                    // myAlert('','注册失败，请稍后再试',function(){});
                }

                // var line = document.getElementsByName(paintingID);
                // line[0].style.display = 'none';
            }
        })


    });
    
}

document.querySelector("#image").addEventListener("change", function(evt) {
    localStorage.clear();
    var image_src = URL.createObjectURL(this.files[0]);
    var img = document.getElementById("image_preview");
    img.src = image_src;
    img.style.display = "none";
    var maxSize = 4*1024*1024;
    
    if(this.files[0].size > maxSize) {
        myAlert('','图片过大，请重新上传',function(){
            document.getElementById('image').value = "";
        });
        return;
    }

    img.style.display = "block";
    // console.log(image_src);
    // console.log(this);

})

var year = document.getElementById('year');
year.oninput = function() {
    var yearError = document.getElementById('yearError');
    if (yearField.value.length == 0) {
        yearError.textContent = "请输入年份";
        yearError.style.display = 'block';
    } else if(yearField.value > 2023) {
        yearError.textContent = "不应超过2023";
        yearError.style.display = 'block';
    } else if(!isValidYear(yearField.value)) {
        yearError.textContent = "请输入合法年份，如2023";
        yearError.style.display = 'block';
    } else {
        yearError.style.display = 'none';
    }
}

var title = document.getElementById('title');
title.oninput = function() {
    var titleError = document.getElementById('titleError');
    if (titleField.value.length > 50) {
        titleError.textContent = "名称不应超过50个字";
        titleError.style.display = 'block';
    } else {
        titleError.style.display = 'none';
    }
}

var artist = document.getElementById('artist');
artist.oninput = function() {
    var artistError = document.getElementById('artistError');
    if (artistField.value.length > 30) {
        artistError.textContent = "作者姓名不应超过30个字";
        artistError.style.display = 'block';
    } else {
        artistError.style.display = 'none';
    }
}

function baseImg(imgName,file) {
    var reader = new FileReader();
    // console.log(reader);
    reader.readAsDataURL(file);
    reader.onload = () => {
        localStorage.setItem(imgName, reader.result);
        // console.log(localStorage);
        $.ajax({
            method : 'post',
            url : "../php/img_test.php",
            dataType : "text",
            data : {
                //img : "this.files[0]",
                imgName : imgName,
                base64 : localStorage.getItem(imgName),
            },
            success : function(ret) {
                console.log(ret);
                //var obj = JSON.parse(ret);
                //console.log(obj);
                
            }
        });
    };
    //reader.readAsDataURL(this.files[0]);
    //console.log(reader);
    // console.log(reader.result);
    //console.log(localStorage.getItem(imgName));
}

function isValidYear(year) {
    var regex = /^[1-9][0-9]{0,3}$/;
    return regex.test(year);
}

function setButtonPos() {
    var _widht = document.documentElement.clientWidth;
    var but = document.getElementById('subbut');
    var pre = document.getElementById('box');
    var right = _widht - pre.getBoundingClientRect().right;
    if(right > 0) {
        but.style.right = right+"px";
    }
    
}

var genres = {
    1: 'Cubism',
    33: 'Romanticism',
    34: 'Realism',
    35: 'Impressionism',
    36: 'Post-Impressionism',
    40: 'Fauvism',
    47: 'Surrealism',
    56: 'Expressionism',
    64: 'Symbolism',
    76: 'Neoclassicism',
    77: 'Northern Renaissance',
    78: 'Renaissance',
    79: 'High Renaissance',
    80: 'Mannerism',
    81: 'International Gothic',
    83: 'Rococo',
    84: 'Baroque',
    87: 'Dutch Golden Age',
    88: 'Academic Art'
};
var flag = true;
// 将下拉框添加到页面的某个元素中
var select_genre = document.getElementById("genre");
select_genre.onfocus = function(){
    // console.log("selectOK");
    if(flag) {
        for(let key in genres) {
            var opt=document.createElement("option");
            opt.innerHTML=genres[key];
            select_genre.appendChild(opt);

            //TOkDO: var name = genres[key];
            // var result = Object.entries(genres).find(([key, val]) => val === name);
            // console.log(result);
        }
        flag = false;
    }
    return;
}

function addImage() {
    //TOkDO: 裁剪、分辨率、存到对应文件夹
    var myDate = new Date().format("yyyyMMddhhmmss");
    // console.log(myDate.toLocaleString());
    var imgName = myDate.toLocaleString();
    var img = document.getElementById('image');
    
    // console.log(img.files[0]);
    baseImg(imgName+".jpg",img.files[0]);

    return imgName;
}

function getGenreID(genre) {
    var result = Object.entries(genres).find(([key, val]) => val === genre);
    // console.log(result);
    return result[0];
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null; //返回参数值
}

function isOwner(id,userID) {
    $.ajax({
        method : 'post',
        url : "../php/issue.php",
        dataType : "text",
        data : {
            PaintingID : id,
            UserID : userID,
        },
        success : function(ret) {
            //return ret;
            console.log(ret);
            if(ret != "yes") {
                window.location.href = "../html/error.html";
                return false;
            }
            // 处理
            console.log("here")
            getPaintingInfo(id);
        },
    })
}

function getPaintingInfo(id) {
    $.ajax({
        method : 'get',
        url : "../php/issue.php",
        dataType : "text",
        data : {
            PaintingID : id,
            myAPI : "update",
        },
        success : function(ret) {
            //return ret;
            var obj = JSON.parse(ret);
            console.log(obj);

            // 填充表单
            var title = document.getElementById('title');
            title.value = obj.Title;
            document.getElementById('artist').value = obj.ArtistName;
            document.getElementById('year').value = obj.YearOfWork;
            //document.getElementById('genre').innerHTML = obj.GenreName;
            var opt=document.createElement("option");
            opt.innerHTML=obj.GenreName;
            select_genre.appendChild(opt);
            opt.selected = true;
            document.getElementById('width').value = obj.Width;
            document.getElementById('height').value = obj.Height;
            document.getElementById('price').value = obj.MSRP;
            document.getElementById('image').required = false;
            document.getElementById('description').value = obj.Description;
            var img = document.getElementById('image_preview');
            img.src = "../image/large/"+obj.ImageFileName+".jpg";
            img.style.display = "block";

            registrationForm.addEventListener('submit', function(event) {
                // prevent the default form submission behavior
                event.preventDefault();
                
                if (!isValidYear(yearField.value)) {
                    //alert('请输入合法的用户名！');
                    myAlert('','请输入合法年份',function(){});
                    return;
                }
                if (titleField.value.length > 50) {
                    myAlert('','名称过长',function(){});
                    return;
                }
                if (artistField.value.length > 30) {
                    myAlert('','作者姓名过长',function(){});
                    return;
                }
            
                var newData = {};
                newData["myAPI"] = "update";
                newData["PaintingID"] = id;

                newData["Title"] = titleField.value;
                newData["LastName"] = artistField.value;
                newData["YearOfWork"] = yearField.value;
                newData["GenreID"] = getGenreID(genreField.value);
                newData["Width"] = widthField.value;
                newData["Height"] = heightField.value;
                newData["MSRP"] = priceField.value;
                newData["Description"] = descriptionField.value;
                var newImg = document.getElementById('image');

                console.log(newImg);
                console.log(newImg.files[0]);
                if(newImg.files[0]) {
                    newData["ImageFileName"] = addImage();
                }

                $.ajax({
                    method : 'post',
                    url : "../php/issue.php",
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
            });
            
        },
    })
}