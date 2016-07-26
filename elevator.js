$(function() {
  	/*左侧菜单点击事件 start*/
  	var loading = new Array();
	var b = [];
	var conTop = $(".floor-list").offset().top;
	var rangetop = [];var jump = false;
	var hh = $(window).height();
	$(".lazy-floor").each(function(a) {
		if(!jump){
			var e = $(this);
			loading[a] = false;
			e.index = a;
			rangetop[a] = [];
			rangetop[a]['s'] = e.offset().top;
			rangetop[a]['e'] = e.offset().top + hh + e.height();//距离顶部高度 + 屏幕高度 + 自身div高度 （从出现到完全消失的距离 ）
		}
	});
	window.onscroll = function() {
		var scrt = $(window).scrollTop();
		(scrt > conTop-hh) ? $(".elevator").fadeIn("slow") : $(".elevator").fadeOut("slow");
		for(var i=0;i<rangetop.length;i++){
			var dst = $(document).scrollTop();
			if(i == 0){
				dst + hh > rangetop[i]['s'] && b.push(i)		// 1楼 出现 显示层数
			}else{
				dst + hh / 2 > rangetop[i]['s'] && b.push(i)	//楼层位置超过屏幕一半  显示层数变更
			}
			if(rangetop[i]['e'] >  dst + hh  && dst + hh + 100 > rangetop[i]['s'] ){ // 出现在屏幕前 加载楼层内容
				addFloor($(".lazy-floor").eq(i),i);
			}
		}
		b.length && ($(".elevator li").eq(b[b.length - 1]).addClass("current").siblings().removeClass("current"), b = [])
	};
	$(".elevator li").each(function(a) {
		$(this).click(function() {
			jump = true;b = [];
			$("html,body").animate({
				scrollTop: $(".lazy-floor").eq(a).offset().top  + "px"
			}, 1000,'',function(){
				var scrt = $(window).scrollTop();
				(scrt > conTop-hh) ? $(".elevator").fadeIn("slow") : $(".elevator").fadeOut("slow");
				for(var i=0;i<rangetop.length;i++){
					var dst = $(document).scrollTop();
					if(rangetop[i]['e'] >  dst + hh  && dst + hh + 100 > rangetop[i]['s'] ){ // 出现在屏幕前 加载楼层内容
						addFloor($(".lazy-floor").eq(i),i);
					}
				}
				jump = false;
			});
		})
	});
	window.onload = window.onresize = function() {
		if(conTop < hh+$(document).scrollTop()){ 
			$(".elevator").fadeIn("slow");
			$(window).scroll()
		}else{
			$(".elevator").fadeOut("slow")
			
		};
	}
	/*end*/

	function addFloor(divObj,i){
		if(loading[i]){
			return false
		}
		if(!divObj.hasClass('lazy-floor-done')){
			loading[i] = true;
			$.ajax({
	  			type: "GET",
	  			url: divObj.attr('data-path'),
	  			dataType:"json",
	  		    success: function(result){
					if(result.status == 1){
						divObj.html('<span>'+ (i+1)+'F</span>'+result.data);
						//setTimeout(function(){divObj.html('<span>'+ (i+1)+'F</span>'+result.data)},1000); //加载太快，延迟看效果
						divObj.addClass('lazy-floor-done');loading[i] = false;
					}
	  		    }
	  		});
  		}
  	}
});
