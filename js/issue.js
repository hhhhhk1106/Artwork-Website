var userID = sessionStorage.getItem("userID");
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
} else {
    setButtonPos();
    window.onresize = function() {
        setButtonPos();
    }
    document.querySelector("#image").addEventListener("click", function(evt) {
        addImage();
    })
    
    
    var yearField = document.querySelector('#year');
    var titleField = document.querySelector('#title');
    var artistField = document.querySelector('#artist');
    var genreField = document.querySelector('#genre');
    var widthField = document.querySelector('#width');
    var heightField = document.querySelector('#height');
    var priceField = document.querySelector('#price');
    var descriptionField = document.querySelector('#description');
    var imageField = document.querySelector('#image');
    
    // var submitButton = document.getElementById('subbut');
    // var realSubmit = document.getElementById('realsub');
    // submitButton.onclick = function() {
    //     realSubmit.click();
    //     registrationForm.submit();
    // }
    

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

    registrationForm.addEventListener('submit', function(event) {
        // prevent the default form submission behavior
        event.preventDefault();
        console.log("subOK")
        // validate the input fields
        
        if (!isValidYear(yearField.value)) {
            //alert('请输入合法的用户名！');
            myAlert('','请输入合法年份',function(){
                // console.log("??");
            });
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
                ImageFileName : addImage(imageField.value),
                IssueUserID : userID,
            },
            success : function(ret) {
                obj = JSON.parse(ret);
                console.log(obj);
                displayAlert('success','注册成功！',150000);
                // if(ret == "already") {
                //     myAlert('','用户名已存在',function(){});
                // } else if(ret == "captchaExpired") {
                //     myAlert('','验证码已经过期，<br>请刷新页面重试。',function(){});
                // } else if(ret == "captchaWrong") {
                //     myAlert('','您输入的验证码不正确！<br>请刷新页面重试。',function(){});
                // } else if(ret == "success") {
                //     displayAlert('success','注册成功！',1500);
                //     // displayAlert('success','2秒后跳转',1500);  // css被挡住了
                //     setTimeout(function(){window.location.href='../html/login.html';},1500);
                // } else {
                //     myAlert('','注册失败，请稍后再试',function(){});
                // }

                // var line = document.getElementsByName(paintingID);
                // line[0].style.display = 'none';
            }
        })


    });
    
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
    console.log("selectOK");
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

function addImage(image) {
    //TODO: 裁剪、分辨率、存到对应文件夹
    var myDate = new Date().format("yyyyMMddhhmmss");
    // console.log(myDate.toLocaleString());
    var imgName = myDate.toLocaleString()+".jpg";
    var img = document.getElementById('image');
    
    console.log(img.files[0]);
    

    return imgName;
}

function getGenreID(genre) {
    var result = Object.entries(genres).find(([key, val]) => val === genre);
    console.log(result);
    return result[0];
}

