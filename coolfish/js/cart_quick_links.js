jQuery(function($){
	//鍒涘缓DOM
	var 
	quickHTML = document.querySelector("div.quick_link_mian"),
	quickShell = $(document.createElement('div')).html(quickHTML).addClass('quick_links_wrap'),
	quickLinks = quickShell.find('.quick_links');
	quickPanel = quickLinks.next();
	quickShell.appendTo('.mui-mbar-tabs');
	open_tb = $(".J-open-tb");
	
	//鍏蜂綋鏁版嵁鎿嶄綔 
	var 
	quickPopXHR,
	loadingTmpl = '<div class="loading" style="padding:30px 80px"><i></i><span>Loading...</span></div>',
	popTmpl = '<a href="javascript:;" class="ibar_closebtn" title="鍏抽棴"></a><div class="ibar_plugin_title"><h3><%=title%></h3></div><div class="pop_panel"><%=content%></div><div class="arrow"><i></i></div><div class="fix_bg"></div>',
	historyListTmpl = '<ul><%for(var i=0,len=items.length; i<5&&i<len; i++){%><li><a href="<%=items[i].productUrl%>" target="_blank" class="pic"><img alt="<%=items[i].productName%>" src="<%=items[i].productImage%>" width="60" height="60"/></a><a href="<%=items[i].productUrl%>" title="<%=items[i].productName%>" target="_blank" class="tit"><%=items[i].productName%></a><div class="price" title="鍗曚环"><em>&yen;<%=items[i].productPrice%></em></div></li><%}%></ul>',
	newMsgTmpl = '<ul><li><a href="#"><span class="tips">鏂板洖澶�<em class="num"><b><%=items.commentNewReply%></b></em></span>鍟嗗搧璇勪环/鏅掑崟</a></li><li><a href="#"><span class="tips">鏂板洖澶�<em class="num"><b><%=items.consultNewReply%></b></em></span>鍟嗗搧鍜ㄨ</a></li><li><a href="#"><span class="tips">鏂板洖澶�<em class="num"><b><%=items.messageNewReply%></b></em></span>鎴戠殑鐣欒█</a></li><li><a href="#"><span class="tips">鏂伴€氱煡<em class="num"><b><%=items.arrivalNewNotice%></b></em></span>鍒拌揣閫氱煡</a></li><li><a href="#"><span class="tips">鏂伴€氱煡<em class="num"><b><%=items.reduceNewNotice%></b></em></span>闄嶄环鎻愰啋</a></li></ul>',
	quickPop = quickShell.find('#quick_links_pop'),
	quickDataFns = {
		//璐墿淇℃伅
		cart_list: {
			title: '',
			content: null,
			init:$.noop
		},
		mpbtn_total:{
			title: '',
			content: null,
			init:$.noop
		},
		mpbtn_history:{
			title: '',
			content:'',
			init: $.noop
		},
		mpbtn_collection:{
			title: '',
			content: null ,
			init: $.noop
		},
		mpbtn_order:{
			title: '',
			content: null,
			init: $.noop
		},
		mpbtn_yhq:{
			title: '',
			content: null,
			init: $.noop
		}
	};
	
	//showQuickPop
	var 
	prevPopType,
	prevTrigger,
	doc = $(document),
	popDisplayed = false,
	popDisplayed2 = false,
	
	hideQuickPop = function(){
		if(prevTrigger){
			prevTrigger.removeClass('current');
		}
		popDisplayed = false;
		prevPopType = '';
		quickShell.css({width:40});
	},
	
	showQuickPop = function(type){
		if(quickPopXHR && quickPopXHR.abort){
			quickPopXHR.abort();
		}
		if(type !== prevPopType){
			var fn = quickDataFns[type];
			
			quickShell.css({width:320});
			
			function return_content(result)
			{
				fn.content=result.content
				quickPop.html(ds.tmpl(popTmpl, fn));
				fn.init.call(this, fn);
			}
			
			Ajax.call('get_ajax_content.php?act=get_content', 'data_type=' + type, return_content, 'POST', 'JSON');
			
		}
		//doc.unbind('click.quick_links').one('click.quick_links', hideQuickPop);
		
		quickPop[0].className = 'quick_links_pop quick_' + type;
		popDisplayed = true;
		prevPopType = type;
		quickPop.show();
	};
	quickShell.bind('click.quick_links', function(e){
		e.stopPropagation();
	});
	
	quickPop.delegate('a.ibar_closebtn','click',function(){
		if(prevTrigger){
			prevTrigger.removeClass('current');
		}
		popDisplayed = false;
		prevPopType='';
		quickShell.css({width:40});
	});
	
	
	var 
	view = $(window),
	quickLinkCollapsed = !!ds.getCookie('ql_collapse'),
	getHandlerType = function(className){
		return className.replace(/current/g, '').replace(/\s+/, '');
	},
	showPopFn = function(obj){
		if(obj == null){
			var type = getHandlerType(this.className);
			
			if(popDisplayed && type === prevPopType){
				return hideQuickPop();
			}
			
			showQuickPop(this.className);
		}else{
			var type = getHandlerType(obj);
			
			if(popDisplayed && type === prevPopType){
				return hideQuickPop();
			}
			
			showQuickPop(obj);
		}
		if(prevTrigger){
			prevTrigger.removeClass('current');
		}
		prevTrigger = $(this).addClass('current');
	},
	quickHandlers = {
		
		my_qlinks: showPopFn,
		cart_list: showPopFn,
		mpbtn_total: showPopFn,
		leave_message: showPopFn,
		mpbtn_history:showPopFn,
		mpbtn_order:showPopFn,
		mpbtn_collection:showPopFn,
		mpbtn_yhq:showPopFn,
		
		return_top: function(){
			ds.scrollTo(0, 0);
			hideReturnTop();
		}
	};
	
	quickShell.delegate('a', 'click', function(e){
		var type = getHandlerType(this.className);
		if(type && quickHandlers[type]){
			quickHandlers[type].call(this);
			e.preventDefault();
		}
	});
	
	open_tb.bind('click.J-open-tb',function(e){
		var type = $(".mpbtn_yhq").attr("class");
		showPopFn(type);
	});
	
	doc.click(function(e){
		var target = $(e.target);
		if(target.closest(".J-open-tb,.quick_links").length == 0){
			hideQuickPop();
		}
	});
	
	//Return top
	var scrollTimer, resizeTimer, minWidth = 1350;

	function resizeHandler(){
		clearTimeout(scrollTimer);
		scrollTimer = setTimeout(checkScroll, 160);
	}
	
	function checkResize(){
		quickShell[view.width() > 1340 ? 'removeClass' : 'addClass']('quick_links_dockright');
	}
	function scrollHandler(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(checkResize, 160);
	}
	function checkScroll(){
		view.scrollTop()>100 ? showReturnTop() : hideReturnTop();
	}
	function showReturnTop(){
		quickPanel.addClass('quick_links_allow_gotop');
	}
	function hideReturnTop(){
		quickPanel.removeClass('quick_links_allow_gotop');
	}
	view.bind('scroll.go_top', resizeHandler).bind('resize.quick_links', scrollHandler);
	quickLinkCollapsed && quickShell.addClass('quick_links_min');
	resizeHandler();
	scrollHandler();
});