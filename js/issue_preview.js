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

document.querySelector("#image").addEventListener("change", function(evt) {
    
    localStorage.clear();
    var image_src = URL.createObjectURL(this.files[0]);
    var img = document.getElementById("image_preview");
    img.src = image_src;
    img.style.display = "block";
    console.log(image_src);
    //console.log(this);
    //TODO: 大小提示
    
    console.log(this.files);

    var myDate = new Date().format("yyyyMMddhhmmss");
    var imgName = myDate.toLocaleString()+".jpg";

    this.files[0].name = imgName;
    console.log(this.files[0]);

    //TODO: 提交再调用
    baseImg(imgName,this.files[0]);

})

function baseImg(imgName,file) {
    var reader = new FileReader();
    console.log(reader);
    reader.readAsDataURL(file);
    reader.onload = () => {
        localStorage.setItem(imgName, reader.result);
        console.log(localStorage);
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
    console.log(reader);
    console.log(reader.result);
    //console.log(localStorage.getItem(imgName));
}