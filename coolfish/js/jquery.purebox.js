/**

 * email: tianshaojie@msn.com
 * date: 2013-01-15
 * version: 1.0.0
 */
(function($) {
	var
	$doc = $(document),
	$win = $(window),
	ie = /msie/.test(navigator.userAgent.toLowerCase()),
	ie6 = ('undefined' == typeof(document.body.style.maxHeight)),
	max = Math.max,
	min = Math.min,

	purebox = function(options) {
		return purebox.list[options.id] ? purebox.list[options.id] : new purebox.fn._init(options);
	};
	purebox.fn = purebox.prototype = {
		constructor : purebox,
		_init : function(options) {
			var opts = $.extend({}, purebox.defaults, options || {}),
				template = ['<div id="',opts.id,'" class="pb"><div class="cboxContent">',
				           opts.head ? ('<div class="pb-hd">' + (opts.xBtn ? '<a class="pb-x">\u2715</a>' : '') + '<span class="pb-title">'+opts.title+'</span></div>') : '',
				           '<div class="pb-bd"><div class="pb-ct"></div>',
			               opts.foot ? ('<div class="tip-box icon-box"><div class="pb-ft">'+(opts.cBtn ? '<a class="pb-btn pb-ok">' + opts.ok_title + '</a>' : '') + (opts.cl_cBtn ? '<a class="pb-btn pb-cl">' + opts.cl_title + '</a>' : '') + '</div></div>') : '',
			               '</div></div></div>'].join(''),
			    $pb = $(template),
				$head = $pb.find('.pb-hd'),
				$foot = $pb.find('.pb-ft'),
				that = this;

			that.$pb = $pb,
			that.$head = $head;
			that.$foot = $foot;
			that.$xBtn = $head.find('.pb-x');
			that.$cont = $pb.find('.pb-ct');
			that.$cBtn = $foot.find('.pb-cl');
			that.$oBtn = $foot.find('.pb-ok');
			that.$pb.appendTo(document.body);
			that.opts = opts;
			that.offsetHeight = $head.outerHeight()+$foot.outerHeight();

			that._bindEvent();
			that._setPbZindex();
			that.resize(opts.width, opts.height);
			that.setContent(opts.content);
			opts.drag && that._setDrag();
			opts.mask && that._setMask();
			opts.resize && that.$pb.resizable({
				handles: "e, s, se",
				onResize:function() {
					that.$cont.height(that.$pb.innerHeight() - that.offsetHeight);
				}, 
				onStopResize:function() {
					that.$cont.height(that.$pb.innerHeight() - that.offsetHeight);
				}
			});
			!opts.fixed && that.$pb.css('position','absolute');
			that.setPos(opts.top, opts.left);
			purebox.list[opts.id] = that;
			that._focus();
			return that;
		},
		_zindex : function() {
			window.pb_zindex = window.pb_zindex || 100000;
			return ++window.pb_zindex;
		},
		_setPbZindex : function() {
			var that = this;
			return that.$pb.css('z-index', that._zindex());
		},
		_setMaskZindex : function() {
			var that = this;
			return $('#pb-mask').css('z-index', that._zindex()).show();
		},
		_setMask : function() {
			var that = this;
			if($('#pb-mask').length) {
				that._setMaskZindex();
				that._setPbZindex();
			} else {
				var css = 'position:fixed;width:100%;height:100%;top:0;left:0;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=20);opacity:0.2;overflow:hidden;background-color:#000;_position:absolute;left:expression(documentElement.scrollLeft+documentElement.clientWidth-this.offsetWidth);top:expression(documentElement.scrollTop+documentElement.clientHeight-this.offsetHeight);',
					iframe = ie6 ? '<iframe src="about:blank" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>' : '';
				$('<div id="pb-mask" style="'+css+'">' + iframe + '</div>').css('z-index', that._zindex()).appendTo(document.body);
				that._setPbZindex();
			}
		},
		_setDrag : function() {
			return new purebox.dragable(this.$pb, this.$head);
		},
		_bindEvent : function(opts) {
			var that = this,
				opts = that.opts;
			that.$xBtn.length && that.$xBtn.click(function() {
				$.isFunction(opts.onClose) && opts.onClose();
				that.dispose();
			});
			that.$cBtn.length && that.$cBtn.click(function() {
				$.isFunction(opts.onCancel) && opts.onCancel();
				that.dispose();
			});
			that.$oBtn.length && that.$oBtn.click(function() {
				var onok = opts.onOk();				
				if($.isFunction(opts.onOk) && (onok == true || onok == null)){
					that.dispose();
				}
			});
			var resizeTimer;
			$win.resize(function() {
				resizeTimer && clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function () {
					that.setPos(opts.top, opts.left);
				}, 40);
			});
		},
		_focus : function() {
			var focus = purebox.focus;
			this.prev = focus;
			purebox.focus = this;
		},
		resize : function(width, height) {
			var that = this;
			that.$pb.css('width', max.call(Math,150,width) + 'px');
			that.$cont.css('height', max.call(Math,50,height) + 'px');
			return that;
		},
		setPos : function(top, left) {
			var that = this,
				dl = that.opts.fixed ? 0 : $doc.scrollLeft(),
				dt = that.opts.fixed ? 0 : $doc.scrollTop();
			if(top === 'c') {
				top = $win.height() - that.$pb.outerHeight();
				top = top > 0 ? dt + (top>>1)-(top>>3) : 0;
			}
			if(left === 'c') {
				left = $win.width() - that.$pb.outerWidth();
				left = left > 0 ? dl + (left>>1) : 0;
			}
			that.$pb.css({top:top,left:left});
			return that;
		},
		center : function() {
			return this.setPos('c', 'c');
		},
		setContent : function(c) {
			var that = this;
			if(typeof(c) === 'string') {
				that.$cont.html(c);
			} else if(c instanceof jQuery) {
				var display = c.css('display'),
					prev = c.prev(),
					next = c.next(),
					parent = c.parent();
				that._elemBack = function () {
					if (prev.length) {
						prev.after(c);
					} else if (next.length) {
						next.before(c);
					} else if (parent.length) {
						parent.append(c);
					};
					c.css('display',display);
					that._elemBack = null;
				};
				that.$cont.append(c);
			}
			return that;
		},
		dispose : function() {
			var that = this;
			
			that._elemBack && that._elemBack();
			that.$pb.remove();

			delete purebox.list[that.opts.id];
			purebox.focus = purebox.focus.prev;

			if(purebox.focus) {
				if(purebox.focus.opts.mask) {
					that._setMaskZindex();
				} else {
					$('#pb-mask').hide();
				}
				$('.pb').last().css('z-index', that._zindex());
			} else {
				$('#pb-mask').remove();
			}
		}
	};
	purebox.fn._init.prototype = purebox.fn;

	purebox.defaults = {
		id 		: 'pb',				
		title 	: '\u6807\u9898',	
		content : '',				
		width 	: 'auto',				
		height 	: 'auto',			
		left 	: 'c',				
		top 	: 'c',				
		fixed 	: true,				
		drag 	: true,				
		mask	: true,				
		resize 	: false,			
		head 	: true,			
		foot 	: true,				
		xBtn 	: true,				
		cBtn 	: true,				
		cl_cBtn : true,
		onClose	: null,				
		onOk 	: null,			
		onCancel: null			
	};
	purebox.focus = null;
	purebox.list = {};

	purebox.dragable = function() {
		return this.initialize.apply(this, arguments);
	};
	purebox.dragable.prototype = {
		initialize: function($drag, $handle) {
			this._drag = $drag;
			this._handle = $handle || this._drag;

			this.move = $.proxy(this.onMove,this);
			this.stop = $.proxy(this.onStop,this);

			this._handle.bind("mousedown", $.proxy(this.onStart,this));
		},
		onStart: function(event) {
			this._x = event.clientX - parseInt(this._drag.css('left'), 10);
			this._y = event.clientY - parseInt(this._drag.css('top'), 10);
			$doc.bind('mousemove',this.move).bind('mouseup', this.stop);
			if(ie){
				this._handle.bind("losecapture", this.stop);
				this._handle.get(0).setCapture();
			}else{
				$doc.bind("blur", this.stop);
				event.preventDefault();
			};
		},
		onMove: function(event) {
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			var iLeft = event.clientX - this._x,
				iTop = event.clientY - this._y,
				fixed = this._drag.css('position') === 'fixed',
				dl = fixed ? 0 : $doc.scrollLeft(),
				dt = fixed ? 0 : $doc.scrollTop(),
				maxLeft = dl + $win.width() - this._drag.outerWidth(),
				maxTop = dt + $win.height() - this._drag.outerHeight();
			iLeft = max(min(iLeft, maxLeft), dl);
			iTop = max(min(iTop, maxTop), dt);
			this._drag.css({top:iTop, left:iLeft});
		},

		onStop: function() {

			$doc.unbind("mousemove", this.move);
			$doc.unbind("mouseup", this.stop);
			if(ie){
				this.unbind("losecapture", this.stop);
				this._handle.get(0).releaseCapture();
			}else{
				$doc.unbind("blur", this.stop);
			};
		}
	};


	window.pb = $.pb = $.purebox = purebox;

	$.fn.pb = $.fn.purebox = function (options) {
		return this.bind('click', function() {
			$.pb(options);
		});
	};


	$.pb.alert = function(content, callback) {
		return $.pb({
			id : 'pb-alert',
			title : '\u63d0\u793a',
			content : wrapCont(content),
			width : 300,
			height 	: 70,
			onOk : callback,
			cBtn : false,
			resize : false
		});
	};
	
	$.pb.confirm = function(content, ok, cancel) {
		return $.pb({
			id : 'pb-confirm',
			title : '\u786e\u8ba4',
			content : wrapCont(content),
			width : 300,
			height 	: 70,
			onOk : ok,
			onCancel : cancel,
			resize : false
		});
	};

	
	function wrapCont(cont) {
		return '<div style="text-align:center;padding: 20px 10px 0;">' + cont + '</div>';
	}
})(window.jQuery);