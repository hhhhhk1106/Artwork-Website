var id = getUrlParam('id');
console.log(id);

if(id === null) {
    // window.location.href = "../html/error.html";
} else {
    $.ajax({
        method : 'get',
        url : "../php/comment.php",
        dataType : "text",
        data : {
            id : id,
            // myAPI : "hier1",
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
                console.log(obj);
                obj.forEach(element => {
                    showComment(element);
                });
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
    var div_commentheader = document.createElement("div");
    div_commentheader.className = "comment-header";
    var span_user = document.createElement("span");
    span_user.className = "comment-author";
    span_user.innerHTML = element.UserName;
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
    div_commentbody.appendChild(p);

    var div_commentfooter = document.createElement("div");
    div_commentfooter.className = "comment-footer";
    var reply_button = document.createElement("button");
    reply_button.className = "reply-button";
    reply_button.name = element.CommentID;
    reply_button.innerHTML = "回复";
    div_commentfooter.appendChild(reply_button);

    if(element.UserID == userID) {
        var delete_button = document.createElement("button");
        delete_button.className = "delete-button";
        delete_button.name = element.CommentID;
        delete_button.innerHTML = "删除";
        div_commentfooter.appendChild(delete_button);
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

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null; //返回参数值
}

