
	/*=================可编辑样式====================*/
	var Data={
		type:{
			head:{css:['size','background','border','text']},
			goodsLR:{css:['size','background','border','text']},
			goodsTB:{css:['size','background','border','text']},
			list:{css:['size','background','border','text']},
			image:{css:['size','border']},
			gallery:{css:[]},
			palaces:{css:[]},//宫格
			bottomNav:{css:[]}//底部导航
		}	
	};
	var topSwiper,topSwiper2;
	var hotZoneImgSwiper;
	var newConSwiperOne,newConSwiperTwo,newConSwiperThree;
	var thisClickObj='';
	// function(cssArr){
	// 	var i=0,l=cssArr.length,html;
	// 	for(i;i<cssArr.length;i++){
	// 		switch (cssArr[i]){
	// 			case 'align':
	// 		}
	// 	}
	// }
	/*=============================================*/
	
	
	$(function(){
	  //tabli标签切换
	  function qhli(){
		$('.tab_ul .kdli').click(function() {//实现tab样式切换
			// $(this).addClass('liactive').siblings().removeClass('liactive');
			//当前tab选中图片去掉ndis
			$(this).children("a").children(".lcxz").removeClass("ndis"); 
			//当前tab选中图片展示并且同级的a标签lcwx隐藏
			$(this).children("a").children(".lcxz").addClass("disb").siblings(".lcwx").addClass("ndis").removeClass("disb");
			//当前tab的同级别的tab下的a标签的未选中楼层展示
			$(this).siblings().children("a").children(".lcwx").addClass("disb").removeClass("ndis");
			//当前tab的同级别的tab下的a标签的未选中楼层隐藏
			$(this).siblings().children("a").children(".lcxz").addClass("ndis").removeClass("disb");
		});
	  }
	
	
		
		//上传图片 
		$(document).on('change','.imgInput',function(){
			$(this).parents('.uploadImg').find('.imagesZw').css("display","none");
			$(this).parents('.uploadImg').find('.imgPerview').show().attr("src", URL.createObjectURL($(this)[0].files[0]));
			$(this).parents('.uploadImg').find('.opacityP').text('删除').addClass('j-deleteImg');
			return;
		}); 
	
		//模板管理删除图片
		$(document).on("click", '.j-deleteImg',function (obj) {
		  var $this = $(this);
		  $this.parent().find('.imgPerview').attr('src','');
		  $this.parent().find('.imgInput').val('');
		  $this.parent().find('.imgPerview').css("display","none");
		  $this.parent().find('.imagesZw').css("display","block");
		  $this.text('上传图片').removeClass('j-deleteImg');
	  
		});
		
		$('#append').on('click',function(e){
			e.preventDefault();
			
			$('#doc-wrap2').show();
				
			
			$('#doc-wrap2 .demo').html($('#doc-wrap .demo').html());
			sizeInit();
			$( "#doc-wrap2 .col" ).sortable();
			//$( ".doc-wrap .demo").removeClass('ui-sortable');
			$('#doc-wrap').remove();
			
		 
			var cols=$('.col .col',demo);
			cols.sortable({//房间与房间之间的拖拽
				opacity:0.5,
				connectWith: '.col .col',
				handle:'.drag',
				start: function(e,t) {
					(sort===0) && (sort++)
				},
				stop: function(e,t) {
					sort--;
					if(!drag){
						reSlide(t.item.eq(0),1);
						htmlRec(); 
					} 
	
				}
			});
			sizeInit();
			heightChe();
		
		});
		/*
		**获取本地存储并填充
		*/
		var demo=$('.demo'),
			htmlData;
			//判断是否obj对象
		function supportstorage() {
			if (typeof window.localStorage=='object') 
				return true;
			else
				return false;		
		};
		function clearResizeHtml(){//填充之前清除之前resize时动态增加的html 避免重新初始化时冲突
				$('.ui-resizable').removeClass('ui-resizable');
				$('.ui-resizable-handle').remove();
				$('.ui-sortable').removeClass('ui-sortable');
		};

		//20211223add遍历tab楼层初始化 不用给编辑图标设置src
		function eachTab(el){
			if($(el).hasClass("opimg")){//是编辑按钮true 不是编辑按钮false
				return true;
			}else if($(el).hasClass("zjimg")){
				return true;
			}else{
				return false;
			}
		}

		function restoreData(){
			if (supportstorage()) {
				htmlData = JSON.parse(localStorage.getItem("htmlData"));
				 
				if(!htmlData){//缓存放置html 要放置带着data-src的， 
				 
					htmlData={count:0,step:[demo.html()],css:''}; 
					console.log(htmlData);
					return false;
				};
				if(!htmlData.count){return false;}
				demo.html(htmlData.step[htmlData.count]);
				
				clearResizeHtml();
				$('#css-wrap').text(htmlData.css);

				reDatasrc(); //渲染正常图片

			}
		};

		/**
		 * 20211215add 
		 * 页面渲染时重构data-src
		 * 渲染页面获取img标签是否有data-src属性
		 * 判断data-src属性赋值给img标签
		 * 回显保存都不设置编辑按钮图片src属性
		 **/
		function reDatasrc(){
			 var div = document.getElementsByClassName("demo")[0];
			 
			 var imgs = div.querySelectorAll("img");
			 imgs.forEach((el)=>{
				 //判断已经有data-src的或者是其他功能img的不是展示的不需要设置data-src属性
				 if(el.getAttribute("index-src") || eachTab(el)){
					// console.log("判断是编辑按钮不设置data-src属性");
				 }else{
					 //设置data-src属性
					//  console.log(el.getAttribute("src"),"hahah")
					 var url = el.getAttribute("src");
					 el.setAttribute("index-src",url);
					 
				 } 
			})
			  
		}

		/**
		 * 2021add 1223 qsf 
		 * 新的模板设置data-src，
		 * 旧的模板编辑保存的时候也设置一遍data-src
		 * 旧模板编辑变成新的模板加标识 -待定
		 * getElementsByTagName
		 * querySelectorAll
		 * 编辑和新建首次进来在本地缓存是没有数据的，当保存触发后才会设置缓存
		 * 因此在设置缓存前将页面设置data-src属性后再保存本地缓存或者是数据库
		 **/
		function setDatasrc(){
			var dm = document.getElementsByClassName("savehtml")[0];
			var imgs = dm.querySelectorAll("img");
			imgs.forEach((el)=>{
				//保存的时候没有data-src的img或者是tab楼层下小按钮不设置index-src属性
				if(!el.getAttribute("index-src") || !eachTab(el)){
					var srcurl = el.getAttribute("src"); 
					el.setAttribute("index-src",srcurl);
					// el.setAttribute("src","../images/zhanwei.png");
					if(srcurl.indexOf("demo") == -1){
						el.setAttribute("src","../../images/decorate/zhanwei.png")
					}
				}else{
					if(srcurl.indexOf("demo") == -1){
						el.setAttribute("src","../../images/decorate/zhanwei.png")
					}
				}
			})
		}
        
		
		

		function reSlide(wrap,reb){
			box=wrap;
			$.each($('.slider',box),function(k,v){
				if(reb){reBuild($(this));}
				else{
					var h=$(this).parent().width()/2;
					$(this).gallery({height:h});
				}
			});
		}
		function reBuild(e){
			var html='<div><ul>'+$('ul',e).html()+'</ul></div>',
				p=e.parent(),
				w=p.width(),
				h=w/2;
	
			e.empty()
			.data('gallery',null)
			.removeClass()
			.addClass('slider')
			.html(html)
			.gallery({height:h,width:w});
		}
		
		restoreData();
		//尺寸调整
		var docWindow=$(window),
			wrap=$('.doc-wrap'),
			sideBar=$('.side-bar'),
			layer=$('.edit-layer',this);
			layer2=$('.edit-layer2',this);
			mp=parseInt(wrap.css('paddingTop'))
			+parseInt(wrap.css('paddingTop'))
			+parseInt(wrap.css('marginTop')),
			resizeTid=null;
		function modalMove(){
			$('.modal:visible').each(function(){
				$(this).css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				});
			})
		}
		function heightChe(r){
			if(demo.innerHeight()>wrap.height()){
				wrap.addClass('scroll');
				resizeInit($('.row',demo).data('resize',0));
				reSlide(demo,1);
			}else{
				if(wrap.hasClass('scroll')){
					wrap.removeClass('scroll');
					reSlide(demo,1)
				}else{
					r && reSlide(demo,1);
				};
				r && resizeInit($('.row',demo).data('resize',0));
			}
		};
		function sizeInit(){
			var H=docWindow.height();
			sideBar.css('height',H);
			wrap.css('height',H-mp);
			modalMove();
	
			heightChe(1)
			resizeTid=null;	
		};
		document.onselectstart=function(){return false;};
		sizeInit();
		docWindow.on('resize',function(){
			resizeTid && clearTimeout(resizeTid);
			resizeTid=setTimeout(sizeInit,50);
		});
		//左侧菜单折叠
		var topNav=$('.top-nav'),
			subNav=$('.sub-nav');
		$('.top-nav>li>a')
		.on('click',function(e){
			e.preventDefault();
			e.stopPropagation()
			var menuList=$(this).next();
			if(menuList.css('display')=='block'){
				menuList.slideUp('fast');
				$(this).removeClass('open');
			}else{
				$(this).addClass('open');
				menuList.slideDown('fast');
			}
		});
	
	
		/*
		**拖拽及排序:
		**变量&&绑定&&初始化
		**控制按钮组
		*/
		var drag=0,
			sort=0,
			selector='.bigFloor,.lyrow,.box,.wdg,.wdgN,myswiper,.col,.tbx',
			body=$('body').addClass('edit'),
			idNames=[];
		function setId(eleName){
			$.each($('.'+eleName,demo),function(k, v){
				var child=$('.view',v).children();
				if(!child.attr('id')){child.attr('id',eleName+(new Date()).getTime())}
			})
		};
		function htmlRec(del,eleName){
			eleName && setId(eleName);
			var html=demo.html(),
				data=htmlData;
			data.count++;
			if(del){ data.step.push(html);heightChe();return false;}
			!drag && !sort && data.step.push(html);
			
			heightChe();
		};
		function initContainer(){ 
			var opts={
				connectWith: '.bigFloor',
				opacity:0.5,
				handle: '.drag',
				start: function(e,t) {
					console.log("ddd"+sort);
					(sort===0) && (sort++);
				},
				stop: function(e,t) { //拖拽拖拽
					sort--;
					drag || htmlRec();
					console.log('www',t,sort);
					
				}	
			},opts2=$.extend({},opts,{
				stop: function(e,t) {
					sort--;
					console.log('aaa' +sort);
					if(!drag){htmlRec();}
				}
			});
			
			demo.sortable(opts);
			//$('.bigFloor',demo).sortable(opts2);
		};
		function resizeInit(rows){
			$.each(rows,function(){
				
				if(!$(this).data('resize')){
					var row=$(this).addClass('resizable'),
						cols=$('.col',row),
						rWidth=row.width(),
						dis=(100/$('.col',row).length).toFixed(1);
	
					$(this).data('resize',1);
				}
			})
		};
		//排序初始化
		initContainer();
	 
		var $tabs;//初始化需要判断只有tab楼层才有的切换
		//左侧拖拽&&右侧排序
		$('.sidebar-nav .bigFloor').draggable({//拖拽外层框架(布局)
			connectToSortable: '.demo',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) { 
				drag++;},
			drag: function(e,t) {t.helper.width(100);},
			stop: function(e,t) { 
				drag--;
				htmlRec(0,'bigFloor');
				var cols=$('.col',demo);
				cols.sortable({
					opacity:0.5,
					connectWith: '.demo',
					handle:'.drag',
					start: function(e,t) {
						console.log("bbb拖拽外层框架"+sort);
						(sort===0) && (sort++)},
					stop: function(e,t) {
						sort--;
						if(!drag){
							reSlide(t.item.eq(0),1);
							htmlRec(); 
						};
						
					}
				});
				resizeInit($('.row',demo));//判断窗口是否被调整
				t.helper.attr('id','idname'); 
				if(t.helper.hasClass("tbbigFloor")){//判断如果是拖拽的tab楼层
					qhli();//初始化li标签的样式
					var bs = demo.find(".tablcs").children("div").children(".tab_ul").children(".kdli");
					var bsd = demo.find(".tablcs").children(".bydiv");
					 
					initTabId(bs,bsd);//动态添加id
					$tabs = demo.find(".tabslc").tabs();//初始化tabs
					$(".demo .swiper-tabHd").each(function(i,u){
						if(!$(u).hasClass("tabHd_"+i)){
							$(this).addClass("tabHd_"+i);
						
							//初始化菜单滑动
							// ;//添加事件执行的唯一样式
							// var swipertabHd = new Swiper('.tabHd_'+i, { 
							// 	slidesPerView: 'auto',
							// 	spaceBetween: 10 
							// });
	
							var swipertabHd = new Swiper('.tabHd_'+i, { 
			//					设置slider容器能够同时显示的slides数量(carousel模式)。
			//					可以设置为number或者 'auto'则自动根据slides的宽度来设定数量。
			//					loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides。
								slidesPerView: 3.5,
								paginationClickable: false,//此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
								spaceBetween: 10,//slide之间的距离（单位px）。
								freeMode: false,//默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
								loop: false //是否可循环
								 
							});
	
							$('.swiper-tabHd .swiper-slide').click(function() { //点击滑动的地方 
								var ix = parseInt($(this).index());
								// console.log($(this).index());
								if(ix > 1) {
									swipertabHd.slideTo(ix - 1, 300, false); //切换到第一个slide，速度为1秒 
								}
							});
						}
				   });
 
				
				}
				if(t.helper.hasClass("hydjFloor")){//判断如果是会员等级楼层的tab楼层
					 $(this).find(".hyLczd").addClass("j-hyLczd");
				}
			}
		});
	
		function initTabId(bs,bsd){//初始化id和href
			$.each(bs,function(i,eleName){//遍历tr
				i++;
				if(!$(eleName).children("a").prop("href").indexOf("#tabslc-")>-1){
					$(eleName).children("a").prop("href","#tabslc-"+i);
				}
			});
			
			$.each(bsd,function(i,eleName){//遍历tr
				i++;
				if(!$(eleName).attr('id')){
					$(eleName).attr("id","tabslc-"+i);
				}
			});
		}
	
		$('.sidebar-nav .lyrow').draggable({//拖拽布局
			connectToSortable: '.col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++;},
			drag: function(e,t) {t.helper.width(100);},
			stop: function(e,t) { //拖拽拖拽
				drag--;
				console.log(t,$(t.item).parents(),'//拖拽布局')
				htmlRec(0,'lyrow');
				var cols=$('.col',demo);
				cols.sortable({//栏与栏之间的拖拽
					opacity:0.5,
					connectWith: '.demo .lyrow',
					handle:'.demo .drag',
					placeholder:"holderCss",
					start: function(e,t) {
						(sort===0) && (sort++)
					},
					stop: function(e,t) {
						sort--;
						if(!drag){
							reSlide(t.item.eq(0),1);
							htmlRec(); 
						} 
						
					}
				});
				resizeInit($('.demo .row',demo));
				t.helper.attr('id','idname');
				
			}
		});
	
		$('.sidebar-nav .box').draggable({//拖拽房间布局
			connectToSortable: '.col .col',
			helper: 'clone',
			opacity:0.5,
			height:'100',
			start: function(e,t) {
				drag++;
			},
			drag: function(e,t) {
				t.helper.width(100);
			},
			stop: function(e,t) {
				drag--;
				htmlRec(0,'box');
				var cols=$('.col .col',demo);
				console.log('uiui//拖拽房间布局')
				cols.sortable({//房间与房间之间的拖拽
					opacity:0.5,
					connectWith: '.col .col',
					handle:'.drag',
					start: function(e,t) {
						(sort===0) && (sort++)
					},
					stop: function(e,t) {
						console.log('ooppp//拖拽房间布局')
						sort--;
						if(!drag){
							reSlide(t.item.eq(0),1);
							htmlRec(); 
						} 
	
					}
				});
				
			}
		});
		
		$('.sidebar-nav .wdg').draggable({ //拖拽拖拽
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {t.helper.width(300);},
			stop: function(e, t) {
				
				reSlide();
				drag--;
				htmlRec(0,'wdg');
				sizeInit();
				
			}
		});
	
		$('.sidebar-nav .wdgN').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {t.helper.width(300);},
			stop: function() { 
				console.log('.sidebar-nav .wdgN')
				reSlide();
				drag--;
				htmlRec(0,'wdgN');
				sizeInit();
				// var mySwiper = new Swiper('.banner .swiper-container-nlbt', {
				// 	slidesPerView: 1,
				// 	pagination : '.swiper-pagination',
				// 	autoplayDisableOnInteraction : false,
				// 	loop : true,
				// 	autoplay: 2000,
				// 	coverflow: {
				// 		rotate: 0, // 旋转的角度
				// 		depth: 0, // 深度   切换图片间上下的间距和密集度
				// 	}
				//   });
				var swipertabHd = new Swiper('.scaleSwiperYa', { 
					paginationClickable: false,//此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
					spaceBetween: 10,//slide之间的距离（单位px）。
					loop: false //是否可循环
						
				});
			}
		});
	
		$('.sidebar-nav .myswiper').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {t.helper.width(300);},
			stop: function() {
				console.log('.sidebar-nav .myswiper')
				reSlide();
				drag--;
				htmlRec(0,'myswiper');
				sizeInit();
	
				// var cols=$('.col .col',demo);
				// cols.sortable({//房间与房间之间的拖拽
				// 	opacity:0.5,
				// 	connectWith: '.col .col',
				// 	handle:'.drag',
				// 	start: function(e,t) {
				// 		(sort===0) && (sort++)
				// 	},
				// 	stop: function(e,t) {
				// 		sort--;
				// 		if(!drag){
				// 			reSlide(t.item.eq(0),1);
				// 			htmlRec(); 
				// 		} 
	
				// 	}
				// });
			}
			
		});
	 
		$('.sidebar-nav .hxmenu').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {t.helper.width(300);},
			stop: function() {
				console.log('.sidebar-nav .hxmenu')
				reSlide();
				drag--;
				htmlRec(0,'hxmenu');
				sizeInit();
				//初始化菜单滑动
				var swiperhxcd = new Swiper('.swiper-hx', {
					slidesPerView: 3, //头部一行显示多少个 .5表示显示半个
					paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
					spaceBetween: 10, //slide之间的距离（单位px）。
					freeMode: true, //默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
					loop: false, //是否可循环
					pagination : '.swiper-pagination' 
				   
				});
			}
			
		});
	
		//跑马灯文本
		$('.sidebar-nav .msgpmdbox').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {t.helper.width(300);},
			stop: function() {
				console.log('.sidebar-nav .msgpmdbox')
				//初始化菜单滑动
				var swiperMessage = new Swiper('.swiper-container-meseage', {
					height: 20,
					direction: 'vertical',
					autoplay: 3000,
					observer:true,
					observeParents:true
				});
				reSlide();
				drag--;
				htmlRec(0,'msgpmdbox');
				sizeInit();
				
			}
			
		});
	
		//滑动元素拖拽 1223 add
		$('.sidebar-nav .hdysBox').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {
				t.helper.width(300); 
			},
			stop: function() {
	
				console.log('.sidebar-nav .hdysBox')
				// console.log(t);
				// $(".demo .col .col .swiper-hdys").addClass("stxwtz");
				$(".demo .col .col .swiper-hdys").each(function(i,u){ 
					if(!$(u).hasClass("hdys_"+i)){
						$(this).addClass("hdys_"+i);
						//初始化菜单滑动
						// ;//添加事件执行的唯一样式
						var swiperhdys = new Swiper('.hdys_'+i, { 
							slidesPerView: 3.5, //这里默认三个，实际参数可配置， 头部一行显示多少个 .5表示显示半个
							paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
							spaceBetween: 10, 
							freeMode: true, //默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
							loop: false, //是否可循环 
							scrollbar:'.hdys-scrollbar',
							scrollbarHide : false,
							scrollbarSnapOnRelease:true
							
						
						});
					}
			   });
	
				
				reSlide();
				drag--;
				htmlRec(0,'hdBox');
				sizeInit();
				
			}
			
		});
	
		//便民功能模块拖拽 20211129 add
		$('.sidebar-nav .jbmgnBox').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {
				t.helper.width(300); 
			},
			stop: function() {
				console.log('.sidebar-nav .jbmgnBox')
				$(".demo .col .col .jbmgnswip").each(function(i,u){ 
					if(!$(u).hasClass("bmgn_"+i)){
						$(this).addClass("bmgn_"+i);
						//初始化菜单滑动
						// ;//添加事件执行的唯一样式
						var swiperbmgn = new Swiper('.bmgn_'+i, { 
							slidesPerView: 3.5, //这里默认3.5个，实际参数可配置， 头部一行显示多少个 .5表示显示半个
							paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
							spaceBetween: 10, 
							freeMode: true, //默认为false，普通模式: slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
							loop: false, //是否可循环  
							scrollbarHide : false,
							scrollbarSnapOnRelease:true
							
						
						});
					}
			   });
				reSlide();
				drag--;
				htmlRec(0,'showFeeBox');
				sizeInit();
				
			}
			
		});

		
		//卖家信息新 20230719 add
		$('.sidebar-nav .sellerInfoBox').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {
				t.helper.width(300); 
			},
			stop: function() {
				console.log('.sidebar-nav .sellerInfoBox')
				$(".demo .col .col .sellerInfoBox").each(function(i,u){ 
					var mySwiper = new Swiper('.mySwiperBox', {
						autoplay: 3000,//可选选项，自动滑动
						pagination : '.swiper-pagination',
					});
				});
				reSlide();
				drag--;
				htmlRec(0,'showFeeBox');
				sizeInit();
			}
		});
		//IOP广告 20230908
		$('.sidebar-nav .iopAdSwiperBoxYa').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {
				t.helper.width(300); 
			},
			stop: function() {
				console.log('.sidebar-nav .iopAdSwiperBoxYa')
				$(".demo .col .col .iopAdSwiperBoxYa").each(function(i,u){ 
					topSwiper = new Swiper('.iopAdSwiperBox', {
						// autoplay: 3000,//可选选项，自动滑动
						pagination : '.swiper-pagination',
						observer: true, 
						observeParents: true, //监测Swiper 的祖/父元素 
						autoplayDisableOnInteraction: false
					});
				});
				reSlide();
				drag--;
				htmlRec(0,'showFeeBox');
				sizeInit();
			}
		});
		//20231030-新便民功能模块
		$('.sidebar-nav .newConvenientYa').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {
				t.helper.width(300); 
			},
			stop: function() {
				$(".demo .col .col .newConvenTop").each(function(i,u){ 
					newConSwiperOne = new Swiper('.newConvenTop', {
						slidesPerView: 4,
						// spaceBetween: 30,
						freeMode: true,
						observer: true, 
						observeParents: true, //监测Swiper 的祖/父元素 
						autoplayDisableOnInteraction: false
					});
					newConSwiperThree = new Swiper(".mySwiper2", {
						direction: "vertical",
						loop: true, //是否可循环
						autoplay: 3000,//可选选项，自动滑动
						autoplayDisableOnInteraction: false,
					});
				});
				$(".demo .col .col .newConvenBottom").each(function(i,u){ 
					var bottomNum = 3
					console.log($(this).find('.swiper-slide').length)
					if($(this).find('.swiper-slide').length <= 2){
						bottomNum = 2
					}
					newConSwiperTwo = new Swiper('.newConvenBottom', {
						// slidesPerView: 3.2,
						slidesPerView: bottomNum,
						spaceBetween: 10,
						freeMode: true,
						observer: true, 
						observeParents: true, //监测Swiper 的祖/父元素 
						autoplayDisableOnInteraction: false
					});
				});
				reSlide();
				drag--;
				htmlRec(0,'showFeeBox');
				sizeInit();
			}
		});
		//20231107-分类
		$('.sidebar-nav .classificationYa').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {
				t.helper.width(300); 
			},
			stop: function() {
				if($('.demo .classificationYa').length>1){
					$('.demo .classificationYa').each(function(){
						if(!$(this).hasClass('classificationYa111')){
							$(this).remove()
						}
					})
				}else{
					$('.demo .classificationYa').addClass('classificationYa111')
				}
				$('.demo .leftCfPart>div').on('click',function(){
					$(this).addClass('act').siblings().removeClass('act')
					var itemYa = $(this).parents('.lrCfBlock').find('.rightCfList .rightCfItem')
					$('.demo .rightCfPart').animate({
						scrollTop: itemYa.eq($(this).index()).offset().top - itemYa.eq(0).offset().top
					})
				})
				$('.demo .rightCfPart').scroll(debounce(handlerFunc, 50))	
				// 点击tab滚动div的距离
				function heightYaa(index) {
					var heightNow = 0
					if(index != 0){
						for (var i = 0; i < index; i++) {
							heightNow += $('.demo .rightCfPart .rightCfItem').eq(i).outerHeight()
						}
					}
					return heightNow
				}
				function changeNav(index) {
					$('.demo .leftCfPart>div').eq(index).addClass('act').siblings().removeClass('act')
				}
				//滚动条滚动之后要执行的方法
				function handlerFunc() {
					console.log($('.demo .rightCfPart').scrollTop())
					let divScrollTop = $('.demo .rightCfPart').scrollTop()
					let arrHeight = []
					$('.demo .rightCfPart .rightCfItem').each(function(i) {
						arrHeight.push(heightYaa(i));
					})
					let _lenYa = arrHeight.length;
					for (var i = 0; i < arrHeight.length; i++) {
						if (divScrollTop == 0 || divScrollTop < arrHeight[i] - 1) {
							changeNav(0);
							break;
						} else if (divScrollTop >= arrHeight[_lenYa - 1]) {
							changeNav(_lenYa - 1);
							break;
						} else if (divScrollTop > arrHeight[i - 1] && divScrollTop < arrHeight[i + 1] - 1) {
							changeNav(i);
							break;
						}
					}
				}
				//防抖
				function debounce(func, wait) {
					//定时器变量
					var timeout;
					return function () {
						//每次触发scrolle，先清除定时器
						clearTimeout(timeout);
						//指定多少秒后触发事件操作handler
						timeout = setTimeout(func, wait);
					};
				};
				reSlide();
				drag--;
				htmlRec(0,'showFeeBox');
				sizeInit();
			}
		});
		//运营推荐广告
		$('.sidebar-nav .operationalRec').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {
				t.helper.width(300); 
			},
			stop: function() {
				reSlide();
				drag--;
				htmlRec(0,'showFeeBox');
				sizeInit();
			}
		});
		//图片热区组件拖拽事件 hotZoneImages
		$('.sidebar-nav .hotZoneImagesYa').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {
				t.helper.width(300); 
			},
			stop: function() {
				let flag = true
				if($('.demo .hotZiPart .swiper-slide').length == 1){
					flag = false
				}
				hotZoneImgSwiper = new Swiper('.demo .hotZiPart', {
					pagination : flag?'.swiper-pagination':'',
					loop: false, //是否可循环
					observer: true, 
					observeParents: true, //监测Swiper 的祖/父元素 
					autoplayDisableOnInteraction: false,
				});
				reSlide();
				drag--;
				htmlRec(0,'showFeeBox');
				sizeInit();
			}
		});
		//试一下轮播图-新轮播图
		$('.sidebar-nav .testYaaa').draggable({
			connectToSortable: '.demo .col .col',
			helper: 'clone',
			opacity:0.5,
			start: function(e,t) {drag++},
			drag: function(e, t) {
				t.helper.width(300); 
			},
			stop: function() {
				console.log('.sidebar-nav .testYaaa')
				$(".demo .col .col .testYaaa").each(function(i,u){ 
					topSwiper = new Swiper('.scaleSwiper', {
						// autoplay: 3000,//可选选项，自动滑动
						slidesPerView: 2, //头部一行显示多少个 .5表示显示半个
						pagination : '.swiper-pagination',
						loop: false, //是否可循环
						centeredSlides: true,
						observer: true, 
						observeParents: true, //监测Swiper 的祖/父元素 
						autoplayDisableOnInteraction: false,
						paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
					
					});
					topSwiper2 = new Swiper('.threeHallFlag', {
						// autoplay: 3000,//可选选项，自动滑动
						slidesPerView: 3, //头部一行显示多少个 .5表示显示半个
						// pagination : '.swiper-pagination',
						spaceBetween: 10,
						loop: false, //是否可循环
						observer: true, 
						observeParents: true, //监测Swiper 的祖/父元素 
						autoplayDisableOnInteraction: false,
						paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
					
					});
				});
				reSlide();
				drag--;
				htmlRec(0,'showFeeBox');
				sizeInit();
			}
		});

		//协议拖拽新增 20211129 add
		// $('.sidebar-nav .wdxybox').draggable({
		// 	connectToSortable: '.demo .col .col',
		// 	helper: 'clone',
		// 	opacity:0.5,
		// 	start: function(e,t) {drag++},
		// 	drag: function(e, t) {
		// 		t.helper.width(300); 
		// 	},
		// 	stop: function() {
		// 		reSlide();
		// 		drag--;
		// 		htmlRec(0,'showFeeBox');
		// 		sizeInit();
				
		// 	}
			
		// });
		
	
		//tab楼层删除tablidiv
	
		$(demo).on('click','.deltb',function(e){
			e.stopPropagation(); 
			var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
			$( "#" + panelId ).remove();
			$(this).parents(".tabslc").tabs().tabs("refresh" );
		});
		 
	
		var $lcThis,
			$lctcThis,//添加弹窗元素 
			$edittcThis,//编辑this 
			tabLCTemplate = '<li class="swiper-slide kdli"> <a href="#{href}">#{label}</a> <div class="tabslc_tool_container"><img src="images/gbs.png" alt="" class="opimg deltb"> <img src="images/bj.png" alt="" class="opimg edittb"><img src="images/left-icon.png" alt="" class="opimg lefttb"><img src="images/right-icon.png" alt="" class="opimg righttb"> </div></li>',
			tabsCounter;//tabsCounter 当前tabs数量获取- 点击添加或者编辑的时候赋值个数

				//tab楼层增加lidiv 
		$(demo).on('click','.addtb',function(e){//添加和删除后需要初始化id 
			e.stopPropagation();
			//点击增加弹出对话框，调用addTab的方法
			tabsCounter = $(this).parents(".tabslc").find(".kdli").length;//获取tabs的个数
			$lcThis = $(this);
			$('.coMmodals').show();//展示蒙版
			$('.tabBTModals').fadeIn(200, function() {
				var layer=$('.tabBtdiv',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100);
				$lctcThis = $(this);
				//每次添加的时候将弹窗中的图片src清空
	
			}); 
			
		}); 
	
		/**
		 * 添加tab方法
		 */	
		function addTabs(){
			tabsCounter++;
			var wx = $lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".wxpic").find(".imgPerview").attr("src");
			var xz = $lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".xzpic").find(".imgPerview").attr("src");
		 
			if(!wx){
    			alert("请先上传未选中上传图片")
    			return  false; 
    		}
    		if(!xz){
    			alert("请先上传选中上传图片")
    			return  false; 
    		}
			var xzc = '<img src="'+wx+'" alt="" class="lcwx ndis"/> <img src="'+xz+'" alt="" class="lcxz disb"/>';
			var id = "tabslc-" + (tabsCounter+1),//个数待优化
			//替换图片
			li = $( tabLCTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, xzc ) ); 
			$lcThis.parents(".ui-tabs-nav").children("li:last").before( li );

			/* ******** 20211222addqsf start ******* */
			var imgtb1 = $(li).find("a").children(".lcwx");//获取当前未选中img
			var imgtb2 = $(li).find("a").children(".lcxz");//获取当前选中img 
			compImg(imgtb1,"1");//计算未选中高度2021add12222qsf
			compImg(imgtb2);//计算选中图片高度2021add12222qsf
			/* ******** 20211222addqsf end ******* */

			$lcThis.parents(".tabslc").append("<div  class='smtb bydiv' id='" + id + "'><div class='col'></div></div>");
			$lcThis.parents(".tabslc").tabs().tabs("refresh" );  

			 /**装修tab页标题优化 开始**/
			 var tabNum = $(".demo .swiper-tabHd").find(".tab_ul").attr("tabNum");
			 var tabNumTupian = 3;
			 if(tabNum){
				 tabNumTupian = tabNum;
			 }
			 $("#tabtupian option[value='"+tabNumTupian+"']").attr("selected",true);
				//初始化菜单滑动
				//添加事件执行的唯一样式
				var swipertabHd = new Swiper('.swiper-tabHd', { 
					slidesPerView: 'auto',
					spaceBetween: 10,
					slidesPerView : tabNumTupian,
					paginationClickable : false,  
					freeMode : false,  
					loop : false  
				});
				$('.swiper-tabHd .swiper-slide').click(function() { //点击滑动的地方 
					var ix = parseInt($(this).index());
					// console.log($(this).index());
					if(ix > 2) {
						swipertabHd.slideTo(ix - 1, 300, false); //切换到第一个slide，速度为1秒 
					}
				});
			 
			// //resizeInit($('.row',demo));
			var cols=$('.col',demo);//添加后忘记这里是干啥的了。
				cols.sortable({
					opacity:0.5,
					connectWith: '.demo',
					handle:'.drag',
					start: function(e,t) {
						console.log("bbb"+sort);
						(sort===0) && (sort++)},
					stop: function(e,t) {
						sort--;
						if(!drag){
							reSlide(t.item.eq(0),1);
							htmlRec(); 
						};
						
					}
				});
				qhli();
				 
			 return true;
		}
	
	
		//保存
		$('.saveTAbs').click(function(e){//添加和删除后需要初始化id -
			e.stopPropagation(); 
			var f = addTabs();//20211222 update
			if(f){//通过才能关闭 20211222 update
				closeC('.tabBTModals');
			}
		}); 
	
		//tab编辑lidiv 修改edittb saveTAbs1 parent(".kdli")该问parents(".kdli")
		var editThis;
		$(demo).on('click','.edittb',function(e){
			e.stopPropagation();
			e.preventDefault(); 
			editThis = $(this);
			$('.coMmodals').show();//展示蒙版
			$('.tabBTModals1').fadeIn(200, function() {
				var layer=$('.tabBtdiv1',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100);
				$edittcThis = $(this);
				var ewxpic = editThis.parents(".kdli").find("a").children(".lcwx").attr("src");
				
				var exzpic = editThis.parents(".kdli").find("a").children(".lcxz").attr("src");
				 
				 $(this).children(".tabBtdiv1").children(".ewxzdiv").children(".ewxpic").find(".imgPerview").attr("src",ewxpic);
			 
				 $(this).children(".tabBtdiv1").children(".ewxzdiv").children(".exzpic").find(".imgPerview").attr("src",exzpic);
			});  
		}); 
		
		//修改新增的保存方法 
		$(".saveTAbs1").click(function(e){//保存单个tab编辑框
			e.stopPropagation();
			
			var ewxpic = $edittcThis.children(".tabBtdiv1").children(".ewxzdiv").children(".ewxpic").find(".imgPerview").attr("src");
			 
			var exzpic = $edittcThis.children(".tabBtdiv1").children(".ewxzdiv").children(".exzpic").find(".imgPerview").attr("src");
			 editThis.parents(".kdli").find("a").children(".lcwx").attr("src",ewxpic);//2021add12222qsf
			 editThis.parents(".kdli").find("a").children(".lcxz").attr("src",exzpic);//2021add12222qsf
			var imgtb1 = editThis.parents(".kdli").find("a").children(".lcwx");
			compImg(imgtb1,"1");//计算未选中高度2021add12222qsf
			var imgtb2 = editThis.parents(".kdli").find("a").children(".lcxz");
			compImg(imgtb2);//计算选中图片高度2021add12222qsf
		 
			closeC('.tabBTModals1'); 
		}); 

		/**
		 * 2021add12222qsf
		 * 计算图片回显高度给li标签高度赋值
		 * */	
		function compImg(imgtb,lihei){
			var realHeight;//真实的高度
		 $("<img/>").attr("src", imgtb.attr("src")).load(function() {
			  realHeight = this.height;
			  realwh = this.width;
			  var tabNum = $("#tabtupian").val();
			  
			  var h = 375/tabNum * realHeight / realwh;//实际屏幕宽度按照375计算 页面遍历时候可换算成rem
			  console.log("zuizhongde="+h,$(imgtb)); 
			  
			  if(lihei){//计算一次li高度就可以了
				$(imgtb).parents("ul").find("li").children(".kda").children("img").css("height","100%");
				$(imgtb).parents("ul").find("li").css("height",h+"xh")
			  }
			  

		  });
		}
	   

	
		
		//tab楼层编辑lidiv
		var tbt;
		$(demo).on('click','.editLc',function(e){
			e.stopPropagation();
			e.preventDefault();  
			tbt = $(this);
			$('.coMmodals').show();//展示蒙版
			$('.tabModals').fadeIn(200, function() {
				var layer=$('.tablcDiv',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100);
			}); 
		});
	
		//保存方法修改li标签高度
		$(".saveTablc").click(function(e){ 
			e.stopPropagation(); 
			var c = $("#btlbj").val(); 
			var tabNum = $("#tabtupian").val(); //获取下拉选的值
			tbt.parent().parent(".tbbigFloor").find(".tab_ul").css("background-color",c);
			tbt.parent().parent(".tbbigFloor").find(".tab_ul").attr("tabNum",tabNum); //自定义tab楼层滑动菜单的值
			var tiptxt = iftabnum(tabNum);//不同提示语回显
			$("#tbts_id1").text(tiptxt);
			$("#tbts_id2").text(tiptxt);
			tablc(tabNum);//初始化swiper 测试环境已有
			closeC('.tabModals'); 
		});

		var tpz1 = "注：建议图片大小375*任意高度px";//2个tab数量
		var tpz2 = "注：建议图片大小250*任意高度px";//2.5 3个tab数量
		var tpz3 = "注：建议图片大小187*任意高度px";//3.5 4个tab图片
		var tpz4 = "注：建议图片大小150*任意高度px";//4.5 5个tab数量
		var tpz5 = "注：建议图片大小125*任意高度px";//5.5 个tab数量

		function iftabnum(tabNum){
			var tiptxt = "注：建议图片大小375*任意高度px";
			if(tabNum == 2){
				tiptxt = tpz1;
			}else if(tabNum == 2.5 || tabNum == 3){
				tiptxt = tpz2;
			}else if(tabNum == 3.5 || tabNum == 4 ){
				tiptxt = tpz3;
			}else if(tabNum == 4.5 || tabNum == 5){
				tiptxt = tpz4;
			}else if(tabNum == 5.5 || tabNum == 6){
				tiptxt = tpz5;
			}
			return tiptxt;
		};
		 
		 
		/**
		 * 2021add 为了和测试环境保持同步滑块初始化
		 * @param {*} tabNum 
		 */
		function tablc(tabNum){
			var swipertabHd = new Swiper('.swiper-tabHd', { 
				slidesPerView: 'auto',
				spaceBetween: 10,
				slidesPerView : tabNum,
				paginationClickable : false,  
				freeMode : false,  
				loop : false  
			});
		}
		
	  
		//会员等级楼层编辑方法
		var hyLc;
		$(demo).on('click','.edithyLc',function(e){
			e.stopPropagation();
			e.preventDefault();  
			hyLc = $(this);
			
			$('.coMmodals').show();//展示蒙版
			$('.hyModals').fadeIn(200, function() {
				var layer=$('.hylcDiv',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100);
	
				var z = hyLc.parents(".hydjFloor").find(".hylcin").val();
			 
				if(''==z|| z==null){
					$("#hyra1").prop("checked",true);
					return;
				}
				$("input[name='hyra']").each(function(i,u){ 
					if(z==$(u).val()){
					
						$(u).prop("checked",true);
						// console.log(u);
					}else {
						$(u).prop('checked', false);
						// console.log(u);
					} 
				}); 
			}); 
		});
	
		  
		$(".saveTabhy").click(function(e){//会员楼层保存
			e.stopPropagation(); 
			hyLc.parents(".hydjFloor").find(".hylcin").val($("input[name='hyra']:checked").val());
			closeC('.hyModals'); 
		}); 

		//2021 add wubin 楼层左移
		$('.demo').on('click','.lefttb',function(){
			var current = $(this).parents('.kdli'); //获取当前<tr>
			var prev = current.prev();  //获取当前>前一个元素

			var divcur = $('.demo .tabslc .bydiv').eq(current.index());
			var divprev = divcur.prev();//获取当前div的前一个

			if (current.index() > 0) {
				current.insertBefore(prev); //插入到当前前一个元素前
				divcur.insertBefore(divprev);//插入到当前前一个元素前
				// console.log(current.index(),divcur.index());
				$('.demo .tabslc .bydiv').css("display","none");
				$('.demo .tabslc .bydiv').eq(current.index()).css("display","block");
			}else{
				alert('不能左移了')
			}
		})
		//2021 add wubin tab楼层右移
		$('.demo').on('click','.righttb',function(){
			var current = $(this).parents('.kdli'); //获取当前
			var next = current.next('.kdli'); //获取当前后面一个元素

			var divcur = $('.demo .tabslc .bydiv').eq(current.index());
			var divprev = divcur.prev();
			if (next.length>0) { 
			current.insertAfter(next);  //插入到当前后面一个元素后面
			divcur.insertAfter(divprev);
			//   console.log(current.index(),divcur.index());
			$('.demo .tabslc .bydiv').css("display","none");
			$('.demo .tabslc .bydiv').eq(current.index()).css("display","block");
			}else{
			alert('不能右移了')
			} 
		})
	
		//iop点击关闭弹窗隐藏
		function iopFadeOut(){
			$('.modals_cspz1').fadeOut(100, function() {
				$(this).find('.cspzedit-layeriop').hide();
			});
		};
	
		function iopjhFadeOut(){
			$('.modals_cspzjhy').fadeOut(100, function() {
				$(this).find('.cspzedit-layerjh').hide();
			});
		};
		
		// 
		function iopjhFadeOut1(){
			$('.modals_xzvideo').fadeOut(100, function() {
				$(this).find('.cspzedit-layersp').hide();
			});
		};
		function selectionPolicy(){
			$('.modals_selection_policy').fadeOut(100, function() {
				$(this).find('.cspzedit-layersp').hide();
			});
		};

		function checkboxFun(){
			var checkboxValue ="";
			var checkLength = $("input:checkbox[name='policyVaule']:checked").length;
            if(checkLength == 0) {
                alert("请至少选择一条！");
                return;
            }
            $("input[type='checkbox']").each(function(){ //遍历checkbox的选择状态
                if($(this).prop("checked")){ //如果值为checked表明选中了
                    // alert($(this).closest('tr').find('td').eq(1).text()); //获取eq为1的那一列数据
					var node = `
					<tr class="bsadtr scTdss">
								<td ><input value='1' readonly/></td>
								<td><input style="outline: none;border:none;" readonly placeholder="策略名称" class="strategyName"  value="${$(this).closest('tr').find('td').eq(2).text()}"></td>
								<td class="nutsdd">
								<a style="color:blue;text-decoration: none;padding-right: 5px;" href="javascript:;" class="moveUp">上移</a>
								<a style="color:blue;text-decoration: none;padding-right: 5px;" href="javascript:;" class="moveDown">下移</a>
								<a style="color:red;text-decoration: none;" href="javascript:;" class="dels"'>删除</a>
									</td>
							</tr>
					`;
				
	
					checkboxValue +=node;
                }
            });
  
			$("#listRpc").html(checkboxValue);
			var tableLine = document.getElementById("listRpc");
			   for (var i = 0; i < tableLine.rows.length; i++) {
	             if(i>=0){
	               tableLine.rows[i].cells[0].innerHTML = (i+1);
					if(tableLine.rows[i].cells[0].innerHTML==1){
					$(".scTdss").eq(i).find(".moveUp").addClass('xsyc').siblings().removeClass('xsyc')

						}else if(tableLine.rows[i].cells[0].innerHTML == tableLine.rows.length){
						$(".scTdss").eq(i).find(".moveDown").addClass('xsyc').siblings().removeClass('xsyc')

						}else{
						$(".scTdss").eq(i).find(".moveUp").removeClass('xsyc')
						$(".scTdss").eq(i).find(".moveDown").removeClass('xsyc')
						}

	             }
				}
		};
		//  
		
		//按钮组件相关
		function fadeOut(){
			$('.modals,.modals2,.modalAddMenu').fadeOut(100, function() {
				$(this).find('.edit-layer,.edit-layer2,.edit-layer3').hide();
			});
		};
		$('.tabs').tinyTab();//待学习
		
		demo
		.on('click','.remove',function(e) {//删除楼层栏等
			e.preventDefault();
			$(this).parent().parent().remove();
			htmlRec(true);
			idNames.push($(this).parent().next().children().attr('id'));
			$('.leftlableYa').hide()
		})
		
		.on('click','.edit',function(e) {//同时绑定edit click事件
			 
			 selectLi(0);
			 thisClickObj = $(this).parent().parent(),
			 that=$(this);
			   a = that.parent().next();//view
			e.preventDefault();
			var p=$(this).parent().parent(),
				type=p.data('type'),
				idName=$(this).parent().next().children().addClass('editing').attr('id');
			if(type=="iopAdvertisement"){ //底部按钮非公共保存的判断
				$('.newIopBtnYa').removeClass('none').next().addClass('none')
			}else{
				$('.newIopBtnYa').addClass('none').next().removeClass('none')
			}
			$('.modals').fadeIn(200, function() {
				var layer=$('.edit-layer',this);
                layer.find('.selectLi').find('li').each(function (i,v) {if(i==0){$(v).html('默认')}if(i==1){$(v).html('HTML')}});//将标题改为默认值
				console.log('我進來了，啊')
				var layer=$('.edit-layer',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100);
				// $('.edit-layer').prepend(a);
				console.log(type,"type")
				$('.newIopBtnYa').hide()
				$('.newIopBtnYa+.submitted').show()
				if(type=="iopAdvertisement"){ //底部按钮非公共保存的判断
					$('.newIopBtnYa').show()
					$('.newIopBtnYa+.submitted').hide()
				}
				if(type=="head"){//标题
					$('.selectP').hide(); 
					$('#htmlCon').show();
					var editHtmlTitleSrc = p.find('.ln-title-box img').eq(0).prop('src'),
						editHtmlTitleHref = p.find('.ln-title-box a').eq(0).prop('href'),
						editHtmlTitle = "<tr><th>图片：</th><td><div class='selectImg'><p class='title_url'>"+editHtmlTitleSrc+"</p><input type='file' value='11' class='file'><button type='button' class='spanUpload'>上传</button></div><p class='yulanImg'><img src='"+editHtmlTitleSrc+"' alt=''/></p></td></tr><tr><th>设置“更多”：</th><td><p class='selectType'><select name='' id=''><option value='data1'>国信大数据</option><option value='data2'>流量</option><option value='data3'>热销</option><option value='data4'>校园</option><option value='zdyOption'>自定义</option></select></p><p class='zdyInput'><input type='text' placeholder='请输入自定义的链接地址' class='link_href'></p></td></tr>";
					$('#htmlCon table').html('').prepend(editHtmlTitle);
				}else if(type=="image"){//静态广告位
					$('.selectP').hide();
					$('#htmlCon').show();
					var imgNum = p.find('.myview .goodsImage img').length+1;
					var editHtmlImg = "";
					for(var i= 1 ;i<imgNum;i++){
						var editPicImgSrc = p.find('.myview .goodsImage img').eq(i-1).prop('src'),
							editPicImgHref = p.find('.myview .goodsImage a').eq(i-1).prop('href'),
							editifshow = p.find('.myview .goodsImage .ifsad').eq(i-1).val(),//是否展示音频
							editzysj = p.find('.myview .goodsImage .zysj').eq(i-1).val(),//左上角右上角
							editHtml = "<tr class='jtggwtr'><th>广告位编码：</th><td><input type='text' value='1' style='float:left;'></td></tr>"
										+"<tr class='jtggwtr'>"
										+"<th class='txt_tp'>图片：</than></th>"// 2020-11-6 修改
										+"<th class='txt_sp' style='display:none;'>视频封面图片：</th>"// 2020-11-6 新增 视频
										+"<td>"
										+"<div class='selectImg'>"
										+"<p class='title_url' style='height:20px;'>"+editPicImgSrc+"</p><input type='file' value='11' class='file'>"
										+"</div><p class='yulanImg'>"
										+"<img src='"+editPicImgSrc+"' alt=''/></p></td></tr>"
										+"<tr class='jtggwtr'><th>展示类型：</th><td><select name='' class='selectType' id='selectShowType' style='padding:10px; width:415px;'> <option value='99'>请选择</option> <option value='0'>音频</option> <option value='1'>海报</option> <option value='2'>弹层</option> <option value='3'>链接跳转</option> <option value='4'>满意度评价</option> <option value='5'>视频</option>  <option value='6'>登录</option> </select></td></tr>"// 2020-11-6 修改
										+"<tr class='jtggwtr allNeedShow showTr_1'><th>海报图片：</th><td>"
										+"<div class='selectImg'>"
										+"<p class='title_url' style='height:20px;'>"+editPicImgSrc+"</p><input type='file' value='11' class='file'>"
										+"</div><p class='yulanImg'>"
										+"<img src='"+editPicImgSrc+"' alt=''/></p></td></tr>"
										+"<tr class='jtggwtr allNeedShow showTr_2'><th>关联弹层：</th><td>"
										+"<div class='uploader'><input type='text' readonly class='audiofile filename' style='width: 335px;' name='poplink'/><div class='btnxz2'> <i>请选择</i></div><span class='redzs' style='color:#333'>弹层名称1</span></div>"
										+"</td></tr>"
										+"<tr class='jtggwtr allNeedShow showTr_2'><th>打开方式：</th><td><input class='flinput nninput' type='radio' value='1' name='openType' /><label class='jtlabel ' for='openType'>父页面</label><input class='flinput nninput' type='radio' name='openType' /><label class='jtlabel' value='2' for='openType'>新页面</label></td></tr>"
										+"<tr class='jtggwtr allNeedShow showTr_3'><th>跳转目标：</th><td><select name='' id='targetTo' style='padding:10px;width:415px;'> <option value='0'>链接</option> <option value='1'>终端列表页</option> <option value='2'>我的</option><option value='3'>应用下载</option></select></td></tr>"
										+"<tr class='jtggwtr allNeedShow showTr_3_all showTr_3_0'><th>链接配置：</th><td>"
										+"<div class='uploader'><input type='text' placeholder='可手动输入链接或选择广告/聚合页' class='audiofile filename' style='width: 275px;' name='poplink'/><div class='btnxz2' style='width:140px;'> <i>请选择广告/聚合页</i></div><span class='redzs' style='color:#333'>教师节流量包</span></div>"
										+"</td></tr>"
										+"<tr class='jtggwtr allNeedShow showTr_3_all showTr_3_0'><th>打开方式：</th><td><select name='' style='padding:10px;width:415px;'> <option value='0'>不选默认为跳转（仅对纯链接广告生效，广告不生效）</option> <option value='1'>展示</option> <option value='2'>跳转</option></select></td></tr>"
										+"<tr class='jtggwtr allNeedShow showTr_3_all showTr_3_1'><th>选择页面：</th><td><select name='' style='padding:10px; width:415px;'> <option value='0'>不选默认进详情页（仅对终端广告生效）</option> <option value='1'>详情页</option> <option value='2'>列表页</option></select></td></tr>"
										+"<tr class='jtggwtr allNeedShow showTr_3_all showTr_3_2'><th>选择页面：</th><td><select name='' style='padding:10px; width:415px;'> <option value='0'>我的订单</option> <option value='1'>我的收藏</option> <option value='2'>我的店铺</option></select></td></tr>"
										+"<tr class='jtggwtr allNeedShow showTr_3_all showTr_3_3'><th>选择页面：</th><td><select name='' style='padding:10px;  width:415px;'> <option value='0'>test1</option> <option value='1'>test2</option> <option value='2'>test3</option></select></td></tr>"
										+"<tr class='jtggwtr allNeedShow showTr_4'><th>选择模板：</th><td>"
										+"<div class='uploader'><input type='text' readonly class='audiofile filename' style='width: 335px;' name='degree'/><div class='btnxz2'> <i>请选择</i></div><span class='redzs' style='color:#333'>评价模板1</span></div>"
										+"</td></tr>"
										+"<tr class='jtggwtr allNeedShow showTr_0'><th>音频文件：</th><td>"
										+"<div class='uploader'><input type='text' readonly class='audiofile filename' style='width: 335px;' name='audiof' id='xzwjl'/><div class='btnxz'> <i>选择文件</i><input type='file' /></div><span class='redzs'>注：格式为MP3且大小不超过5M</span></div>"
										+"<div class='audio_div' ><audio controls class='media' type='audio/mpeg' src=''></audio></div>"
										+"</td></tr>"
										// 2020-11-6 新增 视频 开始
										+"<tr class='jtggwtr allNeedShow showTr_5'><th>视频文件：</th><td>"
										+"<div class='uploader' style='position:relative;'><input type='text' readonly class='audiofile filename' style='width: 415px;' name='audiof'/><div class='btnxzsp' style=' width: 415px; position:absolute; top:-6px; left:0; opacity: 0;'><input type='file' accept='video/mp4' style=' width:95%;' onclick='spshowad(this)'/></div><span class='redzs xzvideo' style='color:#333'>选择视频</span></div>"
										+"<div class='video_div' ><video style='width:100%;height:auto;' accept='video/mp4' src='' controls='controls'></video></div>"
										+"</td></tr>"
										
										+"<tr class='jtggwtr allNeedShow showTr_6'><th>展示方式：</th><td><input class='flinput nninput zs_checked' type='radio' value='1' name='zsfsType' checked /><label class='jtlabel' for='zsfsType'>悬浮</label><input class='flinput nninput' type='radio' name='zsfsType' /><label class='jtlabel' value='2' for='zsfsType'>固定</label></td></tr>"
										
										editHtml+="<tr class='jtggwtr allNeedShow showTr_5'><th>是否预览视频：</th><td><p class='updateStyle'><input class='flinput nninput' type='radio' value='1' name='spzsyp' id='szssp' checked onclick='spshowad(this)'/><label class='jtlabel' for='szssp'>是</label></p></td></tr>"
										// 2020-11-6 新增 视频 结束
										
										if(editifshow =='1'){
											editHtml+="<tr class='jtggwtr allNeedShow showTr_0'><th>是否展示音频图片：</th><td><input class='flinput nninput' type='radio' value='1' name='ifzsyp' id='szsyp' checked onclick='ifshowad(this)'/><label class='jtlabel' for='szsyp'>是</label><input class='flinput nninput' type='radio' name='ifzsyp' id='fzsyp' value='0' onclick='ifshowad(this)'/><label class='jtlabel' for='fzsyp'>否</label></td></tr>"
										
										}
										
										if(editifshow =='0'){
											editHtml+="<tr class='jtggwtr allNeedShow showTr_0'><th>是否展示音频图片：</th><td><input class='flinput nninput' type='radio' value='1' name='ifzsyp' id='szsyp'  onclick='ifshowad(this)'/><label class='jtlabel' for='szsyp'>是</label><input class='flinput nninput' type='radio' name='ifzsyp' id='fzsyp' value='0' checked onclick='ifshowad(this)'/><label class='jtlabel' for='fzsyp'>否</label></td></tr>"
										
										}
										if(editzysj =='1'){
											editHtml+="<tr class='jtggwtr allNeedShow showTr_0'><th>音频图片位置：</th><td><input class='flinput nninput' type='radio' value='1' name='zysj' id='zsj' checked/><label class='jtlabel ' for='zsj'>左上角</label><input class='flinput nninput' type='radio' name='zysj' id='ysj' /><label class='jtlabel' value='2' for='ysj'>右上角</label></td></tr>"
										
										}
										if(editzysj =='2'){
											editHtml+="<tr class='jtggwtr allNeedShow showTr_0'><th>音频图片位置：</th><td><input class='flinput nninput' type='radio' value='1' name='zysj' id='zsj' /><label class='jtlabel ' for='zsj'>左上角</label><input class='flinput nninput' type='radio' name='zysj' id='ysj' checked/><label class='jtlabel' value='2' for='ysj'>右上角</label></td></tr>"
										
										}
																			
							 editHtmlImg += editHtml;
					}
					$('#htmlCon table').html('').append(editHtmlImg);
					//$('.showTr_0').show();   // 2020-11-6 修改
					// 0729
					$('.modal').on('change','#selectShowType',function(e){
						e.preventDefault();
						var checkText=$(this).find("option:selected").val();
						console.log(checkText)
						
						$('.allNeedShow').hide();
						// 2020-11-6 新增 视频 开始
						$('.txt_sp').hide()
						$('.txt_tp').show()
						// 2020-11-6 新增 视频 结束
						$('.showTr_'+checkText).show();
						if(checkText==3){
							$('.showTr_3_0').show()
						}
						
						// 2020-11-6 新增 视频 开始
						if(checkText==5){
							$('.txt_sp').show()
							$('.txt_tp').hide()
						}
						// 2020-11-6 新增 视频 结束
					})
					
					
					
					
					//静态广告 - 选择视频 2020-11-6 新增 开始
					$(".play_btn").click(function(){
						$(this).parents(".goodsImage").children(".play_btn").hide();
						$(this).parents(".goodsImage").children(".play_btn").siblings(".img_demo").hide();
						$(this).parents(".goodsImage").children(".play_btn").siblings(".back_btn").show();
						$(this).parents(".goodsImage").children(".play_btn").siblings(".video_btn").show();
					});
					
					$(".back_btn").click(function(){
						$(this).parents(".goodsImage").children(".back_btn").hide();
						$(this).parents(".goodsImage").children(".back_btn").siblings(".img_demo").show();
						$(this).parents(".goodsImage").children(".back_btn").siblings(".play_btn").show();
						$(this).parents(".goodsImage").children(".back_btn").siblings(".video_btn").hide();
					});
					
					$(document).on('click','.xzvideo',function(e) {//选择视频 
						$('.modals_xzvideo').fadeIn(200, function() {//展示参数配置弹层
							var layer=$('.cspzedit-layer',this);
							layer.css({
								'margin-top':-(layer.height())/2,
								'margin-left':-(layer.width())/2
							}).fadeIn(100);//弹窗位置设置
						});
					});
					
					$(document).ready(function () {
						$('.updateStyle input').click(function () {
							var val = $('input:radio[name="spzsyp"]:checked').val();
							if (val == '1') {
								$('.video_div').show();
							} else {
								$('.video_div').hide();
							}
						})
					});
					//静态广告 - 选择视频 2020-11-6 新增 结束
					
					//
					$('.modal').on('change','#targetTo',function(e){
						e.preventDefault();
						var checkText=$(this).find("option:selected").val();
						console.log(checkText)
						
						$('.showTr_3_all').hide();
						$('.showTr_3_'+checkText).show();
					})			
				}else if(type=="gallery"){//滚动菜单
					$('.selectP').hide();
					$('#htmlCon').show();
					var imgNum = p.find('.myview .swiper-slide img').length+1;
					var editHtmlImg = "<tbody>"; // 2020-11-9 修改 开始
					for(var i= 1 ;i<imgNum;i++){
						var editPicImgSrc = p.find('.myview .swiper-slide img').eq(i-1).prop('src'),
							editPicImgHref = p.find('.myview .swiper-slide a').eq(i-1).prop('href');
						
						var editText = p.find('.myview .swiper-slide p').eq(i-1).text(),
							//editPicImgHref = p.find('.navbottom-box li a').eq(i-1).prop('href'),
							editHtml = "<tr>"
							+"<th class='border'><img src='images/delete.png' class='deleteTr'/>菜单</th>"
							+"<td class='border' style='position:relative;'>"
							+"<dl class='tableDl'><dt>菜单名称：</dt>"
							+"<dd><div class='selectType'><div class='divBox selector1p'><p>"+editText+"</p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1'>热销</option><option value='data2'>流量</option><option value='data3'>数字化</option><option value='data4'>校园</option><option value='data5'>应用下载</option><option value='data6'>终端</option><option value='zdyOption'>自定义</option></select></div></div><p class='zdyInput fl'><input type='text' class='menuName' placeholder='请输入菜单名称'></p></dd></dl>"
							+"<dl class='tableDl jumpType'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+i+"' value='lj'>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='gg'>广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='jhy'>聚合页</label></p><p id='ljInput'><input type='text' class='ml10 menuUrl' placeholder='请输入链接地址'></p><p  id='ggInput'><input type='text' class='ml10 menuUrl' placeholder='请选择广告' style='width:415px;'><button type='button' class='fl' style='margin-top:5px;margin-left:10px;'>选择</button></p><p id='jhyInput'><select name='' id=''><option value=''>请选择</option><option value=''>聚合页1</option><option value=''>聚合页2</option></select></p></dd></dl>"
							+"<dl class='tableDl'><dt>菜单图片：</dt>"
							+"<dd><div class='selectImg'><p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file'><button type='button' class='spanUpload'>上传</button></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p><p class='tsy'>建议尺寸95*95</p></dd></dl>"
							+"<div style=' position:absolute; top:5px; right:7px;' ><p class='ydicon'><image src='images/sm_01.png' width='16' onclick='tablezdCk(this)'></p><p class='ydicon'><image src='images/sm_02.png' width='16' onclick='tableUpModule(this)'></p><p class='ydicon'><image src='images/sm_03.png' width='16' onclick='tableDownModule(this)'></p><p class='ydicon'><image src='images/sm_05.png' width='16' onclick='tableendCk(this)'></p></div>"
							+"</td></tr>";
							editHtmlImg += editHtml;
					}
					var trAddMenu = '<tfoot><tr class="trAddMenu"><td class="border" colspan="2" align="center"><button type="button">增加菜单</button></td></tr></tfoot>';
					$('#htmlCon table').html('').append(editHtmlImg+trAddMenu);
					$('.trAddMenu button').click(function(){
						var i=$(this).parents('tfoot').find('tbody').children("tr").length;
						var editHtmladd = "<tr>"
							+"<th class='border'><img src='images/delete.png' class='deleteTr'/>菜单</th>"
							+"<td class='border' style='position:relative;'>"
							+"<dl class='tableDl'><dt>菜单名称：</dt>"
							+"<dd><div class='selectType'><div class='divBox selector1p'><p>"+editText+"</p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1'>热销</option><option value='data2'>流量</option><option value='data3'>数字化</option><option value='data4'>校园</option><option value='data5'>应用下载</option><option value='data6'>终端</option><option value='zdyOption'>自定义</option></select></div></div><p class='zdyInput fl'><input type='text' class='menuName' placeholder='请输入菜单名称'></p></dd></dl>"
							+"<dl class='tableDl jumpType'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+i+"' value='lj'>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='gg'>广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='jhy'>聚合页</label></p><p id='ljInput'><input type='text' class='ml10 menuUrl' placeholder='请输入链接地址'></p><p  id='ggInput'><input type='text' class='ml10 menuUrl' placeholder='请选择广告' style='width:415px;'><button type='button' class='fl' style='margin-top:5px;margin-left:10px;'>选择</button></p><p id='jhyInput'><select name='' id=''><option value=''>请选择</option><option value=''>聚合页1</option><option value=''>聚合页2</option></select></p></dd></dl>"
							+"<dl class='tableDl'><dt>菜单图片：</dt>"
							+"<dd><div class='selectImg'><p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file'><button type='button' class='spanUpload'>上传</button></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p><p class='tsy'>建议尺寸95*95</p></dd></dl>"
							+"<div style=' position:absolute; top:5px; right:7px;' ><p class='ydicon'><image src='images/sm_01.png' width='16' onclick='tablezdCk(this)'></p><p class='ydicon'><image src='images/sm_02.png' width='16' onclick='tableUpModule(this)'></p><p class='ydicon'><image src='images/sm_03.png' width='16' onclick='tableDownModule(this)'></p><p class='ydicon'><image src='images/sm_05.png' width='16' onclick='tableendCk(this)'></p></div>"
							+"</td></tr>";
						$('#htmlCon table tbody tr').after(editHtmladd); // 2020-11-9 修改 结束
						var slideHtml = '<div class="swiper-slide"><a href="#" class="bind" bind="swiper_id110_href"><img src="images/newindeximg/rrico_6.png" alt="" class="bind" bind="swiper_id110_src"><p>终端</p></a></div>';
						$('.demo .swiper-lnbusiness .swiper-wrapper').append(slideHtml);
					});
					$('.modal').on('click','.deleteTr',function(e){	
						var trIndex = $(this).parents('tr').index(); 
						$(this).parents('table').find('tr').eq(trIndex).remove();
						$('.demo .swiper-lnbusiness .swiper-slide').eq(trIndex).remove();
					})
				}else if(type=="bottomNav"){//底部菜单
					$('.selectP').hide();
					$('#htmlCon').show();
					var imgNum = p.find('.navbottom-box li').length+1;
					var editHtmlImg = "";
					var addTbody = '<tr class="addBtn"><td colspan="2" align="right"><button type="submit" name="submit" class="submitted" style="margin-bottom:10px;">新增</button></td></tr>';
					for(var i= 1 ;i<imgNum;i++){
						var editText = p.find('.navbottom-box li a').eq(i-1).text(),
							//editPicImgHref = p.find('.navbottom-box li a').eq(i-1).prop('href'),
							// 暂时屏蔽掉自定义
							// editHtml = "<tr><th class='border'>菜单"+i+"</th><td class='border'><div class='selectType'><i>菜单名称：</i><div class='divBox selector1p'><p>"+editText+"</p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1'>首页</option><option value='data2'>终端</option><option value='data3'>附近的店</option><option value='data4'>我的</option><option value='zdyOption'>自定义</option></select></div></div><p class='zdyInput'><input type='text' class='menuName' placeholder='请输入菜单名称'><input type='text' class='ml10 menuUrl' placeholder='请输入链接地址'></p></td></tr>";
							editHtml = "<tr><td class='border'><div class='selectType'><i>菜单名称：</i><div class='divBox selector1p'><p>"+editText+"</p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1' bindClass='sy'>首页</option><option value='data2' bindClass='zd'>分类</option><option value='data3' bindClass='fjdd'>附近的店</option><option value='data4' bindClass='wd'>我的</option><option value='data5' bindClass='shop'>商城</option><option value='data6' bindClass='collect'>收藏</option><option value='data7' bindClass='wtfk'>问题反馈</option></select></div></div><p class='zdyInput'><input type='text' class='menuName' placeholder='请输入菜单名称'><input type='text' class='ml10 menuUrl' placeholder='请输入链接地址'></p>"
								+"<div class='dbtjdz' ><i class='ni'>跳转地址：</i><div class=' '><div class='ljcd'><input type='radio' name='whyjp"+i+"' id='hylj"+i+"' checked onclick='hyjpqhNm(this,&apos;jpmlx"+i+"&apos;)' class='nninput'/><label for='hylj"+i+"' class=' '>链接</label>"
							 
								+" 		<input type='radio' name='whyjp"+i+"' id='hyjhy"+i+"'  onclick='hyjpqhNm(this,&apos;jhyjpmlx"+i+"&apos;)' class='nninput'/><label for='hyjhy"+i+"' class=' '>聚合页</label> </div>"
								+" 		<div class='hyqhdiv pbdiv disb jpmlx"+i+"'><input type='text' placeholder='请输入链接地址' value=''/></div>"
								 
								+" 		<div class='hyqhdiv pbdiv ndis jhyjpmlx"+i+"'><input type='text' placeholder='请选择聚合页广告' value=''/><button style='width: 50px;' class='hyxzjh'>选择</button></div>"	
								+"</div></div></td><td class='border' align='center'><button type='submit' name='submit' class='submitted deleteNav'>删除</button>"
								+"</td></tr>";
							editHtmlImg += editHtml;
							
					}
						
					$('.modals #htmlCon table').html('').append(addTbody+editHtmlImg); 
					for(var i=0;i<$('.selector1p').length;i++){
						
						var curText = $('.selector1p').eq(i).find('p').text(); 
						switch(curText)
							{
								case '首页':
								$('.selector1p').eq(i).find('.bottomSelect').find("option[value='data1']").prop("selected",true);
								break;
								case '分类':
								$('.selector1p').eq(i).find('.bottomSelect').find("option[value='data2']").prop("selected",true);
								break;
								case '附近的店':
								$('.selector1p').eq(i).find('.bottomSelect').find("option[value='data3']").prop("selected",true);
								break;
								case '我的':
								$('.selector1p').eq(i).find('.bottomSelect').find("option[value='data4']").prop("selected",true);
								break;
								case '商城':
								$('.selector1p').eq(i).find('.bottomSelect').find("option[value='data5']").prop("selected",true);
								break;
								case '收藏':
								$('.selector1p').eq(i).find('.bottomSelect').find("option[value='data6']").prop("selected",true);
								break;
								case '问题反馈':
								$('.selector1p').eq(i).find('.bottomSelect').find("option[value='data7']").prop("selected",true);
								break;
							}
							
					}
					
					
				}else if(type=="zhuancj"){//20230203转盘抽奖活动组件
					$('.selectP').hide();
					$('#htmlCon').show();
					var editPicImgSrc = p.find('.cjview img.testimg').prop('src');
					var str = ['	<tbody class="zpcjEditBox">',
					'		<tr>',
					'			<td>',
					'				<div class="bold mt15">活动设置</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>活动编号：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<select class="myinput" style="display:block;" onchange="queryActiveInfo(this);">',
					'							<option value="">请选择活动编号</option>',
					'							<option value="lncjzp">lncjzp</option>',
					'						</select>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>活动标题：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="下单抽好礼" placeholder="请输入活动标题" id="activeTitle" maxlength="16">',
					'						<p class="tishiTxt">最大长度不超过16个字</p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s mt15">',
					'					<div class="w10">活动背景图：</div>',
					'					<div class="flex1">',
					'						<div class="selectImg">',
					'							<button class="uploadBtn">浏览</button>',
					'							<input type="file" value="" class="file myinput">',
					'						</div>',
					'						<div class="shownamebox j_name">',
					'							<p class="name"></p>',
					'							<p class="del j_del">删除</p>',
					'						</div>',
					'						<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>抽奖按钮图：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<div class="selectImg">',
					'							<button class="uploadBtn">浏览</button>',
					'							<input type="file" value="" class="file myinput">',
					'						</div>',
					'						<div class="shownamebox j_name">',
					'							<p class="name"></p>',
					'							<p class="del j_del">删除</p>',
					'						</div>',
					'						<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="bold mt15">活动说明设置</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>活动说明按钮图：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<div class="selectImg">',
					'							<button class="uploadBtn">浏览</button>',
					'							<input type="file" value="" class="file myinput">',
					'						</div>',
					'						<div class="shownamebox j_name">',
					'							<p class="name"></p>',
					'							<p class="del j_del">删除</p>',
					'						</div>',
					'						<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s mt15">',
					'					<div class="w10">活动说明弹窗背景图：</div>',
					'					<div class="flex1">',
					'						<div class="selectImg">',
					'							<button class="uploadBtn">浏览</button>',
					'							<input type="file" value="" class="file myinput">',
					'						</div>',
					'						<div class="shownamebox j_name">',
					'							<p class="name"></p>',
					'							<p class="del j_del">删除</p>',
					'						</div>',
					'						<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>活动说明标题：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="活动规则" placeholder="请输入活动标题" maxlength="10">',
					'						<p class="tishiTxt">最大长度不超过10个字</p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>活动说明内容：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<textarea id="descriptiona" class="mytextarea" maxlength="1000" name="descriptiona"></textarea>',
					'						<p class="tishiTxt">最大长度不超过1000个字</p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'	</tbody>',
					].join("");
					$('.modals #htmlCon table').html('').append(str); 

					//九宫格
					(function () {
						var ito, speed, total, step, stopnum;
						var btn_start = $('.start_btn'),
							turnplate = $('.turnplate'),
							is_running = false,
							max_loop = 1, // 循环总圈数
							i = 0, // 奖品默认开始索引
							all_awards = 8; // 奖品总数
						stopnum = 9//设置奖品为空
						btn_start.click(function () {
							console.log('开始抽奖')
							setTimeout(function () { stopnum = 0; max_loop = 10 }, 8000)
							if (is_running) {
								return false;
							} else {
								stopping = false;
								// 初始化设置
								step = 0; // 记录已跑的格数
								speed = 140; // 初始速度
								is_running = true;
								//total = parseInt(all_awards*Math.random()) + max_loop * all_awards; // 总共格数加上一个随机数
								turnplate.removeClass('retplate').addClass('runplate');
								turnplate.find('li').removeClass("run");
								$(".i" + i).addClass('run');
								btn_start.addClass('disabled');
								ito = setTimeout(rolling, 300);
							};
							function rolling() {
								if (speed > 300 && i == stopnum) {
									// 停止
									i = parseInt(Math.random() * 8);
									clearTimeout(ito);
									is_running = false;
									turnplate.removeClass('runplate').addClass('retplate');
									total = parseInt(all_awards * Math.random()) + max_loop * all_awards; // 总共格数加上一个随机数
									//$(".i"+3).addClass('ret');
									btn_start.removeClass('disabled');
									console.log('奖品为：第' + (i + 1) + '个！');
									setTimeout(function () {
										$(".turnplate").hide();
										$(".resultDiv").show();
									}, 500);
									return false;
								}
								i++;
								step++;
								console.log("旋转中的" + i);
								if (i >= all_awards) i = 0;
								if (step < all_awards * 2) speed -= 5; // 第二圈加速*/
								if (step > all_awards * max_loop - 2) speed += 15; // 三圈之内不减速
								if (speed <= 10) speed = 10; // 中间稳住
								turnplate.find('li').removeClass("run");
								$(".i" + i).addClass('run');
								ito = setTimeout(rolling, speed);
							};
						});
					})();
		
					$(".btn_lq").click(function () {
						toastTip('恭喜您，奖品已领取成功！')
					})

					//图片上传
					$('.modal').on("change",".file",function(e){
						$(this).parent(".selectImg").siblings(".j_name").find(".name").text(getImageUrl(this.files[0]));
						$(this).parent(".selectImg").siblings(".j_name").show();
						$(this).parents('.selectImg').siblings('.yulanImg').find('img').prop('src',getImageUrl(this.files[0]));
						$(this).parents('.selectImg').siblings('.yulanImg').show();
					});
					//删除图片
					$(".j_del").click(function(){
						$(this).siblings(".name").text("");
						$(this).parent(".j_name").hide();
						$(this).parent('.j_name').siblings('.yulanImg').find('img').prop('src','');
						$(this).parent('.j_name').siblings('.yulanImg').hide();
						$(this).parent('.j_name').siblings('.selectImg').find('.file').val('');
					})

					var editor;
					KindEditor.ready(function (K) {
						editor = K.create('textarea[name="descriptiona"]', {
							resizeType: 1,
							allowPreviewEmoticons: false,
							allowImageUpload: false, //上传图片框本地上传的功能，false为隐藏，默认为true
							allowImageRemote: false, //上传图片框网络图片的功能，false为隐藏，默认为true
							allowFileManager: false, //浏览图片空间
							filterMode: false, //HTML特殊代码过滤
							width: "100%",
							height: "200px",
							// readonlyMode : true,
							items: [
								'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor',
								'bold', 'italic', 'underline',
								'removeformat', '|', 'justifyleft', 'justifycenter',
								'justifyright', 'insertorderedlist',
								'insertunorderedlist'
							]
						});
					});
				}else if(type=="userMsgInfo"){//20230508卖家信息组件
					$('.selectP').hide();
					$('#htmlCon').show();
					var str = ['<table width="100%">',
					'	<tbody class="zpcjEditBox">',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c">',
					'					<div class="w10">广告位编码：</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="" placeholder="请输入广告位编码">',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s mt15">',
					'					<div class="w10">背景图片：</div>',
					'					<div class="flex1">',
					'						<div class="selectImg">',
					'							<button class="uploadBtn">浏览</button>',
					'							<input type="file" value="" class="file myinput">',
					'						</div>',
					'						<div class="shownamebox j_name" style="display: block;">',
					'							<p class="name">背景图.png</p>',
					'							<p class="del j_del">删除</p>',
					'						</div>',
					'						<p class="yulanImg" style="display: block;"><img src="images/headPon/6.png" alt=""></p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>默认头像：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<div class="selectImg">',
					'							<button class="uploadBtn">浏览</button>',
					'							<input type="file" value="" class="file myinput">',
					'						</div>',
					'						<div class="shownamebox j_name">',
					'							<p class="name"></p>',
					'							<p class="del j_del">删除</p>',
					'						</div>',
					'						<p class="yulanImg"><img class="sm" src="" alt=""></p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">操作1广告位编码：</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="" placeholder="请输入广告位编码">',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>图标1：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<div class="selectImg">',
					'							<button class="uploadBtn">浏览</button>',
					'							<input type="file" value="" class="file myinput">',
					'						</div>',
					'						<div class="shownamebox j_name" style="display: block;">',
					'							<p class="name">加企微图标.png</p>',
					'							<p class="del j_del">删除</p>',
					'						</div>',
					'						<p class="yulanImg" style="display: block;"><img class="sm" src="images/headPon/5.png" alt=""></p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>操作1文案：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="加企微" placeholder="" maxlength="4">',
					'						<p class="tishiTxt">最多可输入4个字符</p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>操作1执行：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<select class="myinput" style="display:block;">',
					'							<option value="弹出企业微信弹窗" selected>弹出企业微信弹窗</option>',
					'							<option value="拨打系统电话">拨打系统电话</option>',
					'							<option value="弹出页面二维码">弹出页面二维码</option>',
					'							<option value="页面分享">页面分享</option>',
					'						</select>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">操作2广告位编码：</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="" placeholder="请输入广告位编码">',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>图标2：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<div class="selectImg">',
					'							<button class="uploadBtn">浏览</button>',
					'							<input type="file" value="" class="file myinput">',
					'						</div>',
					'						<div class="shownamebox j_name" style="display: block;">',
					'							<p class="name">打电话图标.png</p>',
					'							<p class="del j_del">删除</p>',
					'						</div>',
					'						<p class="yulanImg" style="display: block;"><img class="sm" src="images/headPon/2.png" alt=""></p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>操作2文案：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="打电话" placeholder="" maxlength="4">',
					'						<p class="tishiTxt">最多可输入4个字符</p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>操作2执行：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<select class="myinput" style="display:block;">',
					'							<option value="弹出企业微信弹窗">弹出企业微信弹窗</option>',
					'							<option value="拨打系统电话" selected>拨打系统电话</option>',
					'							<option value="弹出页面二维码">弹出页面二维码</option>',
					'							<option value="页面分享">页面分享</option>',
					'						</select>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">操作3广告位编码：</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="" placeholder="请输入广告位编码">',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>图标3：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<div class="selectImg">',
					'							<button class="uploadBtn">浏览</button>',
					'							<input type="file" value="" class="file myinput">',
					'						</div>',
					'						<div class="shownamebox j_name" style="display: block;">',
					'							<p class="name">卖家码图标.png</p>',
					'							<p class="del j_del">删除</p>',
					'						</div>',
					'						<p class="yulanImg" style="display: block;"><img class="sm" src="images/headPon/3.png" alt=""></p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>操作3文案：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="卖家码" placeholder="" maxlength="4">',
					'						<p class="tishiTxt">最多可输入4个字符</p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>操作3执行：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<select class="myinput" style="display:block;">',
					'							<option value="弹出企业微信弹窗">弹出企业微信弹窗</option>',
					'							<option value="拨打系统电话">拨打系统电话</option>',
					'							<option value="弹出页面二维码" selected>弹出页面二维码</option>',
					'							<option value="页面分享">页面分享</option>',
					'						</select>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">操作4广告位编码：</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="" placeholder="请输入广告位编码">',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-s mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>图标4：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<div class="selectImg">',
					'							<button class="uploadBtn">浏览</button>',
					'							<input type="file" value="" class="file myinput">',
					'						</div>',
					'						<div class="shownamebox j_name" style="display: block;">',
					'							<p class="name">分享图片.png</p>',
					'							<p class="del j_del">删除</p>',
					'						</div>',
					'						<p class="yulanImg" style="display: block;"><img class="sm" src="images/headPon/4.png" alt=""></p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>操作4文案：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<input type="text" class="myinput" value="去分享" placeholder="" maxlength="4">',
					'						<p class="tishiTxt">最多可输入4个字符</p>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'		<tr>',
					'			<td>',
					'				<div class="flexbox align-c mt15">',
					'					<div class="w10">',
					'						<p class="cred">*</p>',
					'						<p>操作4执行：</p>',
					'					</div>',
					'					<div class="flex1">',
					'						<select class="myinput" style="display:block;">',
					'							<option value="弹出企业微信弹窗">弹出企业微信弹窗</option>',
					'							<option value="拨打系统电话">拨打系统电话</option>',
					'							<option value="弹出页面二维码">弹出页面二维码</option>',
					'							<option value="页面分享" selected>页面分享</option>',
					'						</select>',
					'					</div>',
					'				</div>',
					'			</td>',
					'		</tr>',
					'	</tbody>'].join("");
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(str); 

					//图片上传
					$('.modal').on("change",".file",function(e){
						$(this).parent(".selectImg").siblings(".j_name").find(".name").text(getImageUrl(this.files[0]));
						$(this).parent(".selectImg").siblings(".j_name").show();
						$(this).parents('.selectImg').siblings('.yulanImg').find('img').prop('src',getImageUrl(this.files[0]));
						$(this).parents('.selectImg').siblings('.yulanImg').show();
					});
					//删除图片
					$(".j_del").click(function(){
						$(this).siblings(".name").text("");
						$(this).parent(".j_name").hide();
						$(this).parent('.j_name').siblings('.yulanImg').find('img').prop('src','');
						$(this).parent('.j_name').siblings('.yulanImg').hide();
						$(this).parent('.j_name').siblings('.selectImg').find('.file').val('');
					})

				}else if(type=="personalCard"){//20230605自然人名片组件
					var $this = $(e.target).parent(".ctrl-btns").siblings(".contanierShareTopYa")
					$('.selectP').hide();
					$('#htmlCon').show();
					var editPicImgSrc = p.find('.cjview img.testimg').prop('src');
					var str = `<tbody class="zpcjEditBox">
						<tr>
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>背景图：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="selectImg">
											<button class="uploadBtn">浏览</button>
											<input type="file" value="" class="file myinput">
										</div>
										<div class="shownamebox j_name">
											<p class="name"></p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-c mt15">
									<div class="w10">头像：</div>
									<div class="flex1 flexbox align-c">
										<div class='ljcd' style="margin-left:0">
											<label><input type='radio' name='pCardA' value='1' class='nninput' checked/>显示</label>
											<label style="margin-left:5px"><input type='radio' name='pCardA' value='0' class='nninput'/>不显示</label> 
										</div>
									</div>
								</div>
							</td>
						</tr>
						<tr class="j_mrtx">
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>默认头像：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="flexbox">
											<div class="selectImg">
												<button class="uploadBtn">浏览</button>
												<input type="file" value="" class="file myinput">
											</div>
											<p class="tishiTxt" style="margin-left:5px">建议上传图片尺寸：40*40，大小不超过100K</p>
										</div>
										<div class="shownamebox j_name">
											<p class="name"></p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-c mt15">
									<div class="w10">二维码：</div>
									<div class="flex1 flexbox align-c">
										<div class='ljcd' style="margin-left:0">
											<label><input type='radio' name='pCardC' value='1' class='nninput' checked/>显示</label>
											<label style="margin-left:5px"><input type='radio' name='pCardC' value='0' class='nninput'/>不显示</label> 
										</div>
									</div>
								</div>
							</td>
						</tr>
						<tr class="j_ewm">
							<td>
								<div class="flexbox align-c mt15">
									<div class="w10">二维码提示文案：</div>
									<div class="flex1">
										<input type="text" class="myinput" value="" placeholder="面对面分享" id="activeTitle" maxlength="16">
									</div>
								</div>
							</td>
						</tr>
						<tr class="j_ewm">
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>二维码图标：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="flexbox">
											<div class="selectImg">
												<button class="uploadBtn">浏览</button>
												<input type="file" value="" class="file myinput">
											</div>
											<p class="tishiTxt" style="margin-left:5px">建议上传图片尺寸：40*40，大小不超过100K</p>
										</div>
										<div class="shownamebox j_name">
											<p class="name"></p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
					</tbody>`;
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(str); 

					//图片上传
					$('.modal').on("change",".file",function(e){
						$(this).parents(".uploadImgBox").find(".name").text(getImageUrl(this.files[0]));
						$(this).parents(".uploadImgBox").find(".j_name").show();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src',getImageUrl(this.files[0]));
						$(this).parents('.uploadImgBox').find('.yulanImg').show();
					});
					//删除图片
					$(".j_del").click(function(){
						$(this).siblings(".name").text("");
						$(this).parent(".j_name").hide();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src','');
						$(this).parents('.uploadImgBox').find('.yulanImg').hide();
						$(this).parents('.uploadImgBox').find('.selectImg .file').val('');
					})
					//切换显示头像
					$("input[name=pCardA]").change(function(e){
						var val = e.target.value
						if(val==1){
							$(".j_mrtx").show()
							$this.find(".leftShareUserMsg img").show()
						}else{
							$(".j_mrtx").hide()
							$this.find(".leftShareUserMsg img").hide()
						}
					})
					//切换显示二维码
					$("input[name=pCardC]").change(function(e){
						var val = e.target.value
						if(val==1){
							$(".j_ewm").show()
							$this.find(".rightShareImg").show()
						}else{
							$(".j_ewm").hide()
							$this.find(".rightShareImg").hide()
						}
					})

				}else if(type=="sellerInfo"){//20230719卖家信息新
					var $this = $(e.target).parent(".ctrl-btns").siblings(".contanierShareTopYa")
					console.log($this)
					$('.selectP').hide();
					$('#htmlCon').show();
					var str = `
					<tbody class="zpcjEditBox sellerInfoCss" id="resetCss">
						<tr>
							<td>
								<div class="flexbox mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>背景图：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="flexbox">
											<div class="selectImg">
												<button class="uploadBtn">浏览</button>
												<input type="file" value="" class="file myinput">
											</div>
											<p class="tishiTxt ml5">建议上传图片尺寸750*1450</p>
										</div>
										<div class="shownamebox j_name">
											<p class="name"></p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>卖家信息：</p>
									</div>
									<div class="flex1">
										<div class='ljcd' style="margin-left:0">
											<label class="flexbox align-c"><input type='checkbox' name='checkInfo' value='1' class='nninput' checked/>头像</label>
											<label class="flexbox align-c ml5"><input type='checkbox' name='checkInfo' value='2' class='nninput' checked disabled/>卖家昵称</label> 
											<label class="flexbox align-c ml5"><input type='checkbox' name='checkInfo' value='3' class='nninput' checked/>职位</label> 
											<label class="flexbox align-c ml5"><input type='checkbox' name='checkInfo' value='3' class='nninput' checked/>工号</label> 
											<label class="flexbox align-c ml5"><input type='checkbox' name='checkInfo' value='3' class='nninput' checked/>组织名称</label> 
											<label class="flexbox align-c ml5"><input type='checkbox' name='checkInfo' value='3' class='nninput' checked/>积分</label> 
										</div>
										<p class="tishiTxt">选中后显示，未选中则不显示</p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>默认头像：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="flexbox">
											<div class="selectImg">
												<button class="uploadBtn">浏览</button>
												<input type="file" value="" class="file myinput">
											</div>
											<p class="tishiTxt ml5">建议上传图片尺寸80*80</p>
										</div>
										<div class="shownamebox j_name">
											<p class="name"></p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-c mt15">
									<div class="w10">
										<p>积分广告位编码：</p>
									</div>
									<div class="flex1">
										<input type="text" class="myinput" value="" placeholder="请输入广告位编码">
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-c mt15">
									<div class="w10">
										<p>操作项：</p>
									</div>
									<div class="flex1 flexbox align-c">
										<div class="addbtn j_addbtn">
											<img class="icon" src="./images/cpn_add.png" alt="">
											<span class="txt">添加操作项</span>
										</div>
									</div>
								</div>
							</td>
						</tr>
					</tbody>`;
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(str); 


					//图片上传
					$('.modal').on("change",".file",function(e){
						$(this).parents(".uploadImgBox").find(".j_name").find(".name").text(getImageUrl(this.files[0]));
						$(this).parents(".uploadImgBox").find(".j_name").show();
						$(this).parents('.uploadImgBox').find('.yulanImg').find('img').prop('src',getImageUrl(this.files[0]));
						$(this).parents('.uploadImgBox').find('.yulanImg').show();
					});
					//删除图片
					$(".j_del").click(function(){
						$(this).siblings(".name").text("");
						$(this).parent(".j_name").hide();
						$(this).parents('.uploadImgBox').find('.yulanImg').find('img').prop('src','');
						$(this).parents('.uploadImgBox').find('.yulanImg').hide();
						$(this).parents('.uploadImgBox').find('.selectImg').find('.file').val('');
					})
					//重置序号
					function sort(){
						$(".j_optionFlag").each(function(index,item){
							$(this).find(".j_optionSort").text(index+1)
						})
					}
					$(document).on("click",".j_addbtn",function(){
						var datastr = new Date().getTime()
						var str = `
						<tr class="j_optionFlag">
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p>操作项<span class="j_optionSort"></span>：</p>
									</div>
									<div class="flex1 flexbox align-s">
										<div class="bgbox">
											<div class="flexbox align-c">
												<div class="w10">
													<p>广告位编码：</p>
												</div>
												<div class="flex1">
													<input type="text" class="myinput" value="" placeholder="请输入广告位编码">
												</div>
											</div>
											<div class="flexbox align-s mt15">
												<div class="w10">
													<p class="cred">*</p>
													<p>图标：</p>
												</div>
												<div class="flex1 uploadImgBox">
													<div class="flexbox">
														<div class="selectImg">
															<button class="uploadBtn">浏览</button>
															<input type="file" value="" class="file myinput">
														</div>
														<p class="tishiTxt ml5">建议上传图片尺寸64*64</p>
													</div>
													<div class="shownamebox j_name">
														<p class="name"></p>
														<p class="del j_del">删除</p>
													</div>
													<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>
												</div>
											</div>
											<div class="flexbox mt15">
												<div class="w10">
													<p class="cred">*</p>
													<p>文案：</p>
												</div>
												<div class="flex1">
													<input type="text" class="myinput" value="" placeholder="请输入文案" maxlength="4">
													<p class="tishiTxt">最多可输入4个字符</p>
												</div>
											</div>
											<div class="flexbox align-c">
												<div class="w10">
													<p class="cred">*</p>
													<p>执行：</p>
												</div>
												<div class="flex1">
													<select class="myinput j_selectLink" style="display:block;">
														<option value="弹出企业微信弹窗">弹出企业微信弹窗</option>
														<option value="跳转链接">跳转链接</option>
													</select>
												</div>
											</div>
											<div class="flexbox mt15 j_hideLink" style="display:none;">
												<div class="w10">
													<p class="cred">*</p>
													<p>链接：</p>
												</div>
												<div class="flex1">
													<input type="text" class="myinput" value="" placeholder="请输入链接地址">
												</div>
											</div>
											<div class="flexbox align-c mt15">
												<div class="w10">
													<p>位置：</p>
												</div>
												<div class="flex1 flexbox align-c">
													<div class='ljcd' style="margin-left:0">
														<label class="flexbox align-c"><input type='radio' name='position${datastr}' value='0' class='nninput' onchange="sellerInfoNewRadio(this)" checked/><span>底部</span></label>
														<label class="flexbox align-c ml5"><input type='radio' name='position${datastr}' value='1' class='nninput' onchange="sellerInfoNewRadio(this)"/>右上角</label> 
													</div>
												</div>
											</div>
										</div>
										<div class="delbtn j_delbtn">
											<img class="icon" src="./images/cpn_minus.png" alt="">
											<span class="txt">删除</span>
										</div>
									</div>
								</div>
							</td>
						</tr>`
						$(this).parents("tr").before(str);
						sort();
					})
					$(document).on("change",".j_selectLink",function(){
						if($(this).val()=="跳转链接"){
							$(this).parents(".flexbox").siblings(".j_hideLink").show()
						}else{
							$(this).parents(".flexbox").siblings(".j_hideLink").hide()
						}
					})
					$(document).on("click",".j_delbtn",function(){
						$(this).parents("tr").remove();
						sort()
					})
					$(document).on("change",".j_posR",function(e){
						console.log(e.target.value,"eeeeeeeeeeeeeee")
						console.log($(this),"this")
						if(e.target.value == "1"){
							var len = $(".j_posRadio").find(".nninput[value='1']:checked").length;
							console.log(len,$(".j_posRadio").find(".nninput[value='1']:checked"),"当前已选的数量")
							if(len>0){
								if(confirm("取消之前的，用这个？")){
									$(".j_posRadio").each(function(index,item){
										$(this).find(".nninput[value='1']").prop("checked",false)
										$(this).find(".nninput[value='0']").prop("checked",true)
									})
									$(this).find(".nninput[value='1']").prop("checked",true)
								}else{
	
								}
							}
						}
					})
					function sellerInfoNewRadio(obj){
						if(obj.value == '1' && obj.checked){
							var len = $(".nninput[value='1']:checked").length;
							if(len>1){
								if(confirm("仅支持配置一个右上角位置，是否替换位置")){
								}else {
									obj.checked=false;
									$(obj).parents("label").siblings().find("input[type='radio'][value='0']").prop("checked",true);
									return false;
								}
							}
						}
						$(obj).parents("tr").siblings().find("input[type='radio'][value='0']").prop("checked",true);
					}

				}else if(type=="shareAdvertiseCom"){//20230816分享广告
					var $this = $(e.target).parent(".ctrl-btns").siblings(".floatBlockYa")
					console.log($this)
					$('.selectP').hide();
					$('#htmlCon').show();
					var editPicImgSrc = p.find('.cjview img.testimg').prop('src');

					function getImgUrl(className) {
						var msgBk = p.find("."+className+" ").css("background-image");//元素编码
						var reg = new RegExp('"','g');
						msgBk = msgBk == undefined||msgBk == "none"?'':msgBk.split("(")[1].split(")")[0].replace(reg,'');
						console.log(msgBk,'msgBk')
						return msgBk
					}
					var str = `<tbody class="zpcjEditBox">
						<tr>
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>背景图：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="selectImg">
											<button class="uploadBtn">浏览</button>
											<input type="file" value="" class="file myinput">
										</div>
										<div class="shownamebox shareBackCom j_name" style="display: block;">
											<p class="name">${getImgUrl('saBackBlock')}</p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg" style="display:block"><img class="bgimg1" src="${getImgUrl('saBackBlock')}" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-c mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>广告：</p>
									</div>
									<div class="flex1 flexbox align-c">
										<input type="text" class="myinput" readonly value="" placeholder="请选择广告" id="activeTitle" maxlength="16">
										<div class="popChooseBtnYa">选择</div>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>广告视频封面图：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="selectImg upTipFlagYa">
											<div>
												<button class="uploadBtn">浏览</button><span class="uploadImgTag">建议上传图片尺寸：174*248px，大小不超过100K</span>
											</div>
											<input type="file" value="" class="file myinput">
										</div>
										<div class="shownamebox j_name" style="display: block;">
											<p class="name">${getImgUrl('saLeftImg')}</p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg" style="display:block"><img class="bgimg1" src="${getImgUrl('saLeftImg')}" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>广告详情图：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="selectImg upTipFlagYa">
											<div>
												<button class="uploadBtn">浏览</button><span class="uploadImgTag">建议上传图片尺寸：444*(高度自适应)px，大小不超过100K</span>
											</div>
											<input type="file" value="" class="file myinput">
										</div>
										<div class="shownamebox adDetailImgYa j_name" style="display: block;">
											<p class="name"></p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg" style="display:block"><img class="bgimg1" src="" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>广告分享按钮图：</p>
									</div>
									<div class="flex1 uploadImgBox">
									<div class="selectImg upTipFlagYa">
										<div>
											<button class="uploadBtn">浏览</button><span class="uploadImgTag">建议上传图片尺寸：(宽度自适应)*60px，大小不超过100K</span>
										</div>
											<input type="file" value="" class="file myinput">
										</div>
										<div class="shownamebox adShareBtnYa j_name" style="display: block;">
											<p class="name">广告分享按钮图.png</p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg" style="display:block"><img class="bgimg1" src="" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>广告自购按钮图：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="selectImg upTipFlagYa">
											<div>
												<button class="uploadBtn">浏览</button><span class="uploadImgTag">建议上传图片尺寸：(宽度自适应)*60px，大小不超过100K</span>
											</div>
											<input type="file" value="" class="file myinput">
										</div>
										<div class="shownamebox adSelfBtnYa j_name" style="display: block;">
											<p class="name">广告自购按钮图.png</p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg" style="display:block"><img class="bgimg1" src="" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
					</tbody>`;
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(str); 

					// 回填默认数据
					$('.adShareBtnYa p.name').html($('.shareImgLeftYa').attr("src"))
					$('.adSelfBtnYa p.name').html($('.shareImgRightYa').attr("src"))
					$('.adDetailImgYa p.name').html($('.saTopImg img').attr("src"))
					
					$('.adShareBtnYa+.yulanImg img').attr("src",$('.shareImgLeftYa').attr("src"))
					$('.adSelfBtnYa+.yulanImg img').attr("src",$('.shareImgRightYa').attr("src"))
					$('.adDetailImgYa+.yulanImg img').attr("src",$('.saTopImg img').attr("src"))
					//图片上传
					$('.modal').on("change",".file",function(e){
						$(this).parents(".uploadImgBox").find(".name").text(getImageUrl(this.files[0]));
						$(this).parents(".uploadImgBox").find(".j_name").show();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src',getImageUrl(this.files[0]));
						$(this).parents('.uploadImgBox').find('.yulanImg').show();
					});
					//删除图片
					$(".j_del").click(function(){
						$(this).siblings(".name").text("");
						$(this).parent(".j_name").hide();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src','');
						$(this).parents('.uploadImgBox').find('.yulanImg').hide();
						$(this).parents('.uploadImgBox').find('.selectImg .file').val('');
					})

				}else if(type=="iopAdvertisement"){//20230911-IOP广告
					var $this = $(e.target).parent(".ctrl-btns").siblings(".floatBlockYa")
					console.log($this)
					$('.selectP').hide();
					$('#htmlCon').show();
					var editPicImgSrc = p.find('.cjview img.testimg').prop('src');

					var str = `<tbody class="zpcjEditBox">
							<tr>
								<td>
									<div class="flexbox align-s mt15">
										<div class="w10">
											<p class="cred">*</p>
											<p>背景图：</p>
										</div>
										<div class="flex1 uploadImgBox">
											<div class="flexbox">
												<div class="selectImg">
													<button class="uploadBtn">浏览</button>
													<input type="file" value="" class="file myinput">
												</div>
												<p class="tishiTxt ml5">建议上传图片尺寸750*390px</p>
											</div>
											<div class="shownamebox j_name" style="display: block;">
												<p class="name iopBackImgName1"></p>
												<p class="del j_del">删除</p>
											</div>
											<p class="yulanImg" style="display: block;"><img class="bgimg1 iopBackImgName2" src="" alt=""></p>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">是否显示iop查询：</div>
										<div class="flex1 flexbox align-c">
											<div class='ljcd' style="margin-left:0">
												<label><input type='radio' name='iopFlagYa' value='1' class='nninput' checked/>是</label>
												<label style="margin-left:5px"><input type='radio' name='iopFlagYa' value='0' class='nninput'/>否</label> 
											</div>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">输入框背景颜色：</div>
										<div class="flex1 flexbox align-c">
											<input type="color" class="backColorInputIopYa" value="#FFFFFF" oninput="$('#backColorIopYa').val(this.value)">
											<input type="text" id="backColorIopYa" value="#FFFFFF" readonly>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">输入框边线颜色：</div>
										<div class="flex1 flexbox align-c">
											<input type="color" class="borderColorInputIopYa" value="#518BFF" oninput="$('#borderColorIopYa').val(this.value)">
											<input type="text" id="borderColorIopYa" value="#518BFF" readonly>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="flexbox align-s mt15">
										<div class="w10">
											<p class="cred">*</p>
											<p>查询按钮图：</p>
										</div>
										<div class="flex1 uploadImgBox">
											<div class="flexbox">
												<div class="selectImg">
													<button class="uploadBtn">浏览</button>
													<input type="file" value="" class="file myinput">
												</div>
												<p class="tishiTxt ml5">建议上传图片尺寸132*60px</p>
											</div>
											<div class="shownamebox j_name" style="display: block;">
												<p class="name iopSearchBtnImgName1"></p>
												<p class="del j_del">删除</p>
											</div>
											<p class="yulanImg" style="display:block"><img class="bgimg1 iopSearchBtnImgName2" src="" alt=""></p>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="iopSearchTablePart">
										<span>搜索</span>
										<div>
											<span>广告位编码：</span>
											<input type="text" id="adCodeIopYa">
										</div>
										<div>
											<span>策划编码：</span>
											<input type="text" id="chCodeIopYa">
										</div>
									</div>
									<table id="tableByIdYa">
										<thead>
											<tr>
												<th style="width:10px"><input type="checkbox" name="iopSearchCheckAll" id="iopSearchCheckAll"></th>
												<th style="width:10px">序号</th>
												<th style="width:200px">策略配置</th>
												<th style="width:10px">操作</th>
											</tr>
										</thead>
										<tbody id="tableTbodyByIdYa">
											<tr>
												<td><input type="checkbox" name="iopSearchCheckThis"></td>
												<td>1</td>
												<td>
													<div class="flexbox mt15 j_hideLink">
														<div class="w10">
															<p>广告位编码：</p>
														</div>
														<div>
															<input type="text" class="myinput ggwbmYa" value="" placeholder="请输入广告位编码">
														</div>
													</div>
													<div class="flexbox mt15 j_hideLink">
														<div class="w10">
															<p class="cred">*</p>
															<p>策划编码：</p>
														</div>
														<div>
															<input type="text" class="myinput chbmYa" value="" placeholder="请输入策划编码">
														</div>
													</div>
													<div class="flexbox align-s mt15">
														<div class="w10">
															<p class="cred">*</p>
															<p>图片：</p>
														</div>
														<div class="flex1 uploadImgBox">
															<div class="flexbox">
																<div class="selectImg">
																	<button class="uploadBtn">浏览</button>
																	<input type="file" value="" class="file myinput">
																</div>
															</div>
															<div class="textLeftYa colorRedYa">注:建议上传199*221像素，大小不超过100k，格式为jpg，png的图片</div>
															<div class="shownamebox j_name textLeftYa">
																<p class="name"></p>
																<p class="del j_del">删除</p>
															</div>
															<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>
														</div>
													</div>
													<div class="flexbox mt15 j_hideLink">
														<div class="w10">
															<p class="cred">*</p>
															<p>跳转地址：</p>
														</div>
														<div>
															<input type="text" class="myinput" value="" placeholder="请输入跳转地址或选择跳转跳转广告/聚合页">
														</div>
													</div>
													<div class="flexbox mt15 j_hideLink">
														<div class="w10">
															<p>展示权重：</p>
														</div>
														<div>
															<input type="number" class="myinput" value="" placeholder="请输入1-100，权重值至越大排序越靠前">
														</div>
													</div>
													<div class="flexbox mt15 j_hideLink">
														<div class="w10">
															<p>有效时间：</p>
														</div>
														<div class="inputWidthYa">
															<input id='startTime1' name='startTime1' readonly='readonly' class='Wdate w150'  onclick="WdatePicker({maxDate:'#F{$dp.$D(\'endTime1\')}',dateFmt:'yyyy-MM-dd'})" value='' />
															 ~ 
															<input id='endTime1' name='endTime1' readonly='readonly' class='Wdate w150' onClick="WdatePicker({minDate:'#F{$dp.$D(\'startTime1\')}',dateFmt:'yyyy-MM-dd'})" value='' />
														</div>
													</div>
												</td>
												<td>保存</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>`
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(str); 
					function getImgUrl(className) { //获取图片背景图片地址
						var msgBk = p.find("."+className+" ").css("background-image");//元素编码
						var reg = new RegExp('"','g');
						msgBk = msgBk == undefined||msgBk == "none"?'':msgBk.split("(")[1].split(")")[0].replace(reg,'');
						console.log(msgBk,'msgBk')
						return msgBk
					}
					function xh() { //序号
						var tableLine = document.getElementById("tableByIdYa");
						for (var i = 0; i < tableLine.rows.length; i++) {
							if(i>0){
								tableLine.rows[i].cells[1].innerHTML = (i);
							}
						}
					}
					$('.iopBackImgName1').html(getImgUrl('iopAdvertisementYa'))
					$('.iopBackImgName2').attr("src",getImgUrl('iopAdvertisementYa'))
					$('.iopSearchBtnImgName1').html($('.iopAdSearBtn').attr("src"))
					$('.iopSearchBtnImgName2').attr("src",$('.iopAdSearBtn').attr("src"))
					$('#iopSearchCheckAll').change(function(){ //全选
						if($(this).prop("checked")){// 处理选中状态
							$('input[name=iopSearchCheckThis]').prop('checked', true);
						}else{// 处理未选中状态
							$('input[name=iopSearchCheckThis]').prop('checked', false);
						}
					});
					$('.modal').on("change",".file",function(e){
						$(this).parents(".uploadImgBox").find(".name").text(getImageUrl(this.files[0]));
						$(this).parents(".uploadImgBox").find(".j_name").show();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src',getImageUrl(this.files[0]));
						$(this).parents('.uploadImgBox').find('.yulanImg').show();
					});
					//删除图片
					$(".j_del").click(function(){
						$(this).siblings(".name").text("");
						$(this).parent(".j_name").hide();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src','');
						$(this).parents('.uploadImgBox').find('.yulanImg').hide();
						$(this).parents('.uploadImgBox').find('.selectImg .file').val('');
					})
					$(document).off('change',"input[name=iopSearchCheckThis]").on('change','input[name=iopSearchCheckThis]',function(){ //反选
						if($(this).prop("checked")){// 处理选中状态
							var numIop = 0
							$('input[name=iopSearchCheckThis]').each(function() {
								if($(this).prop("checked")){
									numIop++
								}
							})
							console.log(numIop,$('input[name=iopSearchCheckThis]').length)
							if(numIop == $('input[name=iopSearchCheckThis]').length){
								$('#iopSearchCheckAll').prop('checked', true);
							}
						}else{
							$('#iopSearchCheckAll').prop('checked', false);
						}
					});
					$(document).off('click',".iopDeleteYa").on('click','.iopDeleteYa',function() { //删除
						$('input[name=iopSearchCheckThis]').each(function() {
							if($(this).prop("checked")){
								$(this).parent().parent().remove()
							}
						})
						$('#iopSearchCheckAll').prop('checked', false);
						xh()
					})
					$(document).off('click',".newIopBtnYa .iopAddYa").on('click','.newIopBtnYa .iopAddYa',function() { //添加
						console.log('触发')
						if($('#tableTbodyByIdYa tr').length == 21){
							alert('最多21条')
							return
						}
						var randomYa = new Date().getTime()
						var sTimeYa = "startTime"+randomYa
						var eTimeYa = "endTime"+randomYa+1
						var checkFlagYa = ''
						if($('#iopSearchCheckAll').prop("checked")){// 处理选中状态
							checkFlagYa = 'checked'
						}
						var trs = `<tr>
								<td><input type="checkbox" name="iopSearchCheckThis" ${checkFlagYa}></td>
								<td></td>
								<td>
									<div class="flexbox mt15 j_hideLink">
										<div class="w10">
											<p>广告位编码：</p>
										</div>
										<div>
											<input type="text" class="myinput" value="" placeholder="请输入广告位编码">
										</div>
									</div>
									<div class="flexbox mt15 j_hideLink">
										<div class="w10">
											<p class="cred">*</p>
											<p>策划编码：</p>
										</div>
										<div>
											<input type="text" class="myinput" value="" placeholder="请输入策划编码">
										</div>
									</div>
									<div class="flexbox align-s mt15">
										<div class="w10">
											<p class="cred">*</p>
											<p>图片：</p>
										</div>
										<div class="flex1 uploadImgBox">
											<div class="flexbox">
												<div class="selectImg">
													<button class="uploadBtn">浏览</button>
													<input type="file" value="" class="file myinput">
												</div>
											</div>
											<div class="textLeftYa colorRedYa">注:建议上传199*221像素，大小不超过100k，格式为jpg，png的图片</div>
											<div class="shownamebox j_name textLeftYa">
												<p class="name"></p>
												<p class="del j_del">删除</p>
											</div>
											<p class="yulanImg"><img class="bgimg1" src="" alt=""></p>
										</div>
									</div>
									<div class="flexbox mt15 j_hideLink">
										<div class="w10">
											<p class="cred">*</p>
											<p>跳转地址：</p>
										</div>
										<div>
											<input type="text" class="myinput" value="" placeholder="请输入跳转地址或选择跳转跳转广告/聚合页">
										</div>
									</div>
									<div class="flexbox mt15 j_hideLink">
										<div class="w10">
											<p>展示权重：</p>
										</div>
										<div>
											<input type="number" class="myinput" value="" placeholder="请输入1-100，权重值至越大排序越靠前">
										</div>
									</div>
									<div class="flexbox mt15 j_hideLink">
										<div class="w10">
											<p>有效时间：</p>
										</div>
										<div class="inputWidthYa">
											<input id='${sTimeYa}' name='${sTimeYa}' readonly='readonly' class='Wdate w150'  onclick="WdatePicker({maxDate:'#F{$dp.$D(\\\'${sTimeYa}\\\')}',dateFmt:'yyyy-MM-dd'})" value='' />
											~ 
											<input id='${eTimeYa}' name='${eTimeYa}' readonly='readonly' class='Wdate w150' onClick="WdatePicker({minDate:'#F{$dp.$D(\\\'${eTimeYa}\\\')}',dateFmt:'yyyy-MM-dd'})" value='' />
										</div>
									</div>
								</td>
								<td>保存</td>
							</tr>`
						$('#tableTbodyByIdYa').append(trs)
						xh()
					})
					$(document).off('click',".iopSearchTablePart>span").on('click','.iopSearchTablePart>span',function() {//搜索
						var adCodeIopYa = $('#adCodeIopYa').val(),chCodeIopYa = $('#chCodeIopYa').val()
						$('#tableTbodyByIdYa tr').each(function() {
							if(($(this).find('.ggwbmYa').val() != '' && $(this).find('.ggwbmYa').val().indexOf(adCodeIopYa) != -1)){
								$(this).removeClass('none')
							}else{
								$(this).addClass('none')
							}
							if($(this).find('.chbmYa').val() != '' && $(this).find('.chbmYa').val().indexOf(chCodeIopYa) != -1){
								$(this).removeClass('none')
							}else{
								$(this).addClass('none')
							}
						})
					})
					$(document).off('click',".iopSaveYa").on('click','.iopSaveYa',function() {//保存
						$('.iopAdSearch>div').css({'background':$('#backColorIopYa').val(),'border-color':$('#borderColorIopYa').val()})
						if($('input[name=iopFlagYa]:checked').val() == '0'){
							$('.iopAdSearch').hide()
						}else if($('input[name=iopFlagYa]:checked').val() == '1'){
							$('.iopAdSearch').show()
						}
						$('.iopAdSwiperBox .swiper-wrapper .swiper-slide').remove()
						$('#tableTbodyByIdYa tr').each(function(i) {
							var swiperSlide = ``
							if(i == 0 || (i)%3 == 0){
								console.log(i == 0,(i)%3 == 0,(i),(i)%3,i,'111')
								swiperSlide = `<div class="swiper-slide">
													<ul class="iopAdUl">
														<li>
															<img class="itemImg" src="./images/20230908/1.png" alt="">
														</li>
													</ul>
												</div>`
								
								
								$('.iopAdSwiperBox .swiper-wrapper').append(swiperSlide)
							}else{
								console.log(i,Math.floor((i)/3),'111')
								$(document).find('.demo .bigFloor .iopAdUl').eq(Math.floor((i)/3)).append(`<li>
								<img class="itemImg" src="./images/20230908/2.png" alt="">
							</li>`)
							}
						})
						topSwiper = null
						topSwiper = new Swiper('.iopAdSwiperBox', {
							// autoplay: 3000,//可选选项，自动滑动
							pagination : '.swiper-pagination',
							observer: true, 
							observeParents: true, //监测Swiper 的祖/父元素 
							autoplayDisableOnInteraction: false
						});
					})
				}else if(type=="newConvenient"){//20231030-新便民功能模块
					var $this = $(e.target).parent(".ctrl-btns").siblings(".floatBlockYa")
					console.log($this)
					$('.selectP').hide();
					$('#htmlCon').show();
					var editPicImgSrc = p.find('.cjview img.testimg').prop('src');
					function fillData(that) {//回填数据
						var a='',b='',c='',d='',e='',f=''
						if(that){
							a=that.find('.newConTop').find('div:nth-child(2)').html()
							b=that.find('.newConTop').find('div:nth-child(2)').attr('dataType')
							c=that.find('.newConTop').attr('dataUrl')
							d=that.find('.newConTop').attr('dataText')
							e=that.find('.newConTop').attr('dataCode')
							if(that.find('.newConTop').find('div:last-child').attr('dataType') == '2'){ //话费
								f=that.find('.newConTop').find('div:first-child span:first-child').text()
							}
						}
						return `<div class="tabTdItem">
									<div class="delImgNewCon"></div>
									<div class="flexbox j_hideLink">
										<div class="w10">
											<p class="cred">*</p>
											<p>便民模块名称：</p>
										</div>
										<div>
											<input type="text" class="myinput bmBlockName" maxlength="6" value="${a}" placeholder="请输入便民模块名称">
										</div>
									</div>
									<div class="flexbox mt15 j_hideLink">
										<div class="w10">
											<p class="cred">*</p>
											<p>便民模块信息类型：</p>
										</div>
										<div>
											<select class="myinput j_selectLink newConSelectYa" dataValue="${b}" style="display:block;">
												<option value="0">通用流量剩余</option>
												<option value="1">定向流量剩余</option>
												<option value="2">话费余额</option>
												<option value="3">积分</option>
												<option value="4">当前辽豆</option>
												<option value="5">家庭宽带</option>
												<option value="6">家庭魔百盒</option>
											</select>
										</div>
									</div>
									<div class="flexbox mt15 j_hideLink none">
										<div class="w10">
											<p class="cred">*</p>
											<p>提示充值阈值：</p>
										</div>
										<div class="unitBlockInput">
											<input type="number" class="myinput" value="${f}" placeholder="请输入提示充值阈值">
											<span>元</span>
										</div>
									</div>
									<div class="flexbox mt15 j_hideLink">
										<div class="w10">
											<p class="cred">*</p>
											<p>跳转地址：</p>
										</div>
										<div>
											<input type="text" class="myinput" maxlength="100" value="${c}" placeholder="请输入跳转地址或选择跳转跳转广告/聚合页">
										</div>
									</div>
									<div class="flexbox mt15 j_hideLink">
										<div class="w10">
											<p>点位名称：</p>
										</div>
										<div>
											<input type="text" class="myinput" maxlength="24" value="${d}" placeholder="请输入点位名称">
										</div>
									</div>
									<div class="flexbox mt15 j_hideLink">
										<div class="w10">
											<p>广告位编码：</p>
										</div>
										<div>
											<input type="text" class="myinput" maxlength="48" value="${e}" placeholder="请输入广告位编码">
										</div>
									</div>
							</div>`
					}
					function fillDataImg(that) {//回填数据图片
						var a='',b=`<div class="shownamebox j_name">
										<p class="name iopBackImgName1"></p>
										<p class="del j_del">删除</p>
									</div>
									<p class="yulanImg"><img class="bgimg1 iopBackImgName2" src="" alt=""></p>`,c='',d='',e=''
						if(that){
							a=that.children('.itemImg').attr('src')
							c=that.children('.itemImg').attr('dataUrl')
							d=that.children('.itemImg').attr('dataText')
							e=that.children('.itemImg').attr('dataCode')
							b = `<div class="shownamebox j_name" style="display:block">
									<p class="name iopBackImgName1">${that.children('.itemImg').attr('src')}</p>
									<p class="del j_del">删除</p>
								</div>
								<p class="yulanImg" style="display:block"><img class="bgimg1 iopBackImgName2" src="${that.children('.itemImg').attr('src')}" alt=""></p>`
						}
						return `<tr>
									<td></td>
									<td>
										<div class="tabTdItem">
												<div class="flexbox align-s mt15">
													<div class="w10">
														<p class="cred">*</p>
														<p>按钮图片：</p>
													</div>
													<div class="uploadImgBox flex1">
														<div class="flexbox flexCounmn">
															<div class="selectImg">
																<button class="uploadBtn">浏览</button>
																<input type="file" value="" class="file myinput">
															</div>
															<p class="tishiTxt">建议2个按钮尺寸为198*46px，超过2个尺寸为310*46px</p>
														</div>
														${b}
													</div>
														</div>
												<div class="flexbox mt15 j_hideLink">
													<div class="w10">
														<p class="cred">*</p>
														<p>跳转地址：</p>
													</div>
													<div class="flex w320">
														<input type="text" class="myinput flex1" maxlength="100" value="${c}" placeholder="请输入跳转地址或选择跳转跳转广告/聚合页">
														<button type="button">选择广告/聚合页</button>
													</div>
												</div>
												<div class="flexbox mt15 j_hideLink">
													<div class="w10">
														<p>点位名称：</p>
													</div>
													<div>
														<input type="text" class="myinput" maxlength="24" value="${d}" placeholder="请输入点位名称">
													</div>
												</div>
												<div class="flexbox mt15 j_hideLink">
													<div class="w10">
														<p>广告位编码：</p>
													</div>
													<div>
														<input type="text" class="myinput" maxlength="48" value="${e}" placeholder="请输入广告位编码">
													</div>
												</div>
										</div>
									</td>
									<td class="operateFa">
										<div class="trUpNewCon">上移</div>
										<div class="trDownNewCon">下移</div>
										<div class="trAddNewCon2">添加</div>
										<div class="trDelNewCon">删除</div>
									</td>
								</tr>`
					}
					function montageHtml(that){
						var returnHtml = '';
						if(that && that.children().hasClass('swiper-wrapper')){
							that.find('.swiper-wrapper').find('.swiper-slide').not(".swiper-slide-duplicate").each(function(){
								returnHtml += fillData($(this))
							})
						}else{
							returnHtml = fillData(that)
						}
						return returnHtml
					}
					function trHtmlOne(that){
						return `<tr>
								<td></td>
								<td>
									${montageHtml(that)}
									<button type="button" class="addNewConBtn">添加</button>
								</td>
								<td class="operateFa">
									<div class="trUpNewCon">上移</div>
									<div class="trDownNewCon">下移</div>
									<div class="trAddNewCon">添加</div>
									<div class="trDelNewCon">删除</div>
								</td>
							</tr>`
					}
					var trHtml = ``
					var trHtml2 = ``
					p.find('.newConvenTop>.swiper-wrapper>.swiper-slide').each(function(i){
						trHtml += trHtmlOne($(this))
					})
					p.find('.newConvenBottom>.swiper-wrapper>.swiper-slide').each(function(i){
						trHtml2 += fillDataImg($(this))
					})
					var str = `<tbody class="zpcjEditBox newConTable">
							<tr class="backTypeNewCon">
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">背景类型：</div>
										<div class="flex1 flexbox align-c">
											<div class='ljcd' style="margin-left:0">
												<label><input type='radio' name='newConFlagYa' value='1' class='nninput'/>纯色</label>
												<label style="margin-left:5px"><input type='radio' name='newConFlagYa' value='0' class='nninput'/>图片</label> 
											</div>
										</div>
									</div>
								</td>
							</tr>
							<tr class="backTypeNewConColor">
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">
											<p class="cred">*</p>
											<p>背景颜色：</p>
										</div>
										<div class="flex1 flexbox align-c">
											<input type="color" class="backColorInputIopYa" value="" oninput="$('#backColorNewConYa').val(this.value)">
											<input type="text" id="backColorNewConYa" value="" readonly>
										</div>
									</div>
								</td>
							</tr>
							<tr class="backTypeNewConImg none">
								<td>
									<div class="flexbox align-s mt15">
										<div class="w10">
											<p class="cred">*</p>
											<p>背景图片：</p>
										</div>
										<div class="flex1 uploadImgBox">
											<div class="flexbox">
												<div class="selectImg">
													<button class="uploadBtn">浏览</button>
													<input type="file" value="" class="file myinput">
												</div>
												<p class="tishiTxt ml5">建议卡片类型上传图片尺寸：宽度为720*196px，大小不超过100K</p>
											</div>
											<div class="shownamebox j_name newConBackImgNameYa">
												<p class="name"></p>
												<p class="del j_del">删除</p>
											</div>
											<p class="yulanImg newConBackImgFaYa"><img class="bgimg1 newConBackImgYa" src="" alt=""></p>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">
											<p class="cred">*</p>
											<p>背景两侧间距：</p>
										</div>
										<div class="flex1">
											<input type="number" class="myinput backPadding" value="${$('.demo .backBlockNc').attr('dataPadding')}" placeholder="请输入背景两侧间距"> px
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">
											<p class="cred">*</p>
											<p>背景圆角：</p>
										</div>
										<div class="flex1">
											<input type="number" class="myinput backRadius" value="${$('.demo .backBlockNc').attr('dataRadius')}" placeholder="请输入背景圆角"> px
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="flexbox mt15">
										<div class="w10">
											<p>便民模块信息配置：</p>
										</div>
										<div class="flex1">
										<table class="tabelStylePub" id="tableByIdYa2" style="margin:0">
											<thead>
												<tr>
													<th style="width:25px">序号</th>
													<th style="width:180px">便民模块信息</th>
													<th style="width:25px">操作</th>
												</tr>
											</thead>
											<tbody>
												${trHtml}
											</tbody>
										</table>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div class="flexbox mt15">
										<div class="w10">
											<p>便民模块按钮配置：</p>
										</div>
										<div class="flex1">
										<table class="tabelStylePub" id="tableByIdYa3" style="margin:0">
											<thead>
												<tr>
													<th style="width:50px">序号</th>
													<th style="width:180px">便民模块按钮</th>
													<th style="width:25px">操作</th>
												</tr>
											</thead>
											<tbody>
												${trHtml2}
											</tbody>
										</table>
										</div>
									</div>
								</td>
							</tr>
						</tbody>`
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(str); 
					// 默认选中背景类型
					$('input[name=newConFlagYa]').each(function(){
						console.log($(this).val(),$('.demo .backBlockNc').attr('dataBackType'),'asdd')
						if($(this).val() == $('.demo .backBlockNc').attr('dataBackType')){
							$(this).attr('checked','checked')
						}
					})
					if($('.demo .backBlockNc').attr('dataBackType') == '0'){
						$('.backTypeNewConImg').removeClass('none')
						$('.backTypeNewConColor').addClass('none')
						$('.newConBackImgNameYa').css({'display':'block'}).find('.name').html($('.demo .backBlockNc').attr('dataBackImg'))
						$('.newConBackImgFaYa').css({'display':'block'}).find('img').attr("src",$('.demo .backBlockNc').attr('dataBackImg'))
					}else{
						$('.backTypeNewConImg').addClass('none')
						$('.backTypeNewConColor').removeClass('none')
					}
					$('#backColorNewConYa').val($('.demo .backBlockNc').attr('dataBack'))
					$('.backColorInputIopYa').val($('.demo .backBlockNc').attr('dataBack'))
					$('.newConSelectYa').each(function(){
						$(this).find('option[value='+$(this).attr('dataValue')+']').attr("selected","selected")
						if($(this).attr('dataValue') == '2'){//话费余额
							$(this).parent().parent().next().removeClass('none')
						}else{
							$(this).parent().parent().next().addClass('none')
						}
					})
					xhNewCon()
					function getImgUrl(className) { //获取图片背景图片地址
						var msgBk = p.find("."+className+" ").css("background-image");//元素编码
						var reg = new RegExp('"','g');
						msgBk = msgBk == undefined||msgBk == "none"?'':msgBk.split("(")[1].split(")")[0].replace(reg,'');
						console.log(msgBk,'msgBk')
						return msgBk
					}
					function xhNewCon() { //序号等初始化
						var tableLine = document.getElementById("tableByIdYa2");
						var tableLine2 = document.getElementById("tableByIdYa3");
						for (var i = 0; i < tableLine.rows.length; i++) {
							if(i>0){
								tableLine.rows[i].cells[0].innerHTML = (i);
							}
						}
						for (var i = 0; i < tableLine2.rows.length; i++) {
							if(i>0){
								tableLine2.rows[i].cells[0].innerHTML = (i);
							}
						}
						// 删除图标展示
						$('#tableByIdYa2 tbody tr').each(function(){
							if($(this).find('.tabTdItem').length>1){
								$(this).find('.tabTdItem').children('.delImgNewCon').removeClass('none')
							}else{
								$(this).find('.tabTdItem').children('.delImgNewCon').addClass('none')
							}
						})
						// tr按钮展示
						$('#tableByIdYa2 tbody tr').each(function(i){
							if($('#tableByIdYa2 tbody tr').length==3 && i<=2){
								$(this).find('.trDelNewCon').addClass('none')
							}else{
								$(this).find('.trDelNewCon').removeClass('none')
							}
							if(i==0){
								$(this).find('.trUpNewCon').addClass('none')
							}else if(i==$('#tableByIdYa2 tbody tr').length-1){
								$(this).find('.trDownNewCon').addClass('none')
							}else{
								$(this).find('.trUpNewCon,.trDownNewCon').removeClass('none')
							}
						})
						// tr按钮展示按钮
						$('#tableByIdYa3 tbody tr').each(function(i){
							if($('#tableByIdYa3 tbody tr').length==2 && i<=1){
								$(this).find('.trDelNewCon').addClass('none')
							}else{
								$(this).find('.trDelNewCon').removeClass('none')
							}
							if(i==0){
								$(this).find('.trUpNewCon').addClass('none')
							}else if(i==$('#tableByIdYa3 tbody tr').length-1){
								$(this).find('.trDownNewCon').addClass('none')
							}else{
								$(this).find('.trUpNewCon,.trDownNewCon').removeClass('none')
							}
						})
					}
					// 添加tr
					$(document).off('click',".trAddNewCon").on('click','.trAddNewCon',function() {
						if($('#tableByIdYa2 tbody tr').length >= 10){
							alert('最多添加10个')
							return
						}
						$(this).parent('td').parent('tr').after(trHtmlOne())
						xhNewCon()
					})
					// 添加tr图片
					$(document).off('click',".trAddNewCon2").on('click','.trAddNewCon2',function() {
						if($('#tableByIdYa3 tbody tr').length >= 5){
							alert('最多添加5个')
							return
						}
						$(this).parent('td').parent('tr').after(fillDataImg())
						xhNewCon()
					})
					// 删除tr
					$(document).off('click',".trDelNewCon").on('click','.trDelNewCon',function() {
						$(this).parent('td').parent('tr').remove()
						xhNewCon()
					})
					// 上移tr
					$(document).off('click',".trUpNewCon").on('click','.trUpNewCon',function(e) {
						var domYa = $(this).parent('td').parent('tr')
						if(domYa.prev().length == 0){
							alert('不能再上移了')
						}else{
							domYa.prev().insertAfter(domYa)
						}
						xhNewCon()
					})
					// 下移tr
					$(document).off('click',".trDownNewCon").on('click','.trDownNewCon',function(e) {
						var domYa2 = $(this).parent('td').parent('tr')
						if(domYa2.next().length == 0){
							alert('不能再下移了')
						}else{
							domYa2.next().insertBefore(domYa2)
						}
						xhNewCon()
					})
					// 添加一行
					$(document).off('click',".addNewConBtn").on('click','.addNewConBtn',function() {
						if($(this).parent('td').find('.tabTdItem').length>=5){
							alert('最多添加5个，不能再添加了')
						}else{
							$(this).before(fillData())
							xhNewCon()
						}
					})
					// 删除图标
					$(document).off('click',".delImgNewCon").on('click','.delImgNewCon',function() {
						$(this).parent().remove()
						xhNewCon()
					})
					// 上传文件
					$('.modal').on("change",".file",function(e){
						$(this).parents(".uploadImgBox").find(".name").text(getImageUrl(this.files[0]));
						$(this).parents(".uploadImgBox").find(".j_name").show();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src',getImageUrl(this.files[0]));
						$(this).parents('.uploadImgBox').find('.yulanImg').show();
					});
					//删除图片
					$(".j_del").click(function(){
						$(this).siblings(".name").text("");
						$(this).parent(".j_name").hide();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src','');
						$(this).parents('.uploadImgBox').find('.yulanImg').hide();
						$(this).parents('.uploadImgBox').find('.selectImg .file').val('');
					})
					$(document).off('change',"input[name=newConFlagYa]").on('change','input[name=newConFlagYa]',function(){ //反选
						console.log($(this).val())
						if($(this).val() == '1'){ //背景颜色
							$(this).parents('.backTypeNewCon').siblings('.backTypeNewConImg').addClass('none').siblings('.backTypeNewConColor').removeClass('none')
						}else if($(this).val() == '0'){ //背景图片
							$(this).parents('.backTypeNewCon').siblings('.backTypeNewConColor').addClass('none').siblings('.backTypeNewConImg').removeClass('none')
						}
					});
					$(document).off('change',".newConSelectYa").on('change','.newConSelectYa',function(){ //select选择分类
						if($(this).val() == '2'){ //话费
							$(this).parent().parent().next().removeClass('none')
						}else{ //其他
							$(this).parent().parent().next().addClass('none')
						}
					});
				}else if(type=="classification"){//20231107-分类组件
					$('.selectP').hide();
					$('#htmlCon').show();
					var upDa = `<tbody class="zpcjEditBox classfiTable">
									<tr>
										<td>
											<div class="flexbox align-c mt15">
												<div class="w10">
													<p class="cred">*</p>
													<p>是否开启IOP：</p>
												</div>
												<div class="flex1 flexbox align-c">
													<div class='ljcd' style="margin-left:0">
														<label><input type='radio' name='isOpenIopCf' value='1' class='nninput'/>是</label>
														<label style="margin-left:5px"><input type='radio' name='isOpenIopCf' value='0' class='nninput'/>否</label> 
													</div>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="flexbox align-c mt15">
												<div class="w10">
													<p class="cred">*</p>
													<p>是否显示广告名称：</p>
												</div>
												<div class="flex1 flexbox align-c">
													<div class='ljcd' style="margin-left:0">
														<label><input type='radio' name='isViewNameCf' value='1' class='nninput'/>是</label>
														<label style="margin-left:5px"><input type='radio' name='isViewNameCf' value='0' class='nninput'/>否</label> 
													</div>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="flexbox align-c mt15">
												<div class="w10">
													<p class="cred">*</p>
													<p>是否开启精准推荐：</p>
												</div>
												<div class="flex1 flexbox align-c">
													<div class='ljcd' style="margin-left:0">
														<label><input type='radio' name='isOpenSellCf' value='1' class='nninput'/>是</label>
														<label style="margin-left:5px"><input type='radio' name='isOpenSellCf' value='0' class='nninput'/>否</label> 
													</div>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="flexbox align-c mt15">
												<div class="w10">
													<p class="cred">*</p>
													<p>广告展示列数：</p>
												</div>
												<div class="flex1 flexbox align-c">
													<div class='ljcd' style="margin-left:0">
														<label><input type='radio' name='adViewColuCf' value='1' class='nninput'/>1列</label>
														<label style="margin-left:5px"><input type='radio' name='adViewColuCf' value='2' class='nninput'/>2列</label> 
														<label style="margin-left:5px"><input type='radio' name='adViewColuCf' value='3' class='nninput'/>3列</label> 
													</div>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="flexbox align-c mt15">
												<div class="w10">
													<p class="cred">*</p>
													<p>选择分类组件：</p>
												</div>
												<div class="flex1 flexbox align-c">
												<select class="myinput j_selectLink chooseTypeCf" style="display:block;">
														<option value="0">数据0</option>
														<option value="1">数据1</option>
													</select>
												</div>
											</div>
										</td>
									</tr>
								</tbody>`
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(upDa);
					// 数据回填
					$("input[name=isOpenIopCf][value='"+$('.demo .classificationBlock').attr("iop")+"']").prop("checked",true);
					$("input[name=isViewNameCf][value='"+$('.demo .classificationBlock').attr("name")+"']").prop("checked",true);
					$("input[name=isOpenSellCf][value='"+$('.demo .classificationBlock').attr("sell")+"']").prop("checked",true);
					$("input[name=adViewColuCf][value='"+$('.demo .classificationBlock').attr("colu")+"']").prop("checked",true);
					$(".chooseTypeCf option[value='"+$('.demo .classificationBlock').attr("type")+"']").prop("selected","selected");
					if($('.demo .classificationBlock').attr("colu")=='1'){ //一列必须显示名字
						$("input[name=isViewNameCf][value='1']").prop("checked",true);
						$("input[name=isViewNameCf][value='0']").prop("disabled",true).parent().addClass('color999');
					}else{
						$("input[name=isViewNameCf][value='0']").prop("disabled",false).parent().removeClass('color999');
					}
					// 选择几列事件
					$(document).off('change',"input[name=adViewColuCf]").on('change','input[name=adViewColuCf]',function(){
						if($(this).val() == '1'){ //1列
							$("input[name=isViewNameCf][value='1']").prop("checked",true);
							$("input[name=isViewNameCf][value='0']").prop("disabled",true).parent().addClass('color999');
						}else{
							$("input[name=isViewNameCf][value='0']").prop("disabled",false).parent().removeClass('color999');
						}
					});
				}else if(type == "newBusinessRecommend") { //20231124-新业务推荐
					layer.find('.selectLi').find('li').each(function (i,v) {if(i==0){$(v).html('新业务推荐')}if(i==1){$(v).html('补位广告')}});
					$('.selectP').hide();
                    $('.selectP1').hide();
                    $('#htmlCon').show();
					var maxNum = p.find('.newBusinessRecommendBlock').attr('maxNum')
					function addTrLine(val,that,i) {
						console.log(val,'val')
						let now = new Date();
						let year = now.getFullYear();
						let year1 = now.getFullYear()+1;
						let month = ('0' + (now.getMonth() + 1)).slice(-2);
						let day = ('0' + now.getDate()).slice(-2);
						let sDate = year +'-'+ month +'-'+ day
						let eDate = year1 +'-'+ month +'-'+ day
						let url = '',chbm = '',clbm = '',dwmc = '',dwbm = '',qz = ''
						let imgN = `<div class="flexbox">
										<div class="uploadImg pub normalData">
											<img src="" alt="" class="imgPerview ywpicImg" style="display:none;"/>
											<div class="opacityP">上传图片</div>
											<input type="file" class="imgInput"/>
										</div>
										<p class="flex1 yellowTips ml10">建议一行单图尺寸宽度为750px，一行双图宽度为375px，大小不超过100k</p>
									</div>`
						if(that && !that.hasClass('moren')){
							qz = that.attr('qz') || '',
							url = that.attr('url') || '',
							chbm = that.attr('chbm') || '',
							clbm = that.attr('clbm') || '',
							sDate = that.attr('kssj') || '',
							eDate = that.attr('jssj') || '',
							dwmc = that.attr('dwmc') || '',
							dwbm = that.attr('dwbm') || ''
							src = that.find('img').attr('src') || ''
							if(src){
								imgN = `<div class="flexbox">
										<div class="uploadImg pub normalData">
											<img src="${src}" alt="" class="imgPerview ywpicImg" />
											<div class="opacityP j-deleteImg">删除</div>
											<input type="file" class="imgInput"/>
										</div>
										<p class="flex1 yellowTips ml10">建议一行单图尺寸宽度为750px，一行双图宽度为375px，大小不超过100k</p>
									</div>`
							}
						}
						let chF = '',clF = ''
						if(val && val == '2'){
							clF = ''
							chF = 'none'
						}
						if(val && val == '3'){
							clF = 'none'
							chF = ''
						}
						let chcl = `<div class="flexbox mt15 j_hideLink chbmNbr ${chF}">
										<div class="w10">
											<p class="cred">*</p>
											<p>策划编码：</p>
										</div>
										<div>
											<input type="text" class="myinput chbmNbr chbmYa" value="${chbm}" maxlength="32" placeholder="请输入策划编码" onkeyup="this.value=this.value.replace(/[^a-z0-9_,]/g,'')">
										</div>
									</div>
									<div class="flexbox mt5 j_hideLink chbmNbr ${chF}">
										<div class="w10" style="line-height: normal !important;"><p></p></div>
										<p class="yellowTips w320">仅支持字母+数字组合，多个请用英文逗号分割，即“,”</p>
									</div>
									<div class="flexbox mt15 j_hideLink clbmNbr ${clF}">
										<div class="w10">
											<p class="cred">*</p>
											<p>策略编码：</p>
										</div>
										<div>
											<input type="text" class="myinput clbmmNbr clbmYa" value="${clbm}" maxlength="32" placeholder="请输入策略编码" onkeyup="this.value=this.value.replace(/[^a-z0-9_,]/g,'')">
										</div>
									</div>
									<div class="flexbox mt5 j_hideLink clbmNbr ${clF}">
										<div class="w10" style="line-height: normal !important;"><p></p></div>
										<p class="yellowTips w320">仅支持字母+数字组合，多个请用英文逗号分割，即“,”</p>
									</div>`
						if(val && val == '1'){
							console.log('111')
							chcl = ''
						}
						let nbrTr = `<tr>
										<td></td>
										<td>
											<div class="nbrTextCenter">
												<div class="flexbox mt15 j_hideLink">
													<div class="w10">
														<p class="cred">*</p>
														<p>业务图片：</p>
													</div>
													<div class="flex w320">
														<div class="uploadImgBox">
															${imgN}
														</div>
													</div>
												</div>
												<div class="flexbox mt15 j_hideLink">
													<div class="w10">
														<p class="cred">*</p>
														<p>跳转地址：</p>
													</div>
													<div class="flex w320">
														<input type="text" class="myinput flex1 tzdzNbr" maxlength="100" maxlength="100" value="${url}" placeholder="请输入跳转地址或选择跳转跳转广告/聚合页">
														<button type="button">选择广告/聚合页</button>
													</div>
												</div>
												${chcl}
												<div class="flexbox mt15 j_hideLink">
													<div class="w10">
														<p>展示权重：</p>
													</div>
													<div>
														<input type="text" class="myinput nbrZsqz" maxlength="3" value="${qz}" placeholder="请输入展示权重" oninput="if(!/^[0-9]+$/.test(value)) value = value.replace(/[^\d]/g,'');if(value>100)value=value.substring(0, 2);if(value<=0)value=null">
													</div>
												</div>
												<div class="flexbox mt5 j_hideLink">
													<div class="w10" style="line-height: normal !important;"><p></p></div>
													<p class="yellowTips w320">仅支持输入1-100整数，数值越大展示顺序越靠前</p>
												</div>
												<div class="flexbox mt15 j_hideLink">
													<div class="w10">
														<p class="cred">*</p>
														<p>有效时间：</p>
													</div>
													<div class="flex w320" style="align-items: center;">
														<input id='startTime01' name='startTime01' readonly='readonly' class='Wdate kssjNbr' placeholder="请选择开始时间"  onclick=\"WdatePicker({maxDate:\'#F{$dp.$D(\\\'endTime01\\\')}\',dateFmt:\'yyyy-MM-dd\'})\" value='${sDate}' />
														<span style="margin: 0 5px;">至</span>
														<input id='endTime01' name='endTime01' readonly='readonly' class='Wdate jssjNbr' placeholder="请选择结束时间" onclick=\"WdatePicker({minDate:\'#F{$dp.$D(\\\'startTime01\\\')}\',dateFmt:\'yyyy-MM-dd\'})\"  value='${eDate}' />
													</div>
												</div>
												<div class="flexbox mt15 j_hideLink">
													<div class="w10">
														<p>点位名称：</p>
													</div>
													<div>
														<input type="text" class="myinput dwmcNbr" maxlength="24" value="${dwmc}" placeholder="请输入点位名称">
													</div>
												</div>
												<div class="flexbox mt15 j_hideLink">
													<div class="w10">
														<p>点位编码：</p>
													</div>
													<div>
														<input type="text" class="myinput backGreyYa dwbmNbr dwbmYa" value="${dwbm}" placeholder="请输入点位编码" disabled>
													</div>
												</div>
											</div>
										</td>
										<td class="operateFa">
											<div class="trAddNewConNbr">添加</div>
											<div class="trDelNewConNbr">删除</div>
										</td>
									</tr>`
						return nbrTr
					}
					function trFunNbr(val) {
						let nbrHtml = ''
						if(val && val == '1'){
							$(thisClickObj).find('.newBusinessRecommendBlock .nbrBwImgFa').each(function(i){
								nbrHtml += addTrLine(val,$(this),i)
							})
						}else{
							$(thisClickObj).find('.newBusinessRecommendBlock .nbrImgFa').each(function(i){
								nbrHtml += addTrLine(val,$(this),i)
							})
						}
						return nbrHtml
					}
					let upDaNbr = `<tbody class="zpcjEditBox classfiTable nbrTable1">
									<tr>
										<td>
											<div class="flexbox align-c mt15">
												<div class="w10 wFit">
													<p class="cred">*</p>
													<p>最大展示业务数量：</p>
												</div>
												<div class="flex1 flex">
													<input type="text" class="myinput nbrInputMaxNum" maxlength="2" value="${maxNum}" placeholder="请输入最大展示业务数量" style="width:100px" oninput="if(!/^[0-9]+$/.test(value)) value = value.replace(/[^\d]/g,'');if(value>99)value=99;if(value<=0)value=null">
													<span class="yellowTips">调用推荐接口匹配成功后组件最大展示业务数量</span>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="flexbox align-c">
												<div class="w10 wFit">
													<p class="cred visiHiddenNbr">*</p>
													<p>推荐类型：</p>
												</div>
												<div class="flex1 flexbox align-c">
													<div class='ljcd' style="margin-left:0">
														<label class="color383c42"><input type='radio' name='tjType' value='0' class='nninput'/>iop策划</label>
														<label class="color383c42" style="margin-left:5px"><input type='radio' name='tjType' value='1' class='nninput'/>iop策略</label> 
														<label class="color383c42" style="margin-left:5px"><input type='radio' name='tjType' value='2' class='nninput'/>已订业务</label> 
													</div>
												</div>
											</div>
										</td>
									</tr>
									<tr class="searchResetTr">
										<td>
											<div class="flexbox align-c nbrSearchBlock">
												<span style="margin-left:5px !important;cursor: pointer;" class="nbrSearch">搜索</span>
												<span>点位编码：</span>
												<input type="text" class="myinput dwbmSearch" id="dwbmSearch" value="" placeholder="请输入点位编码" style="width:120px">
												<span class="chbmNbr">策划编码：</span>
												<input type="text" class="myinput chbmNbr chbmSearch" value="" id="chbmSearch" placeholder="请输入策划编码" style="width:120px">
												<span class=" clbmNbr none">策略编码：</span>
												<input type="text" class="myinput clbmNbr none clbmSearch" id="clbmSearch" value="" placeholder="请输入策略编码" style="width:120px">
												<button type="button" style="border-radius:10px; margin-left:10px; margin-right:10px; vertical-align: unset;" class="query11">查询</button>
												<button type="button" style="border-radius:10px; vertical-align: unset;" class="reset">重置</button>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<table class="tabelStylePub mt15" id="tableByIdYaNbr" style="margin:0">
												<thead>
													<tr>
														<th style="width:25px">序号</th>
														<th style="width:180px">业务配置</th>
														<th style="width:25px">操作</th>
													</tr>
												</thead>
												<tbody>
													${trFunNbr()}
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
								<tbody class="zpcjEditBox classfiTable nbrTable2 none">
									<tr class="searchResetTr">
										<td>
											<div class="flexbox align-c nbrSearchBlock mt15">
												<span style="margin-left:5px !important;cursor: pointer;" class="nbrSearch">搜索</span>
												<span>点位编码：</span>
												<input type="text" class="myinput dwbmSearch" id="dwbmSearch" value="" placeholder="请输入点位编码" style="width:120px">
												<button type="button" style="border-radius:10px; margin-left:10px; margin-right:10px; vertical-align: unset;" class="query11 bwFlagYa">查询</button>
												<button type="button" style="border-radius:10px; vertical-align: unset;" class="reset">重置</button>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<table class="tabelStylePub mt15" id="tableByIdYaNbr2" style="margin:0">
												<thead>
													<tr>
														<th style="width:25px">序号</th>
														<th style="width:180px">业务配置</th>
														<th style="width:25px">操作</th>
													</tr>
												</thead>
												<tbody>
													${trFunNbr('1')}
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
								`
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(upDaNbr);
					xhNewCon()
					// 数据回填
					$("input[name=tjType][value='"+p.find('.newBusinessRecommendBlock').attr("type")+"']").prop("checked",true);
					console.log($('input[name=tjType]:checked').val(),'ll')
					if($('input[name=tjType]:checked').val() == '1'){
						$('.clbmNbr').removeClass('none')
						$('.chbmNbr').addClass('none')
					}
					if($('input[name=tjType]:checked').val() == '0' || $('input[name=tjType]:checked').val() == '2'){
						$('.chbmNbr').removeClass('none')
						$('.clbmNbr').addClass('none')
					}
					// 选项 clbmNbr
					$(document).off('change',"input[name=tjType]").on('change','input[name=tjType]',function(){
						if($(this).val() == '1'){
							$('.clbmNbr').removeClass('none')
							$('.chbmNbr').addClass('none')
						}else{
							$('.chbmNbr').removeClass('none')
							$('.clbmNbr').addClass('none')
						}
					})
					// 添加一行
					$(document).off('click',".trAddNewConNbr").on('click','.trAddNewConNbr',function() {
						console.log($(this).parents('.tabelStylePub').attr('id') == "tableByIdYaNbr")
						if($(this).parents('.tabelStylePub').attr('id') == "tableByIdYaNbr"){
							if($('input[name=tjType]:checked').val() == '1'){ //展示策略
								$(this).parent().parent().after(addTrLine('2'))
							}else{
								$(this).parent().parent().after(addTrLine('3'))
							}
						}else{
							$(this).parent().parent().after(addTrLine('1'))
						}
						xhNewCon()
					})
					// 删除一行
					$(document).off('click',".trDelNewConNbr").on('click','.trDelNewConNbr',function() {
						if($(this).parent().parent().parent().find('tr').length == 1){
							alert('无法删除')
						}else{
							let result = confirm('确认删除吗？');
							if (result === true) {
								$(this).parent('td').parent('tr').remove()
								xhNewCon()
							}
						}
					})
					//上传图片 
					$(document).on('change','.imgInput',function(){
						console.log($(this)[0].files[0])
						$(this).parents('.uploadImg').find('.imagesZw').css("display","none");
						$(this).parents('.uploadImg').find('.imgPerview').show().attr("src", URL.createObjectURL($(this)[0].files[0]));
						$(this).parents('.uploadImg').find('.opacityP').text('删除').addClass('j-deleteImg');
						return;
					}); 
					//模板管理删除图片
					$(document).on("click", '.j-deleteImg',function (obj) {
						var $this = $(this);
						$this.parent().find('.imgPerview').attr('src','');
						$this.parent().find('.imgInput').val('');
						$this.parent().find('.imgPerview').css("display","none");
						$this.parent().find('.imagesZw').css("display","block");
						$this.text('上传图片').removeClass('j-deleteImg');
					});
					//序号等初始化
					function xhNewCon() {
						var tableLine = document.getElementById("tableByIdYaNbr");
						for (var i = 0; i < tableLine.rows.length; i++) {
							if(i>0){
								tableLine.rows[i].cells[0].innerHTML = (i);
							}
						}
						var tableLine2 = document.getElementById("tableByIdYaNbr2");
						for (var i = 0; i < tableLine2.rows.length; i++) {
							if(i>0){
								tableLine2.rows[i].cells[0].innerHTML = (i);
							}
						}
					}
					// 查询
					$(document).off('click',".nbrSearchBlock>button.query11").on('click','.nbrSearchBlock>button.query11',function() {//搜索
						var adCodeIopYa = $(this).parent().find('input.dwbmSearch').val(),
							chCodeIopYa = $(this).parent().find('input.chbmSearch').val(),
							clCodeIopYa = $(this).parent().find('input.clbmSearch').val()
							console.log($(this).hasClass('bwFlagYa'),$(this).parent().find('input.clbmSearch'),$(this).parent().find('input.clbmSearch').hasClass('none'))
						if($(this).hasClass('bwFlagYa')){
							if(adCodeIopYa ==''){
								$('#tableByIdYaNbr2 tbody tr').each(function() {$(this).removeClass('none')})
							}else{
								$('#tableByIdYaNbr2 tbody tr').each(function() {
									$(this).addClass('none')
									if($(this).find('.dwbmYa').val() != '' && $(this).find('.dwbmYa').val().indexOf(adCodeIopYa) != -1 && adCodeIopYa!=''){$(this).removeClass('none')}
								})
							}
						}else if($(this).parent().find('.clbmSearch').hasClass('none')){
							if(chCodeIopYa=='' && adCodeIopYa ==''){
								$('#tableByIdYaNbr tbody tr').each(function() {$(this).removeClass('none')})
							}else {
								$('#tableByIdYaNbr tbody tr').each(function() {
									$(this).addClass('none')
									if($(this).find('.dwbmYa').val() != '' && $(this).find('.dwbmYa').val().indexOf(adCodeIopYa) != -1 && adCodeIopYa!=''){$(this).removeClass('none')}
									if($(this).find('.chbmYa').val() != '' && $(this).find('.chbmYa').val().indexOf(chCodeIopYa) != -1 && chCodeIopYa!=''){$(this).removeClass('none')}
								})
							}
						}else{
							if(adCodeIopYa=='' && clCodeIopYa ==''){
								$('#tableByIdYaNbr tbody tr').each(function() {$(this).removeClass('none')})
							}else {
								$('#tableByIdYaNbr tbody tr').each(function() {
									$(this).addClass('none')
									if($(this).find('.dwbmYa').val() != '' && $(this).find('.dwbmYa').val().indexOf(adCodeIopYa) != -1 && adCodeIopYa!=''){$(this).removeClass('none')}
									if($(this).find('.clbmYa').val() != '' && $(this).find('.clbmYa').val().indexOf(clCodeIopYa) != -1 && clCodeIopYa!=''){$(this).removeClass('none')}
								})
							}
						}
                        
                    })
					// 重置
					$(document).off('click',".nbrSearchBlock>button[class='reset']").on('click','.nbrSearchBlock>button[class="reset"]',function() {//重置
                        let table = $(this).parents('.searchResetTr').next().find('.tabelStylePub').find('tbody tr')
						$(this).parent().find('input').val('')
                        table.each(function() {$(this).removeClass('none')})
                    })
					// 补位广告
					$(document).off('click',".selectLi li").on('click','.selectLi li',function() {
						console.log($(this).index(),'$(this).index()')
						if($(this).index() == 0){
							$('.nbrTable1').removeClass('none')
							$('.nbrTable2').addClass('none')
						}else if($(this).index() == 1){
							$('.nbrTable1').addClass('none')
							$('.nbrTable2').removeClass('none')
						}
					})
				}else if(type == "hotZoneImages"){ //20240222-热区图片
					$('.selectP').hide();
					$('#htmlCon').show();
					let trs = ``,delClass = 'hziDel'
					if(p.find('.hotZiPart .swiper-wrapper .swiper-slide').length==1){
						delClass = 'hziDel none'
					}
					p.find('.hotZiPart .swiper-wrapper .swiper-slide').each(function(i){
						let json = '',num = 0
						if($(this).attr('json')){
							json = `json=${$(this).attr('json')}`
							console.log($(this).attr('json'),JSON.parse(Array($(this).attr('json'))[0]),'555')
							num = JSON.parse(Array($(this).attr('json'))[0]).length
						}
						trs += `<tr>
							<td>${i+1}</td>
							<td>
								<div class="flex1 uploadImgBox" ${json}>
									<div class="uploadImgNewStyle">
										<div class="uploadImgFa">
											<img src="${$(this).find('img').attr('src')}" alt="">
										</div>
										<div class="uploadText hziDeleteImg">删除</div>
										<input type="file" value="" class="file upNewFile none">
									</div>
								</div>
							</td>
							<td>${num}</td>
							<td>
								<div class="hziTableSet">
									<div class="hziUpdate">编辑热区</div>
									<div class="hziAdd">添加</div>
									<div class="${delClass}">删除</div>
								</div>
							</td>
						</tr>`
					})
					let str = `<tbody class="zpcjEditBox">
						<tr>
							<td>
								<div class="flexbox mt15 juCenter">
									<div class="w10 wFitContent">
										<p><span class="red">*</span>热区图片：</p>
									</div>
									<div class="flexbox">
										<div>
											<div class="greyTips">建议上传图片宽度为750px，大小不超过200KB</div>
											<table id="hotTable">
												<thead>
													<tr>
														<th style="width:50px">序号</th>
														<th style="width:150px"><span class="red">*</span> 热区图片</th>
														<th style="width:80px">热区数量</th>
														<th style="width:150px">操作</th>
													</tr>
												</thead>
												<tbody id="hotZoneImagesTable">
													${trs}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</td>
						</tr>
					`
					function xh(id) { //序号
						var tableLine = document.getElementById(id);
						for (var i = 0; i < tableLine.rows.length; i++) {
							if(i>0){
								tableLine.rows[i].cells[0].innerHTML = (i);
							}
						}
						if($('#hotZoneImagesTable tr').length==1){
							$('.hziDel').addClass('none')
						}else{
							$('.hziDel').removeClass('none')
						}
					}
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(str); 
					$(document).off('click',".hziAdd").on('click','.hziAdd',function() { //添加
						console.log('触发')
						if($('#hotZoneImagesTable tr').length == 10){
							alert('最多10条')
							return
						}
						$(this).parent().parent().parent().after(`<tr>
							<td></td>
							<td>
								<div class="flex1 uploadImgBox">
									<div class="uploadImgNewStyle">
										<div class="uploadImgFa">
											<img src="./images/u16.png" class="noUploadImg" alt="">
										</div>
										<div class="uploadText upImgFile">上传图片</div>
										<input type="file" value="" class="upNewFile none">
									</div>
								</div>
							</td>
							<td>0</td>
							<td>
								<div class="hziTableSet">
									<div class="hziUpdate">编辑热区</div>
									<div class="hziAdd">添加</div>
									<div class="hziDel">删除</div>
								</div>
							</td>
						</tr>`)
						xh("hotTable")
					})
					$(document).off('click',".hziDel").on('click','.hziDel',function() { //删除
						if(confirm('是否确定删除？')){
							$(this).parent().parent().parent().remove()
							if($('#hotZoneImagesTable tr').length == 1){
								$('#hotZoneImagesTable tr .hziDel').addClass('none')
							}
							xh("hotTable")
						}
					})
					$(document).off('click',".hziDeleteImg").on('click','.hziDeleteImg',function() { //删除上传图片
						if(confirm('是否确定删除图片和热区？')){
							$(this).prev().find('img').attr("src","./images/u16.png").addClass('noUploadImg')
							$(this).next().val("")
							$(this).removeClass('hziDeleteImg').addClass('upImgFile').text('上传图片')
							$(this).parent().parent().parent().next().text('0')
							$(this).parent().parent().attr("json","")
						}
					})
					$(document).off('click',".upImgFile").on('click','.upImgFile',function() { //图片上传
						$(this).next().click()
					})
					$(document).off('click',".upNewFile").on('change','.upNewFile',function() { //图片上传input
						console.log('上传')
						var file = this.files[0]; // 获取第一个被选中的文件对象
						if (file) {
							var img = new Image();
							img.onload = function () {
								console.log('图片尺寸：', img.width + ' x ' + img.height);
								// 进行更多操作...
							};
							img.src = URL.createObjectURL(file); // 创建一个临时的URL地址来显示图片
							$(this).prev().prev().find('img').attr('src',URL.createObjectURL(file)).removeClass('noUploadImg')
							$(this).prev().removeClass('upImgFile').addClass('hziDeleteImg').text('删除')
						} else {
							console.log("未选择任何文件");
						}
					});
					$(document).off('click',".hziUpdate").on('click','.hziUpdate',function() { //编辑热区
						let src = $(this).parent().parent().prev().prev().find('.uploadImgFa img')
						let index = $('#hotZoneImagesTable tr').index($(this).parent().parent().parent())
						console.log(src,src.attr("src"),src.hasClass('noUploadImg'),'src')
						if(src.hasClass('noUploadImg')){
							alert('请上传热区图片')
							return
						}
						let _that = $(this)
						let setting = {
							maxAmount:5,
							tag:'tr',
							params:{},
							domCallBack:function(params){
								return "<td>链接：<input type='text' value='http://baidu.com'/></td>"
							}
						}
						//初始化加载
						let areas = "";
						$('.hotImgNumList').empty()
						let json = _that.parent().parent().prev().prev().find('.uploadImgBox').attr("json")
						console.log(areas,'areas')
						console.log(json,'333')
						if(json){
							areas = json
							console.log(JSON.parse(json),'json')
						}
						$("#hotAreas").val(areas);
						let urlImg = src.attr("src")
						imageMaps.proportionNoSameManual(urlImg,setting,1,1,true);
						$('.modalsHot').attr("trData",index).fadeIn(200, function() {
							
						})
					})
				}else if(type == "packageCoupon"){ //20240304-套餐权益券
					$('.selectP').hide();
					$('#htmlCon').show();
					function getImgUrl(className) { //获取图片背景图片地址
						var msgBk = p.find("."+className+" ").css("background-image");//元素编码
						var reg = new RegExp('"','g');
						msgBk = msgBk == undefined||msgBk == "none"?'':msgBk.split("(")[1].split(")")[0].replace(reg,'');
						console.log(msgBk,'msgBk')
						return msgBk
					}
					function rgb2hex(rgb) {
						rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
						function hex(x) {
						   return ("0" + parseInt(x).toString(16)).slice(-2);
						}
						return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
					}
					let str = `<tbody class="zpcjEditBox pcTableMsg">
								<tr>
									<td>
										<div class="flexbox align-c mt15">
											<div class="w10 wFit">
												<p class="cred">*</p>
												<p>背景图：</p>
											</div>
											<div class="flex1 uploadImgBox flex">
												<div class="uploadImgNewStyle">
													<div class="uploadImgFa">
														<img class="pcBackImg" src="${getImgUrl('packageCouponPart')}" alt="">
													</div>
													<div class="uploadText hziDeleteImg">删除</div>
													<input type="file" value="" class="file upNewFile none">
												</div>
												<p class="ml20 color999">建议上传图片尺寸为750*125px，大小不超过100KB</p>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="flexbox align-c mt15">
											<div class="w10 wFit">
												<p class="cred">*</p>
												<p>标题：</p>
											</div>
											<div class="flex1 flex">
												<input type="text" class="pctitle" value="${p.find('.leftPcPart>span:nth-child(2)').html()}" class="myinput" maxlength="10" placeholder="请输入标题">
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="flexbox align-c mt15">
											<div class="w10 wFit">
												<p>标题颜色：</p>
											</div>
											<div class="flex1 flexbox align-c">
												<input type="color" class="wh40 pcTitleColor" value="${rgb2hex(p.find('.leftPcPart>span:nth-child(2)').css('color'))}" oninput="$('#pcTitleColor').val(this.value)">
												<input type="text" class="w259" value="${rgb2hex(p.find('.leftPcPart>span:nth-child(2)').css('color'))}" id="pcTitleColor" readonly>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="flexbox align-c mt15">
											<div class="w10 wFit">
												<p>参数颜色：</p>
											</div>
											<div class="flex1 flexbox align-c">
												<input type="color" class="wh40 pcParamColor" value="${rgb2hex(p.find('.leftPcPart>span:nth-child(1)').css('color'))}" oninput="$('#pcParamColor').val(this.value)">
												<input type="text" class="w259" value="${rgb2hex(p.find('.leftPcPart>span:nth-child(1)').css('color'))}" id="pcParamColor" readonly>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="flexbox align-c mt15">
											<div class="w10 wFit">
												<p>说明图：</p>
											</div>
											<div class="flex1 uploadImgBox flex">
												<div class="uploadImgNewStyle">
													<div class="uploadImgFa">
														<img class="pcIllustrateImg" src="${p.find('.leftPcPart>img').attr("src")?p.find('.leftPcPart>img').attr("src"):'./images/u16.png'}" alt="">
													</div>
													<div class="uploadText hziDeleteImg">删除</div>
													<input type="file" value="" class="file upNewFile none">
												</div>
												<p class="ml20 color999">建议上传图片尺寸为150*54px，大小不超过60KB</p>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="flexbox align-c mt15">
											<div class="w10 wFit">
												<p>说明图链接：</p>
											</div>
											<div class="flex1 flex">
												<input type="text" class="myinput w194 pcIllustrateHref" value="${p.find('.packageCouponPart').attr("lHref")}" maxlength="100" placeholder="请输入链接地址或选择">
												<button type="button">选择聚合页/广告</button>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="flexbox align-c mt15">
											<div class="w10 wFit">
												<p class="cred">*</p>
												<p>按钮图：</p>
											</div>
											<div class="flex1 uploadImgBox flex">
												<div class="uploadImgNewStyle">
													<div class="uploadImgFa">
														<img class="pcBtnImg" src="${p.find('.rightPcPart>img').attr("src")}" alt="">
													</div>
													<div class="uploadText hziDeleteImg">删除</div>
													<input type="file" value="" class="file upNewFile none">
												</div>
												<p class="ml20 color999">建议上传图片尺寸为156*54px，大小不超过60KB</p>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="flexbox align-c mt15">
											<div class="w10 wFit">
												<p class="cred">*</p>
												<p>按钮图链接：</p>
											</div>
											<div class="flex1 flex">
												<input type="text" class="myinput w194 pcBtnHref" value="${p.find('.packageCouponPart').attr("rHref")}" maxlength="100" placeholder="请输入链接地址或选择">
												<button type="button">选择聚合页/广告</button>
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="flexbox align-c">
											<div class="w10 wFit">
												<p>推荐类型：</p>
											</div>
											<div class="flex1 flexbox align-c">
												<div class='ljcd pcTYpe' style="margin-left:0;font-weight: 400;">
													<label class="color383c42"><input type='radio' name='tjTypePc' value='0' class='nninput'/>iop策划</label>
													<label class="color383c42" style="margin-left:5px"><input type='radio' name='tjTypePc' value='1' class='nninput'/>iop策略</label> 
													<label class="color383c42" style="margin-left:5px"><input type='radio' name='tjTypePc' value='2' class='nninput'/>已订业务</label> 
												</div>
											</div>
										</div>
									</td>
								</tr>
								<tr class="pcCodeTr">
									<td>
										<div class="flexbox">
											<div class="w10 wFit">
												<p class="cred">*</p>
												<p>策划编码：</p>
											</div>
											<div class="flex1">
												<input type="text" class="myinput pcCode" value="${p.find('.packageCouponPart').attr("code")}" placeholder="请输入策划编码" onkeyup="this.value=this.value.replace(/[^a-zA-Z0-9,]/g,'');">
												<span class="yellowTips">仅支持字母+数字组合，多个请用英文逗号分割，即","</span>
											</div>
										</div>
									</td>
								</tr>
							</tbody>`
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(str); 
					$('input[name="tjTypePc"][value='+p.find('.packageCouponPart').attr("type")+']').prop("checked",true)
					if(p.find('.packageCouponPart').attr("type") == '1'){
						$('.pcCodeTr').addClass('none')
					}
					if(!p.find('.leftPcPart>img').attr("src")){ 
						$('.pcIllustrateImg').attr("src","./images/u16.png").addClass('noUploadImg')
						$('.pcIllustrateImg').parent().next().next().val("")
						$('.pcIllustrateImg').parent().next().removeClass('hziDeleteImg').addClass('upImgFile').text('上传图片')
					}
					$(document).off('change',"input[name=tjTypePc]").on('change','input[name=tjTypePc]',function(){
						console.log($(this).val(),'制止和')
						if($(this).val() == '1'){
							$('.pcCodeTr').addClass('none')
						}else{
							$('.pcCodeTr').removeClass('none')
						}
					})
					$(document).off('click',".hziDeleteImg").on('click','.hziDeleteImg',function() { //删除上传图片
						$(this).prev().find('img').attr("src","./images/u16.png").addClass('noUploadImg')
						$(this).next().val("")
						$(this).removeClass('hziDeleteImg').addClass('upImgFile').text('上传图片')
					})
					$(document).off('click',".upImgFile").on('click','.upImgFile',function() { //图片上传
						$(this).next().click()
					})
					$(document).off('click',".upNewFile").on('change','.upNewFile',function() { //图片上传input
						console.log('上传')
						var file = this.files[0]; // 获取第一个被选中的文件对象
						if (file) {
							var img = new Image();
							img.onload = function () {
								console.log('图片尺寸：', img.width + ' x ' + img.height);
								// 进行更多操作...
							};
							img.src = URL.createObjectURL(file); // 创建一个临时的URL地址来显示图片
							$(this).prev().prev().find('img').attr('src',URL.createObjectURL(file)).removeClass('noUploadImg')
							$(this).prev().removeClass('upImgFile').addClass('hziDeleteImg').text('删除')
						} else {
							console.log("未选择任何文件");
						}
					});
				}else if(type=="operationalRecommend"){//20231116-推荐广告
					$('.selectP').hide();
					$('#htmlCon').show();
				
					
				      //回填数据
					var dataTitleType='',dataTitlePb='',dataContentBj='',dataContentBackgType='',dataLeftPadding='',dataContBackg='',dataContBackgImg='',scroHE = "",dataContTitleImg="",dataNumberRows="", listObj=""
					dataTitleType = $('.demo .containerwxRec .backBlockOperational').attr('dataTitleType');
					dataTitlePb = $('.demo .containerwxRec .backBlockOperational').attr('dataTitlePb');
					dataContentBj = $('.demo .containerwxRec .backBlockOperational').attr('dataContentBj');
					dataContentBackgType = $('.demo .containerwxRec .backBlockOperational').attr('dataContentBackgType');
					dataLeftPadding = $('.demo .containerwxRec .backBlockOperational').attr('dataLeftPadding');
					dataContBackg = $('.demo .containerwxRec .backBlockOperational').attr('dataContBackg');
					dataContBackgImg = $('.demo .containerwxRec .backBlockOperational').attr('dataContBackgImg');
					dataContTitleImg = $('.demo  .containerwxRec .backBlockOperational').attr('dataContTitleImg');
					dataNumberRows = $('.demo  .containerwxRec .backBlockOperational').attr('dataNumberRows');
					if($('.demo  .containerwxRec .backBlockOperational').attr('dataSelectedValue')){
						listObj = JSON.parse($('.demo  .containerwxRec .backBlockOperational').attr('dataSelectedValue'))
						console.log(listObj,"88888888888888")
				   }
					var str = `<tbody class="zpcjEditBox newConTable">
							<tr class="backtitleNewCon">
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">标题类型：</div>
										<div class="flex1 flexbox align-c">
											<div class='ljcd' style="margin-left:0">
												<label><input type='radio' name='newTitleFlag' value='1' class='nninput'/>文本</label>
												<label style="margin-left:5px"><input type='radio' name='newTitleFlag' value='0' class='nninput'/>图片</label> 
											</div>
										</div>
									</div>
								</td>
							</tr>
							<tr class="backTyptitle">
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">
											<p class="cred">*</p>
											<p>标题文案：</p>
										</div>
										<div class="flex1">
											<input type="text" class="myinput backTyptitleValue" value="${$('.demo .backBlockOperational').attr('datatitileText')}"" placeholder="请输入标题文案">
										</div>
									</div>
								</td>
							</tr>
							<tr class="backTypImg backImgshow none">
							<td>

							<div class="flexbox align-c mt15">
							<div class="w10">
								<p class="cred">*</p>
								<p>标题图片：</p>
							</div>
							<div>
							<div class="uploadImg normalData">
								<img src="images/images.png" alt="" class="imagesZw" style="display:block;"/>
								<img src="" alt="" class="imgPerview ywpicImg" style="display:none;"/>
								<div class="opacityP j-deleteImg">上传图片</div>
								<input type="file" class="imgInput"/>
							</div>
					     </div>
						 <div style="color: rgb(249, 147, 6);margin-left:0.2rem">
						 <div> 建议上传图片尺寸：375*45，大小不超过100K</div>
						 </div>
					 </div>

					</td>
						  </tr>
							<tr class="newContentPbFj">
								<td>
								<div class="flexbox mt15 j_hideLink">
								<div class="w10">
									<p class="cred">*</p>
									<p>标题排版：</p>
								</div>
								<div>
									<select class="myinput j_selectLink newContentPb" dataValue="" style="display:block;">
										<option value="1">居左</option>
										<option value="2">居中</option>
									</select>
								</div>
							</div>
								</td>
							</tr>
							<tr class="leftPaddingVul">
							<td>
								<div class="flexbox align-c mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>距左距离：</p>
									</div>
									<div class="flex1">
										<input type="number" class="myinput backleftPadding" value="${dataLeftPadding}" placeholder="请输入距左距离"> px
									</div>
								</div>
							</td>
						</tr>
							<tr class="backStepperVul">
								<td>
								<div class="flexbox mt15 j_hideLink">
								<div class="w10">
									<p class="cred">*</p>
									<p>内容布局：</p>
								</div>
								<div>
									<select class="myinput j_selectLink newConStepper" style="display:block;">
										<option value="1">限制行数</option>
										<option value="2">不限制（瀑布流）</option>
									</select>
								</div>
							</div>
								</td>
							</tr>

						 <tr class="backStepper">
							<td>
							<div class="flexbox mt15 j_hideLink">
							<div class="w10">
							</div>
							<div class="Stepper">
							<div class="minus">-</div>
							<div class="countNum">${dataNumberRows}</div>
							<div class="addNum">+</div>
					        </div>
							<div style="line-height: 32px;font-weight: normal;">&nbsp;&nbsp;行</div>
						</div>
							</td>
						</tr>
							<tr class="backtiCon">
								<td>
								<div class="flexbox align-c mt15">
								<div class="w10">背景类型：</div>
								<div class="flex1 flexbox align-c">
									<div class='ljcd' style="margin-left:0">
										<label style="margin-left:5px"><input type='radio' name='titleConFlagYa' value='0' class='nninput'/>图片</label> 
										<label><input type='radio' name='titleConFlagYa' value='1' checked class='nninput'/>纯色</label>
									</div>
								</div>
							    </div>
								</td>
							</tr>
							<tr class="backTitleConColor">
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">
											<p class="cred">*</p>
											<p>背景颜色：</p>
										</div>
										<div class="flex1 flexbox align-c">
											<input type="color" class="backColorInputIopYa" value="${dataContBackg}" oninput="$('#backTitleConColorId').val(this.value)">
											<input type="text" id="backTitleConColorId" value="${dataContBackg}"  readonly>
										</div>
									</div>
								</td>
							</tr>
							<tr class="backTypeTitleConImg none  backImgshow">
								<td>
									<div class="flexbox align-c mt15">
										<div class="w10">
											<p class="cred">*</p>
											<p>背景图片：</p>
										</div>
										<div>
										<div class="uploadImg normalData">
											<img src="images/images.png" alt="" class="imagesZw" style="display:block;"/>
											<img src="" alt="" class="imgPerview ywpicImg" style="display:none;"/>
											<div class="opacityP j-deleteImg">上传图片</div>
											<input type="file" class="imgInput"/>
										</div>
										</div>
										<div style="color: rgb(249, 147, 6);margin-left:0.2rem">
										<div> 建议上传图片尺寸：宽度为336，大小不超过2M</div>
										<div> 建议瀑布流选择纯色背景</div>
										</div>
									</div>
								</td>
							</tr>
						
							<tr>
							<td>
								<div class="flexbox align-c mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>关联策略：</p>
									</div>
									<div class="glclicon">
                                       <div>选择</div>
									</div>
								</div>
							</td>
						</tr>
						<tr>
								<td>
									<div class="flexbox mt15">
										<div class="w10">
											<p></p>
										</div>
										<div class="flex1">
										<table style="width: 97%;border: 2px solid #F3F3F3;border-collapse: collapse;margin:0">
											<thead>
												<tr id="xhXs">
													<th class="thXh" style="width:50px">序号</th>
													<th class="thXh" style="width:350px">策略名称</th>
													<th class="thXh" style="width:350px">操作</th>
												</tr>
											</thead>
											<tbody id="listRpc">
											</tbody>
										</table>
										</div>
									</div>
								</td>
							</tr>
						</tbody>`
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(str); 

					for(var i = 0;i<listObj.length;i++){
						var node = `
						  <tr class="bsadtr scTdss">
									  <td ><input value='1' readonly/></td>
									  <td><input style="outline: none;border:none;" readonly placeholder="策略名称" class="strategyName" value="${listObj[i]}"></td>
									  <td class="nutsdd">
									  <a style="color:blue;text-decoration: none;padding-right: 5px;" href="javascript:;" class="moveUp">上移</a>
									  <a style="color:blue;text-decoration: none;padding-right: 5px;" href="javascript:;" class="moveDown">下移</a>
									  <a style="color:red;text-decoration: none;" href="javascript:;" class="dels"'>删除</a>
										  </td>
								  </tr>
						  `;
					  
		  
						  scroHE +=node;
					 
					}
			 
		  
					$("#listRpc").html(scroHE);
					resetNumber();
					// 默认选中标题类型
					$('input[name=newTitleFlag]').each(function(){
						console.log($(this).val(),$('.demo .backBlockOperational').attr('dataTitleType'),'asdd')
						if($(this).val() == $('.demo .backBlockOperational').attr('dataTitleType')){
							$(this).attr('checked','checked')
						}
					})
					if($('.demo .backBlockOperational').attr('dataTitleType') == '0'){
						$('.backTypImg').removeClass('none')
						$('.backTyptitle').addClass('none')
						$('.backTypImg .uploadImg').find('.imagesZw').css("display","none");
						$('.backTypImg .uploadImg').find('.imgPerview').show().attr("src", $('.demo .backBlockOperational').attr('dataContTitleImg'));
			            $('.backTypImg .uploadImg').find('.opacityP').text('删除').addClass('j-deleteImg');
					}else{
						$('.backTypImg').addClass('none')
						$('.backTyptitle').removeClass('none')
					}

					//标题类型
					$(document).off('change',"input[name=newTitleFlag]").on('change','input[name=newTitleFlag]',function(){ //反选
						if($(this).val() == '1'){ //文本
							$(this).parents('.backtitleNewCon').siblings('.backTypImg').addClass('none').siblings('.backTyptitle').removeClass('none')
						}else if($(this).val() == '0'){ //标题图片
							$(this).parents('.backtitleNewCon').siblings('.backTyptitle').addClass('none').siblings('.backTypImg').removeClass('none')
						}
					});

					// 默认选背景类型
					$('input[name=titleConFlagYa]').each(function(){
						console.log($(this).val(),$('.demo .backBlockOperational').attr('dataContentBackgType'),'asdd')
						if($(this).val() == $('.demo .backBlockOperational').attr('dataContentBackgType')){
							$(this).attr('checked','checked')
						}
					})
					if($('.demo .backBlockOperational').attr('dataContentBackgType') == '0'){
						$('.backTypeTitleConImg').removeClass('none')
						$('.backTitleConColor').addClass('none')
						$('.backTypeTitleConImg .uploadImg').find('.imagesZw').css("display","none");
						$('.backTypeTitleConImg .uploadImg').find('.imgPerview').show().attr("src", $('.demo .backBlockOperational').attr('dataContBackgImg'));
						$('.backTypeTitleConImg .uploadImg').find('.opacityP').text('删除').addClass('j-deleteImg');
					}else{
						$('.backTypeTitleConImg').addClass('none')
						$('.backTitleConColor').removeClass('none')
					}

                    //内容背景类型
					$(document).off('change',"input[name=titleConFlagYa]").on('change','input[name=titleConFlagYa]',function(){ //反选
						if($(this).val() == '1'){ //纯色
							$(this).parents('.backtiCon').siblings('.backTypeTitleConImg').addClass('none').siblings('.backTitleConColor').removeClass('none')
						}else if($(this).val() == '0'){ //背景图片
							$(this).parents('.backtiCon').siblings('.backTitleConColor').addClass('none').siblings('.backTypeTitleConImg').removeClass('none')
						}
					});
					//标题排版
					$('.newContentPb').each(function(){
						$(this).find('option[value='+$('.demo .backBlockOperational').attr('dataTitlePb')+']').attr("selected","selected")
						if($('.demo .backBlockOperational').attr('dataTitlePb') == '1'){
							$(this).parents(".newContentPbFj").siblings('.leftPaddingVul').removeClass('none')
						}else{
							$(this).parents(".newContentPbFj").siblings('.leftPaddingVul').addClass('none')
						}
					})

					$(document).off('change',".newContentPb").on('change','.newContentPb',function(){ //select选择内容布局
						if($(this).val() == '1'){ //居左距离
							$(this).parents(".newContentPbFj").siblings('.leftPaddingVul').removeClass('none')
						}else{
							$(this).parents(".newContentPbFj").siblings('.leftPaddingVul').addClass('none')
						}
					});

                     //内容布局
					$('.newConStepper').each(function(){
						$(this).find('option[value='+$('.demo .backBlockOperational').attr('dataContentBj')+']').attr("selected","selected")
						if($('.demo .backBlockOperational').attr('dataContentBj') == '1'){
							$(this).parents(".backStepperVul").siblings('.backStepper').removeClass('none')
						}else{
							$(this).parents(".backStepperVul").siblings('.backStepper').addClass('none')
						}
					})
					
					$(document).off('change',".newConStepper").on('change','.newConStepper',function(){ //select选择内容布局
						if($(this).val() == '1'){ //限制行数
							$(this).parents(".backStepperVul").siblings('.backStepper').removeClass('none')
						}else{
							$(this).parents(".backStepperVul").siblings('.backStepper').addClass('none')
							$(".backStepper .countNum").text("1")
						}
					});

					//计数器
					$(".minus").on("click", function () {
						let num = $(".countNum").text() > 1 ? $(".countNum").text() - 1 : 1;
						$(".countNum").text(num);

					})
					$(".addNum").on("click", function () {
					//   let num = +$(".countNum").text() + 1;

						let num = $(".countNum").text() <3  ? +$(".countNum").text() + 1 : 3;

						$(".countNum").text(num);
					});
				
					//重置序号
					function resetNumber() { 
						var tableLine = document.getElementById("listRpc");
						   for (var i = 0; i < tableLine.rows.length; i++) {
				             if(i>=0){
				               tableLine.rows[i].cells[0].innerHTML = (i+1);
								if(tableLine.rows[i].cells[0].innerHTML==1){
								$(".scTdss").eq(i).find(".moveUp").addClass('xsyc').siblings().removeClass('xsyc')
				
									}else if(tableLine.rows[i].cells[0].innerHTML == tableLine.rows.length){
									$(".scTdss").eq(i).find(".moveDown").addClass('xsyc').siblings().removeClass('xsyc')
				
									}else{
									$(".scTdss").eq(i).find(".moveUp").removeClass('xsyc')
									$(".scTdss").eq(i).find(".moveDown").removeClass('xsyc')
									}
				
				             }
							}
				        }

					// 上移tr
					$(document).off('click',".moveUp").on('click','.moveUp',function(e) {
						var domYa = $(this).parent('td').parent('tr')
						if(domYa.prev().length == 0){
							alert('不能再上移了')
						}else{
							domYa.prev().insertAfter(domYa)
						}
						resetNumber();
					})
					//下移tr
					$(document).off('click',".moveDown").on('click','.moveDown',function(e) {
						var domYa2 = $(this).parent('td').parent('tr')
						if(domYa2.next().length == 0){
							alert('不能再下移了')
						}else{
							domYa2.next().insertBefore(domYa2)
						}
						resetNumber();
					})
				
					//删除tr
					$(document).off('click',".dels").on('click','.dels',function() {
						$(this).parent('td').parent('tr').remove()
						resetNumber();
					})
				
				
				/* 	// 上传文件
					$('.modal').on("change",".file",function(e){
						$(this).parents(".uploadImgBox").find(".name").text(getImageUrl(this.files[0]));
						$(this).parents(".uploadImgBox").find(".j_name").show();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src',getImageUrl(this.files[0]));
						$(this).parents('.uploadImgBox').find('.yulanImg').show();
					});
					//删除图片
					$(".j_del").click(function(){
						$(this).siblings(".name").text("");
						$(this).parent(".j_name").hide();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src','');
						$(this).parents('.uploadImgBox').find('.yulanImg').hide();
						$(this).parents('.uploadImgBox').find('.selectImg .file').val('');
					}) */
			
				}else if(type=="floatBlockCom"){//20230816悬浮组件
					var $this = $(e.target).parent(".ctrl-btns").siblings(".floatBlockYa")
					console.log($this)
					$('.selectP').hide();
					$('#htmlCon').show();
					var editPicImgSrc = p.find('.cjview img.testimg').prop('src');
					var str = `<tbody class="zpcjEditBox">
						<tr>
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>悬浮球图片：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="selectImg upTipFlagYa">
											<div>
												<button class="uploadBtn">浏览</button><span class="uploadImgTag">建议上传图片尺寸：120*120px，大小不超过100K</span>
											</div>
											<input type="file" value="" class="file myinput">
										</div>
										<div class="shownamebox floatBallImgM j_name" style="display:block">
											<p class="name"></p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg" style="display:block"><img class="bgimg1" src="" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-c mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>跳转链接：</p>
									</div>
									<div class="flex1 flexbox align-c">
										<input type="text" class="myinput" value="" placeholder="请输入跳转链接" id="activeTitle" maxlength="16">
										<div class="popChooseBtnYa">选择广告</div>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div class="flexbox align-c mt15">
									<div class="w10">是否支持关闭：</div>
									<div class="flex1 flexbox align-c">
										<div class='ljcd' style="margin-left:0">
											<label><input type='radio' name='closeFlag' value='1' class='nninput' checked/>是</label>
											<label style="margin-left:5px"><input type='radio' name='closeFlag' value='0' class='nninput'/>否</label> 
										</div>
									</div>
								</div>
							</td>
						</tr>
						<tr class="closeBlockYa">
							<td>
								<div class="flexbox align-s mt15">
									<div class="w10">
										<p class="cred">*</p>
										<p>关闭图标：</p>
									</div>
									<div class="flex1 uploadImgBox">
										<div class="selectImg upTipFlagYa">
											<div>
												<button class="uploadBtn">浏览</button><span class="uploadImgTag">建议上传图片尺寸：30*30px，大小不超过100K</span>
											</div>
											<input type="file" value="" class="file myinput">
										</div>
										<div class="shownamebox closeImgM j_name" style="display:block">
											<p class="name"></p>
											<p class="del j_del">删除</p>
										</div>
										<p class="yulanImg" style="display:block"><img class="bgimg1" src="./images/20230816/5.png" alt=""></p>
									</div>
								</div>
							</td>
						</tr>
					</tbody>`;
					$('.modals #htmlCon table').css({'margin-top':'0'}).html('').append(str); 

					// 回填默认数据
					$('.floatBallImgM p.name').html($('.rightFloatBlock .topImgYa img').attr("src"))
					$('.floatBallImgM+.yulanImg img').attr("src",$('.rightFloatBlock .topImgYa img').attr("src"))
					$('.closeImgM p.name').html($('.bottomImgYa img').attr("src"))
					$('.closeImgM+.yulanImg img').attr("src",$('.bottomImgYa img').attr("src"))
					//图片上传
					$('.modal').on("change",".file",function(e){
						$(this).parents(".uploadImgBox").find(".name").text(getImageUrl(this.files[0]));
						$(this).parents(".uploadImgBox").find(".j_name").show();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src',getImageUrl(this.files[0]));
						$(this).parents('.uploadImgBox').find('.yulanImg').show();
					});
					//删除图片
					$(".j_del").click(function(){
						$(this).siblings(".name").text("");
						$(this).parent(".j_name").hide();
						$(this).parents('.uploadImgBox').find('.yulanImg img').prop('src','');
						$(this).parents('.uploadImgBox').find('.yulanImg').hide();
						$(this).parents('.uploadImgBox').find('.selectImg .file').val('');
					})
					// 是否支持关闭
					$(document).on('change','input[name=closeFlag]',function() {
						if($(this).val() == '0'){ //否
							$(document).find('.closeBlockYa').addClass('none').hide()
							$(document).find('.bottomImgYa').addClass('none')
						}else if($(this).val() == '1') { //是
							$(document).find('.closeBlockYa').removeClass('none').show()
							$(document).find('.bottomImgYa').removeClass('none')
						}
					})

				}else{//动态广告位
					$('.selectP').show();
					$('#htmlCon').hide();
				}
				$('#htmlCon2').prepend("<textarea id='teAre' style='border:0;height: 4.4rem;width: 7rem;'>"+a.html().trim()+"</textarea>");
			});
		})
		
		.on('click','.cspz',function(e) {//楼层编辑参数配置 -- 开发需要请求数据库查询数据
			selectLiCspz(0);//方便tab切换的 
			
			$('.modals_cspz1').fadeIn(200, function() {//展示参数配置弹层
				var layer=$('.cspzedit-layer',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100);//弹窗位置设置
				//iop推荐弹窗拼串开始
				$('#htmlConCspz').show();//默认展示IOP推荐tab 
			});
		});

		$(document).on('click','.glclicon',function(e) {//选择策略
			$('.modals_selection_policy').fadeIn(200, function() {//展示参数配置弹层
				var layer=$('.cspzedit-layer',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100);//弹窗位置设置
				$('#htmlConPolicy').show();
			});
		})
		
		$(document).on('click','.jhsp',function(e) {//选择聚合 
			  $('.modals_cspzjhy').fadeIn(200, function() {//展示参数配置弹层
				  var layer=$('.cspzedit-layer',this);
				  layer.css({
					  'margin-top':-(layer.height())/2,
					  'margin-left':-(layer.width())/2
				  }).fadeIn(100);//弹窗位置设置
				  //iop推荐弹窗拼串开始
				  $('#htmlConjh').show();//默认展示IOP推荐tab 
			  });
		  })
		
		// var cspzadd ="";保留
	
		$('.modals').on('click','.addBtn button',function(){
			var i = $(this).parents('tr').siblings('tr').length+1;
			var editHtml = "<tr><td class='border'><div class='selectType'><i>菜单名称：</i><div class='divBox selector1p'><p>请选择</p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1' bindClass='sy'>首页</option><option value='data2' bindClass='zd'>分类</option><option value='data3' bindClass='fjdd'>附近的店</option><option value='data4' bindClass='wd'>我的</option><option value='data5' bindClass='shop'>商城</option><option value='data6' bindClass='collect'>收藏</option><option value='data7' bindClass='wtfk'>问题反馈</option></select></div></div><p class='zdyInput'><input type='text' class='menuName' placeholder='请输入菜单名称'><input type='text' class='ml10 menuUrl' placeholder='请输入链接地址'></p></td><td class='border' align='center'><button type='submit' name='submit' class='submitted deleteNav'>删除</button></td></tr>";
			if($(this).parents('tr').siblings('tr').length<5){
				$(this).parents('tbody').append(editHtml);	
			}else{
				alert('最多显示5条');
			}
					
		})
	
		$('.modals').on('click','.deleteNav',function(){
			var thisIndex = $(this).parents('tr').index()-1;
			$(this).parents('tr').remove();
			$('.navbottom-box ul li').eq(thisIndex).remove();
		})
	
		//iop切换
		function selectLiCspz(thisIndex){
			$('.selectLiCspz li').eq(thisIndex).addClass('cur').siblings('li').removeClass('cur');
		 
			$('.main-content1').eq(thisIndex).show().siblings('.main-content1').hide();
			 
			$('.ioptab').eq(thisIndex).show().siblings('.ioptab').hide();
		}
	
		$('.selectLiCspz li').click(function(){
			var thisIndex=$(this).index();
			 
			selectLiCspz(thisIndex);
		})
	
		//点击切换弹窗的tab
		function selectLi(thisIndex){
			$('.selectLi li').eq(thisIndex).addClass('cur').siblings('li').removeClass('cur');
		 
			$('.main-content').eq(thisIndex).show().siblings('.main-content').hide();
		}
	
		$('.selectLi li').click(function(){
			var thisIndex=$(this).index();
			selectLi(thisIndex);
		})
	
	  //图片上传
	   $('.modal').on("change",".file",function(e){
			$(this).prev('p').text(getImageUrl(this.files[0]));
			$(this).parents('td').find('.yulanImg img').prop('src',getImageUrl(this.files[0]));
	   });
	
	   //新轮播图上传trLj
	   $('.lbmodal').on("change",".file",function(e){
			$(this).parents('.intable').find(".trLj .lbtlj").val(getImageUrl(this.files[0]));
			$(this).parent('span').parent('td').find('.yulanImg img').prop('src',getImageUrl(this.files[0]));
		});
		
	 
	
	
		$('.cspzedit-layer .close1').click(function(e){//iop楼层关闭弹窗
			e.preventDefault();
			iopFadeOut();
			return false;
		});
	
		$('.cspzedit-layer .close2,.cspzedit-layer .qxjh').click(function(e){//聚合楼层关闭弹窗
			e.preventDefault();
			iopjhFadeOut();
			return false;
		});

		$('.cspzedit-layer .close2,.cspzedit-layer .qxjhPolicy').click(function(e){//取消选择策略
			e.preventDefault();
			selectionPolicy();
			return false;
		});
		
		// <!-- 2020-11-6 新增 视频 开始 -->
		$('.cspzedit-layer .close3,.cspzedit-layer .qxsp').click(function(e){//选择视频关闭弹窗
			e.preventDefault();
			iopjhFadeOut1();
			return false;
		});
		// <!-- 2020-11-6 新增 视频 结束 -->
		
		$('.edit-layer .close').click(function(e){//关闭弹窗
			e.preventDefault();
			fadeOut();
			$('#edit-layer #teAre').remove();
			return false;
		});
		$('.edit-layer2 .close,.edit-layer3 .close').click(function(e){
			e.preventDefault();
			fadeOut();
			return false;
		})
		var a = '';
		var that = '';
		
		//点击下拉框
		$('.modal').on('change','.selectType select',function(e){
			e.preventDefault();
			var checkText=$(this).find("option:selected").val(); 
			if(checkText=='zdyOption'){
				$(this).parents('td').find('.jumpType').show();
				$(this).parents('td').addClass('zdyTd').find('.zdyInput').show()
			}else{
				$(this).parents('td').find('.jumpType').hide();
				$(this).parents('td').removeClass('zdyTd').find('.zdyInput').hide();
			}
	
			$(this).parent().find("p").text($(this).find("option:selected").text());
		})
		
		$('.modal').on('click','.jumpType input[type="radio"]',function(e){
			//e.preventDefault();
			var thisValue=$(this).val();
			if(thisValue=='lj'){
				$(this).parents('dd').find('#ljInput').show();
				$(this).parents('dd').find('#ggInput,#jhyInput').hide();
			}else if(thisValue=='gg'){
				$(this).parents('dd').find('#ggInput').show();
				$(this).parents('dd').find('#ljInput,#jhyInput').hide();
			}else if(thisValue=='jhy'){
				$(this).parents('dd').find('#jhyInput').show();
				$(this).parents('dd').find('#ljInput,#ggInput').hide();
			}
		})
	
		//保存
		$('.modal').on('click','.css-edit button',function(e){
			e.preventDefault();
			var type = thisClickObj.data('type');
			//点击保存按钮时，判断时默认类型还是html类型
			if($('#resultCon').css("display") == 'block'){//默认
				if($('.selectP').css("display") == 'block'){
					var selectedVal = $('.selectP option:selected').val();
					that.parent().parent().find('.editing').attr('bind',selectedVal);
				}else{
					console.log('我是保存')
					var type = thisClickObj.data('type');
					if(type=="head"){//标题类型
						var imgSrc = $(this).parents('.modal').find('.title_url').eq(0).text(); 
						var selected = $(this).parents('.modal').find('.selectType select').find("option:selected").val(); 
						var linkHref = $(this).parents('.modal').find('.zdyInput input').val();
						$(thisClickObj).find('.ln-title-box img').eq(0).prop('src',imgSrc);
						$(thisClickObj).find('.ln-title-box a').eq(0).attr('bindType',selected)
						if(selected=='zdyOption'){ 
							$(thisClickObj).find('.ln-title-box a').eq(0).prop('href',linkHref);
						}else{
							$(thisClickObj).find('.ln-title-box a').eq(0).prop('href','javascript:void(0)');
						}
					}else if(type=="image"){//静态广告位
						var imgNum = $(thisClickObj).find('.myview .goodsImage').find('img').length;
						 var editHtmlImg = "";
						for(var i= 0 ;i<imgNum;i++){
							var imgSrc = $(this).parents('.modal').find('.title_url').eq(i).text();
							var linkHref = $(this).parents('.modal').find('.link_href').eq(i).val();
							var audioFile = $(this).parents('.modal').find('.audio_div audio').eq(i).attr("src");
							var ifshowAd = $(this).parents('.modal').find('input[name="ifzsyp"]:checked').eq(i).val();//是否展示音频
							var ifzy = $(this).parents('.modal').find('input[name="zysj"]:checked').eq(i).val();//是否展示音频
							
							
							$(thisClickObj).find('.goodsImage img').eq(i).prop('src',imgSrc);
							$(thisClickObj).find('.goodsImage a').eq(i).prop('href',linkHref);
							//  if(""==audioFile){
							// 	alert("请上传音频文件");
							// 	return;
							//  }
							$(thisClickObj).find('.myview .goodsImage .ifsad').eq(i).val(ifshowAd);//是否展示音频
							
							$(thisClickObj).find('.myview .goodsImage .zysj').eq(i).val(ifzy);//左上角右上角
							$(thisClickObj).find('.goodsImage .audio_btn audio').eq(i).attr('src',audioFile);
							if(ifshowAd=='1'){//展示
								$(thisClickObj).find('.goodsImage .audio_btn').eq(i).show();
								if(ifzy == '1'){//左上角
									$(thisClickObj).find('.goodsImage .audio_btn').css("left","2%");
									$(thisClickObj).find('.goodsImage .audio_btn').css("right","auto");
								}else{//右上角
									$(thisClickObj).find('.goodsImage .audio_btn').css("right","2%");
									$(thisClickObj).find('.goodsImage .audio_btn').css("left","auto");
								}
								
							}else{
								$(thisClickObj).find('.goodsImage .audio_btn').eq(i).hide();
								
							}
							//保存完之后默认加载音频
							
							// 2020-11-6 视频 新增 开始
							var audioFile = $(this).parents('.modal').find('.video_div video').eq(i).attr("src");
							var spshowAd = $(this).parents('.modal').find('input[name="spzsyp"]:checked').eq(i).val();//是否展示视频
							$(thisClickObj).find('.goodsImage .video_btn video').eq(i).attr('src',audioFile); 
							$(thisClickObj).find('.myview .goodsImage .spsad').eq(i).val(spshowAd);
							if(spshowAd=='1'){//展示
								$(thisClickObj).find('.goodsImage .play_btn').eq(i).show();
							}else{
								$(thisClickObj).find('.goodsImage .play_btn').eq(i).hide();
								$(thisClickObj).find('.goodsImage .video_btn').eq(i).hide();
								$(thisClickObj).find('.goodsImage .img_demo').eq(i).show();
							}
							// 2020-11-6 视频 新增 结束
							
						}
					}else if(type=="gallery"){//滚动菜单
						var imgNum = $(thisClickObj).find('.myview .swiper-slide').find('img').length;
						 var editHtmlImg = "";
						for(var i= 0 ;i<imgNum;i++){
							var imgSrc = $(this).parents('.modal').find('.title_url').eq(i).text();
							var linkHref = $(this).parents('.modal').find('.link_href').eq(i).val();
							var selected = $(this).parents('.modal').find('.selectType select').eq(i).find("option:selected").val(); 
							var selectedText = $(this).parents('.modal').find('.selectType').eq(i).find("p").text(); 
							$(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType',selected);
							if(selected=='zdyOption'){
								var aText = $(this).parents('.modal').find('td').eq(i).find('.menuName').val();
								var aUrl = $(this).parents('.modal').find('td').eq(i).find('.menuUrl').val();
								if(aText!=''||aUrl!=''){
									$(thisClickObj).find('.myview .swiper-slide').eq(i).find('p').text(aText);
									$(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').prop('href',aUrl);
								}else{
									$(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').prop('href','javascript:void(0)');
								}
							}else{
								$(thisClickObj).find('.navbottom-box li').eq(i).find('p').text(selectedText);
								$(thisClickObj).find('.myview .swiper-slide img').eq(i).prop('src',imgSrc);
								$(thisClickObj).find('.myview .swiper-slide a').eq(i).prop('href','javascript:void(0)');
							};
	
							var pText = $('.selector1p p').eq(i).text();
							switch(pText)
								{
									case '热销':
									$('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data1']").prop("selected",true);
									$(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data1')
									break;
									case '流量':
									$('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data2']").prop("selected",true);
									$(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data2')
									break;
									case '数字化':
									$('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data3']").prop("selected",true);
									$(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data3')
									break;
									case '校园':
									$('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data4']").prop("selected",true);
									$(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data4')
									break;
									case '应用下载':
									$('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data4']").prop("selected",true);
									$(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data5')
									break;
									case '终端':
									$('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data4']").prop("selected",true);
									$(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data6')
									break;
								}
						}
						
					}else if(type=="bottomNav"){
						var selectLength = $(this).parents('.modals').find('#htmlCon select').length;
						var liHtml='';
						for(var i=0;i<selectLength;i++){
							var selected = $(this).parents('.modal').find('.selectType').eq(i).find(" select option:selected").val(); 
							var classname = $(this).parents('.modal').find('.selectType').eq(i).find(" select option:selected").attr('bindclass');
							var selectedText = $(this).parents('.modal').find('.selectType').eq(i).find("p").text(); 
							 liHtml += "<li class='"+classname+"'><a href='javascript:void(0)' bindType="+selected+">"+selectedText+"</a></li>";
							$('.navbottom-box ul').html(liHtml);
							$(thisClickObj).find('.navbottom-box li').eq(i).find('a').attr('bindType',selected);
							if(selected=='zdyOption'){
								var aText = $(this).parents('.modal').find('td').eq(i).find('.menuName').val();
								var aUrl = $(this).parents('.modal').find('td').eq(i).find('.menuUrl').val();
								if(aText!=''||aUrl!=''){
									$(thisClickObj).find('.navbottom-box li').eq(i).attr('class','myzdy');
									$(thisClickObj).find('.navbottom-box li').eq(i).find('a').text(aText);
									$(thisClickObj).find('.navbottom-box li').eq(i).find('a').prop('href',aUrl);
								}else{
									$(thisClickObj).find('.navbottom-box li').eq(i).find('a').prop('href','javascript:void(0)');
								}
							}else{
								$(thisClickObj).find('.navbottom-box li').eq(i).find('a').text(selectedText);
								$(thisClickObj).find('.navbottom-box li').eq(i).find('a').prop('href','javascript:void(0)');
								$(thisClickObj).find('.navbottom-box li').eq(i).prop('class',classname);
							} 
							 
						}
						
						var linkHref = $(this).parents('.modal').find('.zdyInput input').val();
						
					}else if(type=="newConvenient"){
						// 表格top数据渲染轮播图
						var topHtmlYa = `<div class="newConvenTop"><div class="swiper-wrapper" id="">`
						var swiperUpDown = []
						$('#tableByIdYa2 tbody tr').each(function(j){
							if($(this).find('.tabTdItem').length>1){
								let tempTab = $(this)
								console.log(tempTab.find('.tabTdItem').length,'a')
								swiperUpDown.push('swiperNewCon'+j)
								tempTab.find('.tabTdItem').each(function(i){
									let money = $(this).find('.unitBlockInput input').val(),aM='0',bM='',cM='',dM='';
									if($(this).find('.newConSelectYa option:selected').val() == '2'){
										cM = 'rechargeFlag'
										dM = '<img src="./images/20231030/4.png" alt="">'
										if(money.indexOf('.') != -1){
											aM = money.split('.')[0]
											bM = '.'+money.split('.')[1]
										}else{
											aM = money
										}
									}
									console.log(money,aM,bM,'钱')
									if(i == 0){
										topHtmlYa+=`<div class="swiper-slide swiperNewConYa" id="swiperNewCon${j}">
											<div class="swiper-wrapper">
												<div class="swiper-slide">
													<div class="newConTop" dataUrl="" dataText="" dataCode="">
														<div class="${cM}"><span>${aM}<b>${bM}</b></span><span>元</span>${dM}</div>
														<div dataType="${$(this).find('.newConSelectYa option:selected').val()}">${$(this).find('.bmBlockName').val()}</div>
													</div>
												</div>`
									}else if(i == tempTab.find('.tabTdItem').length-1){
										topHtmlYa += `<div class="swiper-slide">
														<div class="newConTop" dataUrl="" dataText="" dataCode="">
														<div class="${cM}"><span>${aM}<b>${bM}</b></span><span>元</span>${dM}</div>
														<div dataType="${$(this).find('.newConSelectYa option:selected').val()}">${$(this).find('.bmBlockName').val()}</div>
														</div>
													</div>
												</div>
											</div>`
									}else{
										topHtmlYa+=`<div class="swiper-slide">
														<div class="newConTop" dataUrl="" dataText="" dataCode="">
														<div class="${cM}"><span>${aM}<b>${bM}</b></span><span>元</span>${dM}</div>
														<div dataType="${$(this).find('.newConSelectYa option:selected').val()}">${$(this).find('.bmBlockName').val()}</div>
														</div>
													</div>`
									}
								})
							}else{
								let money = $(this).find('.unitBlockInput input').val(),aM='0',bM='',cM='',dM='';
								if($(this).find('.newConSelectYa option:selected').val() == '2'){
									cM = 'rechargeFlag'
									dM = '<img src="./images/20231030/4.png" alt="">'
									if(money.indexOf('.') != -1){
										aM = money.split('.')[0]
										bM = '.'+money.split('.')[1]
									}else{
										aM = money
									}
								}
								console.log(money,aM,bM,'钱')
								topHtmlYa+=`<div class="swiper-slide">
												<div class="newConTop" dataUrl="" dataText="" dataCode="">
												<div class="${cM}"><span>${aM}<b>${bM}</b></span><span>元</span>${dM}</div>
													<div dataType="${$(this).find('.newConSelectYa option:selected').val()}">${$(this).find('.tabTdItem').find('.bmBlockName').val()}</div>
												</div>
											</div>`
							}
						})
						topHtmlYa+=`</div></div>`
						// 表格bottom数据渲染轮播图
						var bottomHtmlYa = `<div class="newConvenBottom"><div class="swiper-wrapper" id="">`
						$('#tableByIdYa3 tbody tr').each(function(){
							bottomHtmlYa+=`<div class="swiper-slide">
								<img class="itemImg" src="./images/20231030/1.png" alt="" dataUrl="" dataText="" dataCode="">
							</div>`
						})
						bottomHtmlYa+=`</div></div>`
						$('.demo .backBlockNc').html('').append(topHtmlYa+bottomHtmlYa)
						if($('input[name=newConFlagYa]:checked').val() == '1'){
							$('.demo .backBlockNc').css({
								'background': "none",
								'background-color': $('#backColorNewConYa').val(),
								'border-radius': Number($('.backRadius').val())/200+'rem',
							})
						}else{
							$('.demo .backBlockNc').css({
								'background': "url('"+$('.newConBackImgYa').attr("src")+"') no-repeat",
								"background-size":"100% 100%",
								'border-radius': Number($('.backRadius').val())/200+'rem',
							})
						}
						$('.demo .newConvenientBlock').css({
							'padding-left': Number($('.backPadding').val())/200+'rem',
							'padding-right': Number($('.backPadding').val())/200+'rem',
						}).children('.backBlockNc').attr({
							'dataPadding':Number($('.backPadding').val()),
							'dataRadius':Number($('.backRadius').val()),
							'dataBack':$('#backColorNewConYa').val(),
							'dataBackImg':$('.newConBackImgYa').attr("src"),
							'dataBackType':$('input[name=newConFlagYa]:checked').val(),
						})
						var onePerView = 4,twoPerView = 3
						if($('#tableByIdYa2 tbody tr').length>4){
							onePerView = 3.5
						}else if($('#tableByIdYa2 tbody tr').length==3){
							onePerView = 3
						}
						if($('#tableByIdYa3 tbody tr').length==2){
							twoPerView = 2
						}
						newConSwiperOne = new Swiper('.newConvenTop', {
							slidesPerView: onePerView,
							freeMode: true,
							observer: true, 
							observeParents: true, //监测Swiper 的祖/父元素 
							autoplayDisableOnInteraction: false
						});
						newConSwiperTwo = new Swiper('.newConvenBottom', {
							slidesPerView: twoPerView,
							spaceBetween: 10,
							freeMode: true,
							observer: true, 
							observeParents: true, //监测Swiper 的祖/父元素 
							autoplayDisableOnInteraction: false
						});
						$('.swiperNewConYa').each(function(i){
							console.log(swiperUpDown,'#'+swiperUpDown[i],i)
							new Swiper('#'+swiperUpDown[i], {
								direction: "vertical",
								loop: true, //是否可循环
								autoplay: 3000,//可选选项，自动滑动
								autoplayDisableOnInteraction: false,
							});
						})
					}else if(type=="classification"){
						$('.demo .classificationBlock').attr({
							"iop": $('input[name=isOpenIopCf]:checked').val(),
							"name": $('input[name=isViewNameCf]:checked').val(),
							"sell": $('input[name=isOpenSellCf]:checked').val(),
							"colu": $('input[name=adViewColuCf]:checked').val(),
							"type": $('.chooseTypeCf option:selected').val(),
						})
						if($('input[name=adViewColuCf]:checked').val() == '2'){
							$('.demo .classificationBlock .itemCfList').removeClass('yiCf').addClass('erCf')
						}else if($('input[name=adViewColuCf]:checked').val() == '1'){
							$('.demo .classificationBlock .itemCfList').removeClass('erCf').addClass('yiCf')
						}else{
							$('.demo .classificationBlock .itemCfList').removeClass('erCf yiCf')
						}
						if($('input[name=isViewNameCf]:checked').val() == '0'){
							$('.demo .classificationBlock .itemCfList').addClass('noName')
							$('.demo .classificationBlock .rightCfItem').addClass('mb40')
						}else{
							$('.demo .classificationBlock .itemCfList').removeClass('noName')
							$('.demo .classificationBlock .rightCfItem').removeClass('mb40')
						}
					}else if(type == 'newBusinessRecommend'){
						// 数据存储
						$('.demo .newBusinessRecommendBlock').attr('maxNum',$('.nbrInputMaxNum').val())
						$('.demo .newBusinessRecommendBlock').attr('type',$('input[name=tjType]:checked').val())
						let imgS = '<img class="nbrExample" src="images/demo.jpg" alt="">',imgS2 = ''
						let imgSs = '',imgSs2 = ''
						//从小到大排序
						var arr = [];
						$('#tableByIdYaNbr tbody').find('tr').each(function(i){
							if($(this).find('.nbrZsqz').val()){
								arr.push(parseInt($(this).find('.nbrZsqz').val()))
							}else{// 没填写权重
								imgS2 += `<div class="nbrImgFa none"
											qz="${$(this).find('.nbrZsqz').val()}" 
											url="${$(this).find('.tzdzNbr').val()}" 
											chbm="${$(this).find('.chbmYa').val()}" 
											clbm="${$(this).find('.clbmmNbr').val()}"
											kssj="${$(this).find('.kssjNbr').val()}"
											jssj="${$(this).find('.jssjNbr').val()}"
											dwmc="${$(this).find('.dwmcNbr').val()}"
											dwbm="${$(this).find('.dwbmNbr').val()}">
									<img class="itemImg" src="${$(this).find('.imgPerview').attr('src')}" alt="">
								</div>`
							}
						})
						$('#tableByIdYaNbr2 tbody').find('tr').each(function(i){
							if($(this).find('.nbrZsqz').val()){
								arr.push(parseInt($(this).find('.nbrZsqz').val()))
							}else{// 没填写权重
								imgSs2 += `<div class="nbrBwImgFa none"
											qz="${$(this).find('.nbrZsqz').val()}" 
											url="${$(this).find('.tzdzNbr').val()}" 
											chbm="${$(this).find('.chbmYa').val()}" 
											clbm="${$(this).find('.clbmmNbr').val()}"
											kssj="${$(this).find('.kssjNbr').val()}"
											jssj="${$(this).find('.jssjNbr').val()}"
											dwmc="${$(this).find('.dwmcNbr').val()}"
											dwbm="${$(this).find('.dwbmNbr').val()}">
									<img class="itemImg" src="${$(this).find('.imgPerview').attr('src')}" alt="">
								</div>`
							}
						})
						// 排序方法
						function BubbleSort(arr){
						    var i,j,temp;
						    var flag=true;     //flag进行标记
						    for(i=0;i<arr.length-1&&flag;i++){  //若flag为false则退出循环
						        flag=false;    //初始化为false
						        for(j=arr.length-1;j>i;j--){
						            if(arr[j]<arr[j-1]){ //j为从前往后循环
						              temp=arr[j-1];
						                arr[j-1]=arr[j];
						                arr[j]=temp;
										flag=true; //如果有数据交换则为true
									}
								}
							}
							return arr.reverse();
						}
						let aaa = BubbleSort(arr)
						// 排序并渲染
						for(i=0;i<aaa.length;i++){
							$('#tableByIdYaNbr tbody').find('tr').each(function(){
								if($(this).find('.nbrZsqz').val()){
									if(parseInt($(this).find('.nbrZsqz').val()) == aaa[i]){
										imgS += `<div class="nbrImgFa none" 
											qz="${$(this).find('.nbrZsqz').val()}" 
											url="${$(this).find('.tzdzNbr').val()}" 
											chbm="${$(this).find('.chbmYa').val()}" chbmNbr chbmYa
											clbm="${$(this).find('.clbmmNbr').val()}"
											kssj="${$(this).find('.kssjNbr').val()}"
											jssj="${$(this).find('.jssjNbr').val()}"
											dwmc="${$(this).find('.dwmcNbr').val()}"
											dwbm="${$(this).find('.dwbmNbr').val()}">
											<img class="itemImg" src="${$(this).find('.imgPerview').attr('src')}" alt="">
										</div>`
									}
								}
							})
							$('#tableByIdYaNbr2 tbody').find('tr').each(function(){
								if($(this).find('.nbrZsqz').val()){
									if(parseInt($(this).find('.nbrZsqz').val()) == aaa[i]){
										imgSs += `<div class="nbrBwImgFa none" 
											qz="${$(this).find('.nbrZsqz').val()}" 
											url="${$(this).find('.tzdzNbr').val()}" 
											chbm="${$(this).find('.chbmYa').val()}" 
											clbm="${$(this).find('.clbmmNbr').val()}"
											kssj="${$(this).find('.kssjNbr').val()}"
											jssj="${$(this).find('.jssjNbr').val()}"
											dwmc="${$(this).find('.dwmcNbr').val()}"
											dwbm="${$(this).find('.dwbmNbr').val()}">
											<img class="itemImg" src="${$(this).find('.imgPerview').attr('src')}" alt="">
										</div>`
									}
								}
							})
						}
						$('.demo .newBusinessRecommendBlock').html('').append(imgS+imgS2+imgSs+imgSs2)
					}else if(type == "hotZoneImages"){ //20240227-热区图片
						let flag = true
						let swiperHtml = '<div class="hotZiPart"><div class="swiper-wrapper" id="">'
						$('#hotZoneImagesTable tr').each(function(i){
							let src = $(this).find('.uploadImgFa img')
							if(src.hasClass('noUploadImg')){
								flag = false
								alert('请上传热区图片')
								return false
							}else{
								json = ``
								if($(this).find('.uploadImgBox').attr("json")){
									json = `json='${$(this).find('.uploadImgBox').attr("json")}'`
								}
								swiperHtml += `<div class="swiper-slide" ${json}><img src="${src.attr("src")}" alt=""></div>`
							}
						})
						if(!flag) return
						swiperHtml += '</div><div class="swiper-pagination"></div></div>'
						$('.demo .hotZoneImagesBlock').empty().append(swiperHtml)
						let flag1 = true
						if($('#hotZoneImagesTable tr').length == 1){
							flag1 = false
						}
						hotZoneImgSwiper = new Swiper('.demo .hotZiPart', {
							pagination : flag1?'.swiper-pagination':'',
							loop: false, //是否可循环
							observer: true, 
							observeParents: true, //监测Swiper 的祖/父元素 
							autoplayDisableOnInteraction: false,
						});
					}else if(type == "packageCoupon"){ //20240304-套餐权益券
						if($(".pcTableMsg .pcBackImg").hasClass("noUploadImg")){
							alert('请上传背景图')
							return
						}
						if(!$(".pcTableMsg .pctitle").val()){
							alert('请填写标题')
							return
						}
						if($(".pcTableMsg .pcBtnImg").hasClass("noUploadImg")){
							alert('请上传按钮图')
							return
						}
						if(!$(".pcTableMsg .pcBtnHref").val()){
							alert('请输入按钮图链接地址或选择')
							return
						}
						if(!$(".pcTableMsg .pcCode").val() && $('input[name=tjTypePc]:checked').val() != '1'){
							alert('请填写策划编码')
							return
						}
						$('.demo .packageCouponPart').attr({
							"lHref": $('.pcIllustrateHref').val(),
							"rHref": $('.pcBtnHref').val(),
							"code": $('input[name=tjTypePc]:checked').val()!='1'?$(".pcTableMsg .pcCode").val():'',
							"type": $('input[name=tjTypePc]:checked').val(),
						}).css("background-image","url("+$('.pcBackImg').attr("src")+")")
						$('.demo .leftPcPart>span:nth-child(2)').html($('.pctitle').val())
						$('.leftPcPart>span:nth-child(2)').css('color',$('.pcTitleColor').val())
						$('.leftPcPart>span:nth-child(1)').css('color',$('.pcParamColor').val())
						if(!$('.pcIllustrateImg').hasClass("noUploadImg")){
							$('.leftPcPart>img').attr("src",$('.pcIllustrateImg').attr("src")).removeClass('none')
						}else{
							$('.leftPcPart>img').attr("src","").addClass('none')
						}
						$('.rightPcPart>img').attr("src",$('.pcBtnImg').attr("src"))
					}else if(type=="operationalRecommend"){
						if($('input[name=newTitleFlag]:checked').val() == '1'){
							$('.demo .containerwxRec .flsxe .tjzqSty').html($('.backTyptitleValue').val())
							$('.demo .containerwxRec .flsxe .tjzqis').addClass('none')
							$('.demo .containerwxRec .flsxe .tjzqSty').removeClass('none')
						}else{
							$('.demo .containerwxRec .flsxe .tjzqis img').attr("src", $('.backTypImg .uploadImg').find('.imgPerview').attr("src"));
							$('.demo .containerwxRec .flsxe .tjzqis').removeClass('none')
							$('.demo .containerwxRec .flsxe .tjzqSty').addClass('none')

						}

						if($('.newContentPb option:selected').val() == '1'){ //居左距离
							$(".demo .containerwxRec .flsxe .tjzqis").css({
							'margin-left': Number($('.backleftPadding').val())/200+'rem',

							})
							$(".demo .containerwxRec .flsxe").css({
								'align-items':'flex-start'
								})
						 }else{
							$(".demo .containerwxRec .flsxe").css({
								'align-items':'center'
							})   
						  }


						  if($('.newConStepper option:selected').val() == '1'){ //内容布局限制行数
							if($(".backStepper .countNum").text() == "1"){
								$(".demo .containerwxRec .flesx").html(`<div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
					  
							  </div>
							  <div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon2.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds </div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
					  
							  </div>`)

							} else if($(".backStepper .countNum").text() == "2"){
								$(".demo .containerwxRec .flesx").html(`<div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
					  
							  </div>
							  <div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon2.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds </div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
					  
							  </div>
					  
							  <div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon3.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
							  </div>
							  <div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon4.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
					  
							  </div>`)

							}else if($(".backStepper .countNum").text() == "3"){
								$(".demo .containerwxRec .flesx").html(`<div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
					  
							  </div>
							  <div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon2.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds </div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
					  
							  </div>
					  
							  <div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon3.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
							  </div>
							  <div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon4.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
					  
							  </div>
							  <div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon5.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
							  </div>
							  <div  class="clumFles">
								<div><img src="./images/recomZone/ystpIcon6.png" alt=""></div>
								<div class="textCont">HUAWEI FreeBuds</div>
					  
								<div class="jeMont">
								  <div class="nowpric">￥4438</div>
								  <div class="yspric">￥4988</div>
								</div>
					  
					  
							  </div>`)
								
							}
						
						 }else{
							$(".demo .containerwxRec .flesx").html(`<div  class="clumFles">
							<div><img src="./images/recomZone/ystpIcon.png" alt=""></div>
							<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
				  
							<div class="jeMont">
							  <div class="nowpric">￥4438</div>
							  <div class="yspric">￥4988</div>
							</div>
				  
				  
						  </div>
						  <div  class="clumFles">
							<div><img src="./images/recomZone/ystpIcon2.png" alt=""></div>
							<div class="textCont">HUAWEI FreeBuds </div>
				  
							<div class="jeMont">
							  <div class="nowpric">￥4438</div>
							  <div class="yspric">￥4988</div>
							</div>
				  
				  
						  </div>
				  
						  <div  class="clumFles">
							<div><img src="./images/recomZone/ystpIcon3.png" alt=""></div>
							<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
				  
							<div class="jeMont">
							  <div class="nowpric">￥4438</div>
							  <div class="yspric">￥4988</div>
							</div>
				  
						  </div>
						  <div  class="clumFles">
							<div><img src="./images/recomZone/ystpIcon4.png" alt=""></div>
							<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
				  
							<div class="jeMont">
							  <div class="nowpric">￥4438</div>
							  <div class="yspric">￥4988</div>
							</div>
				  
				  
						  </div>
						  <div  class="clumFles">
							<div><img src="./images/recomZone/ystpIcon5.png" alt=""></div>
							<div class="textCont">HUAWEI FreeBuds 文案超出一行</div>
				  
							<div class="jeMont">
							  <div class="nowpric">￥4438</div>
							  <div class="yspric">￥4988</div>
							</div>
				  
						  </div>
						  <div  class="clumFles">
							<div><img src="./images/recomZone/ystpIcon6.png" alt=""></div>
							<div class="textCont">HUAWEI FreeBuds</div>
				  
							<div class="jeMont">
							  <div class="nowpric">￥4438</div>
							  <div class="yspric">￥4988</div>
							</div>
				  
				  
						  </div>`)
						 
						  }

				
						
					      //背景类型选择
						if($('input[name=titleConFlagYa]:checked').val() == '1'){
							// $('.demo .heBoty .flesx .clumFles').css({
							// 	'background': "none",
							// 	'background-color': $('#backTitleConColorId').val(),
							// })
							$('.demo .containerwxRec').css({
								'background': "none",
								'background-color': $('#backTitleConColorId').val(),
							})
						}else{
							// $('.demo .heBoty .flesx .clumFles').css({
							// 	'background': "url('"+$('.backTypeTitleConImg .uploadImg').find('.imgPerview').attr("src")+"') no-repeat",
							// 	"background-size":"100% 100%",
							// })
							$('.demo .containerwxRec').css({
								'background': "url('"+$('.backTypeTitleConImg .uploadImg').find('.imgPerview').attr("src")+"') no-repeat",
								"background-size":"100% 100%",
							})
						}
						var selectedValue =[];
						$("#listRpc tr").each(function() {
							var columns = $(this).find("td .strategyName");
							var nameValule = columns.val()
							selectedValue.push(nameValule);
							});


						$('.demo .containerwxRec').css({
						}).children('.backBlockOperational').attr({
							'dataLeftPadding':Number($('.backleftPadding').val()),
							'dataTitlePb':$('.newContentPb').val(),
							'datatitileText':$('.backTyptitleValue').val(),
							'dataContTitleImg':$('.backTypImg .uploadImg').find('.imgPerview').attr("src"),
							'dataTitleType':$('input[name=newTitleFlag]:checked').val(),
							'dataContBackg':$('#backTitleConColorId').val(),
							'dataContBackgImg':$('.backTypeTitleConImg .uploadImg').find('.imgPerview').attr("src"),
							'dataContentBackgType':$('input[name=titleConFlagYa]:checked').val(),
							'dataNumberRows':$(".backStepper .countNum").text(),
							'dataContentBj':$(".newConStepper").val(),
							'dataSelectedValue':JSON.stringify(selectedValue),

							

						})

						$("#myTable").find("tr").each(function() {
							var columns = $(this).find("td");
							var name = columns.eq(0).text();
							var age = columns.eq(1).text();
							var city = columns.eq(2).text();
							console.log(name + " " + age + " " + city);
							});
					
				
					}
			
				}
			}else if($('#htmlCon2').css("display") == 'block'){//html
				a.html("");
				a = a.append($(this).parents().find("textarea").val());
				that.parent().parent().append(a);
			};
			$('#htmlCon2 #teAre').remove();
			
			fadeOut();
			return false;
		});
	
		//iop楼层推荐弹窗中的继续添加拼串
		var jxtjData1 ="<tr class='clxqq'> <td><input type='checkbox'></td> <td></td> <td> <div> <dl> <dt>策划ID:</dt> <dd> <input type='text' placeholder='请输入策划ID'> <span>注：输入ID请用英文,分隔</span> </dd> </dl> </div> <div> <dl> <dt>图片:</dt> <dd> <div class='uploadImg normalData'> <img src='../img/images.png' alt='' class='imagesZw'> <img src='' alt='' class='imgPerview'> <p class='opacityP'>上传图片</p> <input type='file' class='imgInput'> </div> <span>注：请上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span> </dd> </dl> </div> <div> <dl> <dt>图片:</dt> <dd> <input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'> <span class='jhsp'  >选择广告/聚合页</span> </dd> </dl> </div> <div> <dl> <dt>展示权重:</dt> <dd> <input type='text' placeholder='请输入所占权重1~100，数值越小排位越靠前'> </dd> </dl> </div> <div> <dl> <dt>有效时间:</dt> <dd class='yxsjdd'> <input id='startTime0' name='startTime0' readonly='readonly' class='Wdate w150'  onclick=\"WdatePicker({maxDate:\'#F{$dp.$D(\\\'endTime0\\\')}\',dateFmt:\'yyyy-MM-dd\'})\" value='' /> ~ <input id='endTime0' name='endTime0' readonly='readonly' class='Wdate w150' onclick=\"WdatePicker({minDate:\'#F{$dp.$D(\\\'startTime0\\\')}\',dateFmt:\'yyyy-MM-dd\'})\"  value='' /></dd> </dl> </div> </td> </tr>";
		var jxtjData2 ="<tr class='clxqq'> <td><input type='checkbox'></td> <td></td> <td>  <div> <dl> <dt>图片:</dt> <dd> <div class='uploadImg normalData'> <img src='../img/images.png' alt='' class='imagesZw'> <img src='' alt='' class='imgPerview'> <p class='opacityP'>上传图片</p> <input type='file' class='imgInput'> </div> <span>注：请上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span> </dd> </dl> </div> <div> <dl> <dt>图片:</dt> <dd> <input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'> <span class='jhsp'  >选择广告/聚合页</span> </dd> </dl> </div> <div> <dl> <dt>展示权重:</dt> <dd> <input type='text' placeholder='请输入所占权重1~100，数值越小排位越靠前'> </dd> </dl> </div> <div> <dl> <dt>有效时间:</dt> <dd class='yxsjdd'> <input id='startTime01' name='startTime01' readonly='readonly' class='Wdate w150'  onclick=\"WdatePicker({maxDate:\'#F{$dp.$D(\\\'endTime01\\\')}\',dateFmt:\'yyyy-MM-dd\'})\" value='' /> ~ <input id='endTime01' name='endTime01' readonly='readonly' class='Wdate w150' onclick=\"WdatePicker({minDate:\'#F{$dp.$D(\\\'startTime01\\\')}\',dateFmt:\'yyyy-MM-dd\'})\"  value='' /></dd> </dl> </div> </td> </tr>";
	
		//选择继续添加
		$('.modals_cspz').on('click','.iop-edit1 .jxtj:radio',function(e){   
			 var $radio = $(this);
				if ($radio.data('waschecked') == true){//取消继续添加 
					$radio.prop('checked', false); 
					$radio.data('waschecked', false);
					
				}  else {
					$radio.prop('checked', true);
					$radio.data('waschecked', true); 
					var a = $("#htmlConCspz .cont_box").find("table tbody tr:first-child").clone();
	
					var ntable = $("#htmlConCspz .cont_box table tbody").append(a);
					var ntr = ntable.children("tr");
					$.each(ntr,function(i,eleName){//遍历tr
						i++;
						$(eleName).children("td:nth-child(2)").text(i)
					}); 
				}
		  });
	
		//iop保存
		$('.cspzedit-layer').on('click','.saven',function(e){ 
			//点击保存之前需要判断是否点击了继续添加按钮  
			toast("保存成功");//改成小黑窗
			// iopFadeOut();//点击保存提示保存成功并关闭当前弹窗 
			 
	
	
		});
	
		//选择继续添加
		$('.modals_cspz').on('click','.iop-editbw .jxtj:radio',function(e){   
			var $radio1 = $(this);
				if ($radio1.data('waschecked') == true){//取消继续添加 
					$radio1.prop('checked', false); 
					$radio1.data('waschecked', false); 
					
				} 
				else {
					$radio1.prop('checked', true);
					$radio1.data('waschecked', true); 
					var a = $("#htmlConCspz2 .cont_box").find("table tbody tr:first-child").clone();
					$("#htmlConCspz2 .cont_box table tbody").append(a); 
					var ntable = $("#htmlConCspz2 .cont_box table tbody").append(a);
					var ntr = ntable.children("tr");
					$.each(ntr,function(i,eleName){//遍历tr
						i++;
						$(eleName).attr("id","policy"+i);
						$(eleName).children("td:nth-child(2)").text(i)
					});
				}
		  });
	
		//iop补位保存
		 
		
	
	
		//iop批量删除
		$('.cspzedit-layer').on('click','.iop-edit1 .alldel',function(e){
			var xzcd = $("#htmlConCspz .cont_box").find("table tbody").children("tr");
			var xzin = $("#htmlConCspz .cont_box").find("table tbody").children("tr").children("td:first-child").children("input:checked");//遍历tr
			var ii=0;
		 
			$.each(xzin,function(i,eleName){//遍历选中的个数删除
				var deldata = $(this).parents("tr");//获取选中input
				ii++;
				$(deldata).remove();
				 
			});  
	 
			if(xzcd.length == ii){//遍历tr总个数与删除的个数相同说明已全部删除
				console.log("全部删除");
				$("#htmlConCspz .cont_box").find("table tbody").append(jxtjData1);
			} else{
				console.log("没有全部删除");
			}
			
		});
	
		//iop批量删除补位
		$('.cspzedit-layer').on('click','.iop-editbw .alldel',function(e){
			var xzcd = $("#htmlConCspz2 .cont_box").find("table tbody").children("tr");
			var xzin = $("#htmlConCspz2 .cont_box").find("table tbody").children("tr").children("td:first-child").children("input:checked");//遍历tr
			var ii=0;
		 
			$.each(xzin,function(i,eleName){//遍历选中的个数删除
				var deldata = $(this).parents("tr");//获取选中input 
				ii++;
				$(deldata).remove();
				 
			});  
	 
			if(xzcd.length == ii){//遍历tr总个数与删除的个数相同说明已全部删除 
				$("#htmlConCspz2 .cont_box").find("table tbody").append(jxtjData2);
			} else{ 
			}
		});
	
		$('.cspzedit-layer .savejh').click(function(e){//聚合楼层关闭弹窗
			e.preventDefault();
			iopjhFadeOut();
			 
		});

		$('.cspzedit-layer .savePolicy').click(function(e){//聚合楼层关闭弹窗
			e.preventDefault();
			selectionPolicy();
			checkboxFun()
		
		});
		
	
		$(".main-content").on("click",".allCheckbox",function() {//全选按钮执行  
			if (this.checked) {//选中后设置所有全选 
				$(this).parents(".ch_tips").children(".mytablebox").find(":checkbox").prop("checked", true); 
	
			} else {//反之不全选  
				$(this).parents(".ch_tips").children(".mytablebox").find(":checkbox").prop("checked", false); 
			}
		});
	
		//设置全选复选框 
		$(".main-content").on("click",".mytablebox :checkbox",function() {//全选按钮执行 
			if (!$(this).hasClass("allCheckbox")) {//非全选按钮判断
			 
				allchk($(this));
			} 
		});
	
		//设置全选复选框
		function allchk(a) {
			var chknum = $(a).parents(".ch_tips").find(":checkbox:not('.allCheckbox')").length; //总个数
			
			var chk = $(a).parents(".ch_tips").find(":checkbox:not('.allCheckbox'):checked").length;//已选中的个数
			 
			if (chknum == chk) { //全选
				 
				$(a).parents(".ch_tips").find(".allCheckbox").prop("checked", true); 
			} else { //不全选 
				$(a).parents(".ch_tips").find(".allCheckbox").prop("checked", false);
				 
			}
		}
	 
	
	
		//所有元素的拖拽编辑隐藏等展示
		$('.edit .demo')
			.on('mouseover',selector,function(e){
				e.stopPropagation();
				$(this).children('.ctrl-btns').addClass('show');
				$('.leftlableYa').removeClass('none').css('top',$(this).offset().top)
				if($(this).hasClass('box')){
					var lyrowName = ''
					$(this).parents('.lyrow').each(function(i){
						if(i == 0){
							lyrowName+=$(this).children('.preview').text()
						}else{
							lyrowName=$(this).children('.preview').text()+' / '+lyrowName
						}
					})
					$('.leftlableYa').text($(this).parents('.bigFloor').children('.preview').text()+' / '+lyrowName+' / '+$(this).children('.preview').text()).show()
				}else if($(this).hasClass('lyrow')){
					var lyrowName2 = $(this).children('.preview').text()
					if($(this).parents('.lyrow').length>0){
						$(this).parents('.lyrow').each(function(i){
							lyrowName2 = $(this).children('.preview').text()+' / ' + lyrowName2
						})

					}
					console.log(lyrowName2,'lyrowName2')
					$('.leftlableYa').text($(this).parents('.bigFloor').children('.preview').text()+' / '+lyrowName2).show()
				}else if($(this).hasClass('bigFloor')){
					$('.leftlableYa').text($(this).children('.preview').text()).show()
				}
			})
			.on('mouseleave',selector,function(){
				$(this).children('.ctrl-btns').removeClass('show');
				if($(this).hasClass('box') || $(this).hasClass('lyrow') || $(this).hasClass('bigFloor')){
					$('.leftlableYa').text('').hide()
				}
			})
			.on('mouseout',selector,function(){
				$(this).children('.ctrl-btns').removeClass('show');
				if($(this).hasClass('box') || $(this).hasClass('lyrow') || $(this).hasClass('bigFloor')){
					$('.leftlableYa').text('').hide()
				}
			});
	
		//tab楼层配置展示
		$('.edit .demo')
			.on('mouseover',selector,function(e){
				e.stopPropagation();
				$(this).children('.ctrl-btnstb').addClass('show');
			})
			.on('mouseleave',selector,function(){
				$(this).children('.ctrl-btnstb').removeClass('show');
			})
			.on('mouseout',selector,function(){
				$(this).children('.ctrl-btnstb').removeClass('show');
			});
	
		
		/*
		**顶部操作按钮
		**编辑-预览-清空-保存
		*/
		var topBtns=$('.file-btns'),
			cN={e:'edit',sp:'source-preview',ac:'active'};
		function uiAlt(e){
			var data=e.data,
				ac=cN.ac,
				x=(data.cN1===cN.sp)? 1:0;
			e.preventDefault();
			topBtns.find('.active').removeClass(ac);
			$(this).addClass(ac);
			x && body.removeClass(data.cN1).addClass(data.cN2);
			sideBar.animate({left:data.lv},180,function(){
				!x && body.removeClass(data.cN1).addClass(data.cN2); 
				reSlide(demo,1);
			});
			hideHTml();
			return false;		
		};
		function showHTml(e){//点击预览，获得处理后的html
			var demoHtml = $('.demo').html();
			var copyHtml = $('#copyHtml').html(demoHtml);
			$(copyHtml).find('.lyrow').removeClass('ui-draggable');
			$(copyHtml).find('.preview,.ctrl-btns').remove(); 
			
		};
		function hideHTml(e){//点击预览，获得处理后的html
			$('#copyHtml').html('')
		};
	   
	 
		//保存方案
		function saveLayout(){
			//这里的htmlData内容应该带着data-src
			//保存的时候取出来htmlData
		  
			var data = htmlData,
				len=data.step.length,
				count=data.count,
				n; 
			if (len>count) {
				n=len-count;
				data.step.splice(count+1,len-count+1)
			};
			data['css']=$('#css-wrap').text();
			 
			if (supportstorage()) {
				localStorage.setItem("htmlData",JSON.stringify(data));
			} 
		 
			$("#savehtml").html($('#doc-wrap .demo').html())
			setDatasrc();//保存后设置页面html后赋值给要保存的html

		}
		$('#edit').on('click',{cN1:cN.sp,cN2:cN.e,lv:0},uiAlt);
		$('#preview').on('click',{cN1:cN.e,cN2:cN.sp,lv:-100},uiAlt);
	
		$('#preview').on('click',function(e){
			e.preventDefault();
			showHTml(e);
			$('#doc-wrap2').show();
			$('#doc-wrap').hide();
			
		});
	
		
		$('#clean-up').on('click',function(e){
			e.preventDefault();
			demo.empty();
			htmlData={count:0,step:[demo.html()]}
			hideHTml();
		});
		$('#save').on('click',function(e){
			e.preventDefault();
			saveLayout();
			console.log('保存成功')
		});
		//增加元素
		$('#addMenu').click(function(e){
			e.preventDefault();
		
			$('.modalAddMenu').fadeIn(200, function(e) {
				var layer=$('.edit-layer3',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100);
				
			});
			var titleType = "<div class='box' data-type='head'><span class='preview'>请自定义您的元素名称</span><div class='ctrl-btns'><span class='edit2'>编辑2</span><span class='edit'>编辑</span><span class='drag'>拖拽</span><span class='remove'>删除</span></div><div class='view myview'>请在此处自定义您的代码</div></div>";
			$('.edit-layer3 #zdyHtmlCon').html('').prepend("<textarea id='zdyHtml' style='border:0;height: 4rem;width: 7rem;'>"+titleType+"</textarea>");
			$('#menuBox').append("<li></li>");//新增li
			
		});
		
		$('.css-edit3 .submitted').click(function(e){//增加元素的保存按钮点击
			e.preventDefault();
			var teatareaVal = $('#zdyHtml').val();
			$('#menuBox li:last-child').append(teatareaVal);
			fadeOut();
			$( ".box" ).draggable({//生成的时候再次调用 draggable
				connectToSortable: '.col',
				helper: 'clone',
				opacity:0.5,
				start: function(e,t) {drag++},
				drag: function(e,t) {t.helper.width(100);},
				stop: function(e,t) {drag--;htmlRec(0,'box');}
			});
			return false;
		});
	
		// 右击左侧菜单 可以删除
		
		$('.side-bar').on('mousedown','.sub-nav li',function(event, a){
			if(event.which == 3 || a == 'right'){
				if(confirm("确定要删除吗？")){  
					   //如果是true ，则删除
					$(this).remove();
				} else {  
					return false;
				}  
			}
		});
		
		
	//单选按钮切换： 
			//展开功能 
			$('.modals_cspz').on('click','.zka',function(e){ 
				 
				var aa = $(this); 
				if(aa.text()=="展开"){
					aa.text("收起");
				}else{
					aa.text("展开");
				}
				$("."+this.id).slideToggle();
			});
	
		
	
			//************ 新底部导航开始 ************//
		
			 
			var whyClickObj = '';
			$(demo).on('click','.hyEdit',function(e) {//deme下轮播图片弹窗加载事件
				whyClickObj = $(this).parent().parent(),//edit父标签的父标签
				 
				 e.preventDefault();
				 $('.coMmodals').show();//展示蒙版
				 var p=$(this).parent().parent();
		 
			 $('.whydhMo').fadeIn(200, function() {
				 var layer=$('.whyedit-layer',this);
				 layer.css({
					 'margin-top':-(layer.height())/2,
					 'margin-left':-(layer.width())/2
				 }).fadeIn(100); 
				 
				 var imgNum = p.find('.whyview .hyNav-box li').length+1;//遍历
				 var editHtmlImg = "<div class='cmCon'> <table class='why_tips'><thead><tr> <th>序号</th> <th>内容配置</th> <th>操作</th> </tr></thead>"
					 +"<tbody class=''>";
					   
					 for(var i= 1 ;i<imgNum;i++){
						  //菜单名称、跳转地址、选中前图片、选中后图片、 
						 var edithyNm = p.find('.whyview .hyNav-box li').eq(i-1).children("a").children("p").text(), 
							  editahref = p.find('.whyview .hyNav-box li').eq(i-1).children("a").prop("href");
							 edithyImg1 = p.find('.whyview .hyNav-box li').eq(i-1).children("a").children("div:first-child").children("img").attr("src"), 
							 edithyImg2 = p.find('.whyview .hyNav-box li').eq(i-1).children("a").children("div:last-child").children("img").attr("src"),
							//  editcdlx =p.find('.whyview .hyNav-box li').eq(i-1).children("input[name='hymenuName']").val(),//菜单类型 0-5
							//  editjplx =p.find('.whyview .hyNav-box li').eq(i-1).children("input[name='whyggdz']").val(),//获取地址跳转类型 
	 
						   editqyxq="<tr class='qyqq whytr'>"
									 +"<td class='cdtd'>菜单"+i+"</td>"
									 +"<td>" 
									 +"<div class='hytddiv'>"
									 +"	<dl>"
									 +"		<dt>跳转地址：</dt>"
									 +"		<dd>" 
									  +" 		<div class=' ggjpmlx"+i+"'><input type='text' placeholder='请输入跳转地址' value='"+editahref+"'/><button style='background:#ffffff;color:#000000; border-radius:0px; border-color:#ddd;' class='hyxzgg'>选择广告/聚合页</button></div>" 
									   +"     </dd>"
									 +"	</dl>"
									 +"</div>"
									 +"<div class='hytddiv'>"
									 +"<dl>"
									 +"<dt class='cdpic'>未选中图片：</dt>"
									 +"<dd>"
									 +"<div class='uploadImg normalData wxzpic'>"
									 +"		<img src='images/images.png' alt='' class='imagesZw' style='display:none;'>"
									 +"		<img src='"+edithyImg1+"' alt='' class='imgPerview'>"
									 +"		<p class='opacityP'>上传图片</p>"
									 +"		<input type='file' class='imgInput'>"
									 +"	</div>" 
									 +"</dd>"
									 +"</dl>"
									 +"</div>"
									 +"<div class='hytddiv'>"
									 +"	<dl>"
									 +"		<dt class='cdpic'>选中图片：</dt>"
									 +"		<dd>"
									 +"			<div class='uploadImg normalData xzpic'>"
									 +"				<img src='images/images.png' alt='' class='imagesZw' style='display:none;'>"
									 +"				<img src='"+edithyImg2+"' alt='' class='imgPerview'>"
									 +"				<p class='opacityP'>上传图片</p>"
									 +"				<input type='file' class='imgInput'>"
									 +"			</div>"
									 +"		</dd>"
									 +"	</dl>"
									 +"</div>"
									 +"</td>"
									 +"<td><a href='javascript:;' class='llbtn cee4358bb' style='width: 100%' onclick='delwhy(this)'>移除</a></td>"
									 +"</tr>";
						 editHtmlImg+=editqyxq;
					 } 
					 editHtmlImg + "</tbody></table></div>";
				 $('.whydhMo #whytab').html('').append(editHtmlImg);//modals3图片广告弹窗使用
			 });
		 });
	 
		 //保存新底部导航 - 待修改
		$('.whyedit-layer').on('click','.savewhy',function(e){
			e.preventDefault();
			var imgNum = $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody tr").length;
				
			var editHxcd='';
			for(var i= 0 ;i<imgNum;i++){ 
				//新跳转地址获取  -- 待优化，广告是展示的广告标题，聚合页也是？
				var whymenuad  =  $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody").children("tr").eq(i).find(".hytddiv:nth-child(1)").find("input").val();
				
				//获取业务图片地址
				var tpdz1 = $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody").children("tr").eq(i).find(".hytddiv:nth-child(2)").find(".wxzpic .imgPerview").attr("src");
				var tpdz2 = $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody").children("tr").eq(i).find(".hytddiv:nth-child(3)").find(".xzpic .imgPerview").attr("src");
			  editHxcd += '\<li class="whyli"><a href="'+whymenuad+'">'
					if(i == 0){//自定义名称
						editHxcd += '\<div class="xzactive"><img src="'+tpdz1+'" alt=""></div>\
						<div class="ndis"><img src="'+tpdz2+'" alt=""></div></a>\
						'
					}else{
						editHxcd += '\<div class="xzactive"><img src="'+tpdz1+'" alt=""></div>\
						<div class="ndis"><img src="'+tpdz2+'" alt=""></div></a>\
						'
					}	
					editHxcd += '</li>';
				
			}
			$(whyClickObj).find('.whyview .hyNav-box ul').html(editHxcd);
			closeC('.whydhMo');
		});
	
	//继续新增新底部导航
	
	
	$(".whyjxxz").click(function(e){
		var lta = $(this).parents(".whydhMo").find(".why_tips tr").length;
		if(lta >5){
			alert("添加已达上限");
			return;
		}
	
		//追加后重新遍历初始化序号以及id
		initwhy($(this),lta);
	   });
	
	   function initwhy(a,lbtth){
		var addwhy = '<tr class="qyqq whytr">\
		<td class="cdtd">菜单'+lbtth+'</td>\
		<td>\
			<div class="hytddiv">\
				<dl>\
					<dt>跳转地址：</dt>\
					<dd>\
					<div class=" ggjpmlx'+lbtth+'"><input type="text" placeholder="请输入跳转地址" value=""/><button style="background:#ffffff;color:#000000; border-radius:0px; border-color:#ddd;" class="hyxzgg">选择广告/聚合页</button></div>\
					</dd>\
				</dl>\
			</div>\
			<div class="hytddiv">\
				<dl><dt class="cdpic wxzpic">未选中图片：</dt>\
					<dd><div class="uploadImg normalData">\
							<img src="images/images.png" alt="" class="imagesZw">\
							<img src="" alt="" class="imgPerview">\
							<p class="opacityP">上传图片</p>\
							<input type="file" class="imgInput">\
						</div>\
					</dd>\
				</dl>\
			</div>\
			<div class="hytddiv">\
				<dl>\
					<dt class="cdpic">选中图片：</dt>\
					<dd>\
						<div class="uploadImg normalData xzpic">\
							<img src="images/images.png" alt="" class="imagesZw">\
							<img src="" alt="" class="imgPerview">\
							<p class="opacityP">上传图片</p>\
							<input type="file" class="imgInput">\
						</div>\
					</dd>\
				</dl>\
			</div>\
		</td>\
		<td><a href="javascript:;" class="llbtn cee4358bb" style="width: 100%" onclick="delwhy(this)">移除</a></td>\
		</tr>\
		';
		
		a.parents(".whydhMo").find(".why_tips").append(addwhy);
		var ntr = a.parents(".whydhMo").find(".why_tips").children("tbody").children("tr"); 
		// console.log(ntr);
		$.each(ntr,function(i,eleName){//遍历tr
			i++;
			$(eleName).children("td:nth-child(1)").text("菜单"+i);
		}); 
	   }
		 //继续新增底部导航 - 待查看
		$(document).on('click','.hyxzjh,.hyxzgg',function(e) {//选择聚合 
		$('.modals_cspzjhy').fadeIn(200, function() {//展示参数配置弹层
			var layer=$('.cspzedit-layer',this);
			layer.css({
				'margin-top':-(layer.height())/2,
				'margin-left':-(layer.width())/2
			}).fadeIn(100);//弹窗位置设置
			//iop推荐弹窗拼串开始
			$('#htmlConjh').show();//默认展示IOP推荐tab 
		});
	})
		
		//************ 新底部导航结束 ************// 
		/* *********** 2021 1129便民功能元素 开始 *********** */
		//编辑 20220128 update feebtn
		var feeClickObj = '';//这里创建元素方便下面保存按钮回显添加到该div中
		   $(demo).on('click','.feebtn',function(e) {//deme下轮播图片弹窗加载事件
			 feeClickObj = $(this).parent().parent(),//edit父标签的父标签
				 
				e.preventDefault();
				$('.coMmodals').show();//展示蒙版
				var p=$(this).parent().parent();
		 
			$('.modals_bmgn').fadeIn(200, function() {//展示元素弹窗编辑
				var layer=$('.feedit-layer',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100); 
				
				var imgNum = p.find('.jbmgnswip .jbmgnslide').length;//遍历元素并添加值
				 
				var bmgneditHtml = "";
				
					for(var i= 0 ;i<imgNum;i++){
						var bmli = p.find('.jbmgnswip .jbmgnslide').eq(i);
						var bmName = bmli.find(".md_des").text();
						
						var bmPor =  bmli.find(".md_des_left").length;

						var csz = bmli.find(".hidetit").val();
						var bmhref = bmli.find(".bmbtna").children("a").prop("href");
						var bgbmo = bmli.css("backgroundImage");//首次编辑肯定是none，再次编辑地址应该是带着http的

						bmgneditHtml+=`<li class="bmmoli">
						<div class="bmmonli_div">
							<div class="bmmotit">
								<div><span class="cred"> * </span><span>便民模块名称：</span></div><input type="text" class="bminput titin" value="`+bmName+`">
							</div>
							<div class="bmmotit">
								<div><span>名称排序：</span></div>
								<div class="proj p_left">`
								if(bmPor>0){
									bmgneditHtml+=`<span class="active" data-por="1"  onclick="jpor(this)">居左</span><span class="" data-por="2" onclick="jpor(this)">居中</span>`
								}else if(bmPor==0){
									bmgneditHtml+=`	<span class="" data-por="1"  onclick="jpor(this)">居左</span><span class="active" data-por="2" onclick="jpor(this)">居中</span>`
								}
									 
					bmgneditHtml+=`</div>
							</div>
							<div class="bmmotit">
								<div><span class="cred"> * </span><span>参数值：</span></div>
								<select class="form-control form-control-select input-sm bmcs">`;
								$("#bmcs option").each(function(obj){
										if($(this).val() == csz){
											bmgneditHtml+=`<option value="`+ csz +`" selected>`+bmName+`</option>`;
										}else{
											bmgneditHtml+=`<option value="`+ $(this).val() +`">`+$(this).text()+`</option>`;
										}
								});
				bmgneditHtml+=`</select>
							</div>
							<div class="bmmotit"><div class=""><span>链接地址：</span></div><input type="text" class="bminput" value="`+bmhref+`"><span class='jhsp bmjh'>选择广告/聚合页</span></div>
							<div class="bmmotit">
								<div class="">背景图片：</div>
								<div class="upimgdiv">
									<div class="uploadImg normalData" >`;
										if(bgbmo == "none" || bgbmo == ""){
								bmgneditHtml+=`<img src="images/images.png" alt="" class="imagesZw" style='display:block;'>
											   <img src="" alt="" class="imgPerview" style='display:none;'>
											   <p class="opacityP">上传图片</p>`
										}
										else {
											bmgneditHtml+=`<img src="images/images.png" alt="" class="imagesZw" style='display:none;'>
											<img src="`+ bgbmo +`" alt="" class="imgPerview" style='display:block;'>
											<p class="opacityP j-deleteImg">删除</p>`
									 	} 
										bmgneditHtml+=`<input type="file" class="imgInput">
									</div>
									<span class='cred' style="padding-top: 5px; font-size: 12px;">注:图片格式支持上传jpg/png格式,100KB以内。</span>
								</div>
							</div>
							 
						</div>
						<div class="bm_btn"><a class="cee4358bb" href="javascript:;" onclick="delodule(this)">移除</a><a href="javascript:;" class="c3c9be1bb" onclick="moveBfModule(this)">前移</a></div>
					</li>`
					} 
					 
				$('#bmmould').html('').append(bmgneditHtml);//modals3图片广告弹窗使用
			});
		});
 
		//便民功能弹窗编辑保存
		 
		  $('.feedit-layer').on('click','.savebmgn',function(e){
			e.preventDefault();
			var imgNum = $(this).parents('.feedit-layer').children(".bmgnmain-content").find("#bmmould li").length;
				console.log(imgNum);
			var editBmgn='';
			for(var i= 0 ;i<imgNum;i++){ 
				//获取业务图片地址style="background-image:url(../images/bmbg1.png);"titin
				var swipNum = $("#bmzs").val();
				var lidiv =  $(this).parents('.feedit-layer').children(".bmgnmain-content").find("#bmmould li").eq(i);
				var tit = lidiv.find(".titin").val();
				var seltit = lidiv.find(".bmcs").val();
				//20220128 add 增加居中居左
				var porjj = $(lidiv).find(".p_left .active").attr("data-por");//是否居中
				
				var imgSrc2 = lidiv.find(".imgPerview").attr("src");
				var dis = lidiv.find(".imgPerview").css("display");
				console.log(seltit);
				console.log(seltit == 'jtkd',seltit == 'jtmbh');
				if(imgSrc2 != "none" && imgSrc2!=""){
					 //20220128 add 增加宽带判断
					
					if(seltit == 'jtkd'||seltit == 'jtmbh'){//居左//20220128 add 增加居中居左 
						editBmgn += `<li class="swiper-slide slidebm slidebm_kd jbmgnslide" style="background-image:url('`+imgSrc2+`');">`;
					}else{
						 
						editBmgn += `<li class="swiper-slide slidebm jbmgnslide" style="background-image:url('`+imgSrc2+`');">`;
					}
				}else{
				 //20220128 add 增加宽带判断
					if(seltit == 'jtkd'||seltit == 'jtmbh'){//居左//20220128 add 增加居中居左
						editBmgn += `<li class="swiper-slide slidebm slidebm_kd jbmgnslide" >`;
					}else{
						 
						editBmgn += `<li class="swiper-slide slidebm  jbmgnslide" >`;
					}
				}
				//20220128 add 增加居中居左
						editBmgn += `<div class="inclass my_bjgn">
										<input type="hidden"  class="hidetit"  value="`+ seltit +`">`
										if(porjj == "1"){//居左
											editBmgn += `<p class="md_des md_des_left">`+ tit +`</p>`;
										}else if(porjj=="2"){//居中
											editBmgn += `<p class="md_des ">`+ tit +`</p>`;
										}
											
							if(seltit == 'bmtyll'){
								editBmgn +=`<p class="md_txt_bd"><span>12.9</span><span>GB</span> </p>`
							}else if(seltit == 'bmhfye'){
								editBmgn +=`<p class="md_txt_bd"><span>164.06</span><span>元</span> </p>`
							}else if(seltit == 'bmyyth'){
								editBmgn +=`<p class="md_txt_bd"><span>194</span><span>分钟</span> </p>`
							}else if(seltit == 'bmdqld'){
								editBmgn +=`<p class="md_txt_bd"><span>12315</span><span>豆</span> </p>`
							}else if(seltit == 'bmjf'){
								editBmgn +=`<p class="md_txt_bd"><span>428</span><span>分</span> </p>`
							}
						if(imgSrc2 != "none" && imgSrc2!=""){
							if(seltit == 'jtkd'||seltit == 'jtmbh'){ //20220128 add 增加宽带判断
								editBmgn += `<div class="bmzwbtn bmzwbtnExp bmbtna"><a href="www.baidu.com"></a></div>`;
							}else {
								editBmgn += `<div class="bmzwbtn  bmbtna"><a href="www.baidu.com"></a></div>`;
							}
						}else{
						
							if(seltit == 'jtkd'||seltit == 'jtmbh'){ //20220128 add 增加宽带判断
								editBmgn +=`<div class="bmzwbtn bmzwbtnExp bmbtna hidefee"><a href="javascript:;"></a></div>`;
							}else{
								editBmgn +=`<div class="bmzwbtn  bmbtna hidefee"><a href="javascript:;"></a></div>`;
							}
						}
					editBmgn +=`</div>
							</li>`;
				 
			}
			$(feeClickObj).find('.bmgnView .showFeeUl').html(editBmgn);
			$(" .jbmgnswip").each(function(i,u){
					//初始化菜单滑动
					// ;//添加事件执行的唯一样式
					var swiperbmgn1 = new Swiper('.bmgn_'+i, { 
						slidesPerView: swipNum, //这里默认3.5个，实际参数可配置， 头部一行显示多少个 .5表示显示半个
						paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
						spaceBetween: 10, 
						freeMode: true, //默认为false，普通模式: slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
						loop: false, //是否可循环  
						scrollbarHide : false,
						scrollbarSnapOnRelease:true
						
					
					}); 
		   });
			closeC('.modals_bmgn');//保存回显成功关闭弹窗
	   });
 
		/* *********** 20211129add便民功能元素 结束 *********** */
	    /* ****** 20211201协议add ****** */
		//编辑
		var xyClickObj = '';//这里创建元素方便下面保存按钮回显添加到该div中
		   $(demo).on('click','.wdxyEdit',function(e) {//deme下轮播图片弹窗加载事件
			 xyClickObj = $(this).parent().parent(),//edit父标签的父标签
				 
				e.preventDefault();
				$('.coMmodals').show();//展示蒙版
				var p=$(this).parent().parent();
		 
			$('.modals_dbxy').fadeIn(200, function() {//展示元素弹窗编辑
				var layer=$('.dbxy-layer',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100); 
				
				var xyNum = p.find('.xieyi_btn_container a').length;//遍历元素并添加值
				 
				var dbxyeditHtml = "";
				
					for(var i= 0 ;i<xyNum;i++){
						var xyli = p.find('.xieyi_btn_container a').eq(i);
						var xyname = xyli.text();//协议名称
						dbxyeditHtml+=`<li class="bmmoli">
						<div class="bmmonli_div xymotit">
							<div class=" "><span class="cred"> * </span><span>协议名称：</span></div><input type="text" disabled class="bminput namexy" value="`+ xyname +`"><span class='  bmjh j_pzxymo'>选择协议</span>
						</div>
						<div class="bm_btn"><a href="javascript:;" class="cee4358bb" onclick="delodule(this)">移除</a></div>
					</li>`;
						 
					} 
					 
				$('#dbxyulId').html('').append(dbxyeditHtml);//modals3图片广告弹窗使用
			});
		});

		//协议保存回显
		$('.dbxy-layer').on('click','.savebmgn',function(e){
			e.preventDefault();
			var xyNum = $(this).parents('.dbxy-layer').find("#dbxyulId li").length;
				console.log(xyNum);
			var editDbxy='';
			for(var i= 0 ;i<xyNum;i++){ 
				//获取协议名称
				var xydiv =  $(this).parents('.dbxy-layer').find("#dbxyulId li").eq(i);
				 console.log(xydiv.find(".namexy").val());
				var xynm = xydiv.find(".namexy").val();
				editDbxy += `<a class="xieyi_btn" href="">`+ xynm+`</a>`;
			} 
			$(xyClickObj).find('.xieyi_btn_container p').html(editDbxy); 
			closeC('.modals_dbxy');
	   });

		/* ****** 20211201协议end ****** */
		//横向菜单滑动权益详情 编辑弹窗  需求暂停并保留
			var qyxqClickObj = '';
		   $(demo).on('click','.qyxqBtn',function(e) {//deme下轮播图片弹窗加载事件
				qyxqClickObj = $(this).parent().parent(),//edit父标签的父标签
				 
				e.preventDefault();
				$('.coMmodals').show();//展示蒙版
				var p=$(this).parent().parent();
		 
			$('.modals_qyxq').fadeIn(200, function() {
				var layer=$('.qyxqedit-layer',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100); 
				
				var imgNum = p.find('.hxmenuView .swiper-slide').length+1;//遍历
				var editHtmlImg = "<div class='cmCon'> <table class='ch_tips'><thead><tr> <th>序号</th> <th>内容配置</th> <th>操作</th> </tr></thead>"
					+"<tbody class='mytablebox'>";
					  
					for(var i= 1 ;i<imgNum;i++){
						
						//获取图片地址
						//获取按钮图片
						//获取按钮图片地址
						//是否需要登录
						
						var editBigImg = p.find('.hxmenuView .swiper-slide .img_div').children("a:first-child").children("img").eq(i-1).attr("src"),//获取菜单图片
							editBtnImg = p.find('.hxmenuView .swiper-slide .img_div').children("a:nth-child(2)").children("img").eq(i-1).attr("src"),//获取菜单领取按钮图片
							editBigImgad =p.find('.hxmenuView .swiper-slide .img_div').children("a:first-child").eq(i-1).prop('href'),//获取菜单图片地址
							editBtnImgad = p.find('.hxmenuView .swiper-slide .img_div').children("a:nth-child(2)").eq(i-1).prop('href'),//获取菜单领取按钮图片地址
							editBtnIn = p.find('.hxmenuView .swiper-slide .img_div').children(".jumphxc").eq(i-1).val(),//获取菜单领取按钮图片地址
	
						editqyxq="<tr class='qyqq'>"
									+"<td>"+i+"</td>"
									+"<td>"
									+"<div>"
									+"<dl>"
									+"<dt>业务图片：</dt>"
									+"<dd>"
									+"<div class='uploadImg normalData'>"
									 
									if(editBigImg.length!=0){
										editqyxq +="<img src='images/images.png' alt='' class='imagesZw' style='display:none;'>"
										+"<img src='"+ editBigImg +"' alt='' class='imgPerview ywpicImg' style='display:block;'>"
										+"<p class='opacityP j-deleteImg'>删除</p>"
									}else{
										editqyxq +="<img src='images/images.png' alt='' class='imagesZw' style='display:block;'>"
										+"<img src=' ' alt='' class='imgPerview' style='display:none;'>"
										+"<p class='opacityP'>图片上传</p>"
									}
									editqyxq +="<input type='file' class='imgInput'>"
									+"</div>"
													
									+"<span>注：请上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>"
									+"</dd>"
								 
									+"</dl>"
									+"</div>"
									+"<div>"
									+"<dl>"
									+"<dt>图片跳转地址：</dt>"
									+"<dd>"
									+"<input type='text' class='jhinp ywinput' placeholder='请输入跳转地址 或跳转广告' value='"+ editBigImgad +"'><span class='xzgg_span'>选择广告</span>"
									+"<span class='qyzj'>注：输入ID请用英文,分隔</span>"
									+"</dd>"
									+"</dl>"
									+"</div>"
									+"<div>"
									+"<dl>"
									+"<dt>业务按钮：</dt>"
									+"<dd>"
									+"<div class='uploadImg normalData ywbtnImg'>"
									 
									if(editBtnImg.length!=0){
										editqyxq +="<img src='images/images.png' alt='' class='imagesZw' style='display:none;'>"
										+"<img src='"+ editBtnImg +"' alt='' class='imgPerview ywanImg' style='display:block;'>"
										+"<p class='opacityP j-deleteImg'>删除</p>"
									}else{
										editqyxq +="<img src='images/images.png' alt='' class='imagesZw' style='display:block;'>"
										+"<img src=' ' alt='' class='imgPerview' style='display:none;'>"
										+"<p class='opacityP'>图片上传</p>"
									}
									editqyxq +="<input type='file' class='imgInput'>"
									+"</div>"
													
									+"<span>注：请上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>"
									+"</dd>"
									+"</dl>"
									+"</div>"
									+"<div>"
									+"<dl>"
									+"<dt>按钮跳转地址：</dt>"
									+"<dd>"
									+"<input type='text' class='jhinp btninput' placeholder='请输入跳转地址 或跳转广告' value='"+ editBtnImgad +"'><span class='xzgg_span'>选择广告</span>"
									+"<span class='qyzj'>注：输入ID请用英文,分隔</span>"
									+"</dd>"
									+"</dl>"
									+"</div> "
									+"<div>"
									+"<dl>"
									+"<dt>是否需要登录：</dt>"
									+"<dd class='yxsjdd'>"
									+"<p>"
				 
									if(editBtnIn =='1'){//1是 0 否否则默认0 三种情况
										console.log(editBtnIn);
										editqyxq += "<input type='radio' name='nifdl"+i+"' id='iifd"+i+"' value='1' class='ifdlin nninput' checked/><label for='iifd"+i+"' class='ifdllb'>是</label> "
												+"<input type='radio' name='nifdl"+i+"' id='iifd"+i+"' value='0' class='ifdlin nninput' /><label for='iifd"+i+"'  class='ifdllb'>否</label>"
									}else if(editBtnIn =='0'){
										console.log(editBtnIn);
										editqyxq += "<input type='radio' name='nifdl"+i+"' id='iifd"+i+"' class='ifdlin nninput' value='1' /><label for='iifd"+i+"' class='ifdllb'>是</label> "
										+"<input type='radio' name='nifdl"+i+"' id='iifd"+i+"' class='ifdlin nninput' value='0' checked/><label for='iifd"+i+"'  class='ifdllb'>否</label>"
									
									}else{
										console.log(editBtnIn);
										editqyxq += "<input type='radio' name='nifdl"+i+"' id='iifd"+i+"' value='1' class='ifdlin nninput' checked/><label for='iifd"+i+"' class='ifdllb'>是</label> "
										+"<input type='radio' name='nifdl"+i+"' id='iifd"+i+"' class='ifdlin nninput'  value='0' /><label for='iifd"+i+"'  class='ifdllb'>否</label>"
									
									}
									editqyxq +="</p>"
									+"</dd>"
									+"</dl>"
									+"</div>"
									+"</td>"
									+"<td>"
									+"<a href='javascript:;' class='llbtn_bor' style='width: 100%' onclick='tablezdCk(this)'>置顶</a>"
									+"<a href='javascript:;' class='llbtn_bor' style='width: 100%' onclick='tableUpModule(this)'>上移</a>"
									+"<a href='javascript:;' class='llbtn_bor' style='width: 100%' onclick='tableDownModule(this)'>下移</a>"
									+"<a href='javascript:;' class='llbtn_bor' style='width: 100%' onclick='tableendCk(this)'>置底</a>"
									+"<a href='javascript:;' class='llbtn cee4358bb' style='width: 100%' onclick='delqyxq(this)'>移除</a>"
									+"</td>"
									+"</tr>";
						editHtmlImg+=editqyxq;
					} 
					editHtmlImg + "</tbody></table></div>";
				$('.modals_qyxq #qyxqtab').html('').append(editHtmlImg);//modals3图片广告弹窗使用
			});
		});
	
		   //权益详情继续新增
		   var addqyxq = '<tr class="qyqq">\
				<td>1</td>\
				<td>\
					<div>\
					   <dl>\
						   <dt>业务图片：</dt>\
					   <dd>\
						   <div class="uploadImg normalData">\
							   <img src="images/images.png" alt="" class="imagesZw" style="display:block;"/>\
							   <img src="" alt="" class="imgPerview ywpicImg" style="display:none;"/>\
							<p class="opacityP j-deleteImg">删除</p>\
							<input type="file" class="imgInput"/>\
						   </div>\
						   <span>注：请上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>\
					  </dd>\
					 </dl>\
					</div>\
					<div>\
					   <dl>	<dt>图片跳转地址：</dt>\
							<dd>\
								<input type="text" class="jhinp ywinput" placeholder="请输入跳转地址 或跳转广告" value="https://wwww.baidu.com/">\
									<span class="xzgg_span">选择广告</span><span class="qyzj">注：输入ID请用英文,分隔</span>\
							</dd>\
					   </dl>\
					</div>\
					<div>\
						<dl><dt>业务按钮：</dt>\
						<dd>\
						<div class="uploadImg normalData ywbtnImg">\
							<img src="images/images.png" alt="" class="imagesZw" style="display:block;">\
							<img src="" alt="" class="imgPerview ywanImg" style="display:none;">\
							<p class="opacityP j-deleteImg">删除</p><input type="file" class="imgInput">\
						</div>\
						<span>注：请上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>\
						</dd>\
						</dl>\
					 </div>\
					 <div>\
							<dl><dt>按钮跳转地址：</dt>\
								<dd>\
									<input type="text" class="jhinp btninput" placeholder="请输入跳转地址 或跳转广告" value="http://127.0.0.1:8080/wwww1.baidu.com">\
									<span class="xzgg_span">选择广告</span><span class="qyzj">注：输入ID请用英文,分隔</span>\
								</dd>\
							</dl>\
					  </div>\
					  <div>\
						<dl><dt>是否需要登录：</dt>\
						<dd class="yxsjdd">\
							<p><input type="radio" name="nifdl1" id="iifd1" value="1" class="ifdlin nninput" checked=""><label for="iifd1" class="ifdllb">是</label>\
								<input type="radio" name="nifdl1" id="iifd1" class="ifdlin nninput" value="0"><label for="iifd1" class="ifdllb">否</label>\
							</p>\
						</dd>\
						</dl>\
					</div>\
					</td>\
					<td>\
						<a href="javascript:;" class="llbtn_bor" style="width: 100%" onclick="tablezdCk(this)">置顶</a>\
						<a href="javascript:;" class="llbtn_bor" style="width: 100%" onclick="tableUpModule(this)">上移</a>\
						<a href="javascript:;" class="llbtn_bor" style="width: 100%" onclick="tableDownModule(this)">下移</a>\
						<a href="javascript:;" class="llbtn_bor" style="width: 100%" onclick="tableendCk(this)">置底</a>\
						<a href="javascript:;" class="llbtn cee4358bb" style="width: 100%" onclick="delqyxq(this)">移除</a>\
					</td>\
			</tr>\
			';
	
	
		   $(".jxxz").click(function(e){
			var zj = $(this).parents(".modals_qyxq").find(".mytablebox").append(addqyxq);
			//追加后重新遍历初始化序号以及id
			initqyxq(zj);
		   });
	
		   function initqyxq(a){
			var ntr = a.children("tr"); 
			$.each(ntr,function(i,eleName){//遍历tr
				i++;
				$(eleName).children("td:nth-child(1)").text(i)
			}); 
		   }
	
		   //横向菜单滑动权益详情保存并编辑
		   $('.qyxqedit-layer').on('click','.saveqyxq',function(e){
				e.preventDefault();
				var imgNum = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody tr").length;
					console.log(imgNum);
				var editHxcd='';
				for(var i= 0 ;i<imgNum;i++){ 
					//获取业务图片地址
					var tpdz = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".ywpicImg").attr("src");
					//获取按钮图片地址
					var btdz = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".ywanImg").attr("src");
				  
					//获取按钮图片地址
					var tptzdz = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".ywinput").attr("href");
					//获取按钮图片地址
					var bttzdz = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".btninput").attr("href");
					var vifdl = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find("p input:checked").val();
					console.log(vifdl);
					editHxcd += ' \<div class="swiper-slide">\
						<div class="img_div">\
							<a href="'+tptzdz+'"><img src="'+tpdz+'" alt=""></a>\
							<a href="'+bttzdz+'"><img src="'+btdz+'" alt=""></a>\
							<input type="hidden" class="jumphxc" value="'+vifdl+'" name="jumphx">\
						</div>\
					</div>';
					 
				}
				$(qyxqClickObj).find('.hxmenuView .swiper-wrapper').html(editHxcd);
				var swiperhxcd = new Swiper('.swiper-hx', {//保存后重新激活
					slidesPerView: 3, //头部一行显示多少个 .5表示显示半个
					paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
					spaceBetween: 10, //slide之间的距离（单位px）。
					freeMode: true, //默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
					loop: false, //是否可循环
					pagination : '.swiper-pagination' 
				   
				});
				closeC('.modals_qyxq');
		   });
	
		   
			 
		   
		   //获取当前楼层id click
		   $(demo).on('click','.getfloorId',function(e){
			e.preventDefault(); 
			$('.coMmodals').show();//展示蒙版
			$('.csFloormodals').fadeIn(200, function() {
				var layer=$('.csFloorId',this);
				layer.css({
					'margin-top':-(layer.height())/2,
					'margin-left':-(layer.width())/2
				}).fadeIn(100);
			}); 
			   var id = $(this).parents(".bigFloor").find(".resizable").attr("id");
			   $("#floorId").val(id); 
		   }); 
			//卖家信息组件编辑弹窗
			var sellerthisClickObj=''; //该变量在保存中也会用到
		   $(demo).on('click','.sellerUpdateYa',function(e) {
				console.log('发后决定是否黄金时代')
				sellerthisClickObj = $(this).parent().parent(),//edit父标签的父标签
				that=$(this);
				a = that.parent().next();//view
				e.preventDefault();
				var p=$(this).parent().parent();
			
		   })
		   //新轮播图弹窗编辑
		   var lbtthisClickObj='';//
		   $(demo).on('click','.editlbt',function(e) {//deme下轮播图片弹窗加载事件
				 lbtthisClickObj = $(this).parent().parent(),//edit父标签的父标签
				that=$(this);
				a = that.parent().next();//view
				   e.preventDefault();
				   $('.coMmodals').show();//展示蒙版
				   var p=$(this).parent().parent();
			//    type=p.data('type'),//=wdglbt轮播图的datatype获取
			//    idName=$(this).parent().next().children().addClass('editing').attr('id');//轮播图id获取添加editing 好像没啥用
			 
				$('.nlbtTips').fadeIn(200, function() {
					var layer=$('.lbmodal',this);
					layer.css({
						'margin-top':-(layer.height())/2,
						'margin-left':-(layer.width())/2
					}).fadeIn(100);
					 
	
					var imgNum = p.find('.lbtdiv li img').length+1;//遍历
					var editHtmlImg = "";
						editdztj1 =  "	<div class='nrks'>"
						+"		<span class='zysx'>注：建议图片尺寸为1080*527px</span>"
						+		"<ul class='cont_list clistone' id='c_1'>";
						editHtmlImg += editdztj1; 
						for(var i= 1 ;i<imgNum;i++){
							var editText = p.find('.lbtdiv li .lbtName').eq(i-1).val(),//获取轮播图标题
							editglText = p.find('.lbtdiv li .lbtifglgg').eq(i-1).val(),//获取是否关联广告属性
							editPicHref = p.find('.lbtdiv li a').eq(i-1).prop('href');//图片超链接展示
							lbteditPicSrc = p.find('.lbtdiv li img').eq(i-1).prop('src'),//获取图片src展示
								//editPicHref = p.find('.navbottom-box li a').eq(i-1).prop('href'),//
							editdztj = "<li class='lbt_li'>"
								+"			<table class='intable' border='0' cellspacing='0' cellpadding='0'>"
								+"				<tr>"
								+"					<th>标题：</th>"
								+"					<td><input class='inputtxt lbtbt' name='' type='text' value='" + editText + "'/></td>"
								+"				</tr>"
								if(editglText=='0'){//0不关联广告
									editdztj+= "<tr class=''>"
									+"				<th>关联广告：</th>"
									+"				<td><input type='radio' name='ifglgg"+i+"' id='ifglgg"+i+"' value='1' class='ifglgg nninput' onclick='qhglgg(this,&apos;1&apos;)'/><label for='ifglgg"+i+"' class='ifdllb'>是</label>"
									+"              <input type='radio' name='ifglgg"+i+"' id='fglgg"+i+"' value='0' class='ifglgg nninput' checked onclick='qhglgg(this,&apos;0&apos;)'/><label for='fglgg"+i+"' class='ifdllb'>否</label></td>"
									+"			</tr>"
								}
								if(editglText=='1'){//1关联广告
									editdztj+= "<tr class=''>"
									+"				<th>关联广告：</th>"
									+"				<td><input type='radio' name='ifglgg"+i+"' id='ifglgg"+i+"' value='1' class='ifglgg nninput ' checked onclick='qhglgg(this,&apos;1&apos;)'/><label for='ifglgg"+i+"' class='ifdllb'>是</label>"
									+"              <input type='radio' name='ifglgg"+i+"' id='fglgg"+i+"' value='0' class='ifglgg nninput' onclick='qhglgg(this,&apos;0&apos;)'/><label for='fglgg"+i+"' class='ifdllb'>否</label></td>"
									+"			</tr>"
								}
								editdztj+=    "<tr class='trLj'>"
								+"					<th>跳转地址：</th>"
								+"					<td><input class='inputtxt lbtlj' name='' type='text' value='" + editPicHref + "' /></td>"
								+"				</tr>"
								+"				<tr class='lbtxzgg' style='display:none;'>"
								+"					<th>选择广告：</th>"
								+"					<td><a href='javascript:;' class='xxljgg' style='line-height:24px; height:24px;'>选择广告</a></td>"
								+"				</tr>"
								+"				<tr>"
								+"					<th>轮播图片：</th>"
								+"					<td>"
								+"						<span class='zsp pic_span' >"
								+"							<a  href='javascript:;' class='llbtn cllBtn'>浏览</a> "
								+"							<input name='' type='file'  class='upload file' id='txtUploadFile' size='1'/>"
								+"						</span>"
								+"                     <div class='yulanImg pic_img'><img src='"+lbteditPicSrc +"'   /></div>"
								+"					</td>"
								+"				</tr>";
								
							if(i==1){
								editdztj += "	<tr>"
								+"					<th></th>"
								+"					<td  class='ydtd'>"
								+"						<a href='javascript:;' onClick='deltab(this)' class='llbtn cee4358bb'>移除</a>"
								+"	                    <a href='javascript:;' onclick='qytab(this)' class='llbtn c3c9be1bb'>前移</a>"
								+"					</td>"
								+"				</tr>";
							}else{
								editdztj += "	<tr>"
								+" 					<th></th>"
								+" 					<td  class='ydtd'>"
								+" 						<a href='javascript:void(0)' onClick='deltab(this)' class='llbtn cee4358bb'>移除</a>&nbsp;&nbsp;&nbsp;&nbsp;"
								+" 						<a href='javascript:void(0)' onclick='qytab(this)' class='llbtn c3c9be1bb'>前移</a>"
								+" 					</td>"
								+" 				</tr>";
							}
	
							editdztj +="</table>"
								+"		</li>";
								editHtmlImg+=editdztj;
						}
						editdztj1 ="</ul>"
									+"<ul class='cont_list_plus'>"
									+" <li id='plus1' onclick='tbplus(this)'>"
									+"	 <p>+增加图片广告</p>"
									+" </li>"
									+"</ul>"
									+"	</div>";
						editHtmlImg += editdztj1;
					$('.nlbtTips #lbthtmlCon').html('').append(editHtmlImg);//modals3图片广告弹窗使用
				});
			});
			
			$('.lbmodal').on('click','.lbt-edit button',function(e){//轮播图点击保存
				e.preventDefault();
				var imgNum = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").length;
				 
				var editLbt='';
				for(var i= 0 ;i<imgNum;i++){ 
				 
					var btnm = $(this).parents('.lbmodal').find('.lbtbt').eq(i).val();//标题 
					var imgSrc = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").find(".pic_img img").eq(i).attr("src");//图片地址
					var imgHref = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").find('.lbtlj').eq(i).val();//图片链接
					var ifgg = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").find(".ifglgg[name='ifglgg"+(i+1)+"']:checked").val();//是否关联广告
					 console.log(ifgg);
					editLbt += ' \<li>\
						<a href="'+imgHref+'">\
							<img src="'+imgSrc+'" alt="1" width="400" height="200"/>\
							<input type="hidden" value="'+btnm+'" class="lbtName"/>\
						</a>\
					</li>  ';
					// <input type="hidden" value="'+btnm+'" class="lbtifglgg">\
					
				}
				$(lbtthisClickObj).find('.lbtdiv .imgs-container').html(editLbt);
				reSlide();
				sizeInit();
				closeC('.nlbtTips');//关闭弹窗
				
				return;
			});
	
		
	
			//公共广告地址选择弹窗使用
			$(document).on('click','.xzclick',function(e) { 
				//弹窗前给当前选择的btn增加个class
				;
				$(this).prev().addClass("upActive");//为了获取该标识并赋值
				$('.cmsModalTips').fadeIn(200, function() { 
					var layer=$('.cmszedit-layer',this);
					layer.css({
						'margin-top':-(layer.height())/2,
						'margin-left':-(layer.width())/2
					}).fadeIn(100);  
					$(this).children("#tcname").val($("#pmdtc").val());//标识是哪个弹窗的按钮发起的
				});
				
	
			});
	
			//公共关闭取消 广告弹窗使用
			$('.cmszedit-layer .closexz,.cmszedit-layer .cmsqxxz').click(function(e){//iop楼层关闭弹窗
				e.preventDefault();
				cmsFadeOut();
				return false;
			});
			
			 
			//公共点击关闭弹窗隐藏
			function cmsFadeOut(){
				$('.cmsModalTips').fadeOut(100, function() {
					$(this).find('.cmszedit-layer').hide();
				});
			};
	
			//广告链接保存获取： 
			$('.cmszedit-layer .cmssave').click(function(e){ 
				e.preventDefault();
				//获取跳转链接
				var vjplj = $(this).parents(".cmsModalTips").find(".cmsTable").find("td input[name='xzggra']:checked").val();
				// console.log(vjplj);
				var fqtip = $("#tcname").val();
				$("."+fqtip).find(".upActive").val(vjplj);
				cmsFadeOut();
				$("."+fqtip).find(".upActive").removeClass("upActive");//获取完值记得删除css 因为是唯一标识且其他弹唱也可能用到
				
				return false;
			});
	
			//跑马灯文本编辑弹窗
			var pmdthisClickObj=''; //该变量在保存中也会用到
			$(demo).on('click','.pmdEdit',function(e) {
				pmdthisClickObj = $(this).parent().parent(),//edit父标签的父标签
				that=$(this);
				a = that.parent().next();//view
				   e.preventDefault();
				   $('.coMmodals').show();//展示蒙版
				var p=$(this).parent().parent();
				$('.pmdTips').fadeIn(200, function() {
					var layer=$('.pmdmodal',this);
					layer.css({
						'margin-top':-(layer.height())/2,
						'margin-left':-(layer.width())/2
					}).fadeIn(100);
	
					var imgNum = p.find('.xxpmd .swiper-slide').length+1;//遍历
					var editHtmlImg = "<ul>"; 
					
						for(var i= 1 ;i<imgNum;i++){  
							// console.log( p.find('.xxpmd .swiper-slide').children('input'));
							var editLx = p.find('.xxpmd .swiper-slide').children('input[name="xxtzlx'+i+'"]').val(),//获取类型
								editbt = p.find('.xxpmd .swiper-slide').children('input[name="btname'+i+'"]').val(),//超链接标题
								editHref = p.find('.xxpmd .swiper-slide').children("a").eq(i-1).attr('href');//获取超链接 这里是汉字的时候prop是以ip形式呈现的请注意 用attr试试
								editText = p.find('.xxpmd .swiper-slide').children("a").children("span").eq(i-1).text(), //获取文本
								
							editxxtj = "<li class='pmd_li' style='padding:0px;'>"
								+"			<table class='pmdtable' border='0' cellspacing='0' cellpadding='0'>"
								+"				<tr>"
								+"					<th style=' border-right: 1px solid #d7d7d7;text-align: center;' rowspan='3'>" + i + "</th>"
								+"					<th  >类型：</th>"
								+"					<td>"
									if(editLx==1){//判断类型 
										editxxtj += "   <input class='' name='lx" + i + "' type='radio'  id='xxlx" + i + "' checked value='" + editLx + "' onclick='qhlx(this,&apos;xjp"+i+"&apos;)'/><label for='xxlx" + i + "'>消息通知</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='gglx" + i + "' value='2' onclick='qhlx(this,&apos;gjp"+i+"&apos;)'/><label for='gglx" + i + "' >广告</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='jhylx" + i + "' value='3'  onclick='qhlx(this,&apos;jjp"+i+"&apos;)'/><label for='jhylx" + i + "'>聚合页</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='dzlx" + i + "' value='4' onclick='qhlx(this,&apos;djp"+i+"&apos;)'/><label for='dzlx" + i + "' >地址</label>"
												 +" </td>"  
												 +" <td  rowspan='3' style='vertical-align:middle;' >"
												 +"<span class='ydicon'><image src='images/sm_01.png' width='18' onclick='zhidingCk(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_02.png' width='18' onclick='moveUpModule(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_03.png' width='18' onclick='moveDownModule(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_04.png' width='18' onclick='delpmd(this)'></span>"
												 +" </td>"
												 +"</tr>"
												 +"<tr class='jumpa'>"
												 +"		<th>跳转地址：</th>"
													  if('' == editbt || editbt == null || editbt == undefined){
														 editxxtj += " <td id='xjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre1' type='hidden' value='' /> <a href='javascript:;' class='xxljgg xxclick' >选择消息</a></td>"
													 }else{
														 editxxtj += " <td id='xjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre1' type='hidden' value='" + editHref + "' /> <a href='javascript:;' class='xxljgg xxclick' >"+editbt+"</a></td>"
													 }
													 editxxtj += " <td class='lxactive' id='gjp"+i+"'><input class='jpinput' name='jumpaddre2' type='hidden' value='' /> <a href='javascript:;' class='xxljgg xzclick' >选择广告</a></td>"
													 +" <td class='lxactive' id='jjp"+i+"'><input class='jpinput' name='jumpaddre3' type='hidden' value='' /> <a href='javascript:;' class='xxljgg jhyclick' >选择聚合页</a></td>"
													 +" <td class='lxactive' id='djp"+i+"'><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value='' style='width:30%;' /></td>"
												+"</tr>"
									} 
									if(editLx==2){
										
										editxxtj += "   <input class='' name='lx" + i + "' type='radio'  id='xxlx" + i + "' value='1' onclick='qhlx(this,&apos;xjp"+i+"&apos;)'/><label for='xxlx" + i + "'>消息通知</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='gglx" + i + "' checked value='" + editLx + "' onclick='qhlx(this,&apos;gjp"+i+"&apos;)'/><label for='gglx2'>广告</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='jhylx" + i + "' value='3' onclick='qhlx(this,&apos;jjp"+i+"&apos;)'/><label for='jhylx" + i + "'>聚合页</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='dzlx" + i + "' value='4' onclick='qhlx(this,&apos;djp"+i+"&apos;)'/><label for='dzlx" + i + "'>地址</label>"
												 +" </td>"  
												 +" <td  rowspan='3' style='vertical-align:middle;' >"
												 +"<span class='ydicon'><image src='images/sm_01.png' width='18' onclick='zhidingCk(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_02.png' width='18' onclick='moveUpModule(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_03.png' width='18' onclick='moveDownModule(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_04.png' width='18' onclick='delpmd(this)'></span>"
												 +" </td>"
												 +"</tr>"
												 +"<tr class='jumpa'>"
												 +"		<th>跳转地址：</th>"
												 +      "<td class='lxactive'  id='xjp"+i+"'><input class='jpinput' name='jumpaddre1' type='hidden' value='' /> <a href='javascript:;' class='xxljgg xxclick' >选择消息</a></td>"
																  
													  if('' == editbt || editbt == null || editbt == undefined){
														 editxxtj += " <td  id='gjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre2' type='hidden' value='' /> <a href='javascript:;' class='xxljgg xzclick' >选择广告</a></td>"
																  }else{
														 editxxtj += " <td  id='gjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre2' type='hidden' value='" + editHref + "' /> <a href='javascript:;' class='xxljgg xzclick' >"+editbt+"</a></td>"
													 } 
													 editxxtj += "<td class='lxactive' id='jjp"+i+"'><input class='jpinput' name='jumpaddre3' type='hidden' value='' /> <a href='javascript:;' class='xxljgg jhyclick' >选择聚合页</a></td>"
													 +" <td class='lxactive'  id='djp"+i+"'><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value='' style='width:30%;'/></td>"
												   +"</tr>"
									} 
									if(editLx==3){
										
										editxxtj += "   <input class='' name='lx" + i + "' type='radio'  id='xxlx" + i + "' value='1' onclick='qhlx(this,&apos;xjp"+i+"&apos;)'/><label for='xxlx" + i + "'>消息通知</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='gglx" + i + "' value='2' onclick='qhlx(this,&apos;gjp"+i+"&apos;)'/><label for='gglx" + i + "'>广告</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='jhylx" + i + "' checked value='" + editLx + "'  onclick='qhlx(this,&apos;jjp"+i+"&apos;)'/><label for='jhylx" + i + "'>聚合页</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='dzlx" + i + "' value='4' onclick='qhlx(this,&apos;djp"+i+"&apos;)'/><label for='dzlx" + i + "'>地址</label>"
												 +" </td>"  
												 +" <td  rowspan='3' style='vertical-align:middle;' >"
												 +"<span class='ydicon'><image src='images/sm_01.png' width='18' onclick='zhidingCk(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_02.png' width='18' onclick='moveUpModule(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_03.png' width='18' onclick='moveDownModule(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_04.png' width='18' onclick='delpmd(this)'></span>"
												 +" </td>"
												 +"</tr>"
												 +"<tr class='jumpa'>"
												 +"		<th>跳转地址：</th>"
												 +		"<td class='lxactive'  id='xjp"+i+"'><input class='jpinput' name='jumpaddre1' type='hidden' value='' /> <a href='javascript:;' class='xxljgg xxclick' >选择消息</a></td>"
												 +"      <td class='lxactive'  id='gjp"+i+"'><input class='jpinput' name='jumpaddre2' type='hidden' value='' /> <a href='javascript:;' class='xxljgg xzclick' >选择广告</a></td>"
																  
													  if('' == editbt || editbt == null || editbt == undefined){
														 editxxtj +=" <td id='jjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre3' type='hidden' value='' /> <a href='javascript:;' class='xxljgg jhyclick' >选择聚合页</a></td>"
																 
													}else{
														 editxxtj += " <td id='jjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre3' type='hidden' value='" + editHref + "' /> <a href='javascript:;' class='xxljgg xzclick' >"+editbt+"</a></td>"
													 } 
													 editxxtj += " <td class='lxactive'  id='djp"+i+"'><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value='' style='width:30%;' /></td>"
												 +"</tr>"
									}
									if(editLx==4){
										
							 
										editxxtj += "   <input class='' name='lx" + i + "' type='radio'  id='xxlx" + i + "' value='1' onclick='qhlx(this,&apos;xjp"+i+"&apos;)'/><label for='xxlx" + i + "'>消息通知</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='gglx" + i + "' value='2' onclick='qhlx(this,&apos;gjp"+i+"&apos;)'/><label for='gglx" + i + "'>广告</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='jhylx" + i + "' value='3'  onclick='qhlx(this,&apos;jjp"+i+"&apos;)'/><label for='jhylx" + i + "'>聚合页</label>"
												 +"     <input class='' name='lx" + i + "' type='radio'  id='dzlx" + i + "' checked value='" + editLx + "' onclick='qhlx(this,&apos;djp"+i+"&apos;)'/><label for='dzlx" + i + "'>地址</label>"
												 +" </td>"  
												 +" <td  rowspan='3' style='vertical-align:middle;' >"
												 +"<span class='ydicon'><image src='images/sm_01.png' width='18' onclick='zhidingCk(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_02.png' width='18' onclick='moveUpModule(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_03.png' width='18' onclick='moveDownModule(this)'></span>"
												 +"<span class='ydicon'><image src='images/sm_04.png' width='18' onclick='delpmd(this)'></span>"
												 +" </td>"
												 +"</tr>"
												 +"<tr class='jumpa'>"
												 +"		<th>跳转地址：</th>"
												 +     "<td class='lxactive'  id='xjp"+i+"' ><input class='jpinput' name='jumpaddre1' type='hidden' value='' /> <a href='javascript:;' class='xxljgg xxclick' >选择消息</a></td>"
												 +"    <td class='lxactive'  id='gjp"+i+"'><input class='jpinput' name='jumpaddre2' type='hidden' value='' /> <a href='javascript:;' class='xxljgg xzclick' >选择广告</a></td>"
												 +"    <td  class='lxactive' id='jjp"+i+"'><input class='jpinput' name='jumpaddre3' type='hidden' value='' /> <a href='javascript:;' class='xxljgg jhyclick' >选择聚合页</a></td>"
												 
												 if('' == editbt || editbt == null || editbt == undefined){
													editxxtj +=" <td  id='djp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value='" + editHref + "' style='width:30%;'/></td>"
												  }else{
													editxxtj += " <td  id='djp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value=''  style='width:30%;'/></td>"
												} 
												editxxtj += "</tr>" 
									}  
								editxxtj +=" </tr>"
								+"	 <tr>"
								+"		<th>描述：</th>"
								+"		<td>"  
								+"			<input name='' type='text'  class='pmddesc' value='"+editText +"'   />"
								+"		</td>"
								+"	</tr>"; 
							editxxtj +="</table>"
								+"		</li>";
								editHtmlImg+=editxxtj;
						}
						editHtmlImg +="</ul>";
					$('.pmdTips #pmdhtmlCon').html('').append(editHtmlImg);//modals3图片广告弹窗使用
				});
			});
	
			//跑马灯文本保存
			$(".pmdmodal").on('click','.savepmd',function(e) {
				var imgNum = $(this).parents('.pmdmodal').children(".pmddes").find("li").length; 
				var editPmd='';
				for(var i= 0 ;i<imgNum;i++){ 
				
					var btnm = $(this).parents('.pmdmodal').children(".pmddes").find('input[name="lx'+(i+1)+'"]:checked').val();//类型 
					var implj = $(this).parents('.pmdmodal').children(".pmddes").find(".shactive .jpinput").eq(i).val();//跳转地址
					var descpmd = $(this).parents('.pmdmodal').children(".pmddes").find(".pmddesc").eq(i).val();//描述
					 
					editPmd +=  '<div class="swiper-slide">\
					<input type="hidden" name="xxtzlx'+(i+1)+'" value="'+btnm+'">\
					<input type="hidden" name="jumpadres1" value="'+implj+'">\
					<input type="hidden" name="destxt1">\
					<a href="'+implj+'">\
						<span class="index-message-text limit1 c333">'+descpmd+'</span>\
					</a>\
				</div>'; 
				 
				}
				
				$(pmdthisClickObj).find('.xxpmd .msgwrap').html(editPmd);
			 
				closeC('.pmdTips');//保存成功后关闭
			});
	
			//滑动元素文本编辑弹窗
			var hdysthisClickObj=''; //该变量在保存中也会用到
			$(demo).on('click','.hdysEdit',function(e) {
				hdysthisClickObj = $(this).parent().parent(),//edit父标签的父标签
				that=$(this);
				a = that.parent().next();//view
					e.preventDefault();
					$('.coMmodals').show();//展示蒙版
				var p=$(this).parent().parent();
				$('.hdysTips').fadeIn(200, function() {
					var layer=$('.hdysmodal',this);
					layer.css({
						'margin-top':-(layer.height())/2,
						'margin-left':-(layer.width())/2
					}).fadeIn(100); 
					// var editzs = p.find('.hdview .hdyspageNum').val();//每页组数也可以用这个获取，前提是页面有默认值
					var editsh = p.find('.hdview .hdysifsfy').val();//显示隐藏
					var imgNum = p.find('.hdview .swiper-slide').length;//遍历
					var editHtmlImg = "<div class='titdes'>"
									+"	<div class='pageEve'><span>每页展示组数：</span><input type='number' value='"+imgNum+"'></div>"
									if(editsh == '0'){
										editHtmlImg+="	<div class='fybtnra'><span>翻页按钮：</span><input type='radio' name='rfyi' id='rfyins' class='nninput' style='width:16px; height:16px;'><label for='rfyins'>显示</label><input type='radio' class='nninput'  name='rfyi'id='rfyind' style='width:16px; height:16px;' checked><label for='rfyind'>隐藏</label></div>"
									}
									if(editsh == '1'){
										editHtmlImg+="	<div class='fybtnra'><span>翻页按钮：</span><input type='radio' name='rfyi' id='rfyins' class='nninput' style='width:16px; height:16px;' checked><label for='rfyins'>显示</label><input type='radio' name='rfyi' class='nninput' id='rfyind' style='width:16px; height:16px;'><label for='rfyind'>隐藏</label></div>"
									}
									
									
									editHtmlImg+="</div>"  
									+"<ul class='uldes'>"
						for(var i= 0 ;i<imgNum;i++){
							//滑动类型：左右滑动，翻页滑动 -不要了； 
							
							//遍历slide里面的a标签
							var pa = p.find('.hdview .swiper-slide').eq(i).children("a");
							var aNum = pa.length;
							var editxxtj = "<li class='hdys_li' style='padding:0px;'>"
									+"  <a class='delz '  onclick='removeHdz(this)' ><img src='images/rulecl.png' alt='删除' class='del-cltb'></a>"
							for(var j= 0 ;j<aNum;j++){
								// 每页展示组数；翻页按钮展示：隐藏
							// console.log( p.find('.hdview .swiper-slide').children('input')); 
							var editImg = pa.children("img").attr("src"),//超链接标题
							editHref = pa.prop("href"); //获取文本 attr也行，最好用prop
	
								var smeditys ="<table class='hdystable' border='0' cellspacing='0' cellpadding='0'>"
								+"				<tr>"
								+"					<th>图片：</th>"
								+"					<td class='hdystd_pic'>"
								+"						<div class='uploadImg normalData'>"
								+"							<img src='images/images.png' alt='' class='imagesZw' style='display:none;'>"
								+"							<img src='"+editImg+"' alt='' class='imgPerview'>"
								+"							<p class='opacityP j-deleteImg'>删除</p>"
								+"							<input type='file' class='imgInput'>"
								+"						</div>"
								+"                     <a class='cltb' onclick='removeHdys(this)'><img src='images/minus.png' alt='删除' class=''></a>"
								+"					</td>"	
								+"				</tr>"
								+"				<tr class='hdysad'>"
								+"					<th>跳转地址：</th>"
								+"					<td class=''>"
								+"						<div class='hdysjpdiv'>"
								+"							<input type='text' class='hdysin' name='hdysin' placeholder='请输入跳转地址' value='"+editHref+"'/>"
								+"							<button  class='hyxzgg'>选择广告/聚合页</button>"
								+"						</div>"
								+"					</td>"					  
								+"				</tr>" 
								+"            </table>"
								
								editxxtj+=smeditys;
							} 
							editxxtj+="		<p class='hdystjp'><a href='javascript:;' class='cmsBtna' onclick='addOne(this)'>添加</a></p>"
									+"		</li>";
								editHtmlImg+=editxxtj;
						}
						editHtmlImg +="<li class='tjzdiv' onclick='addList(this)'>+添加组</li></ul>";
						
	
					$('.hdysTips #hdyshtmlCon').html('').append(editHtmlImg);//modals3图片广告弹窗使用
					var wh = $(".hdysdes .uldes li").width()*imgNum;//计算li的总宽度赋值给ul
						$(".hdysdes .uldes").css("width",wh+$(".hdysdes .uldes li").width());
				});
			});
	
			//滑动元素保存
			$(".hdysmodal").on('click','.savehdys',function(e) { 
				var par = $(this).parents('.hdysmodal').children("#hdyshtmlCon").find(".hdys_li");
				var imgNum = par.length; 
				var editHdys='';
				// <input type="hidden" class="hdyspageNum" value="5">
				// <input type="hidden" class='hdysifsfy' value="1"/>
				var zs  = $(this).parents(".hdysmodal").find(".pageEve").children("input").val();//每页组数
				var ifs = $(this).parents(".hdysmodal").find(".fybtnra").children("input[type=radio]:checked").val();//显示不显示 
				$(hdysthisClickObj).find(".hdyspageNum").val(zs);
				$(hdysthisClickObj).find(".hdysifsfy").val(ifs);
				for(var i= 0 ;i<imgNum;i++){//遍历弹窗的li标签
					// var btnm = $(this).parents('.hdysmodal').children(".hdysdes").find('input[name="lx'+(i+1)+'"]:checked').val();//类型 
					 
					var tNum = par.eq(i).children("table").length;//遍历li标签下面的table 
					editHdys += '<div class="swiper-slide">'
					for(var j= 0 ;j<tNum;j++){
						var imga = par.eq(i).children("table").eq(j).find(".imgPerview").attr("src");//这里需要判断下，如果图片没有上传默认保存的时候保存个默认图片
						var tpc = '<a href="#" class="">\
							<img src="'+imga+'" alt="" class="" >\
						</a>\
						';
						editHdys +=tpc;
					}
					editHdys +='</div>' ; 
				}
				
				$(hdysthisClickObj).find('.hdview .hdyswrap').html(editHdys);
				closeC('.hdysTips');//保存成功后关闭
			});
	
	
			//搜索元素编辑保存 
			var searchthisClickObj=''; //该变量在保存中也会用到
			$(demo).on('click','.searchEdit',function(e) {
				searchthisClickObj = $(this).parent().parent();//edit父标签的父标签
				var sthat=$(this);
				a = sthat.parent().next();//view
					e.preventDefault();
					$('.coMmodals').show();//展示蒙版
				var p=$(this).parent().parent();
				$('.searchTips').fadeIn(200, function() {
					var layer=$('.searchmodal',this);
					layer.css({
						'margin-top':-(layer.height())/2,
						'margin-left':-(layer.width())/2
					}).fadeIn(100);  
					
					var s = searchthisClickObj.find(".searInput").attr("placeholder"); 
					var sel = searchthisClickObj.find(".hidselect").val(); 
					console.log(s);
					$("#searTxt").val(s);
					$("#searSel").val(sel);
				});
			});
	
			//滑动元素保存
			$(".searchmodal").on('click','.savesearch',function(e) {  
				searchthisClickObj.find(".searInput").attr("placeholder",$("#searTxt").val()); 
				searchthisClickObj.find(".hidselect").val($("#searSel").val()); 
				closeC('.searchTips');//保存成功后关闭
			});
	
			// IOP 楼层参数配置
			$("input[name='xyban']").change(function(){ 
				var Xvalue = $('input[name="xyban"]:checked').val();
				if(Xvalue == "y"){
					$('.anwzF').show();
				}else{
					$('.anwzF').hide();
					$('.dbzsF').hide();
				};
			}); 
			$("input[name='anwz']").change(function(){ 
				var Avalue = $('input[name="anwz"]:checked').val();
				if(Avalue == "y"){
					$('.dbzsF').hide();
				}else{
					$('.dbzsF').show();
				}
			});
	});
	

	//音频上传并播放20200110add
	$(document).on("change",".btnxz input[type=file]" ,function(){
		$(this).parents(".uploader").find(".filename").val(getImageUrl(this.files[0]));
		$(this).parents(".uploader").next(".audio_div").show();
		$(this).parents(".uploader").next(".audio_div").children("audio").attr('src',getImageUrl(this.files[0])); 
		var fry_audio=$(this).parents(".uploader").next(".audio_div").children("audio").get('0');
		fry_audio.load();
	});
	
	//视频上传上传-2020-11-6 新增
	$(document).on("change",".btnxzsp input[type=file]" ,function(){
		$(this).parents(".uploader").find(".filename").val(getImageUrl(this.files[0]));
		$(this).parents(".uploader").next(".video_div").show();
		$(this).parents(".uploader").next(".video_div").children("video").attr('src',getImageUrl(this.files[0])); 
	});
	
	//跑马灯置顶等切换样式
	// $(document).on("click",".ydicon" ,function(){
	// 	console.log($(this).addClass("active"));
	// 	 $(this).addClass("active").siblings("span").removeClass("active");
	// });
	
	//是否展示音频图片
	function ifshowad(obj){
		
		if ($(obj).val()==0){//不展示
			 $(obj).parents(".jtggwtr").next(".jtggwtr").hide();
		}else{//展示
			$(obj).parents(".jtggwtr").next(".jtggwtr").show();
		}
	
	}
	// 是否展示海报图片
	function hbzs(obj){
		if($(obj).val() == "y"){
			$('.hbtpF').show();
		}else{
			$('.hbtpF').hide();
		}
	}
	
	//获取file路径的方法可挪到方法体外面
	function getImageUrl(file) {
		var url = null;
		if (window.createObjcectURL !== undefined) {
			url = window.createOjcectURL(file);
		} else if (window.URL !== undefined) {
			url = window.URL.createObjectURL(file);
		} else if (window.webkitURL !== undefined) {
			url = window.webkitURL.createObjectURL(file);
		}
			return url;
		};
	var hdysOne = '<table class="hdystable" border="0" cellspacing="0" cellpadding="0">\
	<tbody>\
	<tr>\
	<th>图片：</th>\
	<td class="hdystd_pic">\
	<div class="uploadImg normalData">\
		<img src="images/images.png" alt="" class="imagesZw"  />\
		<img src="" alt="" class="imgPerview" style="display:none;"/>\
		<p class="opacityP">上传图片</p>\
		<input type="file" class="imgInput" />\
	</div>\
	<a class="cltb" onclick="removeHdys(this)"><img src="images/minus.png" alt="删除" class="" /></a>\
	</td>\
	</tr>\
	<tr class="hdysad">\
	<th>跳转地址：</th>\
	<td class="">\
	<div class="hdysjpdiv">\
		<input type="text" class="hdysin" name="hdysin" placeholder="请输入跳转地址" value="" />\
		<button class="hyxzgg">选择广告/聚合页</button>\
	</div>\
	</td>\
	</tr>\
	</tbody>\
	</table>\
	';
	//添加单个元素
	function addOne(a){
	$(a).parent("p").before(hdysOne); 
	}
	
	var hdysList = '<li class="hdys_li" style="padding:0px;"> <a class="delz " onclick="removeHdz(this)"><img src="images/rulecl.png" alt="删除" class="del-cltb" /></a>\
	<table class="hdystable" border="0" cellspacing="0" cellpadding="0">\
	 <tbody>\
	  <tr>\
	   <th>图片：</th>\
	   <td class="hdystd_pic">\
		<div class="uploadImg normalData">\
		 <img src="images/images.png" alt="" class="imagesZw" style="display:none;" />\
		 <img src="images/newindeximg/rrico_1.png" alt="" class="imgPerview" />\
		 <p class="opacityP j-deleteImg">删除</p>\
		 <input type="file" class="imgInput" />\
		</div> <a class="cltb" onclick="removeHdys(this)"><img src="images/minus.png" alt="删除" class="" /></a> </td>\
	  </tr>\
	  <tr class="hdysad">\
	   <th>跳转地址：</th>\
	   <td class="">\
		<div class="hdysjpdiv">\
		 <input type="text" class="hdysin" name="hdysin" placeholder="请输入跳转地址" value="http://127.0.0.1:8080/#" />\
		 <button class="hyxzgg">选择广告/聚合页</button>\
		</div> </td>\
	  </tr>\
	 </tbody>\
	</table>\
	<p class="hdystjp"><a href="javascript:;" class="cmsBtna" onclick="addOne(this)">添加</a></p>\
	</li>\
	';
	//添加组
	function addList(a){ 
		$(a).before(hdysList);
		var th = $(a).parent("ul").children("li").length;
		var w =  $(a).parent("ul").children("li").eq(0).width();
		var wh =w*th;//计算li的总宽度赋值给ul
		console.log(wh);
		 $(".hdysdes .uldes").css("width",wh);
	}
	
	
	 //新公共关闭按钮
	function closeC(a){
		$('.coMmodals').hide();//隐藏公共蒙层
		$(a).fadeOut();//隐藏弹层
	}
	
	//复制按钮
	function copy() {
		var text = document.getElementById("floorId");
		text.select(); // 选择对象
		document.execCommand("Copy");  
		alert("复制成功");
		return;
	}
	
	//删除轮播图广告js动效：
	function deltab(dd){ 
		$(dd).parents('li').remove(); 
	}
	//前移轮播图广告js动效：
	function qytab(aa){ 
		//获取当前选中节点
		var bar = 'lbt_li';//class
		if($(aa).parents('.'+ bar).prev('.'+bar).html() != undefined){//判断是否在最前面
			var obj = $(aa).parents('.'+bar).clone(true);//克隆当前标签
			$(aa).parents('.'+bar).prev().before(obj);//放置克隆过的标签，放到前一个位置
			$(aa).parents('.'+bar).remove();//删除被克隆标签
			// initStore();//重新排序
		}else{
			console.log('亲，现在已是最前面的哦，不能再前移了...');
		}
	}
	
	function showggjh(a){ 
		if(a == "ggtable"){
			$(".ggtable").show();
			$(".jhytable").hide();
		}else{
			$(".jhytable").show();
			$(".ggtable").hide();
		}
	}
	
	
	 
	 
	   
	
	//轮播图片广告弹层追加
	function tbplus(a){ 
		//增加前 lt获取已有li的个数
		var lbtth = $(a).parents(".nrks").find(".cont_list").children("li").length;
		lbtth = lbtth+1; 
		initLbt(lbtth);  
	}
	function initLbt(lbtth){ 
	 
	$("#c_1").append("<li class='lbt_li'>"
	+"				<table class='intable' border='0' cellspacing='0' cellpadding='0'>"
	+"					<tr>"
	+"						<th>标题：</th>"
	+"						<td><input class='inputtxt lbtbt' name='' type='text' /></td>"
	+"					</tr>"
	+"                 <tr class=''>"
	+"				       <th>关联广告：</th>"
	+"				       <td><input type='radio' name='ifglgg"+lbtth+"' id='ifglgg"+lbtth+"' value='1' class='ifglgg nninput ' checked onclick='qhglgg(this,&apos;1&apos;)'/><label for='ifglgg"+lbtth+"' class='ifdllb'>是</label>"
	+"                        <input type='radio' name='ifglgg"+lbtth+"' id='fglgg"+lbtth+"' value='0' class='ifglgg nninput' onclick='qhglgg(this,&apos;0&apos;)'/><label for='fglgg"+lbtth+"' class='ifdllb'>否</label></td>"
	+"			        </tr>"
	+"					<tr class='trLj'>"
	+"						<th>跳转链接：</th>"
	+"						<td><input class='inputtxt lbtlj' name='' type='text' /></td>"
	+"					</tr>"
	+"				    <tr class='lbtxzgg' style='display:none;'>"
	+"					    <th>选择广告：</th>"
	+"					    <td><a href='javascript:;' class='xxljgg' style='line-height:24px; height:24px;'>选择广告</a></td>"
	+"				    </tr>"
	+"					<tr>"
	+"						<th>轮播图片：</th>"
	+"						<td>"
	+"							<span class='zsp pic_span' >"
	+"								<a href='javascript:;' class='llbtn cllBtn'>浏览</a> "
	+"								<input name='' type='file'  class='upload file' id='txtUploadFile' size='1'/>"
	+"							</span>"
	+"                     <div class='yulanImg pic_img '><img src='images/demo.jpg' /></div>"
	+"						</td>"
	+"					</tr>"
	+"					<tr>"
	+"						<th></th>"
	+"						<td class='ydtd'>"
	+"							<a href='javascript:;' onclick='deltab(this)' class='llbtn j-delete cee4358bb'>移除</a>&nbsp;&nbsp;&nbsp;&nbsp;"
	+"							<a href='javascript:;' onclick='qytab(this)' class='llbtn  c3c9be1bb'>前移</a>"
	+"						</td>"
	+"					</tr>"
	+"				</table>"
	+"			</li>");
	
	}
	
	 
		
	
	
	//小黑窗
	function toast(text){
		var toast = document.createElement("div");
		toast.id = "toast";
		toast.style.padding = "6px";
		toast.style.position = "fixed";
		toast.style.top = toast.style.left = "50%";
		toast.style.transform = 'translate(-50%,-50%)';
		toast.style.backgroundColor = "#000";
		toast.style.fontSize="14px";
		toast.style.color = "#fff";
		toast.style.borderRadius="5px";
		toast.style.zIndex = "9998";
		toast.innerHTML=text;
		document.body.appendChild(toast);
		setTimeout(function(){
			document.body.removeChild(toast);
		},1500)
	}
	
	
	//移除td
	function delqyxq(a){
		$(a).parent("td").parent("tr").remove();
	} 
	
	//跑马灯删除
	function delpmd(a){
		$(a).parents("li").remove();
	}
	 
	//跑马灯增加
	function addpmd(a){
		//增加前 lt获取已有li的个数
		var lt = $(a).parents(".pmdmodal").find(".pmddes").children("ul").children("li").length;
	 
		lt = lt+1;
		//新增追加完成后需要遍历初始化各列id等 由于时间关系 ，这里不做详细处理。时间实在太紧张了。
		initpmd(a,lt);
	}
	
	 
	function initpmd(a,lt){
			
			var c = '<li class="pmd_li">\
				<table class="pmdtable" border="0" cellspacing="0" cellpadding="0">\
					<tbody>\
						<tr>\
							<th style="border-right: 1px solid #d7d7d7;text-align: center;" rowspan="3">'+lt+'</th>\
							<th>类型：</th>\
							<td>\
								<input class="" name="lx'+lt+'" type="radio" id="xxlx'+lt+'" checked value="'+lt+'" onclick="qhlx(this,&apos;xjp'+lt+'&apos;)">\
								<label for="xxlx'+lt+'">消息通知</label>\
								<input class="" name="lx'+lt+'" type="radio" id="gglx'+lt+'" value="'+lt+'" onclick="qhlx(this,&apos;gjp'+lt+'&apos;)">\
								<label for="gglx'+lt+'" >广告</label>\
								<input class="" name="lx'+lt+'" type="radio" id="jhylx'+lt+'" value="'+lt+'" onclick="qhlx(this,&apos;jjp'+lt+'&apos;)">\
								<label for="jhylx'+lt+'" >聚合页</label>\
								<input class="" name="lx'+lt+'" type="radio" id="dzlx'+lt+'" value="'+lt+'" onclick="qhlx(this,&apos;djp'+lt+'&apos; )">\
								<label for="dzlx'+lt+'" >地址</label>\
							</td>\
							<td rowspan="3" style="vertical-align:middle;"><span class="ydicon"><img src="images/sm_01.png" width="18" onclick="zhidingCk(this)"></span><span class="ydicon"><img src="images/sm_02.png" width="18" onclick="moveUpModule(this)"></span><span class="ydicon"><img src="images/sm_03.png" width="18" onclick="moveDownModule(this)"></span><span class="ydicon"><img src="images/sm_04.png" width="18" onclick="delpmd(this)"></span> </td>\
					</tr>\
					<tr class="jumpa">\
						<th>跳转地址：</th>\
						<td class="shactive"  id="xjp'+lt+'" ><input class="jpinput" name="jumpaddre'+lt+'" type="hidden" value="" /> <a href="javascript:;" class="xxljgg xxclick" >选择消息</a></td>\
						<td class="lxactive" id="gjp'+lt+'"><input class="jpinput" name="jumpaddre'+lt+'" type="hidden" value="" /> <a href="javascript:;" class="xxljgg xzclick" >选择2</a></td>\
						<td class="lxactive" id="jjp'+lt+'"><input class="jpinput" name="jumpaddre'+lt+'" type="hidden" value="" /> <a href="javascript:;" class="xxljgg xzclick"  >选择3</a></td>\
						<td class="lxactive" id="djp'+lt+'"><input class="jpinput" name="jumpaddre'+lt+'" placeholder="请输入跳转地址" style="width:30%;" type="text" value="" /></td>\
					</tr>\
					<tr>\
					<th>描述：</th>\
					<td>\
					<input name="" type="text" placeholder="请输入描述" class="pmddesc" value="">\
					</td>\
					</tr>\
				</tbody>\
			</table>\
			</li>\
			';
			
		$(a).parents(".pmdmodal").find(".pmddes").children("ul").append(c);
	
		
	}
	
	//重新排序跑马灯 - 后续处理
	function initSortPmd(obj){
		var xhli = $(obj).parents("li").parent("ul").find("li");
		$.each(xhli,function(k,v){
			 
			$(this).children("table").children("tbody").children("tr:first-child").children("th:first-child").text(k+1); 
			// console.log($(this).children("table").children("tbody").children("tr:first-child").eq(1).children("th:first-child").text());
		});
	}
	
	
	//跑马灯模块置顶方法 
	function zhidingCk(obj){ 
		var current = $(obj).parents("li");
		if (current.index() != 0) { 
			$(obj).parents("li").parent("ul").prepend(current);
			initSortPmd(obj);
		}else{
			alert("已经置顶啦~");
			return;
		}
	}
	
	  // 跑马灯模块上移
	  function moveUpModule(obj) { 
		var current = $(obj).parents("li"); //获取当前div模块
		var prev = current.prev();  //获取当前div前一个元素
		console.log(current.index());
		if (current.index() > 0) { 
		  current.insertBefore(prev); //插入到当前div前一个元素前 
		  initSortPmd();
		}else{
		  alert("亲，已经是最上面了，不能上移了");
		} 
	  } 
	  
	  // 跑马灯模块下移 
	  function moveDownModule(obj) {
		var current = $(obj).parents("li"); //获取当前div模块
		var next = current.next(); //获取当前div后面一个元素
		if (next.length>0) { 
		  current.insertAfter(next);  //插入到当前div后面一个元素后面 
		  initSortPmd();
		}else{
		  alert("亲，已经是最下面了，不能下移了");
		} 
	  } 
	
	/* 2020-11-9 新增 开始 */
	//置顶方法 
	function tablezdCk(obj){ 
		var current = $(obj).parents("tr");
		if (current.index() != 0) { 
			$(obj).parents("tr").parent("tbody").prepend(current);
			initSortPmd(obj);
		}else{
			alert("已经置顶啦~");
			return;
		}
	}
	
	//置底方法
	function tableendCk(obj){ 
		var current = $(obj).parents("tr");
		var nextAll = current.nextAll();
		if (nextAll.index() > 0) { 
			$(obj).parents("tr").parent("tbody").append(current);
		 
		}else{
			alert("已经到底啦~");
			return;
		}
	}
	
	  // 模块上移
	  function tableUpModule(obj) { 
		var current = $(obj).parents("tr"); //获取当前div模块
		var prev = current.prev();  //获取当前div前一个元素
		console.log(current.index());
		if (current.index() > 0) { 
		  current.insertBefore(prev); //插入到当前div前一个元素前 
		 
		}else{
		  alert("亲，已经是最上面了，不能上移了");
		} 
	  } 
	  
	  // 模块下移 
	  function tableDownModule(obj) {
		var current = $(obj).parents("tr"); //获取当前div模块
		var next = current.next(); //获取当前div后面一个元素
		if (next.length>0) { 
		  current.insertAfter(next);  //插入到当前div后面一个元素后面 
		 
		}else{
		  alert("亲，已经是最下面了，不能下移了");
		} 
	  } 
	/* 2020-11-9 新增 结束 */
	
	//切换类型tabraido
	function qhlx(t,a){ 
		$(t).parents("tr").next().children("#"+a).removeClass("lxactive").addClass("shactive");//展示对应的id
		$("#"+a).siblings("td").addClass("lxactive").removeClass("shactive");//同级tdnone
	
	}
	
	
		//点击切换是否关联广告轮播图使用 lbtxzgg
		function qhglgg(dqys,gl){
			console.log($(dqys).parent("tr").next(".trLj"));
			if(gl=='0'){//1是关联广告 0 不是关联广告
				$(dqys).parent("td").parent("tr").next(".trLj").show();
				$(dqys).parent("td").parent("tr").next("tr").next(".lbtxzgg").hide();
			}
			if(gl=='1'){
				$(dqys).parent("td").parent("tr").next("tr").next(".lbtxzgg").show();
				$(dqys).parent("td").parent("tr").next(".trLj").hide();
			}
		}
	
		//新底部导航菜单名称选择切换方法： - 废弃了
		// function hyqhNm(dt,d){ 
		// 	if(d == '0'){
		// 		$(dt).parent("dd").find(".zdyinput").removeClass("zdyhi");
		// 		$(dt).parents(".whytr").find(".tjlx_div").show();
		// 	}else{
		// 		$(dt).parent("dd").find(".zdyinput").addClass("zdyhi");
		// 		$(dt).parents(".whytr").find(".tjlx_div").hide();
		// 	}
		// }
	
		//无会员菜单跳转类型切换方法：  
	function hyjpqhNm(t,a){
		$(t).parents("dd").find("."+a).removeClass("ndis").addClass("disb");
		$(t).parents("dd").find("."+a).siblings(".hyqhdiv").addClass("ndis").removeClass("disb");//同级tdnone
	
	}
	
	//新底部导航移除
	function delwhy(a){
		$(a).parent("td").parent("tr").remove();
		//删除后重新排序菜单
	}
	
	//会员楼层展开功能 
	function sqzklc(aa){
		$(aa).parent(".ctrl-btns").next(".bigViewBox").children(".row").slideToggle();
		if($(aa).text()=="收起"){
			$(aa).text("展开");
			var nm = $(aa).parent(".ctrl-btns").prev("span").text();
			$(aa).parent(".ctrl-btns").next(".bigViewBox").append("<div class='titlc' style='text-align:center;font-size: 13px;padding: 2px;min-height: 0.3rem;line-height: 0.3rem;'>"+nm+"</div>");
		 }else{
			$(aa).text("收起");
			$(aa).parent(".ctrl-btns").next(".bigViewBox").children(".titlc").remove();
	 
		}
		
	}
	
	//滑动元素删除方法1223add
	function removeHdys(hdys){
		$(hdys).parents("table").remove();
	}
	
	function removeHdz(hdyz){
		$(hdyz).parent("li").remove();
	}
	
	
	//首次进入页面加载事件 
	function yjzyp(obj){
		var audio = $('.media');//加载静态广告音频播放方法
		audio[0].play();
		$(".audio_btn").bind('click', function() {//音频绑定暂停和启动时间
			$(this).hasClass("off") ? ($(this).addClass("play_yinfu").removeClass("off"),$(".yinfu").addClass("rotate"), $(".media")[0].play()) : ($(this).addClass("off").removeClass("play_yinfu"), $(".yinfu").removeClass("rotate"),
			$(".media")[0].pause());//暂停
		});
	}
	

	/* 20211130 add */
	// 便民模块功能前移
	function moveBfModule(obj) { 
		var current = $(obj).parents("li"); //获取当前div模块
		var prev = current.prev();  //获取当前div前一个元素
		console.log(current.index());
		if (current.index() > 0) { 
		  current.insertBefore(prev); //插入到当前div前一个元素前 
		 
		}else{
		  alert("亲，已经是最前面了，不能前移了");
		} 
	} 

	//20211120删除便民模块元素
	function delodule(obj) { 
	var current = $(obj).parents("li").remove(); //获取当前div模块
		
	}

	 //二级弹窗公共关闭按钮方法
	 function closeCChild(a){
		$(a).fadeOut();//隐藏弹层
	}

//添加便民功能模块 20220128 add 名称排序
function addbmgnmo(data){
	// var listLi = $(data).parents("#bmgnTab").find("#bmmould").children("li");
	// var llen = 0;
	// llen  = listLi.length +1;
	
	var bmgnStr = `<li class="bmmoli">
	<div class="bmmonli_div">
		<div class="bmmotit">
			<div><span class="cred"> * </span><span>便民模块名称：</span></div><input type="text" class="bminput titin" value="">
		</div>
		<div class="bmmotit">
			<div><span>名称排序：</span></div>
			<div class="proj p_left">
			 <span class="active" data-por="1"  onclick="jpor(this)">居左</span><span class="" data-por="2"  onclick="jpor(this)">居中</span>
			</div>
		</div>
		<div class="bmmotit">
			<div><span class="cred"> * </span><span>参数值：</span></div>
			<select class="form-control form-control-select input-sm bmcs">`;
			bmgnStr += $("#bmcs").html();
			bmgnStr += `</select>
		</div>
		<div class="bmmotit"><div class=""><span>链接地址：</span></div><input type="text" class="bminput" value=""><span class='jhsp bmjh'>选择广告/聚合页</span></div>
		<div class="bmmotit">
			<div class="">背景图片：</div>
			<div class="upimgdiv">
				<div class="uploadImg normalData" >
					<img src="images/images.png" alt="" class="imagesZw" >
					<img src="" alt="" class="imgPerview">
					<p class="opacityP">上传图片</p>
					<input type="file" class="imgInput">
				</div>
				<span class='cred' style="padding-top: 5px; font-size: 12px;">注:图片格式支持上传jpg/png格式,100KB以内。</span>
			</div>
		</div>
		 
	</div>
	<div class="bm_btn"><a class="cee4358bb" href="javascript:;" onclick="delodule(this)">移除</a><a href="javascript:;" class="c3c9be1bb" onclick="moveBfModule(this)">前移</a></div>
</li>`;
 $("#bmmould").append(bmgnStr);
}

//新增协议模块内容
function addxymo(){
	if($("#dbxyulId").find("li").length >=4){
		alert("最多可添加4个协议哦");
		return;
	}
	var xystr = `<li class="bmmoli">
		<div class="bmmonli_div xymotit">
			<div class=" "><span class="cred"> * </span><span>协议名称：</span></div><input type="text" disabled class="bminput namexy" value=""><span class='  bmjh j_pzxymo'>选择协议</span>
		</div>
		<div class="bm_btn"><a href="javascript:;" class="cee4358bb" onclick="delodule(this)">移除</a></div>
	</li>`;
	$("#dbxyulId").append(xystr);
}

//20211130 add 配置协议功能
$(document).on('click','.j_pzxymo',function() { 
	$('.coMmodals').show();//展示蒙版 
	$('.xymotab').fadeIn(200, function() {//展示元素弹窗编辑
		var layer=$('.xymotab-layer',this);
		layer.css({
			'margin-top':-(layer.height())/2,
			'margin-left':-(layer.width())/2
		}).fadeIn(100); 
		 
		
	});
		 
});

//2021tab前移后移方法增加；
function tabMovebf(obj) { 
	var current = $(obj).parent(".kdli"); //获取当前div模块
	var prev = current.prev();  //获取当前div前一个元素
	 
	if (current.index() > 0) { 
	  current.insertBefore(prev); //插入到当前div前一个元素前
	 
	}else{
	  alert("亲，已经是最前面了，不能前移了");
	} 
} 
//2021tab后移方法增加；
function tabMoveaf(obj) {
	var current = $(obj).parent(".kdli"); //获取当前div模块
	var next = current.next(); //获取当前div后面一个元素
	console.log("next",);
	var aflag = $(next).hasClass("zjLi");
	if (next.length>0 && !aflag) { 
	  current.insertAfter(next);  //插入到当前div后面一个元素后面 
	 
	} else{
	  alert("亲，已经是最后面了，不能后移了");
	} 
}

 
/**
 * 便民元素居中居左切换
 * 是否隐藏参数值 
 * */
function jpor(data){
	$(data).addClass("active").siblings("span").removeClass("active");
}
