"use strict;";

(function(){
	
// Bmcbuilder engine
function BmcbuilderEngine(){
	igk.winui.engine.formBuilderEngine.apply(this);
	
	var group = 0;
	var view = 0;
	var q = this;
	 
	
	function addLineRipple(d){
		var h = d.add('div');
		h.addClass('igk-winui-bmc-line-ripple');
	};
	
	function getView(){
		return group || view  || this.host;
	}
	
	this.addGroup = function(){
		var t = this.host.add("div");
		group = t.addClass("igk-winui-bmc-group");
		
		return q;
	};
	
	function _bindAttribute(t, m){
		if (typeof(m)=='object'){
			t.setAttributes(m);
		}
	};
	
	this.addLabel = function(f, t){
		var lb = getView().add("label").addClass("igk-winui-bmc-floating-label").setAttribute("for", f).setHtml(t);
		if(arguments.length>2){
			_bindAttribute(lb, arguments[2]);
		}
		return q;
	};
	this.getLastChild = function(){
		return this.getView().o.lastChild;
	}; 
	this.addControl = function(id, t, v){
		t = t|| "text";
		var i = getView().add("input");
		i.setAttribute("id", id)
		.setAttribute("name", id);
		i.o.value = v;
		
		this.host.engine.register(id, lb);
		
		if(arguments.length>3){
			_bindAttribute(lb, arguments[3]);
		}
		return q;
	};
	
	this.addControlLabel = function(id, v){
		var d = getView().add("div");
		d.addClass("igk-winui-bmc-textfield");
		
		var lb = d.add("input").setAttributes({
			id:id,
			name:id,
			value: v
		}).addClass("igk-winui-bmc-field__input");
		this.host.engine.register(id, lb);
		if(arguments.length>2){
			_bindAttribute(lb, arguments[2]);
		}
		
		d.add("label").setAttributes({
			"for":id
		}).addClass("igk-winui-bmc-floating-label").setHtml(this.getRes(id));
		
		
		d.init();
		
		
		return q;
	}

	this.addCombobox = function(id, v, items){
		var d = getView().add("div");
		d.addClass("igk-winui-bmc-textfield combobox");
		
		var s = d.add("select").setAttributes({
			id:id,
			name:id,
			value: v
		}).addClass("igk-winui-bmc-field__input");
		this.host.engine.register(id, s);
		
		if (items){
		var o = 0;
		var j = 0;
		for(var i= 0 ; i < items.length; i++){			
				j = items[i];
				o = s.add("option");
				o.setHtml(j.name);
				o.val(j.val);
				
				if (j.val == v){
					o.setAttribute("selected", !0);
				}
			
		}
		}
		addLineRipple(d);
		return d;
	};
};



igk.winui.engine.register("bmc", new BmcbuilderEngine());

	
})();

//igk-winui-bmc-textfield
(function(){
	
	
	function __init_field(){

		var q = this;
		var lb = q.select("label.igk-winui-bmc-floating-label").first();
		
		if (lb && igk.navigator.isSafari()){
			lb.on('click', function(){
				//force click
				var f = q.select('input#'+lb.getAttribute("for")).first();
				if (f)
					f.o.focus();
			});
		}			
		this.select("input").each_all(function(){
			
			var s = this;

			if (s.o.value!=''){
				s.addClass("focus");
			}
			s.reg_event("blur change", function(){
				if (s.o.value==''){
				 	s.rmClass("focus");
				}else{
					s.addClass('focus');
				}
				
			});
			// .reg_event("change", function(){
				// console.debug("data changed "+s.o.value);
			// });
		});
		//correct mouse click on label if the target element is already focused do not stop focus
		if(lb)
		lb.on("mousedown", function(e){
			var f = $igk("#"+lb.getAttribute("for")).first();
			if (f && (f.o == document.activeElement)){
				e.preventDefault();
			}
		});
		
	}


	igk.winui.initClassControl("igk-winui-bmc-textfield", __init_field);

})();

//igk-winui-bmc-canvas-surface
(function(){	
	function __init_surface(){
		var ctx = this.o.getContext("2d");		
		var g = igk.html5.Canvas.create2DDevice(this.o);
		if (!g)
			throw "Device not created";		
		g.fillRect("#F00", 10, 10, "50%", "50%");		
	};	
	igk.winui.initClassControl("igk-winui-canvas-surface", __init_surface);	
})();

//igk-winui-bmc-ripple
(function(){
	var ripples = [];
	var anim_class = "igk-bmc-anim-ripple";	
	igk.winui.initClassControl("igk-winui-bmc-ripple", function(){

		var q =this;
		var anim = 0;
		$igk(q.o.parentNode).on("click", function(e){
		
		//console.debug(e.target != q.o.parentNode);
		// console.debug("is parent: "+igk.dom.isParent(e.target,  q.o.parentNode));
		// console.debug("ripple : "+e["bmc_ripple"]);
			if (anim || e["bmc_ripple"] || !((e.target == q.o.parentNode) || igk.dom.isParent(e.target,  q.o.parentNode))) // || ((q.o.parentNode != e.target) && !igk.dom.isParent(e.target,  q.o.parentNode)))
			{
				return;
			}
			anim =1;
			e["bmc_ripple"] = 1; //mark that the event is handled by this bmc_ripple data
			var t = $igk(this);
			var W  = igk.getNumber(t.getComputedStyle("width"));
			var H  = igk.getNumber(t.getComputedStyle("height"));
			var d = Math.sqrt( W*W + H*H); //Math.max(W,H);
			var loc = t.getScreenLocation();
	
			q.setCss({
				width:d+"px",
				height:d+"px",
				// left: (e.clientX - this.offsetLeft- d/2.0)+"px",
				left: (e.clientX - loc.x - d/2.0)+"px",
				top: (e.clientY -  loc.y - d/2.0)+"px"
			});			
			$igk(q.o.parentNode).addClass(anim_class);
		}).on("animationend", function(e){
			var n = e.animationName;
			if ((n == "bmc-ripple") && (e.target == q.o)){
				$igk(q.o.parentNode).rmClass(anim_class);
				anim=0;
			}
		});
	});
	
})();

//igk-winui-bmc-canvas-img
(function(){
	
	function bmcChainBase(){
		var _next=null;
		var _prev=null;
		igk.appendProperties(this,{
			next: function(){
				return _next;
			},
			prev:function(){
				return _prev;
			},
			setnext:function(n){
				_next = n;
			},
			render:function(){
				console.debug("must override this");
			},
			toString:function(){
				return "[BMC - ChainObject]";
			}
		});
	};
	function rectChain(x,y,w,h){		
		bmcChainBase.apply(this);
		var _x = x, _y = y, _w = w, _h = h;
		this.render=function(_ctx){
			//debug test
			
			// igk.show_notify_prop(_ctx);
			_ctx.fillStyle = "red";
			_ctx.filter = "blur(4px)";
			_ctx.shadowColor="black";
			_ctx.shadowBlur=10;
			_ctx.rect(_x, _y, _w, _h);
			_ctx.fill();
		};
	}
	function imgChain(img){
		
		bmcChainBase.apply(this);
		var _x=0, _y=0;
		igk.defineProperty(this, "x", {
			get: function(){
				return _x;
			},set:function(v){
				_x = v;
			}
		});
		igk.defineProperty(this, "y", {
			get: function(){
				return _y;
			},set:function(v){
				_y = v;
			}
		});
		this.render = function(_ctx){
			_ctx.drawImage(img.o, _x,_y, img.o.width, img.o.height);
		};		
	};
	function imgChainLayer(){
		bmcChainBase.apply(this);
		var _items = 
		this.render = function(_ctx){
			var _t = _items;
			while(_t){
				_t.render(_ctx);
				_t = _t.next();
			}
		};	
	}
	function render(_ctx, chain){
		while(chain){
			chain.render(_ctx);
			chain = chain.next();
		}
	};
	igk.winui.initClassControl("igk-winui-bmc-canvas-img", function(){
		var _ctx = this.o.getContext("2d");
		var uri = this.getAttribute("igk:data");
		var img = igk.createNode("img");
		var _chain = null;
		var _cur = null;
		q = this;
		igk.appendProperties(q, {
			refresh:function(){
				render(_ctx, _chain);
			}
		});
		
		function append(data){
			if (_chain==null){
				_chain = data;
				_cur = _chain;
			}else{
				_cur.setnext(data);
				_cur = data;
			}
		};
		img.on("load", function(){	
			img.o.style.filter="blur(8px)";
			$igk("canvas").first().o.parentNode.appendChild(img.o);
			
			var b = $igk("#isvg").first();
			
				console.debug(b.o);
			
			append(new imgChain(img));
			append(new rectChain(0,0,40,200))
			
			append(new imgChain(b));
			
			console.debug(b);
			var c_ctx = igk.createNode("canvas").setCss({
				"filter":"blur(4px)"
			}).o.getContext("2d");
			
			c_ctx.filter = "blur(4px)";
			render(c_ctx, _chain);
			
			//support filter
			
			var data = c_ctx.getImageData(0,0, c_ctx.canvas.width, c_ctx.canvas.height);
			for(var j = 0; j < data.data.length; j+=4){
				
				data.data[j] = 0;
				data.data[j+1] = data.data[j+1];
				data.data[j+2] = data.data[j+2];
				// data.data[j+3] = 0;
				// data.data[j] = 0;
			}
			console.debug(data);
			_ctx.putImageData(data,0,0);
			
			// igk.show_notify_prop(c_ctx);
			
			//_ctx.drawImage(c_ctx.canvas, 0, 0);
			
			
			
			
			
			
			// var c = new imgChain(img);
			// c.x = 10;
			// c.y = 10;
			// c.filter = "";
			// append(c);
			//q.refresh();			
		});
		img.o["src"] = uri;	
	});
})();


//igk-winui-bmc-radio
(function(){
	igk.winui.initClassControl("igk-winui-bmc-radio",function(){		
				var o = this.select('input').first().on("keyup", function(e){
					
					if (!e.handle && this.checked  &&  e.keyCode == 32){
						e.stopPropagation();
						e.preventDefault();
						this.checked = false;
						e.handle =1;
					}
				}).o;
				this.reg_event("click", function(e){
					if (e.handle || (e.target == o))
						return;
					e.stopPropagation();
					e.preventDefault();
					o.checked = !o.checked;
					e.handle=1;
					o.focus();
				});


			});		
})();


//igk-winui-bmc-checkbox
(function(){
	igk.winui.initClassControl("igk-winui-bmc-checkbox",function(){		
				var o = this.select('input').first().o;
				this.reg_event("click", function(e){
				
					if (e.handle || (e.target == o))
						return;
					e.stopPropagation();
					e.preventDefault();
					o.checked = !o.checked;
					// console.debug(o.change);
					igk.winui.events.raise(o, "change");
					e.handle=1;
					o.focus();
				});


			});		
})();


//logosearch file
(function(){
	igk.ready(function(){
		var g = $igk("label.igk-winui-bmc-focus-label").on("mousedown", function(e){
		//__cancelfor(this);
		//console.debug("mousedown .... ");
		var f = $igk("#"+this.getAttribute("for")).first();
		//console.debug(f);
		if (f && (f.o == document.activeElement)){
			//console.debug("prevent default");
			e.preventDefault();
		}
	}).each_all(function(){
		var p =$igk(this.o.parentNode);
		p.select("input").each_all(function(){
		
			this.on("blur", function(){
				
				if (this.value==''){
				 	p.rmClass("igk-show");
				}else{
					p.addClass('igk-show');
				}	
		});
		});
	});
		
		if (igk.navigator.isSafari()){
			g.each_all(function(){
				var q =$igk(this.o.parentNode);
				var f = q.select('input#'+this.getAttribute("for")).first();
				f.setCss({opacity:'1.0'});
				
			}).on('click', function(e){
				var q =$igk(this.parentNode);
				//force click
				var f = q.select('input#'+this.getAttribute("for")).first();
				if (f){
					//f.setCss({ 'opacity':'0.5', 'border':'1px solid black'});
				//console.debug("focus on label " + f.o );
				//in safari focus can't be set on transiting element
				q.addClass('igk-show');	
				setTimeout( function(){
					f.o.focus();
				}, 500);
				//f.o.focus();
				e.preventDefault();
				e.stopPropagation();
				}
			});
		}
	}
	);
})();

// igk-winui-bmc-search-field

(function(){

	function __init_search_field(){
		var q = this;
		var i = q.select(".igk-winui-bmc-field__input").first();
		if (i)
		i.on("keyup", function(e){
			if (e.keyCode == igk.winui.inputKeys.Enter){
				var ref = q.getAttribute("igk:ref");
				var t = q.getAttribute("igk:target");
				if (ref){
					igk.ajx.get(ref+"?q="+i.o.value, null, function(xhr){
						if (this.isReady()){
							var _e = 0;
							if (t && (_e = $igk(t)).found()){
								_e.setHtml(xhr.responseText).init();
							}else{
								igk.ajx.fn.replace_or_append_to_body.apply(this, [xhr]);
							}
						}
					});
				}
			}	
		});

	}

	igk.winui.initClassControl("igk-winui-bmc-textsearchfield", __init_search_field);

})();