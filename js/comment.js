var id = getUrlParam('id');
console.log(id);
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

if(id === null) {
    // window.location.href = "../html/error.html";
} else {
    $.ajax({
        method : 'get',
        url : "../php/comment.php",
        dataType : "text",
        data : {
            id : id,
            myAPI : "load",
        },
        success : function(ret) {
            // console.log(ret);
            //未查询到该painting(id非数字或无对应数据)
            if(ret == "no") {
                //TOkDO:跳转
                // window.location.href = "../html/error.html";
            } else {
                //显示
                var obj = JSON.parse(ret);
                // showInfo(obj);
                // console.log(obj);
                obj.forEach(element => {
                    showComment(element);
                });
                dealReply();
            }
        },
    })
}


// TODO: 由PaintingID查询一级评论  用户名 时间
// 由一级评论查询二级评论，评论中评论展示回复用户
// 点赞数，本人点赞样式
function showComment(element) {
    var commentlist = document.getElementById('commentlist');
    var div_comment = createComment(element);

    var div_replies = document.createElement("div");
    div_replies.className = "comment-replies";
    var replies = element.Replies;
    if(replies) {
        replies.forEach(element =>{
            var div_replycomment = createComment(element);
            div_replies.appendChild(div_replycomment);
        })
    }

    div_comment.appendChild(div_replies);
    commentlist.appendChild(div_comment);

}

function createComment(element) {
    var div_comment = document.createElement("div");
    div_comment.className = "comment";
    div_comment.name = element.CommentID;
    div_comment.userID = element.UserID;
    var div_commentheader = document.createElement("div");
    div_commentheader.className = "comment-header";
    var span_user = document.createElement("span");
    span_user.className = "comment-author";
    span_user.innerHTML = element.UserName;
    var state = element.State;
    //ReplyUserName
    if(element.ReplyUserName) {
        span_user.innerHTML += "&emsp;回复&emsp;" + element.ReplyUserName;
    }
    div_commentheader.appendChild(span_user);
    var span_date = document.createElement("span");
    span_date.className = "comment-date";
    span_date.innerHTML = element.ReviewDate;
    div_commentheader.appendChild(span_date);

    var div_commentbody = document.createElement("div");
    div_commentbody.className = "comment-body";
    var p = document.createElement("p");
    p.innerHTML = element.Comment;
    if(state) p.innerHTML = "该评论已删除";
    div_commentbody.appendChild(p);

    var div_commentfooter = document.createElement("div");
    div_commentfooter.className = "comment-footer";
    var reply_button = document.createElement("button");
    reply_button.className = "reply-button";
    reply_button.name = element.CommentID;
    reply_button.innerHTML = "回复";
    if(!state) div_commentfooter.appendChild(reply_button);

    if(element.UserID == userID) {
        var delete_button = document.createElement("button");
        delete_button.className = "delete-button";
        delete_button.name = element.CommentID;
        delete_button.innerHTML = "删除";
        delete_button.onclick = function() {
            deleteComment(element);
        }
        if(!state) div_commentfooter.appendChild(delete_button);
    }
    var like_button = document.createElement("button");
    like_button.className = "like-button";
    like_button.name = element.CommentID;
    like_button.innerHTML = "赞 0"; // TODO:
    div_commentfooter.appendChild(like_button);

    div_comment.appendChild(div_commentheader);
    div_comment.appendChild(div_commentbody);
    div_comment.appendChild(div_commentfooter);
    return div_comment;
}

function deleteComment(element) {
    console.log(element);
    myConfirm('','确认删除该评论？',function(ret){
        console.log(ret);
        if(ret) {
            var CommentID = element.CommentID;
            // deleteCart(element,userID);
            $.ajax({
                method : 'post',
                url : "../php/comment.php",
                dataType : "text",
                data : {
                    myAPI : "delete",
                    UserID : userID,
                    CommentID : CommentID,
                },
                success : function(ret) {
                    console.log(ret);
                    if(ret == "success") {
                        //TOkDO:跳转
                        displayAlert('success','评论删除成功！',1500);
                        setTimeout(function(){window.location.reload();},1500);
                        // window.location.reload();
                    } else {

                    }
                },
            })
        }
    });
}

var newcomment = document.getElementById('newcomment');
newcomment.onclick = function() {
    if(!userID) {
        myAlert('','请登录后再发表评论',function(){});
    } else {
        var newcommenttext = document.getElementById('newcommenttext').value;
        console.log(newcommenttext);
        if(!newcommenttext) {
            myAlert('','评论内容为空',function(){});
        } else {
            //插入评论
            var myDate = new Date().format("yyyy-MM-dd hh:mm:ss");
            $.ajax({
                method : 'post',
                url : "../php/comment.php",
                dataType : "text",
                data : {
                    PaintingID : id,
                    myAPI : "comment",
                    UserID : userID,
                    ReviewDate : myDate,
                    Comment : newcommenttext,
                    Hierarchy : 1,
                },
                success : function(ret) {
                    console.log(ret);
                    if(ret == "success") {
                        //TOkDO:跳转
                        displayAlert('success','评论发布成功！',1500);
                        setTimeout(function(){window.location.reload();},1500);
                        // window.location.reload();
                    } else {

                    }
                },
            })
        }
    }
}

function dealReply() {
    var newreply = document.getElementsByClassName('reply-button');
    // console.log(newreply);
    for(var i=0;i<newreply.length;i++) {
        // console.log(newreply[i])
        newreply[i].onclick = function() {
            if(!userID) {
                myAlert('','请登录后再进行回复',function(){});
            } else {
                var hier = this.parentElement.parentElement.parentElement.className;
                var replyCommentID = this.parentElement.parentElement.name;
                var info = [];
                // info["hier"] = hier;
                info["replyCommentID"] = replyCommentID;
                // console.log(hier);
                if(hier == "comment-list") {
                    // 一级评论
                    // console.log(replyCommentID);
                    console.log(this.parentElement.parentElement.lastChild);
                    var replylist = this.parentElement.parentElement.lastChild;
                    var div = document.createElement("div");
                    div.className = "comment-form";
                    var textarea = document.createElement("textarea");
                    var subbutton = document.createElement("button");
                    subbutton.innerHTML = "提交";
                    div.appendChild(textarea);
                    div.appendChild(subbutton);
                    replylist.appendChild(div);
                    subbutton.onclick = function() {
                        console.log(textarea.value);
                        info["text"] = textarea.value;
                        sendReply(info);
                    }
                } else if (hier == "comment-replies") {
                    // 二级评论
                    replyCommentID = this.parentElement.parentElement.parentElement.parentElement.name;
                    info["replyCommentID"] = replyCommentID;
                    var replyUserID = this.parentElement.parentElement.userID;
                    console.log(replyUserID);
                    info["replyUserID"] = replyUserID;
                    var replylist = this.parentElement.parentElement;
                    var div = document.createElement("div");
                    div.className = "comment-form";
                    var textarea = document.createElement("textarea");
                    var subbutton = document.createElement("button");
                    subbutton.innerHTML = "提交";
                    div.appendChild(textarea);
                    div.appendChild(subbutton);
                    replylist.appendChild(div);
                    subbutton.onclick = function() {
                        console.log(textarea.value);
                        info["text"] = textarea.value;
                        sendReply(info);
                    }

                }
                // dealReply(newreply[i]);
            }
        }
    }
}

function sendReply(info) {
    if(!info["text"]) {
        myAlert('','评论内容为空',function(){});
    } else {
        var myDate = new Date().format("yyyy-MM-dd hh:mm:ss");
        $.ajax({
            method : 'post',
            url : "../php/comment.php",
            dataType : "text",
            data : {
                ReplyCommentID : info["replyCommentID"],
                myAPI : "reply",
                UserID : userID,
                ReviewDate : myDate,
                Comment : info["text"],
                Hierarchy : 2,
                ReplyUserID : info["replyUserID"],
            },
            success : function(ret) {
                console.log(ret);
                if(ret == "success") {
                    displayAlert('success','回复成功！',1500);
                    setTimeout(function(){window.location.reload();},1500);
                    // window.location.reload();
                } else {

                }
            },
        })
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

