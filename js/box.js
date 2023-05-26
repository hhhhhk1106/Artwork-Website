// got from web
// https://blog.csdn.net/Alisa_vc/article/details/89486927?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168502334116800217230376%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=168502334116800217230376&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-6-89486927-null-null.142^v88^insert_down28v1,239^v2^insert_chatgpt&utm_term=js%20confirm%E6%A0%B7%E5%BC%8F&spm=1018.2226.3001.4187
// https://blog.csdn.net/weixin_44074105/article/details/124175144


//type:success, error, info
//time:ms
function displayAlert(type, data, time){

    var lunbo=document.createElement("div");
    
    if(type == "success") {
        lunbo.style.backgroundColor = "white";
    } else if(type == "error") {
        lunbo.style.backgroundColor = "#990000";
    } else if(type == "info") {
        lunbo.style.backgroundColor = "#e6b800";
    } else {
        console.log("入参type错误");
        return;
    }

    var _widht = document.documentElement.clientWidth; //屏幕宽  
    var _height = document.documentElement.clientHeight; //屏幕高  
    
    // var boxWidth = $("#mb_con").width();  
    // var boxHeight = $("#mb_con").height();  


    lunbo.id="lunbo";
    lunbo.style.position = "fixed";
    lunbo.style.width = "200px";
    lunbo.style.height = "50px";
    // lunbo.style.marginLeft = "-100px";
    // lunbo.style.marginTop = "-30px";
    lunbo.style.left = (_widht - 180) / 2 + "px";
    lunbo.style.top = "10px";
    lunbo.style.fontSize = "18px";
    lunbo.style.borderRadius = "10px";
    lunbo.style.textAlign="center";
    lunbo.style.lineHeight="50px";
    lunbo.style.boxShadow="0 0 8px #ccc";

    if(document.getElementById("lunbo")==null){
        document.body.appendChild(lunbo);
        lunbo.innerHTML=data;
        setTimeout(function(){
            document.body.removeChild(lunbo);
        } ,time);
    }
}


(function($) {
    $.alerts = {         
        alert: function(title, message, callback) {  
            if( title == null ) title = 'Alert';  
            $.alerts._show(title, message, null, 'alert', function(result) {  
                if( callback ) callback(result);  
            });  
        },  
           
        confirm: function(title, message, callback) {  
            if( title == null ) title = 'Confirm';  
            $.alerts._show(title, message, null, 'confirm', function(result) {  
                if( callback ) callback(result);  
            });  
        },  
               
        _show: function(title, msg, value, type, callback) {  
            
            var _html = "";  

            _html += '<div id="mb_box"></div><div id="mb_con"><span id="mb_tit">' + title + '</span>';  
            _html += '<div id="mb_msg">' + msg + '</div><div id="mb_btnbox">';  
            if (type == "alert") {  
                _html += '<input id="mb_btn_ok" type="button" value="确定" />';  
            }  
            if (type == "confirm") {  
                _html += '<input id="mb_btn_no" type="button" value="取消" />';  
                _html += '<input id="mb_btn_ok" type="button" value="确定" />';  
            }  
            _html += '</div></div>';  
            
            //必须先将_html添加到body，再设置Css样式  
            $("body").append(_html); GenerateCss();  
           
            switch( type ) {  
                case 'alert':  
          
                    $("#mb_btn_ok").click( function() {  
                        $.alerts._hide();  
                        callback(true);  
                    });  
                    $("#mb_btn_ok").focus().keypress( function(e) {  
                        if( e.keyCode == 13 || e.keyCode == 27 ) $("#mb_btn_ok").trigger('click');  
                    });  
                break;  
                case 'confirm':  
                     
                    $("#mb_btn_ok").click( function() {  
                        $.alerts._hide();  
                        if( callback ) callback(true);  
                    });  
                    $("#mb_btn_no").click( function() {  
                        $.alerts._hide();  
                        if( callback ) callback(false);  
                    });
                break;
            }  
        },  
        _hide: function() {  
             $("#mb_box,#mb_con").remove();  
        }  
    }  
    // Shortuct functions  
    myAlert = function(title, message, callback) {  
        $.alerts.alert(title, message, callback);  
    }  
       
    myConfirm = function(title, message, callback) {  
        $.alerts.confirm(title, message, callback);  
    };  
           
   
      
    //生成Css  
    var GenerateCss = function () {  
   
        $("#mb_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',  
        filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.6'  
        });  
    
        $("#mb_con").css({ zIndex: '999999', width: '350px',height:'200px', position: 'fixed',  
        backgroundColor: 'White', borderRadius: '8px'
        });  
    
        $("#mb_tit").css({ display: 'block', fontSize: '14px', color: '#444', padding: '10px 15px',  
        backgroundColor: '#fff', borderRadius: '15px 15px 0 0',  
        fontWeight: 'bold'  
        });  
    
        $("#mb_msg").css({ padding: '20px', lineHeight: '40px', textAlign:'center', 
        fontSize: '18px' ,color:'#4c4c4c' 
        });  
    
        $("#mb_ico").css({ display: 'block', position: 'absolute', right: '10px', top: '9px',  
        border: '1px solid Gray', width: '18px', height: '18px', textAlign: 'center',  
        lineHeight: '16px', cursor: 'pointer', borderRadius: '12px', fontFamily: '微软雅黑'  
        });  
    
        $("#mb_btnbox").css({ margin: '15px 0px 10px 0', textAlign: 'center' });  
        $("#mb_btn_ok,#mb_btn_no").css({ width: '80px', height: '30px', color: 'white', border: 'none', borderRadius:'4px', padding: '0'});  
        $("#mb_btn_ok").css({ backgroundColor: 'crimson' });  
        $("#mb_btn_no").css({ backgroundColor: 'gray', marginRight: '40px' });  
    
    
        //右上角关闭按钮hover样式  
        $("#mb_ico").hover(function () {  
            $(this).css({ backgroundColor: 'Red', color: 'White' });  
        }, function () {  
            $(this).css({ backgroundColor: '#DDD', color: 'black' });  
        });  
        $("#mb_btn_ok").hover(function () {  
            $(this).css({ backgroundColor: 'darkred', color: 'White' });  
        }, function () {  
            $(this).css({ backgroundColor: 'crimson'});  
        }); 
        $("#mb_btn_no").hover(function () {  
            $(this).css({ backgroundColor: 'dimgray', color: 'White' });  
        }, function () {  
            $(this).css({ backgroundColor: 'gray'});  
        }); 
    
        var _widht = document.documentElement.clientWidth; //屏幕宽  
        var _height = document.documentElement.clientHeight; //屏幕高  
    
        var boxWidth = $("#mb_con").width();  
        var boxHeight = $("#mb_con").height();  
    
        //让提示框居中  
        $("#mb_con").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });  
    }  
   
  
})(jQuery);