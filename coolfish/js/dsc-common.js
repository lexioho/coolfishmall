/*
**Name:dsc-common.js
**Author:ecmoban Team sunle
**Description:Commonly used JS
**Date:2017-02-06 15:30:30
*/

$(function(){
	var user_id = 0,	
		goods_id = 0,	
		ru_id = 0,		
		store_id = 0,	
		hoverTimer, outTimer,
		doc = $(document);
	$("*[data-ectype='dorpdown']").hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});
	
	$("#site-nav").jScroll();
	
	$(".crumbs-nav-item .menu-drop").hover(function(){
		$(this).addClass("menu-drop-open");
	},function(){
		$(this).removeClass("menu-drop-open");
	});
	
	doc.on("click","[ectype='returnTop']",function(){
		$("body,html").animate({scrollTop:0});
	});
	
	$("*[ectype='close']").click(function(){
		$(this).parents(".top-banner").hide();
	});
	
	$(".help-scan .tabs li").hover(function(){
		var t = $(this);
		var index = t.index();
		t.addClass("curr").siblings().removeClass("curr");
		$(".code").find(".code_tp").eq(index).show().siblings().hide();
	});
	
	$(".fP-box input").click(function(){
		$('.fP-expand').show();
	});
	
	$('.ui-btn-submit').click(function(){
		var min_price = Number($(".price-min").val());
		var max_price = Number($(".price-max").val());
		
		if(min_price == '' && max_price == ''){
			pbDialog(screen_price,"",0);
			return false;
		}else if(min_price == ''){
			pbDialog(screen_price_left,"",0);
			return false;
		}else if(max_price == ''){
			pbDialog(screen_price_right,"",0);
			return false;
		}else if(min_price > max_price || min_price == max_price){
			pbDialog(screen_price_dy,"",0,"","",70);
			return false;
		}
		$("form[name='listform']").submit();
	});
	
	$('.ui-btn-clear').click(function(){
		$("input[name='price_min']").val('');
		$("input[name='price_max']").val('');
	});
	$.inputPrompt("#keyword",true,$('#keyword').val());
	$.inputPrompt("#keyword2",true,$('#keyword2').val());
	
	$("*[ectype='cateItem']").on('mouseenter',function(){
		var T = $(this),
			cat_id = T.data('id'),
			eveval = T.data('eveval'),
			layer = T.find("*[ectype='cateLayer']");
		
		if(eveval != 1){
			T.data('eveval', '1');
			layer.find("*[ectype='subitems_" + cat_id + "']").html('<img src="themes/ecmoban_dsc2017/images/load/loadGoods.gif" width="200" height="200" class="lazy">');
			$.ajax({
			   type: "GET",
			   url: "ajax_dialog.php",
			   data: "act=getCategoryCallback&cat_id=" + cat_id,
			   dataType:'json',
			   success: function(data){
					var strLength = Number(data.topic_content.length),
						channels = $("*[ectype='channels_" + data.cat_id + "']"),
						subitems = $("*[ectype='subitems_" + data.cat_id + "']"),
						brands = $("*[ectype='brands_" + data.cat_id + "']");
					if(strLength == 2 || strLength == 0){
						channels.hide();
					}
					channels.html(data.topic_content);
					subitems.html(data.cat_content);
					brands.html(data.brands_ad_content);
			   }
			});
		}

		T.addClass("selected");
		layer.show();
	}).on("mouseleave",function(){
		var T = $(this),layer = T.parent().find("*[ectype='cateLayer']");
		T.removeClass("selected");
		layer.hide();
	});
	
	$("*[ectype='items'] *[ectype='item']").on('mouseenter',function(){
		var T = $(this),
			cat_id = T.data('catid'),
			eveval = T.data('eveval'),
			layer = T.find("*[ectype='cateLayer']"),
            defa = '';
		if(T.data('defa')){
			defa = T.data('defa');
		}
		if(eveval != 1){
			T.data('eveval', '1');
			layer.find("*[ectype='subitems_" + cat_id + "']").html('<img src="themes/ecmoban_dsc2017/images/load/loadGoods.gif" width="200" height="200" class="lazy">');
			$.ajax({
			   type: "GET",
			   url: "get_ajax_content.php",
			   data: "act=getCategotyParentTree&cat_id=" + cat_id + "&defa=" + defa,
			   dataType:'json',
			   success: function(data){
				 $("*[ectype='subitems_" + data.cat_id + "']").html(data.brands_content);
			   }
			});
		}

		T.addClass("selected");
		layer.show();
	}).on("mouseleave",function(){
		var T = $(this),layer = T.parent().find("*[ectype='cateLayer']");
		T.removeClass("selected");
		layer.hide();
	});	
	
	$(document).click(function(e){
		if(e.target.className !='sales-promotion' && !$(e.target).parents("div").is("[ectype='promInfo']")){
			$("[ectype='promInfo']").removeClass("prom-hover");
		}
		
		if(e.target.id !='price-min' && e.target.id !='price-max'){
			$('.fP-expand').hide();
		}
		
		if(e.target.className !='cite' && !$(e.target).parents("div").is(".imitate_select")){
			$('.imitate_select ul').hide();
		}
		
		if(e.target.id !='btn-anchor' && !$(e.target).parents("div").is(".tb-popsku")){
			$('.tb-popsku').hide();
		}
	});
	
	$(".value-item").click(function(){
		$(this).addClass("selected").siblings().removeClass("selected");
	});
	
	$(document).on("click",".imitate_select .cite",function(){
		$(".imitate_select ul").hide();
		$(this).parents(".imitate_select").find("ul").show();
		$(this).siblings("ul").perfectScrollbar("destroy");
		$(this).siblings("ul").perfectScrollbar();
	});
	
	$(document).on("click",".imitate_select li  a",function(){
		var _this = $(this);
		var val = _this.data('value');
		var text = _this.html();
		_this.parents(".imitate_select").find(".cite span").html(text).css("color","#707070");
		_this.parents(".imitate_select").find("input[type=hidden]").val(val);
		_this.parents(".imitate_select").find("ul").hide();
	});
	$("input.text").focus(function(){
		$(this).parents(".item").addClass("item-focus");
	});
	
	$("input.text").blur(function(){
		$(this).parents(".item").removeClass("item-focus");
	});
	
	$(document).on("click","*[ectype='coll_brand']",function(){
		var user_id = $("input[name=user_id]").val();
		if(user_id > 0){
			var brand_id = $(this).data('bid');
			if($(this).find("i").hasClass("icon-zan-alts")){
				$(this).find("i").removeClass("icon-zan-alts").addClass("icon-zan-alt");
				Ajax.call('brandn.php', 'act=cancel&id=' + brand_id +'&user_id='+user_id, collect_brandResponse, 'POST', 'JSON');
			}else{
				$(this).find("i").removeClass("icon-zan-alt").addClass("icon-zan-alts");
				Ajax.call('brandn.php', 'act=collect&id=' + brand_id, collect_brandResponse, 'POST', 'JSON');
			}
		}else{
            var back_url = "brand.php";
			$.notLogin("get_ajax_content.php?act=get_login_dialog",back_url);	
		}
	});
	
	function collect_brandResponse(result)
	{
        $("#collect_count").html(result.collect_count);
		$("#collect_count_"+result.brand_id).html(result.collect_count);
	}
	
	$(document).on(" click","*[ectype='lieMore']",function(){
		var t = $(this);
		var parent = t.parents("*[ectype='lieItems']");
		if(t.hasClass("lie-down")){
			t.removeClass("lie-down");
			t.find("i").addClass("icon-down").removeClass("icon-up");
			parent.find("*[ectype='lieItem']").addClass("hide").eq(0).removeClass("hide");
		}else{
			t.addClass("lie-down");
			t.find("i").removeClass("icon-down").addClass("icon-up");
			parent.find("*[ectype='lieItem']").removeClass("hide");
			
		}
	});
	$(document).on("mouseenter","li[ectype='floor_cat_content']",function(){
		var obj = $(this).data('value');
		var eveval = $(this).data("flooreveval");
		var visualhome = $(this).data("visualhome");
		var visualItme = $(this).parents("*[ectype='visualItme']");
		var cat_id = '',
			floor_num = '',
			goods_ids = '',
			warehouse_id = '',
			area_id = '';
		if(visualhome == 1){
			cat_id = $(this).data('id');
			floor_num = $(this).data('floornum');
			warehouse_id = $("input[name='warehouse_id']").val();
			area_id = $("input[name='area_id']").val();
			goods_ids = $(this).data("catgoods");
		}else{
			cat_id = obj.id;
			floor_num = obj.floornum;
			warehouse_id = obj.warehouse;
			area_id =obj.area;
		}
		
		if(eveval == 0){
			$.ajax({
				type: "POST",
				url: "get_ajax_content.php",
				data: "act=floor_cat_content&cat_id=" + cat_id + "&floor_num=" + floor_num + "&warehouse_id=" + warehouse_id + "&area_id=" + area_id + "&goods_ids=" + goods_ids,
				dataType:'json',
				success: function(data){
					if(visualItme.length > 0){
						visualItme.find("[ectype='floor_cat_" + data.cat_id + "']").html(data.content);
						visualItme.find("*[ectype='floorTit'] li[data-id='" + data.cat_id + "']").data("flooreveval", 1);
					}else{
						$("#floor_cat_" + data.cat_id).html(data.content);
						$("*[ectype='floorTit']").find("li[data-id='" + data.cat_id + "']").data("flooreveval", 1);
					}
				}
			});
		}
	});
	
	doc.on('click',"*[ectype='changeBrand']",function(){
		Ajax.call("get_ajax_content.php","act=ajax_change_brands",changeBrandResponse,'GET','JSON');
	});	
	
	function changeBrandResponse(result){
		$("#recommend_brands").html(result.content);
	}
	$("a[ectype='gstop']").on("click",function(){
		var parent = $(this).parents(".goods-spread");
		var ico = $(this).find("i");
		var goodslist = parent.siblings(".goods-list");
		var right = 0;
		
		var winWidth = $(window).width();
		
		var minWidth = 1160;
		var maxWidth = 1392;
		
		if(winWidth < 1450){
			minWidth = 978;
			maxWidth = 1200;
		}
		
		if(parent.hasClass("goods-spread-fix")){
			goodslist.stop().animate({"width":minWidth},startAnimate);
			goodslist.removeClass("goods-list-w1390");
		}else{
			goodslist.stop().animate({"width":maxWidth});
			
			right = ($(window).width() - maxWidth)/2;
			parent.css("right",right-60);
			
			goodslist.addClass("goods-list-w1390");
			
			parent.addClass("goods-spread-fix");
			ico.removeClass("icon-right").addClass("icon-left");
		}
		
		function startAnimate(){
			parent.removeClass("goods-spread-fix");	
			ico.removeClass("icon-left").addClass("icon-right");
		}
	});
	
	$("*[ectype='fsortTab'] .item").on("click",function(){
		var Item = $(this);
		var type = Item.data("type");
		var main = $("*[ectype='gMain']");
		
		Item.addClass("current").siblings(".item").removeClass("current");
		if(type == "large"){
			main.find(".gl-warp-large").show();
			main.find(".gl-warp-samll").hide();
		}else{
			main.find(".gl-warp-large").hide();
			main.find(".gl-warp-samll").show();
		}
	});
	
    $(".sider li").hover(function(){
		var src = $(this).find('img').attr("src");
		$(this).parents(".sider").prev().find("img").attr("src",src);
		$(this).addClass("curr").siblings().removeClass("curr");
	});
	
    $(".fcheckbox .checkbox_item label").click(function(){
		var check = $(this).prev();
		if(check.prop("checked") == true){
			var input_url = ($(this).nextAll('#input-i2').attr('rev'));
			check.addClass("checkbox-checked");
		}else{
			var input_url = ($(this).nextAll("#input-i1").attr('rev'));
			check.addClass("checkbox-checked");
		}
		location.href = input_url;
    });
	$("*[ectype='view-prom']").hover(function(){
		var $this = $(this);
		var s_wrap = $this.parents(".summary-price-wrap");
		var w_wrap = $this.parents(".s-p-w-wrap");
		var height = w_wrap.outerHeight();
		
		s_wrap.css("height",height);
		w_wrap.addClass("z-promotions-all-show");
		
	},function(){
		var $this = $(this);
		var w_wrap = $this.parents(".s-p-w-wrap");
		w_wrap.removeClass("z-promotions-all-show");
	});
	
	$("*[ectype='areaSelect']").hover(function(){
		var $this = $(this);
		$this.find(".area-warp").show();
		$this.addClass("hover");
		$this.find(".iconfont").removeClass("icon-down").addClass("icon-up");
	},function(){
		var $this = $(this);
		$this.find(".area-warp").hide();
		$this.removeClass("hover");
		$this.find(".iconfont").removeClass("icon-up").addClass("icon-down");
	});
	
	$("*[ectype='is-attr'] .item").on("click",function(){
		var $this = $(this),
			parent = $this.parents("*[ectype='is-attr']"),
			type = parent.data("type"),
			name = $this.data("name"),
			spec_value = 0;
			
			spec_value = $this.find("input").val();
			Ajax.call('ajax_dialog.php', 'act=getInfo&goods_id=' + goodsId + '&attr_id=' + spec_value, getImgUrl, 'GET', 'JSON');

		if(type == "radio"){
			$this.find("input[type='radio']").prop("checked",true);
			$this.addClass("selected").siblings().removeClass("selected");
			
			$("[data-name="+name+"]").find("input[type='radio']").prop("checked",true);
			$("[data-name="+name+"]").addClass("selected").siblings().removeClass("selected");
		}else if(type == "checkbox"){
			var len = parent.find(".selected").length;
			
			if($this.hasClass("selected")){
				if(len<=1)return;
				$this.removeClass("selected");
				$this.find("input[type='checkbox']").prop("checked",false);
				
				$("[data-name="+name+"]").removeClass("selected");
				$("[data-name="+name+"]").find("input[type='checkbox']").prop("checked",false);
			}else{
				$this.addClass("selected");
				$this.find("input[type='checkbox']").prop("checked",true);		
				
				$("[data-name="+name+"]").addClass("selected");
				$("[data-name="+name+"]").find("input[type='checkbox']").prop("checked",true);
			}
		}else{}
		
		changePrice();
	});

	$("*[ectype='priceNotify']").on("click",function(){
		var $this = $(this),
			user_id = $this.data("userid"),
			goods_id = $this.data("goodsid"),
			content = $("#notify_box").html();
		

		if(user_id == 0){
			var back_url = "goods.php?id=" + goods_id;
			$.notLogin("get_ajax_content.php?act=get_login_dialog",back_url);
			return false;
		}else{
			pb({
				id:"notifyBox",
				title:pb_title,
				width:500,
				height:210,
				content:content,
				ok_title:ok,
				cl_title:cancel,
				drag:false,
				foot:true,
				onOk:function(){
					notifyBox(user_id,goods_id,"#notifyBox");
				}
			});
		}
	});

	$("*[ectype='is-ious'] .item").on("click",function(){
		var $this = $(this),
			val = $this.data("value");
		if($this.hasClass("selected")){
			$this.removeClass("selected");
			$this.siblings("input[name='stages_qishu']").val('');
		}else{
			$this.addClass("selected").siblings().removeClass("selected");
			$this.siblings("input[name='stages_qishu']").val(val);
		}
	});
	

	$("*[ectype='byStages']").on("click",function(){
		var val = $("input[name='stages_qishu']").val();
		var goods_id = $("input[name='good_id']").val();
		var user_id = $("input[name='user_id']").val();
		if(user_id > 0){
			if(val > 0){
				window.location.href ="javascript:bool=1;addToCartStages(goods_id);";
			}else{
				get_goods_prompt_message(select_stages_number);
			}
		}else{
			var back_url = "goods.php?id="+ goods_id;
			$.notLogin("get_ajax_content.php?act=get_login_dialog",back_url);
		}
	});
	

	function goodsStorePick(){
		var goods_id = $("input[name='good_id']").val(),
			user_id = $("input[name='user_id']").val(),
			back_url = "goods.php?id="+ goods_id,
			formBuy  = document.forms['ECS_FORMBUY'],
			spec_arr = "",
			divId = "";
			
		$("*[ectype='seller_store']").on("click",function(){

			if(formBuy){
				spec_arr = getSelectedAttributes(formBuy);
			}
			
			divId = "storeDialogBody";
			if(user_id > 0){
				Ajax.call("get_ajax_content.php?act=get_store_list&goods_id="+goods_id+ '&spec_arr=' + spec_arr,'back_act='+ back_url, function(data){
					pb({
						id:divId,
						title:see_store,
						width:670,
						height:320,
						content:data.content,
						drag:false,
						foot:false
					});
				}, 'POST','JSON');
			}else{
				$.notLogin("get_ajax_content.php?act=get_login_dialog",back_url);
				return false;
			}
		});
		
		$("*[ectype='btn-store-pick']").on("click",function(){
			if(formBuy){
				spec_arr = getSelectedAttributes(formBuy);
			}
			
			divId = "storePick";
			ru_id = $("input[name='merchantId']").val();
			
			if(user_id == 0){
				$.notLogin("get_ajax_content.php?act=get_login_dialog",back_url);
				return false;
			}
			Ajax.call("get_ajax_content.php?act=storePick",'ru_id='+ ru_id + "&spec_arr=" + spec_arr +"&goods_id=" + goods_id, function(data){
				pb({
					id:divId,
					title:store_subscribe,
					width:450,
					height:240,
					ok_title:submit_subscribe,
					cl_title:cancel,
					content:data.content, 	
					drag:false,
					foot:true,
					onOk:function(){
						var store_id = $("#"+ divId).find("input[name='store_id']").val(),
							end_time = $("#"+ divId).find("input[name='end_time']").val(),
							store_mobile = $("#"+ divId).find("input[name='store_mobile']").val();
						
						if(store_id > 0){
							if(store_mobile){
								 bool=2;
								 addToCart(goods_id,0,0,'','',store_id,end_time,store_mobile);
							}else{
								pbDialog(login_phone_packup_one,"",0);
							}
						}else{
							pbDialog(select_store,"",0);
						}
					}
				});
			}, 'POST','JSON');
		});
	
		$(document).on("click","*[ectype='storeSelect']",function(){
			if(formBuy){
				spec_arr = getSelectedAttributes(formBuy);
			}
			
			divId = "latelStorePick";
			ru_id = $("input[name='merchantId']").val();
			Ajax.call("get_ajax_content.php?act=storeSelect",'ru_id='+ ru_id +  "&spec_arr=" + spec_arr +"&goods_id=" + goods_id, function(data){
				pb({
					id:divId,
					title:store_lately,
					width:900,
					height:410,
					ok_title:ok,
					cl_title:cancel,
					content:data.content, 
					drag:false,
					foot:true,
					onOk: function () {
						store_id = $("#"+divId).find(".active input[name='store_id']").val();
						if(store_id > 0){
							Ajax.call("get_ajax_content.php?act=replaceStore",'store_id='+ store_id + "&spec_arr=" + spec_arr +"&goods_id=" + goods_id, function(result){
								$(".replaceStore").html(result.content);
							}, 'POST','JSON')
						}
					}
				});
			},'POST','JSON');
			
			regionSelect(ru_id,goods_id);
		});
	}
	
	goodsStorePick();
	
	$("*[ectype='view_priceLadder']").hover(function(){
		
		$(this).siblings("*[ectype='priceLadder']").show();
	},function(){
		$(this).siblings("*[ectype='priceLadder']").hide();
	});
	

	function areaAddress(){
		var $this = $("#area_address");
		var width=0;
		$this.hover(function(){
			width = $(this).outerWidth();
			$(this).find('.area-warp').show();
		},function(){
			$(this).find('.area-warp').hide();
		});
	}
	areaAddress();

	$(".sp-rule").hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});
	

	$("*[ectype='tb-tab-anchor']").on("click",function(){
		var t = $(this);
		$(this).siblings(".tb-popsku").show();
	});
	
	$("*[ectype='tb-cancel']").on("click",function(){
		var t = $(this);
		$(this).parents(".tb-popsku").hide();
	});
	
	

	$(".arrow-show-more").click(function(){
		$(".seller-pop-box,.seller-address").stop(true,false).slideToggle();
	});

	$("*[ectype='cateOpen'] dt").click(function(){
		var $this = $(this);
		var dl = $this.parent("dl");
		if(dl.hasClass("hover")){
			dl.removeClass("hover");
		}else{
			dl.addClass("hover");
		}
	});

	$("*[ectype='gmf-tab'] li").click(function(){
		var rev = $(this).attr("rev");
		var comment = "";
		var goods_id = $("input[name='good_id']").val()
		$(this).addClass("curr").siblings().removeClass("curr");
		
		if(rev == 1){
			comment = 'comment_good';	
		}else if(rev == 2){
			comment = 'comment_middle';
		}else if(rev == 3){
			comment = 'comment_short';
		}else{
			comment = 'comment_all';
		}
		
		goods_id = goods_id + "|" + rev;
		
		Ajax.call('comment.php?act=' + comment, 'id=' + goods_id, get_commentResponse, 'GET', 'JSON');
	});
	
	$("*[ectype='reply']").click(function(){
		if($(this).parents(".com-operate").next().hasClass("hide")){
			$(this).parents(".com-operate").next().removeClass("hide");
		}else{
			$(this).parents(".com-operate").next().addClass("hide");
		}
	});
	
	function get_commentResponse(result){
		$("#ECS_COMMENT").html(result.content);
	}
	
	$('.dis_type').click(function(){
		var T = $(this);
		var rev = T.attr('rev');
		var dis_sort = T.attr('sort');
		var revType = T.attr('revType');
		var goods_id = $("input[name='good_id']").val();
		
		$(this).addClass('curr').siblings().removeClass('curr');
		
		if(!revType){
			revType = 0; 
		}
		
		if(dis_sort){
			dis_sort = "|" + dis_sort;
			rev = $("input[name='dis_class']").val();
		}else{
			dis_sort = '';
			$("input[name='dis_class']").val(rev);
		}
		
		goods_id = goods_id + "|" + rev + "|" + revType + dis_sort;
		
		Ajax.call('comment_discuss.php?act=discuss', 'id=' + goods_id, comment_discussResponse, 'GET', 'JSON');
	});

	function comment_discussResponse(result){
		$("#discuss_list_ECS_COMMENT").html(result.content);
	}
	
	$(".p-thumb-img li").on("click",function(){
		var $this = $(this);
		var imgUrl = $this.data("src");
		var viewImg = $this.parents(".p-imgs-warp").find(".p-view-img");
		var length = $this.siblings("li").length + 1;
		var fale = false;
		if($this.hasClass("curr")){
			$this.removeClass("curr");
			fale = false;
		}else{
			$this.addClass("curr").siblings().removeClass("curr");	
			fale = true;
		}
		
		if(fale == true){
			viewImg.show();
			viewImg.find("img").attr("src",imgUrl);
			
		}else{
			viewImg.hide();
		}
	});
	
	$(".p-view-img img").on("click",function(){
		var $this = $(this);
		var viewImg = $this.parents(".p-view-img");
		viewImg.hide();
		viewImg.siblings(".p-thumb-img").find("li").removeClass("curr");
	});
	
	$(".p-view-img a").on("click",function(){
		var $this = $(this);
		var imgs = $this.parents(".p-imgs-warp");
		var length = imgs.find("li").length;
		var count = imgs.find(".curr").data("count");
		
		if($this.hasClass("p-prev")){
			if(count>1){
				imgs.find("*[data-count="+(count-1)+"]").click();
			}
		}else{
			if(count != length){
				imgs.find("*[data-count="+(count+1)+"]").click();
			}
		}
	});
	
	$("*[ectype='c-promotion']").on("click",function(){
		var $this = $(this);
		var parent = $this.parent();
		var height = parent.find("*[ectype='promTips'] ul").height();
		if(parent.hasClass("prom-hover")){
			parent.removeClass("prom-hover");
			parent.find("*[ectype='promTips']").css("height",0);
		}else{
			parent.addClass("prom-hover");
			parent.find("*[ectype='promTips']").css("height",height);
		}
	});
	
	$(document).on("click", "*[ectype='cartOperation']", function(){
		var user_id = $("#user_id").val();
		
		var ok_title, cl_title, content;
		var obj = $(this).data("value");

		if (obj.divId == 'cart_remove') {
			ok_title = remove;
			cl_title = move_collection;
			content = $("#dialog_remove").html();
		} else if (obj.divId == 'cart_collect') {
			ok_title = follow;
			cl_title = cancel;
			content = $("#dialog_collect").html();
		}
		
		if (user_id > 0 || obj.divId == 'cart_remove') {
			pb({
				id: obj.divId,
				title: obj.title,
				width: 455,
				height: 58,
				ok_title: ok_title, 
				cl_title: cl_title, 
				content: content, 
				drag: false,
				foot: true,
				onOk: function () {
					location.href = obj.url;
				},
				onCancel: function () {
					if (obj.divId == 'cart_remove') {
						location.href = obj.cancelUrl;
					}
				}
			});
		}else{
			var back_url = "flow.php";
			$.notLogin("get_ajax_content.php?act=get_login_dialog",back_url);
		}
	});
	
	$("#go_pay").click(function(){
		var back_url=$(this).data("url");
		$.notLogin("get_ajax_content.php?act=get_login_dialog",back_url);
		return false;
	});

	$(document).on("click","*[ectype='cs-w-item']",function(){
		var $this = $(this);
		var address_id = $this.data('addressid');
		var store_id = 0;
		
		$this.addClass("cs-selected").siblings().removeClass("cs-selected");
		
		if(document.getElementById('store_id')){
			store_id = document.getElementById('store_id').value;
			(store_id > 0) ? store_id : 0;
		}

		Ajax.call('flow.php?step=edit_consignee_checked', 'address_id=' + address_id+ '&store_id=' +store_id, function (result) {
			if(result.error > 0){
				if(result.error == 1){
					var back_url = "flow.php";
					$.notLogin("get_ajax_content.php?act=get_login_dialog",back_url);
					return false;
				}else{
					alert(result.msg);
					return false;
				}
			}else{
				$('#consignee-addr').html(result.content);
				$('#goods_inventory').html(result.goods_list);
				$('#ECS_ORDERTOTAL').html(result.order_total);
			}
		}, 'POST','JSON');
	});
        
	$(document).on("click","*[ectype='dialog_checkout']",function(){
		var obj = $(this).data("value");
		var parent = $(this).parents(".cs-w-item");
		var length = parent.siblings(".cs-w-item").length;
		if(obj.divId == 'new_address'){
                    if((length+1) >= 11){
                        pbDialog("鏈€澶氬彧鑳芥坊鍔�10涓敹璐у湴鍧€","",0);
                        return false;
                    }
		}
		
		if(obj.divId == 'new_address' || obj.divId == 'edit_address'){
			Ajax.call(obj.url, 'address_id=' + obj.id, function(data){
				pb({
					id:obj.divId,
					title:obj.title,
					width:obj.width,
					content:data.content, 	
					drag:false,
					foot:true,
					ok_title:con_Preservation,
					cl_title:cancel,
					onOk:function(){
						if(addUpdate_Consignee("form[name='theForm']") == false){
							addUpdate_Consignee("form[name='theForm']");
							return false;
						}else{
							return true;
						}
					}
				});
				
				if(obj.divId == 'new_address'){
					$.levelLink(1);
				}else{
					$.levelLink(0);
				}
				
			}, 'POST','JSON');
				
		}else if(obj.divId == 'del_address'){
			var content = $('#del_address').html();
			
			pb({
				id:obj.divId,
				title:obj.title,
				width:obj.width,
				height:obj.height,
				ok_title:ok,
				cl_title:cancel, 
				content:content, 	
				drag:false,
				foot:true,
				onOk:function(){
					Ajax.call('flow.php?step=delete_Consignee', 'address_id=' + obj.id + "&temtype=1&type=1", function(data){
						if(data.error == 2){
							$('#consignee-addr').html(data.content);
						}else{
							$('#consignee-addr').html(data.content);
						}
						
						$('#goods_inventory').html(data.goods_list);
                        $('#ECS_ORDERTOTAL').html(data.order_total);
					}, 'POST','JSON');
				}
			});
		}
	});

	
	$("*[ectype='storeBtn']").on("click",function(){
		$("*[ectype='seller_address']").addClass("hide")
		$("*[ectype='get_seller_sotre']").addClass("show");
	});
	
	if(document.getElementById('pwd_error')){
		var payment_code = $(".checkout .payment-list div.item-selected").data('type');
		
		if(payment_code == 'onlinepay'){
			$("#qt_balance").hide();
			$("#qt_onlinepay").show();
	
			$("form[name='doneTheForm'] :input[name='pay_pwd_error']").val(1);
		}else{
			
			var sueplus = $("#ECS_SURPLUS").val();
			var integral = $("#ECS_INTEGRAL").val();
			
			if(sueplus > 0 || integral > 0){
				$("#qt_balance").hide();
				$("#qt_onlinepay").show();
	
				$("form[name='doneTheForm'] :input[name='pay_pwd_error']").val(1);
			}else{
				$("#qt_balance").show();
				$("#qt_onlinepay").hide();
				
				$("form[name='doneTheForm'] :input[name='pay_pwd_error']").val(0);
			}
		}
	}
	
	$("*[ectype='paymentType'] .p-radio-item").on("click",function(){
		var $this = $(this);
		var type = $this.data('type');
		$this.addClass("item-selected").siblings().removeClass("item-selected");
		$this.find('input').prop("checked", true);
		if(type=="onlinepay"){
			$("#qt_balance").hide();
			
			$("#qt_onlinepay").show();
	  		$("form[name='doneTheForm'] :input[name='pay_pwd_error']").val(1);
			
			$("#ECS_SURPLUS").val(0);
			changeSurplus(0);
		}else{
			
			var surplus = $("#ECS_SURPLUS").val();
			var integral = $("#ECS_INTEGRAL").val();
			
			if(!(surplus > 0 || integral > 0)){
				$("#qt_onlinepay").hide();
				$("form[name='doneTheForm'] :input[name='pay_pwd_error']").val(0);
			}
			
			$("#qt_balance").show();
		}
		
		$("#ECS_PAY_PAYPWD").html('');
		$("form[name='doneTheForm'] :input[name='pay_pwd']").val('');
	});
	
	$(document).on("click","*[ectype='invEdit']",function(){
		var obj = $(this).data("value");
		Ajax.call(obj.url,'',invoiceResponse, 'POST', 'JSON');

		function invoiceResponse(data){
			if(data.error == 0){
				pb({
					id:obj.divId,
					title:obj.title,
					width:675,
					height:278,
					ok_title:"淇濆瓨鍙戠エ淇℃伅", 	
					cl_title:"鍙栨秷", 		
					content:data.content, 	
					drag:false,
					foot:true,
					onOk:function(){
						var invoice_val = $("#edit_invoice .selected").find("input[type='radio']").val();
						var inv_content = $("#edit_invoice .item-selected").find("input[type='radio']").val();
						var store_id = $("#store_id").val();
						
						var arr =[];
						$(".shopping-list").each(function(k,v){
							var arr2 = [];
							var ru_id = $(this).find("input[name='ru_id[]']").val();
							var shipping = $(this).find("input[name='shipping[]']").val(); 
							arr2.push(ru_id);
							arr2.push(shipping);
							arr[k] = arr2;
						});
						
						if(typeof invoice_val == 'undefined' || invoice_val == ""){
							alert(invoice_packup);
							return false;
						}
						
						Ajax.call('ajax_dialog.php?act=gotoInvoice','inv_content='+encodeURIComponent(inv_content)+'&invoice_id='+invoice_val +'&store_id='+store_id + '&shipping_id=' + $.toJSON(arr),gotoInvoiceResponse, 'POST', 'JSON');
									  	
						function gotoInvoiceResponse(result){
							if(result.error != ""){
								alert(result.error);return false;
							}else{
								$("#inv_content .inv_payee").html(result.inv_payee);
								$("#inv_content .inv_content").html(result.inv_content);
								$("#inv_content").find("input[name=inv_payee]").val(result.inv_payee);
								$("#inv_content").find("input[name=inv_content]").val(result.inv_content);
								$("#ECS_ORDERTOTAL").html(result.content);
							}
						}
					}
				});
				
				var inv_payee = $("#inv_content").find("input[name=inv_payee]").val();
				var inv_content = $("#inv_content").find("input[name=inv_content]").val();
				$("#edit_invoice .invoice-list").find("input[value='"+inv_payee+"']").parents(".invoice-item").addClass("selected").siblings().removeClass("selected");
				$("#edit_invoice .radio-list").find("input[value='"+inv_content+"']").parents("li").addClass("item-selected").siblings().removeClass("item-selected");
			}
			invoice();
		}
	});
	
	function invoice(){
		var invoice = "#edit_invoice",
			invoiceItem = ".invoice-item",
			addBtn = ".add-invoice-btn",
			editBtn = ".edit-tit",
			updateBtn = ".update-tit",
			delBtn = ".del-tit",
			radioList = $(invoice).find(".radio-list");
		
		$(document).on("click",invoiceItem,function(){
			$(this).addClass("selected").siblings().removeClass("selected");
			$(this).find("input[name='invoice_id']").prop("checked", true);
		});
		
		$(invoice).find(addBtn).on("click",function(){
			var $this = $(this),
				f_item = "";
				
			$this.addClass("hide");
			
			$(invoiceItem).removeClass("selected");
			
			f_item = $(invoiceItem).length;
			
			if(f_item<4){
				var div = "<div class='invoice-item selected'><span><input type='text' name='inv_payee' class='inv_payee'  placeholder='"+add_invoice+"' value=''><input name='invoice_id' type='radio' class='hide' value='" +0+ "'><b></b></span><div class='btns'><a href='javascript:void(0);' class='ftx-05 edit-tit hide'>"+edit+"</a><a href='javascript:void(0);' class='ftx-05 update-tit'>"+Preservation+"</a><a href='javascript:void(0);' class='ftx-05 ml10 del-tit hide'>"+drop+"</a></div>";
				$this.parent().prev().append(div);

				$(invoiceItem).eq(f_item).find("input.inv_payee").focus();
			}else{
				pbDialog(invoice_desc_number,"",0);
				
				$(invoiceItem).eq(0).addClass("selected");
				$this.removeClass("hide");
			}
		});
		
		$(document).on('click',editBtn,function(){
			var $this = $(this),
				obj = $this.parent().prev(),
				val = 0;
			
			obj.find("input").removeAttr("readonly");
			obj.find("input").focus();
			
			$this.addClass("hide").next().removeClass("hide");
			
			val = obj.find("input[name='invoice_id']").val();
		});
		
		$(document).on('click',updateBtn,function(){
			var $this = $(this),
				obj = $this.parent().prev(),
				inv_payee = obj.find("input[name=inv_payee]").val(),
				invoice_id = obj.find("input[name=invoice_id]").val();
			if(inv_payee==""){
				
				pbDialog(invoice_desc_null,"",0);
				return false;
				
			}else{
				Ajax.call('ajax_dialog.php?act=update_invoicename', 'inv_payee=' + encodeURIComponent(inv_payee) + '&invoice_id=' + invoice_id, function (result) {
					
					obj.find("input[name=invoice_id]").val(result.invoice_id);
					
				},'POST','JSON');

				obj.find("input").attr("readonly", true);
				
				$this.addClass("hide").siblings().removeClass("hide");
				
				$(addBtn).removeClass("hide");
				
				$this.find("input[name='invoice_id']").prop("checked", true);
			}
		});
		
		$(document).on("click",delBtn,function(){
			var $this = $(this),
				obj = $this.parents(invoiceItem),
				invoice_id = obj.find("input[name=invoice_id]").val(),
				length = 0;
			if (invoice_id == 0) {
				obj.remove();
				
				length = $(invoice).find(invoiceItem).length;

				if(length == 1) {
					$(invoice).find(invoiceItem).addClass("selected");
				}
				
			}else{
				Ajax.call('ajax_dialog.php?act=del_invoicename', 'invoice_id=' + invoice_id, function (result) {
					if(result.error == 1) {
						
						pbDialog(result.msg,"",0);
						return false;
						
					}else{
						obj.remove();
						$(invoice).find(invoiceItem).eq(0).addClass("selected");
					}
				},'POST', 'JSON');
			}
		});
		
		radioList.find("li").click(function(){
			$(this).addClass("item-selected").siblings().removeClass("item-selected");
			$(this).find('input').prop("checked", true);
		});
	}
	
	$("*[ectype='ck-toggle']").on("click",function(){
		var $this = $(this);
		$this.siblings(".ck-step-cont").slideToggle(300,function(){
			if($this.hasClass("ck-toggle-off")){
				$this.removeClass("ck-toggle-off")
					 .addClass("ck-toggle-on")
					 .find(".iconfont")
					 .removeClass(".icon-down")
					 .addClass("icon-up");
			}else{
				$this.removeClass("ck-toggle-on")
					 .addClass("ck-toggle-off")
					 .find(".iconfont")
					 .removeClass("icon-up")
					 .addClass("icon-down");
			}
		});
	});
	
	
	$("*[ectype='panlItem']").on("click",function(){
		var $this = $(this);
		
		var uc_id = $this.data('ucid');
		var type = $this.data("type");
	   
		if ($('#consignee-addr').length == 0) {
			pbDialog(checked_address,"",0);
			return false;
		}
		if ($this.hasClass("selected")) {
			$this.removeClass("selected").siblings().removeClass("selected");
			
			if(type == 'coupons'){
				$.getJSON("flow.php?step=change_coupons&uc_id=0",'',function(data){
					orderSelectedResponse(data)
				},'json');
				$('#uc_id').val('');
			}
			
			else if(type == 'bonus'){
			   $('#bonus_id').val('');
				changeBonus(0);
			}
			
			else if(type == 'value_card'){
				$('#ECS_VALUE_CARD').val('');
				changeVcard(0);
			}
		} else {
			$this.addClass("selected").siblings().removeClass("selected");
			
			 if(type == 'coupons'){
				$('#uc_id').val(uc_id);
				$.getJSON("flow.php?step=change_coupons&uc_id=" + uc_id, '', function (data) {
					orderSelectedResponse(data);
				}, 'json')
			}
	
			else if(type == 'bonus'){
				$('#bonus_id').val(uc_id);
				changeBonus(uc_id);
			}
		
			else if(type == 'value_card'){
				$('#ECS_VALUE_CARD').val(uc_id);
				changeVcard(uc_id);
			}
		}
	});
	
	
	function logistics(){
		var t = "", 
			parents = "",
			_html = "",
			index = 0,
			ru_id = 0,
			type = 0,
			shipping = "",
			shipping_id = 0,
			shipping_code = "",
			text = "";
		
		doc.on('mouseenter','.mode-tab-item',function(){
			clearTimeout(outTimer);
			var width = 0;
			t = $(this);
			
			width = t.parents("ul").outerWidth();
			
			shipping_code = t.data('shippingcode');
			parents = t.parents("[ectype='disInfo']");
			
			hoverTimer = setTimeout(function(){
				if(shipping_code == "cac"){
					parents.find("*[ectype='since']").show();
					parents.find("*[ectype='logistics']").hide();
				}else{
					parents.find("*[ectype='logistics']").css("right",width-100);
					parents.find("*[ectype='logistics']").show();
					parents.find("*[ectype='since']").hide();
				}
			},200);
		})
		.on('mouseleave','.mode-tab-item',function(){
			clearTimeout(hoverTimer);
			t = $(this);
			
			shipping_code = t.data('shippingcode');
			parents = t.parents();
			
			outTimer = setTimeout(function(){
				parents.find("*[ectype='since']").hide();
				parents.find("*[ectype='logistics']").hide();
			},100);	
		})
		.on('mouseenter','.mwapper',function(){
			clearTimeout(outTimer);
		})
		.on('mouseleave','.mwapper',function(){
			$(this).hide();
		});
		
		
		$(document).on("click",".logistics_li",function(){
			t = $(this);
			index = t.index();
			ru_id = t.data('ruid');
			type = t.data('type');
			shipping_id = t.data('shipping');
			shipping_code = t.data('shippingcode');
			parents = t.parents("*[ectype='disInfo']");
			shipping = "";
			
			if(shipping_code != 'cac')
			{
				_html = t.data("text");
				parents.find("*[ectype='tabLog']").addClass("item-selected").siblings().removeClass("item-selected");
			}
			
			
			
			t.addClass("item-selected").siblings().removeClass("item-selected");
			
			$(".shipping_" + ru_id).val(shipping_id);
			$(".shipping_code_" + ru_id).val(shipping_code);
			
			if(_html != "")
			{
				parents.find("*[ectype='tabLog'] span").html(_html);
				parents.find("*[ectype='tabLog']").attr("data-shipping",shipping_id).attr("data-shippingcode", shipping_code).attr("data-ruid", ru_id).attr("data-type", type);
			}
			
			t.parents("*[ectype='logistics']").hide();
			
		
			$("*[ectype='shoppingList']").each(function(index, element) {
				var li_shinpping_id = $(element).find("*[ectype='disInfo'] li.item-selected").attr("data-shipping");
				var seller_shipping = Number(li_shinpping_id);

				if(index > 0){
					shipping += ",";
				}
				
				shipping += li_shinpping_id;
			});
	
			
			Ajax.call('ajax_dialog.php?act=shipping_type', 'ru_id=' + ru_id + '&shipping_id='+ shipping_id +'&type=' + type +'&shipping=' + shipping, changeShippingResponse, 'POST','JSON');
		});

		
		doc.on("click",".mode-tab-item",function(){
			t = $(this);
			index = t.index();
			shippingcode = t.data("shippingcode");
			shipping = "";
			
			t.addClass('item-selected').siblings().removeClass('item-selected');
			
	
			$("*[ectype='shoppingList']").each(function(index, element) {
				var li_shinpping_id = $(element).find("*[ectype='disInfo'] li.item-selected").attr("data-shipping");
				var seller_shipping = Number(li_shinpping_id);
				
				if(index > 0){
					shipping += ",";
				}
				
				shipping += seller_shipping;
			});
		
			
			if(shippingcode == 'cac'){
				ru_id = t.data('ruid');
				type = t.data('type');
				shipping_id = t.data('shipping');
				
				Ajax.call('ajax_dialog.php?act=shipping_type', 'ru_id=' + ru_id + '&shipping_id='+ shipping_id +'&type=' + type +'&shipping=' + shipping, changeShippingResponse, 'POST','JSON');		
			}else{
				parents = t.parents("[ectype='disInfo']");
				parents.find(".logistics_li").each(function(index, element) {
					var $this = $(this);
					if($this.hasClass("item-selected")){
						ru_id = $this.data("ruid");
						type = $this.data("type");
						shipping_id = $this.data("shipping");
						
						Ajax.call('ajax_dialog.php?act=shipping_type', 'ru_id=' + ru_id + '&shipping_id='+ shipping_id +'&type=' + type +'&shipping=' + shipping, changeShippingResponse, 'POST','JSON');		
					}
				});
			}
	
		});
		
	
		doc.on("click","*[ectype='flow_dialog']",function(){
			var value,ok_title,cl_title,url,title,width,height,divId,mark,ajax_picksite;
			
			value = $(this).data("value");
			
			url = value.url; 
			title = value.title;
			width = value.width;
			height = value.height;
			divId = value.divid;
			mark = value.mark; 
			
			ok_title = save;
			cl_title = cancel;
			
			$("*[ectype='tabCac']").click();
			
			Ajax.call(url,'',shopResponse, 'POST', 'JSON');
			function shopResponse(result){
				pb({
					id:divId,
					title:title,
					width:width,
					height:height,
					ok_title:ok_title, 	
					cl_title:cl_title, 	
					content:result.result, 	
					drag:false,
					foot:true,
					onOk:function(){ 
						if(mark == 0){
							var district = $("#pickRegion_select").val();
							var picksite_id = $("input[name='picksite_radio']:checked").val();
							ajax_picksite = 'district='+ district +'&picksite_id='+ picksite_id + 'mark=' + mark ;
	
							if(typeof(picksite_id) == "undefined"){
								alert(delivery_Prompt);return false;
							}
						}else{
							var shipping_date = $("input[name='shipping_date']:checked").attr('data-shippingDate');
							var time_range = $("input[name='shipping_date']:checked").attr('data-range');
		
							if(typeof(shipping_date) == "undefined"){
								alert(delivery_Prompt_two);return false;
							}
							ajax_picksite = 'shipping_date='+ shipping_date + '&time_range='+ time_range +'&mark=' + mark ;
						}
						
						Ajax.call('flow.php?step=select_picksite', ajax_picksite, selectPicksiteResponse, 'POST', 'JSON');
					},
					onCancel:function(){ 
					}
				});
			}
		});
	}
	logistics();
	
	
	$("*[ectype='opened']").on("click",function(){
		var $this = $(this);
		var div = $this.parents(".o-list-info").next();
		if(div.is(":hidden")){
			$this.html(down_detail+"</span><i class='iconfont icon-up'></i>");
		}else{
			$this.html(order_detail+"</span><i class='iconfont icon-down'></i>");
		}
		div.slideToggle();
	});
	
	$("*[ectype='bankList'] li").on("click",function(){
		var $this = $(this);
		var parent = $(this).parents("*[ectype='bankList']");
		$this.addClass("selected").siblings().removeClass("selected");
		
		if(parent.find(".selected").length>0){
			$("#alipay_bank").find(".noBtn").hide();
			$("#alipay_bank").find("input").show().css({"background-color":"#f42424"});
		}
	});
	
	$(document).on("click",".no_goods", function(){
		var rec_number = $("input[name='rec_number_str']").val();
		var url = $(this).data('url');
		if(rec_number != ''){
			url = url + "&rec_number=" + rec_number;
		}
		
		Ajax.call(url,'',noGoods, 'POST', 'JSON');
		function noGoods(result){
			pb({
				id:'noGoods',
				title:No_goods,
				width:670,
				ok_title:go_up, 	
				cl_title:back_cart, 	
				content:result.content, 	
				drag:false,
				foot:true,
				onOk:function(){
					$("form[name='stockFormCart']").submit();
				},
				onCancel:function(){
					location.href = "flow.php";
				}
			});
			$('.pb-ok').addClass('color_df3134');
		}
	});
	
	$(document).on("click",".no_shipping", function(){
		var shipping_prompt = $("input[name='shipping_prompt_str']").val();
		var url = $(this).data('url');
		if(shipping_prompt != ''){
			url = url + "&shipping_prompt=" + shipping_prompt;
		}
		
		Ajax.call(url,'',noShipping, 'POST', 'JSON');
		function noShipping(result){
			pb({
				id:'noGoods',
				title:No_shipping,
				width:670,
				ok_title:go_up, 	
				cl_title:back_cart, 	
				content:result.content, 	
				drag:false,
				foot:true,
				onOk:function(){
					$("form[name='stockFormCart']").submit();
				},
				onCancel:function(){
					location.href = "flow.php";
				}
			});
			$('.pb-ok').addClass('color_df3134');
		}
	});
    
	$(".menu-item div.item-hd").on("click",function(){
		var t = $(this);
		$(this).siblings("ul").slideToggle(500,function(){
			if($(this).is(":hidden")){
				t.find(".iconfont").removeClass("icon-down").addClass("icon-up");
			}else{
				t.find(".iconfont").addClass("icon-down").removeClass("icon-up");
			}
		});
	});
	$(window).ready(function(e) {
        var height = $("*[ectype='userSide']").height();
		
		$("*[ectype='userMain'] .user-mod").css({"min-height":height-70});
    });
	
	$("body").on('click', function(e){
		var target = $(e.target);
		var opened = $(".mod-select.mod-select-open");
		if(opened.length > 0){
			console.log(target.parents(".mod-select").length)
			if(target.parents(".mod-select").length == 0){
				console.log(opened)
				opened.removeClass("mod-select-open");
			}
		}
	});

	$(".user-side .side-menu dt .square").click(function(){
		var $this = $(this);
		var dd = $this.parent("dt").siblings("dd");
		$this.toggleClass("square-plus");
		dd.slideToggle();
	});
	
	$("[ectype='opm']").click(function(){
		$(this).prevAll("[ectype='c-goods']").show();
		$(this).prev().hide();
		$(this).hide();
	});
	
	var hoverTimer, outTimer,hoverTimer2;
	$(document).on('mouseenter',"*[ectype='track-packages-btn']",function(){
		clearTimeout(outTimer);
		var $this = $(this);
		hoverTimer = setTimeout(function(){
			$this.find("*[ectype='track-packages-info']").show();
		},50);
	});
	
	$(document).on('mouseleave',"*[ectype='track-packages-btn']",function(){
		clearTimeout(hoverTimer);
		var $this = $(this);
		outTimer = setTimeout(function(){
			$this.find("*[ectype='track-packages-info']").hide();
		},50); 
	});
	$(document).on('mouseenter',"*[ectype='track-packages-info']",function(){
		clearTimeout(outTimer);
		hoverTimer2 = setTimeout(function(){
			$(this).show();
		});
	});
	$(document).on('mouseleave',"*[ectype='track-packages-info']",function(){
		$(this).hide();
	});
	function userComment(){
		var t = "",
		parent = "",
		divId = "commentDialog";
		
		doc.on("click","a[ectype='btn-comment']",function(){
			var rec_id = $(this).data('recid');
			var sign = $(this).data('sign');
			var size = $(this).data('size');
			var start = $(this).data('start');
			var foot = $(this).data('foot');
			
			Ajax.call('ajax_user.php?act=comments_form', 'rec_id=' + rec_id + '&sign=' + sign + '&start=' + start + '&size=' + size, commentsFormResponse, 'POST', 'JSON');
			
			function commentsFormResponse(data){
				var content = data.content;
				pb({
					id:divId,
					title:"璇勮鍟嗗搧",
					content:content,
					ok_title:ok,
					cl_title:cancel,
					drag:false,
					foot:foot,
					onOk:function(){
						commentForm(divId);
					}
				});
			}
		});
		
		doc.on("click","*[ectype='p_rate'] a",function(){
			t = $(this);
			parent = t.parents("*[ectype='rates']");
			val = t.data("value");
			
			parent.find(".error").hide();
			t.addClass("selected").siblings().removeClass("selected");
			
			parent.find("input[type='hidden']").val(val);
			
			if(parent.find(".degree-text").length>0){
				parent.find(".degree-text").show();
				parent.find(".comt-error").hide();
				parent.find("*[ectype='number']").html(val);
			}
		});
		
		doc.on("click","*[ectype='itemTab']",function(){
			var val = "",recid = "";
			t = $(this);
			
			if(t.hasClass("selected")){
				t.removeClass("selected");
			}else{
				t.addClass("selected");
			}
			
			t.parent().find(".selected").each(function(){
				var tag_val = $(this).data('val');
				var tag_recid = $(this).data('recid');
				
				val += tag_val +",";
				recid += tag_recid +",";
			});
	
			val = val.substring(0,val.length-1);
			recid = recid.substring(0,recid.length-1);
			
			$("input[name='impression']").val(val);
		});
		
		doc.on("click","*[ectype='cimg-remove']",function(){
			var $this = $(this);
			var cur_imgId = $this.data("imgid");
			var order_id = $("input[name='order_id']").val();
			var goods_id = $("input[name='goods_id']").val();
			var ul = $this.parents(".img-list-ul");
			var num = ul.parents(".img-lists").find(".num").text();
			
			if(cur_imgId == ""){
				alert(parameter_error);return false;
			}
			Ajax.call('comment.php?act=del_pictures', 'cur_imgId=' + cur_imgId+'&order_id='+order_id+'&goods_id='+goods_id, delCommentImgResponse, 'POST', 'JSON');

			function delCommentImgResponse(data){
				ul.html(data.content);
				ul.parents(".img-lists").find(".num").html(Number(num)-1);
			}
		});
	}
	userComment();
	
	function commentForm(obj){
		var obj = $("#"+obj),
			comment_id = "",
			comment_rank = "",
			content = "",
			impression = "",
			is_impression = "",
                        captcha = "",
			cmt = new Object;
			
		comment_id = obj.find("input[name='comment_id']").val();
		comment_rank = obj.find("input[name='comment_rank']").val();
		content = obj.find("textarea[name='content']").val();
		impression = obj.find("input[name='impression']").val();
		is_impression = obj.find("input[name='is_impression']").val();
		captcha = obj.find("input[name='captcha']").val();
                
		cmt.comment_rank = (typeof(comment_rank) == "undefined") ? 0 : comment_rank ;
		cmt.comment_id = (typeof(comment_id) == "undefined") ? 0 : comment_id ;
		cmt.impression = (typeof(impression) == "undefined") ? '' : impression ;
		cmt.content = (typeof(content) == "undefined") ? '' : content ;
                cmt.captcha = (typeof(captcha) == "undefined") ? '' : captcha ;
                
		cmt.order_id = obj.find("input[name='order_id']").val();
		cmt.goods_id = obj.find("input[name='goods_id']").val();
		cmt.rec_id = obj.find("input[name='rec_id']").val();
		cmt.sign = obj.find("input[name='sign']").val();
		
		if(cmt.comment_rank == 0 && cmt.sign == 0){
			pbDialog(select_pf,"",0);
			return false;
		}else if(cmt.impression == '' && cmt.sign == 0 && is_impression == 1){
			pbDialog(Label_number_null,"",0);
			return false;
		}else if((cmt.content == '' || cmt.content.length > 500) && cmt.sign == 0){
			if(cmt.content == ''){
				pbDialog(content_not,"",0);
			}else{
				pbDialog(word_number,"",0);
			}
			return false;
		}else if(cmt.captcha == '' && typeof(captcha) != "undefined"){
			pbDialog(null_captcha_login,"",0);
			return false;
		}else{	
			Ajax.call('comment.php?act=comm_order_goods', 'cmt=' + $.toJSON(cmt), commentSignOneResponse, 'POST', 'JSON');
		}
	}
	
	function commentSignOneResponse(result){
		var sign = '';
		var left = 0;
		if(result.sign > 0){
			sign = "&sign=" + result.sign;
		}
		
		if(result.sign > 0){
			left = 100;
		}else{
			left = 60;
		}
		
		var hrefCont = "user.php?act=comment_list" + sign;

		if(result.error > 0){
			pbDialog(result.message,"",0);
		}else{
			pbDialog(result.message,comments_Other,1,"","",left,false,function commentOk(){location.href = hrefCont});
		}
	}
	
	$("[ectype='storeRateBtn']").on("click",function(){
		var rank = new Object;
			
		rank.order_id = $(this).data('orderid');
		rank.desc_rank = $(this).parents(".score").find("input[name=desc_rank]").val();
		rank.service_rank = $(this).parents(".score").find("input[name=service_rank]").val();
		rank.delivery_rank = $(this).parents(".score").find("input[name=delivery_rank]").val();
		rank.sender_rank = $(this).parents(".score").find("input[name=sender_rank]").val();
		
		if(rank.desc_rank == 0){
			$("input[name=desc_rank]").nextAll(".comt-error").show();
			return false;
		}else if(rank.desc_ran==0){
			$("input[name=desc_ran]").nextAll(".comt-error").show();
			return false;
		}else if(rank.service_rank==0){
			$("input[name=service_rank]").nextAll(".comt-error").show();
			return false;
		}else if(rank.delivery_rank==0){
			$("input[name=delivery_rank]").nextAll(".comt-error").show();
			return false;
		}else if(rank.sender_rank==0){
			$("input[name=sender_rank]").nextAll(".comt-error").show();
			return false;
		}else{
			Ajax.call('comment.php?act=satisfaction_degree', 'rank=' + $.toJSON(rank), SatisfactionDegreeResponse, 'POST', 'JSON');
		}
	});
	
	function SatisfactionDegreeResponse(result)
	{
		if(result.error > 0){
			pbDialog(result.msg,"",0);
			return false;
		}else{
			var _html = '<h3><s class="icon-02"></s><span>'+comments_think+'</span></h3>';
			$(".votelist-content").find(".service-rcol").html(_html);
		}
	}
	
	var hoverTimer, outTimer,hoverTimer2;
	$(document).on('mouseenter','.virtual_title',function(){
		clearTimeout(outTimer);
		var parents = $(this).parents('.virtual_div');
		hoverTimer = setTimeout(function(){
			parents.find(".virtual_info").show();
		},200);
	});
	
	$(document).on('mouseleave','.virtual_title',function(){
		clearTimeout(hoverTimer);
		var parents = $(this).parents('.virtual_div');
		outTimer = setTimeout(function(){
			parents.find(".virtual_info").hide();
		},100); 
	});
	$(document).on('mouseenter','.virtual_info',function(){
		clearTimeout(outTimer);
		hoverTimer2 = setTimeout(function(){
			$(this).show();
		});
	});
	$(document).on('mouseleave','.virtual_info',function(){
		$(this).hide();
	});
	var bank_card = $("*[ectype='bank_card']");
	if(bank_card.length > 0){
		var card = bank_card.val();		
		var ncard = "";
		
		card = card.replace(/\D/g,'');
		
		for(var i = 0; i < card.length; i = i+4){
			ncard += card.substring(i,i+4)+" ";
		}
		
		bank_card.val(ncard.replace(/(\s*$)/g,""));
		
		bank_card.keyup(function(e){
			var obj = e , bankVal;
			if(obj.keyCode != 8){             				
				bankVal = $(this).val();   								bankVal = bankVal.replace(/[^\d\s]/g,"");   
				$(this).val(bankVal);       				
				for(n=1;n<=4;n++){
					if(bankVal.length <= 5*n-2 || bankVal.length>5*n-1){  
						bankVal = bankVal;
					}else{
						bankVal += " ";                         		$(this).val(bankVal);  						}
				}
			}
		});
		
		bank_card.blur(function(e){
			var $this = $(this).parents("div.value");
            bankCard = bank_card.val();
			bankCard = bankCard.replace(/\s+/g, "");
			$.getJSON("./data/bankData.json", {}, function (data) { 
				var bankBin = 0; 
				var isFind = false; 
				for (var key = 10; key >= 2; key--) { 
					bankCard = bankCard.toString();
					bankBin = bankCard.substring(0, key); 
					$.each(data, function (i, item) { 
						if (item.bin == bankBin) { 
							isFind = true; 
							bName = item.bankName; 
							$this.find(".notic").hide();
							$this.find("*[ectype='bname']").html(bName).show();
						} 
					}); 
					if (isFind) { 
						break; 
					} 
				} 
				if (!isFind) { 
					$this.find(".notic").hide();
					$this.find("*[ectype='bname']").html("璇峰～鍐欐纭崱鍙�").show();
				} 
			}); 
        });
	}
_article']").on("click",function(){
		var _this = $(this);
		var title = _this.html();
		
		Ajax.call('ajax_dialog.php?act=merchants_article','title='+title, function(data){
			if(data.error == 1){
				_this.parents('li').addClass("curr").siblings().removeClass("curr");;
				$(".container").html(data.content);
			}else{
				alert(data.message);
			}
		}, 'POST', 'JSON');
	})
	$("*[ectype='snatchType']").on("click",function(){
		$("#detail-slide").find(".hd li:eq(1)").click();
	});
	$("#parent_catagory li a").on("click",function(){
		var textTypeIndex = $(this).parent().index();
		var vsecondlist = $(".v-second-list");
		$(this).parent().addClass("current").siblings().removeClass("current");
		$(this).parents(".v-fold").next().show();
		var index = textTypeIndex-1;
		if(index >= 0){
			vsecondlist.show();
			vsecondlist.children(".s-list").eq(index).show().siblings().hide();
		}else{
			vsecondlist.hide();
			vsecondlist.children(".s-list").hide();
		}
	});
	
	$("#sort li").click(function(){
		$(this).addClass("current").siblings().removeClass("current");
	});
	
	$(".v-option").click(function(){
		if($(this).hasClass('slidedown')){
			$(this).removeClass('slidedown').addClass('v-close');
			$(this).html("<b></b><span>"+Pack_up+"</span>");
			$(this).next().css("height","auto");
		}else{
			$(this).removeClass('v-close').addClass('slidedown');
			$(this).html("<b></b><span>"+more+"</span>");
			$(this).next().css("height","26px");
		}
	});
	$(document).on("mouseenter","*[ectype='skmuMove']",function(){
		clearTimeout(outTimer);
		hoverTimer = setTimeout(function(){
			$("[ectype='skmuMcate']").addClass("skmu-mcate-active");
		},200);
	});
	
	$(document).on("mouseleave","*[ectype='skmuMove']",function(){
		clearTimeout(hoverTimer);
		outTimer = setTimeout(function(){
			$("[ectype='skmuMcate']").removeClass("skmu-mcate-active");
		},100); 
	});
	$(document).on("mouseenter","[ectype='skmuMcate']",function(){
		clearTimeout(outTimer);
		hoverTimer2 = setTimeout(function(){
			$(this).addClass("skmu-mcate-active");
		});
	});
	$(document).on("mouseleave","[ectype='skmuMcate']",function(){
		$(this).removeClass("skmu-mcate-active");
	});
});


(function($){
	$.fn.jfloor = function(itemHeight,bHeight){
		if(itemHeight == null){
			var itemHeight = 0;
		}
		if(bHeight == null){
			var bHeight = 0;
		}
		return this.each(function(){
			var winHeight = $(window).width();
				floors = $(this).find("*[ectype='gm-floors']"),
				flooritem = floors.find("*[ectype='gm-item']"),
				axis = $(this).find("*[ectype='gm-tabs']"),
				layer = axis.find("*[ectype='gm-tab-item']"),
				bor = axis.find("*[ectype='qp-bort']"),
				floorsTop =  parseInt(floors.offset().top-itemHeight);
			
			layer.click(function(){
				var index = layer.index(this);
				var top = parseInt(flooritem.eq(index).offset().top-itemHeight);
				$("body,html").stop().animate({scrollTop:top});
			});
			
			$(window).scroll(function(){
				var top = $(document).scrollTop();
				
				if(top >= floorsTop-itemHeight){
					axis.addClass("detail-hd-fixed");
					
					if(bor.length>0){
						bor.css({"width":winHeight,"left":-((winHeight-1200)/2 + floors.position().left)});
					}
				}else{
					axis.removeClass("detail-hd-fixed");
				}
				
				for(var i=0;i<flooritem.length;i++){
					var flooritemTop =  parseInt(flooritem.eq(i).offset().top-itemHeight);
					if(top >= flooritemTop-bHeight){
						layer.eq(i).addClass("curr").siblings().removeClass("curr");
					}
				}
			});
		});
	}
})(jQuery);


jQuery.divselect = function(divselectid,inputselectid,fn) {
	var inputselect = $(inputselectid);
	$(document).on('click',divselectid+" .cite",function(event){
		$(".imitate_select").find("ul").hide();
		event.stopImmediatePropagation();
		var ul = $(divselectid+" ul");
		if(ul.css("display")=="none"){
			ul.css("display","block");
		}else{
			ul.css("display","none");
		}
		$(this).siblings("ul").perfectScrollbar("destroy");
		$(this).siblings("ul").perfectScrollbar();
	});
	$(document).on("click",divselectid+" ul li a",function(event){
		event.stopImmediatePropagation();
		var txt = $(this).text();
		$(divselectid+" .cite span").html(txt);
		var value = $(this).data("value");
		inputselect.val(value);
		$(divselectid+" ul").hide();
		if(fn){
			fn($(this));
		}		
	});
	$(document).on("click",function(){
		$(divselectid+" ul").hide();
	});
};

jQuery.notLogin = function(actUrl,backUrl){
	if(backUrl != null){
		if(backUrl.indexOf('&amp;') > -1){
			var backUrl = backUrl.replace("&amp;","|");
		}else if(backUrl.indexOf('&') > -1){
			var backUrl = backUrl.replace("&","|");
		}
	}
	Ajax.call(actUrl,'back_act='+ backUrl, function(data){
		pb({
			id:"loginDialogBody",
			title:not_login,
			width:380,
			height:430,
			content:data.content, 	//璋冨彇鍐呭
			drag:false,
			foot:false
		});
	}, 'POST','JSON');
}

function checkstore_search_cmt(store_search_cmt){
	$("input[name='store_search_cmt']").val(store_search_cmt);
}

function checkSearchForm(){
	var keywords = $("input[name='keywords']").val();
	if(keywords == ''){
		
		divId = "keywords_html";
		var content = '<div id="' + divId + '">' + 
							'<div class="tip-box icon-box">' +
								'<span class="warn-icon m-icon"></span>' + 
								'<div class="item-fore">' +
									'<h3 class="rem ftx-04">{$lang.no_keywords}</h3>' +
								'</div>' +
							'</div>' +
						'</div>';
		
		pb({
			id:divId,
			title:'{$lang.sys_msg}',
			width:445,
			height:58,
			content:content,
			drag:false,
			foot:false
		});	
		
		return false;
	}
}

function get_toCart(){
	var num = 0;
	$("input[name='checkItem']").each(function(index, element) {
		if ($(element).is(":checked")){
			num ++;
		}
	});
	if (num == 0){
		var content = $("#flow_add_cart").html();
		pb({
			id:"flow_add_cart",
			title:pb_title,
			width:455,
			height:58,
			content:content,
			drag:false,
			foot:false
		});
		return false;
	}
}

function cartScroll(){
	var winHeight = $(window).height();
	var toolbar = $(".cart-toolbar");
	var toolbarTop = toolbar.offset().top;
	$(window).resize(function(){
		winHeight = $(window).height();
	});
	
	if(toolbarTop>winHeight){
		toolbar.addClass("fixed-bottom");
	}
	$(window).scroll(function(){
		var scrollTop = $(document).scrollTop();
		if(scrollTop+winHeight>toolbarTop){
			toolbar.removeClass("fixed-bottom");
		}else{
			toolbar.addClass("fixed-bottom");
		}
	});
}
function notifyBox(user_id,goods_id,divid){
	var hopeDiscount = $(divid).find("input[name='price-notice']").val();
	var cellphone = $(divid).find("input[name='cellphone']").val();
	var email = $(divid).find("input[name='email']").val();

	//var res = checkform(hopeDiscount,cellphone,email);

	/*if(!res){
		return false;
	}*/

	jQuery.ajax({
		url: 'ajax_dialog.php?act=price_notice',
		type: 'post',
		dataType: 'json',
		data: {
			'user_id': user_id,
			'goods_id': goods_id,
			'hopeDiscount': hopeDiscount,
			'cellphone':cellphone,
			'email': email
		},
		cache: false,
		success: function (result) {
			if (result.status == 0) {
				alert(result.msg);
			}else{
				alert(result.msg);
			}
		},
		error: function () {
		}
	})
}

function addUpdate_Consignee(frm){
	var obj = $(frm);
	var info_return = 0;
	var csg = new Object;
	var fale = false;

	csg.goods_flow_type = obj.find("input[name='goods_flow_type']").val(); 
	
	csg.consignee 		= obj.find("[name='consignee']").val();
	if(csg.goods_flow_type == 101){
		csg.country 		= obj.find("[name='country']").val();
		csg.province 		= obj.find("[name='province']").val();
		csg.city 			= obj.find("[name='city']").val();
		csg.district 		= obj.find("[name='district']").val();
		csg.street 			= obj.find("[name='street']").val();
		csg.address 		= obj.find("[name='address']").val();
		csg.zipcode 		= obj.find("[name='zipcode']").val();
		csg.sign_building 	= obj.find("[name='sign_building']").val();
		csg.best_time 		= obj.find("[name='best_time']").val();
	}
	
	csg.mobile 			= obj.find("[name='mobile']").val();
	csg.tel 			= obj.find("[name='tel']").val();
	csg.email 			= obj.find("[name='email']").val();
	csg.address_id 		= obj.find("[name='address_id']").val();
	
	if(csg.consignee == ''){
		pbDialog(input_Consignee_name,'',0);
		console.log(1);
	}else if(!Utils.isTel(csg.mobile) || csg.mobile.length != 11){
		pbDialog("",'',0);
		console.log(9);
		return false;
	}else if(csg.country == 0 && csg.goods_flow_type == 101){
		pbDialog(select_consigne,'',0);
		console.log(2);
		return false;
	}else if(csg.province == 0 && csg.goods_flow_type == 101){
		pbDialog("",'',0);
		console.log(3);
		return false;
	}else if(csg.city == 0 && csg.goods_flow_type == 101){
		pbDialog("",'',0);
		console.log(4);
		return false;
	}else if(!$('#selDistricts_').is(":hidden") &&csg.district == 0 && csg.goods_flow_type == 101){
		pbDialog("",'',0);
		console.log(5);
		return false;
	}else if(!$('#selStreets_').is(":hidden") && csg.street == 0 && csg.goods_flow_type == 101){
		pbDialog("",'',0);
		console.log(7);
		return false;
	}else if(csg.address == '' && csg.goods_flow_type == 101){
		pbDialog("",'',0);
		console.log(8);
		return false;
	}else{
		
		$("#consignee-addr").html("<div class='load'>"+load_icon+"</div>");
		
		Ajax.call('flow.php', 'step=insert_Consignee&csg=' + $.toJSON(csg), addUpdate_ConsigneeResponse, 'POST', 'JSON');
		
		fale = true;
	}
	
	return fale;
}

function addUpdate_ConsigneeResponse(result){
	if(result.error > 0){
		if(result.error == 2){
			alert(result.message);
			location.href = "user.php";
		}
		
		if(result.error == 4){
			$('#consignee-addr').html(result.content);
		}
	}else{
		$('#consignee-addr').html(result.content);
		$('#goods_inventory').html(result.goods_list);
		$('#ECS_ORDERTOTAL').html(result.order_total);
	}
	
	if(result.error == 4){
		var ok_title,cl_title;
		var width = 455; 
		var height = 58;
		var divId = "address_div_id";
		
		ok_title = determine;
		cl_title = cancel;
		
		var content = '<div id="' + divId + '">' + 
							'<div class="tip-box icon-box">' +
								'<span class="warn-icon m-icon"></span>' + 
								'<div class="item-fore">' +
									'<h3 class="rem ftx-04">' + result.message + '</h3>' +
								'</div>' +
							'</div>' +
						'</div>';
					
		pb({
			id:divId,
			title:Prompt_info,
			width:width,
			height:height,
			ok_title:ok_title, 	
			cl_title:cl_title, 	
			content:content, 	
			drag:false,
			foot:true,
			onOk:function(){
				$('#' + divId).remove();
			},
			onCancel:function(){
				$('#' + divId).remove();
			}
		});
		
		$('.pb-ok').addClass('color_df3134');
	}
	$('#shipping_list').html(result.shipping_content);
}
function regionSelect(ru_id,goods_id){
	var hoverTimer,outTimer,_this,level=0,id=0,name="";
	var changeCity = "#latelStorePick .change-shop-city",
		changeBoxinfo = ".city-box-info",
		tab = ".city-tab .city-item",
		cityItem = ".city-box .city-item",
        catyHst = ".city-hot .city-item",
		shopitem = ".select-shop-box .shop-info-item",
		doc = $(document);
		
	//榧犳爣绉诲姩鍒板垏鎹㈠煄甯傚睍寮€鎵€鏈夊煄甯傞€夋嫨
	doc.on("mouseenter",changeCity,function(){
		clearTimeout(outTimer);
		_this = $(this);
		hoverTimer = setTimeout(function(){
			_this.parents(".city-box-tit").siblings(".city-box-info").show()
		},100);
	})
	.on("mouseleave",changeCity,function(){
		clearTimeout(hoverTimer);
		_this = $(this);
		outTimer = setTimeout(function(){
			_this.parents(".city-box-tit").siblings(".city-box-info").hide();
		},100);	
	})
	.on('mouseenter',changeBoxinfo,function(){
		clearTimeout(outTimer);
		_this = $(this);
		_this.show();
	})
	.on('mouseleave',changeBoxinfo,function(){
		_this = $(this);
		_this.hide();
	})
	.on('click',catyHst,function(){
		var spec_arr = '';
		var formBuy = document.forms['ECS_FORMBUY'];
		if (formBuy)
		{
			spec_arr = getSelectedAttributes(formBuy);
		}
		_this = $(this),level = _this.data("level"),id = _this.data("id"),name = _this.data("name");
		
		var province = 0,city = 0,district = 0;
		if(level == 1){
			province = id;
		}else if(level == 2){
			city = id;
		}else{
			district = id;
		}
		check_store(province,city,district,goods_id,spec_arr);
	})
	.on("click",tab,function(){
		var spec_arr = '';
		var formBuy = document.forms['ECS_FORMBUY'];
		if (formBuy)
		{
			spec_arr = getSelectedAttributes(formBuy);
		}
		_this = $(this),level = _this.data("level"),id = _this.data("id"),name = _this.data("name");
		_this.addClass("curr").siblings().removeClass("curr");
			Ajax.call("get_ajax_content.php?act=get_parent_regions",'value='+ id + "&level=" + level + "&ru_id=" + ru_id+ '&goods_id=' + goods_id + "&spec_arr="+spec_arr , function(data){
			$(".region_select_ajax").html(data.html);
		}, 'POST','JSON');
	})
	.on("click",cityItem,function(){
		var spec_arr = '';
		var formBuy = document.forms['ECS_FORMBUY'];
		if (formBuy)
		{
			spec_arr = getSelectedAttributes(formBuy);
		}
		_this = $(this),level = _this.data("level"),id = _this.data("id"),name = _this.data("name");
		
		var cityTab = _this.parents(".city-box").siblings(".city-tab");
		
		cityTab.find("[data-level="+(level+1)+"]").addClass("curr")
			.siblings().removeClass("curr");
			console.log(level);
			cityTab.find("[data-level="+level+"]")    
			.html(name)
			.attr("data-id",id)
			.attr("data-name",name);

		var str ="";
		
		$(tab).each(function(){
			name = $(this).attr("data-name");
			str += name + "&nbsp;";
		});
		
		$(changeBoxinfo).hide();
		$(changeCity).find("em").html(str);
		
		var province = 0,city = 0,district = 0;
		
		if(level == 1){
			province = id;
		}else if(level == 2) {
			city = id;
		}else{
			district = id;
		}
		
		check_store(province,city,district,goods_id,spec_arr);
	})
	.on("click",shopitem,function(){
		_this = $(this);
		_this.addClass("active").siblings().removeClass("active");
	});
}

function check_store(province,city,district,goods_id,spec_arr){
     Ajax.call("ajax_dialog.php?act=get_store_list", 'country=' + province + '&goods_id=' + goods_id + "&spec_arr=" + spec_arr + "&type=store_select_shop", function (data) {
         $(".select-shop").html(data.content);
    }, 'POST', 'JSON');
}
function checked_store_info(){
	var end_time = $("input[name='take_time']").val();
	var store_mobile = $("input[name='store_mobile']").val();
	var cart_value = $("input[name='done_cart_value']").val();
	var store_mobile_data = $("input[name='store_mobile']").data('val');
	if(store_mobile == ''){
		$("input[name='store_mobile']").val(store_mobile_data);
		
		pbDialog(login_phone_packup_one,"",0);
	}else{
		Ajax.call("get_ajax_content.php?act=checked_store_info", 'end_time=' + end_time + '&store_mobile=' + store_mobile + "&cart_value=" + cart_value, function(data){
			if(data.error == 1){
				pbDialog(data.message,"",0);
			}
		}, 'POST','JSON');
	}
}

function get_store_list(obj,type,cart_value){
    var province = $("#selProvinces").val();
    var city = $("#selCities").val();
    var district = obj.value;
	
    if(district > 0){
        Ajax.call('ajax_dialog.php?act=get_store_list', 'province=' + province + '&city=' + city + '&district=' + district + '&cart_value='+cart_value + '&type=' + type, get_store_listResponse, 'GET', 'JSON'); 
    }
}
function get_store_listResponse(result){
	var div = $("*[ectype='get_seller_sotre']");
    if(result.error > 0){
        div.find("*[ectype='seller_soter']").html(result.content);
		div.find(".error").html('');
    }else{
       div.find("*[ectype='seller_soter']").html('');
	   div.find(".error").html('<i class="s_icon"></i>璇ュ湴鍖烘病鏈夐棬搴�');
    }
}


function edit_offline_store(obj){
	var store_id = obj.value;
	$("input[name='store_id']").val(store_id);
	var cart_value = $("input[name='done_cart_value']").val();
	
	if(store_id > 0){
		Ajax.call('flow.php?step=edit_offline_store', 'store_id=' + store_id + '&cart_value=' + cart_value , edit_offline_storeResponse, 'GET', 'JSON'); 
	}
}
function edit_offline_storeResponse(result){
	if(result.error > 0){
		if(result.error == 1){
			var back_url = "flow.php";
			$.notLogin("get_ajax_content.php?act=get_login_dialog",back_url);
			return false;
		}else{
			alert(result.msg);
			return false;
		}
	}else{
		$('#goods_inventory').html(result.goods_list);//閫佽揣娓呭崟
		$('#ECS_ORDERTOTAL').html(result.order_total);//璐圭敤姹囨€�
		$("input[name='store_id']").val();
	}
}

function changeShippingResponse(result){
	$(".shipping_" + result.ru_id).val(result.shipping_id);
	$(".shipping_code_" + result.ru_id).val(result.shipping_code);
	$(".shipping_type_" + result.ru_id).val(result.shipping_type);
	
	if (result.error)
	{
	  pbDialog(result.massage,"",0);
	  location.href = './';
	}

	try
	{
	  var layer = document.getElementById("ECS_ORDERTOTAL");
	  layer.innerHTML = (typeof result == "object") ? result.content : result;
	}
	catch (ex) { }
}


function selectPicksiteResponse(result){
	if(result.error == 0){
		$("#goods_inventory").html(result.content);
	}else{
		pbDialog(result.massage,"",0);
		location.href = './';
	}
}


function get_backer_list(zcid,page)
{
	$.ajax({
		type:'get',
		url:'crowdfunding.php',
		data:'act=get_backer_list&zcid='+zcid+"&page="+page,
		dataType:'json',
		success:function(data){
			$("#backer_list").html(data.content);
		}		
	})
} 


function get_topic_list(zcid,page)
{
	$.ajax({
		type:'get',
		url:'crowdfunding.php',
		data:'act=get_topic_list&zcid='+zcid+"&page="+page,
		dataType:'json',
		success:function(data){
			$("#topic_list").html(data.content);
		}		
	})
}


function getImgUrl(result)
{
	if(result.t_img != ''){
		$('#Zoomer').attr({ href:"" +result.t_img+ "" });
		$('#J_prodImg').attr({ src:"" +result.t_img+ "" });
		$('.MagicBoxShadow').eq(0).find('img').eq(0).attr({ src:"" +result.t_img+ "" });
		$('.MagicThumb-expanded').find('img').attr({ src:"" +result.t_img+ "" });
	}
}

jQuery.inputPrompt = function(s,c,v){
	var s = $(s);
	s.focus(function(){
		if($(this).val() == v){
			$(this).val("");
			if(c==true){
				$(this).css("color","#666");
			}
		}
	});
	s.blur(function(){
		if($(this).val()==''){
			$(this).val(v);
			if(c==true){
				$(this).css("color","#999");
			}
		}else{
			if(c==true){
				$(this).css("color","#666")
			}
		}
	});
}

$(function(){
    $("#res_store_user").val('');
    $("#res_store_province").val('');
    $("#res_store_city").val('');
    $("#res_store_district").val('');

    var orderName='ASC';
    $("*[ ectype='seller_sort']").on("click",function(){
        var T = $(this);
		var sortName = T.data('sort');
		if(orderName=='ASC')
		{
			orderName='DESC';
			T.children('i').removeClass("icon-up1").addClass("icon-down1");
		}
		else
		{
			orderName='ASC';
			T.children('i').removeClass("icon-down1").addClass("icon-up1");
		}
		T.addClass('curr').siblings().removeClass('curr');
		var area_list = $("input[name='area_list']").val();
		var strText = area_list + "|" + "sort-" + sortName + "|" + "order-" + orderName;
		store_shop_gotoPage_new(1, strText, 0);
    })
	
    $(document).on("click","*[ ectype='street_area']",function(){
		var _this = $(this),
			store_user = $("#res_store_user").val(),
			store_province = $("#res_store_province").val(),
			store_city = $("#res_store_city").val(),
			store_district = $("#res_store_district").val(),
			val = _this.data('val'),
			search_type = _this.data('type'),
			region_type = _this.data('region');
			
			var area        	= new Object();
			area.region_id   	= val;
			area.region_type  = region_type;
			area.store_user  = store_user;
			area.store_province  = store_province;
			area.store_city  = store_city;
			area.store_district  = store_district;

			Ajax.call('store_street.php?act=' + search_type, 'area=' + $.toJSON(area), function (result) {
				var store_user='',
					province='',
					city='',
					district='';

				if(result.error == 0){
					if(result.region_type == 2){
						$('#store_city').html(result.content);
						$('#store_district').html('');
					}else if(result.region_type == 3){
						$('#store_district').html(result.content);
					}
				}

				if(result.store_province){
					province = result.store_province;
				}

				if(result.store_city){
					city = result.store_city;
				}

				if(result.store_district){
					district = result.store_district;
				}

				if(result.store_user){
					store_user = result.store_user;
				}

				$("#res_store_user").val(store_user);
				$("#res_store_province").val(province);
				$("#res_store_city").val(city);
				$("#res_store_district").val(district);
                _this.parents("li").addClass('curr').siblings().removeClass('curr');
				$("*[ ectype='seller_sort']").first().addClass('curr').siblings().removeClass('curr');
				$("input[name='area_list']").val(result.id);
				store_shop_gotoPage_new(1, result.id, 0);
				slClick();
		   }, 'POST', 'JSON'); 
    })  
    slClick();
	
    $(document).on("click", "*[ectype='collect_store']", function(){
        var _this = $(this),
			value = _this.data("value"),
			ru_id = value.storeid,
			user_id = value.userid,
			site_domain = value.sitedomain,
			type = 0,
			msgtitle = "";

        if($(this).hasClass("selected")){
            type = 1;
        }
		
        if(user_id > 0){
            if(type == 1){
				msgtitle = Focus_prompt_four;
            }else{
				msgtitle = Focus_prompt_three;
            }
			
			pbDialog(msgtitle,"",0,455,78,"",true,function(){ajax_collect_store(ru_id, type, _this, site_domain)});
        }else{
			var back_url=$(this).data("url");
			$.notLogin("get_ajax_content.php?act=get_login_dialog",back_url);
			return false;  
        }
    });
	
	
	function store_shop_gotoPage_new(page, id, type, libType)
	{
		Ajax.call('ajax_dialog.php?act=store_shop_gotoPage', 'page=' + page + '&id=' + id + '&type=' + type + '&libType=' + libType, store_shop_gotoPageResponse, 'GET', 'JSON');
	}
	
	function store_shop_gotoPageResponse(result)
	{
		$("*[ectype='store_shop_list']").html(result.content);
		$("*[ectype='pages_ajax']").html(result.pages);
		street();
	}

});

function slClick(){
	$(".s-l-v-list li").find("a").click(function(){
		$(this).parent().addClass("curr").siblings().removeClass("curr");
	})
}

function ajax_collect_store(ru_id,type,obj, site_domain){
	var url;
	if(site_domain!= "" && site_domain != null && site_domain != "undefined"){
		url = site_domain + 'get_ajax_content.php?act=ajax_store_collect';
	}else{
		url = 'get_ajax_content.php?act=ajax_store_collect';
	}
    Ajax.call(url, 'ru_id=' + ru_id + '&type=' + type , function(data){
		if(data.error == 1){
			pbDialog(Focus_prompt_one,"",0);
		}else{
            var type = obj.data("type");
			if(data.type == 1){
				if(type == 'goods'){
					$("[ectype='collect_store']").each(function(){
						$(this).removeClass("selected");
						$(this).find("i").removeClass("icon-zan-alts").addClass("icon-zan-alt");
					});
				}else{
					obj.removeClass("selected");
					obj.find("i").removeClass("icon-zan-alts").addClass("icon-zan-alt");
				}
			}else{
				if(type == 'goods'){
					$("[ectype='collect_store']").each(function(){
						$(this).addClass("selected");
						$(this).find("i").removeClass("icon-zan-alt").addClass("icon-zan-alts");
					})
				}else{
					obj.addClass("selected");
					obj.find("i").removeClass("icon-zan-alt").addClass("icon-zan-alts");
				}
			}
		}
	}, 'GET', 'JSON');
}

function dialogPrompt(i,m){
   var content = '<div id="'+i+'">' + 
                        '<div class="tip-box icon-box">' +
                                '<span class="warn-icon m-icon"></span>' + 
                                '<div class="item-fore">' +
                                        '<h3 class="rem ftx-04">' + m + '</h3>' +
                                '</div>' +
                        '</div>' +
                '</div>';
        pb({
                id:i,
                title:title,
                width:455,
                height:58,
                content:content, 	
                drag:false,
                foot:false
        });

        $('#' + i + ' .tip-box').css({
                'width' : '350px'
        });
}


$.jqueryAjax = function(url, data, ajaxFunc, type, dataType)
{
	var baseData = "is_ajax=1&";
	var baseFunc = function(){}
	
	if(!url)
	{
		url = "index.php";
	}
	
	if(!data)
	{
		data = "";
	}
	
	if(!type)
	{
		type = "get";
	}
	
	if(!dataType)
	{
		dataType = "json";
	}
	
	if(!ajaxFunc)
	{
		ajaxFunc = baseFunc;
	}
	
	data = baseData + data;
	
	$.ajax({
		type:type,
		url:url,
		data:data,
		dataType:dataType,
		success:ajaxFunc.success? ajaxFunc.success:ajaxFunc,
		error:ajaxFunc.error? ajaxFunc.error:baseFunc,
		beforeSend:ajaxFunc.beforeSend? ajaxFunc.beforeSend:baseFunc,
		complete:ajaxFunc.complete? ajaxFunc.complete:baseFunc,
		//dataFilter:ajaxFunc.dataFilter? ajaxFunc.dataFilter:baseFunc
	});	
}

function pbDialog(msgTitle,msg,state,width,height,left,cBtn,onOk){

	
	var content = "",
		icon = "m-icon",
		msgTit = "",
		msgSpan = "",
		foot = true;
	
	if(state == 0){
		icon = "m-icon";
	}else if(state == 1){
		icon = "m-icon warn-icon-ok";
	}else if(state == 2){
		icon = "m-icon warn-icon-error";
	}
	
	if(msgTitle != ""){
		if(msg != ""){
			msgTit = "<h3 class='ftx-04'>"+ msgTitle +"</h3>";
		}else{
			msgTit = "<h3 class='ftx-04 rem'>"+ msgTitle +"</h3>";
		}
	}
	
	if(msg != ""){
		msgSpan = "<span class='ftx-03'>"+ msg +"</span>";
	}
	
	if(width == null || width == ""){
		width = 450;
	}
	
	if(height == null || height == ""){
		height = 80;
	}
	
	if(left == null || left == ""){
		left = 100;
	}
	
	if(onOk == null || onOk ==""){
		foot = false;
	}

	content = '<div class="tip-box icon-box" style="height:'+ height +'px; padding-left:'+ left +'px;"><span class="warn-icon '+ icon +'"></span><div class="item-fore">'+ msgTit + msgSpan +'</div></div>';
		
	pb({
		id:"pbDialog",
		title:pb_title,
		width:width,
		height:height,
		content:content,
		drag:false,
		foot:foot,
		ok_title:ok,
		cl_title:cancel,
		cl_cBtn:cBtn,
		onOk:onOk
	});
}
//浼氬憳涓績鎻愮ず閿欒淇℃伅
function get_user_prompt_message(text){
	var ok_title = determine;
	var cl_title = cancel;
	var title = Prompt_information;
	var width = 455; 
	var height = 58;
	var divId = "email_div";
	
	var content = '<div id="' + divId + '">' +
						'<div class="tip-box icon-box">' +
							'<span class="warn-icon m-icon"></span>' +
							'<div class="item-fore">' +
								'<h3 class="ftx-04">' + text + '</h3>' + 
							'</div>' +
						'</div>' +
					'</div>';
	
	pb({
		id:divId,
		title:title,
		width:width,
		height:height,
		ok_title:ok_title, 	//鎸夐挳鍚嶇О
		cl_title:cl_title, 	//鎸夐挳鍚嶇О
		content:content, 	//璋冨彇鍐呭
		drag:false,
		foot:true,
		onOk:function(){聽聽聽聽聽聽聽聽聽聽聽聽聽聽
		},
		onCancel:function(){
		}
	});
	
	$('.pb-ok').addClass('color_df3134');
	$('#' + divId + ' .pb-ct .item-fore').css({
		'height' : '58px'
	});
	
	if(text.length <= 15){
		$('#' + divId + ' .pb-ct .item-fore').css({
			"padding-top" : '10px'
		});
	}
}
/**************************************涓炬姤(user)start ***************************************/
$(function(){
    $(document).on("click", "*[ectype='cancel_report']", function(){
        var _this = $(this);
        var id = _this.data("id");
        var type = _this.data("type");
        var state = _this.data("state");
        var back_href = '';
        if(type == 1 || state == 3){
            back_href = 'user.php?act=illegal_report';
        }else{
            back_href = "user.php?act=goods_report&report_id=" + id;
        }
        if(confirm("纭畾鎵ц姝ゆ搷浣滃悧锛熸墽琛屽悗鏁版嵁灏嗕笉鑳芥壘鍥烇紒璇疯皑鎱庢搷浣滐紒")){
            Ajax.call('ajax_user.php?act=check_report_state', 'report_id=' + id + "&state=" + state , function(data){
                if(data.error > 0){
                    pbDialog(data.message,"",0);
                }else{
                    location.href = back_href;
                }
             }, 'POST', 'JSON');
        }
    })
})