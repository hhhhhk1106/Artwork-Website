
window.addEventListener('load',function(){
    var focus=document.querySelector('.slider')
    var ul=focus.children[0]
    var ol=focus.children[1]
    var focusWidth=focus.offsetWidth
    var index=0
    var timer=setInterval(function(){
        index++
        // 移动距离
        var step=-index*focusWidth
        ul.style.transition='all .3s'
        ul.style.transform='translateX('+step+'px)'
    },2000);
    //判断过渡是否完成
    ul.addEventListener('transitionend',function(){
        //如果到达第三张图片，将无缝跳转到第一张
        if(index>=ul.children.length-2){
            index=0
            ul.style.transition='none'
            var step=-index*focusWidth
            ul.style.transform='translateX('+step+'px)'
        }
        else if(index<0){
            index=ul.children.length-3//跳转到第三张图片
            ul.style.transition='none'
            var step=-index*focusWidth
            ul.style.transform='translateX('+step+'px)'
        }
        //小圆点跟随变化
        ol.querySelector('.current').classList.remove('current')
        ol.children[index].classList.add('current')
    })
    //手指拖动图片
    // 初始位置
    var startX=0
    var moveX=0
    var flag=false
    ul.addEventListener('touchstart', function (e) {
        // 获取鼠标位置
        startX = e.targetTouches[0].pageX
        clearInterval(timer)
        
    })
    ul.addEventListener('touchmove', function (e) {
        moveX = e.targetTouches[0].pageX-startX
        // 盒子位置=初始位置+盒子移动距离
        var step=-index*focusWidth+moveX
        ul.style.transition='none'
        ul.style.transform='translateX('+step+'px)'
        flag=true //触发移动事件，flag为true 
    })
    //手指左右滑动切换图片
    ul.addEventListener('touchend',function(){
        if(flag){
            if(Math.abs(moveX)>50){
                //右滑上一张，当位于第一张图片是，index<0
                if(moveX>0){
                    index--
                }else{
                    index++  //左滑下一张
                }
                var step=-index*focusWidth
                ul.style.transition='all .3s'
                ul.style.transform='translateX('+step+'px)' 
            }else{
                var step=-index*focusWidth
                ul.style.transition='all .1s'
                ul.style.transform='translateX('+step+'px)'
            }
        }
        // 左右互动距离大于50，就切换上/或下一张图片
        clearInterval(timer)
        timer=setInterval(function(){
            index++
            // 移动距离
            var step=-index*focusWidth
            ul.style.transition='all .3s'
            ul.style.transform='translateX('+step+'px)'
        },2000);
        
    })
})

