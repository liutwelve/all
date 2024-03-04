var pathname=window.location.pathname;
var pathname2=pathname.split("/")[1];
var imgNumStr ;
var intChance = 0;// 删减次数
var cloneSave=0;
var cloneSaveBuWei=0;
var cloneSavepp=0 ;
var cloneSaveBuWeipp=0;
var huixanzhi="";
//记录页面静态数据
var floorModuleMap = new Map();//编辑添加map
var editor;//转盘富文本编辑器
var K = window.KindEditor;//富文本编辑器

/**
 * 2019 - 06 - 11 XQ19042502关于人人E购店铺装修增加我的收藏和用户推荐两个装修元素的需求 我的链接数组
 */
var myHref = new Array('myHrefOrder_我的订单(卖家/买家)','myHrefGrxx_个人信息(卖家/买家)','myHrefDp_我的店铺','myHrefTeam_我的团队',
        'myHrefBankCard_我的银行卡','myHrefIopCx_用户推荐(卖家/买家)','myHrefSc_我的收藏(卖家/买家)','myHrefJl_我的激励',
        'myHrefHb_和包管理','myHrefNewUser_查询拉新用户','myHrefXgmm_修改密码','myHrefWdjl_我的奖励','myHrefJjdqgg_即将到期广告','myHrefxxtz_消息通知','myHreflogin_登录','myHrefhhcx_换号查询','myHrefyhlb_优惠','myHrefsplb_商品列表','myHrefnewsplb_新商品列表','myHrefwtfk_问题反馈',
    'myAppDownload_APP下载数据查询','accountAndSecurity_账户与安全','lyhOrderEval_辽友会订单评价','lyhOrderList_辽友会查看订单');

function deleteTr(t,count){
    var trIndex = $(t).parents('tr').index();
    console.log(trIndex);
    $(t).parents('table').find('tr').eq(trIndex).remove();
    $('.demo .swiper-lnbusiness .swiper-slide').eq(trIndex-1).remove();
    imgNumStr = imgNumStr - 1;
    var jumpType = $(".jumpType");
    for(var i = 0 ; i < jumpType.length ; i ++ ){
        $(jumpType[i]).find(".ljInput").attr("id","ljInput" + (i + 1));
        $(jumpType[i]).find("input[type='radio']").attr("name","linkType" + (i + 1));
        $(jumpType[i]).find(".ggInput").attr("id","ggInput" + (i + 1));
        $(jumpType[i]).find(".jhyInput").attr("id","jhyInput" + (i + 1));
        
        $(jumpType[i]).find("input[type='radio']").eq(0).attr("value","lj" + (i + 1));
        $(jumpType[i]).find("input[type='radio']").eq(1).attr("value","gg" + (i + 1));
        $(jumpType[i]).find("input[type='radio']").eq(2).attr("value","jhy" + (i + 1));
        
    }
    /** * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求 start ** */
    var ggwbms = $('#htmlCon table').find(".ggwbm");
    for(var i = 0 ; i < ggwbms.length ; i ++ ){
        $(ggwbms[i]).find("p").attr("id","goodCodeInput" + (i + 1));
    }
    /** * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求 start ** */
}
function isHideClick(this_) {
    if('1' == $(this_).attr("surePublish")){
        $(this_).attr("surePublish",'2');// 设置为隐藏
        $(this_).html("发布楼层");
        $(this_).closest(".bigFloor").attr("surePublish",'2');// 设置为隐藏
    }else if('2' == $(this_).attr("surePublish")){
        $(this_).attr("surePublish",'1');// 设置为发布
        $(this_).html("隐藏楼层");
        $(this_).closest(".bigFloor").attr("surePublish",'1');// 设置为发布
    };
}
/**
 * 弹出广告选择框
 * 
 * @param sign
 *            标识 1 静态广告 2 滑动菜单
 * @param num
 *            滑动菜单使用 第几个
 */
function chooseAdinfo(sign,num){// 弹出广告id弹窗
    // e.preventDefault();
    jQuery.ajax({
        url: vm.path + "/tWlmDecorate/advertSFList.do" ,// url
        type: "POST",// 方法类型
        // data: $('#pageObjectform').serialize(),
        dataType:'html',
        success:function(data){
            $('.edit-layer4 #zdyHtmlCon').html("");
            $(".zdyHtmlConSign").remove();
            $('.edit-layer4').append("<input type='hidden' value='" + sign + "_" + num + "' class='zdyHtmlConSign'>");
            $('.edit-layer4 #zdyHtmlCon').append(data);
            $('.modalAddMenu2').fadeIn(200, function(e) {
                var layer=$('.edit-layer4',this);
                layer.css({
                    'margin-top':-(layer.height())/2,
                    'margin-left':-(layer.width())/2
                }).fadeIn(100);
            });
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
	
	
}

// 静态广告选择视频
function chooseVideoIfHref(sign,num){
	$("input[name=chooseVideoId][value='" + sign + "']").attr('checked','true');
	$('.modals_csp_video').fadeIn(200, function() {//展示参数配置弹层
		var zhi=$(this).parent().find('.link_href').val();
		huixianJH(zhi);
		huixanzhi=zhi;
		var layer=$('.cspzedit-layer',this);
		layer.css({
			'margin-top':-(layer.height())/2,
			'margin-left':-(layer.width())/2
		}).fadeIn(100);//弹窗位置设置
		//iop推荐弹窗拼串开始
		$('#htmlConVideo').show();//
	});
}
//静态广告选择广告/页面
function chooseAdinfo2(sign,num){// 弹出广告id弹窗
	 $("#floorType").val('link_href');
	 queryPolicyPage();
    $("#tjnr2yy").hide();
	// $(this).parent().find('.link_href').attr("id","jumpNew");
	 $(this).parent().find('.link_href').attr("id","staticUrl");
	 
$('.modals_cspzjhy').fadeIn(200, function() {//展示参数配置弹层
	var zhi=$(this).parent().find('.link_href').val();
	huixianJH(zhi);
	huixanzhi=zhi;
	var layer=$('.cspzedit-layer',this);
	layer.css({
		'margin-top':-(layer.height())/2,
		'margin-left':-(layer.width())/2
	}).fadeIn(100);//弹窗位置设置
	//iop推荐弹窗拼串开始
	$('#htmlConjh').show();//默认展示IOP推荐tab 
});

}

function chooseAlertinfo(sign,num){// 关联弹层弹窗
    jQuery.ajax({
        url: vm.path + "/tWlmAlertAd/adSenseListForDecorte.do" ,// url
        type: "POST",// 方法类型
        dataType:'html',
        success:function(data){
            $('.edit-layer5 #zdyHtmlCon').html("");
            $(".alertHtmlConSign").remove();
            $('.edit-layer5').append("<input type='hidden' value='" + sign + "_" + num + "' class='alertHtmlConSign'>");
            $('.edit-layer5 #zdyHtmlCon').append(data);
            $('.modalAddMenu3').fadeIn(200, function(e) {
                var layer=$('.edit-layer5',this);
                layer.css({
                    'margin-top':-(layer.height())/2,
                    'margin-left':-(layer.width())/2
                }).fadeIn(100);
            });
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}
/**
 * 查询广告名称及广告id
 * 
 * @returns {Boolean}
 */
function radioAdinfo(){
    var sign = $('input:hidden[class="zdyHtmlConSign"]').val();
    var val = $('input:radio[name="radioCheck"]:checked').val();
    var valNext = $('input:radio[name="radioCheck"]:checked').parent().next().next().next().next().html();
    if(val == null){
        alert("请选择广告!");
        return false;
    }
    $('.modalAddMenu2').fadeOut(100, function() {
        $(this).find('.edit-layer4').hide();
    });
    $('#edit-layer4').remove();
    signBefore = sign.split("_")[0];
    if('1' == signBefore){// 静态广告
        $("#staticUrl").val('adid='+$('input[name="radioCheck"]:checked').val());
        $(".staticurlname").remove();
        $("#staticUrl").parent().append("<p class='staticurlname'> 广告名称：" + valNext + "</p>");
    } else if ('2' == signBefore){// 标题
        var menuUrlChoose = $(".menuSign");
        for(var i = 1 ; i < (menuUrlChoose.length + 1); i ++){
            if(i == sign.split("_")[1]){
                $(".menuUrlChoose"+i).val('adid='+$('input[name="radioCheck"]:checked').val());
                $(".staticurlname"+i).remove();
                $(".menuUrlChoose"+i).parent().append("<p class='staticurlname"+i+"'> 广告名称：" + valNext + "</p>");
            }
        }
    }
}

function radioAlertinfo(){
    var sign = $('input:hidden[class="alertHtmlConSign"]').val();
    var val = $('input:radio[name="radioCheck1"]:checked').val();
    floorModuleMap.set(val,"4");
    var valNext = $('input:radio[name="radioCheck1"]:checked').parent().next().next().html();
    var imgUrl = $('input:radio[name="radioCheck1"]:checked').parent().next().next().next().find("img").attr("src");
    var tzUrl = $('input:radio[name="radioCheck1"]:checked').parent().next().next().next().next().html();
    if(val == null){
        alert("请选择广告弹层!");
        return false;
    }
    $('.modalAddMenu3').fadeOut(100, function() {
        $(this).find('.edit-layer5').hide();
    });
    $('#edit-layer5').remove();
    signBefore = sign.split("_")[0];
    $("#alertUrl").val('alertid='+$('input[name="radioCheck1"]:checked').val());
    $(".alerturlname").remove();
    $("#alertUrl").parent().append("<p class='alerturlname' imgUrl='"+imgUrl+"' tzUrl='"+tzUrl+"'> 广告弹层名称：" + valNext + "</p>");
}

var vm = new Vue({
    el:"#vueDemos",
    data:{
        id:'',
        huidu:'',
        decorate:'',
        acceptType:'',
        flags:'',
        path:origin+"/"+pathname2,
        typeList:'',// 大类数据来源
        bqTypeList:'',// 标签数据来源
        policyList:'',
        shure:'',
        policyListbuwei:'',
        shurebuwei:'',
        isShowButton1:'1',
        NextButton:'',
        image:'',
        isHide:'0',
        isHidepp:'',
        adList:'',
        videoList:'',
        noticeList:'',
        goodsList:'',
        type:'',
        aggname:'',
        issuetime:'',
        pagetype:'',
        sysname:'',
        limit:'',
        limitsp:'',
        limit1:'',
        limit3:'',
        limit4:'',
        limit11:'',
        limitIop:'',
        limitAgree:'',
        pageNumber:'',
        pageNumber1:'',
        pageNumber3:'',
        pageNumberVideo:'1',
        pageObject3:'',
        pageObject4:'',
        pageNumbersp:'',
        pageNumber11:'',
        pageNumberIop:'',
        pageNumberAgree:'',
        pageObject:'',
        pageObject1:'',
        pageObjectsp:'',
        pageObject11:'',
        pageObjectIop:'',
        pageObjectAgree:'',
        rowsPerPage:'',
        rowsPerPage11:'',
        rowsPerPageIop:'',
        rowsPerPageAgree:'',
        aggregationList:'',
        aggregationList2:'',
        infoList:'',
        textInfoList:'',
        htmlIndexId:'',
        rowinit1:'',
        rowinit:'',
        rowinit3:'',
        rowinit4:'',
        rowinitIop:'',
        rowinitAgree:'',
        htmlNameHidden:'',
        /** * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求 start ** */
        advertSpaceContainerId:'',
        /** * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求 end **** */
        linkePlusLevelList:'',
        /** * add by zhangkangchuang 20200106 604-XQ20010305关于在人人E购上承载的聚合页面跳转到应用下载页面可实现计酬功能的需求 */
        applyList:'',
        appInfoList:'',
        //2020 1 9 增加搜索元素
        serachHrefList:'',
        templatesList:'',
        pageNumberTemplateId:'',
        limittemplateId:'',
        pageObjecttemplateId:'',
        nameTemplateId:'',
        //mp3回显路径
        mp3EchoDisplayPath:'',
        mp3ReplacePath:'',
        /**addby wangchangxiu 20210422 XQ21040703实现集团IOP推荐的需求start */
        list:'',
        //楼层id。切换时使用
        bigfloorId:'',
        /**addby wangchangxiu 20210422 XQ21040703实现集团IOP推荐的需求end */
        agreeList:'',//协议列表
        searchAgreeTitle:'',//协议标题查询条件
        lastOperatorName:'',//最后一次操作人名称
        lastOperatorCode:'',//最后一次操作人工号
        creatorName:'',//创建人姓名
        creatorCode:''//创建人工号
    },
    mounted: function () {
        this.$nextTick(function () {
            vm.id = GetQueryString("id");// 取值id
            vm.huidu = GetQueryString("huidu");// 取值id
            vm.pagetype = GetQueryString("pageType");
            // vm.acceptType =
            // "";//GetQueryString("acceptType");//共享类型（如果类型为1则不能提交修改和保存）
            vm.loadHtmlIndex();// 初始化侧栏元素和布局
        })
    },
    methods:{
        loadHtmlIndex:function () {
            var url = vm.path + "/tWlmDecorate/loadHtmlIndex.do?huidu="+vm.huidu;
            axios.get(url).then(function (response) {
               if(response.data.flag){
                   // console.log(response.data.loadHtmlIndex.compositionElement);
                   vm.htmlIndexId = response.data.loadHtmlIndex.id;
                   $("#compositionElement").html(response.data.loadHtmlIndex.compositionElement);// 填值
                   index();// 初始化js
                   vm.updateIndex();// 初始化页面
                  vm.updateIndexPolicy();
                  vm.updateIndexSP();

                   /**
                     * 2018-11-29
                     */
                   vm.getIsAcceptType();// 获取有无保存权限
                   vm.getAggregation();// 获取所有可用的主页和聚合页
                   vm.tWlmUpdateTemplateId();
                   vm.getApply();//获取该模板地市下的所用应用
                   vm.getVedio();//获取可用视频
                   /** *************************************************** */
                   queryAgreement();//加载协议
               }
            })
        },
        returnSrc:function(url,arg){
            return url+arg
        },
        getVedio:function () {
            console.log(vm.id);
            var url = vm.path + "/tWlmDecorate/queryVideo.do?id=" + vm.id;
            axios.get(url).then(function (response) {
               if(response.data.flag){
            	   console.log(response.data.applyList)
                   vm.videoList=response.data.videoList;
                   vm.pageObject4=response.data.pageObject;
                   vm.pageNumberVideo=response.data.pageNumber;
	               vm.limit4=response.data.limit;
	               vm.rowinit4=response.data.rowinit;
               }
           })
        },
        getApply:function () {
            console.log(vm.id);
            var url = vm.path + "/tWlmDecorate/getApply.do?id=" + vm.id;
            axios.get(url).then(function (response) {
               if(response.data.flag){
            	   console.log(response.data.applyList)
                   vm.applyList = response.data.applyList;
               }
           })
        },
        getAggregation:function () {
            console.log(vm.id);
            var url = vm.path + "/tWlmDecorate/getAggregation.do?id=" + vm.id;
            axios.get(url).then(function (response) {
               if(response.data.flag){
                   vm.aggregationList = response.data.aggregationList;
               }
           })
        },
        getIsAcceptType:function () {
            console.log(vm.id);
            var url = vm.path + "/tWlmDecorate/getIsAcceptType.do?id=" + vm.id;
            axios.get(url).then(function (response) {
               if(!response.data.flag){
                   vm.acceptType = '1';
                   $("#doc-wrap").attr("v-on:mouseover","");
               } else {
                   $("#save").show();
               }
           })
        },
        updateIndex:function () {
            console.log(vm.id);
            $(".demo").empty();// 清空数据
            var url = vm.path + "/tWlmDecorate/tWlmUpdateIndex.do?id="+vm.id;
            axios.get(url).then(function (response) {
               if(response.data.flag){
            	   //mp3回显路径
                   vm.mp3EchoDisplayPath = response.data.mp3EchoDisplayPath;
                   vm.mp3ReplacePath = response.data.mp3ReplacePath;
                   
                   vm.decorate = response.data.decorate;
                   vm.htmlNameHidden = response.data.decorate.name;
                   /**
                     * * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求
                     * start **
                     */
                   vm.advertSpaceContainerId = response.data.decorate.goodTemplateId;
                   /**
                     * * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求
                     * end ****
                     */
                   console.log(response.data.decorate);
                   if(response.data.decorate.content != "" && response.data.decorate.content != null){
                       $(".doc-wrap .demo").html(response.data.decorate.content);// 填值
                       $(".doc-wrap .col").sortable();
                       
                       $( ".doc-wrap .demo").removeClass('ui-sortable');
                     // 初始化菜单滑动
                       setTimeout(() => {
                    	   $(".demo .swiper-container-meseage").each(function(i,u){
                    		   //初始化菜单滑动
                    		   // ;//添加事件执行的唯一样式
                    		   var swipertabHd = new Swiper('.pmdSort_'+i, { 
                    			   height: 20,
                    			   direction: 'vertical',
                    			   autoplay: 3000,
                    			   observer:true,
                    			   observeParents:true
                    		   });
                    		   $('.swiper-container-meseage .swiper-wrapper')[i].style.transform = 'translate3d(0px, 0px, 0px)';
                    	   });
                          
                         }, 3000)
                       var swiperhxcd = new Swiper('.swiper-hx', {
                           loop:true,
                           slidesPerView: 3, // 头部一行显示多少个 .5表示显示半个
                           paginationClickable: true, // 此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                           spaceBetween: 10, // slide之间的距离（单位px）。
                           freeMode: true, // 默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
                           loop: false, // 是否可循环
                           pagination : '.swiper-pagination' 
                          
                       });
                       var cols=$('.col .col',demo);
                        cols.sortable({// 房间与房间之间的拖拽
                            opacity:0.5,
                            connectWith: '.col .col',
                            handle:'.drag',
                            start: function(e,t) {
                                (sort===0) && (sort++)
                            },
                            stop: function(e,t) {
                              sort--;
                              if(!drag){
                                  // reSlide(t.item.eq(0),1);
                                  // htmlRec();
                                  console.log(333);
                              } 
                            }
                        });
                        var cols=$('.col',demo);
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
//                                    reSlide(t.item.eq(0),1);
//                                    htmlRec();
                                    console.log(4444);
                                };
                                
                            }
                        });
//                        
                    /*    $('.tab_ul .kdli').click(function() {// 实现tab样式切换
                            $(this).addClass('liactive').siblings().removeClass('liactive');
                        });*/
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
                    	/**装修tab页标题优化 开始**/
                        var tabNum = $(".demo .swiper-tabHd").find(".tab_ul").attr("tabNum");
                        var tabType = $(".demo .swiper-tabHd").find(".tab_ul").attr("tabType");
                        var tabNumTupian = 3;
                        if(tabNum){
                        	tabNumTupian = tabNum;
                        }
                        $("#tabtupian option[value='"+tabNumTupian+"']").attr("selected",true);
                        $(".transverseAndLongitudinal option[value='"+tabType+"']").attr("selected",true);
                        /**装修tab页标题优化 结束**/
                        demo.find( ".tabslc" ).tabs();//初始化tabs  
                    	$(".demo .swiper-tabHd").each(function(i,u){
        					if($(u).hasClass("tabHd_"+i)){
        						$(this).addClass("tabHd_"+i);
        					
        						//初始化菜单滑动
        						// ;//添加事件执行的唯一样式
        						var swipertabHd = new Swiper('.tabHd_'+i, { 
//      							slidesPerView: 'auto',
//      							spaceBetween: 10 
        							//	设置slider容器能够同时显示的sliders数量(carousel模式)。
        							//  可以设置为number 或者'auto'则字段根据sliders的宽度来设定数量
        							//	loop模式下如果设置为'auto'还需要设置另一个参数looperdSlides.
        							slidesPerView : tabNumTupian,
        							paginationClickable : false, //此参数设置为true时，点击分页器的指示点分页器会控制swiper切换
        							//spaceBetween : 10 , //slider之间的距离(单位px)。
        							freeMode : false, //默认为false，普通模式：slide滑动时指滑动一格，并自动贴合wrapper，设置为true
        							loop : false //是否可循环
        							
        							
        						});
        						$('.swiper-tabHd .swiper-slide').click(function() { //点击滑动的地方 
        							var ix = parseInt($(this).index());
        							console.log($(this).index());
        							if(ix > 1) {
        								swipertabHd.slideTo(ix - 2, 300, false); //切换到第一个slide，速度为1秒 
        							}
        						});
        					}
        			   });
                        setTimeout(() => {
                            $('.tab_ul')[0].style.transform = 'translate3d(0px, 0px, 0px)';
                          }, 50)
                          
                         
                       //2020 1 16 
                      //音乐播放初始化
                      $(".demo").find('.goodsImage .audio_btn').bind('click', function() {//音频绑定暂停和启动时间
                      	$(this).hasClass("off") ? ($(this).addClass("play_yinfu").removeClass("off"),$(this).children(".yinfu").addClass("rotate"), $(this).find('audio')[0].play()) : ($(this).addClass("off").removeClass("play_yinfu"), $(this).children(".yinfu").removeClass("rotate"),
                      	$(this).find('audio')[0].pause());//暂停
                      });
                        
                   } 
               }
               vm.typeList = response.data.typeList;
               vm.bqTypeList = response.data.bqTypeList;
               
               if(response.data.infoList != '' && response.data.infoList != null && response.data.infoList.length > 0){
                   vm.infoList = response.data.infoList;
                   for(var int = 0; int < vm.infoList.length; int++){
                       vm.textInfoList += "<option value='type"+vm.infoList[int].code+"'>"+vm.infoList[int].value+"</option>";
                   }
               }
               var linkePlusLevelListStr = "选择等级：";
               if(response.data.linkePlusLevelList != '' && response.data.linkePlusLevelList != null && response.data.linkePlusLevelList.length > 0){
                   vm.linkePlusLevelList = response.data.linkePlusLevelList;
                   for(var int = 0; int < vm.linkePlusLevelList.length; int++){
                	   linkePlusLevelListStr += "<input type=\"radio\" class=\"nninput\" " +
                	   		" name=\"hyra\" id=\"hyra" + int + "\" value=\"" + vm.linkePlusLevelList[int].value 
                	   		+ "\" checked><label for=\"hyra" + int + "\">" + vm.linkePlusLevelList[int].name 
                	   		+ "</label>";
                   }
               }
               $("#linkePlusLevelListId").html(linkePlusLevelListStr);
               
               var serachHrefListStr = "";
               if(response.data.serachHrefList != '' && response.data.serachHrefList != null && response.data.serachHrefList.length > 0){
                   vm.serachHrefList = response.data.serachHrefList;
                   for(var int = 0; int < vm.serachHrefList.length; int++){
                	   serachHrefListStr += "<option value=" + vm.serachHrefList[int].value 
                	   		+ ">" + vm.serachHrefList[int].name 
                	   		+ "</option>";
                   }
               }
               $("#searSel").html(serachHrefListStr);

               vm.flags = '1';
               vm.lastOperatorCode = response.data.lastOperatorCode;
               vm.lastOperatorName = response.data.lastOperatorName;
               vm.creatorCode = response.data.creatorCode;
               vm.creatorName = response.data.creatorName;
               qhli();
//               $(".tabslc").tabs();
              reDatasrc();//20211223渲染回显给src值赋值index-src的值
           })
        },
        updateIndexPolicy:function () {
            var url = vm.path + "/tWlmDecorate/tWlmUpdateIndexPolicy.do?id="+vm.id;
            axios.get(url).then(function (response) {
               vm.adList=response.data.adList;
               vm.pageNumber=response.data.pageNumber;
               vm.limit=response.data.limit;
               // vm.isHide=response.data.isHide;
                if(response.data.isHide==""||response.data.isHide==undefined){
                    vm.isHide="0";
                }else {
                    vm.isHide=response.data.isHide;
                }
               vm.pageObject=response.data.pageObject;
               vm.pageNumber1=response.data.pageNumber1;
               vm.limit1=response.data.limit1;
               vm.pageObject1=response.data.pageObject1;
               vm.aggregationList2=response.data.aggregationList;
               vm.rowsPerPage=response.data.pageObject.rowsPerPage;
             /*
                 * vm.currentPagepageObject=response.data.pageObject.currentPage.;
                 * vm.totalPage=response.data.pageObject.totalPage.;
                 * vm.currentPagepageObject=response.data.pageObject.currentPagepageObject.totalPage
                 */
               vm.pageNumber3=response.data.pageNumber3;
               vm.limit3=response.data.limit3;
               vm.pageObject3=response.data.pageObject3;
               vm.appInfoList=response.data.appInfoList;
               vm.list = response.data.list;
               vm.limitIop=response.data.limitIop;
               vm.pageObjectIop=response.data.pageObjectIop;
           })
        },
        updateIndexSP:function () {
            var url = vm.path + "/tWlmDecorate/queryPolicysp.do";
            axios.get(url).then(function (response) {
               vm.goodsList=response.data.goodsList;
               vm.pageNumbersp=response.data.pageNumber;
               vm.limitsp=response.data.limit;
               vm.pageObjectsp=response.data.pageObject;
           })
        },
        tWlmUpdateTemplateId:function () {
            var url = vm.path + "/tWlmDecorate/tWlmUpdateTemplateId.do";
            axios.get(url).then(function (response) {
               vm.templatesList=response.data.list;
               vm.pageNumberTemplateId=response.data.pageNumber;
               vm.limittemplateId=response.data.limit;
               vm.pageObjecttemplateId=response.data.pageObject;
               vm.nameTemplateId=response.data.name;
           })
        },
        updateContent:function (sign) {// 提交方法sign 0 直接提交 1 为鼠标移出提交
            addAttrToTaga();//插码标签
            /**
             * 2018-11-29 XQ189201店铺装修增加聚合页的需求
             */
            if('1' == vm.acceptType){
                return;// 如果是引用共享类型则不提交
            }
            /** **************************************************** */
            if('1' == sign){
                if('1' != vm.flags){
                    return;
                }
            }
            Vue.prototype.$http = axios;
            console.log(vm.id);
            // 是否为聚合页隐藏域
            if("1" == GetQueryString("isIndex")){
                $(".isIndex").remove();
                $("#doc-wrap .demo").append("<input type='hidden' class='isIndex' value='" + GetQueryString("id") + "' isIndex='isIndex' id='isIndex'>");
            }
            // html名隐藏域
            $(".htmlNameHidden").remove();
            $(".doc-wrap .demo").append("<input type='hidden' class='htmlNameHidden' id='htmlNameHidden' value=" + vm.htmlNameHidden + " />");
            /** * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求 start ** */
            // 模板编码（广告位容器ID）隐藏域
            $("#advertSpaceContainerId").remove();
            $(".doc-wrap .demo").append("<input type='hidden' id='advertSpaceContainerId' value=" + vm.advertSpaceContainerId + " />");
            /**
             * * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求 end
             * ****
             */
            $("#pageTypeSpace").remove();
            $("#decoraterIdpage").remove();
            $(".doc-wrap .demo").append("<input type='hidden' id='pageTypeSpace' value=" + vm.decorate.isIndex + " />");
            $(".doc-wrap .demo").append("<input type='hidden' id='decoraterIdpage' value=" + vm.id + " />");
            $("#savehtml").html($('#doc-wrap .demo').html());
            setDatasrc();//保存后设置页面html后赋值给要保存的html
            var content = $("#savehtml").html();
            if(content.indexOf("newPageFlage") == -1){//增加新页面标识
                content += '<input type="hidden" id="newPageFlage" value="newPageFlage">';
            }

            var tsMag = "您正在修改 创建人："+vm.creatorName+"、创建人工号："+vm.creatorCode+";最后修改人："+vm.lastOperatorName+"、最后修改人工号："+vm.lastOperatorCode+" 的页面，确认提交吗？";
            if(!confirm(tsMag)){
                return ;
            }
            var url = vm.path + "/tWlmDecorate/tWlmUpdateContent.do";
            // console.log(content);
            let formData = new FormData();
            formData.append('id', vm.id);
            formData.append('content', content);
            formData.append('sign', sign);
            formData.append("moduleMap",mapToString(floorModuleMap));
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            this.$http.post(url, formData, config).then(function (response) {
              if(response.data.flag){
                    if('0' == sign){//保存成功
                        alert(response.data.message);
                        // window.location.href = vm.path +
                        // "/tWlmDecorate/tWlmDecorateList.do";
                    }
                    console.log(response.data.message);
                }else{
                  if(response.data.code){
                      alert(decodeURIComponent(response.data.message));
                  } else if('0' == sign){
                      alert(response.data.message);
                  }
                    console.log(response.data.message);
                } 
            },function(err) {
                vm.flags = '2';
                if("2" == vm.flags){
                    alert("登录超时，请重新登录！");
                    vm.flags = '3';
                    // window.location.href = vm.path + "/tWlmDecorate/tWlmDecorateList.do";
                    window.history.go(-1);
                }
            })
        },
        // 返回
        returnHistory:function (sign) {
            // window.location.href = vm.path + "/tWlmDecorate/tWlmDecorateList.do";
            window.history.go(-1);
        },
        // 保存侧栏
        saveloadHtmlIndex:function () {
            Vue.prototype.$http = axios;
            console.log(vm.htmlIndexId);
            var compositionElement = $("#compositionElement").html();
            var url = vm.path + "/tWlmDecorate/updateHtmlIndex.do";
            let formData = new FormData();
            formData.append('id', vm.htmlIndexId);
            formData.append('compositionElement', compositionElement);
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            this.$http.post(url, formData, config).then(function (response) {
                if(response.data.flag){
                    console.log(response.data.message);
                }},function(err) {
                    console.log("操作失败！");
                }
            )
        },
        savePolicyFun : function(index){
                savePolicyFun(index);
        },
        savePolicyFunpp : function(index){
            savePolicyFunpp(index);
        },
        savePolicyFunbuweipp : function(index){
                savePolicyFunbuweipp(index);
        },
        querySumPrize :function(fuhao){
            querySumPrizead(fuhao);
        },

        querySumPrizejtIop :function(fuhao){
            querySumPrizeIops(fuhao);
        },
        querySumPrizesp :function(fuhao){
            querySumPrizesp(fuhao);
        },
        querySumPrizejh :function(fuhao){
            querySumPrizejh(fuhao);
        }, 
        querySumPrizexx :function(fuhao){
            querySumPrizexx(fuhao);
        },
        changeTiaoZhuan :function(index){
            changeTiaoZhuan(index);
        },
        goToPageAD :function(){
        	goToPageAD();
        },
        goToPageVideo :function(){
        	goToPageVideo();
        },
        goToPageSP :function(){
        	goToPageSP();
        },
        goToPageJh :function(){
        	goToPageJh();
        },
        goToPageApp :function(){
        	goToPageApp();
        },
        querySumPrizeAdTiao :function(){
        	querySumPrizeAdTiao();
        },
        querySumPrizeJhTiao :function(){
        	querySumPrizeJhTiao();
        },
        querySumPrizeAppTiao :function(){
        	querySumPrizeAppTiao();
        },
        querySumPrizeVideoTiao :function(){
        	querySumPrizeVideoTiao();
        },
        deleteImg:function(id){
        	deleteImg(id);
        },
        chooseIop :function (item) {
            chooseIop(item);
        },
        querySumPrizeAgree:function (type){
            querySumPrizeAgree(type);
        },
        goToPageAgreement : function () {
            goToPageAgreement();
        },
        querySumPrizeAgreementTiao : function () {
            querySumPrizeAgreementTiao();
        }
    }
});

/*
 * var vmp = new Vue({ el:".cspz", data:{ policyList:'', shure:'',
 * policyListbuwei:'', shurebuwei:'', isShowButton:'', NextButton:'', image:'',
 * isHide:'', adList:'', type:'', limit:'', limit1:'', pageNumber:'',
 * pageNumber1:'', pageObject:'', pageObject1:'', rowsPerPage:'',
 * aggregationList:'', }, mounted: function () { this.$nextTick(function () {
 * vmp.updateIndexPolicy();//初始化侧栏元素和布局 }) }, methods:{
 * updateIndexPolicy:function () { var url = vm.path +
 * "/tWlmDecorate/tWlmUpdateIndexPolicy.do?id="+vm.id;
 * axios.get(url).then(function (response) { vmp.policyList=
 * response.data.policyList; vmp.shure=response.data.shure; vmp.policyListbuwei=
 * response.data.policyListbuwei; vmp.shurebuwei=response.data.shurebuwei;
 * console.log(vmp.shure); console.log(vmp.policyList);
 * vmp.adList=response.data.adList; vmp.pageNumber=response.data.pageNumber;
 * vmp.limit=response.data.limit; vmp.isHide=response.data.isHide;
 * vmp.pageObject=response.data.pageObject;
 * vmp.pageNumber1=response.data.pageNumber1; vmp.limit1=response.data.limit1;
 * vmp.pageObject1=response.data.pageObject1;
 * vmp.aggregationList=response.data.aggregationList;
 * vmp.rowsPerPage=response.data. pageObject.rowsPerPage;
 * vm.currentPagepageObject=response.data.pageObject.currentPage.;
 * vm.totalPage=response.data.pageObject.totalPage.;
 * vm.currentPagepageObject=response.data.pageObject.currentPagepageObject.totalPage
 * console.log(vm.shure); }) }, } });
 */


/** **************************************************************************************************** */
var demo=$('.demo'),
htmlData;
var drag=0,
sort=0,
selector='.bigFloor,.lyrow,.box,.wdg,.wdgN,myswiper,.col,.tbx',
body=$('body').addClass('edit'),
idNames=[];
// 根据属性名取值
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) return unescape(r[2]);
    return null;
}
//tabli标签切换
var antiShaking = 1
var directionTestYa1 = 0;
var directionTestYa2 = 0;
var directionFlagYa = 0;
var directionTestYa11 = 0;
var directionTestYa22 = 0;
function qhli(){
	$('.tab_ul .kdli').click(function() {//实现tab样式切换
        if($('.tbbigFloor').hasClass('tab_directionYaYa_flagYa')){
            antiShaking = 0
            var indexTabLiYa = $(this).index()
            directionTestYa22 = $(this).index()
            if(directionTestYa22 > directionTestYa11){
                directionFlagYa = 0
                // console.log('向右') //滚动条距离右侧距离变大
            }else{
                directionFlagYa = 1 //for tab对应swiper不能滚到0位置 只有滚动的时候initialSlide: 1可以滚动到0  但如果向西滚动的时候也出发 体验会差一些  所以加了此判断
                // console.log('向左') //滚动条距离左侧距离变小
            }
            directionTestYa11 = directionTestYa22
            tabSlodeToFun($(this).index(),directionFlagYa)
            curNav = $(this).index()
            $(document).find('.pcHeightScroll_ya.goodsBox').animate({scrollTop: heightYa(indexTabLiYa)},300);
            setTimeout(() => {
                antiShaking = 1
            },500)
        }
        $(this).find('.yesCheckStar').removeClass('none').prev().addClass('none')
        $(this).siblings().find('.yesCheckStar').addClass('none').prev().removeClass('none')
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
// 点击tab滚动div的距离
function heightYa(index) {
    var heightNow = 0
    if(index != 0){
        for (var i = 0; i < index; i++) {
            heightNow += $('.pcHeightScroll_ya .goodsCont .smtb').eq(i).outerHeight()
        }
    }
    return heightNow
}
var tab_componetArrYa = [], tabNow_heightYa = 0, curNav = 0;

// tab纵向div滚动
divScroll_FunYa()
function divScroll_FunYa() {
    setTimeout(() => {
        console.log('2sssssssssssss',$('.tab_directionYaYa_flagYa').length)
        // if(横向) //再加一个inputHidden横向的判断
        if($('.tab_directionYaYa_flagYa').length > 0){
            // 纵向默认第一个
            if($('.tab_directionYaYa_flagYa .tabHd_0 ul li').length>0 && $('.tab_directionYaYa_flagYa .tabHd_0 ul li').eq(0).find('.lcwx').hasClass('disb')){
                $('.tab_directionYaYa_flagYa .tabHd_0 ul li').each(function(i) {
                    if(i == 0){
                        tabSlodeToFun(1,1)
                        $(this).find('.lcxz').removeClass('ndis').addClass("disb").siblings(".lcwx").addClass("ndis").removeClass("disb");
                        $(this).find('.yesCheckStar').removeClass('none').prev().addClass('none')
                    }else{
                        $(this).find('.yesCheckStar').addClass('none').prev().removeClass('none')
                        $(this).find('.lcwx').addClass("disb").removeClass("ndis").siblings(".lcxz").addClass("ndis").removeClass("disb");
                    }
                })
            }
            // 监听div滚动
            $('.tab_directionYaYa_flagYa .goodsBox')[0].addEventListener("scroll", function () {
                tab_componetArrYa = []
                $('.pcHeightScroll_ya .goodsCont .smtb.bydiv').each(function(i) {
                    tab_componetArrYa.push(heightYa(i));
                })
                var _lenYa = tab_componetArrYa.length;
                var divScrollTop = $('.tab_directionYaYa_flagYa .goodsBox')[0].scrollTop
                directionTestYa2 = divScrollTop
                if(directionTestYa2 > directionTestYa1){
                    directionFlagYa = 0
                }else{
                    directionFlagYa = 1 //for tab对应swiper不能滚到0位置 只有滚动的时候initialSlide: 1可以滚动到0  但如果向西滚动的时候也出发 体验会差一些  所以加了此判断
                }
                directionTestYa1 = directionTestYa2
                if(antiShaking == 1){
                    for (var i = 0; i < tab_componetArrYa.length; i++) {
                        if (divScrollTop == 0 || divScrollTop < tab_componetArrYa[i] - 1) {
                            changeNav(0,directionFlagYa);
                            break;
                        } else if (divScrollTop >= tab_componetArrYa[_lenYa - 1]) {
                            changeNav(_lenYa - 1,directionFlagYa);
                            break;
                        } else if (divScrollTop > tab_componetArrYa[i - 1] && divScrollTop < tab_componetArrYa[i + 1] - 1) {
                            changeNav(i,directionFlagYa);
                            break;
                        }
                    }
                }
            })
        }else{ //不存在就一直调用检查是否存在
            divScroll_FunYa()
        }
    },1000)

}
var dfsdjfhdskj = 0
function tabSlodeToFun(index,flag) {
    var swipertabHd = new Swiper('.tab_directionYaYa_flagYa .tabHd_0', {
        slidesPerView: 'auto',
    });
    if(index == 1 && flag == 1 && dfsdjfhdskj != 1){
        swipertabHd = new Swiper('.tab_directionYaYa_flagYa .tabHd_0', {
            slidesPerView: 'auto',
            initialSlide: 1,
        });
        dfsdjfhdskj = 1
    }
    dfsdjfhdskj = index
    swipertabHd.slideTo(index-1, 300, false); //切换到第一个slide，速度为1秒
}
function changeNav(index,flag) {
    if (index != curNav) {
        let ui = index+1
        var nowLiYa = $('.tab_directionYaYa_flagYa .tab_ul .kdli').eq(index)
        tabSlodeToFun(index,flag)

        nowLiYa.find('.yesCheckStar').removeClass('none').prev().addClass('none')
        nowLiYa.siblings().find('.yesCheckStar').addClass('none').prev().removeClass('none')
        nowLiYa.children("a").children(".lcxz").removeClass("ndis");
        //当前tab选中图片展示并且同级的a标签lcwx隐藏
        nowLiYa.children("a").children(".lcxz").addClass("disb").siblings(".lcwx").addClass("ndis").removeClass("disb");
        //当前tab的同级别的tab下的a标签的未选中楼层展示
        nowLiYa.siblings().children("a").children(".lcwx").addClass("disb").removeClass("ndis");
        //当前tab的同级别的tab下的a标签的未选中楼层隐藏
        nowLiYa.siblings().children("a").children(".lcxz").addClass("ndis").removeClass("disb");
    }
    curNav = index;
}
function index(){
    /* =================可编辑样式==================== */
    var Data={
        type:{
            head:{css:['size','background','border','text']},
            goodsLR:{css:['size','background','border','text']},
            goodsPL:{css:['size','background','border','text']},
            goodsTB:{css:['size','background','border','text']},
            list:{css:['size','background','border','text']},
            image:{css:['size','border']},
            gallery:{css:[]},
            palaces:{css:[]},// 宫格
            bottomNav:{css:[]}// 底部导航
        }   
    };
    var thisClickObj='';
    var tabTypeDom = "";
    /* ============================================= */
    $(function(){
        
        
    	
      // tabli标签切换
    	qhli();
            // 模板管理删除图片
            $(document).on("click", '.j-deleteImg',function (obj) {
              var $this = $(this);
              $this.parent().find('.imgPerview').attr('src','');
              $this.parent().find('.imgInput').val('');
              $this.parent().find('.imgPerview').css("display","none");
              $this.parent().find('.imagesZw').css("display","block");
          	  $("#pImg").attr("src","../../images/decorate/images.png");
              $this.text('上传图片').removeClass('j-deleteImg');
          
            });
            
            
          
        /*
         * *获取本地存储并填充
         */

        function supportstorage() {
            if (typeof window.localStorage=='object') 
                return true;
            else
                return false;       
        };
        function clearResizeHtml(){// 填充之前清除之前resize时动态增加的html 避免重新初始化时冲突
                $('.ui-resizable').removeClass('ui-resizable');
                $('.ui-resizable-handle').remove();
                $('.ui-sortable').removeClass('ui-sortable');
                
        };



        function restoreData(){
            if (supportstorage()) {
                htmlData = JSON.parse(localStorage.getItem("htmlData"));
                console.log(htmlData);
                if(!htmlData){
                    
                    htmlData={count:0,step:[demo.html()],css:''};
                    return false;
                };
                if(!htmlData.count){return false;}
                demo.html(htmlData.step[htmlData.count]);
                clearResizeHtml();
                $('#css-wrap').text(htmlData.css);

            }
        };
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
        function reSlide(wrap,reb){
            box=wrap?wrap:demo;
            $.each($('.slider',box),function(k,v){
                if(reb){reBuild($(this));}
                else{
                    var h=$(this).parent().width()/2;
                    $(this).gallery({height:h});
                }
            });
        }
        restoreData();
        // 尺寸调整
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
        // 左侧菜单折叠
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
         * *拖拽及排序: *变量&&绑定&&初始化 *控制按钮组
         */
        
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
                    (sort===0) && (sort++);
                },
                stop: function(e,t) {
                    sort--;
                    drag || htmlRec();
                    console.log('www')
                }   
            },opts2=$.extend({},opts,{
                stop: function(e,t) {
                    sort--;
                    if(!drag){htmlRec();}
                }
            });
            
            demo.sortable(opts);
            $('.bigFloor',demo).sortable(opts2);
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
        // 排序初始化
        initContainer();
        var $tabs;//初始化需要判断只有tab楼层才有的切换
        //左侧拖拽&&右侧排序
        $('.sidebar-nav .bigFloor').draggable({//拖拽外层框架
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
                resizeInit($('.row',demo));//判断窗口是否被调整
                t.helper.attr('id','idname'); 
                if(t.helper.hasClass("tbbigFloor")){//判断如果是拖拽的tab楼层
                    qhli();//初始化li标签的样式
                    var bs = demo.find(".tablcs").children("div").children(".tab_ul").children(".kdli");
                    var bsd = demo.find(".tablcs .goodsBox .goodsCont").children(".bydiv");
                    initTabId(bs,bsd);//动态添加id
                    $tabs = demo.find(".tabslc").tabs();//初始化tabs
                	$('.demo').find(".tablcs").find(".goodsBox").each(function(i,u){
    					if(!$(this).hasClass("swiper-container")){
    						$(this).addClass("swiper-container");
    					}
    					
    			   });
    				$(".demo .swiper-tabHd").each(function(i,u){
    					if(!$(u).hasClass("tabHd_"+i)){
    						$(this).addClass("tabHd_"+i);
    					
    						//初始化菜单滑动
    						// ;//添加事件执行的唯一样式
    						var swipertabHd = new Swiper('.tabHd_'+i, { 
    							slidesPerView: 'auto',
    							//spaceBetween: 10 
    						});
    						$('.swiper-tabHd .swiper-slide').click(function() { //点击滑动的地方 
    							var ix = parseInt($(this).index());
    							console.log($(this).index());
    							if(ix > 1) {
    								swipertabHd.slideTo(ix - 2, 300, false); //切换到第一个slide，速度为1秒 
    							}
    						});
    					}
    			   });
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
                    $(eleName).addClass("swiper-slide");
                }
            });
        }
        
        $('.sidebar-nav .lyrow').draggable({// 拖拽布局
            connectToSortable: '.col',
            helper: 'clone',
            opacity:0.5,
            start: function(e,t) {drag++;},
            drag: function(e,t) {t.helper.width(100);},
            stop: function(e,t) {
                drag--;
                htmlRec(0,'lyrow');
                var cols=$('.col',demo);
                cols.sortable({// 栏与栏之间的拖拽
                    opacity:0.5,
                    connectWith: '.demo .lyrow',
                    handle:'.demo .drag',
                    start: function(e,t) {(sort===0) && (sort++)},
                    stop: function(e,t) {
                        sort--;
                        if(!drag){
                            reSlide(t.item.eq(0),1);
                            htmlRec();
                            console.log(1);
                        } 
                        
                    }
                });
                resizeInit($('.demo .row',demo));
                t.helper.attr('id','idname');
                
            }
        });

        $('.sidebar-nav .box').draggable({// 拖拽房间布局
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
                cols.sortable({// 房间与房间之间的拖拽
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
                            console.log(333);
                        } 

                    }
                });
                
            }
        });
        //滑动元素拖拽 1223 add
        $('.sidebar-nav .hdysBox').draggable({
        	connectToSortable: '.demo .col .col',
        	helper: 'clone',
        	opacity:0.5,
        	start: function(e,t) {drag++},
        	drag: function(e, t) {t.helper.width(300);},
        	stop: function() {
        		$(".demo .col .col .swiper-hdys").each(function(i,u){ 
        			var mathNum = Math.round(Math.random()*1000);
    				if(!$(u).hasClass("hdys_"+mathNum)){
    					$(this).addClass("hdys_"+mathNum);
    					//初始化菜单滑动
    					// ;//添加事件执行的唯一样式
    					var swiperhdys = new Swiper('.hdys_'+mathNum, { 
    						slidesPerView: 3, //这里默认三个，实际参数可配置， 头部一行显示多少个 .5表示显示半个
    						paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
    						//spaceBetween: 10, 
    						freeMode: true, //默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
    						loop: false, //是否可循环
    						//pagination : '.hdys-page'//是否展示滑动点
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
        
     // 跑马灯文本
        $('.sidebar-nav .msgpmdbox').draggable({
            connectToSortable: '.demo .col .col',
            helper: 'clone',
            opacity:0.5,
            start: function(e,t) {drag++},
            drag: function(e, t) {t.helper.width(300);},
            stop: function() {
                // 初始化菜单滑动
            	$(".demo .swiper-container-meseage").each(function(i,u){
					if(!$(u).hasClass("pmdSort_"+i)){
						$(this).addClass("pmdSort_"+i);
						var swiperpmd = new Swiper('.pmdSort_'+i, { 
							height: 20,
							direction: 'vertical',
							autoplay: 3000,
							observer:true,
							observeParents:true
						});
						 
					}
			   });
                reSlide();
                drag--;
                htmlRec(0,'msgpmdbox');
                sizeInit();
                
            }
            
        });
        
        // iop点击关闭弹窗隐藏
        function iopFadeOut(){
            $('.modals_cspz1').fadeOut(100, function() {
                $(this).find('.cspzedit-layeriop').hide();
            });
        };

        // 集团iop点击关闭弹窗隐藏
        function jtiopFadeOut(){
            $('.modals_cspzjhyIop').fadeOut(100, function() {
                $(this).find('.cspzedit-layeriop').hide();
            });
        };
        
        function iopppFadeOut(){
            $('.modals_cspz1pp').fadeOut(100, function() {
                $(this).find('.cspzedit-layeriop').hide();
            });
        };

        function iopjhFadeOut(){
            $('.modals_cspzjhy').fadeOut(100, function() {
            	var floorType=$("#floorType").val();
            	if (floorType && floorType == 'newbottom') {
            	  	  $("#floorType").val('');
            	  	  queryPolicyJh();
            	 }
                $(this).find('.cspzedit-layerjh').hide();
            });
        };
        
        function iopspFadeOut(){
            $('.modals_cspzsp').fadeOut(100, function() {
                $(this).find('.cspzedit-layersp').hide();
            });
        };
        
        $('.sidebar-nav .wdg').draggable({
            connectToSortable: '.demo .col .col',
            helper: 'clone',
            opacity:0.5,
            start: function(e,t) {drag++},
            drag: function(e, t) {t.helper.width(300);},
            stop: function() {
                reSlide();
                drag--;
                htmlRec(0,'wdg');
                var cols=$('.col .col',demo);
                cols.sortable({// 房间与房间之间的拖拽
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
                            console.log(333);
                        } 

                    }
                });
            }
        });
        
        
        $('.sidebar-nav .dwlubwdg').draggable({
            connectToSortable: '.demo .col .col',
            helper: 'clone',
            opacity:0.5,
            start: function(e,t) {drag++},
            drag: function(e, t) {
                
                $(".demo .col .col .dw1").addClass("gallery-top");
                $(".demo .col .col .dw2").addClass("gallery-thumbs");
             
                t.helper.width(300);
            },
            stop: function() {
                var l = $(".demo").find(".gallery-top").length;
                var l = $(".demo").find(".gallery-top").length;
                if(l>1){
					alert("页面只能存在一个档位轮播图");
					console.log(demo.find(".dwlubwdg")[1]);
					demo.find(".dwlubwdg")[1].remove();
					return;
                }
                
                var galleryTop = new Swiper('.gallery-top', { 
                	loop:true,
                    autoplay:false,// 不可轮播
                    pagination : '.swiper-pagination',
                    // paginationType:'custom'
                    prevButton:'.swiper-button-prev',
                    nextButton:'.swiper-button-next'
                });
                var galleryThumbs = new Swiper('.gallery-thumbs', {
                    // spaceBetween: 10,
                    centeredSlides: true, 
                    slideToClickedSlide: true,
                    loop:true,
                    prevButton:'.swiper-button-prev',
                    nextButton:'.swiper-button-next',
                });
                galleryTop.params.control = galleryThumbs;
                galleryThumbs.params.control = galleryTop;
                
                reSlide();
                drag--;
                htmlRec(0,'dwlubwdg');
                
                sizeInit();

            }
         
            
        });

        
        $('.sidebar-nav .myswiper').draggable({
            connectToSortable: '.demo .col .col',
            helper: 'clone',
            opacity:0.5,
            start: function(e,t) {drag++},
            drag: function(e, t) {t.helper.width(300);},
            stop: function() {
                reSlide();
                drag--;
                htmlRec(0,'myswiper');
                sizeInit();

                var cols=$('.col .col',demo);
                cols.sortable({// 房间与房间之间的拖拽
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
                            console.log(333);
                        } 

                    }
                });
            }
            
        });
        
        
/** *******************************横向移动start********************************* **/
        
        $('.sidebar-nav .hxmenu').draggable({
            connectToSortable: '.demo .col .col',
            helper: 'clone',
            opacity:0.5,
            start: function(e,t) {drag++},
            drag: function(e, t) {t.helper.width(300);},
            stop: function() {
                reSlide();
                drag--;
                htmlRec(0,'hxmenu');
                sizeInit();
                // 初始化菜单滑动
                var swiper1 = new Swiper('.swiper-hx', {
                    slidesPerView: 3, // 头部一行显示多少个 .5表示显示半个
                    paginationClickable: true, // 此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                    spaceBetween: 10, // slide之间的距离（单位px）。
                    freeMode: true, // 默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
                    loop: false, // 是否可循环
                    pagination : '.swiper-pagination' 
                   
                });
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
                $(".demo .col .col .jbmgnswip").each(function(i,u){
                    var liSize = $(this).find("input[class='bmnum']").val();//拖拽时获取每个模块的滑动元素的真实一屏展示参数，防止初始化影响其他模块
                    var swiperbmgn = new Swiper(u, {
                        slidesPerView: liSize, //这里默认3.5个，实际参数可配置， 头部一行显示多少个 .5表示显示半个
                        paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                        spaceBetween: 10,
                        freeMode: true, //默认为false，普通模式: slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
                        loop: false, //是否可循环
                        scrollbarHide : false,
                        scrollbarSnapOnRelease:true
                    });
                });
                reSlide();
                drag--;
                htmlRec(0,'showFeeBox');
                sizeInit();
            }
        });
        $('.sidebar-nav .jtkdbox').draggable({
            connectToSortable: '.demo .col .col',
            helper: 'clone',
            opacity: 0.5,
            start: function (e, t) {
                drag++
            },
            drag: function (e, t) {
                t.helper.width(300);
            },
            stop: function () {

                $(".demo .col .col .jtkdswip").each(function (i, u) {
                    if (!$(u).hasClass("jtkd_" + i)) {
                        $(this).addClass("jtkd_" + i);
                        //初始化菜单滑动
                        // ;//添加事件执行的唯一样式
                        var swiperjtkd = new Swiper('.jtkd_' + i, {
                            slidesPerView: 3, //这里默认3.5个，实际参数可配置， 头部一行显示多少个 .5表示显示半个
                            paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                            spaceBetween: 10,
                            freeMode: true, //默认为false，普通模式: slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
                            loop: false, //是否可循环  
                            scrollbarHide: false,
                            scrollbarSnapOnRelease: true

                        });
                    }
                });
                reSlide();
                drag--;
                htmlRec(0, 'showFeeBox_kd');
                sizeInit();

            }

        });
        //横向移动编辑展示
        var qyxqClickObj = '';
        $(demo).on('click','.qyxqBtn',function(e) {// deme下轮播图片弹窗加载事件
             qyxqClickObj = $(this).parent().parent(),// edit父标签的父标签
             // that=$(this);
             // a = that.parent().next();//view
             e.preventDefault();
             $('.coMmodals').show();// 展示蒙版
             var p=$(this).parent().parent();
     // type=p.data('type'),//=wdglbt轮播图的datatype获取
         
         $('.modals_qyxq').fadeIn(200, function() {
             var layer=$('.qyxqedit-layer',this);
             layer.css({
                 'margin-top':-(layer.height())/2,
                 'margin-left':-(layer.width())/2
             }).fadeIn(100);
             var imgNum = p.find('.hxmenuView .swiper-slide').length+1;// 遍历
             var editHtmlImg = "<div class='cmCon'> <table class='ch_tips' width='100%'><thead><tr> <th>序号</th> <th>内容配置</th> <th>操作</th> </tr></thead>"
                 +"<tbody class='mytablebox'>";
                   
                 for(var i= 1 ;i<imgNum;i++){
                     
                     // 获取图片地址
                     // 获取按钮图片
                     // 获取按钮图片地址
                     // 是否需要登录
                     
                     var editBigImg = p.find('.hxmenuView .swiper-slide .img_div').children("a:first-child").children("img").eq(i-1).attr("src"),// 获取菜单图片
                         editBtnImg = p.find('.hxmenuView .swiper-slide .img_div').children("a:nth-child(2)").children("img").eq(i-1).attr("src");// 获取菜单领取按钮图片
                     var adidhref = p.find('.hxmenuView .swiper-slide .img_div').children("a:first-child").eq(i-1).find('#adidhref').val();
                     var jhyhref = p.find('.hxmenuView .swiper-slide .img_div').children("a:first-child").eq(i-1).find('#jhyhref').val();
                     var yyyhref = p.find('.hxmenuView .swiper-slide .img_div').children("a:first-child").eq(i-1).find('#yyyhref').val();
                     
                     var adidhref1 = p.find('.hxmenuView .swiper-slide .img_div').children("a:nth-child(2)").eq(i-1).find('#adidhref').val();
                     var jhyhref1 = p.find('.hxmenuView .swiper-slide .img_div').children("a:nth-child(2)").eq(i-1).find('#jhyhref').val();
                     var yyyhref1 = p.find('.hxmenuView .swiper-slide .img_div').children("a:first-child").eq(i-1).find('#yyyhref').val();
                     
                     
                     var editBigImgad = p.find('.hxmenuView .swiper-slide .img_div').children("a:first-child").eq(i-1).prop('href');// 获取菜单图片地址
                     var editBtnImgad = p.find('.hxmenuView .swiper-slide .img_div').children("a:nth-child(2)").eq(i-1).prop('href');// 获取菜单领取按钮图片地址
                     
                     var titleorname = p.find('.hxmenuView .swiper-slide .img_div').children("a:first-child").eq(i-1).attr("titleorname");// 获取菜单图片名称
                     if(!titleorname){
                     	titleorname = '';
                     }
                     var titleorname1 = p.find('.hxmenuView .swiper-slide .img_div').children("a:nth-child(2)").eq(i-1).attr("titleorname");// 获取菜单领取按钮图片名称
                     if(!titleorname1){
                     	titleorname1 = '';
                     }
                     if (adidhref) {
                         editBigImgad = 'adid=' + adidhref;
                     } else if (jhyhref) {
                         editBigImgad = jhyhref;
                     } else if (yyyhref) {
                         editBigImgad = yyyhref;
                     } else {
                         editBigImgad =p.find('.hxmenuView .swiper-slide .img_div').children("a:first-child").eq(i-1).prop('href');// 获取菜单图片地址
                     }
                     if (adidhref1) {
                         editBtnImgad = 'adid=' + adidhref1;
                     } else if (jhyhref1) {
                         editBtnImgad = jhyhref1;
                     } else if (yyyhref1) {
                         editBtnImgad = yyyhref1;
                     } else {
                         editBtnImgad = p.find('.hxmenuView .swiper-slide .img_div').children("a:nth-child(2)").eq(i-1).prop('href');// 获取菜单领取按钮图片地址
                     }
                     if (editBigImgad.indexOf('isIndex=0') > -1) {
                         editBigImgad = '';
                     }
                     if (editBtnImgad.indexOf('isIndex=0') > -1) {
                         editBtnImgad = '';
                     }
                     var goodcodeinput = p.find('.hxmenuView .swiper-slide .img_div').eq(i-1).find("a:first-child").attr("goodcodeinput");// 获取菜单领取按钮图片地址
                     if(!goodcodeinput){
                     	goodcodeinput = '';
                     }
                     
                     
                     var editBtnIn = p.find('.hxmenuView .swiper-slide .img_div').children(".jumphxc").eq(i-1).val(),// 获取菜单领取按钮图片地址
                     

                     editqyxq="<tr class='qyqq'>"
                               +"<td>"+i+"</td>"
                               +"<td>"
                               +"<div>"
                               +"<dl>"
                               +"<dt>广告位编码：</dt>"
                               +"<dd>"
                               +"<div><input class='hxhd_ggwbm' value="+goodcodeinput+">"
                               +"</div>"
                               +"</dd>"
                               +"</dl>"
                               +"</div>"
                               
                               
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
                               editqyxq +="<input type='file' class='imgInput imgUpload' name='UploadBtn' id='iconListpp0' >"
                               +"</div>"
                                               
                               +"<span>注：请上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>"
                               +"</dd>"
                            
                               +"</dl>"
                               +"</div>"
                               +"<div>"
                               +"<dl>"
                               +"<dt>图片跳转地址：</dt>"
                               +"<dd>"
                               +"<input type='text' class='jhinp ywinput' placeholder='请输入跳转地址 或跳转广告' value='"+ editBigImgad +"'><span class='xzgg_span'>选择广告</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 180px;border: none;' value="+titleorname+">"
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
                               editqyxq +="<input type='file' class='imgInput imgUpload' name='UploadBtn' id='iconListpp0'>"
                               +"</div>"
                                               
                               +"<span>注：请上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>"
                               +"</dd>"
                               +"</dl>"
                               +"</div>"
                               +"<div>"
                               +"<dl>"
                               +"<dt>按钮跳转地址：</dt>"
                               +"<dd>"
                               +"<input type='text' class='jhinp btninput' placeholder='请输入跳转地址 或跳转广告' value='"+ editBtnImgad +"'><span class='xzgg_span'>选择广告</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 180px;border: none;' value="+titleorname1+" >"
                               +"<span class='qyzj'>注：输入ID请用英文,分隔</span>"
                               +"</dd>"
                               +"</dl>"
                               +"</div> "
                               /*2019 12 27 暂时注释是否登录功能+"<div>"
                               +"<dl>"
                               +"<dt>是否需要登录：</dt>"
                               +"<dd class='yxsjdd'>"
                               +"<p>"
                                          
                               if(editBtnIn =='1'){// 1是 0 否否则默认0 三种情况
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
                               +"</div>"*/
                               +"</td>"
                               +"<td>"
								+"<a href='javascript:;' class='llbtn_bor' style='width: 100%' onclick='tablezdCktransverse(this)'>置顶</a>"
								+"<a href='javascript:;' class='llbtn_bor' style='width: 100%' onclick='tableUpModuletransverse(this)'>上移</a>"
								+"<a href='javascript:;' class='llbtn_bor' style='width: 100%' onclick='tableDownModuletransverse(this)'>下移</a>"
								+"<a href='javascript:;' class='llbtn_bor' style='width: 100%' onclick='tableendCktransverse(this)'>置底</a>"
								+"<a href='javascript:;' class='llbtn llbtn_xlbt cee4358bb' style='width: 100%' onclick='delqyxq(this)'>移除</a>"
								+"</td>"
                               +"</tr>";
                     editHtmlImg+=editqyxq;
                 } 
                 editHtmlImg + "</tbody></table></div>";
             $('.modals_qyxq #qyxqtab').html('').append(editHtmlImg);// modals3图片广告弹窗使用
         });
     });

        var addqyxq = '<tr class="qyqq">\
            <td>1</td>\
            <td>\
            	<div>\
                   <dl>\
                    <dt>广告位编码：</dt>\
                   <dd>\
                    <div ">\
                        <input type="text" class="hxhd_ggwbm" />\
                    </div>\
                  </dd>\
                 </dl>\
                </div>\
                <div>\
                   <dl>\
                    <dt>业务图片：</dt>\
                   <dd>\
                    <div class="uploadImg normalData">\
                        <img src="images/images.png" alt="" class="imagesZw" style="display:block;"/>\
                        <img src="../../images/decorate/l_01.png" alt="" class="imgPerview ywpicImg" style="display:none;"/>\
                        <p class="opacityP j-deleteImg">删除</p>\
                        <input type="file" class="imgInput imgUpload " name="UploadBtn" id="iconListpp0"/>\
                    </div>\
                    <span>注：请上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>\
                  </dd>\
                 </dl>\
                </div>\
                <div>\
                   <dl> <dt>图片跳转地址：</dt>\
                        <dd>\
                          <input type="text" class="jhinp ywinput" placeholder="请输入跳转地址 或跳转广告" value="">\
                          <span class="xzgg_span">选择广告</span><input type=\"text\" readonly=\"readonly\" name=\"jumpAddressStr\" class=\"jumpAddressStrReadOnly\" style=\"margin-left: 5px; width: 180px;border: none;\"><span class="qyzj">注：输入ID请用英文,分隔</span>\
                        </dd>\
                   </dl>\
                </div>\
                <div>\
                    <dl><dt>业务按钮：</dt>\
                    <dd>\
                    <div class="uploadImg normalData ywbtnImg">\
                        <img src="images/images.png" alt="" class="imagesZw" style="display:block;">\
                        <img src="../../images/decorate/btn.png" alt="" class="imgPerview ywanImg" style="display:none;">\
                        <p class="opacityP j-deleteImg">删除</p><input type="file" class="imgInput imgUpload" name="UploadBtn" id="iconListpp0">\
                    </div>\
                    <span>注：请上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>\
                    </dd>\
                    </dl>\
                 </div>\
                 <div>\
                        <dl><dt>按钮跳转地址：</dt>\
                            <dd>\
                              <input type="text" class="jhinp btninput" placeholder="请输入跳转地址 或跳转广告" value="">\
                              <span class="xzgg_span">选择广告</span><input type=\"text\" readonly=\"readonly\" name=\"jumpAddressStr\" class=\"jumpAddressStrReadOnly\" style=\"margin-left: 5px; width: 180px;border: none;\"><span class="qyzj">注：输入ID请用英文,分隔</span>\
                            </dd>\
                        </dl>\
                  </div>\
                </td>\
        	<td>\
			<a href="javascript:;" class="llbtn_bor" style="width: 100%" onclick="tablezdCktransverse(this)">置顶</a>\
			<a href="javascript:;" class="llbtn_bor" style="width: 100%" onclick="tableUpModuletransverse(this)">上移</a>\
			<a href="javascript:;" class="llbtn_bor" style="width: 100%" onclick="tableDownModuletransverse(this)">下移</a>\
			<a href="javascript:;" class="llbtn_bor" style="width: 100%" onclick="tableendCktransverse(this)">置底</a>\
			<a href="javascript:;" class="llbtn llbtn_xlbt cee4358bb" style="width: 100%" onclick="delqyxq(this)">移除</a>\
        	</td>\
        </tr>\
        ';
/*2019 12 27 暂时屏蔽登录按钮功能
 * <div>\
                    <dl><dt>是否需要登录：</dt>\
                    <dd class="yxsjdd">\
                        <p><input type="radio" name="nifdl1" id="iifd1" value="1" class="ifdlin nninput" checked=""><label for="iifd1" class="ifdllb">是</label>\
                            <input type="radio" name="nifdl1" id="iifd1" class="ifdlin nninput" value="0"><label for="iifd1" class="ifdllb">否</label>\
                        </p>\
                    </dd>\
                    </dl>\
                </div>\*/
        $(".jxxz").click(function(e){
           var zj = $(this).parents(".modals_qyxq").find(".mytablebox").append(addqyxq);
           // 追加后重新遍历初始化序号以及id
           initqyxq(zj);
        })

         function initqyxq(a){
            var ntr = a.children("tr"); 
            $.each(ntr,function(i,eleName){// 遍历tr
                i++;
                $(eleName).children("td:nth-child(1)").text(i)
              })
          };

        // 横向菜单滑动权益详情保存并编辑
          $('.qyxqedit-layer').on('click','.saveqyxq',function(e){
               e.preventDefault();
               var imgNum = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody tr").length;
                   console.log(imgNum);
               var editHxcd='';
               for(var i= 0 ;i<imgNum;i++){ 
                   // 获取业务图片地址
                   var tpdz = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".ywpicImg").attr("src");
                   // 获取按钮图片地址
                   var btdz = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".ywanImg").attr("src");
                   // 获取按钮图片地址
                   var tptzdz = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".ywinput").val();
                   var titleorname = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".ywinput").next().next().val();
                   // 获取按钮图片地址
                   var bttzdz = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".btninput").val();
                   var vifdl = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find("p input:checked").val();
                   var titleorname1 = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".btninput").next().next().val();
                   
                   var hxhd_ggwbm = $(this).parents('.qyxqedit-layer').children(".qyxqmain-content").find("table tbody").children("tr").eq(i).find(".hxhd_ggwbm").val();
                   if(!hxhd_ggwbm){
						alert("请输入广告位编码！");
						return;
					}
				   var ggwbm = ' goodcodeinputsign="goodcodeinputsign" goodCodeInput="'+hxhd_ggwbm+'" '; 
                   console.log(vifdl);
                   editHxcd += ' \<div class="swiper-slide">\
                       <div class="img_div">';
                   if (tptzdz.indexOf('adid=') > -1) {
                       tptzdz = tptzdz.substring(tptzdz.indexOf('=') +1);
                       var click = ' onclick="javascript:addToProductStore.executeFvs1('+ '\'' + tptzdz + '\'' + ',\'1\',this,\'02\',\'\',\'1\')\"';
                       editHxcd += ' <a href="javascript:void(0)" '+click+''+ ggwbm +' titleorname="'+titleorname+'"><img src="'+tpdz+'" alt=""><input type="hidden" id="adidhref"  value="'+tptzdz+'"></a>';
                   } else if (tptzdz.indexOf('decorateId=') > -1) {
                       var click = ' onclick=\"javascript:addToProductStore.executeFvsStatcAdid('+ '\'' + tptzdz + '\'' + ',\'1\',this,\'02\',\'\',\'1\')\"';
                       editHxcd += ' <a href="javascript:void(0)" '+click+' titleorname="'+titleorname+'"'+ ggwbm +'><img src="'+tpdz+'" alt=""><input type="hidden" id="jhyhref" value="'+tptzdz+'"></a>';
                   } else if (tptzdz.indexOf('pkid=') > -1) {
                       var click = ' onclick=\"javascript:addToProductStore.executeFvsStatcAdid('+ '\'' + tptzdz + '\'' + ',\'1\',this,\'02\',\'\',\'1\')\"';
                       editHxcd += ' <a href="javascript:void(0)" titleorname="'+titleorname+'" bindturnhrefimage="bindturnhrefimage" class=""'+ ggwbm +' url="'+tptzdz+'" '+click+'><img src="'+tpdz+'" alt=""><input type="hidden" id="yyyhref" value="'+tptzdz+'"></a>';
                   }else {
                       editHxcd += ' \<a titleorname="'+titleorname+'"'+ ggwbm +' href="'+tptzdz+'"><img src="'+tpdz+'" alt=""></a>';
                   }
                   
                   if (bttzdz.indexOf('adid=') > -1) {
                       bttzdz = bttzdz.substring(bttzdz.indexOf('=') +1);
                       var click = ' onclick="javascript:addToProductStore.executeFvs1('+ '\'' + bttzdz + '\'' + ',\'1\',this,\'02\',\'\',\'1\')\"';
                       editHxcd += ' <a href="javascript:void(0)" '+click+' titleorname="'+titleorname1+'"'+ ggwbm +'><img src="'+btdz+'" alt=""><input type="hidden" id="adidhref" value="'+bttzdz+'"></a>';
                   } else if (bttzdz.indexOf('decorateId=') > -1) {
                       var click = ' onclick=\"javascript:addToProductStore.executeFvsStatcAdid('+ '\'' + bttzdz + '\'' + ',\'1\',this,\'02\',\'\',\'1\')\"';
                       editHxcd += ' <a href="javascript:void(0)" '+click+' titleorname="'+titleorname1+'"'+ ggwbm +'><img src="'+btdz+'" alt=""><input type="hidden" id="jhyhref" value="'+bttzdz+'"></a>';
                   } else if (bttzdz.indexOf('pkid=') > -1) {
                       var click = ' onclick=\"javascript:addToProductStore.executeFvsStatcAdid('+ '\'' + bttzdz + '\'' + ',\'1\',this,\'02\',\'\',\'1\')\"';
                       editHxcd += ' <a href="javascript:void(0)" bindturnhrefimage="bindturnhrefimage"  class=""  titleorname="'+titleorname1+'" '+ ggwbm +' url="'+tptzdz+'" '+click+'><img src="'+btdz+'" alt=""><input type="hidden" id="yyyhref" value="'+bttzdz+'"></a>';
                   }else {
                       editHxcd += ' \<a titleorname="'+titleorname1+'" href="'+bttzdz+'"'+ ggwbm +'><img src="'+btdz+'" alt=""></a>';
                   }
                   editHxcd += ' \<input type="hidden" class="jumphxc" value="'+vifdl+'" name="jumphx">\
                       </div>\
                   </div>';
                    
               }
               $(qyxqClickObj).find('.hxmenuView .swiper-wrapper').html(editHxcd);
               var swiperhxcd = new Swiper('.swiper-hx', {// 保存后重新激活
                   slidesPerView: 3, // 头部一行显示多少个 .5表示显示半个
                   paginationClickable: true, // 此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
                   spaceBetween: 10, // slide之间的距离（单位px）。
                   freeMode: true, // 默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
                   loop: false, // 是否可循环
                   pagination : '.swiper-pagination' 
                  
               });
               closeC('.modals_qyxq');
          });
          
       // 权益详情选择聚合 、广告
          $(document).on('click','.xzgg_span',function(e) {// 选择
              resetValuead();
              $(".tiaoType").html('选择广告/聚合页');
              $(".showiop").show();
              $(".showpmd").hide();
              $("#tjnr2yy").show();
              $("#tjnr2yy").hide();//隐藏应用下载
              $("#floorType").val('qyxq');
              $(this).parent().find('.jhinp').attr('id','qyxqjumpaddr')
              var id= this.id;
              var zhi=$(this).parent().find('.jhinp').val();
              huixanzhi=zhi;
              huixianJH(zhi);
              $("#jhspId").val(id);
               $('.modals_cspzjhy').fadeIn(200, function() {// 展示参数配置弹层
                   var layer=$('.cspzedit-layer',this);
                   layer.css({
                       'margin-top':-(layer.height())/2,
                       'margin-left':-(layer.width())/2
                   }).fadeIn(100);// 弹窗位置设置
                   // iop推荐弹窗拼串开始
                   $('#htmlConjh').show();// 默认展示IOP推荐tab
               });
          })
        
        
        /** *******************************横向移动end********************************* **/
        

        // 按钮组件相关
        function fadeOut(){
            $('.modals,.modals2,.modalAddMenu').fadeOut(100, function() {
                $(this).find('.edit-layer,.edit-layer2,.edit-layer3').hide();
            });
        };
        
        function fadeOut2(){
            $('.modalAddMenu2').fadeOut(100, function() {
                $(this).find('.edit-layer4').hide();
            });
        };
        function fadeOut3(){
            $('.modalAddMenu3').fadeOut(100, function() {
                $(this).find('.edit-layer5').hide();
            });
        };
        /**
         * 2019-1-10 判断位置
         */
        function checkLocation(that){// that为this，当点击自己时生效
            var floorId = $(that).closest(".floorDecorate").attr("id");// 房间id
            var rowId = $(that).closest(".rowDecorate").attr("id");// 栏目id
            var roomId = $(that).parent().next().children(":first").attr("id")// 房间id
            var floor = $(".doc-wrap .floorDecorate");// 获取所有楼层标签
            for(var i = 0 ; i < floor.length ; i ++ ){
                if(floorId == $(floor[i]).attr("id")){
                    $(".floorLocation").html('楼层:' + (i + 1));
                    var row = $(floor[i]).find(".rowDecorate");// 获取所有栏目标签
                    for(var j = 0 ; j < row.length ; j ++ ){
                        if(rowId == $(row[j]).attr("id")){
                            $(".floorLocation").html($(".floorLocation").html() + '；栏目：' + (j + 1));
                            var room = $(row[j]).find(".ui-draggable");// 获取所有房间标签
                            for(var k = 0 ; k < room.length ; k ++){
                              if(roomId == $(room[k]).children(":last").children(":first").attr("id")){// 栏目下最后一个子标签的第一个子标签为房间
                                  $(".floorLocation").html($(".floorLocation").html() + '；房间：' + (k + 1));
                              }
                            }
                        }
                    }
                }
            }
        }
        $('.tabs').tinyTab();
        demo
        .on('click','.remove',function(e) {
            e.preventDefault();
            $(this).parent().parent().remove();
            htmlRec(true);
            idNames.push($(this).parent().next().children().attr('id'));
            $('.leftlableYa').hide()
        })
        
        .on('click','.edit',function(e) {
            checkLocation(this);
             // alert($(this).parent().next().attr("class"));
             selectLi(0);
             thisClickObj = $(this).parent().parent(),
            that=$(this);
            a = that.parent().next();// view
            e.preventDefault();
            var p=$(this).parent().parent(),
                type=p.data('type'),
                idName=$(this).parent().next().children().addClass('editing').attr('id');
            $('.modals').fadeIn(200, function() {
                var layer=$('.edit-layer',this);
                layer.css({
                    'margin-top':-(layer.height())/2,
                    'margin-left':-(layer.width())/2
                }).fadeIn(100);
                // $('.edit-layer').prepend(a);
                if(type=="head"){//标签大类
                    $('.selectP').hide();
                    $('.selectP1').hide();
                    $('#htmlCon').show();
                    var editHtmlTitleSrc = p.find('.ln-title-box img').eq(0).prop('src'),
                        editHtmlTitleHref = p.find('.ln-title-box a').eq(0).attr('href'),
                        // editHtmlTitle = "<tr><th>标题图片URL：</th><td><div
                        // class='selectImg'><p
                        // class='title_url'>"+editHtmlTitleSrc+"</p><input
                        // type='file' value='11' class='file' /><span
                        // style='width: 0.6rem;height: 0.2rem;margin-top:
                        // 0.1rem;display:none;'></span></div><p
                        // class='yulanImg'><img src='"+editHtmlTitleSrc+"'
                        // alt=''/></p></td></tr><tr><th>更多URL：</th><td><select
                        // name='' id=''><option value=''
                        // bind='data'>国信大数据</option><option value=''
                        // bind='flow'>流量</option><option value=''
                        // bind='hot'>热销</option><option value=''
                        // bind='school'>校园</option></select></tr>";
                        editHtmlTitle = "<tr><th>图片：</th><td><div class='selectImg'><p class='title_url'>"+editHtmlTitleSrc+"</p><input type='file' value='11' class='file'></div><p class='yulanImg'><img src='"+editHtmlTitleSrc+"' alt=''/></p></td></tr>"
                                      +"<tr><th>设置“更多”：</th><td><p class='selectType'><select name='' id=''><option value='data1' bind='digitizing'>数字化</option><option value='data2' bind='flow'>流量</option><option value='data3' bind='hot'>热销</option><option value='data4' bind='school'>校园</option><option value='data5' bind='data'>国信大数据</option><option value='data7' bind='yhlb'>优惠</option><option value='data8' bind='splb'>商品列表</option><option value='data9' bind='newsplb'>新商品列表</option><option value='data6' bind='complete'>全部</option><option value='zdyOption' bind='zdyOption'>自定义</option></select></p><p class='zdyInput'><input type='text' placeholder='请输入自定义的链接地址' class='link_href'></p><p class='' style='color:red'></p></td></tr>"
                                      +"<tr><td ></td><td colspan='10' ><p style='color:red'>设置更多优先级低于跳转页面，若选择设置“更多”请将跳转页面置为空！</p></td></tr><tr><th>跳转页面：</th><td><p class='selectType selectTypeHref'><select name='' id=''><option value='' bind=''></option>" ;
                        for(var i = 0 ; i < vm.aggregationList.length; i++){
                            editHtmlTitle += "<option value='decorateId_" + vm.aggregationList[i][0] + "' turnHref='" + vm.aggregationList[i][2] + "?decorateId=" + vm.aggregationList[i][0] + "' bind='decorateId_" + vm.aggregationList[i][0] + "'>" + vm.aggregationList[i][1] + "</option>";
                        }
                        editHtmlTitle += "</p></td></tr>";
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 start **
                         */
                        var goodCodeInputValue = p.find('.myview .ln-title-box a').attr('goodCodeInput');
                        goodCodeInputValue = goodCodeInputValue == undefined ? "" : goodCodeInputValue;
                        editHtmlTitle += ""
                            + "<tr>"
                            + " <th>广告位编码：</th>"
                            + " <td>"
                            + "     <p>"
                            + "         <input id='goodCodeInput' type='text' value='" + goodCodeInputValue + "' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;margin-bottom: 0.05rem;'>"
                            + "     </p>"
                            + " </dd>"
                            + " </td>"
                            + "</tr>";
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                         */
                        $('#htmlCon table').html('').prepend(editHtmlTitle);
                        var thisBind = $(thisClickObj).find('.editing a').attr('bindtype');
                        switch(thisBind)
                            {
                              case 'data1':
                              $('.selectType select').find("option[value='data1']").prop("selected",true);
                              break;
                              case 'data2':
                              $('.selectType select').find("option[value='data2']").prop("selected",true);
                              break;
                              case 'data3':
                              $('.selectType select').find("option[value='data3']").prop("selected",true);
                              break;
                              case 'data4':
                              $('.selectType select').find("option[value='data4']").prop("selected",true);
                              break;
                              case 'data5':
                              $('.selectType select').find("option[value='data5']").prop("selected",true);
                              break;
                              case 'data6':
                              $('.selectType select').find("option[value='data6']").prop("selected",true);
                              break;
                              case 'data7':
                              $('.selectType select').find("option[value='data7']").prop("selected",true);
                              break;
                              case 'data8':
                              $('.selectType select').find("option[value='data8']").prop("selected",true);
                              break;
                              case 'data9':
                              $('.selectType select').find("option[value='data9']").prop("selected",true);
                              break;
                              case 'zdyOption':
                              $('.selectType select').find("option[value='zdyOption']").prop("selected",true);
                              $('.selectType').next().find(".link_href").val(editHtmlTitleHref);
                              $('.selectType').next().show();
                              break;
                            }
                        for(var i = 0;i < vm.aggregationList.length; i++){
                            if(thisBind == "decorateId_" + vm.aggregationList[i][0]){
                              $('.selectTypeHref select').find("option[value='decorateId_" + vm.aggregationList[i][0] + "']").prop("selected",true);
                            }
                        }
                }else if(type=="headBq"){// 标签标题
                    $('.selectP').hide();
                    $('.selectP1').hide();
                    $('#htmlCon').show();
                    var editHtmlTitleSrc = p.find('.ln-title-box img').eq(0).prop('src'),
                        editHtmlTitleHref = p.find('.ln-title-box a').eq(0).attr('href'),
                        // editHtmlTitle = "<tr><th>标题图片URL：</th><td><div
                        // class='selectImg'><p
                        // class='title_url'>"+editHtmlTitleSrc+"</p><input
                        // type='file' value='11' class='file' /><span
                        // style='width: 0.6rem;height: 0.2rem;margin-top:
                        // 0.1rem;display:none;'></span></div><p
                        // class='yulanImg'><img src='"+editHtmlTitleSrc+"'
                        // alt=''/></p></td></tr><tr><th>更多URL：</th><td><select
                        // name='' id=''><option value=''
                        // bind='data'>国信大数据</option><option value=''
                        // bind='flow'>流量</option><option value=''
                        // bind='hot'>热销</option><option value=''
                        // bind='school'>校园</option></select></tr>";
                        editHtmlTitle = "<tr><th>图片：</th><td><div class='selectImg'><p class='title_url'>"+editHtmlTitleSrc+"</p><input type='file' value='11' class='file'></div><p class='yulanImg'><img src='"+editHtmlTitleSrc+"' alt=''/></p></td></tr><tr><th>设置“更多”：</th>";
                        editHtmlTitle += "<td><p class='selectType'><select name='' id=''>  ";
                        for(var i = 0 ; i < vm.bqTypeList.length; i++){
                            editHtmlTitle += "<option value='" + vm.bqTypeList[i].lableCode + "' bind='" + '' + "'>" + vm.bqTypeList[i].lableName + "</option>";
                        }
                        editHtmlTitle += "<option value='data7'>优惠</option><option value='data8'>商品列表</option><option value='data9'>新商品列表</option><option value='' bind='complete'>全部</option><option value='zdyOption' bind='zdyOption'>自定义</option></select></p><p class='zdyInput'><input type='text' placeholder='请输入自定义的链接地址' class='link_href'></p></td></tr>";
                        editHtmlTitle += "<tr><td ></td><td colspan='10' ><p style='color:red'>设置更多优先级低于跳转页面，若选择设置“更多”请将跳转页面置为空！</p></td></tr><tr><th>跳转页面：</th><td><p class='selectType selectTypeHref'><select name='' id=''><option value='' bind=''></option>" ;
                        for(var i = 0 ; i < vm.aggregationList.length; i++){
                            editHtmlTitle += "<option value='decorateId_" + vm.aggregationList[i][0] + "' turnHref='" +  vm.aggregationList[i][2] + "?decorateId=" + vm.aggregationList[i][0] + "' bind='decorateId_" + vm.aggregationList[i][0] + "'>" + vm.aggregationList[i][1] + "</option>";
                        }
                        editHtmlTitle += "</p></td></tr>";
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 start **
                         */
                        var goodCodeInputValue = p.find('.myview .ln-title-box a').attr('goodCodeInput');
                        goodCodeInputValue = goodCodeInputValue == undefined ? "" : goodCodeInputValue;
                        editHtmlTitle += ""
                            + "<tr>"
                            + " <th>广告位编码：</th>"
                            + " <td>"
                            + "     <p>"
                            + "         <input id='goodCodeInput' type='text' value='" + goodCodeInputValue + "' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;margin-bottom: 0.05rem;'>"
                            + "     </p>"
                            + " </dd>"
                            + " </td>"
                            + "</tr>";
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                         */
                        $('#htmlCon table').html('').prepend(editHtmlTitle);
                        var thisBind = $(thisClickObj).find('.editing a').attr('bindBqTittleType');
                        for(var i = 0;i < vm.bqTypeList.length; i++){
                            if(thisBind == vm.bqTypeList[i].lableCode){
                              $('.selectType select').find("option[value='" + vm.bqTypeList[i].lableCode + "']").prop("selected",true);
                            }
                        }
                        var thisBind = $(thisClickObj).find('.editing a').attr('bindtype');
                        switch(thisBind)
                            {
                              case 'data1':
                              $('.selectType select').find("option[value='data1']").prop("selected",true);
                              
                              break;
                              case 'data2':
                              $('.selectType select').find("option[value='data2']").prop("selected",true);
                              break;
                              case 'data3':
                              $('.selectType select').find("option[value='data3']").prop("selected",true);
                              break;
                              case 'data4':
                              $('.selectType select').find("option[value='data4']").prop("selected",true);
                              break;
                              case 'data5':
                              $('.selectType select').find("option[value='data5']").prop("selected",true);
                              break;
                              case 'data6':
                              $('.selectType select').find("option[value='data6']").prop("selected",true);
                              break;
                              case 'data7':
                              $('.selectType select').find("option[value='data7']").prop("selected",true);
                              break;
                              case 'data8':
                              $('.selectType select').find("option[value='data8']").prop("selected",true);
                              break;
                              case 'data9':
                              $('.selectType select').find("option[value='data9']").prop("selected",true);
                              break;
                              case 'zdyOption':
                              $('.selectType select').find("option[value='zdyOption']").prop("selected",true);
                              $('.selectType').next().find(".link_href").val(editHtmlTitleHref);
                              $('.selectType').next().show();
                              break;
                            }
                        for(var i = 0;i < vm.aggregationList.length; i++){
                            if(thisBind == "decorateId_" +  vm.aggregationList[i][0]){
                              $('.selectTypeHref select').find("option[value='decorateId_" +  vm.aggregationList[i][0] + "']").prop("selected",true);
                            }
                        }
                }else if(type=="image"){// 静态广告位
                    $('.selectP').hide();
                    $('.selectP1').hide();
                    $('#htmlCon').show();
                    var imgNum = p.find('.myview .goodsImage img').length+1;
                    var editHtmlImg = "";
                    var editPicImgHref = "";
                    var editPicImgName = "";
                    var cmGoodCode = "";
                    var editPicImgbind = "";
                    //var editPicImgApply = "";
                    var ifsadStr = "";//音频图片显示
                    var zysj = "";//左上角右上角显示
                    var yinfuSrc = "";//音频地址
                    var mp3Filename = "";//音频名
                    var popUpButton="";
                    var programLoginFlag="";//小程序必须登录标识
                    var programLoginCheck="";//小程序登录校验标识
                    var editPicAlertName = "";
                    var editPicPosterImg = "";
                    var editPicPosterImgSign = "";
                    var selectTypePhoneHref = "";//终端选择标示
                    var selectTemplateIdHref = "";
                    var checktextstr = '';//展示类型选中
                    var checktexttar = '';//链接选中
                    var templatename = '';//回显模版名
                    var shareFifthTitle = '';//小程序分享标题
                    var shareFifthDesc = '';//小程序分享描述
                    var shareFifthImg = '';//小程序分享图片
                    var clickFun = '';//点击事件

                    var videoSource = '';//视频显示名
                    var videoName = '';//视频名
                    for(var i= 1 ;i<imgNum;i++){
                        var editPicImgSrc = p.find('.myview .goodsImage img').eq(i-1).prop('src');
                        	//视频名
                        	videoSource = p.find('.myview .goodsImage a').eq(i-1).attr('videosourcefilename');
                        	if(!videoSource){
                        		videoSource = '';
                        	}
                        	videoName = p.find('.myview .goodsImage a').eq(i-1).attr('videoname');
                        	if(!videoName){
                        		videoName = '';
                        	}
                        
                        	editPicPosterImg = p.find('.myview .goodsImage a').eq(i-1).attr('postimgurl');
                        	if(!editPicPosterImg){
                        		editPicPosterImg = editPicImgSrc;
                        	}
                        	editPicPosterImgSign = p.find('.myview .goodsImage a').eq(i-1).attr('postimgurlsign');
                        	
                            editPicImgName = p.find('.myview .goodsImage a').eq(i-1).attr('staticname');
                            if(!editPicImgName){
                            	editPicImgName = '';
                            }
                            checktextstr = p.find('.myview .goodsImage a').eq(i-1).attr('checktextstr');
                            checktexttar = p.find('.myview .goodsImage a').eq(i-1).attr('checktexttar');
                            editPicAlertName = p.find('.myview .goodsImage a').eq(i-1).attr('alertname');
                            templatename = p.find('.myview .goodsImage a').eq(i-1).attr('templatename')
                            if(!templatename){
                            	templatename = '';
                            }
                            var turntypeselectName = p.find('.myview .goodsImage a').eq(i-1).attr('turnTypeSelect');
                            selectTypePhoneHref = p.find('.myview .goodsImage a').eq(i-1).attr('selectTypePhoneHref');//终端选择标示 1 跳转列表页 其他跳转详情页
                            selectTemplateIdHref=p.find('.myview .goodsImage a').eq(i-1).attr('selectTemplateIdHref');
                            
                            ifsadStr = p.find('.myview .goodsImage .ifsad').eq(i-1).val();//音频图片显示
                           
                            zysjStr = p.find('.myview .goodsImage .zysj').eq(i-1).val();//左上角右上角显示
                            yinfuSrc = p.find('.myview .goodsImage audio').eq(i-1).attr('src');//音频地址
                            mp3Filename = p.find('.myview .goodsImage audio').eq(i-1).attr('mp3Filename');//音频地址
                            if(!mp3Filename){
                            	mp3Filename = "";
                            }
                            
                            editPicImgbind = p.find('.myview .goodsImage a').eq(i-1).attr('bind') == undefined?"":p.find('.myview .goodsImage a').eq(i-1).attr('bind'); 
                            popUpButton = p.find('.myview .goodsImage a').eq(i-1).attr('popupbutton');
                            programLoginFlag = p.find('.myview .goodsImage a').eq(i-1).attr('programLoginFlag');
                            programLoginCheck = p.find('.myview .goodsImage a').eq(i-1).attr('programLoginCheck');
                            cmGoodCode = p.find('.myview .goodsImage a').eq(i-1).attr('goodCodeInput') == undefined?"":p.find('.myview .goodsImage a').eq(i-1).attr('goodCodeInput');
                            editPicImgHref = p.find('.myview .goodsImage a').eq(i-1).attr('url') == undefined?"":p.find('.myview .goodsImage a').eq(i-1).attr('url');
                            islogin = p.find('.myview .goodsImage a').eq(i-1).attr('goodCodeInput') == undefined?"":p.find('.myview .goodsImage a').eq(i-1).attr('islogin');

                            //小程序分享
                            var shareFifthAll = p.find('.myview .goodsImage a').eq(i-1).attr('onclick');
                            shareFifthImg = p.find('.myview .goodsImage a').eq(i-1).attr('shareImgUrl');
                            if(!shareFifthImg && checktextstr == '7'){
                                shareFifthImg = editPicImgSrc;
                            }
                            if(shareFifthAll && shareFifthAll.indexOf('workWxQrCode')<0 && checktextstr == '7'){//分享数据回显
                                //去掉前后特殊字符
                                shareFifthAll = shareFifthAll.substring(shareFifthAll.indexOf("(")+1,shareFifthAll.lastIndexOf(")"));//下标对于length-1
                                shareFifthTitle = shareFifthAll.split(',')[1];
                                shareFifthTitle = escapeHtml(shareFifthTitle.substring(shareFifthTitle.indexOf("'")+1,shareFifthTitle.lastIndexOf("'")));
                                shareFifthDesc = shareFifthAll.split(',')[2];
                                shareFifthDesc = escapeHtml(shareFifthDesc.substring(shareFifthDesc.indexOf("'")+1,shareFifthDesc.lastIndexOf("'")));
                            }
                            //
                            clickFun = p.find('.myview .goodsImage a').eq(i-1).attr('onclick');


                        editHtml = "<tr><th>广告位编码：</th><td><input id='goodCodeInput' type='text' value='" + cmGoodCode + "' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;margin-bottom: 0.05rem;'></td></tr>";
                            editHtml += "<tr><th>图片：</th><td><div class='selectImg staticImg'><p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file' /><span style='width: 0.6rem;height: 0.2rem;margin-top: 0.1rem;display:none;'></span></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p><p style='float:left;margin-left:20px;margin-top: 0.5rem;font-weight:normal;color:#3c9be1;'><b>建议图片大小：</b><br>一栏 宽*高 400px   *   200px<br>两栏 宽*高 200px   *   100px<br>三栏 宽*高 133px   *   70px<br>四栏 宽*高 100px   *   50px</p></td></tr>"
                           			 +"<tr class='jtggwtr'><th>展示类型：</th><td><select name='' id='selectShowType' style='padding:10px; width:415px;'> <option value='0'>音频</option> <option value='1'>海报</option> <option value='2'>弹层</option> <option value='3'>链接跳转</option> <option value='4'>满意度评价</option><option value='5'>视频</option><option value='6'>自填单</option><option value='7'>小程序分享</option><option value='8'>企业微信</option><option value='9'>点击事件</option></select>" +
                                "<span class=\"redzs fifthWords\" style=\"display: none;\" >仅限“5G小程序”中使用</span></td></tr>"
                            /* 2020 03 23 XQ20031703关于聚合页中分享、办理、尺寸等优化的需求 */
                            /*editHtml += '<tr class="jtggwtr hbtpF allNeedShow showTr_1" style="display:none;"><th>是否生成海报：</th>'
									+ '<td class="pb"><input class="flinput nninput" type="radio" value="y" name="sfshhb" id="" ';
                            if('y' == editPicPosterImgSign){
                            	editHtml += 'checked="checked"';
                            
                            }
                            editHtml += ' onclick="hbzs(this)">'
									+ '<label class="jtlabel" for="sfshhb" style=" float: left;">是</label>'
									+ '<input class="flinput nninput" type="radio" value="n" name="sfshhb" id="" ';
                            if('y' != editPicPosterImgSign){
                            	editHtml += 'checked="checked"';
                            }
                            editHtml +=  ' onclick="hbzs(this)">'
									+ '<label class="jtlabel" for="sfshhb">否</label>'
									+ '</td></tr>'
									+*/ 
									editHtml += '<tr class="jtggwtr hbtpF allNeedShow showTr_1"><th style="top:11px;">海报图片：</th>'
									+ '<td><div class="selectImg posterImg"><p class="title_url" style="height:20px;">'+editPicPosterImg+"</p><input type='file' value='11' class='file'>"
									+ "</div><p class='yulanImg'>"
									+ "<img src='"+editPicPosterImg+"' alt=''/></p>"
									+ '</td></tr>';
                            
							editHtml += "<tr class='jtggwtr allNeedShow showTr_2' style='display:none;'><th>关联弹层：</th><td>";
		                    if(editPicImgHref.indexOf("alertid=") != -1){
		                    	editHtml += "<input id='alertUrl' type='text' value='"+editPicImgHref+"' class='alert_href' style='float:left;'><a style='margin-left:50px;'  onclick=\"chooseAlertinfo('1','');\">选择弹层</a><p class='alerturlname'>" + editPicAlertName + "</p></td></tr>";
		                    }else{
		                    	editHtml += "<input id='alertUrl' type='text' value='' class='alert_href' style='float:left;'><a style='margin-left:50px;'  onclick=\"chooseAlertinfo('1','');\">选择弹层</a></td></tr>";
		                    }
							
							editHtml += "<tr class='jtggwtr allNeedShow showTr_3' style='display:none;'><th>跳转目标：</th><td><select name='' id='targetTo' style='padding:10px;width:415px;'> <option value='0'>链接</option> <option value='2'>我的</option><option value='3'>应用下载</option></select></td></tr>"
                            editHtml += "<tr  class='allNeedShow showTr_3_all showTr_3_0' style='display:none;'><th>链接：</th><td>";
                    		
                    		editHtml += "<div class='uploader' style='margin: 10px auto;'><input id='staticUrl' type='text' value='"+editPicImgHref+"' class='link_href audiofile filename' style='width: 281px;height:40px;' name='poplink'><div class='btnxz2' style='width: 130px; height: 40px;line-height: 40px;text-align: center;border: 1px solid #d7d7d7;'> <i style='font-style: normal; cursor: pointer' onclick=\"chooseAdinfo2('1','');\">请选择广告/聚合页</i></div><span class='redzs' style='color:#333;display: none'>"+editPicImgName+"</span><textarea  type='text' id='adsName' readonly='readonly' style='margin-left: 5px; width: 200px; float: right;border: none;' name='adSName'>"+editPicImgName+"</textarea></div></td></tr>";
                            
                            //自填单
                            editHtml += "<tr  class='allNeedShow  showTr_6' style='display:none;'><th>跳转链接：</th><td>";
                            if(editPicImgHref!= null&&editPicImgHref!=''){
                                editHtml += "<div class='uploader' style='margin: 10px auto;'><input id='customUrl' type='text' value='"+editPicImgHref+"' class='link_href audiofile filename' style='width: 415px;height:40px;' name='poplink'></td></tr>";
                            }else{
                                editHtml += "<div class='uploader' style='margin: 10px auto;'><input id='customUrl' type='text' value='https://wx.10086.cn/website/spa/complaint/ssocomplaints/4E4A3A85A887537270B4CB4AD0B2396C' class='link_href audiofile filename' style='width: 415px;height:40px;' name='poplink'></td></tr>";
                            }

                            editHtml += "<tr class='allNeedShow showTr_3_all showTr_3_0' style='display:none;'><th>打开方式</th><td><select name=\"\" class=\"turnTypeSelect\" id=\"\" style=\"float: left;width: 412px;height:40px;\"> <option value=\"\">请选择打开方式,不选默认为跳转</option> <option value=\"1\" ";
		                    if('1' == turntypeselectName){
								editHtml += " selected = 'selected' ";
							}
							editHtml += " bindclass=\"lkjp\">跳转</option> <option value=\"2\" ";
							if('2' == turntypeselectName){
								editHtml += " selected = 'selected' ";
							}
							editHtml += " bindclass=\"lkzs\">展示</option> </select></td></tr>";
							// 2020 06 02 增加终端选择是否跳转终端列表页
		                    editHtml += " <tr class='jtggwtr allNeedShow showTr_3_all showTr_3_0' style='display:none;'><th>跳转终端列表页：</th><td><p class='selectType '><select class='selectTypePhoneHref' name='' id=''style=\"padding-left:0px;float: left;width: 412px;height:40px;\"><option value='' bind=''>请选择跳转方式，不选默认进详情页（仅对终端广告生效）</option><option value=\"1\" ";
		                    if('1' == selectTypePhoneHref){
								editHtml += " selected = 'selected' ";
							}
							editHtml += " bindclass=\"phoneList\">列表页</option> <option value=\"2\" ";
							if('2' == selectTypePhoneHref){
								editHtml += " selected = 'selected' ";
							}
							editHtml += "bindclass=\"phoneDetail\">详情页</option>";
		                    editHtml += "</select></p></td></tr>";
		                    editHtml += "<tr class=\"jtggwtr allNeedShow showTr_3_all showTr_3_0\" style='display:none;'><th>页面展示：</th><td><input class=\"flinput nninput\" type=\"radio\" value=\"0\"  name=\"popUpButton\" id=\"popUpButton\" ";
		                    if("0" == popUpButton){
		                    	editHtml += "checked='checked'";
		                    }
		                    editHtml += "><label class=\"jtlabel\"style='float:left;'>父页面</label><input class=\"flinput nninput\" type=\"radio\" name=\"popUpButton\" id=\"popUpButton\" value=\"1\" ";
		                    if("0" != popUpButton){
		                    	editHtml += "checked='checked'";
		                    }
		                    editHtml += " ><label class=\"jtlabel\">新页面</label></td></tr>" ;
                            editHtml += "<tr class='jtggwtr allNeedShow showTr_3_all showTr_3_0' style='display:none;'><th>小程序必须登录：</th><td>" +
                                "<input class='flinput nninput' type='radio' value='T'  name='programLoginFlag'";
                            if("T" == programLoginFlag){
                                editHtml += "checked='checked'";
                            }
                            editHtml += "><label class='jtlabel'style='float:left;'>是</label><input class='flinput nninput' type='radio' name='programLoginFlag' value='F' ";
                            if("T" != programLoginFlag){
                                editHtml += "checked='checked'";
                            }
                            editHtml += " ><label class='jtlabel'>否</label></td></tr>" ;
                            editHtml += "<tr class='jtggwtr allNeedShow showTr_3_all showTr_3_0' style='display:none;'><th>小程序登录校验：</th><td>" +
                                "<input class='flinput nninput' type='radio' value='T'  name='programLoginCheck'";
                            if("T" == programLoginCheck){
                                editHtml += "checked='checked'";
                            }
                            editHtml += "><label class='jtlabel'style='float:left;'>是</label><input class='flinput nninput' type='radio' name='programLoginCheck' value='F' ";
                            if("T" != programLoginCheck){
                                editHtml += "checked='checked'";
                            }
                        editHtml += " ><label class='jtlabel'>否</label></td></tr>" ;
                            editHtml +="<tr class='jtggwtr allNeedShow showTr_3_all showTr_3_2' style='display:none;'><th>我的：</th><td><p class='selectType selectTypeMyHref'><select name='' id=''><option value='' bind=''></option>";
                            // 我的数组
		                    for(var j = 0 ; j < myHref.length; j ++){
		                        if(editPicImgbind.indexOf ("mySign_" + myHref[j].split("_")[0])  != -1){
		                            editHtml += "<option value='mySign_" + myHref[j].split("_")[0] + "' selected='selected' bind='mySign_" + myHref[j].split("_")[0] + "'>" + myHref[j].split("_")[1] + "</option>";
		                        } else {
		                            editHtml += "<option value='mySign_" + myHref[j].split("_")[0] + "' bind='mySign_" + myHref[j].split("_")[0] + "'>" + myHref[j].split("_")[1] + "</option>";
		                        }
		                    }
		                    editHtml += "</select></p></td></tr>";
		                    editHtml += "<tr class='jtggwtr allNeedShow showTr_3_all showTr_3_3' style='display:none;'><th>应用下载：</th><td><p class='selectType selectTypeApplyHref'><select name='' id=''><option value='' bind=''></option>";
		                    // 应用下载数组
		                    for(var j = 0 ; j <vm.applyList.length; j ++){
		                        if(editPicImgHref.indexOf ("pkid=" + vm.applyList[j].pkid)  != -1){
		                            editHtml += "<option value='pkid_" + vm.applyList[j].pkid + "' selected='selected' applyDownHref='/rr/lnwd/app/app_det_new.html?pkid="+ vm.applyList[j].pkid +"&appType="+ vm.applyList[j].appType +"' bind='pkid_" + vm.applyList[j].pkid + "'>" + vm.applyList[j].appName + "</option>";
		                        } else {
		                            editHtml += "<option value='pkid_" + vm.applyList[j].pkid + "' applyDownHref='/rr/lnwd/app/app_det_new.html?pkid=" +vm.applyList[j].pkid+ "&appType="+ vm.applyList[j].appType +"' bind='pkid_" + vm.applyList[j].pkid + "'>" + vm.applyList[j].appName + "</option>";
		                        }
		                    }
		                    editHtml += "</select></p></td></tr>";
		                    editHtml += "<tr class=' jtggwtr allNeedShow showTr_4' style='display:none;'><th>满意度评价：</th><td>";
		                    if(selectTemplateIdHref && selectTemplateIdHref.indexOf("templateId=") != -1){
		                    	editHtml += "<input id='templateIdHref' type='text' value='"+selectTemplateIdHref+"' class='templateIdHref' style='float:left;'><a style='margin-left:50px;'  onclick=\"chooseTemplateIdHref('"+selectTemplateIdHref+"',this);\">选择模版</a><p style='float: inherit;left:50px'>"+templatename+"</p></td></tr>";
		                    }else{
		                    	editHtml += "<input id='templateIdHref' type='text' value='' class='templateIdHref' style='float:left;'><a style='margin-left:50px;'  onclick=\"chooseTemplateIdHref('"+selectTemplateIdHref+"',this);\">选择模版</a><p style='float: inherit;left:50px'>"+templatename+"</p></td></tr>";
		                    }

		                    //小程序分享开始
                            editHtml += "<tr class=' jtggwtr allNeedShow showTr_7' style='display:none;'><th>分享图片：</th><td><div class=\"selectImg shareImg\"><p class=\"title_url\" style=\"height:20px;\">"
                                +shareFifthImg+"</p><input type='file' value='11' class='file'>"
                                + "</div><p class='yulanImg'>"
                                + "<img src='"+shareFifthImg+"' alt=''/></p><p style='float:left;margin-left:20px;margin-top: 0.5rem;font-weight:normal;color:red;'><b>图片大小：</b><br>宽*高 210px   *   168px<br>"
                                + "</td></tr>"
                            editHtml += "<tr class=' jtggwtr allNeedShow showTr_7_all showTr_7_0' style='display:none;'><th>分享标题：</th>";
		                    if(shareFifthTitle.length>0){
                                editHtml += "<td><input id='shareProTitle' type='text' value='"+shareFifthTitle+"' class='link_href audiofile filename' style='width: 415px;height:40px;'></td>";
                            }else {
                                editHtml += "<td><input id='shareProTitle' type='text' value='' class='link_href audiofile filename' style='width: 415px;height:40px;'></td>";
                            }
                            editHtml += "<tr class=' jtggwtr allNeedShow showTr_7_all showTr_7_0' style='display:none;'><th>分享描述：</th>";
                            if(shareFifthDesc.length>0){
                                editHtml += "<td><input id='shareProDesc' type='text' value='"+shareFifthDesc+"' class='link_href audiofile filename' style='width: 415px;height:40px;'></td></tr>";
                            }else{
                                editHtml += "<td><input id='shareProDesc' type='text' value='' class='link_href audiofile filename' style='width: 415px;height:40px;'></td></tr>";
                            }
                            //小程序分享结束

                            //点击事件开始
                            editHtml += "<tr class=' jtggwtr allNeedShow showTr_9' style='display:none;'><th>响应方法：</th>"
                            if(clickFun !=undefined && clickFun.length>0){
                                editHtml += "<td><input id='staticClickFun' type='text' value='"+clickFun+"' class='link_href audiofile filename' style='width: 415px;height:40px;'></td></tr>";
                            }else{
                                editHtml += "<td><input id='staticClickFun' type='text' value='' class='link_href audiofile filename' style='width: 415px;height:40px;'></td></tr>";
                            }
                            //点击事件结束

		                    // 视频开始
		                    editHtml += "<tr class=\"jtggwtr allNeedShow showTr_5\" style=\"display:none;\"><th style=\"top:11px;\">视频文件：</th>"
									+ "<td><input id='videoIfHref' type='text' value='"+videoSource+"' class='videoIfHref' style='float:left;'><a style='margin-left:50px;' "
									+ " onclick=\"chooseVideoIfHref('"+videoSource+"',this);\">选择视频</a><p style='float: inherit;left:50px'>"+videoName+"</p><div "
									+ " class=\"video_div\" style=\"width: 415px;height: auto;margin-top: 15px;\"> "
									+ "<video style=\"width:100%;height:auto;\" accept=\"video/mp4\" src='"+vm.mp3ReplacePath+"/"+videoSource+".mp4' controls=\"controls\"></video></div></td></tr>" ;

                            editHtml += "<tr class=\"jtggwtr allNeedShow showTr_0\" style='display:none;'><th>音频文件：</th><td><div class=\"uploader\"><input type=\"text\" readonly=\"\" class=\"audiofile filename\" name=\"audiof\" id=\"xzwjl\" value=\""+mp3Filename+"\"><button class=\"btnxz\"> <i>选择文件</i><input type=\"file\" name='uploadMp3' id=\"mp3File"+i+"\"></button><span class=\"redzs\">注：格式为MP3且大小不超过5M</span></div><div class=\"audio_div\"";
                            if("0" == ifsadStr){
                            	editHtml += "style=\"display: none;\"";
                            }
                            editHtml += "><audio controls=\"\" type=\"audio/mpeg\" src=\""+yinfuSrc+"\"></audio></div></td></tr>";
                            editHtml += "<tr class=\"jtggwtr allNeedShow showTr_0\" style='display:none;'><th>是否展示音频图片：</th><td><input class=\"flinput nninput\" type=\"radio\" value=\"1\"  name=\"ifzsyp\" id=\"szsyp\" ";
                            if("0" != ifsadStr){
                            	editHtml += "checked='checked'";
                            }
                            editHtml += " onclick=\"ifshowad(this)\"><label class=\"jtlabel\" for=\"szsyp\" style='float:left;'>是</label><input class=\"flinput nninput\" type=\"radio\" name=\"ifzsyp\" id=\"fzsyp\" value=\"0\" ";
                            if("0" == ifsadStr){
                            	editHtml += "checked='checked'";
                            }
                            editHtml += " onclick=\"ifshowad(this)\"><label class=\"jtlabel\" for=\"fzsyp\">否</label></td></tr><tr class='jtggwtr allNeedShow showTr_0 jtggwtrShow' style='display:none;' ";
                            if("0" == ifsadStr){
                            	editHtml += "style=\"display: none;\"";
                            } else {
                            	editHtml += "style=\"display: table-row;\"";
                            }
                            editHtml += "><th >音频图片位置：</th><td><input class=\"flinput nninput\" type=\"radio\" value=\"1\"";
                        	if("1" == zysjStr){
                            	editHtml += "checked='checked'";
                            }
                        	editHtml += " name=\"zysj\" id=\"zsj\"><label class=\"jtlabel \" for=\"zsj\" style='float:left;'>左上角</label><input class=\"flinput nninput\" type=\"radio\" name=\"zysj\" id=\"ysj\"";
                        	if("1" != zysjStr){
                            	editHtml += "checked='checked'";
                            }
                        	editHtml += "><label class=\"jtlabel\" value=\"2\" for=\"ysj\">右上角</label></td></tr>";
                            editHtmlImg += editHtml;
                    }
                    $('#htmlCon table').html('').append(editHtmlImg);
                    $('.showTr_0').show();
                    if(checktextstr){
						$("#selectShowType option[value='"+checktextstr+"']").attr("selected","selected");
						$("#checktextstr").val(checktextstr);
						$('.allNeedShow').hide();
						$('.showTr_'+checktextstr).show();
						if('0' != checktextstr){
							$('.showTr_0').hide();
						}
					}
					if(checktexttar){
						$("#targetTo option[value='"+checktexttar+"']").attr("selected","selected");
						$("#checktexttar").val(checktexttar);
						$('.showTr_3_all').hide();
						if('3' == checktextstr){
							$('.showTr_3_'+checktexttar).show();
						}
                        if('7' == checktextstr){//小程序分享
                            $('.showTr_7_'+checktexttar).show();
                            $('.fifthWords').show();//红字提示
                        }
					}
					// 0729
					$('.modal').on('change','#selectShowType',function(e){
						e.preventDefault();
						//跳转目标初始化
						$('#targetTo').children('option').eq(0).prop('selected', true);
						$("#checktexttar").val("0");
						$('.showTr_3_all').hide();
						$('.showTr_3_0').show();
						
						var checkText=$(this).find("option:selected").val();
						console.log(checkText)
						$("#checktextstr").val(checkText);
						$('.allNeedShow').hide();
						$('.showTr_'+checkText).show();
						if(checkText==3){
							$('.showTr_3_0').show()
						}
                        if(checkText==7){//小程序分享
                            $('.fifthWords').show();//红字提示
                            $('.showTr_'+checkText+'_0').show()
                        }else{
                            $('.fifthWords').hide();
                        }
					})
					//选择跳转目标
					$('.modal').on('change','#targetTo',function(e){
						e.preventDefault();
						var checkText=$(this).find("option:selected").val();
						console.log(checkText)
						$("#checktexttar").val(checkText);
						$('.showTr_3_all').hide();
						$('.showTr_3_'+checkText).show();
					})
                    if('y' == editPicPosterImgSign){
                    	$(".hbtpFOld").hide();
                		$('.hbtpF').show();
                    }
                    if("0" == ifsadStr){
                    	$(".jtggwtrShow").css("display","none");
                    }
                }else if(type=="gallery"){// 滚动菜单
                    $('.selectP').hide();
                    $('.selectP1').hide();
                    $('#htmlCon').show();
                    var imgNum = p.find('.myview .swiper-slide img').length+1;
                    var goodcodeinput = p.find('.myview .swiper-wrapper').attr("goodcodeinput") == undefined?"":p.find('.myview .swiper-wrapper').attr("goodcodeinput");    
                    /**
                     * * modify by dingchuan 20190704
                     * 441-YH19070202优化装修页面各广告位插码的需求 start **
                     */
// var editHtmlImg = "<tr><th>广告位编码：</th><td><input id='goodCodeInput'
// type='text' value='"+goodcodeinput+"' goodcodeinputsign='goodcodeinputsign'
// class='goodcodeinputsign' style='float:left;margin-bottom:
// 0.05rem;'></td></tr>";
                    var editHtmlImg = "<tbody><tr><th></th><td></td></tr>";
                    /**
                     * * modify by dingchuan 20190704
                     * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                     */
                    for(var i= 1 ;i<imgNum;i++){
                        var editPicImgOnclick = p.find('.myview .swiper-slide a').eq(i-1).attr('onclick');
                        var editPicImgSrc = p.find('.myview .swiper-slide img').eq(i-1).prop('src');
                        var bindtype = p.find('.myview .swiper-slide a').eq(i-1).attr('bindtype');
                            // editPicImgHref = p.find('.myview .swiper-slide
                            // a').eq(i-1).prop('href');
                        var editText = p.find('.myview .swiper-slide p').eq(i-1).text();
                            // editPicImgHref = p.find('.navbottom-box li
                            // a').eq(i-1).prop('href'),
                        var editHtml = "<tr><th class='border'><img src='../../images/decorate/delete.png' onclick='deleteTr(this);' class='deleteTr'/>菜单</th><td class='border' style='position:relative;'><dl class='tableDl'><dt>菜单名称：</dt><dd><div class='selectType'><div class='divBox selector1p'><p>"+editText+"</p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1' bind='hot'>热销</option><option value='data2' bind='flow'>流量</option><option value='data3' bind='digitizing'>数字化</option><option value='data4' bind='school'>校园</option><option value='data5'  bind=\"apply\">应用下载</option><option value='data6' bind='phone'>终端</option><option value='data7' bind='app_Recomdation'>应用推荐</option><option value='zdyOption' bind='zdyOption'>自定义</option></select></div></div><p class='zdyInput fl'><input type='text' class='menuName' placeholder='请输入菜单名称'></p></dd></dl>" ;                         
                        if(editPicImgOnclick != '' && editPicImgOnclick != null && editPicImgOnclick != undefined){
                            editHtml = "<tr><th class='border'><img src='../../images/decorate/delete.png' onclick='deleteTr(this);'  class='deleteTr'/>菜单</th><td class='border' style='position:relative;'><dl class='tableDl'><dt>菜单名称：</dt><dd><div class='selectType'><div class='divBox selector1p'><p>自定义</p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1' bind='hot'>热销</option><option value='data2' bind='flow'>流量</option><option value='data3' bind='digitizing'>数字化</option><option value='data4' bind='school'>校园</option><option value='data5'  bind=\"apply\">应用下载</option><option value='data6' bind='phone'>终端</option><option value='data7' bind='app_Recomdation'>应用推荐</option><option value='zdyOption' bind='zdyOption' selected='seleceted'>自定义</option></select></div></div><p class='zdyInput fl' style='display:block'><input type='text' class='menuName' placeholder='请输入菜单名称' value='"+editText+"'></p></dd></dl>" ;     
                            if(bindtype == 'zdyOption'){
                              if(editPicImgOnclick.indexOf("decorateId=") != -1){
                                editHtml += "<dl class='tableDl jumpType' style='display:block'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+i+"' value='lj"+i+"'>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='gg"+i+"' >广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='jhy"+i+"' checked>聚合页</label></p><p id='ljInput"+i+"' class='ljInput' style='display:none;'><input type='text' class='ml10 menuUrl'  placeholder='请输入链接地址' style='margin-left: 0px;'></p><p  id='ggInput"+i+"' class='ggInput' ><input type='text' class='ml10 menuUrl menuSign menuUrlChoose" + i + "' placeholder='请选择广告' style='width:390px;margin-left: 0px;'> <a style='margin-left:10px;'  onclick=\"chooseAdinfo('2','" + i + "');\">选择广告</a></p><p id='jhyInput"+i+"' class='jhyInput' style='display:block;'><select name='' id=''><option value=''>请选择</option>";
                              } else {
                                if(editPicImgOnclick.indexOf("adid=") != -1){// 广告显示
                                  // 聚合页及连接隐藏
                                  var editPicImgAdinfoName = p.find('.myview .swiper-slide a').eq(i-1).attr('staticname');
                                  var editPicImgAdinfo = p.find('.myview .swiper-slide a').eq(i-1).attr('adinfo');
                                  editHtml += "<dl class='tableDl jumpType' style='display:block'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+i+"' value='lj"+i+"'>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='gg"+i+"' checked>广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='jhy"+i+"'>聚合页</label></p><p id='ljInput"+i+"' class='ljInput' style='display:none;'><input type='text' class='ml10 menuUrl'  placeholder='请输入链接地址' style='margin-left: 0px;'></p><p  id='ggInput"+i+"' class='ggInput' style='display:block;'><input type='text' class='ml10 menuUrl menuSign menuUrlChoose" + i + "' placeholder='请选择广告' value= '"+editPicImgAdinfo+"'style='width:390px;margin-left: 0px;'> <a style='margin-left:10px;'  onclick=\"chooseAdinfo('2','" + i + "');\">选择广告</a><p class='staticurlname"+i+"'> " + editPicImgAdinfoName + "</p></p><p id='jhyInput"+i+"' class='jhyInput' style='display:none;'><select name='' id=''><option value=''>请选择</option>";
                                } else {     
                                  var llUrl = p.find('.myview .swiper-slide a').eq(i-1).attr('url');
                                  editHtml += "<dl class='tableDl jumpType' style='display:block'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+i+"' value='lj"+i+"' checked>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='gg"+i+"'>广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='jhy"+i+"'>聚合页</label></p><p id='ljInput"+i+"' class='ljInput'><input type='text' class='ml10 menuUrl'  placeholder='请输入链接地址' value='"+llUrl+"' style='margin-left: 0px;'></p><p  id='ggInput"+i+"' class='ggInput'><input type='text' class='ml10 menuUrl menuSign menuUrlChoose" + i + "' placeholder='请选择广告' style='width:390px;margin-left: 0px;'> <a style='margin-left:10px;'  onclick=\"chooseAdinfo('2','" + i + "');\">选择广告</a></p><p id='jhyInput"+i+"' class='jhyInput' ><select name='' id=''><option value=''>请选择</option>";
                                }
                              }
                            }
                        }else{
                            editHtml += "<dl class='tableDl jumpType'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+i+"' value='lj"+i+"' checked>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='gg"+i+"'>广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='jhy"+i+"'>聚合页</label></p><p id='ljInput"+i+"' class='ljInput'><input type='text' class='ml10 menuUrl'  placeholder='请输入链接地址' style='margin-left: 0px;'></p><p  id='ggInput"+i+"' class='ggInput'><input type='text' class='ml10 menuUrl menuSign menuUrlChoose" + i + "' placeholder='请选择广告' style='width:390px;margin-left: 0px;'> <a style='margin-left:10px;'  onclick=\"chooseAdinfo('2','" + i + "');\">选择广告</a></p><p id='jhyInput"+i+"' class='jhyInput' ><select name='' id=''><option value=''>请选择</option>";
                        }
                        
                        for(var j = 0 ; j < vm.aggregationList.length; j++){
                            if(editPicImgOnclick != '' && editPicImgOnclick != null && editPicImgOnclick != undefined && editPicImgOnclick.indexOf ("decorateId=" +  vm.aggregationList[j][0])  != -1){
                              editHtml += "<option selected='selected' value='decorateId_" + vm.aggregationList[j][0] + "' turnHref='" +  vm.aggregationList[j][2] + "?decorateId=" + vm.aggregationList[j][0] + "' bind='decorateId_" + vm.aggregationList[j][0] + "'>" + vm.aggregationList[j][1] + " </option>";
                            } else {
                              editHtml += "<option value='decorateId_" + vm.aggregationList[j][0] + "' turnHref='" +  vm.aggregationList[j][2] + "?decorateId=" + vm.aggregationList[j][0] + "' bind='decorateId_" + vm.aggregationList[j][0] + "'>" + vm.aggregationList[j][1] + "</option>";
                            }
                        }
                        /**
                         * * modify by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 start **
                         */
                        // editHtml += "</select></p></dd></dl><dl
                        // class='tableDl'><dt>菜单图片：</dt><dd><div class='selectImg'><p
                        // class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11'
                        // class='file'><button type='button' class='spanUpload'>上传</button></div><p
                        // class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p><p
                        // class='tsy'>建议尺寸95*95</p></dd></dl></td></tr>";
                        editHtml += "</select></p></dd></dl><dl class='tableDl'><dt>菜单图片：</dt><dd><div class='selectImg'><p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file'><button type='button' class='spanUpload'>上传</button></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p><p class='tsy'>建议尺寸95*95</p></dd></dl>";
                        var goodcodeinput = p.find('.myview .swiper-slide a').eq(i-1).attr('goodCodeInput');
                        goodcodeinput = goodcodeinput == undefined ? "" : goodcodeinput;
                        editHtml += ""
                            + "<dl class='tableDl ggwbm'>"
                            + " <dt>广告位编码：</dt>"
                            + " <dd>"
                            + "     <p id='goodCodeInput"+i+"'>"
                            + "         <input type='text' value='"+goodcodeinput+"' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;margin-bottom: 0.05rem;'>"
                            + "     </p>"
                            + " </dd>"
                            + "</dl>"
                            +"<div style=' position:absolute; top:5px; right:7px;' ><p class='ydicon'><image src='../../images/sm_01.png' width='16' onclick='tablezdCk(this)'></p><p class='ydicon'><image src='../../images/sm_02.png' width='16' onclick='tableUpModule(this)'></p><p class='ydicon'><image src='../../images/sm_03.png' width='16' onclick='tableDownModule(this)'></p><p class='ydicon'><image src='../../images/sm_05.png' width='16' onclick='tableendCk(this)'></p></div>"
                            + "</td></tr>";
                        
                        /**
                         * * modify by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 end ***
                         */
                        editHtmlImg += editHtml;
                    }
                    var trAddMenu = '<tfoot><tr class="trAddMenu"><td class="border" colspan="2" align="center"><button type="button">增加菜单</button></td></tr></tfoot>';
                    $('#htmlCon table').html('').append(editHtmlImg + trAddMenu);
                    imgNumStr = imgNum - 1;
                    $('.trAddMenu button').click(function(){
                        imgNumStr = imgNumStr + 1;
                        var i=$(this).parents('tfoot').find('tbody').children("tr").length;
                        if(i-1 > 9){
                            alert("添加的菜单不能超过九个");
                            return;
                        }
                        var editHtmladd = "<tr><th class='border'><img src='../../images/decorate/delete.png'  onclick='deleteTr(this);'   class='deleteTr'/>菜单</th><td class='border' style='position:relative;'><dl class='tableDl'><dt>菜单名称：</dt><dd><div class='selectType'><div class='divBox selector1p'><p></p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1' bind='hot' >热销</option><option value='data2' bind='flow' >流量</option><option value='data3' bind='digitizing' >数字化</option><option value='data4' bind='school'>校园</option><option value='data5' bind=\"apply\" >应用下载</option><option value='data6' bind='phone'>终端</option><option value='data7' bind='app_Recomdation'>应用推荐</option><option value='zdyOption' bind='zdyOption'>自定义</option></select></div></div><p class='zdyInput fl'><input type='text' class='menuName' placeholder='请输入菜单名称'></p></dd></dl><dl class='tableDl jumpType'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+imgNumStr+"' value='lj"+imgNumStr+"' checked>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+imgNumStr+"' value='gg"+imgNumStr+"'>广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+imgNumStr+"' value='jhy"+imgNumStr+"'>聚合页</label></p><p id='ljInput"+imgNumStr+"' class='ljInput'><input type='text' class='ml10 menuUrl' placeholder='请输入链接地址' style='margin-left: 0px;'></p><p  id='ggInput"+imgNumStr+"' class='ggInput'><input type='text' class='ml10 menuUrl menuSign menuUrlChoose" + imgNumStr + "'  placeholder='请选择广告' style='width:390px;margin-left: 0px;'><a style='margin-left:10px;'  onclick=\"chooseAdinfo('2','" + imgNumStr + "');\">选择广告</a></p><p id='jhyInput"+imgNumStr+"' class='jhyInput'><select name='' id=''><option value=''>请选择</option>";
                        for(var i = 0 ; i < vm.aggregationList.length; i++){
                            editHtmladd += "<option value='decorateId_" + vm.aggregationList[i][0] + "' turnHref='" +  vm.aggregationList[i][2] + "?decorateId=" + vm.aggregationList[i][0] + "' bind='decorateId_" + vm.aggregationList[i][0] + "'>" + vm.aggregationList[i][1] + "</option>";
                        }
                        /**
                         * * modify by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 start **
                         */
                        // editHtmladd += "</select></p></dd></dl><dl
                        // class='tableDl'><dt>菜单图片：</dt><dd><div class='selectImg'><p
                        // class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11'
                        // class='file'><button type='button' class='spanUpload'>上传</button></div><p
                        // class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p><p
                        // class='tsy'>建议尺寸95*95</p></dd></dl></td></tr>";
                        editHtmladd += "</select></p></dd></dl><dl class='tableDl'><dt>菜单图片：</dt><dd><div class='selectImg'><p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file'><button type='button' class='spanUpload'>上传</button></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p><p class='tsy'>建议尺寸95*95</p></dd></dl>";
                        editHtmladd += ""
                            + "<dl class='tableDl ggwbm'>"
                            + " <dt>广告位编码：</dt>"
                            + " <dd>"
                            + "     <p id='goodCodeInput"+imgNumStr+"'>"
                            + "         <input type='text' value='' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;margin-bottom: 0.05rem;'>"
                            + "     </p>"
                            + " </dd>"
                            + "</dl>"
                            +"<div style=' position:absolute; top:5px; right:7px;' ><p class='ydicon'><image src='../../images/sm_01.png' width='16' onclick='tablezdCk(this)'></p><p class='ydicon'><image src='../../images/sm_02.png' width='16' onclick='tableUpModule(this)'></p><p class='ydicon'><image src='../../images/sm_03.png' width='16' onclick='tableDownModule(this)'></p><p class='ydicon'><image src='../../images/sm_05.png' width='16' onclick='tableendCk(this)'></p></div>"
                            + "</td></tr>";
                        /**
                         * * modify by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 end ***
                         */
                        $('#htmlCon table .trAddMenu').before(editHtmladd);
                        var slideHtml = '<div class="swiper-slide"><a href="#" class="bind" bind="swiper_id110_href"><img src="images/newindeximg/rrico_6.png" alt="" class="bind" bind="swiper_id110_src"><p>终端</p></a></div>';
                        $('.demo .swiper-lnbusiness .swiper-wrapper').append(slideHtml);
                    });
                    
                    
                }else if(type=="twoGallery"){// 双层菜单
                    $('.selectP').hide();
                    $('.selectP1').hide();
                    $('#htmlCon').show();
                    var imgNum = p.find('.myview .swiper-slide img').length+1;
                    var goodcodeinput = p.find('.myview .swiper-wrapper').attr("goodcodeinput") == undefined?"":p.find('.myview .swiper-wrapper').attr("goodcodeinput");    
                    /**
                     * * modify by dingchuan 20190704
                     * 441-YH19070202优化装修页面各广告位插码的需求 start **
                     */
                    // var editHtmlImg = "<tr><th>广告位编码：</th><td><input id='goodCodeInput'
                    // type='text' value='"+goodcodeinput+"' goodcodeinputsign='goodcodeinputsign'
                    // class='goodcodeinputsign' style='float:left;margin-bottom:
                    // 0.05rem;'></td></tr>";
                    var editHtmlImg = "<tr><th></th><td></td></tr>";
                    /**
                     * * modify by dingchuan 20190704
                     * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                     */
                    for(var i= 1 ;i<imgNum;i++){
                        var editPicImgOnclick = p.find('.myview .swiper-slide a').eq(i-1).attr('onclick');
                        var editPicImgSrc = p.find('.myview .swiper-slide img').eq(i-1).prop('src');
                        var bindtype = p.find('.myview .swiper-slide a').eq(i-1).attr('bindtype');
                            // editPicImgHref = p.find('.myview .swiper-slide
                            // a').eq(i-1).prop('href');
                        var editText = p.find('.myview .swiper-slide p').eq(i-1).text();
                            // editPicImgHref = p.find('.navbottom-box li
                            // a').eq(i-1).prop('href'),
                        var editHtml = "<tr><th class='border'>菜单</th><td class='border' style='position:relative;'><dl class='tableDl' style='position:relative;'><dt>菜单名称：</dt><dd><div class='selectType'><div class='divBox selector1p'><p>"+editText+"</p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1' bind='hot'>热销</option><option value='data2' bind='flow'>流量</option><option value='data3' bind='digitizing'>数字化</option><option value='data4' bind='school'>校园</option><option value='data5'  bind=\"apply\">应用下载</option><option value='data6' bind='phone'>终端</option><option value='data7' bind='app_Recomdation'>应用推荐</option><option value='zdyOption' bind='zdyOption'>自定义</option></select></div></div><p class='zdyInput fl'><input type='text' class='menuName' placeholder='请输入菜单名称'></p></dd></dl>" ;                         
                        if(editPicImgOnclick != '' && editPicImgOnclick != null && editPicImgOnclick != undefined){
                            editHtml = "<tr><th class='border'><img src='../../images/decorate/delete.png' onclick='deleteTr(this);'  class='deleteTr'/>菜单</th><td class='border' style='position:relative;' style='position:relative;'><dl class='tableDl'><dt>菜单名称：</dt><dd><div class='selectType'><div class='divBox selector1p'><p>自定义</p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1' bind='hot'>热销</option><option value='data2' bind='flow'>流量</option><option value='data3' bind='digitizing'>数字化</option><option value='data4' bind='school'>校园</option><option value='data5'  bind=\"apply\">应用下载</option><option value='data6' bind='phone'>终端</option><option value='data7' bind='app_Recomdation'>应用推荐</option><option value='zdyOption' bind='zdyOption' selected='seleceted'>自定义</option></select></div></div><p class='zdyInput fl' style='display:block'><input type='text' class='menuName' placeholder='请输入菜单名称' value='"+editText+"'></p></dd></dl>" ;     
                            if(bindtype == 'zdyOption'){
                              if(editPicImgOnclick.indexOf("decorateId=") != -1){
                                editHtml += "<dl class='tableDl jumpType' style='display:block'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+i+"' value='lj"+i+"'>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='gg"+i+"' >广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='jhy"+i+"' checked>聚合页</label></p><p id='ljInput"+i+"' class='ljInput' style='display:none;'><input type='text' class='ml10 menuUrl'  placeholder='请输入链接地址' style='margin-left: 0px;'></p><p  id='ggInput"+i+"' class='ggInput' ><input type='text' class='ml10 menuUrl menuSign menuUrlChoose" + i + "' placeholder='请选择广告' style='width:390px;margin-left: 0px;'> <a style='margin-left:10px;'  onclick=\"chooseAdinfo('2','" + i + "');\">选择广告</a></p><p id='jhyInput"+i+"' class='jhyInput' style='display:block;'><select name='' id=''><option value=''>请选择</option>";
                              } else {
                                if(editPicImgOnclick.indexOf("adid=") != -1){// 广告显示
                                  // 聚合页及连接隐藏
                                  var editPicImgAdinfoName = p.find('.myview .swiper-slide a').eq(i-1).attr('staticname');
                                  var editPicImgAdinfo = p.find('.myview .swiper-slide a').eq(i-1).attr('adinfo');
                                  editHtml += "<dl class='tableDl jumpType' style='display:block'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+i+"' value='lj"+i+"'>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='gg"+i+"' checked>广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='jhy"+i+"'>聚合页</label></p><p id='ljInput"+i+"' class='ljInput' style='display:none;'><input type='text' class='ml10 menuUrl'  placeholder='请输入链接地址' style='margin-left: 0px;'></p><p  id='ggInput"+i+"' class='ggInput' style='display:block;'><input type='text' class='ml10 menuUrl menuSign menuUrlChoose" + i + "' placeholder='请选择广告' value= '"+editPicImgAdinfo+"'style='width:390px;margin-left: 0px;'> <a style='margin-left:10px;'  onclick=\"chooseAdinfo('2','" + i + "');\">选择广告</a><p class='staticurlname"+i+"'> " + editPicImgAdinfoName + "</p></p><p id='jhyInput"+i+"' class='jhyInput' style='display:none;'><select name='' id=''><option value=''>请选择</option>";
                                } else {     
                                  var llUrl = p.find('.myview .swiper-slide a').eq(i-1).attr('url');
                                  editHtml += "<dl class='tableDl jumpType' style='display:block'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+i+"' value='lj"+i+"' checked>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='gg"+i+"'>广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='jhy"+i+"'>聚合页</label></p><p id='ljInput"+i+"' class='ljInput'><input type='text' class='ml10 menuUrl'  placeholder='请输入链接地址' value='"+llUrl+"' style='margin-left: 0px;'></p><p  id='ggInput"+i+"' class='ggInput'><input type='text' class='ml10 menuUrl menuSign menuUrlChoose" + i + "' placeholder='请选择广告' style='width:390px;margin-left: 0px;'> <a style='margin-left:10px;'  onclick=\"chooseAdinfo('2','" + i + "');\">选择广告</a></p><p id='jhyInput"+i+"' class='jhyInput' ><select name='' id=''><option value=''>请选择</option>";
                                }
                              }
                            }
                        }else{
                            editHtml += "<dl class='tableDl jumpType'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+i+"' value='lj"+i+"' checked>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='gg"+i+"'>广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+i+"' value='jhy"+i+"'>聚合页</label></p><p id='ljInput"+i+"' class='ljInput'><input type='text' class='ml10 menuUrl'  placeholder='请输入链接地址' style='margin-left: 0px;'></p><p  id='ggInput"+i+"' class='ggInput'><input type='text' class='ml10 menuUrl menuSign menuUrlChoose" + i + "' placeholder='请选择广告' style='width:390px;margin-left: 0px;'> <a style='margin-left:10px;'  onclick=\"chooseAdinfo('2','" + i + "');\">选择广告</a></p><p id='jhyInput"+i+"' class='jhyInput' ><select name='' id=''><option value=''>请选择</option>";
                        }
                        for(var j = 0 ; j < vm.aggregationList.length; j++){
                            if(editPicImgOnclick != '' && editPicImgOnclick != null && editPicImgOnclick != undefined && editPicImgOnclick.indexOf ("decorateId=" +  vm.aggregationList[j][0])  != -1){
                              editHtml += "<option selected='selected' value='decorateId_" + vm.aggregationList[j][0] + "' turnHref='" +  vm.aggregationList[j][2] + "?decorateId=" + vm.aggregationList[j][0] + "' bind='decorateId_" + vm.aggregationList[j][0] + "'>" + vm.aggregationList[j][1] + " </option>";
                            } else {
                              editHtml += "<option value='decorateId_" + vm.aggregationList[j][0] + "' turnHref='" +  vm.aggregationList[j][2] + "?decorateId=" + vm.aggregationList[j][0] + "' bind='decorateId_" + vm.aggregationList[j][0] + "'>" + vm.aggregationList[j][1] + "</option>";
                            }
                        }
                        /**
                         * * modify by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 start **
                         */
                        // editHtml += "</select></p></dd></dl><dl
                        // class='tableDl'><dt>菜单图片：</dt><dd><div class='selectImg'><p
                        // class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11'
                        // class='file'><button type='button' class='spanUpload'>上传</button></div><p
                        // class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p><p
                        // class='tsy'>建议尺寸95*95</p></dd></dl></td></tr>";
                        editHtml += "</select></p></dd></dl><dl class='tableDl'><dt>菜单图片：</dt><dd><div class='selectImg'><p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file'><button type='button' class='spanUpload'>上传</button></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p><p class='tsy'>建议尺寸95*95</p></dd></dl>";
                        var goodcodeinput = p.find('.myview .swiper-slide a').eq(i-1).attr('goodCodeInput');
                        goodcodeinput = goodcodeinput == undefined ? "" : goodcodeinput;
                        editHtml += ""
                            + "<dl class='tableDl ggwbm'>"
                            + " <dt>广告位编码：</dt>"
                            + " <dd>"
                            + "     <p id='goodCodeInput"+i+"'>"
                            + "         <input type='text' value='"+goodcodeinput+"' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;margin-bottom: 0.05rem;'>"
                            + "     </p>"
                            + " </dd>"
                            + "</dl>"
                            +"<div style=' position:absolute; top:5px; right:7px;' ><p class='ydicon'><image src='../../images/sm_01.png' width='16' onclick='tablezdCk(this)'></p><p class='ydicon'><image src='../../images/sm_02.png' width='16' onclick='tableUpModule(this)'></p><p class='ydicon'><image src='../../images/sm_03.png' width='16' onclick='tableDownModule(this)'></p><p class='ydicon'><image src='../../images/sm_05.png' width='16' onclick='tableendCk(this)'></p></div>"
                            + "</td></tr>";
                        /**
                         * * modify by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 end ***
                         */
                        editHtmlImg += editHtml;
                    }
                    // var trAddMenu = '<tr class="trAddMenu"><td class="border"
                    // colspan="2" align="center"><button
                    // type="button">增加菜单</button></td></tr>';
                    // $('#htmlCon table').html('').append(editHtmlImg +
                    // trAddMenu);
                    $('#htmlCon table').html('').append(editHtmlImg);
                    imgNumStr = imgNum - 1;
                    $('.trAddMenu button').click(function(){
                        imgNumStr = imgNumStr + 1;
                        var i=$(this).parents('table').find('tr').length;
                        var editHtmladd = "<tr><th class='border'><img src='../../images/decorate/delete.png' class='deleteTr'/>菜单</th><td class='border'><dl class='tableDl' style='position:relative;'><dt>菜单名称：</dt><dd><div class='selectType'><div class='divBox selector1p'><p></p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1'>热销</option><option value='data2'>流量</option><option value='data3'>数字化</option><option value='data4'>校园</option><option value='data5'>应用下载</option><option value='data6' bind='phone'>终端</option><option value='data7' bind='app_Recomdation'>应用推荐</option><option value='zdyOption' bind='zdyOption'>自定义</option></select></div></div><p class='zdyInput fl'><input type='text' class='menuName' placeholder='请输入菜单名称'></p></dd></dl><dl class='tableDl jumpType'><dt>跳转类型：</dt><dd><p><label><input type='radio' name='linkType"+imgNumStr+"' value='lj"+imgNumStr+"' checked>链接</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+imgNumStr+"' value='gg"+imgNumStr+"'>广告</label>&nbsp;&nbsp;<label><input type='radio' name='linkType"+imgNumStr+"' value='jhy"+imgNumStr+"'>聚合页</label></p><p id='ljInput"+imgNumStr+"' class='ljInput'><input type='text' class='ml10 menuUrl' placeholder='请输入链接地址' style='margin-left: 0px;'></p><p  id='ggInput"+imgNumStr+"' class='ggInput'><input type='text' class='ml10 menuUrl menuSign menuUrlChoose" + imgNumStr + "'  placeholder='请选择广告' style='width:390px;margin-left: 0px;'><a style='margin-left:10px;'  onclick=\"chooseAdinfo('2','" + imgNumStr + "');\">选择广告</a></p><p id='jhyInput"+imgNumStr+"' class='jhyInput'><select name='' id=''><option value=''>请选择</option>";
                        for(var i = 0 ; i < vm.aggregationList.length; i++){
                            editHtmladd += "<option value='decorateId_" + vm.aggregationList[i][0] + "' turnHref='" +  vm.aggregationList[i][2] + "?decorateId=" + vm.aggregationList[i][0] + "' bind='decorateId_" + vm.aggregationList[i][0] + "'>" + vm.aggregationList[i][1] + "</option>";
                        }
                        editHtmladd += "</select></p></dd></dl><dl class='tableDl'><dt>菜单图片：</dt><dd><div class='selectImg'><p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file'><button type='button' class='spanUpload'>上传</button></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p><p class='tsy'>建议尺寸95*95</p></dd></dl></td></tr>";
                        $('#htmlCon table .trAddMenu').before(editHtmladd);
                        var slideHtml = '<div class="swiper-slide"><a href="#" class="bind" bind="swiper_id110_href"><img src="images/newindeximg/rrico_6.png" alt="" class="bind" bind="swiper_id110_src"><p>终端</p></a></div>';
                        $('.demo .swiper-lnbusiness .swiper-wrapper').append(slideHtml);
                    });
                    
                    
                }else if(type=="bottomNav"){// 底部导航
                    $('.selectP').hide();
                    $('.selectP1').hide();
                    $('#htmlCon').show();
                    var imgNum = p.find('.navbottom-box li').length+1;
                    var editHtmlImg = "";
                    var addTbody = '<tr class="addBtn"><td colspan="2" align="right"><button type="submit" name="submit" class="submitted" style="margin-bottom:10px;">新增</button></td></tr>';
                    for(var i= 1 ;i<imgNum;i++){
                    	var dbdh_ggwbm = p.find('.navbottom-box li a').eq(i-1).attr("goodcodeinput");
                    	if(!dbdh_ggwbm){
                    		dbdh_ggwbm = '';
                    	}
                        var editText = p.find('.navbottom-box li a').eq(i-1).text();
                        var url = p.find('.navbottom-box li a').eq(i-1).attr("url");
                        var goldenFish = p.find('.navbottom-box li a').eq(i-1).attr("goldenfishmdl");
                        var decorateId = p.find('.navbottom-box li a').eq(i-1).attr("decorateId");
                        
						editHtml = "<tr><td class='border'><div class='selectType'><i>菜单名称：</i><div class='divBox selector1p'><p>"
							+ editText
							+ "</p><select name='' "
							+ " id='' class='bottomSelect'><option value=''>" +
							" </option><option value='data1' bindClass='sy active' bind='indexBottom'>首页</option> " +
							" <option value='data2' bind='flBottom' bindClass='fl'>分类</option> " +
							" <option value='data3' bindClass='fjdd' bind='nearbyBottom'>附近的店</option> " +
							" <option value='data4' bindClass='wd' bind='myBottom'>我的</option>" +
							" <option value='data5' bindClass='shop' bind='shopBottom'>商城</option>" +
							" <option value='data6' bindClass='collect' bind='scBottom'>收藏</option>" +
							" <option value='data7' bindClass='wtfk' bind='wtfkBottom'>问题反馈</option>" +
							" <option value='data8' bindClass='yhlb' bind='yhlbBottom'>优惠</option>" +
							" <option value='data9' bind='newflBottom' bindClass='newflBottom'>新分类页</option> " +
							" <option value='zdyOption' bind='zdyOption' bindClass='plusPrivilege'>特权</option>" +
							" <option value='zdyOption' bind='zdyOption' bindClass='plusWelfare'>福利</option>" +
							//" <option value='zdyOption' bind='zdyOption' bindClass='plusOpening'>立即开通</option>" +
							" <option value='zdyOption' bind='zdyOption' bindClass='plusShop'>营业厅</option>" +
							" <option value='zdyOption' bind='zdyOption' bindClass='plusMyBottom'>plus我的</option>" +
                            " <option value='goldenFishBottom' bind='goldenFishBottom' bindClass='goldenFishBottom'>锦鲤</option>" +
							//" <option value='data10' bind='dgBottom' bindClass='dg'>导购</option> "+
							" </select></div></div><p class='zdyInput' style='display:none;'>" +
							" <dl class=\"tableDl jumpType\" style=\"\">" +
							" <dt  style=\" width: 142px;   text-align: center; \">跳转类型：</dt><dd><p><label>" +
							" <input type=\"radio\" name=\"linkType" + i + "\" value=\"lj" + i + "\"";
						if (!decorateId) {
							editHtml += "  checked=\"checked\"";
						}
						editHtml += ">链接</label>&nbsp;&nbsp;"
								+ " <label><input type=\"radio\" name=\"linkType"
								+ i
								+ "\" value=\"jhy"
								+ i + "\"";
						if (decorateId) {
							editHtml += "  checked=\"checked\"";
						}
						editHtml += ">聚合页</label></p>"
								+ " <p id=\"ljInput"
								+ i
								+ "\" class=\"ljInput\" " ;
						if (decorateId) {
							editHtml += "  style=\"display: none;\" ";
						} else {
							editHtml += "  style=\"display: block;\" ";
						}
						editHtml += " ><input type=\"text\" class=\"ml10 menuUrl\" placeholder=\"请输入链接地址\" style=\"margin-left: 0px;\"";
						if (!decorateId) {
							if (url) {
								editHtml += "  value='"
										+ url
										+ "' ";
							}
						}
						editHtml += "></p>"
								+ " <p id=\"jhyInput"
								+ i
								+ "\" class=\"jhyInput\" ";
						if (decorateId) {
							editHtml += "  style=\"display: block;\" ";
						} else {
							editHtml += "  style=\"display: none;\" ";
						}
						editHtml += " ><select name=\"\" id=\"\"><option value=''>请选择</option> ";
                        
                        
                        for(var j = 0 ; j < vm.aggregationList.length; j++){
                            if(url != '' && url != null && url != undefined && url.indexOf ("decorateId=" +  vm.aggregationList[j][0])  != -1){
  editHtml += "<option selected='selected' value='decorateId_" + vm.aggregationList[j][0] + "' turnHref='" +  vm.aggregationList[j][2] + "?decorateId=" + vm.aggregationList[j][0] + "' bind='decorateId_" + vm.aggregationList[j][0] + "'>" + vm.aggregationList[j][1] + " </option>";
                            } else {
  editHtml += "<option value='decorateId_" + vm.aggregationList[j][0] + "' turnHref='" +  vm.aggregationList[j][2] + "?decorateId=" + vm.aggregationList[j][0] + "' bind='decorateId_" + vm.aggregationList[j][0] + "'>" + vm.aggregationList[j][1] + "</option>";
                            }
                        } 
                        editHtml += "</select></p></dd></dl>" +
                            "<dl class=\"tableDl goldenFishEs\" style=\"display: none;\">" +
                            "<dt  style=\" width: 142px;   text-align: center; \">是否免登录：</dt><dd><select style='width: 194px;'>" ;
                            if(goldenFish == '1'){
                             editHtml +=  "<option value='1' selected>是</option><option value='0'>否</option>" ;
                            }else if(goldenFish === '0'){
                                editHtml += "<option value='1' >是</option><option value='0' selected>否</option>";
                            }else {
                                editHtml +=  "<option value='1' selected>是</option><option value='0'>否</option>" ;
                            }
                        editHtml += "</select></dd>" +
                            "</dl>" +
                            "</p>" +
                            " <div class='div_ggwbm'><p style=\"left: 30px;\">广告位编码："
                        	+ "<input style=\"float: right;margin-left: 40px;width: 194px;margin-bottom: 5px;\" class='dbdh_ggwbm' value="+dbdh_ggwbm+"></p></div></td><td class='border' align='center'>" 
							 + "<button type='submit' name='submit' class='submitted deleteNav'>删除</button></td></tr>";
					editHtmlImg += editHtml;
                    }

                    $('.modals #htmlCon table').html('').append(addTbody+editHtmlImg);
                    console.log($('.selector1p').length);
                    for(var i=0;i<$('.selector1p').length;i++){
                        var curText = $('.selector1p').eq(i).find('p').text();
                        console.log(curText)
                        switch(curText)
                            {
  case '首页':
  $('.selector1p').eq(i).find('.bottomSelect').find("option[value='data1']").prop("selected",true);
  break;
  case '分类':
  $('.selector1p').eq(i).find('.bottomSelect').find("option[value='data2']").prop("selected",true);
  break;
  case '新分类页':
  $('.selector1p').eq(i).find('.bottomSelect').find("option[value='data9']").prop("selected",true);
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
  case '优惠':
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[value='data8']").prop("selected",true);
	  break;
  case '特权':
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='plusPrivilege']").prop("selected",true);
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='plusPrivilege']").parents("td").find(".jumpType").show();
	  break;
  case '福利':
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='plusWelfare']").prop("selected",true);
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='plusWelfare']").parents("td").find(".jumpType").show();
	  break;
  /*case '立即开通':
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='plusOpening']").prop("selected",true);
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='plusOpening']").parents("td").find(".jumpType").show();
	  break;*/
  case '营业厅':
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='plusShop']").prop("selected",true);
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='plusShop']").parents("td").find(".jumpType").show();
	  break;
  case 'plus我的':
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='plusMyBottom']").prop("selected",true);
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='plusMyBottom']").parents("td").find(".jumpType").show();
	  break;
  case '锦鲤':
      $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='goldenFishBottom']").prop("selected",true);
      $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='goldenFishBottom']").parents("td").find(".jumpType").show();
      $('.selector1p').eq(i).find('.bottomSelect').find("option[bindClass='goldenFishBottom']").parents("td").find(".goldenFishEs").show();
      break;
  case '导购':
	  $('.selector1p').eq(i).find('.bottomSelect').find("option[value='data10']").prop("selected",true);
	  break;

                            }
                    }
                }else if(type=="sortGg"){// 排名广告
                    $('.selectP').hide();
                    $('.selectP1').hide();
                    $('#htmlCon').show();
                    var editHtmlTitleSrc = p.find('.sortGg img').eq(0).prop('src'),
                        editHtmlTitleHref = p.find('.sortGg a').eq(0).prop('href'),
                        goodCodeInput = p.find('.sortGg a').eq(0).attr('goodCodeInput') == undefined?"":p.find('.sortGg a').eq(0).attr('goodCodeInput') ,
                        editHtmlTitle = "<tr><th>广告位编码：</th><td><input id='goodCodeInput' type='text' value='"+goodCodeInput+"' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;margin-bottom: 0.05rem;'></td></tr><tr><th>排名广告类型：</th><td><p class='selectType'><select name='' id=''>"+vm.textInfoList+"</select></p><p class='zdyInput'><input type='text' placeholder='请输入自定义的链接地址' class='link_href'></p></td></tr>";
                    $('#htmlCon table').html('').prepend(editHtmlTitle);
                    var thisBind = $(thisClickObj).find('.editing').attr('bindtype');
                    switch(thisBind)
                        {
                            case 'typep_1':
                            $('.selectType select').find("option[value='typep_1']").prop("selected",true);
                            
                            break;
                            case 'typep_2':
                            $('.selectType select').find("option[value='typep_2']").prop("selected",true);
                            break;
                            case 'typep_3':
                            $('.selectType select').find("option[value='typep_3']").prop("selected",true);
                            break;
                            case 'typep_4':
                            $('.selectType select').find("option[value='typep_4']").prop("selected",true);
                            break;
                            case 'typep_5':
                            $('.selectType select').find("option[value='typep_5']").prop("selected",true);
                            break;
                            
                        }
                }else if(type=="goodsBQ" || type=="goodsBQU"){// 标签广告位
                    $('.selectP1').show();
                    $('.selectP').hide();
                    $('#htmlCon').hide();
                    var thisBind = $(thisClickObj).find('.editing').attr('bqBind');
                    var goodcodeinput = $(thisClickObj).find('.editing').attr('goodcodeinput');
                    $('.selectP1 .goodcodeinputsigngg').val(goodcodeinput);
                    for(var i = 0;i < vm.bqTypeList.length; i++){
                        if(thisBind == vm.bqTypeList[i].lableCode){
                            $('.selectP1').find("option[value='" + vm.bqTypeList[i].lableCode + "']").prop("selected",true);
                        }
                    }
                }else if(type=="goodsPL"){// 插码广告位
                    $('#htmlCon').show();
                    var goodcodeinput =  p.find('.myview .goodsImage a').attr('goodCodeInput') == undefined?"":p.find('.myview .goodsImage a').attr('goodCodeInput');
                    var editPicBqImgSrc = p.find('.myview .goodsImage .bqli img').prop('src') == undefined?"":p.find('.myview .goodsImage img').prop('src');
                    var editPicImgSrc = p.find('.myview .goodsImage a img').prop('src') == undefined?"":p.find('.myview .goodsImage a img').prop('src');
                    var editHtmlTitle = "<tr><th>广告位编码：</th><td><input id='goodCodeInput' type='text' value='"+goodcodeinput+"' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;margin-bottom: 0.05rem;'></td></tr>" +
                        //" <tr><th>标签图片：</th><td><div class='selectImg'><p class='bq_title_url' style='height: 18px;'>"+editPicBqImgSrc+"</p><input type='file' value='11' class='file' /><span style='width: 0.6rem;height: 0.2rem;margin-top: 0.1rem;display:none;'></span></div><p class='yulanImg'><img src='"+editPicBqImgSrc+"' alt=''/></p></td></tr>" +
                        " <tr><th>标签图片：</th><td><div class='flex1' style='height: auto;margin: 10px 0;'><div class='selectImg' style='position: relative;width: 100px;height: 41px;margin-bottom: 5px;'><button class='uploadBtn' style='width: 100%;height: 100%;display: block;'>浏览</button><input type='hidden'><input type='file' value='' class='file myinput' style='position: absolute;left: 0;top: 0;bottom: 0;opacity: 0;z-index: 10;width: 100%;height: 100%;'></div><div class='shownamebox j_name'  style='display: none;height: auto;'><p class='name bq_title_url' id='actBackImg' style='margin-right: 15px;float: none;'>"+editPicBqImgSrc+"</p><p class='del j_del' style='color: red;font-size: 12px;float: none;cursor: pointer;'>删除</p></div><p class='yulanImg' style='min-height: 0;font-size: 0;margin-bottom: 0;display: none;'><img class='bgimg1' src='"+editPicBqImgSrc+"' id='backImage' alt='' style='max-width: 300px;'></p></div></td></tr>" +
                        " <tr><th>默认图片：</th><td><div class='selectImg'><p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file' /><span style='width: 0.6rem;height: 0.2rem;margin-top: 0.1rem;display:none;'></span></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p></td></tr>";
                    console.log(editHtmlTitle);
                  $('#htmlCon table').html('').prepend(editHtmlTitle);
                  if(editPicBqImgSrc){
                      $("#htmlCon").find("div[class='shownamebox j_name']").show();
                      $("#htmlCon").find(".yulanImg").show();
                      $(".del").on("click",function () {
                          $(this).prev().text("");
                          $(this).parents("div[class='shownamebox j_name']").hide();
                         $(this).parents("div[class='shownamebox j_name']").next().find("img").attr("src","");
                      });
                  }

                    $('.selectP').hide();
                    $('.selectP1').hide();
                }else if(type=="goodsYW"){//
                    $('#htmlCon').show();
                    var decorateImage1=vm.decorate.decorateImage1;
                    var decorateImage2=vm.decorate.decorateImage2;
                    var decorateImage3=vm.decorate.decorateImage3;
                    var payFailImageName=vm.decorate.payFailImageName;
                    var paySuccessImageName=vm.decorate.paySuccessImageName;
                    var editPicImgSrc = p.find('.myview .Processing img').prop('src') == undefined?"":p.find('.myview .Processing img').prop('src');
                    var editHtmlTitle = " <tr><th>默认图片：</th><td><p style='color: #D9001B;    font-size: 0.12rem;'>注：建议上传长度375px，宽度100px，格式为jpg，png的图片。</p><div class='selectImg'>" +
                    		"<p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file' /><span style='width: 0.6rem;height: 0.2rem;margin-top: 0.1rem;display:none;'></span></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p></tr>" +
                    		
                    		"<tr><td style='font-weight: normal'>业务受理中图片：</td><td><input type='hidden' name='decorateimageName1' id='BusinessimageName' value="+decorateImage1+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='Business'>" 
                        +"<p style='color: #D9001B;    font-size: 0.12rem;'>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</p></td></tr><tr><td style='font-weight: normal'>已传图片</td><td style='font-weight: normal'>"+decorateImage1+"</td></tr>"
                        +"<tr><td style='font-weight: normal'>办理成功图片：</td><td><input type='hidden' name='decorateimageName2' id='SuccessimageName' value="+decorateImage2+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='Success'>" 
                        +"<p style='color: #D9001B;    font-size: 0.12rem;'>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</p></td></tr><tr><td style='font-weight: normal'>已传图片</td><td style='font-weight: normal'>"+decorateImage2+"</td></tr>"
                        +"<tr><td style='font-weight: normal'>办理失败图片：</td><td><input type='hidden' name='decorateimageName3' id='FailureimageName' value="+decorateImage3+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='Failure'>" 
                        +"<p style='color: #D9001B;font-size: 0.12rem;'>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</p></td></tr><tr><td style='font-weight: normal'>已传图片</td><td style='font-weight: normal'>"+decorateImage3+"</td></tr>"
                        +"<tr><td style='font-weight: normal'>支付失败图片：</td><td><input type='hidden' name='payFailImageName' id='payFailimageName' value="+payFailImageName+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='payFail'>" 
                        +"<p style='color: #D9001B;    font-size: 0.12rem;'>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</p></td></tr><tr><td style='font-weight: normal'>已传图片</td><td style='font-weight: normal'>"+payFailImageName+"</td></tr>"
                        +"<tr><td style='font-weight: normal'>支付成功图片：</td><td><input type='hidden' name='paySuccessImageName' id='paySuccessimageName' value="+paySuccessImageName+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='paySuccess'>" 
                        +"<p style='color: #D9001B;font-size: 0.12rem;'>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</p></td></tr><tr><td style='font-weight: normal'>已传图片</td><td style='font-weight: normal'>"+paySuccessImageName+"</td></tr>";
                    $('#htmlCon table').html('').prepend(editHtmlTitle);
                    $('.selectP').hide();
                    $('.selectP1').hide();
                }else if(type=="goodsQGL"){// 强关联广告位
                    $('#htmlCon').show();
                   	var goodcodeinput =  p.find('.myview .Processing img').attr('goodcodeinput') == undefined?"":p.find('.myview .Processing img').attr('goodcodeinput'); 
                    var editPicImgSrc = p.find('.myview .Processing img').prop('src') == undefined?"":p.find('.myview .Processing img').prop('src');
                    var editHtmlTitle = "<tr><th>广告位编码：</th><td><input id='goodCodeInput' type='text' value='"+goodcodeinput+"' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;margin-bottom: 0.05rem;'></td><tr>" +
                    	"<tr><th>默认图片：</th><td><div class='selectImg'><p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file' /><span style='width: 0.6rem;height: 0.2rem;margin-top: 0.1rem;display:none;'></span></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p></tr>";
                    console.log(editHtmlTitle);
                    $('#htmlCon table').html('').prepend(editHtmlTitle);
                    $('.selectP').hide();
                    $('.selectP1').hide();
                }else if(type=="goodsEWM"){// 二维码
                    $('#htmlCon').show();
                    var goodcodeinput =  p.find('.myview .Processing img').attr('goodcodeinput') == undefined?"":p.find('.myview .Processing img').attr('goodcodeinput');
                    var editPicImgSrc = p.find('.myview .Processing img').prop('src') == undefined?"":p.find('.myview .Processing img').prop('src');
                    var editHtmlTitle = "<tr><th>广告位编码：</th><td><input id='goodCodeInput' type='text' value='"+goodcodeinput+"' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;margin-bottom: 0.05rem;'></td><tr>" +
                        "<tr><th>默认图片：</th><td><div class='selectImg'><p class='title_url'>"+editPicImgSrc+"</p><input type='file' value='11' class='file' /><span style='width: 0.6rem;height: 0.2rem;margin-top: 0.1rem;display:none;'></span></div><p class='yulanImg'><img src='"+editPicImgSrc+"' alt=''/></p></tr>";
                    console.log(editHtmlTitle);
                    $('#htmlCon table').html('').prepend(editHtmlTitle);
                    $('.selectP').hide();
                    $('.selectP1').hide();
                }else if (type=="shopInfo") { //店铺信息20221021
                    $('#htmlCon').show();
                    var goodcodeinput =  p.find('.view img').attr('goodcodeinput') == undefined?"":p.find('.view img').attr('goodcodeinput');
                    var editHtmlTitleSrc = p.find('.topbg').eq(0).prop('src'),
                        editHtmlTitle = "<tr class='jtggwtr'><th>广告位编码：</th><td><input id='goodCodeInput' type='text' value='"+goodcodeinput+"' goodcodeinputsign='goodcodeinputsign' class='goodcodeinputsign' style='float:left;'></td></tr><tr><th>图片：</th><td><div class='selectImg'><p class='title_url'>" + editHtmlTitleSrc + "</p><input type='file' value='11' class='file'></div><p class='yulanImg'><img src='" + editHtmlTitleSrc + "' alt=''/></p></td></tr>";
                    $('#htmlCon table').html('').prepend(editHtmlTitle);
                    $('.selectP').hide();
                    $('.selectP1').hide();
                }else if(type=="zhuancj"){//20230203转盘抽奖活动组件
                    $('.selectP').hide();
                    $('.selectP1').hide(); //查询活动配置
                    $('#htmlCon').show();
                    $.ajax({
                        url:vm.path+"/tWlmDecorate/queryActive.do",
                        type:"post",
                        success:function (data) {
                            if(data.code == 'suc'){
                                var activeNosStr = '';
                                var activeNo = p.find('div[id="zhuanpan"]').attr("actno");//活动编码;
                                for(var i=0;i<data.activeNos.length;i++){
                                    if(activeNo == data.activeNos[i]){
                                        activeNosStr += '<option value="'+data.activeNos[i]+'" selected="selected">'+data.activeNos[i]+'</option>';
                                    }else {
                                        activeNosStr += '<option value="'+data.activeNos[i]+'">'+data.activeNos[i]+'</option>';
                                    }
                                }
                                var reg = new RegExp('"','g');
                                var activeTitle = p.find('.cjview .turnplateTitle').html();//活动
                                var ruleTitle = p.find('.cjview .winTitle').html();//规则标题
                                var ruleContent = p.find('.cjview .winCont').html();//规则正文
                                var ruleBackImg = p.find('.cjview .wincj').css("background-image");//规则背景图
                                ruleBackImg = ruleBackImg == undefined||ruleBackImg == "none"?'':ruleBackImg.split("(")[1].split(")")[0].replace(reg,'');
                                var ruleImg = p.find('.cjview .turnplateRule').find("img").attr("src");//规则按钮图
                                var backImage = p.find('.cjview .turntable').css("background-image");//活动背景图
                                backImage = backImage == undefined||backImage == "none"?'':backImage.split("(")[1].split(")")[0].replace(reg,'');
                                var centerBtn = p.find('.cjview .game-start').find("img").attr("src");//centerBtn
                                var str = '<tbody class="zpcjEditBox"><tr><td><div class="bold mt15">活动设置</div></td></tr><tr><td><div class="flexbox align-c"><div class="w10"><p class="cred">*</p><p>活动编号：</p></div>' +
                                    '<div class="flex1"><select class="myinput" style="display:block;" onchange="queryActiveInfo(this);"><option value="">请选择活动编号</option>'+activeNosStr+'</select>' +
                                    '</div></div></td></tr><tr><td><div class="flexbox align-c mt15"><div class="w10"><p class="cred">*</p><p>活动标题：</p></div><div class="flex1">' +
                                    '<input type="text" class="myinput" value="'+activeTitle+'" placeholder="请输入活动标题" id="activeTitle" maxlength="16">&nbsp;&nbsp;<p class="tishiTxt">最大长度不超过16个字</p></div></div></td></tr><tr><td><div class="flexbox align-s mt15">' +
                                    '<div class="w10">活动背景图：</div><div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/><input type="file" value="" class="file myinput"></div><div class="shownamebox j_name"><p class="name" id="actBackImg">'+backImage+'</p><p class="del j_del">删除</p></div>' +
                                    '<p class="yulanImg"><img class="bgimg1" src="" id="backImage" alt=""></p></div></div></td></tr><tr><td><div class="flexbox align-s mt15"><div class="w10">' +
                                    '<p class="cred">*</p><p>抽奖按钮图：</p></div><div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/><input type="file" value="" class="file myinput">' +
                                    '</div><div class="shownamebox j_name"><p class="name" id="centerBtn">'+centerBtn+'</p><p class="del j_del">删除</p></div><p class="yulanImg"><img src='+centerBtn+' alt=""></p></div></div></td></tr><tr><td><div class="bold mt15">活动说明设置</div></td></tr><tr><td><div class="flexbox align-s">' +
                                    '<div class="w10"><p class="cred">*</p><p>活动说明按钮图：</p></div><div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/><input type="file" value="" class="file myinput">' +
                                    '</div><div class="shownamebox j_name"><p class="name" id="ruleImg">'+ruleImg+'</p><p class="del j_del">删除</p></div><p class="yulanImg"><img src='+ruleImg+' alt=""></p></div></div></td></tr><tr><td><div class="flexbox align-s mt15"><div class="w10">活动说明弹窗背景图：</div>' +
                                    '<div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/><input type="file" value="" class="file myinput"></div><div class="shownamebox j_name"><p class="name" id="ruleBackImgP">'+ruleBackImg+'</p><p class="del j_del">删除</p></div>' +
                                    '<p class="yulanImg"><img id="ruleBackImg" src="" alt=""></p></div></div></td></tr><tr><td><div class="flexbox align-c mt15"><div class="w10"><p class="cred">*</p>' +
                                    '<p>活动说明标题：</p></div><div class="flex1"><input type="text" class="myinput" id="ruleTitle" value="'+ruleTitle+'" placeholder="请输入活动标题" maxlength="10">&nbsp;&nbsp;<p class="tishiTxt">最大长度不超过10个字</p></div>' +
                                    '</div></td></tr><tr><td><div class="flexbox align-s mt15"><div class="w10"><p class="cred">*</p><p>活动说明：</p></div>' +
                                    '<div class="flex1"><textarea id="descriptiona" class="mytextarea" name="descriptiona" maxlength="1000"></textarea><p class="tishiTxt">最大长度不超过1000个字</p></div></div></td></tr></tbody>'
                                $('#htmlCon table').html('').prepend(str);
                                $(".del").on("click",function () {
                                    $(this).prev().text("");
                                    $(this).parents("div[class='shownamebox j_name']").hide();
                                    $(this).parents("div[class='shownamebox j_name']").next().find("img").attr("src","");
                                });
                                $(".shownamebox").each(function (){
                                    console.log($(this).find("p[class='name']").text());
                                    if($(this).find("p[class='name']").text()!=''){
                                        $(this).show();
                                        $(this).next().show();
                                    }
                                });
                                //富文本编辑初始化
                                editor = K.create('textarea[name="descriptiona"]', {
                                    resizeType: 1,
                                    allowPreviewEmoticons: false,
                                    allowImageUpload: false, //上传图片框本地上传的功能，false为隐藏，默认为true
                                    allowImageRemote: false, //上传图片框网络图片的功能，false为隐藏，默认为true
                                    allowFileManager: false, //浏览图片空间
                                    filterMode: false, //HTML特殊代码过滤
                                    width: "100%",
                                    height: "200px",
                                    items: [
                                        'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor',
                                        'bold', 'italic', 'underline',
                                        'removeformat', '|', 'justifyleft', 'justifycenter',
                                        'justifyright', 'insertorderedlist',
                                        'insertunorderedlist'
                                    ]
                                });
                                console.log();
                                editor.html(ruleContent);
                                $("#ruleBackImg").attr("src",ruleBackImg);
                                $("#backImage").attr("src",backImage);
                            }else {
                                alert("查询活动数据失败!!");
                                $('#htmlCon table').html('');
                            }
                        },
                        error:function () {
                            alert("查询活动数据失败!");
                            $('#htmlCon table').html('');
                        }
                    });
                } else if(type=="userMsgInfo"){//XQ20230506155612店铺装修名片组件
                    $('.selectP').hide();
                    $('.selectP1').hide();
                    $('#htmlCon').show();
                    //组件取值
                    var reg = new RegExp('"','g');
                    var goodcodeinput = p.attr("goodcodeinput");//广告位编码
                    goodcodeinput = goodcodeinput == undefined?"":goodcodeinput;
                    var msgBk = p.find(".contanierUserYa ").css("background-image");//元素编码
                    console.log(msgBk)
                    msgBk = msgBk == undefined||msgBk == "none"?'':msgBk.split("(")[1].split(")")[0].replace(reg,'');
                    var msgHead = p.find(".topLeftImg img").attr("src");//头像
                    var goodcodeinputOpt1;//操作1插码
                    var msgOptName1;//操作1文案
                    var msgOpt1;//操作1图标
                    var msgOptSec1;//操作1类型
                    var goodcodeinputOpt2;//操作2插码
                    var msgOptName2;//操作2文案
                    var msgOpt2;//操作2图标
                    var msgOptSec2;//操作2类型
                    var goodcodeinputOpt3;//操作3插码
                    var msgOptName3;//操作3文案
                    var msgOpt3;//操作3图标
                    var msgOptSec3;//操作3类型
                    var goodcodeinputOpt4;//操作4插码
                    var msgOptName4;//操作4文案
                    var msgOpt4;//操作4图标
                    var msgOptSec4;//操作4类型
                    //操作按钮取值
                    p.find(".bottomPart").find("div").each(function (i,v) {
                        console.log(i,v);
                        if(i === 0){
                            goodcodeinputOpt1 = $(v).attr("goodcodeinput");//操作1插码值
                            goodcodeinputOpt1 = goodcodeinputOpt1 == undefined?"":goodcodeinputOpt1;
                            msgOptSec1 = $(v).attr("optType");//操作1类型
                            msgOptName1 = $(v).find("span").text();//操作1文案
                            msgOpt1 = $(v).find("img").attr("src");//操作1图标
                        }
                        if(i === 1){
                            goodcodeinputOpt2 = $(v).attr("goodcodeinput");//操作2插码值
                            goodcodeinputOpt2 = goodcodeinputOpt2 == undefined?"":goodcodeinputOpt2;
                            msgOptSec2 = $(v).attr("optType");//操作2类型
                            msgOptName2 = $(v).find("span").text();//操作2文案
                            msgOpt2 = $(v).find("img").attr("src");//操作2图标
                        }
                        if(i === 2){
                            goodcodeinputOpt3 = $(v).attr("goodcodeinput");//操作3插码值
                            goodcodeinputOpt3 = goodcodeinputOpt3 == undefined?"":goodcodeinputOpt3;
                            msgOptSec3 = $(v).attr("optType");//操作3类型
                            msgOptName3 = $(v).find("span").text();//操作3文案
                            msgOpt3 = $(v).find("img").attr("src");//操作3图标
                        }
                        if(i === 3){
                            goodcodeinputOpt4 = $(v).attr("goodcodeinput");//操作4插码值
                            goodcodeinputOpt4 = goodcodeinputOpt4 == undefined?"":goodcodeinputOpt4;
                            msgOptSec4 = $(v).attr("optType");//操作4类型
                            msgOptName4 = $(v).find("span").text();//操作4文案
                            msgOpt4 = $(v).find("img").attr("src");//操作4图标
                        }
                    })
                    var str = '<table width="100%"><tbody class="zpcjEditBox"><tr><td><div class="flexbox align-c"><div class="w10">广告位编码：</div><div class="flex1">' +
                        '<input type="text" class="myinput" id="goodcodeinputMsg" value="'+goodcodeinput+'" placeholder="请输入广告位编码"></div></div></td></tr>' +
                        //背景图
                        '<tr><td><div class="flexbox align-s mt15"><div class="w10">背景图片：</div>' +
                        '<div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/><input type="file" value="" class="file myinput"></div>' +
                        '<div class="shownamebox j_name" style="display: block;"><p class="name" id="msgBk">'+msgBk+'</p><p class="del j_del">删除</p></div><p class="yulanImg" style="display: block;">' +
                        '<img src="'+msgBk+'" alt=""></p></div></div></td></tr>' +
                        //默认头像
                        '<tr><td><div class="flexbox align-s mt15"><div class="w10"><p class="cred">*</p><p>默认头像：</p>' +
                        '</div><div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/><input type="file" value="" class="file myinput"></div><div class="shownamebox j_name" style="display: block;">' +
                        '<p class="name" id="msgHead">'+msgHead+'</p><p class="del j_del">删除</p></div><p class="yulanImg" style="display: block;"><img class="sm" src="'+msgHead+'" alt=""></p></div></div></td></tr>' +
                        //图片1配置
                        '<tr><td><div class="flexbox align-c mt15">' +
                        '<div class="w10">操作1广告位编码：</div><div class="flex1"><input type="text" class="myinput" id="goodcodeinputOpt1" value="'+goodcodeinputOpt1+'" placeholder="请输入广告位编码"></div></div></td></tr>'+
                        '<tr><td><div class="flexbox align-s mt15"><div class="w10"><p class="cred">*</p><p>操作1图标：</p></div><div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/>' +
                        '<input type="file" value="" class="file myinput"></div><div class="shownamebox j_name" style="display: block;"><p class="name" id="msgOpt1">'+msgOpt1+'</p><p class="del j_del">删除</p></div>' +
                        '<p class="yulanImg" style="display: block;"><img class="sm" src="'+msgOpt1+'" alt=""></p></div></div></td></tr><tr><td><div class="flexbox align-c mt15"><div class="w10">'+
                        '<p class="cred">*</p><p>操作1文案：</p></div><div class="flex1"><input type="text" class="myinput" id="msgOptName1" value="'+msgOptName1+'" placeholder="" maxlength="4"><p class="tishiTxt">最多可输入4个字符</p>' +
                        '</div></div></td></tr><tr><td><div class="flexbox align-c mt15"><div class="w10"><p class="cred">*</p><p>操作1执行：</p></div><div class="flex1"><select class="myinput" id="msgOptSec1" style="display:block;">';
                    if(msgOptSec1 == "qywx"){
                        str += '<option value="qywx" selected>弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec1 == "callPhone"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone" selected>拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec1 == "qrcode"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode" selected>弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec1 == "share"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share" selected>页面分享</option></select>';
                    }else {
                        str += '<option value="qywx" selected>弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }
                        str += '</div></div></td></tr>' +
                        //图片2配置
                        '<tr><td><div class="flexbox align-c mt15"><div class="w10">操作2广告位编码：</div><div class="flex1"><input type="text" class="myinput" id="goodcodeinputOpt2" value="'+goodcodeinputOpt2+'" placeholder="请输入广告位编码"></div></div></td></tr>'+
                        '<tr><td><div class="flexbox align-s mt15"><div class="w10"><p class="cred">*</p><p>操作2图标：</p></div><div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/>' +
                        '<input type="file" value="" class="file myinput"></div><div class="shownamebox j_name" style="display: block;"><p class="name" id="msgOpt2">'+msgOpt2+'</p><p class="del j_del">删除</p></div>' +
                        '<p class="yulanImg" style="display: block;"><img class="sm" src="'+msgOpt2+'" alt=""></p></div></div></td></tr><tr><td><div class="flexbox align-c mt15"><div class="w10">' +
                        '<p class="cred">*</p><p>操作2文案：</p></div><div class="flex1"><input type="text" class="myinput" id="msgOptName2" value="'+msgOptName2+'" placeholder="" maxlength="4"><p class="tishiTxt">最多可输入4个字符</p></div>' +
                        '</div></td></tr><tr><td><div class="flexbox align-c mt15"><div class="w10"><p class="cred">*</p><p>操作2执行：</p></div><div class="flex1"><select class="myinput" id="msgOptSec2" style="display:block;">';
                    if(msgOptSec2 == "qywx"){
                        str += '<option value="qywx" selected>弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec2 == "callPhone"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone" selected>拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec2 == "qrcode"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode" selected>弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec2 == "share"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share" selected>页面分享</option></select>';
                    }else {
                        str += '<option value="qywx" selected>弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }
                        str +='</div></div></td></tr>' +
                        //图片3配置
                        '<tr><td><div class="flexbox align-c mt15"><div class="w10">操作3广告位编码：</div><div class="flex1"><input type="text" class="myinput" id="goodcodeinputOpt3" value="'+goodcodeinputOpt3+'" placeholder="请输入广告位编码"></div></div></td></tr>'+
                        '<tr><td><div class="flexbox align-s mt15"><div class="w10"><p class="cred">*</p><p>操作3图标：</p></div><div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/>' +
                        '<input type="file" value="" class="file myinput"></div><div class="shownamebox j_name" style="display: block;"><p class="name" id="msgOpt3">'+msgOpt3+'</p><p class="del j_del">删除</p></div>' +
                        '<p class="yulanImg" style="display: block;"><img class="sm" src="'+msgOpt3+'" alt=""></p></div></div></td></tr><tr><td><div class="flexbox align-c mt15"><div class="w10">' +
                        '<p class="cred">*</p><p>操作3文案：</p></div><div class="flex1"><input type="text" class="myinput" id="msgOptName3" value="'+msgOptName3+'" placeholder="" maxlength="4"><p class="tishiTxt">最多可输入4个字符</p></div>' +
                        '</div></td></tr><tr><td><div class="flexbox align-c mt15"><div class="w10"><p class="cred">*</p><p>操作3执行：</p></div><div class="flex1"><select class="myinput" id="msgOptSec3" style="display:block;">';
                    if(msgOptSec3 == "qywx"){
                        str += '<option value="qywx" selected>弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec3 == "callPhone"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone" selected>拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec3 == "qrcode"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode" selected>弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec3 == "share"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share" selected>页面分享</option></select>';
                    }else {
                        str += '<option value="qywx" selected>弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }
                        str +='</div></div></td></tr>' +
                        //图片4配置
                        '<tr><td><div class="flexbox align-c mt15"><div class="w10">操作4广告位编码：</div><div class="flex1"><input type="text" class="myinput" id="goodcodeinputOpt4" value="'+goodcodeinputOpt4+'" placeholder="请输入广告位编码"></div></div></td></tr>' +
                        '<tr><td><div class="flexbox align-s mt15"><div class="w10"><p class="cred">*</p><p>操作4图标：</p></div><div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/>' +
                        '<input type="file" value="" class="file myinput"></div><div class="shownamebox j_name" style="display: block;"><p class="name" id="msgOpt4">'+msgOpt4+'</p><p class="del j_del">删除</p></div>'+
                        '<p class="yulanImg" style="display: block;"><img class="sm" src="'+msgOpt4+'" alt=""></p></div></div></td></tr><tr><td><div class="flexbox align-c mt15"><div class="w10">' +
                        '<p class="cred">*</p><p>操作4文案：</p></div><div class="flex1"><input type="text" class="myinput" id="msgOptName4" value="'+msgOptName4+'" placeholder="" maxlength="4"><p class="tishiTxt">最多可输入4个字符</p></div></div>' +
                        '</td></tr><tr><td><div class="flexbox align-c mt15"><div class="w10"><p class="cred">*</p><p>操作4执行：</p></div><div class="flex1"><select class="myinput" id="msgOptSec4" style="display:block;">';
                    if(msgOptSec4 == "qywx"){
                        str += '<option value="qywx" selected>弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec4 == "callPhone"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone" selected>拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec4 == "qrcode"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode" selected>弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }else if(msgOptSec4 == "share"){
                        str += '<option value="qywx" >弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share" selected>页面分享</option></select>';
                    }else {
                        str += '<option value="qywx" selected>弹出企业微信弹窗</option><option value="callPhone">拨打系统电话</option><option value="qrcode">弹出页面二维码</option><option value="share">页面分享</option></select>';
                    }
                        str += '</div></div></td></tr></tbody>';
                    $('#htmlCon table').html('').prepend(str);
                    $(".del").on("click",function () {
                        $(this).prev().text("");
                        $(this).parents("div[class='shownamebox j_name']").hide();
                        $(this).parents("div[class='shownamebox j_name']").next().find("img").attr("src","");
                    });
                }else if(type=="personalCard"){
                    $('.selectP').hide();
                    $('.selectP1').hide();
                    $('#htmlCon').show();
                    var $this = p.find(".contanierShareTopYa ");
                    var msgBk = p.find(".contanierShareTopYa ").css("background-image");//元素编码
                    console.log(msgBk)
                    var reg = new RegExp('"','g');
                    msgBk = msgBk == undefined||msgBk == "none"?'':msgBk.split("(")[1].split(")")[0].replace(reg,'');
                    var headImg = $this.find(".leftShareUserMsg").find("img").attr("src");
                    var isShowHead = $($this).find(".leftShareUserMsg").find("img").css("display");//是否显示头像
                    var isShowEwm = $($this).find(".rightShareImg").css("display");//是否显示二维码
                    var ewmTsMsg = $($this).find(".rightShareImg").find("span").text();//二维码左侧文字
                    var ewmBtnImg = $($this).find(".rightShareImg").find("img").attr("src");//二维码按钮图片
                    var editPicImgSrc = p.find('.cjview img.testimg').prop('src');
                    var str = `<tbody class="zpcjEditBox">
						<tr><td><div class="flexbox align-s mt15"><div class="w10"><p class="cred">*</p><p>背景图：</p></div><div class="flex1"><div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/>
						<input type="file" value="" class="file myinput"></div><div class="shownamebox j_name" style="display: block;"><p class="name" id="bkImg">`+msgBk+`</p><p class="del j_del">删除</p></div>
						<p class="yulanImg" style="display: block;"><img class="bgimg1" src="`+msgBk+`" alt=""></p></div></div></td></tr>
						<tr><td><div class="flexbox align-c mt15"><div class="w10">头像：</div><div class="flex1 flexbox align-c"><div class='ljcd' style="margin-left:0">`
						if(isShowHead == 'none'){
                            str += `<label><input type='radio' name='pCardA' value='1' class='nninput' />显示</label><label style="margin-left:5px"><input type='radio' name='pCardA' value='0' class='nninput' checked/>不显示</label>`;
                        }else {
                            str += `<label><input type='radio' name='pCardA' value='1' class='nninput' checked/>显示</label><label style="margin-left:5px"><input type='radio' name='pCardA' value='0' class='nninput' />不显示</label>`;
                        }
						str += `</div></div></div></td></tr>`
						if(isShowHead == 'none'){
                            str += `<tr class="j_mrtx" style="display: none;">`;
                        }else {
                            str += `<tr class="j_mrtx">`;
                        }
						str += `<td><div class="flexbox align-s mt15"><div class="w10"><p class="cred">*</p><p>默认头像：</p></div><div class="flex1"><div class="flexbox"><div class="selectImg">
                        <button class="uploadBtn">浏览</button><input type="hidden"/><input type="file" value="" class="file myinput"></div><p class="tishiTxt" style="margin-left:5px">建议上传图片尺寸：40*40，大小不超过100K</p>
						</div><div class="shownamebox j_name" style="display: block;"><p class="name" id="headImg">`+headImg+`</p><p class="del j_del">删除</p></div><p class="yulanImg" style="display: block;"><img class="bgimg1" src="`+headImg+`" alt="">
						</p></div></div></td></tr>
						<tr><td><div class="flexbox align-c mt15"><div class="w10">二维码：</div><div class="flex1 flexbox align-c"><div class='ljcd' style="margin-left:0">`
                        if(isShowEwm == 'none'){
                            str += `<label><input type='radio' name='pCardC' value='1' class='nninput' />显示</label><label style="margin-left:5px"><input type='radio' name='pCardC' value='0' class='nninput' checked/>不显示</label>`;
                        }else{
                            str += `<label><input type='radio' name='pCardC' value='1' class='nninput' checked/>显示</label><label style="margin-left:5px"><input type='radio' name='pCardC' value='0' class='nninput'/>不显示</label>`;
                        }
						str += `</div></div></div></td></tr>`
					    if(isShowHead == 'none'){
                            str += `<tr class="j_ewm" style="display: none;">`;
                        }else {
                            str += `<tr class="j_ewm">`;
                        }
                        str += `<td><div class="flexbox align-c mt15"><div class="w10">二维码提示文案：</div><div class="flex1">
						<input type="text" class="myinput" value="`+ewmTsMsg+`" placeholder="面对面分享" id="activeTitle" maxlength="16"></div></div></td></tr>`;
						 if(isShowHead == 'none'){
                            str += `<tr class="j_ewm" style="display: none;">`;
                        }else {
                            str += `<tr class="j_ewm">`;
                        }
						str += `<td><div class="flexbox align-s mt15"><div class="w10"><p class="cred">*</p><p>二维码图标：</p></div><div class="flex1"><div class="flexbox">
						<div class="selectImg"><button class="uploadBtn">浏览</button><input type="hidden"/><input type="file" value="" class="file myinput"></div>
						<p class="tishiTxt" style="margin-left:5px">建议上传图片尺寸：40*40，大小不超过100K</p></div><div class="shownamebox j_name" style="display: block;"><p class="name" id="ewmBtnImg">`+ewmBtnImg+`</p>
						<p class="del j_del">删除</p></div><p class="yulanImg" style="display: block;"><img class="bgimg1" src="`+ewmBtnImg+`" alt=""></p></div></div></td></tr></tbody>`;
                    $('#htmlCon table').css({'margin-top':'0'}).html('').append(str);

                    $(".del").on("click",function () {
                        $(this).prev().text("");
                        $(this).parents("div[class='shownamebox j_name']").hide();
                        $(this).parents("div[class='shownamebox j_name']").next().find("img").attr("src","");
                    });
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
                }else{
                    console.log("动态");
                    console.log(type);
                    $('.selectP').show();
                    $('.selectP1').hide();
                    $('#htmlCon').hide();
                    var thisBind = $(thisClickObj).find('.editing').attr('bind');
                    var goodcodeinput = $(thisClickObj).find('.editing').attr('goodcodeinput');
                    $('.selectP .goodcodeinputsigngg').val(goodcodeinput);
                    switch(thisBind)
                        {
                            case 'type1':
                            $('.selectP').find("option[value='type1']").prop("selected",true);
                            break;
                            case 'type2':
                            $('.selectP').find("option[value='type2']").prop("selected",true);
                            break;
                            case 'type3':
                            $('.selectP').find("option[value='type3']").prop("selected",true);
                            break;
                            case 'type4':
                            $('.selectP').find("option[value='type4']").prop("selected",true);
                            break;
                            case 'type5':
                            $('.selectP').find("option[value='type5']").prop("selected",true);
                            break;
                            case 'typeq_1':
                              $('.selectP').find("option[value='typeq_1']").prop("selected",true);
                            break;
                            case 'typeiop':
                              $('.selectP').find("option[value='typeiop']").prop("selected",true);
                            break;                          
                        }
                }
                $('#htmlCon2').prepend("<textarea id='teAre' style='border:0;height: 3.4rem;width: 7rem;'>"+a.html().trim()+"</textarea>");
            });
        })

        // 点击选择标签按钮，弹出窗
        .on('click','.editFloor',function(e){
            showid('floorSelectPop');
            var tabtypes = $(this).closest(".bigFloor").attr("tabtype");
            var tabtype = tabtypes.split(",");
            var bqList = $(".laberBqList");
            for(var j = 0 ; j < bqList.length ; j ++){
                $(bqList[j]).find("input[type='checkbox']").removeAttr("checked");
            }
            for(var i = 0; i < tabtype.length; i++){
                for(var int = 0 ; int < bqList.length ; int ++){
                    if(tabtype[i] == $(bqList[int]).attr("value")){
                        $(bqList[int]).find("input[type='checkbox']").prop("checked", true);
                    }
                }
            }
            
            tabTypeDom  = $(this).parent().parent();
        })

        $(document).on('click','.cspz',function(e) {
            selectLiCspzpp(0);// 方便tab切换的
            $('.modals_cspz1pp').fadeIn(200, function() {// 展示参数配置弹层
                var layer=$('.cspzedit-layer',this);
                layer.css({
                    'margin-top':-(layer.height())/2,
                    'margin-left':-(layer.width())/2
                }).fadeIn(100);// 弹窗位置设置
                // iop推荐弹窗拼串开始
            });
            var p=$(this).context.parentElement.nextElementSibling.children["0"].id;
            if(p!=null && p!=""){
                vm.bigfloorId =p;
            }else{
                p= vm.bigfloorId;
            }

            console.log($(this).context.parentElement.nextElementSibling.children["0"]);
            $("#decorater_roomid").val(p);
            $("#decorater_roomidpp").val(p);
            $('#htmlConCspzpp').show();// 默认展示IOP推荐tab
            $("#htmlConCspzpp .cont_box .iopFloor").show();
            $(".iopRoom").hide();
            var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
            var policy = null;;

            var policyListbuwei;
            var policyIopList = null;
            jQuery.ajax({
                url:vm.path + "/tWlmDecorate/querypolicyiop.do?id="+vm.id+"&roomId="+p,
                type: "POST",// 方法类型
                dataType:'json',
                async:false,
                success:function(data){
                    if(data.flag==true){
                    	vm.isHide=data.isHide;
                        policy=data.policyList;
                        policyListbuwei= data.policyListbuwei;
                        policyIopList = data.policyIopList;
                    }
                },
                // 调用出错执行的函数
                error: function(){
                    alert("操作异常");
                } 
            });
            console.log($("input[name='tjiop']:checked").val());
            if($("input[name='tjiop']:checked").val() ==='2'){
            }else{
                $("#floorType").val("0");
                if($("input[name='tjiop']:checked").val() ==='1'){
                    policyIopList=null;
                }
                if(policy!=null && policy !=  undefined &&policyIopList!=null && policyIopList !=  undefined){
                    //当选择IOP时不再处理集团IOP或初始化时都存在值展示IOP
                    policyIopList=null;
                }

            }
            if(vm.isHide=="0"){
                $("#ifyc1pp").attr('checked', 'checked');
            }else{
                $("#ifyc2pp").attr('checked', 'checked');
            }
            if(policy!=null){
                $("#ioptj").attr('checked', 'checked');
            	var ispop="";
            	var tianzhi="";
            	for(var int=0;int<policy.length;int++){
            		var xuhao=int+1;
            		var address=policy[int][5];
            		var popUpButtoniop=policy[int][21];
            		var policyGgwbm=policy[int][23];
            		if(!policyGgwbm){
            			policyGgwbm = "";
            		}
            		if(address==null||address==''||address==undefined){
            			address="";
            		}
            		if(popUpButtoniop=="0"){
            			ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
            		}else{
            			ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
            		}
            		tianzhi+="<tr class='clxqq' id='policypp"+int+"'>" +
            				" <td><input type='checkbox' value="+policy[int][0]+" name='ioppp'></td> " +
            				"<td id='xuhaoCount'>"+xuhao+"</td> <td>" +
            				"<div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div>"+
            				"<div> <dl> <dt>策划ID:</dt> <dd> <input type='hidden' name='policyId' id='policyId' value="+policy[int][0]+"> <input type='text' placeholder='请输入策划ID' name='planId' id='planId' value="+policy[int][3]+" οnkeyup='this.value=this.value.replace(/[^\d\,]/g,'')'> <span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span></dd></dl></div>"+
            				"<div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='iconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='iconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='iconListpp"+int+"opacityP' onclick="+"deleteImg('iconListpp"+int+"')>删除图片</p><input type='hidden' name='iconListppimageName' id='iconListpp"+int+"imageName' value="+policy[int][4]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>"+
            				"<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'  >选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'value="+policy[int][22]+">	</dd>	</dl></div>"+
            				"<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
            				"<div>	<dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>"+
            				"<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTimepp' name='startTimepp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+" /> ~ <input id='endTimepp' name='endTimepp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div></td>"+
            				"<td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunpp("+int+")'>保存</a></td></tr>"
            	}

            	var tianzhi2=tbody+tianzhi+"</tbody>";
            	$('#htmlConCspzpp table').html('').prepend(tianzhi2);
            }else{
                    showJtIop(0);
           }
            if(policyListbuwei!=null){
            	var tianzhi="";


            	var ispop="";
            	var policy=policyListbuwei;
            	for(var int=0;int<policy.length;int++){
            		var address=policy[int][5];
            		var popUpButtoniop=policy[int][21];
            		var policyGgwbm=policy[int][23];
            		if(!policyGgwbm){
            			policyGgwbm = "";
            		}
            		if(address==null||address==''||address==undefined){
            			address="";
            		}
            		if(popUpButtoniop=="0"){
            			ispop="<input type='radio' name='popUpButtoniopbuwei"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniopbuwei"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
            		}else{
            			ispop="<input type='radio' name='popUpButtoniopbuwei"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniopbuwei"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
            		}
            		var xuhao=int+1;
            		tianzhi+="<tr class='clxqq'  id='policybuweipp"+int+"'><td><input type='checkbox' value="+policy[int][0]+" name='buweipp'></td>" +
            				"<td>"+xuhao+"</td><td><div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div><div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiiconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='buweiiconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='buweiiconListpp"+int+"opacityP' onclick="+"deleteImg('buweiiconListpp"+int+"')>删除图片</p><input type='hidden' name='policyId' id='buweipolicyId' value="+policy[int][0]+"><input type='hidden' name='buweiiconListppimageName' value="+policy[int][4]+" id='buweiiconListpp"+int+"imageName'><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
            				"<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'>选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'value="+policy[int][22]+"></dd></dl></div>" +
            				"<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
            				"<div><dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>" +
            				"<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTime1pp' name='startTime1pp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+" /> ~ <input id='endTime1pp' name='endTime1pp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+" /></dd></dl></div>	</td>" +
            				"<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuweipp("+int+")'>保存</a></td>							</tr>											"
            	}
            	var tianzhi2=tbody+tianzhi+"</tbody>";
            	 $('#htmlConCspz2pp table').html('').prepend(tianzhi2);
            }else{
            	var tianzhi2="						<thead>							<tr>								<th><input type='checkbox' class='allCheckbox'></th>								<th>序号</th>								<th>策略配置</th>								<th>操作</th>							</tr>						</thead>						<tbody class='mytablebox'>							<tr class='clxqq'  id='policybuweipp0'>								<td><input type='checkbox' name='buweipp'></td>								<td>1</td>								<td> <div><dl><dt>广告编码:</dt> <dd><input type=\"text\" name=\"policyGgwbm\" class=\"policyGgwbm\"></dd></dl></div>									<div >										<dl>											<dt>图片:</dt>											<dd>												<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='buweiiconListpp0imagesZw'>												<img src='' alt='' class='buweiiconListpp0imgPerview'>												<p class='opacityP' id='buweiiconListpp0opacityP'>上传图片</p>												<input type='hidden' name='policyId' id='policyId'>  												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconListpp0'>												<input type='hidden' name='buweiiconListppimageName' id='buweiiconListpp0imageName' >												</div>												<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div >									<div>										<dl>											<dt>跳转地址:</dt>											<dd>												<input type='hidden' name='jumpType' id='peizhijumpType'>												<input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress'>												<span class='jhsp ad' id='jhsp0'>选择广告/聚合页</span>				<input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'>							</dd>										</dl>									</div><div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtoniopbuwei0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtoniopbuwei0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>									<div>										<dl>											<dt>展示权重:</dt>											<dd>												<input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights'>																										</dd>										</dl>									</div>									<div>										<dl>											<dt>有效时间:</dt>											<dd class='yxsjdd'>												<input id='startTime1pp' name='startTime1pp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value='' /> ~ <input id='endTime1pp' name='endTime1pp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value='' />											</dd>										</dl>									</div>								</td>								<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuweipp(0)'>保存</a></td>							</tr>						</tbody>";
            	$('#htmlConCspz2pp table').html('').append(tianzhi2);
            }
            if(policyIopList!=null){
                $("#jtiop").attr('checked', 'checked');
                var ispop="";
                var tianzhi="";
                for(var int=0;int<policyIopList.length;int++) {
                    var xuhao = int + 1;
                    var address = policyIopList[int][5];
                    var popUpButtoniop = policyIopList[int][21];
                    var policyGgwbm = policyIopList[int][23];

                    var policyType = policyIopList[int][1];//类别字段
                    var policyState = policyIopList[int][31];//集团iop推荐状态
                    var policyStateName = "无";
                    if (policyState == "1") {
                        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
                    } else if (policyState == "2") {
                        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
                    } else if (policyState == "3") {
                        policyStateName = "有效";
                    } else if (policyState == "4") {
                        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
                    } else if (policyState == "5") {
                        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
                    } else if (policyState == "6") {
                        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
                    }else{
                        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
                    }
                    if (!policyGgwbm) {
                        policyGgwbm = "";
                    }
                    if (address == null || address == '' || address == undefined) {
                        address = "";
                    }
                    if (popUpButtoniop == "0") {
                        ispop = "<input type='radio' name='popUpButtoniop" + int + "'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop" + int + "' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
                    } else {
                        ispop = "<input type='radio' name='popUpButtoniop" + int + "'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop" + int + "' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
                    }
                    tbody = "<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>状态</th><th>操作</th>    </tr></thead><tbody class='mytablebox'>";
                    tianzhi+="<tr class='clxqq' id=policyIop"+int+">" +
                        " <td><input type='checkbox' value="+policyIopList[int][0]+" name='ioppp'></td> " +
                        "<td id='xuhaoCount'>"+xuhao+"</td> <td>" +
                        "<div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div>"+
                        "<div> <dl> <dt>策划ID:</dt> <dd style='display:flex'><input type='hidden' name='policyId' id='policyId' value="+policyIopList[int][0]+"> <input readonly='readonly' class='selectLiCspzpp' type='text'  name='planId' id='planId"+int+"' value="+policyIopList[int][3]+" ><span class='jhsp jtIop' id='jhIop"+int+"'  >选择</span></dd></dl></div>"+
                        "<div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='/lmH"+policyIopList[int][4]+"' id='iopPath"+int+"' alt=''  class='iconListpp"+int+"imgPerview' ><input type='hidden' name='iconListppimageName' id='iopPathImg' value="+policyIopList[int][5]+"></div</dd></dl></div>"+
                        "<div><dl><dt>跳转地址:</dt><dd><input type='text' class='jhinp selectLiCspzpp' name='jumpAddress' id='jumpAddressIop"+int+"' readonly='readonly'  value="+policyIopList[int][33]+">	</dd>	</dl></div>"+
                        "<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                        "<div>	<dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeightsIop' value="+policyIopList[int][6]+"></dd></dl></div>"+
                        "<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTimepp"+int+"'  name='startTimepp' readonly='readonly' class='selectLiCspzpp' class='Wdate w150'   value="+policyIopList[int][7]+" /> ~ <input id='endTimepp"+int+"'  name='endTimepp' readonly='readonly' class='selectLiCspzpp' class='Wdate w150'  value="+policyIopList[int][8]+"></dd></dl></div></td>"+
                        "<td>"+policyStateName+"</td><td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunpp("+int+")'>保存</a></td></tr>"

                    var tianzhi2 = tbody + tianzhi + "</tbody>";
                    $('#htmlConCspzpp table').html('').prepend(tianzhi2);
                }
            }else{
                if($("input[name='tjiop']:checked").val() ==='2') {
                    showJtIop(1);
                }
            }
        }) ;
        
        $(document).on('click','.cspzLB',function(e) {
            selectLiCspz(0);// 方便tab切换的
            $('.modals_cspz1').fadeIn(200, function() {// 展示参数配置弹层
                var layer=$('.cspzedit-layer',this);
                layer.css({
                    'margin-top':-(layer.height())/2,
                    'margin-left':-(layer.width())/2
                }).fadeIn(100);// 弹窗位置设置
                // iop推荐弹窗拼串开始
            });
            var p=$(this).context.parentElement.nextElementSibling.children["0"].id;
            $("#floorType").val("1");
            $("#decorater_roomid").val(p);
            $('#htmlConCspz').show();
            var policyList;
            var policyListbuwei;
            jQuery.ajax({
                url:vm.path + "/tWlmDecorate/querypolicyiop.do?id="+vm.id+"&roomId="+p,
                type: "POST",// 方法类型
                dataType:'json',
                async:false,
                success:function(data){
                    if(data.flag==true){
                        if(data.isHide==""||data.isHide==undefined){
                            vm.isHide="0";
                        }else {
                            vm.isHide=data.isHide;
                        }
                        policyList=data.policyList;
                        vm.shure=data.shure;
                        policyListbuwei= data.policyListbuwei;
                        vm.shurebuwei=data.shurebuwei;
                    }
                },
                // 调用出错执行的函数
                error: function(){
                    alert("操作异常");
                } 
            });
            var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
            if(policyList!=null){
            	var tianzhi="";
            	var sbutton="";
            	var chooseas="";
            	var nextbutton="";
            	var ispop="";
            	var adoras="";
            	var policy=policyList;
            	for(var int=0;int<policy.length;int++){
            		var policyGgwbm=policy[int][23];
            		if(!policyGgwbm){
            			policyGgwbm = "";
            		}
            		var secondIntrImgName=policy[int][24];//档位介绍第二图片
            		var thirdIntrImgName=policy[int][25];//档位介绍第三图片
            		
            		var isshowbutt=policy[int][11];
            		var isnext=policy[int][13];
            		var address=policy[int][5];
            		var popUpButtoniop=policy[int][21];
            		var nextimage=policy[int][12];
            		var nextimage1=policy[int][14];
            		var nextimage2=policy[int][15];
            		var chooseAdOrSp=policy[int][17];
            		var anwz=policy[int][19];//按钮位置
                	var dbzs=policy[int][20];//底部展示
                	var anwzDbzs = "<div class='anwzF'> <dl> 	<dt>按钮位置:</dt> 	<dd> <div id='anwzF'> 	<input type='radio' name='anwz"+int+"' value='y' class='anwz'";
                	if('n' != anwz){
                		anwzDbzs += "checked";
                	}
                	anwzDbzs += "/><label for='anwz1'>中间</label>  	<input type='radio' name='anwz"+int+"' value='n' class='anwz' ";
                	if('n' == anwz){
                		anwzDbzs += "checked";
                	}
                	anwzDbzs += "/><label for='anwz2'>底部</label> </div> 	</dd> </dl>  </div>  <div class='dbzsF'> <dl> 	<dt>底部展示:</dt> 	<dd> <div id='anwzF'> 	<input type='radio' name='dbzs"+int+"' value='y' class='anwz' ";
                	if('y' == dbzs){
                		anwzDbzs += "checked";
                	}
                	anwzDbzs += "/><label for='anwz1'>固定</label>  	<input type='radio' name='dbzs"+int+"' value='n'  class='anwz' ";
                	if('y' != dbzs){
                		anwzDbzs += "checked";
                	}
                	anwzDbzs += "/><label for='anwz2'>悬浮（仅按钮位置底部可用）</label> </div> 	</dd> </dl>  </div>";
            		var shanchu="删除图片";
            		var shanchu1="删除图片";
            		var shanchu2="删除图片";
            		if(nextimage==null||nextimage==''||nextimage==undefined){
            			shanchu="上传图片";
            		}
            		if(nextimage1==null||nextimage1==''||nextimage1==undefined){
            			shanchu1="上传图片";
            		}
            		if(nextimage2==null||nextimage2==''||nextimage2==undefined){
            			shanchu2="上传图片";
            		}
            		if(address==null||address==''||address==undefined){
            			address="";
            		}
            		if(chooseAdOrSp=='2'){
            			chooseas="<option value='1'>广告</option><option value='2' selected='selected'>商品</option>";
            			adoras="<span class='jhsp sp' id='jhsp"+int+"'  >选择商品</span>";
            		}else{
            			chooseas="<option value='1' selected='selected'>广告</option><option value='2'>商品</option>";
            			adoras="<span class='jhsp ad' id='jhsp"+int+"'  >选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;' value="+policy[int][22]+">";
            		}
            		if(isshowbutt=="1"){
            			 sbutton="<input type='radio' name='isShowButtoniop"+int+"' class='rin'  value='0'/><label for='ifyc1' class='rlb'  >是</label><input type='radio' name='isShowButtoniop"+int+"'  class='rin'  checked='checked'  value='1'/><label for='ifyc1' class='rlb'  >否</label> ";
            		}else{
            			 sbutton="<input type='radio' name='isShowButtoniop"+int+"' class='rin'   checked='checked'  value='0'/><label for='ifyc1' class='rlb'  >是</label><input type='radio' name='isShowButtoniop"+int+"'  class='rin'   value='1'/><label for='ifyc1' class='rlb'  >否</label> ";
            		}
            		if(isnext=="0"){
            			nextbutton="<input type='radio' name='NextButtoniop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >二次确认页</label><input type='radio' name='NextButtoniop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >原二次确认页</label>";
            		}else{
            			nextbutton="<input type='radio' name='NextButtoniop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >二次确认页</label><input type='radio' name='NextButtoniop"+int+"' class='rin'  checked='checked' value='1'/><label for='ifyc2' class='rlb'  >原二次确认页</label>";
            		}
            		if(popUpButtoniop=="0"){
            			ispop="<input type='radio' name='popUpButtonLbiop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
            		}else{
            			ispop="<input type='radio' name='popUpButtonLbiop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiop"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
            		}
            		var xuhao=int+1;
            		tianzhi+="<tr class='clxqq'  id='policy"+int+"'><td><input type='checkbox' value="+policy[int][0]+" name='iop'></td>" +
            				"<td id='xuhaoCount'>"+xuhao+"</td><td><div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div><div><dl><dt>配置类型:</dt>" +
            				"<dd><select id='ConfigType' name='ConfigType' value="+policy[int][17]+" onchange='changeTiaoZhuan("+int+")'>" +
            				chooseas+"</select></dd></dl></div><div><dl>" +
            				"<dt>策划ID:</dt><dd><input type='hidden' name='policyId' id='policyId' value="+policy[int][0]+">" +
            				"<input type='text' placeholder='请输入策划ID' name='planId' id='planId' value="+policy[int][3]+" οnkeyup='this.value=this.value.replace(/[^\d\,]/g,'')'>" +
            				"<span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span></dd></dl></div><div><dl><dt>图片:</dt><dd><div style='overflow:hidden;'><div class='uploadImg normalData'>" +
            				"<img src='../../images/images.png' alt='' class='iconList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='iconList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='iconList"+int+"opacityP'  onclick="+"deleteImg('iconList"+int+"')>删除图片</p><input type='hidden' name='iconListimageName' id='iconList"+int+"imageName' value="+policy[int][4]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('iconList"+int+"');showid('ts_ljzs')"+" id='iconListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
            				"<div  ><dl><dt>档位介绍图片:</dt><dd><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='introductioniconList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][16]+"' alt=''  class='introductioniconList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='introductioniconList"+int+"opacityP' onclick="+"deleteImgRemove('introductioniconList"+int+"','0')>删除图片</p><input type='hidden' name='introductioniconListimageName' id='introductioniconList"+int+"imageName' value="+policy[int][16]+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2)' name='UploadBtn' id='introductioniconList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('introductioniconList"+int+"');showid('ts_ljzs')"+" id='introductioniconListfl"+int+"' title='图片'>预览</a></div> " ;
            		
            		if(secondIntrImgName){
            			tianzhi+=" <div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='introductioniconList"+int+"imagesZw'><img src='"+vm.path+"/"+secondIntrImgName+"' alt=''  class='introductioniconList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='introductioniconList"+int+"1opacityP' onclick="+"deleteImgRemove('introductioniconList"+int+"','1')>删除图片</p><input type='hidden' name='secondIntroductioniconListimageName' id='introductioniconList"+int+"imageName' value="+secondIntrImgName+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2,1)' name='UploadBtn' id='introductioniconList"+int+"1'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('introductioniconList"+int+"',1);showid('ts_ljzs')"+" id='introductioniconListfl"+int+"' title='图片'>预览</a></div>";
            		}
            		if(thirdIntrImgName){
            			tianzhi+= "<div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='introductioniconList"+int+"imagesZw'><img src='"+vm.path+"/"+thirdIntrImgName+"' alt=''  class='introductioniconList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='introductioniconList"+int+"2opacityP' onclick="+"deleteImgRemove('introductioniconList"+int+"','2')>删除图片</p><input type='hidden' name='thirdIntroductioniconListimageName' id='introductioniconList"+int+"imageName' value="+thirdIntrImgName+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2,2)' name='UploadBtn' id='introductioniconList"+int+"2'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('introductioniconList"+int+"',2);showid('ts_ljzs')"+" id='introductioniconListfl"+int+"' title='图片'>预览</a></div>";
            		}
            		tianzhi+="<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>"+
            				"<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' value="+address+">"+adoras+"</dd></dl></div>" +
            				"<div><dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>" +
            				"<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTime' name='startTime' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTime' name='endTime' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+">											</dd>										</dl>									</div>" +
            				"<div  ><dl><dt>是否显示下一步按钮:</dt><dd class='yxsjdd'>"+sbutton+"</dd></dl></div>" + anwzDbzs +
            				"<div  ><dl><dt>下一步按钮跳转:</dt><dd class='yxsjdd'><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='NextList"+int+"imagesZw'>	<img src='"+vm.path+"/"+policy[int][12]+"' alt=''  class='NextList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='NextList"+int+"opacityP' onclick="+"deleteImg('NextList"+int+"')>"+shanchu+"</p><input type='hidden'  name='NextListimageName' id='NextList"+int+"imageName' value="+policy[int][12]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='NextList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('NextList"+int+"');showid('ts_ljzs')"+" id='NextListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
            				"<div  ><dl><dt>下一步按钮跳转:</dt><dd class='yxsjdd'>"+nextbutton+"</dd>	</dl></div>" +
            				"<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
            				"<div  ><dl><dt>二次确认页图片:</dt><dd class='yxsjdd'><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='SecondaryList"+int+"imagesZw'>	<img src='"+vm.path+"/"+policy[int][14]+"' alt=''  class='SecondaryList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='SecondaryList"+int+"opacityP' onclick="+"deleteImg('SecondaryList"+int+"')>"+shanchu1+"</p><input type='hidden' name='SecondaryListimageName' id='SecondaryList"+int+"imageName' value="+policy[int][14]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='SecondaryList"+int+"'>	</div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('SecondaryList"+int+"');showid('ts_ljzs')"+" id='SecondaryListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd>	</dl></div>" +
            				"<div ><dl><dt>二次确认办理按钮:</dt><dd class='yxsjdd'><div style='overflow:hidden;'>	<div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='handleList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][15]+"' alt=''  class='handleList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='handleList"+int+"opacityP' onclick="+"deleteImg('handleList"+int+"')>"+shanchu2+"</p><input type='hidden' name='handleListimageName' id='handleList"+int+"imageName' value="+policy[int][15]+">	<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='handleList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('handleList"+int+"');showid('ts_ljzs')"+" id='handleListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div></td><td><a href='javascript:;' class='submitted saven' onclick='savePolicyFun("+int+")'>保存</a></td></tr>";
            	}
            	var tianzhi2=tbody+tianzhi+"</tbody>";
            	 $('#htmlConCspz table').html('').prepend(tianzhi2);
            }else{
            	var tianzhi2=" <thead>							<tr>								<th><input type='checkbox' class='allCheckbox'></th>								<th>序号</th>								<th>策略配置</th>								<th>操作</th>							</tr>						</thead>						<tbody class='mytablebox'> 							<tr class='clxqq' id='policy0'>								<td><input type='checkbox' name='iop'></td>								<td id='xuhaoCount'>1</td>								<td>   <div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm'  ></dd></dl></div>										<div  >										<dl>											<dt>配置类型:</dt>											<dd>												<select id='ConfigType' name='ConfigType' onchange='changeTiaoZhuan(0)'>														<option value='1'>广告</option>														<option value='2'>商品</option>												</select>											</dd>										</dl>									</div>									<div>										<dl>											<dt>策划ID:</dt>											<dd>												<input type='hidden' name='policyId' id='policyId'>  												<input type='text' placeholder='请输入策划ID' name='planId' id='planId' autocomplete='off' οnkeyup='this.value=this.value.replace(/[^\d\,]/g,'')'>												<span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span>											</dd>										</dl>									</div>									<div>										<dl>											<dt>图片:</dt>											<dd><div style='overflow:hidden;'>												<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='iconList0imagesZw'>												<img src='' alt='' class='iconList0imgPerview'>												<p class='opacityP' id='iconList0opacityP'>上传图片</p>												<input type='hidden' name='iconListimageName' id='iconList0imageName' >												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconList0' >												</div>		<a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('iconList0');showid('ts_ljzs')"+" id='iconListfl0' title='图片'>预览</a></div>										<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>									<div  >										<dl>											<dt>档位介绍图片:</dt>											<dd>	<div style='overflow:hidden;'>											<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='introductioniconList0imagesZw'>												<img src='' alt='' class='introductioniconList0imgPerview'>												<p class='opacityP' id='introductioniconList0opacityP'>上传图片</p>												<input type='hidden' name='introductioniconListimageName' id='introductioniconList0imageName' autocomplete='off'>												<input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2)' name='UploadBtn' id='introductioniconList0'>												</div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('introductioniconList0');showid('ts_ljzs')"+" id='introductioniconListfl0' title='图片'>预览</a></div>												<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>									<div>										<dl>											<dt>跳转地址:</dt>											<dd>												<input type='hidden' name='jumpType' id='peizhijumpType'>												<input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' autocomplete='off'>												<span class='jhsp ad' id='jhsp0'  >选择广告/聚合页</span>	<input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'>										</dd>										</dl>									</div>									<div>										<dl>											<dt>展示权重:</dt>											<dd>												<input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' autocomplete='off'>																										</dd>										</dl>									</div>									<div>										<dl>											<dt>有效时间:</dt>											<dd class='yxsjdd'>												<input id='startTime' name='startTime' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" autocomplete='off'/> ~ <input id='endTime' name='endTime' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" />											</dd>										</dl>									</div>									<div  >										<dl>											<dt>是否显示下一步按钮:</dt>											<dd class=''>											<input type='radio' name='isShowButtoniop0' class='rin'   value='0'/><label for='ifyc1' class='rlb'>是</label> 											<input type='radio' name='isShowButtoniop0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>否</label>											</dd>										</dl>									</div>	<div class='anwzF'> <dl> <dt>按钮位置:</dt> <dd>  <div id='anwzF'> <input type='radio' name='anwz0' value='y' class='anwz' /><label for='anwz1'>中间</label>  <input type='radio' name='anwz0' value='n'  class='anwz' checked/><label for='anwz2'>底部</label>  </div> </dd> </dl> </div> <div class='dbzsF'> <dl> <dt>底部展示:</dt> <dd>  <div id='anwzF'> <input type='radio' name='dbzs0' value='y' class='anwz' checked/><label for='anwz1'>固定</label>  <input type='radio' name='dbzs0' value='n'  class='anwz'/><label for='anwz2'>悬浮（仅按钮位置底部可用）</label>  </div> </dd> </dl></div>								<div  >										<dl>											<dt>下一步按钮跳转:</dt>											<dd class='yxsjdd'>	<div style='overflow:hidden;'>										<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='NextList0imagesZw'>												<img src='' alt='' class='NextList0imgPerview'>												<p class='opacityP' id='NextList0opacityP'>上传图片</p>												<input type='hidden' name='NextListimageName' id='NextList0imageName'>												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='NextList0'>												</div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('NextList0');showid('ts_ljzs')"+" id='NextListfl0' title='图片'>预览</a></div>												<span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>									<div  >										<dl>											<dt>下一步按钮跳转:</dt>											<dd class='yxsjdd'>												<input type='radio' name='NextButtoniop0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>二次确认页</label> 											<input type='radio' name='NextButtoniop0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>原二次确认页</label>											</dd>										</dl>									</div><div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtonLbiop0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtonLbiop0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>									<div  >										<dl>											<dt>二次确认页图片:</dt>											<dd class='yxsjdd'>		<div style='overflow:hidden;'>									<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='SecondaryList0imagesZw'>												<img src='' alt='' class='SecondaryList0imgPerview'>												<p class='opacityP' id='SecondaryList0opacityP'>上传图片</p>												<input type='hidden' name='SecondaryListimageName' id='SecondaryList0imageName'>												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='SecondaryList0'>												</div>	<a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('SecondaryList0');showid('ts_ljzs')"+" id='SecondaryListfl0' title='图片'>预览</a></div>											<span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>									<div  >										<dl>											<dt>二次确认办理按钮:</dt>											<dd class='yxsjdd'>		<div style='overflow:hidden;'>									<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='handleList0imagesZw'>												<img src='' alt='' class='handleList0imgPerview'>												<p class='opacityP' id='handleList0opacityP'>上传图片</p>												<input type='hidden' name='handleListimageName' id='handleList0imageName'>												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='handleList0'>												</div>	<a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('handleList0');showid('ts_ljzs')"+" id='handleListfl0' title='图片'>预览</a></div>											<span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>								</td>								<td><a href='javascript:;' class='submitted saven' onclick='savePolicyFun(0)'>保存</a></td>							</tr>						</tbody>";
            	$('#htmlConCspz table').html('').append(tianzhi2);
            }
            if(policyListbuwei!=null){
            	var tianzhi="";
            	var sbutton="";
            	var nextbutton="";
            	var chooseas="";
            	var adoras="";
            	var ispop="";
            	var policy=policyListbuwei;
            	for(var int=0;int<policy.length;int++){
            		var policyGgwbm=policy[int][23];
            		if(!policyGgwbm){
            			policyGgwbm = "";
            		}
            		var secondIntrImgName=policy[int][24];//档位介绍第二图片
            		var thirdIntrImgName=policy[int][25];//档位介绍第三图片
            		var isshowbutt=policy[int][11];
            		var isnext=policy[int][13];
            		var address=policy[int][5];
            		var popUpButtoniop=policy[int][21];
            		var nextimage=policy[int][12];
            		var nextimage1=policy[int][14];
            		var nextimage2=policy[int][15];
            		var chooseAdOrSp=policy[int][17];
            		var anwz=policy[int][19];//按钮位置
                	var dbzs=policy[int][20];//底部展示
                	var anwzDbzs = "<div class='anwzF'> <dl> 	<dt>按钮位置:</dt> 	<dd> <div id='anwzF'> 	<input type='radio' name='anwz"+int+"' value='y' class='anwz'";
                	if('n' != anwz){
                		anwzDbzs += "checked";
                	}
                	anwzDbzs += "/><label for='anwz1'>中间</label>  	<input type='radio' name='anwz"+int+"' value='n' class='anwz' ";
                	if('n' == anwz){
                		anwzDbzs += "checked";
                	}
                	anwzDbzs += "/><label for='anwz2'>底部</label> </div> 	</dd> </dl>  </div>  <div class='dbzsF'> <dl> 	<dt>底部展示:</dt> 	<dd> <div id='anwzF'> 	<input type='radio' name='dbzs"+int+"' value='y' class='anwz' ";
                	if('y' == dbzs){
                		anwzDbzs += "checked";
                	}
                	anwzDbzs += "/><label for='anwz1'>固定</label>  	<input type='radio' name='dbzs"+int+"' value='n'  class='anwz' ";
                	if('y' != dbzs){
                		anwzDbzs += "checked";
                	}
                	anwzDbzs += "/><label for='anwz2'>悬浮（仅按钮位置底部可用）</label> </div> 	</dd> </dl>  </div>";
            		var shanchu="删除图片";
            		var shanchu1="删除图片";
            		var shanchu2="删除图片";
            		if(nextimage==null||nextimage==''||nextimage==undefined){
            			shanchu="上传图片";
            		}
            		if(nextimage1==null||nextimage1==''||nextimage1==undefined){
            			shanchu1="上传图片";
            		}
            		if(nextimage2==null||nextimage2==''||nextimage2==undefined){
            			shanchu2="上传图片";
            		}
            		if(address==null||address==''||address==undefined){
            			address="";
            		}
            		if(chooseAdOrSp=='2'){
            			chooseas="<option value='1'>广告</option><option value='2' selected='selected'>商品</option>";
            			adoras="<span class='jhsp sp' id='jhsp"+int+"'  >选择商品</span>";
            		}else{
            			chooseas="<option value='1' selected='selected'>广告</option><option value='2'>商品</option>";
            			adoras="<span class='jhsp ad' id='jhsp"+int+"'  >选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'value="+policy[int][22]+">";
            		}
            		if(isshowbutt=="1"){
            			 sbutton="<input type='radio' name='isShowButtonbuwei"+int+"' class='rin'  value='0'/><label for='ifyc1' class='rlb'  >是</label><input type='radio' name='isShowButtonbuwei"+int+"'  class='rin'  checked='checked'  value='1'/><label for='ifyc1' class='rlb'  >否</label> ";
            		}else{
            			 sbutton="<input type='radio' name='isShowButtonbuwei"+int+"' class='rin'   checked='checked'  value='0'/><label for='ifyc1' class='rlb'  >是</label><input type='radio' name='isShowButtonbuwei"+int+"'  class='rin'   value='1'/><label for='ifyc1' class='rlb'  >否</label> ";
            		}
            		if(isnext=="0"){
            			nextbutton="<input type='radio' name='NextButtonbuwei"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >二次确认页</label><input type='radio' name='NextButtonbuwei"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >原二次确认页</label>";
            		}else{
            			nextbutton="<input type='radio' name='NextButtonbuwei"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >二次确认页</label><input type='radio' name='NextButtonbuwei"+int+"' class='rin'  checked='checked' value='1'/><label for='ifyc2' class='rlb'  >原二次确认页</label>"
            		}
            		if(popUpButtoniop=="0"){
            			ispop="<input type='radio' name='popUpButtonLbiopbuwei"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiopbuwei"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
            		}else{
            			ispop="<input type='radio' name='popUpButtonLbiopbuwei"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiopbuwei"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
            		}
            		var xuhao=int+1;
            		tianzhi+="<tr class='clxqq'  id='policybuwei"+int+"'><td><input type='checkbox' value="+policy[int][0]+" name='buwei'></td>" +
            				"<td>"+xuhao+"</td><td> <div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div><div  ><dl ><dt>配置类型:</dt><dd><select id='ConfigType' name='ConfigType' value="+policy[int][17]+" onchange='changeTiaoZhuan("+int+")'>" +
            				chooseas+"</select></dd></dl></div>" +
            				"<div><dl><dt>图片:</dt><dd><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiiconList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='buweiiconList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiiconList"+int+"opacityP' onclick="+"deleteImg('buweiiconList"+int+"')>删除图片</p><input type='hidden' name='buweipolicyId' id='buweipolicyId' value="+policy[int][0]+">  <input type='hidden' name='buweiiconListimageName' value="+policy[int][4]+" id='buweiiconList"+int+"imageName'><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiiconList"+int+"');showid('ts_ljzs')"+" id='buweiiconListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
            				"<div  ><dl><dt>档位介绍图片:</dt><dd><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiintroductionList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][16]+"' alt=''  class='buweiintroductionList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiintroductionList"+int+"opacityP' onclick="+"deleteImgRemove('buweiintroductionList"+int+"','0')>删除图片</p><input type='hidden' name='buweiintroductionListimageName'  id='buweiintroductionList"+int+"imageName' value="+policy[int][16]+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2)' name='UploadBtn' id='buweiintroductionList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiintroductionList"+int+"');showid('ts_ljzs')"+" id='buweiintroductionListfl"+int+"' title='图片'>预览</a></div>" ;
		            		if(secondIntrImgName){
		            			tianzhi+=" <div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiintroductionList"+int+"imagesZw'><img src='"+vm.path+"/"+secondIntrImgName+"' alt=''  class='buweiintroductionList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiintroductionList"+int+"1opacityP' onclick="+"deleteImgRemove('buweiintroductionList"+int+"','1')>删除图片</p><input type='hidden' name='secondIntroductioniconListimageName' id='buweiintroductionList"+int+"imageName' value="+secondIntrImgName+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2,1)' name='UploadBtn' id='buweiintroductionList"+int+"1'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiintroductionList"+int+"',1);showid('ts_ljzs')"+" id='buweiintroductionListfl"+int+"' title='图片'>预览</a></div>";
		            		}
		            		if(thirdIntrImgName){
		            			tianzhi+= "<div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiintroductionList"+int+"imagesZw'><img src='"+vm.path+"/"+thirdIntrImgName+"' alt=''  class='buweiintroductionList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiintroductionList"+int+"2opacityP' onclick="+"deleteImgRemove('buweiintroductionList"+int+"','2')>删除图片</p><input type='hidden' name='thirdIntroductioniconListimageName' id='buweiintroductionList"+int+"imageName' value="+thirdIntrImgName+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2,2)' name='UploadBtn' id='buweiintroductionList"+int+"2'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiintroductionList"+int+"',2);showid('ts_ljzs')"+" id='buweiintroductionListfl"+int+"' title='图片'>预览</a></div>";
		            		}
                    tianzhi+="<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>"+
                    		"<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress' value="+address+">"+adoras+"</dd></dl></div>" +
            				"<div><dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+">				</dd></dl></div>" +
            				"<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTime1' name='startTime1' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTime1' name='endTime1' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div>	" +
            				"<div  >	<dl><dt>是否显示下一步按钮:</dt><dd class='yxsjdd'>"+sbutton+"</dd></dl></div>" + anwzDbzs +
            				"<div  ><dl><dt>下一步按钮跳转:</dt><dd class='yxsjdd'><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiNextList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][12]+"' alt=''  class='buweiNextList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiNextList"+int+"opacityP' onclick="+"deleteImg('buweiNextList"+int+"')>"+shanchu+"</p><input type='hidden' name='buweiNextListimageName' id='buweiNextList"+int+"imageName' value="+policy[int][12]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiNextList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiintroductionList"+int+"');showid('ts_ljzs')"+" id='buweiintroductionListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
            				"<div  ><dl><dt>下一步按钮跳转:</dt><dd class='yxsjdd'>"+nextbutton+"</dd>	</dl></div>" +
            				"<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
            				"<div  ><dl><dt>二次确认页图片:</dt><dd class='yxsjdd'><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiSecondaryList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][14]+"' alt=''  class='buweiSecondaryList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiSecondaryList"+int+"opacityP' onclick="+"deleteImg('buweiSecondaryList"+int+"')>"+shanchu1+"</p><input type='hidden' name='buweiSecondaryListimageName' id='buweiSecondaryList"+int+"imageName' value="+policy[int][14]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiSecondaryList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiSecondaryList"+int+"');showid('ts_ljzs')"+" id='buweiSecondaryListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
            				"<div  ><dl><dt>二次确认办理按钮:</dt><dd class='yxsjdd'><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='['buweihandleList'+int+'imagesZw']'><img src='"+vm.path+"/"+policy[int][15]+"' alt=''  class='buweihandleList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweihandleList"+int+"opacityP' onclick="+"deleteImg('buweihandleList"+int+"')>"+shanchu2+"</p><input type='hidden' name='buweihandleListimageName' id='buweihandleList"+int+"imageName' value="+policy[int][15]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweihandleList' id='buweihandleList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweihandleList"+int+"');showid('ts_ljzs')"+" id='buweihandleListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div></td>" +
            				"<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuwei("+int+")'>保存</a></td></tr>";
            	}
            	var tianzhi2=tbody+tianzhi+"</tbody>";
            	 $('#htmlConCspz2 table').html('').prepend(tianzhi2);
            }else{
            	var tianzhi2="					 	<thead>							<tr>								<th><input type='checkbox' class='allCheckbox'></th>								<th>序号</th>								<th>策略配置</th>								<th>操作</th>							</tr>						</thead>						<tbody class='mytablebox'> 							<tr class='clxqq'  id='policybuwei0'>								<td><input type='checkbox' name='buwei'></td>																<td>1</td>								<td>                <div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm'  ></dd></dl></div>									<div  >										<dl>											<dt>配置类型:</dt>											<dd>												<select id='ConfigType' name='ConfigType' onchange='changeTiaoZhuan(0)'>														<option value='1'>广告</option>														<option value='2'>商品</option>												</select>											</dd>										</dl>									</div>									<div >										<dl>											<dt>图片:</dt>											<dd>	<div style='overflow:hidden;'>											<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='buweiiconList0imagesZw'>												<img src='' alt='' class='buweiiconList0imgPerview'>												<p class='opacityP' id='buweiiconList0opacityP'>上传图片</p>												<input type='hidden' name='buweipolicyId' id='buweipolicyId'>  												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconList0'>												<input type='hidden' name='buweiiconListimageName' id='buweiiconList0imageName' >												</div>	<a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiNextList0');showid('ts_ljzs')"+" id='buweiNextListfl0' title='图片'>预览</a></div>											<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div >									<div  >										<dl>											<dt>档位介绍图片:</dt>											<dd><div style='overflow:hidden;'>													<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='buweiintroductionList0imagesZw'>												<img src='' alt='' class='buweiintroductionList0imgPerview'>												<p class='opacityP' id='buweiintroductionList0opacityP'>上传图片</p>												<input type='hidden' name='buweiintroductionListimageName' id='buweiintroductionList0imageName'>												<input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2)' name='UploadBtn' id='buweiintroductionList0'>												</div>	<a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiintroductionList0');showid('ts_ljzs')"+" id='buweiintroductionListfl0' title='图片'>预览</a></div>											<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>									<div>										<dl>											<dt>跳转地址:</dt>											<dd>												<input type='hidden' name='jumpType' id='peizhijumpType'>												<input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress'>												<span class='jhsp ad' id='jhsp0'>选择广告/聚合页</span>		<input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'>									</dd>										</dl>									</div>									<div>										<dl>											<dt>展示权重:</dt>											<dd>												<input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights'>																										</dd>										</dl>									</div>									<div>										<dl>											<dt>有效时间:</dt>											<dd class='yxsjdd'>												<input id='startTime1' name='startTime1' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value='' /> ~ <input id='endTime1' name='endTime1' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value='' />											</dd>										</dl>									</div>									<div  >										<dl>											<dt>是否显示下一步按钮:</dt>											<dd>											<input type='radio' name='isShowButtonbuwei0'  class='rin'  value='0'/><label for='ifyc1' class='rlb'>是</label> 											<input type='radio' name='isShowButtonbuwei0'  class='rin'  checked value='1'/><label for='ifyc1' class='rlb'>否</label> 											</dd>										</dl>									</div>							<div class='anwzF'> <dl> <dt>按钮位置:</dt> <dd>  <div id='anwzF'> <input type='radio' name='anwz0' value='y' class='anwz' /><label for='anwz1'>中间</label>  <input type='radio' name='anwz0' value='n'  class='anwz' checked/><label for='anwz2'>底部</label>  </div> </dd> </dl> </div> <div class='dbzsF'> <dl> <dt>底部展示:</dt> <dd>  <div id='anwzF'> <input type='radio' name='dbzs0' value='y' class='anwz' checked/><label for='anwz1'>固定</label>  <input type='radio' name='dbzs0' value='n'  class='anwz'/><label for='anwz2'>悬浮（仅按钮位置底部可用）</label>  </div> </dd> </dl></div>		<div  >										<dl>											<dt>下一步按钮跳转:</dt>											<dd class='yxsjdd'>	<div style='overflow:hidden;'>												<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='buweiNextList0imagesZw'>												<img src='' alt='' class='buweiNextList0imgPerview'>												<p class='opacityP' id='buweiNextList0opacityP'>上传图片</p>												<input type='hidden' name='buweiNextListimageName' id='buweiNextList0imageName'>												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiNextList0'>												</div>	<a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiNextList0');showid('ts_ljzs')"+" id='buweiNextListfl0' title='图片'>预览</a></div>											<span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>									<div  >										<dl>											<dt>下一步按钮跳转:</dt>											<dd class='yxsjdd'>												<input type='radio' name='NextButtonbuwei0'  class='rin'  value='0'/><label for='ifyc1'  class='rlb'>二次确认页</label> 											<input type='radio' name='NextButtonbuwei0'  class='rin'  checked value='1'/><label for='ifyc2'  class='rlb'>原二次确认页</label>											</dd>										</dl>									</div><div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtonLbiopbuwei0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtonLbiopbuwei0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>									<div  >										<dl>											<dt>二次确认页图片:</dt>											<dd class='yxsjdd'>		<div style='overflow:hidden;'>											<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='buweiSecondaryList0imagesZw'>												<img src='' alt='' class='buweiSecondaryList0imgPerview'>												<p class='opacityP' id='buweiSecondaryList0opacityP'>上传图片</p>												<input type='hidden' name='buweiSecondaryListimageName' id='buweiSecondaryList0imageName'>												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiSecondaryList0'>												</div>		<a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiSecondaryList0');showid('ts_ljzs')"+" id='buweiSecondaryListfl0' title='图片'>预览</a></div>										<span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>									<div  >										<dl>											<dt>二次确认办理按钮:</dt>											<dd class='yxsjdd'>		<div style='overflow:hidden;'>											<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='buweihandleList0imagesZw'>												<img src='' alt='' class='buweihandleList0imgPerview'>												<p class='opacityP' id='buweihandleList0opacityP'>上传图片</p>												<input type='hidden' name='buweihandleListimageName' id='buweihandleList0imageName'>												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweihandleList0'>												</div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweihandleList0');showid('ts_ljzs')"+" id='buweihandleListfl0' title='图片'>预览</a></div>												<span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>								</td>								<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuwei(0)'>保存</a></td>							</tr>						</tbody>";
            	$('#htmlConCspz2 table').html('').append(tianzhi2);
            }
        }) ;
        
        
        $(document).on('click','.ad',function(e) {// 选择聚合
            $(".tiaoType").html('选择广告/聚合页');
            $(".showiop").show();
            $(".showpmd").hide();
            $("#tjnr2yy").hide();//隐藏应用下载
            //$("#floorType").val('0');
             var id= this.id;
             $("#jhspId").val(id);
             var zhi=$(this).parent().find('#jumpAddress').val();
             huixianJH(zhi);
             huixanzhi=zhi;
              $('.modals_cspzjhy').fadeIn(200, function() {// 展示参数配置弹层
                  var layer=$('.cspzedit-layer',this);
                  layer.css({
                      'margin-top':-(layer.height())/2,
                      'margin-left':-(layer.width())/2
                  }).fadeIn(100);// 弹窗位置设置
                  // iop推荐弹窗拼串开始
                  $('#htmlConjh').show();// 默认展示IiopppOP推荐tab
              });
          })
        $(document).on('click','.jtIop',function(e) {// 选择聚合
            $(".tiaoType").html('选择集团IOP推荐');
            $(".showiop").show();
            $(".showpmd").hide();
            //$("#floorType").val('0');
            var id= this.id;
            $("#jhspId").val(id);
            var zhi=$(this).parent().find('#jumpAddressIop').val();
            huixianJH(zhi);
            huixanzhi=zhi;
            $('.modals_cspzjhys').fadeIn(200, function() {// 展示参数配置弹层
                var layer=$('.cspzedit-layer',this);
                layer.css({
                    'margin-top':-(layer.height())/2,
                    'margin-left':-(layer.width())/2
                }).fadeIn(100);// 弹窗位置设置
                // iop推荐弹窗拼串开始
                $('#htmlConjhIop').show();// 默认展示IOP推荐tab
            });
        })
          $(document).on('click','.sp',function(e) {// 选择商品
            console.log("sdfsdf");
             var id= this.id;
             $("#jhspId").val(id);
             var zhi=$(this).parent().find('#jumpAddress').val();
             huixianJH(zhi);
             huixanzhi=zhi;
              $('.modals_cspzsp').fadeIn(200, function() {// 展示参数配置弹层
                  var layer=$('.cspzedit-layer',this);
                  layer.css({
                      'margin-top':-(layer.height())/2,
                      'margin-left':-(layer.width())/2
                  }).fadeIn(100);// 弹窗位置设置
                  // iop推荐弹窗拼串开始
                  $('#htmlConsp').show();// 默认展示IOP推荐tab
              });
          })
          
        
        $('.modals').on('click','.addBtn button',function(){
            var i = $(this).parents('tr').siblings('tr').length+100;//避免重复
            var editHtml = "<tr><td class='border'><div class='selectType'><i>菜单名称：</i><div class='divBox selector1p'><p>请选择</p><select name='' id='' class='bottomSelect'><option value=''></option><option value='data1' bindClass='sy' bind='indexBottom'>首页</option><option value='data2' bindClass='fl' bind='flBottom'>分类</option><option value='data3' bindClass='fjdd' bind='nearbyBottom'>附近的店</option><option value='data4' bindClass='wd' bind='myBottom'>我的</option><option value='data5' bindClass='shop' bind='shopBottom'>商城</option><option value='data6' bindClass='collect' bind='scBottom'>收藏</option><option value='data7' bindClass='wtfk' bind='wtfkBottom'>问题反馈</option><option value='data8' bindClass='yhlb' bind='yhlbBottom'>优惠</option>"
            	editHtml +=  " <option value='zdyOption' bind='zdyOption' bindClass='plusPrivilege'>特权</option>" +
			" <option value='zdyOption' bind='zdyOption' bindClass='plusWelfare'>福利</option>" +
			" <option value='data9' bind='newflBottom' bindClass='newflBottom'>新分类页</option> " +
			//" <option value='zdyOption' bind='zdyOption' bindClass='plusOpening'>立即开通</option>" +
			" <option value='zdyOption' bind='zdyOption' bindClass='plusShop'>营业厅</option>" +
			" <option value='zdyOption' bind='zdyOption' bindClass='plusMyBottom'>plus我的</option>" +
            " <option value='goldenFishBottom' bind='goldenFishBottom' bindClass='goldenFishBottom'>锦鲤</option>" +
			//" <option value='data10' bind='dgBottom' bindClass='dg'>导购</option> "+
			" </select></div></div><p class='zdyInput' style='display:none;'>" + 
			" <dl class=\"tableDl jumpType\" style=\"\">" +
			" <dt  style=\" width: 142px;   text-align: center; \">跳转类型：</dt><dd><p><label>" +
			" <input type=\"radio\" name=\"linkType" + i + "\" value=\"lj" + i + "\" onclick=\"showTabLinkLj('" + i + "')\" checked=\"checked\" >链接</label>&nbsp;&nbsp;"
				+ " <label><input type=\"radio\" onclick=\"showTabLinkJhy('" + i + "')\" name=\"linkType" 
				+ i
				+ "\" value=\"jhy"
				+ i + "\" >聚合页</label></p>"
				+ " <p id=\"ljInput"
				+ i
				+ "\" class=\"ljInput\" style=\"display: block;\"  ><input type=\"text\" class=\"ml10 menuUrl\" placeholder=\"请输入链接地址\" style=\"margin-left: 0px;\" ></p>"
				+ " <p id=\"jhyInput"
				+ i
				+ "\" class=\"jhyInput\"  style=\"display: none;\"  ><select name=\"\" id=\"\"><option value=''>请选择</option> ";
        
        for(var j = 0 ; j < vm.aggregationList.length; j++){
editHtml += "<option value='decorateId_" + vm.aggregationList[j][0] + "' turnHref='" +  vm.aggregationList[j][2] + "?decorateId=" + vm.aggregationList[j][0] + "' bind='decorateId_" + vm.aggregationList[j][0] + "'>" + vm.aggregationList[j][1] + "</option>";
        } 
        editHtml += "</select></p></dd></dl></p> <div class=\"div_ggwbm\"><p style=\"left: 30px;\">广告位编码：<input style=\"float: right;margin-left: 40px;width: 194px;margin-bottom: 5px;\" class=\"dbdh_ggwbm\" ></p></div></td><td class='border' align='center'>" +
            		"<button type='submit' name='submit' class='submitted deleteNav'>删除</button></td></tr>";
            if($(this).parents('tr').siblings('tr').length<5){
                $(this).parents('tbody').append(editHtml);  
            }else{
                alert('最多显示5条');
            }
        })
        
        
        
        $('.modals').on('click','.deleteNav',function(){
            var thisIndex = $(this).parents('tr').index()-1;
            $(this).parents('tr').remove();
            $('.demo .navbottom-box ul li').eq(thisIndex).remove();
        })

        // iop切换
        function selectLiCspz(thisIndex){
            $('.iopcspz li').eq(thisIndex).addClass('cur').siblings('li').removeClass('cur');
         
            $('.main-content1').eq(thisIndex).show().siblings('.main-content1').hide();
             
            var policyType=$(".selectLiCspz li").index();
            $("#policyType").val(thisIndex);
            $('.ioptab').eq(thisIndex).show().siblings('.ioptab').hide();
        }
        
        function selectLiCspzpp(thisIndex){
            $('.selectLiCspzpp li').eq(thisIndex).addClass('cur').siblings('li').removeClass('cur');
         
            $('.main-content2').eq(thisIndex).show().siblings('.main-content2').hide();
             
            var policyTypepp=$(".selectLiCspzpp li").index();
            $("#policyType").val(thisIndex);
            $('.ioptabs').eq(thisIndex).show().siblings('.ioptabs').hide();
        }

        $('.selectLiCspz li').click(function(){
            var thisIndex=$(this).index();
            selectLiCspz(thisIndex);
        })
        
        $('.selectLiCspzpp li').click(function(){
            var thisIndex=$(this).index();
            selectLiCspzpp(thisIndex);
        })

      //tab楼层配置展示
        $('.edit .demo')
            .on('mouseover',selector,function(e){
                e.stopPropagation();
                $(this).children('.ctrl-btnstb').addClass('show');
                $('.leftlableYa').css('top',$(this).offset().top)
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
                $(this).children('.ctrl-btnstb').removeClass('show');
                if($(this).hasClass('box') || $(this).hasClass('lyrow') || $(this).hasClass('bigFloor')){
					$('.leftlableYa').text('').hide()
				}
            })
            .on('mouseout',selector,function(){
                $(this).children('.ctrl-btnstb').removeClass('show');
                if($(this).hasClass('box') || $(this).hasClass('lyrow') || $(this).hasClass('bigFloor')){
					$('.leftlableYa').text('').hide()
				}
            });

        //tab楼层删除tablidiv
        $(demo).on('click','.deltb',function(e){
            e.stopPropagation();
            if($('.tab_directionYaYa_flagYa').length > 0){ //纵向smtb bydiv
                var indexDelYa = $( this ).closest( "li" ).index()
                console.log(indexDelYa,'indexDelYa')
                $( this ).closest( "li" ).remove()
                $('.pcHeightScroll_ya .smtb.bydiv').eq(indexDelYa).remove();
            }else{ //横向
                var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
                $( "#" + panelId ).remove();
                $(this).parents(".tabslc").tabs().tabs("refresh" );
            }
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
                if(lihei){//计算一次li高度就可以了
                    // $(imgtb).parents("ul").find("li").children(".kda").children("img").css("height","100%");
                    $(imgtb).parents("ul").find("li").css("height",h+"px");
                    console.log(h,"图片高度回显");
                }
                

            });
		}
        //20211223update qsf tabLCTemplate
        var $lcThis,
        $lctcThis,
        tabsTitle = $( "#tabLcName" ),// tab增加或编辑的弹窗标题名称
        tabmrsh =  $( "#mrsh" ),// 默认色号
        tabxzsh =  $( "#xzsh" ),// 选中色号
        tabLCTemplate = '<li class="swiper-slide kdli"> <a href="#{href}">#{label}</a> <div class="tabslc_tool_container"><img src="../../images/decorate/gbs.png" alt="" class="opimg opimg1 deltb"> <img src="../../images/decorate/bj.png" alt="" class="opimg opimg1 edittb">' +
            '<img src="../../images/decorate/left-icon.png" alt="" class="opimg opimg1 lefttb"><img src="../../images/decorate/right-icon.png" alt="" class="opimg opimg1 righttb"><img src="../../images/decorate/blankStar.png" title=\'设为默认载入项\' alt="" class="opimg opimg1 noCheckStar">\n' +
            '<img src="../../images/decorate/checkStar.png" title=\'已设为默认载入项\' alt="" class="opimg opimg1 none yesCheckStar"> </div></li>',
        tabsCounter;// tabsCounter 当前tabs数量获取- 点击添加或者编辑的时候赋值个数
    	function addTabs(){
    		var tab_ggwbm = $lctcThis.children(".tabsDiv2").find(".tab_ggwbm").val();
            if(!tab_ggwbm){
            	alert("请输入广告位编码！");
            	return;
            }
    		var wx = $lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".wxpic").find(".imgPerview").attr("src");
    		var xz = $lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".xzpic").find(".imgPerview").attr("src");
    		//替换图片
    		if(!wx){
    			alert("请先上传未选中上传图片")
    			return  false; 
    		}
    		if(!xz){
    			alert("请先上传选中上传图片")
    			return  false; 
    		}
    		tabsCounter++;
    		
    		//  label = tabsTitle.val() || "Tab " + tabsCounter,
    		var xzc = '<img src="'+wx+'" goodcodeinputsign="goodcodeinputsign" goodCodeInput="'+ tab_ggwbm +'" alt="" class="lcwx disb"/> <img src="'+xz+'" goodcodeinputsign="goodcodeinputsign" goodCodeInput="'+ tab_ggwbm +'" alt="" class="lcxz ndis"/>';
    		var id = "tabslc-" + (new Date()).getTime(),//个数待优化
    		
    		li = $( tabLCTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, xzc ) ); 
    		$lcThis.parents(".ui-tabs-nav").children("li:last").before( li );

    	    /* ******** 20211222addqsf start ******* */
			var imgtb1 = $(li).find("a").children(".lcwx");//获取当前未选中img
			var imgtb2 = $(li).find("a").children(".lcxz");//获取当前选中img 
			compImg(imgtb1,"1");//计算未选中高度2021add12222qsf
			compImg(imgtb2);//计算选中图片高度2021add12222qsf
			/* ******** 20211222addqsf end ******* */

            if($('.tbbigFloor.now_tabYa').hasClass('tab_directionYaYa_flagYa')){
                $lcThis.parents(".tabslc").find(".goodsBox .goodsCont").append("<div  class='smtb bydiv tab_border_Ya swiper-slide' id='" + id + "'><div class='col'></div></div>");
            }else{
                $lcThis.parents(".tabslc").find(".goodsBox .goodsCont").append("<div  class='smtb bydiv swiper-slide' id='" + id + "'><div class='col'></div></div>");
            }
            $lcThis.parents(".tabslc").tabs().tabs("refresh" );

            // resizeInit($('.row',demo));
    		var cols=$('.col',demo);
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
    		//清空弹框
    			$lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".wxpic").find(".imgPerview").attr('src','');
    			$lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".wxpic").find('.imgInput').val('');
    			$lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".wxpic").find('.imgPerview').css("display","none");
    			$lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".wxpic").find('.imagesZw').css("display","block");
    			$lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".wxpic").find('#wxziconopacityP').text('上传图片').removeClass('j-deleteImg');
    			$lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".xzpic").find(".imgPerview").attr('src','');
    			$lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".xzpic").find('.imgInput').val('');
    			$lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".xzpic").find('.imgPerview').css("display","none");
    			$lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".xzpic").find('.imagesZw').css("display","block");
    			$lctcThis.children(".tabsDiv2").children(".wxzdiv").children(".xzpic").find('#wxziconopacityP').text('上传图片').removeClass('j-deleteImg');
    			qhli();
    			$tabs = demo.find(".tabslc").tabs();//初始化tabs
				$(".demo .swiper-tabHd").each(function(i,u){
					if($(u).hasClass("tabHd_"+i)){
						$(this).addClass("tabHd_"+i);
					
						//初始化菜单滑动
						// ;//添加事件执行的唯一样式
						var swipertabHd = new Swiper('.tabHd_'+i, { 
							slidesPerView: 'auto',
							//spaceBetween: 10 
						});
						$('.swiper-tabHd .swiper-slide').click(function() { //点击滑动的地方 
							var ix = parseInt($(this).index());
							console.log($(this).index());
							if(ix > 1) {
								swipertabHd.slideTo(ix - 2, 300, false); //切换到第一个slide，速度为1秒 
							}
						});
					}
			   });
			   closeC('.tabBTModals'); 
    		 
    	}
        
      //tab楼层编辑lidiv
        var tbt;
        $(demo).on('click','.editLc',function(e){
            e.stopPropagation();
            e.preventDefault();  
            tbt = $(this);
            $(this).parents('.tbbigFloor').addClass('now_tabYa')
            $('.coMmodals').show();//展示蒙版
            $('.tabModals').fadeIn(200, function() {
                var layer=$('.tablcDiv',this);
                layer.css({
                    'margin-top':-(layer.height())/2,
                    'margin-left':-(layer.width())/2
                }).fadeIn(100);
            }); 
        });
        
        
        $(".saveTablc").click(function(e){//添加和删除后需要初始化id -
            if($('.transverseAndLongitudinal option:selected').val() == 'directionYa'){
                $('.tbbigFloor.now_tabYa').addClass('tab_directionYaYa_flagYa')
                $('.smtb.bydiv').addClass('tab_border_Ya')
                $('.tab_directionYaYa_flagYa .goodsCont').removeClass('swiper-wrapper')
                $('.tab_directionYaYa_flagYa .goodsBox').addClass('pcHeightScroll_ya')
                divScroll_FunYa()
                console.log('纵向')
            }else if($('.transverseAndLongitudinal option:selected').val() == 'broadwiseYa'){
                $('.tbbigFloor.now_tabYa').removeClass('tab_directionYaYa_flagYa')
                $('.smtb.bydiv').removeClass('tab_border_Ya')
                $('.goodsCont').addClass('swiper-wrapper')
                $('.goodsBox').removeClass('pcHeightScroll_ya')
                console.log('横向')
            }
            e.stopPropagation();
                var c = $("#btlbj").val(); 
                var tabNum = $("#tabtupian").val(); //获取下拉选的值
                var tabType = $(".transverseAndLongitudinal").val(); //获取下拉选的值
                tbt.parent().parent(".tbbigFloor").find(".tab_ul").css("background-color",c);
                tbt.parent().parent(".tbbigFloor").find(".tab_ul").attr("tabNum",tabNum); //自定义tab楼层滑动菜单的值
                tbt.parent().parent(".tbbigFloor").find(".tab_ul").attr("tabType",tabType); //自定义tab楼层展示类型
                var tiptxt = iftabnum(tabNum);//不同提示语回显
                $("#tbts_id1").text(tiptxt);
                $("#tbts_id2").text(tiptxt);
                closeC('.tabModals');
            removeClassFunYa('now_tabYa')
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



        //tab楼层增加lidiv
        $(demo).on('click','.addtb',function(e){//
            e.stopPropagation();
            //点击增加弹出对话框，调用addTab的方法
            tabsCounter = $(this).parents(".tabslc").find(".kdli").length;//获取tabs的个数
            $lcThis = $(this);
            $(this).parents('.tbbigFloor').addClass('now_tabYa')
            $('.coMmodals').show();//展示蒙版
            $('.tabBTModals').fadeIn(200, function() {
                var layer=$('.tabBtdiv',this);
                layer.css({
                    'margin-top':-(layer.height())/2,
                    'margin-left':-(layer.width())/2
                }).fadeIn(100);
                $lctcThis = $(this);
            }); 
            
        }); 

        //tab编辑lidiv 20211223修改edittb editTAbs parent(".kdli")为parents(".kdli")
        var editThis;
    	$(demo).on('click','.edittb',function(e){
            $(this).parent().prev().find('.lcwx').click();//触发当前选中
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
    			var tab_ggwbm = editThis.parents(".kdli").find("a").children(".lcwx").attr("goodCodeInput");
    			$(this).children(".tabBtdiv1").find(".tab_ggwbm").val(tab_ggwbm);
    			var ewxpic = editThis.parents(".kdli").find("a").children(".lcwx").attr("src");
    			var exzpic = editThis.parents(".kdli").find("a").children(".lcxz").attr("src");
    			$(this).children(".tabBtdiv1").children(".ewxzdiv").children(".ewxpic").find(".imgPerview").attr("src",ewxpic);
    			$(this).children(".tabBtdiv1").children(".ewxzdiv").children(".exzpic").find(".imgPerview").attr("src",exzpic);
    			$(this).children(".tabBtdiv1").children(".ewxzdiv").children(".ewxpic").find("#bjwxziconopacityP").text('删除').addClass('j-deleteImg');
    			$(this).children(".tabBtdiv1").children(".ewxzdiv").children(".exzpic").find("#bjxziconopacityP").text('删除').addClass('j-deleteImg');
    		});  
    	}); 

        //保存
        $('.saveTAbs').click(function(e){//添加和删除后需要初始化id -明天继续优化
            e.stopPropagation(); 
            addTabs();//添加
        }); 
        
   
      //编辑2021add12222qsf更新parent(".kdli")为parents(".kdli")
        $('.editTAbs').click(function(e){
            e.stopPropagation(); 
            var tab_ggwbm = $edittcThis.children(".tabBtdiv1").find(".tab_ggwbm").val();
            if(!tab_ggwbm){
            	alert("请输入广告位编码！");
            	return;
            }
            var ewxpic = $edittcThis.children(".tabBtdiv1").children(".ewxzdiv").children(".ewxpic").find(".imgPerview").attr("src");
    		var exzpic = $edittcThis.children(".tabBtdiv1").children(".ewxzdiv").children(".exzpic").find(".imgPerview").attr("src");
    		if(!ewxpic){
            	alert("请上传未选中图片！");
            	return;
            }
    		if(!exzpic){
            	alert("请上传选中图片！");
            	return;
            }
    		editThis.parents(".kdli").find("a").children(".lcwx").attr("src",ewxpic);
    		editThis.parents(".kdli").find("a").children(".lcxz").attr("src",exzpic);
    		editThis.parents(".kdli").find("a").children(".lcwx").attr("goodcodeinputsign","goodcodeinputsign");
    		editThis.parents(".kdli").find("a").children(".lcwx").attr("goodCodeInput",tab_ggwbm);
    		editThis.parents(".kdli").find("a").children(".lcxz").attr("goodcodeinputsign","goodcodeinputsign");
    		editThis.parents(".kdli").find("a").children(".lcxz").attr("goodCodeInput",tab_ggwbm);
            var imgtb1 = editThis.parents(".kdli").find("a").children(".lcwx");
			
            compImg(imgtb1,"1");//计算未选中高度2021add12222qsf
			var imgtb2 = editThis.parents(".kdli").find("a").children(".lcxz");
			compImg(imgtb2);//计算选中图片高度2021add12222qsf

            closeC('.tabBTModals1'); 
        }); 

        //点击切换弹窗的tab
        function selectLi(thisIndex){
            $('.selectLi li').eq(thisIndex).addClass('cur').siblings('li').removeClass('cur');
         
            $('.main-content').eq(thisIndex).show().siblings('.main-content').hide();
        }

        $('.selectLi li').click(function(){
            var thisIndex=$(this).index();
            selectLi(thisIndex);
        })
        
        // 图片上传
   $('.modal,.lbmodal').on("change",".file",function(e){
        $(this).prev('p').text(getImageUrl(this.files[0]));
        $(this).parents('td').find('.yulanImg img').prop('src',getImageUrl(this.files[0]));
   })

       $('.modal,.modalsLbt').on("change",".file",function(e){
                var x = $(this);
                var _this = this;//给图片的onload方法使用
                // $(this).prev('p').text(getImageUrl(this.files[0]));
                // $(this).parents('td').find('.yulanImg
                // img').prop('src',getImageUrl(this.files[0]));
                // 2020 06 12 小于150k
                var AllowImgFileSize = 200000; // 上传图片最大值(单位字节)（ 1 M = 1048576
                  // B ）超过1M上传失败
                var image = '';
                if(!this.files || !this.files[0]){
                    return;
                }
                var shareImg = URL.createObjectURL(this.files[0]);
                var img = new Image();
                img.src = shareImg;
                img.onload = function () {//增加判断图片尺寸逻辑，图片加载完执行判断，图片上传，否则会因为异步加载导致判断不了
                    if(img.complete){
                        console.log($(x).parent().attr("class"))
                        if($(x).parent().attr("class").indexOf("shareImg")>=0){
                            if(img.width!=210||img.height!=168){
                                alert("分享图片必须是210*168，请重新选择！");
                                return ;
                            }
                        }
                        var reader = new FileReader();
                        reader.readAsDataURL(_this.files[0]);
                        reader.onload = function(evt){
                            if (AllowImgFileSize != 0 && AllowImgFileSize < reader.result.length) {
                                alert( '上传失败，请上传不大于150k的图片！');
                                $(x).parents('td').find('.yulanImg img').attr("src","../../images/decorate/demo.jpg");
                                return;
                            }else{
                                // 执行上传操作
                                image = evt.target.result;
                                $.ajax({
                                    type:'POST',
                                    url: vm.path + '/tWlmDecorate/uploadimage.do',
                                    data: {image: image},
                                    async: false,
                                    dataType: 'json',
                                    success: function(data){
                                        if(data.flag){
                                            console.log(data.message);
                                            if(!$(x).prev().hasClass("llbtn_xlbt")){
                                                $(x).prev().text(vm.path + "/" + data.imgFilePath);
                                            }
                                            $(x).parents('td').find('.yulanImg img').attr("src",vm.path + "/" + data.imgFilePath);
                                            console.log($(x).parents("div[class='flex1']"));
                                            if($(x).parents("tbdoy[id='zpcjEditBox']")){//转盘图片上传
                                                $(x).parents("div[class='flex1']").find('.yulanImg img').attr("src",vm.path + "/" + data.imgFilePath);
                                                $(x).parents("div[class='flex1']").find("div[class='shownamebox j_name']").find('.name').text(vm.path + "/" + data.imgFilePath);
                                                $(x).parents("div[class='flex1']").find("div[class='shownamebox j_name']").show();
                                                $(x).parents("div[class='flex1']").find(".yulanImg").show();
                                            }
                                            // $(x).next().show();
                                            // $(x).next().html(data.message);
                                            console.log(data.imgFilePath);
                                        }else{
                                            console.log(data.message);
                                        }
                                    },
                                    error: function(err){
                                        alert('网络故障');
                                    }
                                });
                            }

                        }
                    }
                };
           });

       
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
        
        
        $('.cspzedit-layer .close1').click(function(e){// iop楼层关闭弹窗
            e.preventDefault();
            iopFadeOut();
            return false;
        });
        
        $('.cspzedit-layer .close1pp').click(function(e){// iop楼层关闭弹窗
        	$("#roomType").val("");
            e.preventDefault();
            iopppFadeOut();
            return false;
        });

        $('.cspzedit-layer .close1Iop').click(function(e){// 集团iop楼层关闭弹窗
            e.preventDefault();
            jtiopFadeOut();
            return false;
        });

        $('.cspzedit-layer .close2,.cspzedit-layer .qxjh').click(function(e){// 聚合楼层关闭弹窗
            e.preventDefault();
            iopjhFadeOut();
            iopspFadeOut();
            return false;
        });
        
        $('.cspzedit-layer .qxVideo').click(function(e){// 视频关闭弹窗
            e.preventDefault();
            $('.modals_csp_video').fadeOut(200, function() {//视频关闭弹层
			});
            return false;
        });

        $('.edit-layer4 .close2,.edit-layer4 .cancelButton2').click(function(){
            
            fadeOut2();
            $('#edit-layer4').remove();
            return false;
        });
        $('.edit-layer5 .close3,.edit-layer5 .cancelButton3').click(function(){
            
            fadeOut3();
            $('#edit-layer5').remove();
            return false;
        });
        $('.edit-layer .close,.cancelButton').click(function(e){
            e.preventDefault();
            fadeOut();
            $('#edit-layer #teAre').remove();
            return false;
        });
        $('.edit-layer2 .close,.edit-layer3 .close,.edit-layer3 .cancelButton').click(function(e){
            e.preventDefault();
            fadeOut();
            return false;
        })
        $('.cspzedit-layeragree .close2,.cspzedit-layeragree .hideAgree').click(function(e){// 协议选择关闭
            e.preventDefault();
            $('.modals_cspzagree').fadeOut(100, function() {
                $(this).find('.cspzedit-layer .cspzedit-layeragree .tabs').hide();
            });
            return false;
        });

        var a = '';
        var that = '';
        
        // 点击下拉框
        $('.modal').on('change','.selectType select',function(e){
            e.preventDefault();
            var checkText=$(this).find("option:selected").val(); 
            if(checkText=='zdyOption' || checkText == "goldenFishBottom"){
                $(this).parents('td').find('.jumpType').show();
                $(this).parents('td').addClass('zdyTd').find('.zdyInput').show()
                if(checkText == "goldenFishBottom"){
                    $(this).parents('td').find('.goldenFishEs').show();
                }else {
                    $(this).parents('td').find('.goldenFishEs').hide();
                }
            }else{
                $(this).parents('td').find('.goldenFishEs').hide();
                $(this).parents('td').find('.jumpType').hide();
                $(this).parents('td').removeClass('zdyTd').find('.zdyInput').hide();
            }
            $(this).parent().find("p").text($(this).find("option:selected").text());
        })
        
        $('.modal').on('click','.jumpType input[type="radio"]',function(e){
            // e.preventDefault();
            var thisValue=$(this).val();
            if(thisValue.indexOf("lj") != -1){
                $(this).parents('dd').find('#ljInput'+thisValue.substring(thisValue.length-1)).show();
                $(this).parents('dd').find("#ggInput"+thisValue.substring(thisValue.length-1)+",#jhyInput"+thisValue.substring(thisValue.length-1)).hide();
            }else if(thisValue.indexOf("gg") != -1){
                $(this).parents('dd').find('#ggInput'+thisValue.substring(thisValue.length-1)).show();
                $(this).parents('dd').find("#ljInput"+thisValue.substring(thisValue.length-1)+",#jhyInput"+thisValue.substring(thisValue.length-1)).hide();
            }else if(thisValue.indexOf("jhy") != -1){
                $(this).parents('dd').find('#jhyInput'+thisValue.substring(thisValue.length-1)).show();
                $(this).parents('dd').find("#ljInput"+thisValue.substring(thisValue.length-1)+",#ggInput"+thisValue.substring(thisValue.length-1)).hide();
            }
        })
        
        $('.modal').on('click','.css-edit button.saveButton',function(e){
            e.preventDefault();
            var type = thisClickObj.data('type');
            // 点击保存按钮时，判断时默认类型还是html类型
            if($('#resultCon').css("display") == 'block'){// 默认
                if($('.selectP').css("display") == 'block'){// 动态广告位
                    var selectedVal = $('.selectP option:selected').val();
                    var goodCodeInput = $('.selectP .goodcodeinputsigngg').val();
                    if(goodCodeInput == '' || goodCodeInput == null || goodCodeInput == undefined ){
                        alert("请输入广告位编码！");
                        return;
                    }
                    that.parent().parent().find('.editing').attr('goodCodeInput',goodCodeInput);
                    that.parent().parent().find('.editing').attr('goodcodeinputsign','goodcodeinputsign');
                    that.parent().parent().find('.editing').attr('bind',selectedVal);
                }else if($('.selectP1').css("display") == 'block'){// 标签广告位
                    var selectedVal = $('.selectP1 option:selected').val();
                    var goodCodeInput = $('.selectP1 .goodcodeinputsigngg').val();
                    if(goodCodeInput == '' || goodCodeInput == null || goodCodeInput == undefined ){
                        alert("请输入广告位编码！");
                        return;
                    }
                    that.parent().parent().find('.editing').attr('goodCodeInput',goodCodeInput);
                    that.parent().parent().find('.editing').attr('goodcodeinputsign','goodcodeinputsign');
                    that.parent().parent().find('.editing').attr('bqBind',selectedVal);
                    that.parent().parent().find('.editing').attr('bqBindChoose',"choose");
                }else{
                    var type = thisClickObj.data('type');
                    if(type=="head"){// 标题类型
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 start **
                         */
                        var goodCodeInputValue = $('#htmlCon table').find('#goodCodeInput').val();
                        if(goodCodeInputValue == '' || goodCodeInputValue == null || goodCodeInputValue == undefined ){
                            alert("请输入广告位编码！");
                            return;
                        }
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                         */
                        
                        var imgSrc = $(this).parents('.modal').find('.title_url').eq(0).text();
                        // console.log(imgSrc);
                        var selected = $(this).parents('.modal').find('.selectType select').find("option:selected").val();
                        var bind = $(this).parents('.modal').find('.selectTypeHref select').find("option:selected").attr("bind");
                        $(thisClickObj).find('.ln-title-box img').eq(0).prop('src',imgSrc);
                        if('' == bind || undefined == bind){// 跳转页面为空 取设置更多
                            bind = $(this).parents('.modal').find('.selectType select').find("option:selected").attr("bind"); 
                            $(thisClickObj).find('.ln-title-box a').eq(0).removeAttr('turnHref');
                            $(thisClickObj).find('.ln-title-box a').eq(0).removeAttr('bindturnhref');
                            $(thisClickObj).find('.ln-title-box a').eq(0).removeAttr('bindBqTittleTypeTurnHref');
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bindType',selected);
                            var linkHref = $(this).parents('.modal').find('.link_href').eq(0).val();
                            // $(thisClickObj).find('.ln-title-box
                            // a').eq(0).prop('href',linkHref);
                            
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bind',bind);
                            if(selected=='zdyOption'){
                              if(linkHref == '' || linkHref == null){
                                  alert("请输入链接地址！");
                                  return;
                              }
                              console.log(linkHref);
                              $(thisClickObj).find('.ln-title-box a').eq(0).prop('href',linkHref);
                              $(thisClickObj).find('.ln-title-box a').eq(0).prev().attr("onclick","document.location='" + linkHref + "'");
                            }else{
                              $(thisClickObj).find('.ln-title-box a').eq(0).prop('href','javascript:void(0)');
                              $(thisClickObj).find('.ln-title-box a').eq(0).prev().removeAttr("onclick")
                            }
                        }else{
                            var turnHref = $(this).parents('.modal').find('.selectTypeHref select').find("option:selected").attr('turnHref');
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('turnHref',turnHref);
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bindturnhref',"bindturnhref");
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bindBqTittleTypeTurnHref',bind);
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bindType',bind);
                            $(thisClickObj).find('.ln-title-box a').eq(0).prev().removeAttr("onclick");
                        }
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 start **
                         */
                        $(thisClickObj).find('.ln-title-box a').attr('goodCodeInput',goodCodeInputValue);
                        $(thisClickObj).find('.ln-title-box a').attr('goodcodeinputsign','goodcodeinputsign');
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                         */
                        
                    }else if(type=="headBq"){// 标签标题类型
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 start **
                         */
                        var goodCodeInputValue = $('#htmlCon table').find('#goodCodeInput').val();
                        if(goodCodeInputValue == '' || goodCodeInputValue == null || goodCodeInputValue == undefined ){
                            alert("请输入广告位编码！");
                            return;
                        }
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                         */
                        var imgSrc = $(this).parents('.modal').find('.title_url').eq(0).text();
                        // console.log(imgSrc);
                        var bind = $(this).parents('.modal').find('.selectType select').find("option:selected").attr("bind"); 
                        var selected = $(this).parents('.modal').find('.selectTypeHref select').find("option:selected").val();  
                        if('' == selected || undefined == selected){
                            selected = $(this).parents('.modal').find('.selectType select').find("option:selected").val(); 
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bindBqTittleChoose',"bindBqTittleChoose");
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bindBqTittleType',selected);
                            $(thisClickObj).find('.ln-title-box a').eq(0).removeAttr('bindturnhref');
                            $(thisClickObj).find('.ln-title-box a').eq(0).removeAttr('bindBqTittleTypeTurnHref');
                            var linkHref = $(this).parents('.modal').find('.link_href').eq(0).val();
                            $(thisClickObj).find('.ln-title-box img').eq(0).prop('src',imgSrc);
                            // $(thisClickObj).find('.ln-title-box
                            // a').eq(0).prop('href',linkHref);
                            
                            
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bindType',selected);
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bind',bind);
                            if(selected=='zdyOption'){
                              if(linkHref == '' || linkHref == null){
                                  alert("请输入链接地址！");
                                  return;
                              }
                              console.log(linkHref);
                              $(thisClickObj).find('.ln-title-box a').eq(0).prop('href',linkHref);
                              if('' == selected || undefined == selected){
                                  $(thisClickObj).find('.ln-title-box a').eq(0).prev().attr("onclick","document.location='" + linkHref + "'");
                              }
                            }else{
                              $(thisClickObj).find('.ln-title-box a').eq(0).prop('href','javascript:void(0)');
                              $(thisClickObj).find('.ln-title-box a').eq(0).prev().removeAttr("onclick");
                            }
                        }else{
                            var turnHref = $(this).parents('.modal').find('.selectTypeHref select').find("option:selected").attr('turnHref');
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('turnHref',turnHref);
                            $(thisClickObj).find('.ln-title-box a').eq(0).removeAttr('bindBqTittleChoose');
                            $(thisClickObj).find('.ln-title-box a').eq(0).removeAttr('bindBqTittleType');
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bindturnhref',"bindturnhref");
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bindBqTittleTypeTurnHref',selected);
                            $(thisClickObj).find('.ln-title-box a').eq(0).attr('bindType',selected);
                            $(thisClickObj).find('.ln-title-box a').eq(0).prev().removeAttr("onclick");
                        }
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 start **
                         */
                        $(thisClickObj).find('.ln-title-box a').attr('goodCodeInput',goodCodeInputValue);
                        $(thisClickObj).find('.ln-title-box a').attr('goodcodeinputsign','goodcodeinputsign');
                        /**
                         * * add by dingchuan 20190704
                         * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                         */
                        
                    }else if(type=="image"){// 静态广告位
                        var imgNum = $(thisClickObj).find('.myview .goodsImage').find('img').length;
                        console.log(imgNum);
                        var editHtmlImg = "";
                        for(var i= 0 ;i<imgNum;i++){
                        	//展示类型下拉框
                            var checktextstr = $("#checktextstr").val();// 0 音频 1 海报 2 弹层 3 链接跳转 4 满意度评价 5 视频 6 自填单
							if(checktextstr){
								$(thisClickObj).find('.goodsImage a').eq(i).attr('checktextstr',checktextstr);
							}
							//链接类型
							var checktexttar = $("#checktexttar").val();//1 链接 2 我的 3 应用
							if(checktexttar){
								$(thisClickObj).find('.goodsImage a').eq(i).attr('checktexttar',checktexttar);
							}
                        
                            var imgSrc = $(this).parents('.modal').find('.staticImg .title_url').eq(i).text();
                            var posterImgSrc = $(this).parents('.modal').find('.posterImg .title_url').eq(i).text();//海报图片url
                            var isPosterSign = 'n';//是否生成海报标识
                            if(checktextstr && '1' == checktextstr){
                            	isPosterSign = 'y';
                            }
                            var popUpButton = $(this).parents('.modal').find('input[name="popUpButton"]:checked').eq(i).val();
                            var programLoginFlag = $(this).parents('.modal').find('input[name="programLoginFlag"]:checked').eq(i).val();//小程序登录标识
                            var programLoginCheck = $(this).parents('.modal').find('input[name="programLoginCheck"]:checked').eq(i).val();//小程序登录校验标识
                            if(checktextstr && '1' == checktextstr){//海报
                            	$(thisClickObj).find('.goodsImage a').eq(i).attr('postimgurl',posterImgSrc);
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('postimgurlsign','y');
                            } else {
                            	$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('postimgurl');
                                $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('postimgurlsign')
                            }
                            if(popUpButton){
                            	$(thisClickObj).find('.goodsImage a').eq(i).attr('popUpButton',popUpButton);
                            }
                            if(programLoginFlag){//小程序登录标识
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('programLoginFlag',programLoginFlag);
                            }
                            if(programLoginCheck){//小程序登录标识
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('programLoginCheck',programLoginCheck);
                            }
                            var goodCodeInput = $(this).parents('.modal').find('.goodcodeinputsign').eq(i).val();
                            var islogin = $(this).parents('.modal').find('input[name="islogin"]:checked').eq(i).val();
                            var turnTypeSelect = $(this).parents('.modal').find('.turnTypeSelect').find("option:selected").val();
                            var selectTypePhoneHref = $(this).parents('.modal').find('.selectTypePhoneHref').find("option:selected").val();
                            if(!goodCodeInput){
                              alert("请输入广告位编码！");
                              return;
                            }
                            
                            var linkHref = '';
                            if(checktextstr && '2' == checktextstr){//弹层
                            	linkHref = $(this).parents('.modal').find('.alert_href').eq(i).val();
                            } else if(checktextstr && '4' == checktextstr){
                            	linkHref = $(this).parents('.modal').find('#templateIdHref').eq(i).val();
                            } else if (checktextstr && '3' == checktextstr && checktexttar && '3' == checktexttar){
                            	linkHref = $(this).parents('.modal').find('.selectTypeApplyHref select').find("option:selected").attr("applyDownHref"); 
                            } else if (checktextstr && '6' == checktextstr){
                                linkHref = $(this).parents('.modal').find('#customUrl').eq(i).val(); 
                            }
                            
                            if(!linkHref){
	                            linkHref = $(this).parents('.modal').find('.selectTypeMyHref select').find("option:selected").attr("bind");
	                            if('' == linkHref || undefined == linkHref){
	                          	  linkHref = $(this).parents('.modal').find('.selectTypeHref select').find("option:selected").attr("turnHref");
	                          	  if('' == linkHref || undefined == linkHref){
	                      			linkHref = $(this).parents('.modal').find('.link_href').eq(i).val();
	                              }
	                            }
                            }

                            var nameThat = this;
                            $(thisClickObj).find('.goodsImage img').eq(i).prop('src',imgSrc);
                            //非我的增加使用跳转增加展示新页面和父页面
                           
                            $(thisClickObj).find('.goodsImage a').eq(i).attr('url',linkHref);
                            
                            //我的
                            if(checktextstr && '3' == checktextstr && checktexttar && '2' == checktexttar && linkHref.indexOf("mySign_") != -1){
                              $(thisClickObj).find('.goodsImage a').eq(i).attr('bindturnmyhref','bindturnmyhref');
                              $(thisClickObj).find('.goodsImage a').eq(i).attr('url','decoraterId='+vm.id);
                              $(thisClickObj).find('.goodsImage a').eq(i).attr('bind',linkHref);
                            } else {
                              $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('bindturnmyhref');
                              $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('bind');
                            }
                            if(linkHref.indexOf("decorateId=") != -1 || linkHref.indexOf("pkid=") != -1){
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('bindturnhrefimage','bindturnhrefimage');
                            } else {
                                $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('bindturnhrefimage');
                            }
                            // 链接
                            var name = $(nameThat).parents('.modal').find('.link_href').eq(i).next().next().html();
                            if(checktextstr && '3' == checktextstr && checktexttar && '0' == checktexttar ){
                            	$(thisClickObj).find('.goodsImage a').eq(i).attr('staticname',name);
                            } else {
                            	$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('staticName');
                            }
                            //广告id
                            if(linkHref.indexOf("adid") != -1){
                              $(thisClickObj).find('.goodsImage a').eq(i).attr('staticAdinfo',"staticAdinfo");
                              $(thisClickObj).find('.goodsImage a').eq(i).attr('adinfo',linkHref);
                            }else{
                              $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('staticAdinfo');
                              $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('adinfo');
                            }
                            
                            //弹窗广告
                            if(checktextstr && '2' == checktextstr && linkHref.indexOf("alertid") != -1){
                            	var alertName = $(nameThat).parents('.modal').find('.alert_href').eq(i).next().next().html();
                                var imgUrl = $(nameThat).parents('.modal').find('.alert_href').eq(i).next().next().attr("imgUrl");
                                var tzUrl = $(nameThat).parents('.modal').find('.alert_href').eq(i).next().next().attr("tzUrl");
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('alertName',alertName);
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('imgUrl',imgUrl);
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('staticAlertinfo',"staticAlertinfo");
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('tzUrl',tzUrl);
                              }else{
                            	$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('alertName');
                                $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('imgUrl');
                                $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('staticAlertinfo');
                                $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('tzUrl');
                              }
                            
                            //满意度评价
                            if(checktextstr && '4' == checktextstr && linkHref.indexOf("templateId") != -1){
                            	var templatename = $(this).parents('.modal').find('#templateIdHref').eq(i).next().next().html();
                            	$(thisClickObj).find('.goodsImage a').eq(i).attr('templatename',templatename);
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('url','');
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('selectTemplateIdHref',linkHref);
                             } else {
                             	$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('templatename');
                                $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('selectTemplateIdHref');
                             }

                            // 2019 12 17
                            if(turnTypeSelect){
                            	$(thisClickObj).find('.goodsImage a').eq(i).attr('turnTypeSelect',turnTypeSelect);
                            	if('2' == turnTypeSelect){
                                	$(thisClickObj).find('.goodsImage a').eq(i).attr('turnTypeSelectTrue','turnTypeSelectTrue');
                            	} else {
                            		$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('turnTypeSelectTrue');
                            	}
                            } else {
                            	$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('turnTypeSelect');
                            	$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('turnTypeSelectTrue');
                            }
                            if(selectTypePhoneHref && linkHref.indexOf("adid") != -1){
                            	$(thisClickObj).find('.goodsImage a').eq(i).attr('selectTypePhoneHref',selectTypePhoneHref);
                            } else {
                            	$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('selectTypePhoneHref');
                            }
                            $(thisClickObj).find('.goodsImage a').eq(i).attr('goodCodeInput',goodCodeInput);
                            $(thisClickObj).find('.goodsImage a').eq(i).attr('goodcodeinputsign','goodcodeinputsign');
                            $(thisClickObj).find('.goodsImage a').eq(i).prop('href','javascript:void(0)');
                            $(thisClickObj).find('.goodsImage a').eq(i).attr('islogin',islogin);
                            
                            $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('onclick');
                            if(linkHref.indexOf("mySign_") != -1){
                                $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('onclick');
                            } else if (linkHref.indexOf("bigFloor") != -1) {
                                $(thisClickObj).find('.goodsImage a').eq(i).prop('href','#' + linkHref);
                                $(thisClickObj).find('.goodsImage a').eq(i).removeAttr('onclick');
                            }else if (linkHref.indexOf("alertid") != -1) {
                            	 $(thisClickObj).find('.goodsImage a').eq(i).attr('onclick',"staticAdAlert(this)");
                            } else if(linkHref.indexOf("templateId") != -1){
                            	$(thisClickObj).find('.goodsImage a').eq(i).attr('onclick',"staticAdTemplateId('"+linkHref+"','"+popUpButton+"')");
                            }else{
                            	if('y' != isPosterSign){
                            		if(selectTypePhoneHref && linkHref.indexOf("adid") != -1){
                            			$(thisClickObj).find('.goodsImage a').eq(i).attr('onclick',"javascript:addToProductStore.executeFvsStatcAdidForPhone('"+linkHref+"','1',this,'02','','1','"+selectTypePhoneHref+"','"+popUpButton+"')");
                            		} else if(linkHref){
                            			$(thisClickObj).find('.goodsImage a').eq(i).attr('onclick',"javascript:addToProductStore.executeFvsStatcAdidForPhone('"+linkHref+"','1',this,'02','','1','','"+popUpButton+"')");
                            		}
                            		
                            	}
                        	}

                            //小程序分享
                            var shareImgSrc = $(this).parents('.modal').find('.shareImg .title_url').eq(i).text();//海报图片url
                            if(checktextstr && '7' == checktextstr){
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('onclick',"javascript:shareFifthPoster(this,'"+$('#shareProTitle').val()+"','"+$('#shareProDesc').val()+"','"+shareImgSrc+"')");
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('shareImgUrl',shareImgSrc);
                            }
                            //点击事件
                            if(checktextstr && '9' == checktextstr){
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('onclick',$("#staticClickFun").val());
                            }

                            // 企业微信
                            if(checktextstr && '8' == checktextstr){
                                $(thisClickObj).find('.goodsImage a').eq(i).attr('onclick',"workWxQrCode()");
                            }

                        	$(thisClickObj).find('.goodsImage ul').show();
                        	$(thisClickObj).find('.goodsImage .video_btn').remove();
                    		$(thisClickObj).find('.goodsImage .play_btb').remove();
                    		$(thisClickObj).find('.goodsImage .back_btn').remove();
                        	// 视频开始
                        	if(checktextstr && '5' == checktextstr){
                        		var videoSourceFile = $(this).parents('.modal').find('#videoIfHref').eq(i).val();//视频名
                        		var videoSourceFileName = $(this).parents('.modal').find('#videoIfHref').eq(i).next().next().html();//视频名
                        		$(thisClickObj).find('.goodsImage a').eq(i).attr('videochoose','videochoose')
                        		$(thisClickObj).find('.goodsImage a').eq(i).attr('videoSourceFileName',videoSourceFile)
                        		$(thisClickObj).find('.goodsImage a').eq(i).attr('videoname',videoSourceFileName)
                        		$(thisClickObj).find('.goodsImage a').eq(i).attr('onclick',"javascript:videoShow('"+videoSourceFile+"')");
                        		$(thisClickObj).find('.goodsImage .audio_btn').eq(i).after("<section class='video_btn' style='display:none; z-index:999;' >"
                        			+ "<video class='video_src' preload='auto' controls='controls' x5-playsinline=\"true\"  webkit-playsinline=\"true\" playsinline=\"true\" src='" + vm.mp3ReplacePath+"/"+videoSourceFile + ".mp4' style='width:100%;' accept='video/mp4'></video></section>"+
                        				" <div class=\"play_btb\" onclick=\"jBofang(this)\" style=\"z-index: 999;\"><p class=\"pimg\"></p></div> <div class=\"back_btn\" onclick=\"jBofangBack(this)\" style=\"z-index: 999;display:none;\"><p class=\"bimg\"></p></div>");
                        		
                        	} else {
                        		$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('videochoose');
                        		$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('videoname');
                        		$(thisClickObj).find('.goodsImage a').eq(i).removeAttr('videoSourceFileName');
                        	}
                            /**
                             * 2020 1 14 
                             * 增加音频播放
                             */
                            var audioFile = $(this).parents('.modal').find('.audio_div audio').eq(i).attr("src");
                            var audioFileName = $(this).parents('.modal').find('#xzwjl').eq(i).val();
                            if(!audioFileName){
                            	audioFileName = "";
                            }
    						var ifshowAd = $(this).parents('.modal').find('input[name="ifzsyp"]:checked').eq(i).val();//是否展示音频
    						var ifzy = $(this).parents('.modal').find('input[name="zysj"]:checked').eq(i).val();//是否展示音频
                            $(thisClickObj).find('.myview .goodsImage .ifsad').eq(i).val(ifshowAd);//是否展示音频
    						$(thisClickObj).find('.myview .goodsImage .zysj').eq(i).val(ifzy);//左上角右上角
    						$(thisClickObj).find('.goodsImage .audio_btn audio').eq(i).attr('src',audioFile);
    						$(thisClickObj).find('.goodsImage .audio_btn audio').eq(i).attr('mp3Filename',audioFileName);
    						if(ifshowAd=='1' && checktextstr && '0' == checktextstr){//展示
    							$(thisClickObj).find('.goodsImage .audio_btn').eq(i).show();
    							if("" == audioFile){
    								alert("请上传音频文件");
									return;
								}
    							if(ifzy == '1'){//左上角
    								$(thisClickObj).find('.goodsImage .audio_btn').css("left","2%");
    								$(thisClickObj).find('.goodsImage .audio_btn').css("right","auto");
    							}else{//右上角
    								$(thisClickObj).find('.goodsImage .audio_btn').css("right","2%");
    								$(thisClickObj).find('.goodsImage .audio_btn').css("left","auto");
    							}
    							/*$(thisClickObj).find('.goodsImage .audio_btn').eq(i).find('audio')[0].play();*/
    							$(thisClickObj).find('.goodsImage .audio_btn').unbind("click");
    							$(thisClickObj).find('.goodsImage .audio_btn').bind('click', function() {//音频绑定暂停和启动时间
    								$(this).hasClass("off") ? ($(this).addClass("play_yinfu").removeClass("off"),$(this).children(".yinfu").addClass("rotate"), $(this).find('audio')[0].play()) : ($(this).addClass("off").removeClass("play_yinfu"), $(this).children(".yinfu").removeClass("rotate"),
    								$(this).find('audio')[0].pause());//暂停
    							});
    						}else{
    							$(thisClickObj).find('.goodsImage .audio_btn').eq(i).hide();
    							
    						}
    						
    						//保存完之后默认加载音频
                        }
                    }else if(type=="gallery"){// 滚动菜单
                        var imgNum = $(thisClickObj).find('.myview .swiper-slide').find('img').length;
                        console.log(imgNum);
                        var editHtmlImg = "";
                        for(var i= 0 ;i<imgNum;i++){
                        /*
                         * if(i >= 9 ){ alert("添加的菜单不能超过九个"); return; }
                         */

                            
                            /**
                             * * modify by dingchuan 20190704
                             * 441-YH19070202优化装修页面各广告位插码的需求 start **
                             */
                            var goodCodeInputValue = $('#htmlCon table').find('.ggwbm').find('#goodCodeInput'+(i + 1)).find('input').val();
                            if(goodCodeInputValue == '' || goodCodeInputValue == null || goodCodeInputValue == undefined ){
                                alert("请输入广告位编码！");
                                return;
                            }
                            /**
                             * * modify by dingchuan 20190704
                             * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                             */
                            var imgSrc = $(this).parents('.modal').find('.title_url').eq(i).text();
                            var linkHref = $(this).parents('.modal').find('.link_href').eq(i).val();
                            var selected = $(this).parents('.modal').find('.selectType select').eq(i).find("option:selected").val(); 
                            var selectedText = $(this).parents('.modal').find('.selectType').eq(i).find("p").text(); 
                            var bind = $(this).parents('.modal').find('.selectType select').eq(i).find("option:selected").attr("bind"); 
                            $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bind',bind);
                            $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType',selected);
                            if(selected=='zdyOption'){
                                // - 03 - 05新增
                                var aText = $(this).parents('.modal').find('th').eq(i+1).next().find('.menuName').val();
                                var aUrl = '';// 链接地址（包含广告名称，聚合页名称）
                                var aUrlName = '';// 广告名称
                                var checkRadio = $(this).parents('.modal').find('th').next().find('.jumpType').find("input[name=linkType"+(i+1)+"]:checked").val();
                                if(checkRadio.indexOf("lj") != -1){// 连接地址
                                    aUrl = $(this).parents('.modal').find('th').eq(i+1).next().find('.jumpType').find('#ljInput'+checkRadio.substring(checkRadio.length-1)).find('input').val();
                                    $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('url',aUrl);
                                }else if(checkRadio.indexOf("gg") != -1){// 广告地址
                                    aUrl = $(this).parents('.modal').find('th').eq(i+1).next().find('.jumpType').find('#ggInput'+checkRadio.substring(checkRadio.length-1)).find('input').val();
                                    aUrlName = $(this).parents('.modal').find('th').eq(i+1).next().find('.jumpType').find('.staticurlname'+(i+1)).html();
                                }else if(checkRadio.indexOf("jhy") != -1){// 聚合页地址
                                    aUrl = $(this).parents('.modal').find('th').eq(i+1).next().find('.jumpType').find('#jhyInput'+checkRadio.substring(checkRadio.length-1) + ' option:selected').attr("turnHref");
                                }
                                if(aText != ''){
                                    $(thisClickObj).find('.myview .swiper-slide').eq(i).find('p').text(aText);
                                }else {
                                    $(thisClickObj).find('.myview .swiper-slide').eq(i).find('p').text('');
                                }
                                if(aUrl != ''){
                                    if(aUrl.indexOf("decorateId=") != -1){// 聚合页跳转
                                        $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindturnhrefimage','bindturnhrefimage');
                                        $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('url',aUrl)
                                    } else {
                                        $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('bindturnhrefimage');
                                    }
                                    if(aUrl.indexOf("adid") != -1){// 广告id跳转
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('staticname',aUrlName);
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('staticAdinfo',"staticAdinfo");
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('adinfo',aUrl);
                                    }else{
                                        $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('staticName');
                                        $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('staticAdinfo');
                                        $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('adinfo');
                                    }
                                    $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').prop('href','javascript:void(0)');
                                    $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('onclick',"javascript:addToProductStore.executeFvsStatcAdid('"+aUrl+"','1',this,'02','','1')");
                                }else{
                                    alert("请输入链接地址！");
                                    return;
                                    // $(thisClickObj).find('.myview
                                    // .swiper-slide').eq(i).find('a').prop('href','javascript:void(0)');
                                }
                                }else{
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('p').text(selectedText);
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('staticName');
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('staticAdinfo');
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('adinfo');
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('url');
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('onclick');
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('bindturnhrefimage');
                                };
                                $(thisClickObj).find('.myview .swiper-slide img').eq(i).prop('src',imgSrc);
                                $(thisClickObj).find('.myview .swiper-slide a').eq(i).prop('href','javascript:void(0)');
                                var pText = $('.selector1p p').eq(i).text();
                                if(selected!='zdyOption'){
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
                                      $('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data5']").prop("selected",true);
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data5')
                                      break;
                                      case '终端':
                                      $('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data6']").prop("selected",true);
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data6')
                                      break;
                                      case '应用推荐':
                                      $('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data7']").prop("selected",true);
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data7')
                                      break;
                                  }
                            }
                            /**
                             * * add by dingchuan 20190704
                             * 441-YH19070202优化装修页面各广告位插码的需求 start **
                             */
                            $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('goodCodeInput',goodCodeInputValue);
                            $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('goodcodeinputsign','goodcodeinputsign');
                            /**
                             * * add by dingchuan 20190704
                             * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                             */
                        }
                        
                    }else if(type=="twoGallery"){// 双层菜单
                        var imgNum = $(thisClickObj).find('.myview .swiper-slide').find('img').length;
                        console.log(imgNum);
                        var editHtmlImg = "";
                        for(var i= 0 ;i<imgNum;i++){
                            /**
                             * * modify by dingchuan 20190704
                             * 441-YH19070202优化装修页面各广告位插码的需求 start **
                             */
                            var goodCodeInputValue = $('#htmlCon table').find('.ggwbm').find('#goodCodeInput'+(i + 1)).find('input').val();
                            if(goodCodeInputValue == '' || goodCodeInputValue == null || goodCodeInputValue == undefined ){
                              alert("请输入广告位编码！");
                              return;
                            }
                            /**
                             * * modify by dingchuan 20190704
                             * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                             */
                            var imgSrc = $(this).parents('.modal').find('.title_url').eq(i).text();
                            var linkHref = $(this).parents('.modal').find('.link_href').eq(i).val();
                            var selected = $(this).parents('.modal').find('.selectType select').eq(i).find("option:selected").val(); 
                            var selectedText = $(this).parents('.modal').find('.selectType').eq(i).find("p").text(); 
                            var bind = $(this).parents('.modal').find('.selectType select').eq(i).find("option:selected").attr("bind"); 
                            $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bind',bind);
                            $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType',selected);
                            if(selected=='zdyOption'){
                              // console.log($(this).parents('.modal').find('th').eq(i).next().attr("class"));
                              // console.log($(this).parents('.modal').find('th').eq(i).next().find('.menuName').attr("placeholder"));
                              // console.log($(this).parents('.modal').find('th').eq(i).next().find('.jumpType').attr("class"));//2019
                              // - 03 - 05新增
                              var aText = $(this).parents('.modal').find('th').eq(i+1).next().find('.menuName').val();
                              var aUrl = '';// 链接地址（包含广告名称，聚合页名称）
                              var aUrlName = '';// 广告名称
                              var checkRadio = $(this).parents('.modal').find('th').next().find('.jumpType').find("input[name=linkType"+(i+1)+"]:checked").val();
                              if(checkRadio.indexOf("lj") != -1){// 连接地址
                                  aUrl = $(this).parents('.modal').find('th').eq(i+1).next().find('.jumpType').find('#ljInput'+checkRadio.substring(checkRadio.length-1)).find('input').val();
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('url',aUrl);
                              }else if(checkRadio.indexOf("gg") != -1){// 广告地址
                                  aUrl = $(this).parents('.modal').find('th').eq(i+1).next().find('.jumpType').find('#ggInput'+checkRadio.substring(checkRadio.length-1)).find('input').val();
                                  aUrlName = $(this).parents('.modal').find('th').eq(i+1).next().find('.jumpType').find('.staticurlname'+(i+1)).html();
                              }else if(checkRadio.indexOf("jhy") != -1){// 聚合页地址
                                  aUrl = $(this).parents('.modal').find('th').eq(i+1).next().find('.jumpType').find('#jhyInput'+checkRadio.substring(checkRadio.length-1) + ' option:selected').attr("turnHref");
                              }
                              if(aText != ''&& aUrl != ''){
                                  if(aUrl.indexOf("decorateId=") != -1){// 聚合页跳转
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindturnhrefimage','bindturnhrefimage');
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('url',aUrl)
                                  } else {
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('bindturnhrefimage');
                                  }
                                  if(aUrl.indexOf("adid") != -1){// 广告id跳转
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('staticname',aUrlName);
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('staticAdinfo',"staticAdinfo");
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('adinfo',aUrl);
                                  }else{
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('staticName');
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('staticAdinfo');
                                      $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('adinfo');
                                  }
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('p').text(aText);
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').prop('href','javascript:void(0)');
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('onclick',"javascript:addToProductStore.executeFvsStatcAdid('"+aUrl+"','1',this,'02','','1')");
                              }else{
                                  alert("请输入菜单名称和链接地址！");
                                  return;
                                  // $(thisClickObj).find('.myview
                                  // .swiper-slide').eq(i).find('a').prop('href','javascript:void(0)');
                              }
                            }else{
                              $(thisClickObj).find('.myview .swiper-slide').eq(i).find('p').text(selectedText);
                              $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('staticName');
                              $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('staticAdinfo');
                              $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('adinfo');
                              $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('url');
                              $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('onclick');
                              $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').removeAttr('bindturnhrefimage');
                            };
                            $(thisClickObj).find('.myview .swiper-slide img').eq(i).prop('src',imgSrc);
                            $(thisClickObj).find('.myview .swiper-slide a').eq(i).prop('href','javascript:void(0)');
                            var pText = $('.selector1p p').eq(i).text();
                            if(selected!='zdyOption'){
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
                                  $('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data5']").prop("selected",true);
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data5')
                                  break;
                                  case '终端':
                                  $('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data6']").prop("selected",true);
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data6')
                                  break;
                                  case '应用推荐':
                                  $('.selector1p p').eq(i).next('.bottomSelect').find("option[value='data7']").prop("selected",true);
                                  $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('bindType','data7')
                                  break;
                              }
                            }
                            /**
                             * * add by dingchuan 20190704
                             * 441-YH19070202优化装修页面各广告位插码的需求 start **
                             */
                            $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('goodCodeInput',goodCodeInputValue);
                            $(thisClickObj).find('.myview .swiper-slide').eq(i).find('a').attr('goodcodeinputsign','goodcodeinputsign');
                            /**
                             * * add by dingchuan 20190704
                             * 441-YH19070202优化装修页面各广告位插码的需求 end ****
                             */
                        }
                        
                    }else if(type=="bottomNav"){// 底部导航
                        var selectLength = $(this).parents('.modals').find('#htmlCon .bottomSelect').length;
                        var liHtml='';
                        for(var i=0;i<selectLength;i++){
                            var selected = $(this).parents('.modal').find('.selectType select').eq(i).find("option:selected").val(); 
                            var selectedText = $(this).parents('.modal').find('.selectType').eq(i).find("p").text(); 
                            var classname = $(this).parents('.modal').find('.selectType').eq(i).find(" select option:selected").attr('bindclass');
                            var bind = $(this).parents('.modal').find('.selectType').eq(i).find(" select option:selected").attr('bind');
                            
                            var dbdh_ggwbm = $(this).parents('.modal').find('.div_ggwbm').eq(i).find(".dbdh_ggwbm").val();
                            if(!dbdh_ggwbm){
                            	alert("请输入广告位编码！");
                            	return;
                            }
                            console.log(classname)
                            var goldenFishMdl = $(this).parents('.modal').find("dl[class='tableDl goldenFishEs']").eq(i).find("select option:selected").val();

                            $(thisClickObj).find('.navbottom-box li').eq(i).find('a').attr('bindType',selected)
                            var aUrl = '';// 链接地址（包含广告名称，聚合页名称）
                            if(selected=='zdyOption' || selected=='goldenFishBottom'){
                              
                              var checkRadio = $(this).parents('.modal').find('.jumpType').eq(i).find("input[type=radio]:checked").val();
                              if(checkRadio.indexOf("lj") != -1){// 连接地址
                                  aUrl = $(this).parents('.modal').find('.jumpType').eq(i).find(".ljInput").find('input').val();
                              }else if(checkRadio.indexOf("jhy") != -1){// 聚合页地址
                                  aUrl = $(this).parents('.modal').find('.jumpType').eq(i).find(".jhyInput").find("select option:selected").attr("turnHref");
                              }
                              if(!aUrl){
                                  alert("请输入跳转地址！");
                                  return;
                              }
                            }
                            liHtml += "<li class='"+classname;
                            if(i == 0){
                            	liHtml += " active ";
                            }
                           // liHtml += " '><a href='javascript:void(0)' bindType="+selected+" bind="+bind;
                            if(aUrl){
                            	if(aUrl.indexOf("decorateId=") != -1){// 聚合页跳转
                            		liHtml += " ' onclick=" + "javascript:addToProductStore.executeFvsStatcAdid('"+aUrl+"&classname="+classname+"','1',this,'02','','1','"+goldenFishMdl+"')><a href='javascript:void(0)' goldenFishMdl="+goldenFishMdl+" bindType="+selected+" bind="+bind;
                            		liHtml += " decorateId='decorateId'  bindturnhrefimage='bindturnhrefimage' ";
                            		//liHtml += " url="+aUrl+ " onclick=" + "javascript:addToProductStore.executeFvsStatcAdid('"+aUrl+"&classname="+classname+"','1',this,'02','','1')";
                            		liHtml += " url="+aUrl+ " ";
                            	} else {
                            		liHtml += " '  onclick=" + "javascript:addToProductStore.executeFvsStatcAdid('"+aUrl+"','1',this,'02','','1','"+goldenFishMdl+"') ><a href='javascript:void(0)' bindType="+selected+" goldenFishMdl="+goldenFishMdl+" bind="+bind;
                            		liHtml += " url="+aUrl+ " ";
                            	}
                            	
                            }else{
                            	liHtml += " '><a href='javascript:void(0)' bindType="+selected+" goldenFishMdl="+goldenFishMdl+" bind="+bind;
                            	if(bind.indexOf("wtfk")!=-1){
                            		 liHtml += " url=decorateId="+vm.id;
                            	}
                            }
                            liHtml += " goodcodeinputsign='goodcodeinputsign' goodCodeInput='" + dbdh_ggwbm + "'>"+selectedText+"</a></li>";
                            $('.demo .navbottom-box ul').html(liHtml);
                        }
                        
                        var linkHref = $(this).parents('.modal').find('.zdyInput input').val();
                        
                    }else if(type=="sortGg"){// 排名广告
                        var selected = $(this).parents('.modal').find('.selectType select').find("option:selected").val(); 
                        $(thisClickObj).find('.sortGg img').eq(0).prop('src',imgSrc);
                        $(thisClickObj).find('.sortGg').eq(0).attr('bindType',selected);
                        $(thisClickObj).find('.sortGg a').eq(0).attr('href','javascript:void(0)');
                        $(thisClickObj).find('.sortGg').eq(0).attr('bind',selected);
                        var goodCodeInput = $(this).parents('.modal ').find('.goodcodeinputsign').val(); 
                        if(goodCodeInput == '' || goodCodeInput == null || goodCodeInput == undefined ){
                            alert("请输入广告位编码！");
                            return;
                        }
                        $(thisClickObj).find('.sortGg a').attr('goodCodeInput',goodCodeInput);
                        $(thisClickObj).find('.sortGg a').attr('goodcodeinputsign','goodcodeinputsign');
                    }else if(type=="goodsPL"){
                        var goodCodeInputValue = $('#htmlCon table').find('#goodCodeInput').val();
                        if(goodCodeInputValue == '' || goodCodeInputValue == null || goodCodeInputValue == undefined ){
                            alert("请输入广告位编码！");
                            return;
                        }
                        var imgSrc = $('#htmlCon table').find('.title_url').text();
                        $(thisClickObj).find('.goodsImage img').prop('src',imgSrc);

                        var bqImgSrc = $('#htmlCon table').find('.bq_title_url').text();
                        if(bqImgSrc){
                            if($(thisClickObj).find('.bqli').length >0){
                                $(thisClickObj).find('.goodsImage .bqli').remove();
                            }
                            var a = '<li style="font-size: 0;" class="bqli"><img class="bind" bind="img_id110_src" src="'+bqImgSrc+'" alt="" index-src="'+bqImgSrc+'"></li>';
                            $(thisClickObj).find('.goodsImage ul').prepend(a);
                        }else{
                            if($(thisClickObj).find('.bqli').length >0){
                                $(thisClickObj).find('.goodsImage .bqli').remove();
                            }
                        }

                    /*
                     * that.parent().parent().find('.editing').attr('goodCodeInput',goodCodeInput);
                     * that.parent().parent().find('.editing').attr('goodcodeinputsign','goodcodeinputsign');
                     * that.parent().parent().find('.editing').attr('bind',selectedVal);
                     */
                        $(thisClickObj).find('.goodsImage a').attr('goodCodeInput',goodCodeInputValue);
                        $(thisClickObj).find('.goodsImage a').attr('goodcodeinputsign','goodcodeinputsign');
                        $(thisClickObj).find('.goodsImage a').prop('href','javascript:void(0)');
                    }else if(type=="goodsYW"){
                        var BusinessimageName=$("#BusinessimageName").val();
                        var SuccessimageName=$("#SuccessimageName").val();
                        var FailureimageName=$("#FailureimageName").val();
                        var payFailImageName=$("#payFailimageName").val();
                        var paySuccessImageName=$("#paySuccessimageName").val();
                        var imgSrc = $('#htmlCon table').find('.title_url').text();
                        $(thisClickObj).find('.Processing img').prop('src',imgSrc);
                        if(BusinessimageName==null||BusinessimageName==''||BusinessimageName==undefined){
                        	alert("请上传业务受理图片");
                        	return
                        }
                        if(SuccessimageName==null||SuccessimageName==''||SuccessimageName==undefined){
                        	alert("请上传业务办理成功图片");
                        	return
                        }
                        if(FailureimageName==null||FailureimageName==''||FailureimageName==undefined){
                        	alert("请上传业务办理失败图片");
                        	return
                        }
                        if(payFailImageName==null||payFailImageName==''||payFailImageName==undefined){
                        	alert("请上传支付失败图片");
                        	return
                        }
                        if(paySuccessImageName==null||paySuccessImageName==''||paySuccessImageName==undefined){
                        	alert("请上传支付成功图片");
                        	return ;
                        }
                        
                        var id=vm.id;
                        jQuery.ajax({
                            url:vm.path+"/tWlmDecorate/updateYWImage.do" ,
                            type:'POST',
                            data:{"decorateimageName1":BusinessimageName,"decorateimageName2":SuccessimageName,"decorateimageName3":FailureimageName,"id":id,"payFailImageName":payFailImageName,"paySuccessImageName":paySuccessImageName},
                            dataType:'json',
                            success:function(data){
                              console.log(data);
                              if(data.flag==true){
                                  alert("保存成功");
                                  jQuery.ajax({
                                      url :vm.path + "/tWlmDecorate/tWlmUpdateIndex.do",
                                      type:'POST',
                                      data:{'id':id},
                                      
                                      dataType:'json',
                                      success:function(data){
                                          vm.decorate=data.decorate;
                                      }
                                  });
                              }
                            }
                        });
                    }else if(type=="goodsQGL"){
                        var goodsInputCode = $('#htmlCon table').find('.goodcodeinputsign').val();
                        if(!goodsInputCode){
                        	alert("请输入广告位编码！");
                            return;
                        }
                        var imgSrc = $('#htmlCon table').find('.title_url').text();
                        $(thisClickObj).find('.Processing img').attr('goodcodeinputsign', "goodcodeinputsign");
                        $(thisClickObj).find('.Processing img').attr('goodCodeInput',goodsInputCode);
                        $(thisClickObj).find('.Processing img').prop('src',imgSrc);
                    }else if(type=="goodsEWM"){
                        var goodsInputCode = $('#htmlCon table').find('.goodcodeinputsign').val();
                        if(!goodsInputCode){
                            alert("请输入广告位编码！");
                            return;
                        }
                        var imgSrc = $('#htmlCon table').find('.title_url').text();
                        $(thisClickObj).find('.Processing img').attr('goodcodeinputsign', "goodcodeinputsign");
                        $(thisClickObj).find('.Processing img').attr('goodCodeInput',goodsInputCode);
                        $(thisClickObj).find('.Processing img').prop('src',imgSrc);
                    }else if (type=="shopInfo") {
                        var goodsInputCode = $('#htmlCon table').find('.goodcodeinputsign').val();
                        if(!goodsInputCode){
                            alert("请输入广告位编码！");
                            return;
                        }
                        var imgSrc = $('#htmlCon table').find('.title_url').text();
                        $(thisClickObj).find('.shopInfoConBg img').attr('goodcodeinputsign', "goodcodeinputsign");
                        $(thisClickObj).find('.shopInfoConBg img').attr('goodCodeInput',goodsInputCode);
                        $(thisClickObj).find('.shopInfoConBg img').prop('src',imgSrc);
                    }else if(type=="zhuancj"){//转盘抽奖
                        editor.sync();//富文本数据同步到text area
                        var selected = $(this).parents('.modal').find('.myinput').val();
                        if(selected == '' || selected == undefined){alert("请选择活动编号！");return ;}
                        $.ajax({
                            url:vm.path+"/tWlmDecorate/queryActiveInfo.do",
                            type:"post",
                            data:{activeNo:selected},
                            success:function (data) {
                                if(data.code == 'fail'){
                                    alert(data.msg);
                                    return ;
                                }
                            },
                            error:function () {
                                alert("校验活动状态失败");
                                return;
                            }
                        });
                        var activeTitle = $("#activeTitle").val();
                        if(activeTitle == '' || activeTitle == undefined){alert("请填写活动标题！");return ;}
                        if(activeTitle.length>16){alert("活动标题不能大于16个字！");return ;}
                        var actBackImg = $("#actBackImg").text();//活动背景图
                        var centerBtn = $("#centerBtn").text();//抽奖按钮图
                        if(centerBtn == '' || centerBtn == undefined){alert("请上传抽奖按钮图！");return ;}
                        var ruleImg = $("#ruleImg").text();//活动说明按钮图
                        if(ruleImg == '' || ruleImg == undefined){alert("请上传活动说明按钮图！");return ;}
                        var ruleBackImg = $("#ruleBackImgP").text();//活动说明弹窗背景图
                        var ruleTitle = $("#ruleTitle").val();//活动说明标题
                        if(ruleTitle == '' || ruleTitle == undefined){alert("请填写活动说明标题！");return ;}
                        if(ruleTitle.length>10){alert("活动说明标题不能大于10个字！");return ;}
                        var activeDesc = $("#descriptiona").val();//活动说明
                        if(activeDesc == '' || activeDesc == undefined){alert("请填写活动说明！");return ;}
                        if(activeDesc.length>1000){alert("活动说明不能大于1000个字！");return ;}
                        console.log(actBackImg,ruleImg,ruleBackImg,centerBtn);
                        $(thisClickObj).find("#zhuanpan").attr("actno",selected);
                        $(thisClickObj).find(".turnplateTitle").html(activeTitle);
                        if(actBackImg != '' && actBackImg != undefined){$(thisClickObj).find(".turntable").attr("style","background-image:url('"+actBackImg+"')");}
                        else {$(thisClickObj).find(".turntable").attr("style","background-image:none;");}
                        if(centerBtn != '' && centerBtn != undefined){$(thisClickObj).find(".game-start").find("img").attr("src",centerBtn);}
                        if(ruleImg != '' && ruleImg != undefined){$(thisClickObj).find(".turnplateRule").find("img").attr("src",ruleImg);}
                        if(ruleBackImg != '' && ruleBackImg != undefined){$(thisClickObj).find(".wincj").attr("style","background-image:url('"+ruleBackImg+"')");}
                        else {$(thisClickObj).find(".wincj").attr("style","background-image:none;");}
                        $(thisClickObj).find(".winTitle").html(ruleTitle);
                        $(thisClickObj).find(".winCont").html(activeDesc);
                    }else if(type=="userMsgInfo"){//卖家信息保存
                        var goodcodeinput = $("#goodcodeinputMsg").val();//广告位编码
                        var msgBk = $("#msgBk").text();
                        if(!msgBk){alert("请上传背景图片！");return;}
                        var msgHead = $("#msgHead").text();
                        if(!msgHead){alert("请上传头像图片！");return;}
                        var goodcodeinputOpt1 = $("#goodcodeinputOpt1").val();
                        var msgOptName1 = $("#msgOptName1").val();
                        if(!msgOptName1){alert("请输入操作1文案！");return;}
                        if(msgOptName1.length>4){alert("操作1文案不能超过4个字！");return;}
                        var msgOpt1 = $("#msgOpt1").text();
                        if(!msgOpt1){alert("请上传操作1图标！");return;}
                        var msgOptSec1 = $("#msgOptSec1").val();//操作类型
                        var goodcodeinputOpt2 = $("#goodcodeinputOpt2").val();
                        var msgOptName2 = $("#msgOptName2").val();
                        if(!msgOptName2){alert("请输入操作2文案！");return;}
                        if(msgOptName2.length>4){alert("操作2文案不能超过4个字！");return;}
                        var msgOpt2 = $("#msgOpt2").text();
                        if(!msgOpt2){alert("请上传操作2图标！");return;}
                        var msgOptSec2 = $("#msgOptSec2").val();//操作类型
                        var goodcodeinputOpt3 = $("#goodcodeinputOpt3").val();
                        var msgOptName3 = $("#msgOptName3").val();
                        if(!msgOptName3){alert("请输入操作3文案！");return;}
                        if(msgOptName3.length>4){alert("操作3文案不能超过4个字！");return;}
                        var msgOpt3 = $("#msgOpt3").text();
                        if(!msgOpt3){alert("请上传操作3图标！");return;}
                        var msgOptSec3 = $("#msgOptSec3").val();//操作类型
                        var goodcodeinputOpt4 = $("#goodcodeinputOpt4").val();
                        var msgOptName4 = $("#msgOptName4").val();
                        if(!msgOptName4){alert("请输入操作4文案！");return;}
                        if(msgOptName4.length>4){alert("操作4文案不能超过4个字！");return;}
                        var msgOpt4 = $("#msgOpt4").text();
                        if(!msgOpt4){alert("请上传操作4图标！");return;}
                        var msgOptSec4 = $("#msgOptSec4").val();//操作类型
                        //组件赋值
                        $(thisClickObj).attr("goodcodeinput",goodcodeinput);//元素整体插码值
                        $(thisClickObj).find(".contanierUserYa ").attr("style","background:url("+msgBk+") no-repeat;background-size: 100% 100%;");//元素背景图
                        $(thisClickObj).find(".topLeftImg img").attr("src",msgHead);//头像图片
                        //操作按钮赋值
                        $(thisClickObj).find(".bottomPart").find("div").each(function (i,v) {
                            console.log(i,v);
                            if(i === 0){
                                $(v).attr("onclick","funSellerInfoOpt(this)");//赋值点击方法
                                $(v).attr("goodcodeinput",goodcodeinputOpt1);//操作1插码值
                                $(v).attr("optType",msgOptSec1);//操作1类型
                                $(v).find("span").text(msgOptName1);//操作1文案
                                $(v).find("img").attr("src",msgOpt1);//操作1图标
                            }
                            if(i === 1){
                                $(v).attr("onclick","funSellerInfoOpt(this)");//赋值点击方法
                                $(v).attr("goodcodeinput",goodcodeinputOpt2);//操作2插码值
                                $(v).attr("optType",msgOptSec2);//操作2类型
                                $(v).find("span").text(msgOptName2);//操作2文案
                                $(v).find("img").attr("src",msgOpt2);//操作2图标
                            }
                            if(i === 2){
                                $(v).attr("onclick","funSellerInfoOpt(this)");//赋值点击方法
                                $(v).attr("goodcodeinput",goodcodeinputOpt3);//操作3插码值
                                $(v).attr("optType",msgOptSec3);//操作3类型
                                $(v).find("span").text(msgOptName3);//操作3文案
                                $(v).find("img").attr("src",msgOpt3);//操作3图标
                            }
                            if(i === 3){
                                $(v).attr("onclick","funSellerInfoOpt(this)");//赋值点击方法
                                $(v).attr("goodcodeinput",goodcodeinputOpt4);//操作4插码值
                                $(v).attr("optType",msgOptSec4);//操作4类型
                                $(v).find("span").text(msgOptName4);//操作4文案
                                $(v).find("img").attr("src",msgOpt4);//操作4图标
                            }
                        })
                    }else if(type=="personalCard"){
                        var bkImg = $("#bkImg").text();//背景
                        if(!bkImg){alert("请上传背景图片！");return;}
                        var headImg = $("#headImg").text();//头像
                        var ewmBtnImg = $("#ewmBtnImg").text();//微信分享按钮
                        var pCardA = $("input[name='pCardA']:checked").val();//是否显示头像
                        if(pCardA == '1'){if(!headImg){alert('请上传头像');return ;}}
                        var pCardC = $("input[name='pCardC']:checked").val();//是否显示微信分享
                        if(pCardC == '1'){if(!ewmBtnImg){alert('请上传二维码图标');return ;}}
                        var activeTitle = $("#activeTitle").val();//微信分享右侧说明
                        if(pCardC == '1'){if(!activeTitle){alert('请填写二维码提示文案');return ;}}
                        //组件赋值
                        $(thisClickObj).find('.contanierShareTopYa').attr("style","background:url("+bkImg+") no-repeat;background-size: 100% 100%;");//元素背景图
                        $(thisClickObj).find('.leftShareUserMsg img').attr("src",headImg);//头像
                        $(thisClickObj).find('.rightShareImg img').attr("src",ewmBtnImg);//二维码图标
                        $(thisClickObj).find('.rightShareImg span').text(activeTitle);//二维码图标
                    }
                }
            }else if($('#htmlCon2').css("display") == 'block'){// html
                a.html("");
                a = a.append($(this).parents().find("textarea").val());
                that.parent().parent().append(a);
            };
            $('#htmlCon2 #teAre').remove();
            
            fadeOut();
            return false;
        });
        
        var jxtjData1="<tr class='clxqq' id='policypp0'><td><input type='checkbox' name='ioppp'></td><td id='xuhaoCount'>1</td><td>      <div>         <dl>              <dt>策划ID:</dt>            <dd>                  <input type='hidden' name='policyId' id='policyId'>                   <input type='text' placeholder='请输入策划ID' name='planId' id='planId' autocomplete='off' οnkeyup='this.value=this.value.replace(/[^\d\,]/g,'')'>                 <span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span>            </dd>         </dl>     </div>    <div>         <dl>              <dt>图片:</dt>              <dd>                  <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='iconListpp0imagesZw'>                <img src='' alt='' class='iconListpp0imgPerview'>                 <p class='opacityP' id='iconListpp0opacityP'>上传图片</p>                 <input type='hidden' name='iconListppimageName' id='iconListpp0imageName' >                 <input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconListpp0' >               </div>                <span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div>    <div>         <dl>              <dt>跳转地址:</dt>            <dd>                  <input type='hidden' name='jumpType' id='peizhijumpType'>                 <input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' autocomplete='off'>                 <span class='jhsp ad' id='jhsp0'  >选择广告/聚合页</span>    <input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'>        </dd>         </dl>     </div> <div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtoniop0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtoniop0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>   <div>         <dl>              <dt>展示权重:</dt>            <dd>                  <input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' autocomplete='off'>             </dd>         </dl>     </div>    <div>         <dl>              <dt>有效时间:</dt>            <dd class='yxsjdd'>               <input id='startTimepp' name='startTimepp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" autocomplete='off'/> ~ <input id='endTimepp' name='endTimepp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" />              </dd>         </dl>     </div></td> <td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunpp(0)'>保存</a></td>                         </tr>"
        var jxtjData2="<tr class='clxqq'  id='policybuweipp0'><td><input type='checkbox' name='buweipp'></td>                             <td>1</td><td>      <div >        <dl>              <dt>图片:</dt>              <dd>                  <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='buweiiconListpp0imagesZw'>               <img src='' alt='' class='buweiiconListpp0imgPerview'>                <p class='opacityP' id='buweiiconListpp0opacityP'>上传图片</p>                <input type='hidden' name='policyId' id='policyId'>                   <input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconListpp0'>               <input type='hidden' name='buweiiconListppimageName' id='buweiiconListpp0imageName' >                 </div>                <span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div >   <div>         <dl>              <dt>跳转地址:</dt>            <dd>                  <input type='hidden' name='jumpType' id='peizhijumpType'>                 <input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress'>               <span class='jhsp ad' id='jhsp0'>选择广告/聚合页</span>   <input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'>           </dd>         </dl>     </div> <div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtoniopbuwei0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtoniopbuwei0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>   <div>         <dl>              <dt>展示权重:</dt>            <dd>                  <input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights'>            </dd>         </dl>     </div>    <div>         <dl>              <dt>有效时间:</dt>            <dd class='yxsjdd'>               <input id='startTime1pp' name='startTime1pp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value='' /> ~ <input id='endTime1pp' name='endTime1pp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value='' />            </dd>         </dl>     </div></td> <td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuweipp(0)'>保存</a></td>                           </tr>"
        var jxtjData3="<tr class='clxqq' id='policy0'><td><input type='checkbox' name='iop'></td>                             <td id='xuhaoCount'>1</td><td>      <div  >       <dl>              <dt>配置类型:</dt>            <dd>                  <select id='ConfigType' name='ConfigType' onchange='changeTiaoZhuan(0)'>                          <option value='1'>广告</option>                         <option value='2'>商品</option>                 </select>             </dd>         </dl>     </div>    <div>         <dl>              <dt>策划ID:</dt>            <dd>                  <input type='hidden' name='policyId' id='policyId'>                   <input type='text' placeholder='请输入策划ID' name='planId' id='planId' autocomplete='off' οnkeyup='this.value=this.value.replace(/[^\d\,]/g,'')'>                 <span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span>            </dd>         </dl>     </div>    <div>         <dl>              <dt>图片:</dt>              <dd><div style='overflow:hidden;'>                  <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='iconList0imagesZw'>                  <img src='' alt='' class='iconList0imgPerview'>               <p class='opacityP' id='iconList0opacityP'>上传图片</p>               <input type='hidden' name='iconListimageName' id='iconList0imageName' >               <input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconList0' >                 </div> <a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('iconList0');showid('ts_ljzs')"+" id='iconListfl0' title='图片'>预览</a></div>               <span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div>    <div  >       <dl>              <dt>档位介绍图片:</dt>              <dd> <div style='overflow:hidden;'>                 <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='introductioniconList0imagesZw'>                  <img src='' alt='' class='introductioniconList0imgPerview'>               <p class='opacityP' id='introductioniconList0opacityP'>上传图片</p>           <input type='hidden' name='introductioniconList0imageName' id='introductioniconList0imageName' autocomplete='off'>                <input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2)' name='UploadBtn' id='introductioniconList0'>                  </div> <a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('introductioniconList0');showid('ts_ljzs')"+" id='introductioniconListfl0' title='图片'>预览</a></div>               <span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div>    <div>         <dl>              <dt>跳转地址:</dt>            <dd>                  <input type='hidden' name='jumpType' id='peizhijumpType'>                 <input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' autocomplete='off'>                 <span class='jhsp ad' id='jhsp0'  >选择广告/聚合页</span>  <input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'>          </dd>         </dl>     </div>    <div>         <dl>              <dt>展示权重:</dt>            <dd>                  <input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' autocomplete='off'>             </dd>         </dl>     </div>    <div>         <dl>              <dt>有效时间:</dt>            <dd class='yxsjdd'>               <input id='startTime' name='startTime' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" autocomplete='off'/> ~ <input id='endTime' name='endTime' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" />              </dd>         </dl>     </div>    <div  >       <dl>              <dt>是否显示下一步按钮:</dt>           <dd class=''>             <input type='radio' name='isShowButtoniop0' class='rin'   value='0'/><label for='ifyc1' class='rlb'>是</label>             <input type='radio' name='isShowButtoniop0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>否</label>              </dd>         </dl>     </div> <div class='anwzF'> <dl> <dt>按钮位置:</dt> <dd>  <div id='anwzF'> <input type='radio' name='anwz0' value='y' class='anwz' /><label for='anwz1'>中间</label>  <input type='radio' name='anwz0' value='n'  class='anwz' checked/><label for='anwz2'>底部</label>  </div> </dd> </dl> </div> <div class='dbzsF'> <dl> <dt>底部展示:</dt> <dd>  <div id='anwzF'> <input type='radio' name='dbzs0' value='y' class='anwz' checked/><label for='anwz1'>固定</label>  <input type='radio' name='dbzs0' value='n'  class='anwz'/><label for='anwz2'>悬浮（仅按钮位置底部可用）</label>  </div> </dd> </dl></div>   <div  >       <dl>              <dt>下一步按钮跳转:</dt>             <dd class='yxsjdd'><div style='overflow:hidden;'>           <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='NextList0imagesZw'>                  <img src='' alt='' class='NextList0imgPerview'>               <p class='opacityP' id='NextList0opacityP'>上传图片</p>               <input type='hidden' name='NextListimageName' id='NextList0imageName'>                <input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='NextList0'>                  </div> <a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('NextList0');showid('ts_ljzs')"+" id='NextListfl0' title='图片'>预览</a></div>               <span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div>    <div  >       <dl>              <dt>下一步按钮跳转:</dt>             <dd class='yxsjdd'>               <input type='radio' name='NextButtoniop0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>二次确认页</label>            <input type='radio' name='NextButtoniop0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>原二次确认页</label>           </dd>         </dl>     </div>  <div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtonLbiop0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtonLbiop0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>  <div  >       <dl>              <dt>二次确认页图片:</dt>             <dd class='yxsjdd'><div style='overflow:hidden;'>           <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='SecondaryList0imagesZw'>                 <img src='' alt='' class='SecondaryList0imgPerview'>                  <p class='opacityP' id='SecondaryList0opacityP'>上传图片</p>                  <input type='hidden' name='SecondaryListimageName' id='SecondaryList0imageName'>                  <input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='SecondaryList0'>                 </div> <a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('SecondaryList0');showid('ts_ljzs')"+" id='SecondaryListfl0' title='图片'>预览</a></div>               <span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div>    <div  >       <dl>              <dt>二次确认办理按钮:</dt>            <dd class='yxsjdd'><div style='overflow:hidden;'>           <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='handleList0imagesZw'>                <img src='' alt='' class='handleList0imgPerview'>                 <p class='opacityP' id='handleList0opacityP'>上传图片</p>                 <input type='hidden' name='handleListimageName' id='handleList0imageName'>                <input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='handleList0'>                </div>   <a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('handleList0');showid('ts_ljzs')"+" id='handleListfl0' title='图片'>预览</a></div>             <span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div></td> <td><a href='javascript:;' class='submitted saven' onclick='savePolicyFun(0)'>保存</a></td>                           </tr>"
        var jxtjData4="<tr class='clxqq'  id='policybuwei0'>  <td><input type='checkbox' name='buwei'></td>   <td>1</td><td>      <div  >       <dl>              <dt>配置类型:</dt>            <dd>                  <select id='ConfigType' name='ConfigType' onchange='changeTiaoZhuan(0)'>                          <option value='1'>广告</option>                         <option value='2'>商品</option>                 </select>             </dd>         </dl>     </div>    <div >        <dl>              <dt>图片:</dt>              <dd> <div style='overflow:hidden;'>                 <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='buweiiconList0imagesZw'>                 <img src='' alt='' class='buweiiconList0imgPerview'>                  <p class='opacityP' id='buweiiconList0opacityP'>上传图片</p>                  <input type='hidden' name='buweipolicyId' id='buweipolicyId'>                 <input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconList0'>                 <input type='hidden' name='buweiiconListimageName' id='buweiiconList0imageName' >                 </div> <a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiiconList0');showid('ts_ljzs')"+" id='buweiiconListfl0' title='图片'>预览</a></div>               <span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div >   <div  >       <dl>              <dt>档位介绍图片:</dt>              <dd>  <div style='overflow:hidden;'>                <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='buweiintroductionList0imagesZw'>                 <img src='' alt='' class='buweiintroductionList0imgPerview'>                  <p class='opacityP' id='buweiintroductionList0opacityP'>上传图片</p>                  <input type='hidden' name='buweiintroductionListimageName' id='buweiintroductionList0imageName'>                  <input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2)' name='UploadBtn' id='buweiintroductionList0'>                 </div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiintroductionList0');showid('ts_ljzs')"+" id='buweiintroductionListfl0' title='图片'>预览</a></div>                <span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div>    <div>         <dl>              <dt>跳转地址:</dt>            <dd>                  <input type='hidden' name='jumpType' id='peizhijumpType'>                 <input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress'>               <span class='jhsp ad' id='jhsp0'>选择广告/聚合页</span>     <input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'>         </dd>         </dl>     </div>    <div>         <dl>              <dt>展示权重:</dt>            <dd>                  <input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights'>            </dd>         </dl>     </div>    <div>         <dl>              <dt>有效时间:</dt>            <dd class='yxsjdd'>               <input id='startTime1' name='startTime1' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value='' /> ~ <input id='endTime1' name='endTime1' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value='' />            </dd>         </dl>     </div>    <div  >       <dl>              <dt>是否显示下一步按钮:</dt>           <dd>              <input type='radio' name='isShowButtonbuwei0'  class='rin'  value='0'/><label for='ifyc1' class='rlb'>是</label>               <input type='radio' name='isShowButtonbuwei0'  class='rin'  checked value='1'/><label for='ifyc1' class='rlb'>否</label>               </dd>         </dl>     </div>  <div class='anwzF'> <dl> <dt>按钮位置:</dt> <dd>  <div id='anwzF'> <input type='radio' name='anwz0' value='y' class='anwz' /><label for='anwz1'>中间</label>  <input type='radio' name='anwz0' value='n'  class='anwz' checked/><label for='anwz2'>底部</label>  </div> </dd> </dl> </div> <div class='dbzsF'> <dl> <dt>底部展示:</dt> <dd>  <div id='anwzF'> <input type='radio' name='dbzs0' value='y' class='anwz' checked/><label for='anwz1'>固定</label>  <input type='radio' name='dbzs0' value='n'  class='anwz'/><label for='anwz2'>悬浮（仅按钮位置底部可用）</label>  </div> </dd> </dl></div>  <div  >       <dl>              <dt>下一步按钮跳转:</dt>             <dd class='yxsjdd'>  <div style='overflow:hidden;'>             <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='buweiNextList0imagesZw'>                 <img src='' alt='' class='buweiNextList0imgPerview'>                  <p class='opacityP' id='buweiNextList0opacityP'>上传图片</p>                  <input type='hidden' name='buweiNextListimageName' id='buweiNextList0imageName'>                  <input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiNextList0'>                 </div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiNextList0');showid('ts_ljzs')"+" id='buweiNextListfl0' title='图片'>预览</a></div>                <span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div>    <div  >       <dl>              <dt>下一步按钮跳转:</dt>             <dd class='yxsjdd'>               <input type='radio' name='NextButtonbuwei0'  class='rin'  value='0'/><label for='ifyc1'  class='rlb'>二次确认页</label>            <input type='radio' name='NextButtonbuwei0'  class='rin'  checked value='1'/><label for='ifyc2'  class='rlb'>原二次确认页</label>           </dd>         </dl>     </div> <div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtonLbiopbuwei0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtonLbiopbuwei0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>   <div  >       <dl>              <dt>二次确认页图片:</dt>             <dd class='yxsjdd'>  <div style='overflow:hidden;'>             <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='buweiSecondaryList0imagesZw'>                <img src='' alt='' class='buweiSecondaryList0imgPerview'>                 <p class='opacityP' id='buweiSecondaryList0opacityP'>上传图片</p>                 <input type='hidden' name='buweiSecondaryListimageName' id='buweiSecondaryList0imageName'>                <input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiSecondaryList0'>                </div>  <a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiSecondaryList0');showid('ts_ljzs')"+" id='buweiSecondaryListfl0' title='图片'>预览</a></div>              <span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div>    <div  >       <dl>              <dt>二次确认办理按钮:</dt>            <dd class='yxsjdd'>      <div style='overflow:hidden;'>         <div class='uploadImg normalData'>                <img src='../../images/images.png' alt='' class='buweihandleList0imagesZw'>               <img src='' alt='' class='buweihandleList0imgPerview'>                <p class='opacityP' id='buweihandleList0opacityP'>上传图片</p>                <input type='hidden' name='buweihandleListimageName' id='buweihandleList0imageName'>                  <input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweihandleList0'>               </div>  <a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweihandleList0');showid('ts_ljzs')"+" id='buweihandleListfl0' title='图片'>预览</a></div>              <span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span>              </dd>         </dl>     </div></td> <td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuwei(0)'>保存</a></td>                         </tr>"
        
        
        function saveshowggjh(a){
             var sss=$(a).parents("tr").find("#planId").val();
             console.log(sss);
        }


        // iop补位保存


        // iop批量删除
        $('.cspzedit-layer').on('click','.iop-edit1 .alldel',function(e){
            var xzcd = $("#htmlConCspz .cont_box").find("table tbody").children("tr");
            var xzin = $("#htmlConCspz .cont_box").find("table tbody").children("tr").children("td:first-child").children("input:checked");// 遍历tr
            var ii=0;
            var obj=document.getElementsByName('iop');
            var ids="";
            for(var i=0; i<obj.length; i++){ 
                if(obj[i].checked){
                    if(i < obj.length){
                        ids+=obj[i].value+','; 
                    }
                } 
            }
            if(ids!=null&&ids!=""&&ids!=undefined){
                ids = ids.substring(0,ids.length-1);
                $.ajax({
                    type : "post",
                    url : vm.path+"/tWlmDecorate/deletePolicy.do",
                    data :{"ids":ids},
                    dataType:'json',
                    success : function(data) {
                        if(data.flag==true){
                            toast("删除成功");// 改成小黑窗
                        }else{
                            toast("网络故障");// 改成小黑窗
                        }
                        
                    }
                });
            }
            
            $.each(xzin,function(i,eleName){// 遍历选中的个数删除
                var deldata = $(this).parents("tr");// 获取选中input
                ii++;
                $(deldata).remove();
                 
            });  
            
            
     
            if(xzcd.length == ii){// 遍历tr总个数与删除的个数相同说明已全部删除
                console.log("全部删除");
                $("#htmlConCspz .cont_box").find("table tbody").append(jxtjData3);
            } else{
                console.log("没有全部删除");
            }
            
        });
        
        
        $('.cspzedit-layer').on('click','.iop-edit1pp .alldel',function(e){
            var xzcd = $("#htmlConCspzpp .cont_box").find("table tbody").children("tr");
            var xzin = $("#htmlConCspzpp .cont_box").find("table tbody").children("tr").children("td:first-child").children("input:checked");// 遍历tr
            var ii=0;
            var obj=document.getElementsByName('ioppp');
            var ids="";
            for(var i=0; i<obj.length; i++){ 
                if(obj[i].checked){
                    if(i < obj.length){
                        ids+=obj[i].value+','; 
                    }
                } 
            }
            if(ids!=null&&ids!=""&&ids!=undefined){
                ids = ids.substring(0,ids.length-1);
                $.ajax({
                    type : "post",
                    url : vm.path+"/tWlmDecorate/deletePolicy.do",
                    data :{"ids":ids},
                    dataType:'json',
                    success : function(data) {
                        if(data.flag==true){
                            toast("删除成功");// 改成小黑窗
                        }else{
                            toast("网络故障");// 改成小黑窗
                        }
                        
                    }
                });
            }
            
            $.each(xzin,function(i,eleName){// 遍历选中的个数删除
                var deldata = $(this).parents("tr");// 获取选中input
                ii++;
                $(deldata).remove();
                 
            });  
            
            
     
            if(xzcd.length == ii){// 遍历tr总个数与删除的个数相同说明已全部删除
                console.log("全部删除");
                if($("input[name='tjiop']:checked").val() ==='2') {
                    showJtIop(1);
                }else{
                    $("#htmlConCspzpp .cont_box").find("table tbody").append(jxtjData1);
                }
            } else{
                console.log("没有全部删除");
            }
            
        });
        

        // iop批量删除补位
        $('.cspzedit-layer').on('click','.iop-editbw .alldel',function(e){
            // var xzcd = $("#htmlConCspzIop .cont_box").find("table tbody").children("tr");
            // var xzin = $("#htmlConCspzIop .cont_box").find("table tbody").children("tr").children("td:first-child").children("input:checked");// 遍历tr
            var xzcd = $("#htmlConCspz2 .cont_box").find("table tbody").children("tr");
            var xzin = $("#htmlConCspz2 .cont_box").find("table tbody").children("tr").children("td:first-child").children("input:checked");// 遍历tr
            var ii=0;

            // var obj=document.getElementsByName('jtIop');
            var obj=document.getElementsByName('buwei');
            var ids="";
            for(var i=0; i<obj.length; i++){ 
                if(obj[i].checked){
                    if(i < obj.length){
                        ids+=obj[i].value+','; 
                    }
                } 
            }
            if(ids!=null&&ids!=""&&ids!=undefined){
                ids = ids.substring(0,ids.length-1);
                $.ajax({
                    type : "post",
                    url : vm.path+"/tWlmDecorate/deletePolicy.do",
                    data :{"ids":ids},
                    dataType:'json',
                    success : function(data) {
                        if(data.flag==true){
                            toast("删除成功");// 改成小黑窗
                        }else{
                            toast("网络故障");// 改成小黑窗
                        }
                        
                    }
                });
            }
         
            $.each(xzin,function(i,eleName){// 遍历选中的个数删除
                var deldata = $(this).parents("tr");// 获取选中input
                ii++;
                $(deldata).remove();
                 
            });  
     
            if(xzcd.length == ii){// 遍历tr总个数与删除的个数相同说明已全部删除
                console.log("全部删除");
                $("#htmlConCspz2 .cont_box").find("table tbody").append(jxtjData4);
            } else{
                console.log("没有全部删除");
            }
        });

        $('.cspzedit-layer').on('click','.iop-editbwpp .alldel',function(e){
            var xzcd = $("#htmlConCspz2pp .cont_box").find("table tbody").children("tr");
            var xzin = $("#htmlConCspz2pp .cont_box").find("table tbody").children("tr").children("td:first-child").children("input:checked");// 遍历tr
            var ii=0;
            
            var obj=document.getElementsByName('buweipp');
            var ids="";
            for(var i=0; i<obj.length; i++){ 
                if(obj[i].checked){
                    if(i < obj.length){
                        ids+=obj[i].value+','; 
                    }
                } 
            }
            if(ids!=null&&ids!=""&&ids!=undefined){
                ids = ids.substring(0,ids.length-1);
                $.ajax({
                    type : "post",
                    url : vm.path+"/tWlmDecorate/deletePolicy.do",
                    data :{"ids":ids},
                    dataType:'json',
                    success : function(data) {
                        if(data.flag==true){
                            toast("删除成功");// 改成小黑窗
                        }else{
                            toast("网络故障");// 改成小黑窗
                        }
                        
                    }
                });
            }
         
            $.each(xzin,function(i,eleName){// 遍历选中的个数删除
                var deldata = $(this).parents("tr");// 获取选中input
                ii++;
                $(deldata).remove();
                 
            });  
     
            if(xzcd.length == ii){// 遍历tr总个数与删除的个数相同说明已全部删除
                console.log("全部删除");
                $("#htmlConCspz2pp .cont_box").find("table tbody").append(jxtjData2);
            } else{
                console.log("没有全部删除");
            }
        });
        

		$('.cspzedit-layer .saveVideo').click(function(e){// 视频关闭弹窗
			var videoId = $('input[name=chooseVideoId]:checked').val();
			if(!videoId){
				alert("请选择视频！");
				return "";
			}
			var videoName = $('input[name=chooseVideoId]:checked').parent().next().next().html();
			$("#videoIfHref").val(videoId);
			$("#videoIfHref").next().next().html(videoName);
			$("#videoIfHref").next().next().html(videoName);
			$("#videoIfHref").next().next().next().find("video").attr("src",vm.mp3ReplacePath+"/"+videoId+".mp4");
			e.preventDefault();
            $('.modals_csp_video').fadeOut(200, function() {//视频关闭弹层
			});
		})        

        $('.cspzedit-layer .savejh').click(function(e){// 聚合楼层关闭弹窗
             var jh=$('input[name=tjnr]:checked').val();
            var jhspId= $("#jhspId").val();
            var array=jhspId.split("jhsp");
             var policyType=$("#policyType").val();
             var type="";
             var jumpAddress;
             var jumpNameStr = "";
            if(jh=="1"){
                jumpAddress=$('input[name=jhrjhAd]:checked').val();
                floorModuleMap.set($('input[name=jhrjhAd]:checked').val(),"0");
            	jumpNameStr = $('input[name=jhrjhAd]:checked').parent().next().next().next().html();
                type="1";
            }else if(jh=="2"){
            	jumpAddress=$('input[name=yyxzy]:checked').val();
                floorModuleMap.set(jumpAddress.substr(jumpAddress.indexOf("pkid=")+5,32),"2");
            	jumpNameStr = $('input[name=yyxzy]:checked').parent().next().next().html();
                type="3";
            }else{
                jumpAddress=$('input[name=jhr]:checked').val()+ '?decorateId=' + vm.id ;
                floorModuleMap.set($('input[name=jhr]:checked').val(),"1");
                jumpNameStr = $('input[name=jhr]:checked').parent().next().next().html();
                type="2";
                
            }
            var floorType=$("#floorType").val();
            
            /** ===保存跑马灯跳转地址== start * */
            if (floorType && floorType == 'pmdad') {
                jumpAddress=$('input[name=jhrjhAd]:checked').val();
                jumpNameStr=$('input[name=jhrjhAd]:checked').parent().next().next().next().html();
                $('#pmdjumpaddr').closest("tr").next().find("input").val(jumpNameStr);
                $('#pmdjumpaddr').val('adid='+jumpAddress);
                $('#pmdjumpaddr').removeAttr('id')
                e.preventDefault();
                iopjhFadeOut();
                return;
            }
            
            if (floorType && floorType == 'pmdjh') {
                jumpAddress=$('input[name=jhr]:checked').val();
                floorModuleMap.set($('input[name=jhr]:checked').val(),"1");
                jumpNameStr = $('input[name=jhr]:checked').parent().next().next().html();
                $('#pmdjumpaddr').closest("tr").next().find("input").val(jumpNameStr);
                $('#pmdjumpaddr').val(jumpAddress + '?decorateId=' + vm.id);
                $('#pmdjumpaddr').removeAttr('id')
                e.preventDefault();
                iopjhFadeOut();
                return;
            }
            /** ===保存跑马灯跳转地址== end * */
            
            /** ===保存权益详情跳转地址== start * */
            if (floorType && floorType == 'qyxq') {
                if(jh=="1"){
                    jumpAddress= 'adid=' + $('input[name=jhrjhAd]:checked').val();
                    jumpNameStr = $('input[name=jhrjhAd]:checked').parent().next().next().next().html();
                }else if(jh=="2"){
                	jumpAddress= '/rr/lnwd/app/app_det_new.html'+$('input[name=yyxzy]:checked').val();
                	jumpNameStr = $('input[name=yyxzy]:checked').parent().next().next().html();
                }else{
                    jumpAddress=$('input[name=jhr]:checked').val() + '?decorateId=' + vm.id ;
                    jumpNameStr = $('input[name=jhr]:checked').parent().next().next().html();
                    
                }
                $('#qyxqjumpaddr').next().next().val(jumpNameStr);
                $('#qyxqjumpaddr').val(jumpAddress);
                $('#qyxqjumpaddr').removeAttr('id')
                e.preventDefault();
                iopjhFadeOut();
                return;
            }
            /** ===保存权益详情跳转地址== end * */
            
            /** ===滑动元素跳转地址== start * */
            if (floorType && floorType == 'hdysSpan') {
                if(jh=="1"){
                    jumpAddress= 'adid=' + $('input[name=jhrjhAd]:checked').val();
                    floorModuleMap.set($('input[name=jhrjhAd]:checked').val(),"0");
                }else{
                    jumpAddress=$('input[name=jhr]:checked').val() + '?decorateId=' + vm.id ;
                    floorModuleMap.set($('input[name=jhr]:checked').val(),"1");
                    
                }
                $('#hdysSpanId').val(jumpAddress);
                $('#hdysSpanId').closest("tr").next().find("p").html(jumpNameStr);
                
                $('#hdysSpanId').removeAttr('id')
                e.preventDefault();
                iopjhFadeOut();
                return;
            }
            /** ===滑动元素跳转地址== end * */
            
            /** ===保存轮播图跳转地址== start * */
            if (floorType && floorType == 'lbt') {
                if(jh=="1"){
                    jumpAddress= 'adid=' + $('input[name=jhrjhAd]:checked').val();
                }else if(jh=="2"){
                	jumpAddress= '/rr/lnwd/app/app_det_new.html'+$('input[name=yyxzy]:checked').val();
                }else{
                    jumpAddress=$('input[name=jhr]:checked').val() + '?decorateId=' + vm.id ;
                    
                }
                $('#lbtjumpaddr').closest("tr").next().find("input").val(jumpNameStr);
                $('#lbtjumpaddr').val(jumpAddress);
                $('#lbtjumpaddr').removeAttr('id')
                e.preventDefault();
                iopjhFadeOut();
                return;
            }
            /** ===保存轮播图跳转地址== end * */
            
            /** ===保存新底部导航跳转地址== start * */
            if (floorType && floorType == 'newbottom') {
                if(jh=="1"){
                    jumpAddress= 'adid=' + $('input[name=jhrjhAd]:checked').val();
                    floorModuleMap.set($('input[name=jhrjhAd]:checked').val(),"0");
                }else{
                    jumpAddress=$('input[name=jhr]:checked').val() + '?decorateId=' + vm.id ;
                    floorModuleMap.set($('input[name=jhr]:checked').val(),"1");
                }
                 $('#jumpNew').next().next().val(jumpNameStr);
                $('#jumpNew').val(jumpAddress);
                $('#jumpNew').removeAttr('id');
                e.preventDefault();
                iopjhFadeOut();
                return;
            }
            
            //保存静态广告选择广告/页面跳转地址
           if (floorType && floorType == 'link_href') {
                if(jh=="1"){
                    jumpAddress= 'adid=' + $('input[name=jhrjhAd]:checked').val();
                }else{
                    jumpAddress=$('input[name=jhr]:checked').val() + '?decorateId=' + vm.id ;
                }
                $('#staticUrl').closest("td").find(".redzs").html(jumpNameStr);
               $('#staticUrl').closest("td").find("#adsName").val(jumpNameStr);
                $('#staticUrl').val(jumpAddress);
                e.preventDefault();
                iopjhFadeOut();
                return;
            }
            if (floorType && floorType == 'chooseAdinfo3_') {
                if(jh=="1"){
                    jumpAddress= 'adid=' + $('input[name=jhrjhAd]:checked').val();
                }else{
                    jumpAddress=$('input[name=jhr]:checked').val() + '?decorateId=' + vm.id ;
                }
                // $('#staticUrl').closest("td").find(".redzs").html(jumpNameStr);
                // $('#staticUrl').closest("td").find("#adsName").val(jumpNameStr);
                $('.chooseAdinfo3').val(jumpAddress);
                e.preventDefault();
                iopjhFadeOut();
                return;
            }
            /** ===保存新底部导航跳转地址== end * */
            
            if(floorType=="0" || floorType=="3"){
                if(policyType=="1"){
                    $("#policybuweipp"+array[1]).find("#peizhijumpType").val(type);
                    $("#policybuweipp"+array[1]).find("#jumpAddress").val(jumpAddress);
                    $("#policybuweipp"+array[1]).find("#jumpAddress").next().next().val(jumpNameStr);
                }else if(policyType=="4"){
                    $("#policybuweibq"+array[1]).find("#peizhijumpType").val(type);
                    $("#policybuweibq"+array[1]).find("#jumpAddress").val(jumpAddress);
                    $("#policybuweibq"+array[1]).find("#jumpAddress").next().next().val(jumpNameStr);
                }else if(policyType=="3"){
                    $("#policybq"+array[1]).find("#peizhijumpType").val(type);
                    $("#policybq"+array[1]).find("#jumpAddress").val(jumpAddress);
                    $("#policybq"+array[1]).find("#jumpAddress").next().next().val(jumpNameStr);
                }else{
                    $("#policypp"+array[1]).find("#peizhijumpType").val(type);
                    $("#policypp"+array[1]).find("#jumpAddress").val(jumpAddress);
                    $("#policypp"+array[1]).find("#jumpAddress").next().next().val(jumpNameStr);
                }
            }else{
                if(policyType=="1"){
                    console.log($("#policybuwei"+array[1]));
                    $("#policybuwei"+array[1]).find("#peizhijumpType").val(type);
                    $("#policybuwei"+array[1]).find("#jumpAddress").val(jumpAddress);
                    $("#policybuwei"+array[1]).find("#jumpAddress").next().next().val(jumpNameStr);
                }else{
                    $("#policy"+array[1]).find("#peizhijumpType").val(type);
                    $("#policy"+array[1]).find("#jumpAddress").val(jumpAddress);
                    $("#policy"+array[1]).find("#jumpAddress").next().next().val(jumpNameStr);
                }
            }

            if (floorType && floorType == 'bmmkedit') {
                if(jh=="1"){
                    var bmmkAdid = $('input[name=jhrjhAd]:checked').val();
                    jumpAddress= 'adid=' + bmmkAdid;
                    $(bmmkAdSecObj).parents(".bmmoli").find("input[class='bmmkChHi']").val(bmmkAdid);
                }else{
                    var bmmkJump = $('input[name=jhr]:checked').val();
                    jumpAddress=bmmkJump+ '?decorateId=' + vm.id ;
                    $(bmmkAdSecObj).parents(".bmmoli").find("input[class='bmmkChHi']").val(bmmkJump);
                }
                $(bmmkAdSecObj).parents(".bmmoli").find("input:text[class='bminput blockurl']").val(jumpAddress);
            }
            e.preventDefault();
            iopjhFadeOut();
             
        });

        $('.cspzedit-layer .savesp').click(function(e){// 聚合楼层关闭弹窗
            var jhspId= $("#jhspId").val();
            var array=jhspId.split("jhsp");
             var policyType=$("#policyType").val();
             var type="4";
             var jumpAddress=$('input[name=jhrad]:checked').val();
            if(policyType=="1"){
                $("#policybuwei"+array[1]).find("#peizhijumpType").val(type);
                 $("#policybuwei"+array[1]).find("#jumpAddress").val(jumpAddress);
            }else{
                $("#policy"+array[1]).find("#peizhijumpType").val(type);
                $("#policy"+array[1]).find("#jumpAddress").val(jumpAddress);
            }
            e.preventDefault();
            iopspFadeOut();
             
        });

        $(".main-content").on("click",".allCheckbox",function() {// 全选按钮执行
            console.log("aa");
            if (this.checked) {// 选中后设置所有全选
                $(this).parents(".ch_tips").children(".mytablebox").find(":checkbox").prop("checked", true); 

            } else {// 反之不全选
                $(this).parents(".ch_tips").children(".mytablebox").find(":checkbox").prop("checked", false); 
            }
        });

        // 设置全选复选框
        $(".main-content").on("click",".mytablebox :checkbox",function() {// 全选按钮执行
            if (!$(this).hasClass("allCheckbox")) {// 非全选按钮判断
             
                allchk($(this));
            } 
        });

        // 设置全选复选框
        function allchk(a) {
            var chknum = $(a).parents(".ch_tips").find(":checkbox:not('.allCheckbox')").length; // 总个数
            
            var chk = $(a).parents(".ch_tips").find(":checkbox:not('.allCheckbox'):checked").length;// 已选中的个数
             
            if (chknum == chk) { // 全选
                 
                $(a).parents(".ch_tips").find(".allCheckbox").prop("checked", true); 
            } else { // 不全选
                $(a).parents(".ch_tips").find(".allCheckbox").prop("checked", false);
                 
            }
        }
        
        $('.edit .demo')
            .on('mouseover',selector,function(e){
                e.stopPropagation();
                $(this).children('.ctrl-btns').addClass('show');
            })
            .on('mouseleave',selector,function(){
                $(this).children('.ctrl-btns').removeClass('show');
            })
            .on('mouseout',selector,function(){
                $(this).children('.ctrl-btns').removeClass('show');
            });

        
        /*
         * *顶部操作按钮 *编辑-预览-清空-保存
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
                console.log(data.cN2);
                reSlide(demo,1);
            });
            hideHTml();
            return false;       
        };
        function showHTml(e){// 点击预览，获得处理后的html
            var demoHtml = $('.demo').html();
            var copyHtml = $('#copyHtml').html(demoHtml);
            $(copyHtml).find('.lyrow').removeClass('ui-draggable');
            $(copyHtml).find('.preview,.ctrl-btns').remove();
            console.log(copyHtml[0].innerHTML);
            
        };
        function hideHTml(e){// 点击预览，获得处理后的html
            $('#copyHtml').html('')
        };
        function reWrite(e){
            e.preventDefault();
            var data=htmlData,
                id=$(this).attr('id');
            if((id==='back') && (data.count!==0)){
                data.count-- ;
            }else{
                if((id==='forward') && (data.count<(data.step.length-1))){data.count++}else{
                    return false;
                }
            };
            $('.demo').html(data.step[data.count]);

            initContainer();
            console.log('rewrite');
            resizeInit($('.row',demo));
            reSlide(demo,1);    
        };
        function getCss(){};
        function saveLayout(){
            var data = htmlData,
                len=data.step.length,
                count=data.count,
                n;
                console.log(len,count)
            if (len>count) {
                n=len-count;
                data.step.splice(count+1,len-count+1)
            };
            data['css']=$('#css-wrap').text();
            if (supportstorage()) {
                localStorage.setItem("htmlData",JSON.stringify(data));
            }
            console.log(data);
            /*
             * $.ajax({ type: "POST", url: "/build/saveLayout", data: { layout:
             * $('.demo').html() }, success: function(data) {
             * updateButtonsVisibility(); } });
             */
        }
        $('#edit').on('click',{cN1:cN.sp,cN2:cN.e,lv:0},uiAlt);
        $('#preview').on('click',{cN1:cN.e,cN2:cN.sp,lv:-100},uiAlt);

        $('#edit').on('click',function(e){
            $('#vueDemos').removeClass('previewCss');
        });
        $('#preview').on('click',function(e){
            e.preventDefault();
            showHTml(e);
            $('#vueDemos').addClass('previewCss');
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
        // 增加元素
        $('#addMenu').click(function(e){
            e.preventDefault();
        
            $('.modalAddMenu').fadeIn(200, function(e) {
                var layer=$('.edit-layer3',this);
                layer.css({
                    'margin-top':-(layer.height())/2,
                    'margin-left':-(layer.width())/2
                }).fadeIn(100);
                
            });
            var titleType = "<div class='box' data-type='head'><span class='preview'>请自定义您的元素名称</span><div class='ctrl-btns'><span class='edit'>编辑</span><span class='drag'>拖拽</span><span class='remove'>删除</span></div><div class='view myview'>请在此处自定义您的代码</div></div>";
            $('.edit-layer3 #zdyHtmlCon').html('').prepend("<textarea id='zdyHtml' style='border:0;height: 3.4rem;width: 7rem;'>"+titleType+"</textarea>");
        });
        
        $('.css-edit3 .submitted').click(function(e){
            e.preventDefault();
            var teatareaVal = $('#zdyHtml').val();
            $('#menuBox li:last-child').append(teatareaVal);
            fadeOut();
            $( ".box" ).draggable({// 生成的时候再次调用 draggable
                connectToSortable: '.col',
                helper: 'clone',
                opacity:0.5,
                start: function(e,t) {drag++},
                drag: function(e,t) {t.helper.width(100);},
                stop: function(e,t) {drag--;htmlRec(0,'box');}
            });
            return false;
        });
        $('.css-edit3 .btnSave').click(function(e){
            e.preventDefault();
            var teatareaVal = $('#zdyHtml').val();
            $('#menuBox').append('<li>'+teatareaVal+'</li>');
            fadeOut();
            vm.saveloadHtmlIndex();
            $( ".box" ).draggable({// 生成的时候再次调用 draggable
                connectToSortable: '.col',
                helper: 'clone',
                opacity:0.5,
                start: function(e,t) {drag++},
                drag: function(e,t) {t.helper.width(100);},
                stop: function(e,t) {drag--;htmlRec(0,'box');}
            });
            return false;
        });
        $('.btnCancel').click(function(e){
            e.preventDefault();
            fadeOut();
            return false;
        })
        $('#addlan').click(function(e){
            e.preventDefault();
            $('.modals2').fadeIn(200, function(e) {
                var layer=$('.edit-layer2',this);
                layer.css({
                    'margin-top':-(layer.height())/2,
                    'margin-left':-(layer.width())/2
                }).fadeIn(100);
                
            });
            var titleType = "<div class='lyrow' data-type='row'><span class='preview'>一栏</span><div class='ctrl-btns'><span class='drag'>拖拽整栏</span><span class='remove'>删除整栏</span></div><div class='view'><div class='row'><div class='col col-100'></div></div></div></div>";
            $('.edit-layer2 #htmlConLan').html('').prepend("<textarea id='zdyHtml2' style='border:0;height: 4rem;width: 7rem;'>"+titleType+"</textarea>");
            $('#lanBox').append("<li></li>");// 新增li
        });
        $('.css-edit2 .btnSave2').click(function(e){
            e.preventDefault();
            var teatareaVal = $('#zdyHtml2').val();
            console.log(teatareaVal);
            $('#lanBox li:last-child').append(teatareaVal);
            fadeOut();
            vm.saveloadHtmlIndex();
            $('.sidebar-nav .lyrow').draggable({// 再次调用
                connectToSortable: '.col',
                helper: 'clone',
                opacity:0.5,
                start: function(e,t) {drag++;},
                drag: function(e,t) {t.helper.width(100);},
                stop: function(e,t) {
                    drag--;
                    htmlRec(0,'lyrow');
                }
            });
            return false;
        });
        
        // 右击左侧菜单 可以删除
        
        $('.side-bar').on('mousedown','.sub-nav li',function(event, a){
            if(event.which == 3 || a == 'right'){
                if(confirm("确定要删除吗？")){  
                    // 如果是true ，则删除
                    $(this).remove();
                    vm.saveloadHtmlIndex();
                } else {  
                    return false;
                }  
            }
        });
        
        
        // 点击选择标签的确定按钮

        $('.popModal').on('click','.floorSelect .yes',function(e){
            hideid('floorSelectPop');
            var selectedVal = '';
            $('.floorSelectCon input').each(function(){
                if(this.checked){
                    selectedVal += $(this).parent().attr("value")+',';
                }
            })
            if(selectedVal != ""){
                selectedVal = selectedVal.substring(0,selectedVal.length-1);
            }
            tabTypeDom.attr('tabType',selectedVal);
        })
        
        // 单选按钮切换：
        // 展开功能
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
					 var newdbdh_ggwbm = p.find('.whyview .hyNav-box li').eq(i-1).attr("goodCodeInput");
					 var edithyNm = p.find('.whyview .hyNav-box li').eq(i-1).children("a").children("p").text();
					 var	 editahref = p.find('.whyview .hyNav-box li').eq(i-1).children("a").attr("turnHref");
					 var	 titleorname = p.find('.whyview .hyNav-box li').eq(i-1).children("a").attr("titleorname");
					 var	 goldenFish = p.find('.whyview .hyNav-box li').eq(i-1).children("a").attr("goldenfish");//锦鲤
					 var	 programLoginFlag = p.find('.whyview .hyNav-box li').eq(i-1).children("a").attr("programLoginFlag");//小程序登录标识
					var	 edithyImg1 = p.find('.whyview .hyNav-box li').eq(i-1).children("a").children("div:first-child").children("img").attr("src");
					var	 edithyImg2 = p.find('.whyview .hyNav-box li').eq(i-1).children("a").children("div:last-child").children("img").attr("src");
						//  editcdlx =p.find('.whyview .hyNav-box li').eq(i-1).children("input[name='hymenuName']").val(),//菜单类型 0-5
						//  editjplx =p.find('.whyview .hyNav-box li').eq(i-1).children("input[name='whyggdz']").val(),//获取地址跳转类型 
						 if(editahref==null||editahref==''||editahref==undefined){
							 editahref="";
						 }
						 if(!titleorname){
						 	titleorname = ''
						 }
						 if(!newdbdh_ggwbm){
						 	newdbdh_ggwbm = '';
						 }
					   editqyxq="<tr class='qyqq whytr'>"
								 +"<td class='cdtd'>菜单"+i+"</td>"
								 +"<td>" 
								 +"<div class='hytddiv'>"
								 +"	<dl>"
								 +"		<dt>广告位编码：</dt>"
								 +"		<dd>" 
								 +" 		<input class='newdbdh_ggwbm' value='"+newdbdh_ggwbm+"'>"
							  	 +"     </dd>"
								 +"	</dl>"
								 +"</div>"
								 +"<div class='hytddiv'>"
								 +"	<dl>"
								 +"		<dt>跳转地址：</dt>"
								 +"		<dd>" 
						 		 +" 		<div class=' ggjpmlx"+i+"'><input type='text' class='newbottom' placeholder='请输入跳转地址' value='"+editahref+"'/><button style='background:#ffffff;color:#000000; border-radius:0px; border-color:#ddd;' class='hyxzgg'>选择广告/页面</button><input type='text' readonly=\"readonly\" name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;' value='"+titleorname+"'></div>" 
							  	 +"     </dd>"
								 +"	</dl></div>"
                                 +"<div class='hytddiv'>"
                                 +"	<dl>"
                                 +"		<dt>是否免登录：</dt>"
                                 +"		<dd>"
                           if(goldenFish == '1'){
                               editqyxq+=" 		<div class='gglogin"+i+"'><select name='goldenFish'><option value='1' selected>是</option><option value='0'>否</option></select></div>";
                           }else if(goldenFish === '0'){
                               editqyxq+=" 		<div class='gglogin"+i+"'><select name='goldenFish'><option value='1' >是</option><option value='0' selected>否</option></select></div>";
                           }else {
                               editqyxq+=" 		<div class='gglogin"+i+"'><select name='goldenFish'><option value='1' selected>是</option><option value='0'>否</option></select></div>";
                           }
                     editqyxq+="     </dd></dl></div>"
                         +"<div class='hytddiv'>"
                         +"	<dl>"
                         +"		<dt>小程序登录：</dt>"
                         +"		<dd>"
                     if(programLoginFlag == 'T'){
                         editqyxq+=" 		<div class='gglogin"+i+"'><select name='programLoginFlag'><option value='T' selected>是</option><option value='F'>否</option></select></div>";
                     }else {
                         editqyxq+=" 		<div class='gglogin"+i+"'><select name='programLoginFlag'><option value='T' >是</option><option value='F' selected>否</option></select></div>";
                     }
                     editqyxq+="	</dd></dl></div>"
								 +"<div class='hytddiv'>"
								 +"<dl>"
								 +"<dt class='cdpic'>未选中图片：</dt>"
								 +"<dd>"
								 +"<div class='uploadImg normalData wxzpic'>"
								 +"		<img src='images/images.png' alt='' class='imagesZw' id='notSelect"+i+"imagesZw' style='display:none;'>"
								 +"		<img src='"+edithyImg2+"' alt='' class='imgPerview' id='notSelect"+i+"imgPerview'>"
								 +"		<p class='opacityP'>上传图片</p>"
								 +"		<input type='file' class='imgInput' onchange='upLoadImgChannel_newBottom(this,0,0,2)' name='UploadBtn' id='notSelect"+i+"'>"
								 +"	</div>" 
								 +"</dd>"
								 +"</dl>"
								 +"</div>"
								 +"<div class='hytddiv'>"
								 +"	<dl>"
								 +"		<dt class='cdpic'>选中图片：</dt>"
								 +"		<dd>"
								 +"			<div class='uploadImg normalData xzpic'>"
								 +"				<img src='images/images.png' alt='' class='imagesZw' id='yesSelect"+i+"imagesZw' style='display:none;'>"
								 +"				<img src='"+edithyImg1+"' alt='' class='imgPerview'  id='yesSelect"+i+"imgPerview'>"
								 +"				<p class='opacityP'>上传图片</p>"
								 +"				<input type='file' class='imgInput' onchange='upLoadImgChannel_newBottom(this,0,0,2)' name='UploadBtn' id='yesSelect"+i+"'>"
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
			var countS=0;
		var editHxcd='';
		for(var i= 0 ;i<imgNum;i++){ 
			var newdbdh_ggwbm  =  $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody").children("tr").eq(i).find(".newdbdh_ggwbm").val();
			if(!newdbdh_ggwbm){
				alert("请输入广告位编码！");
				return;
			}
			var newdbdh_ggwbmStr= " goodcodeinputsign='goodcodeinputsign' goodCodeInput='" + newdbdh_ggwbm + "'" ;
			//新跳转地址获取  -- 待优化，广告是展示的广告标题，聚合页也是？
			var whymenuad  =  $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody").children("tr").eq(i).find(".hytddiv:nth-child(2)").find("input").val();
			//锦鲤
			var goldenFish  =  $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody").children("tr").eq(i).find(".hytddiv:nth-child(3)").find("select[name='goldenFish']").val();
			var programLoginFlag  =  $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody").children("tr").eq(i).find(".hytddiv:nth-child(4)").find("select[name='programLoginFlag']").val();
			console.log(goldenFish);
			var titleorname  =  $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody").children("tr").eq(i).find(".hytddiv:nth-child(2)").find("input").next().next().val();
			
			
			//获取业务图片地址
			var tpdz1 = $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody").children("tr").eq(i).find(".hytddiv:nth-child(5)").find(".wxzpic .imgPerview").attr("src");
			var tpdz2 = $(this).parents('.whyedit-layer').children(".whymain-content").find("table tbody").children("tr").eq(i).find(".hytddiv:nth-child(6)").find(".xzpic .imgPerview").attr("src");
			if(tpdz1==null||tpdz1==''||tpdz1==undefined){
				alert("请上传未选中图片");
				return ;
			}
			if(tpdz2==null||tpdz2==''||tpdz2==undefined){
				alert("请上传选中图片");
				return ;
			}
			if(whymenuad!=null&&whymenuad!=''&&whymenuad!=undefined){
			    if(whymenuad.indexOf("/rr/")>-1){
					editHxcd += "\<li class='whyli' "+newdbdh_ggwbmStr+"><a onclick="+"addToProductStore.executeFvsStatcAdid(\'"+whymenuad+"&turnJumpImage="+tpdz2+"\',\'1\',this,\'02\',\'1\',null,\'"+goldenFish+"\')" +
                        " goldenFish='"+goldenFish+"' turnHref='"+whymenuad+"' titleorname='"+titleorname+"' bindturnhrefimage='bindturnhrefimage' url='"+whymenuad+"' programLoginFlag='"+programLoginFlag+"'>"
				}else if(whymenuad.indexOf("adid")>0){
					editHxcd += "\<li class='whyli' "+newdbdh_ggwbmStr+"><a onclick="+"addToProductStore.executeFvsStatcAdid(\'"+whymenuad+"&turnJumpImage="+tpdz2+"\',\'1\',this,\'02\',\'1\',null,\'"+goldenFish+"\')" +
                        " goldenFish='"+goldenFish+"' turnHref='"+whymenuad+"' titleorname='"+titleorname+"' url='"+whymenuad+"' programLoginFlag='"+programLoginFlag+"'>"
				}else{
					editHxcd += "\<li class='whyli' "+newdbdh_ggwbmStr+"><a onclick="+"NewBottomJumpURL(\'"+whymenuad+"\',\'"+goldenFish+"\') goldenFish='"+goldenFish+"' turnHref='"+whymenuad+"'" +
                        " titleorname='"+titleorname+"' url='"+whymenuad+"'  turnJumpImage='"+tpdz2+"' programLoginFlag='"+programLoginFlag+"'>"
				}
			}else{
				editHxcd += "\<li class='whyli' "+newdbdh_ggwbmStr+"><a bindturnhrefimage='bindturnhrefimage'>"
					countS++;
			}
				if(i == 0){//自定义名称
					editHxcd += "\<div class='xzactive'><img src='"+tpdz2+"' alt=''></div>\
					<div class='ndis'><img src='"+tpdz1+"' alt=''></div></a>\
					"
				}else{
					editHxcd += "\<div class='ndis'><img src='"+tpdz2+"' alt=''></div>\
					<div class=''><img src='"+tpdz1+"' alt=''></div></a>\
					"
				}	
				editHxcd += "</li>";
			
		}
		if(countS>1){
			alert("只能是当前页面不配置跳转路径");
			return ;
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
				<dt>广告位编码：</dt>\
				<dd>\
		 			<input class="newdbdh_ggwbm">\
				</dd>\
			</dl>\
		</div>\
		<div class="hytddiv">\
			<dl>\
				<dt>跳转地址：</dt>\
				<dd>\
				<div class=" ggjpmlx'+lbtth+'"><input type="text" class="newbottom" placeholder="请输入跳转地址" value=""/><button style="background:#ffffff;color:#000000; border-radius:0px; border-color:#ddd;" class="hyxzgg">选择广告/页面</button><input type=\"text\" readonly=\"readonly\" name=\"jumpAddressStr\" class=\"jumpAddressStrReadOnly\" style=\"margin-left: 5px; width: 80px; float: right;border: none;\"></div>\
				</dd>\
			</dl>\
		</div>\
		<div class="hytddiv">\
            <dl>\
                <dt>是否免登录：</dt>\
                <dd>\
                <div class="gglogin+'+lbtth+'+"><select><option value="1" selected>是</option><option value="0">否</option></select></div>\
                </dd>\
            </dl>\
        </div>\
		<div class="hytddiv">\
			<dl><dt class="cdpic">未选中图片：</dt>\
				<dd><div class="uploadImg normalData wxzpic">\
						<img src="images/images.png" alt="" class="imagesZw" id="notSelect'+lbtth+'imagesZw">\
						<img src="" alt="" class="imgPerview" id="notSelect'+lbtth+'imgPerview">\
						<p class="opacityP">上传图片</p>\
						<input type="file" class="imgInput" onchange="upLoadImgChannel_newBottom(this,0,0,2)" name="UploadBtn" id="notSelect'+lbtth+'">\
					</div>\
				</dd>\
			</dl>\
		</div>\
		<div class="hytddiv">\
			<dl>\
				<dt class="cdpic">选中图片：</dt>\
				<dd>\
					<div class="uploadImg normalData xzpic">\
						<img src="images/images.png" alt="" class="imagesZw" id="yesSelect'+lbtth+'imagesZw">\
						<img src="" alt="" class="imgPerview" id="yesSelect'+lbtth+'imgPerview">\
						<p class="opacityP">上传图片</p>\
						<input type="file" class="imgInput" onchange="upLoadImgChannel_newBottom(this,0,0,2)" id="yesSelect'+lbtth+'" name="UploadBtn">\
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
		 $("#floorType").val('newbottom');
        $("#tjnr2yy").hide();//隐藏应用下载
		 queryPolicyPage();
		 $(this).parent().find('.newbottom').attr("id","jumpNew");
		 
	$('.modals_cspzjhy').fadeIn(200, function() {//展示参数配置弹层
		var zhi=$(this).parent().find('.newbottom').val();
		huixianJH(zhi);
		huixanzhi=zhi;
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
        
           // 获取当前楼层id click
           $(demo).on('click','.getfloorId',function(e){
            e.preventDefault(); 
            $('.coMmodals').show();// 展示蒙版
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
           
           
/* ***********************************************新轮播图 start ************************************************************************************************ */
           
         // 新轮播图弹窗编辑
           var lbtthisClickObj='';
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
                        editdztj1 =  "  <div class='nrks'>"
                        +"      <span class='zysx'>注：建议图片尺寸一致</span>"
                        +       "<ul class='cont_list clistone' id='c_1'>";
                        editHtmlImg += editdztj1; 
                        for(var i= 1 ;i<imgNum;i++){
                            var editText = p.find('.lbtdiv li .lbtName').eq(i-1).val(),//获取轮播图标题
                            editglText = p.find('.lbtdiv li .lbtifglgg').eq(i-1).val(),//获取是否关联广告属性
//                           
                            adidhref = p.find('.lbtdiv li a').eq(i-1).find('#adidhref').val(),
                            jhyhref = p.find('.lbtdiv li a').eq(i-1).find('#jhyhref').val(),
                            yyyhref = p.find('.lbtdiv li a').eq(i-1).find('#yyyhref').val(),
                            goodCodeInputNewLB = p.find('.lbtdiv li a').eq(i-1).attr('goodcodeinput'),
                            titleorname = p.find('.lbtdiv li a').eq(i-1).attr('titleorname'),
                            
                            selectTypePhoneHref = p.find('.lbtdiv li a').eq(i-1).attr('selectTypePhoneHref'),
                            lbteditPicSrc = p.find('.lbtdiv li img').eq(i-1).prop('src'),//获取图片src展示
                            editPicHref = p.find('.lbtdiv li a').eq(i-1).prop('href');//图片超链接展示
                            //editPicHref = p.find('.navbottom-box li a').eq(i-1).prop('href'),//
                            var  editPicHref = p.find('.lbtdiv li a').eq(i-1).attr('href');
                            if(goodCodeInputNewLB==null||goodCodeInputNewLB==undefined||goodCodeInputNewLB==''){
                            	goodCodeInputNewLB='';
                            }
                            if(!titleorname){
                            	titleorname = '';
                            }
                            if(!yyyhref){
                            	yyyhref = '';
                            }
                            if (editPicHref && editPicHref.indexOf('isIndex=0') > -1) {
                                editPicHref = '';
                            }
                            if(!editPicHref){
                            	editPicHref = '';
                            }
                            var editdztj = "<li class='lbt_li'>"
                                      +"          <table class='intable' border='0' cellspacing='0' cellpadding='0'>"
                                      +"              <tr>"
                                      +"                  <th>标题：</th>"
                                      +"                  <td><input class='inputtxt lbtbt' name='' type='text' value='" + editText + "'/></td>"
                                      +"              </tr>"
                                      if(editglText=='0'){//0不关联广告
                                          editdztj+= "<tr class=''>"
                                          +"              <th>关联广告：</th>"
                                          +"              <td><input type='radio' name='ifglgg"+i+"' id='ifglgg"+i+"' value='1' class='ifglgg nninput' onclick='qhglgg(this,&apos;1&apos;)'/><label for='ifglgg"+i+"' class='ifdllb'>是</label>"
                                          +"              <input type='radio' name='ifglgg"+i+"' id='fglgg"+i+"' value='0' class='ifglgg nninput' checked onclick='qhglgg(this,&apos;0&apos;)'/><label for='fglgg"+i+"' class='ifdllb'>否</label></td>"
                                          +"          </tr>"
                                          +"          <tr class='trLj'>"
                                          +"                  <th>跳转地址：</th>"
                                          +"                  <td><input class='inputtxt lbtlj' name='' type='text' value='" + editPicHref + "' /></td>"
                                          +"              </tr>"
                                          +"              <tr class='lbtxzgg' style='display: none;'>"
                                          +"                  <th>选择广告：</th>"
                                          +"                  <td><input type='text' class='jhinp ywinput lbtjhinp' placeholder='请选择广告' value='' readonly style='width: 80px;line-height: 24px;height: 22px;'><span><a href='javascript:;' class='xxljgg lbtxzgg1' style='line-height:24px; height:24px;'>选择广告</a></span></td>"
                                          +"              </tr>"
                                          +"              <tr class='lbtxzgg' style='display: none;'>"
                                          +"                  <th>所选名称：</th>"
                                          +"                  <td><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style=' width: 100px;border: none;' value="+titleorname+"></td>"
                                          +"              </tr>"
                                      }
                                      if(editglText=='1'){//1关联广告
                                          if (adidhref) {
                                              editPicHref = '' + adidhref;
                                          } else if (jhyhref) {
                                              editPicHref = jhyhref;
                                          } else if (yyyhref) {
                                              editPicHref = yyyhref;
                                          }
                                          editdztj+= "<tr class=''>"
                                          +"              <th>关联广告：</th>"
                                          +"              <td><input type='radio' name='ifglgg"+i+"' id='ifglgg"+i+"' value='1' class='ifglgg nninput ' checked onclick='qhglgg(this,&apos;1&apos;)'/><label for='ifglgg"+i+"' class='ifdllb'>是</label>"
                                          +"              <input type='radio' name='ifglgg"+i+"' id='fglgg"+i+"' value='0' class='ifglgg nninput' onclick='qhglgg(this,&apos;0&apos;)'/><label for='fglgg"+i+"' class='ifdllb'>否</label></td>"
                                          +"          </tr>"
                                          +"          <tr class='trLj' style='display: none;'>"
                                          +"                  <th>跳转地址：</th>"
                                          +"                  <td><input class='inputtxt lbtlj' name='' type='text' value='' /></td>"
                                          +"              </tr>"
                                          +"              <tr class='lbtxzgg'>"
                                          +"                  <th>选择广告：</th>"
                                          +"                  <td><input type='text' class='jhinp ywinput lbtjhinp' placeholder='请选择广告'  value='" + editPicHref + "' readonly style='width: 80px;line-height: 24px;height: 22px;'><span><a href='javascript:;' class='xxljgg lbtxzgg1' style='line-height:24px; height:24px;'>选择广告</a></span></td>"
                                          +"              </tr>"
                                          +"              <tr class='lbtxzgg'>"
                                          +"                  <th>所选名称：</th>"
                                          +"                  <td><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='width: 100px;border: none;' value="+titleorname+"></td>"
                                          +"              </tr>"
                                      }
                                      editdztj+="<tr>"
                                          +"                  <th>终端列表：</th>"
                                          +"                  <td><select class='selectTypePhoneHref' name='' id=''style=\"padding-left:0px;float: left;width: auto;height:25px;\"><option value='' bind=''>仅对终端广告生效</option><option value=\"1\" ";
					                    if('1' == selectTypePhoneHref){
											editdztj += " selected = 'selected' ";
										}
										editdztj += " bindclass=\"phoneList\">列表页</option> <option value=\"2\" ";
										if('2' == selectTypePhoneHref){
											editdztj += " selected = 'selected' ";
										}
										editdztj += "bindclass=\"phoneDetail\">详情页</option>";
					                    editdztj += "</select></td>        </tr>";
                                      editdztj+="<tr>"
                                      +"                  <th>轮播图片：</th>"
                                      +"                  <td>"
                                      +"                      <span class='zsp pic_span' >"
                                      +"                          <a  href='javascript:;' class='llbtn cllBtn llbtn_xlbt'>浏览</a> "
                                      +"                          <input name='' type='file'  class='upload file' id='txtUploadFile' size='1'/>"
                                      +"                      </span>"
                                      +"                     <div class='yulanImg pic_img'><img src='"+lbteditPicSrc +"'   /></div>"
                                      +"                  </td>"
                                      +"              </tr>";
                                      editdztj+="<tr>"
                                          +"                  <th>插码：</th>"
                                          +"                  <td><input class='inputtxt goodCodeInputNewLB' id='goodCodeInputNewLB' name='' type='text' value="+goodCodeInputNewLB+"></td>"
                                          +"              </tr>";	
                                    if(i==1){
                                          editdztj += "   <tr>"
                                          +"                  <th></th>"
                                          +"                  <td  class='ydtd'>"
                                          +"                      <a href='javascript:;' onClick='deltab(this)' class='llbtn llbtn_xlbt cee4358bb'>移除</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                                          +"                      <a href='javascript:;' onclick='qytab(this)' class='llbtn llbtn_xlbt c3c9be1bb'>前移</a>"
                                          +"                  </td>"
                                          +"              </tr>";
                                      }else{
                                          editdztj += "   <tr>"
                                          +"                  <th></th>"
                                          +"                  <td  class='ydtd'>"
                                          +"                      <a href='javascript:void(0)' onClick='deltab(this)' class='llbtn llbtn_xlbt cee4358bb'>移除</a>&nbsp;&nbsp;&nbsp;&nbsp;"
                                          +"                      <a href='javascript:void(0)' onclick='qytab(this)' class='llbtn llbtn_xlbt c3c9be1bb'>前移</a>"
                                          +"                  </td>"
                                          +"              </tr>";
                                    }
                                    editdztj +="</table>"
                                        +"      </li>";
                                  editHtmlImg+=editdztj;
                        }
                        editdztj1 ="</ul>"
                                  +"<ul class='cont_list_plus'>"
                                  +" <li id='plus1' onclick='tbplus(this)'>"
                                  +"   <p>+增加图片广告</p>"
                                  +" </li>"
                                  +"</ul>"
                                  +"  </div>";
                        editHtmlImg += editdztj1;
                    $('.nlbtTips #lbthtmlCon').html('').append(editHtmlImg);//modals3图片广告弹窗使用
                });
            });
           
           
           /********************************* 轮播图关联广告 start ***************************************** */
           
           $(document).on('click','.lbtxzgg1',function(e) {// 选择
               resetValuead();
               $(".tiaoType").html('选择广告/聚合页');
               $(".showiop").show();
               $(".showpmd").hide();
               $("#tjnr2yy").show();
               $("#floorType").val('lbt');
               $(this).parent().parent().find('.lbtjhinp').attr('id','lbtjumpaddr')
               var id= this.id;
               $("#jhspId").val(id);
               var zhi=$(this).parent().parent().find('.jhinp').val();
               huixianJH(zhi);
               huixanzhi=zhi;
                $('.modals_cspzjhy').fadeIn(200, function() {// 展示参数配置弹层
                    var layer=$('.cspzedit-layer',this);
                    layer.css({
                        'margin-top':-(layer.height())/2,
                        'margin-left':-(layer.width())/2
                    }).fadeIn(100);// 弹窗位置设置
                    // iop推荐弹窗拼串开始
                    $('#htmlConjh').show();// 默认展示IOP推荐tab
                });
           })
           
           /********************************* 关联广告 end ***************************************** */
           
            /*******************============ 轮播图保存start==========************/
            $('.lbmodal').on('click','.lbt-edit button',function(e){// 点击保存
                e.preventDefault();//
                var imgNum = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").length;
                var editLbt='';
                for(var i= 0 ;i<imgNum;i++){ 
                 
                    var btnm = $(this).parents('.lbmodal').find('.lbtbt').eq(i).val();// 标题
                  //  var ifgg = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").find(".ifglgg[name='ifglgg"+(i+1)+"']:checked").val();//是否关联广告
                    var ifgg = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").eq(i).find('input[type="radio"]:checked').val();// 是否关联广告
                    var imgSrc = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").find(".pic_img img").eq(i).attr("src");// 图片地址
                    var imgHref = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").find('.lbtlj').eq(i).val();// 图片链接
                    var ggHref = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").find('.ywinput').eq(i).val();// 图片链接
                    var ggHrefName = $(this).parents('.lbmodal').children(".lbtdes").find(".jumpAddressStrReadOnly").eq(i).val();// 链接名
                    var ggbianma = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").find('.goodCodeInputNewLB').eq(i).val();// 广告位编码
                    
            		var selectTypePhoneHref = $(this).parents('.lbmodal').children(".lbtdes").find(".cont_list li").find('.selectTypePhoneHref').eq(i).find("option:selected").val();//是否跳转列表页
                    

                    if (!btnm) {
                        alert('第' + (i+1) + '栏请填写标题');
                        return;
                    }
                    if (!ggbianma) {
                        alert('第' + (i+1) + '栏请填写插码');
                        return;
                    }
                    editLbt += ' \<li>';
                    if(ifgg == '1'){//ywinput
                        if (!ggHref) {
                            alert('第' + (i+1) + '栏请选择广告');
                            return;
                        }
                        if (!imgSrc) {
                            alert('第' + (i+1) + '栏上传图片');
                            return;
                        }
                        if (ggHref.indexOf('adid=') > -1) {
                            //ggHref = ggHref.substring(ggHref.indexOf('=') +1);
                            var click = '';
                            if(selectTypePhoneHref){
                            	 click = ' onclick="javascript:addToProductStore.executeFvsStatcAdidForPhone('+ '\'' + ggHref + '\'' + ',\'1\',this,\'02\',\'\',\'1\',\''+selectTypePhoneHref+'\')\"';
                            } else {
                            	 click = ' onclick="javascript:addToProductStore.executeFvsStatcAdidForPhone('+ '\'' + ggHref + '\'' + ',\'1\',this,\'02\',\'\',\'1\',\'\')\"';
                            }
                            editLbt += ' <a href="javascript:void(0)" '+click+' goodcodeinputsign="goodcodeinputsign" goodcodeinput='+ggbianma+' titleorname='+ggHrefName+' selectTypePhoneHref='+selectTypePhoneHref+'><img src="'+imgSrc+'" alt=""><input type="hidden" id="adidhref" value="'+ggHref+'"><input type="hidden" value="'+btnm+'" class="lbtName"/><input type="hidden" value="'+ifgg+'" class="lbtifglgg"/></a>';
                        } else if (ggHref.indexOf('decorateId=') > -1) {
                          ggHref = ggHref + '&shopId=';
                            var click = ' onclick=\"javascript:addToProductStore.executeFvsStatcAdid('+ '\'' + ggHref + '\'' + ',\'1\',this,\'02\',\'\',\'1\')\"';
                            editLbt += ' <a href="javascript:void(0)" '+click+' goodcodeinputsign="goodcodeinputsign" goodcodeinput='+ggbianma+' titleorname='+ggHrefName+'><img src="'+imgSrc+'" alt=""><input type="hidden" id="jhyhref" value="'+ggHref+'"><input type="hidden" value="'+btnm+'" class="lbtName"/><input type="hidden" value="'+ifgg+'" class="lbtifglgg"/></a>';
                        }else if (ggHref.indexOf('pkid=') > -1){
                       	 	var click = ' onclick=\"javascript:addToProductStore.executeFvsStatcAdid('+ '\'' + ggHref + '\'' + ',\'1\',this,\'02\',\'\',\'1\')\"';
                       	 	editLbt += ' <a href="javascript:void(0)" bindturnhrefimage="bindturnhrefimage" titleorname='+ggHrefName+' class="" url="'+ggHref+'" '+click+' goodcodeinputsign="goodcodeinputsign" goodcodeinput='+ggbianma+'><img src="'+imgSrc+'" alt=""><input type="hidden" id="yyyhref" value="'+ggHref+'"><input type="hidden" value="'+btnm+'" class="lbtName"/><input type="hidden" value="'+ifgg+'" class="lbtifglgg"/></a>';
                        }
                    } else {
                        if (!imgHref) {
                            alert('第' + (i+1) + '栏请填写跳转地址');
                            return;
                        }
                        if (!imgSrc) {
                            alert('第' + (i+1) + '栏上传图片');
                            return;
                        }
                        editLbt += '<a href="'+imgHref+'" url="'+imgHref+'"  goodcodeinputsign="goodcodeinputsign" goodcodeinput='+ggbianma+'>\
                        <img src="'+imgSrc+'" alt="1" width="400" height="200"/>\
                        <input type="hidden" value="'+btnm+'" class="lbtName"/>\
                        <input type="hidden" value="'+ifgg+'" class="lbtifglgg"/>\
                        </a>';
                    }
                    
                    editLbt += '</li>';
                     
                }
                $(lbtthisClickObj).find('.lbtdiv .imgs-container').html(editLbt);
                reSlide();
                sizeInit();
                closeC('.nlbtTips');// 关闭弹窗
                
                return;
            });
            /*******************============ 轮播图保存end==========************/
            
/********************** **************************新轮播图end ************************************************************************************************ */

            // 公共关闭取消 广告弹窗使用
            $('.cmszedit-layer .closexz,.cmszedit-layer .cmsqxxz').click(function(e){// iop楼层关闭弹窗
                e.preventDefault();
                cmsFadeOut();
                return false;
            });
            
            $('.cmszedit-layer .cmssave').click(function(e){
              e.preventDefault();
              // 获取跳转链接
              var vjplj = $(this).parents(".cmsModalTips").find(".cmsTable").find("td input[name='xxggra']:checked").val();
              floorModuleMap.set(vjplj,"3");
              var vjpljStr = $(this).parents(".cmsModalTips").find(".cmsTable").find("td input[name='xxggra']:checked").parent().next().next().html();
              vjplj = 'message/noticeDetail.html?noticeFlag=1&amp;noticeId=' + vjplj;
              $("#pmdjumpaddr").closest("tr").next().find("input").val(vjpljStr);
              $("#pmdjumpaddr").val(vjplj);
              $('#pmdjumpaddr').removeAttr('id');
              cmsFadeOut();
              return false;
          });
            // 公共点击关闭弹窗隐藏
            function cmsFadeOut(){
                $('.cmsModalTips').fadeOut(100, function() {
                    $(this).find('.cmszedit-layer').hide();
                });
            };
    })
}

// 小黑窗
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
    toast.style.zIndex = "9999";
    toast.innerHTML=text;
    document.body.appendChild(toast);
    setTimeout(function(){
        document.body.removeChild(toast);
    },1500)
}
function showggjh(a){
    if(a == "ggtable"){
        $(".ggtable").show();
        $(".jhytable").hide();
        $(".yyxztable").hide();
    }else if(a == "jhytable"){
        $(".jhytable").show();
        $(".ggtable").hide();
        $(".yyxztable").hide();
    }else{
    	$(".jhytable").hide();
        $(".ggtable").hide();
        $(".yyxztable").show();
    }
}

function showJtIop(type){
    if(type=="0"){
        var tianzhi2="						   <thead>							<tr>								<th><input type='checkbox' class='allCheckbox'></th>								<th>序号</th>								<th>策略配置</th>								<th>操作</th>							</tr>						</thead>						<tbody class='mytablebox'> 							<tr class='clxqq' id='policypp0'>								<td><input type='checkbox' name='ioppp'></td>								<td id='xuhaoCount'>1</td>								<td>									<div><dl><dt>广告编码:</dt> <dd><input type=\"text\" name=\"policyGgwbm\" class=\"policyGgwbm\"></dd></dl></div><div>										<dl>											<dt>策划ID:</dt>											<dd>												<input type='hidden' name='policyId' id='policyId'>  												<input type='text' placeholder='请输入策划ID' name='planId' id='planId' autocomplete='off' οnkeyup='this.value=this.value.replace(/[^\d\,]/g,'')'>												<span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span>											</dd>										</dl>									</div>									<div>										<dl>											<dt>图片:</dt>											<dd>												<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='iconListpp0imagesZw'>												<img src='' alt='' class='iconListpp0imgPerview'>												<p class='opacityP' id='iconListpp0opacityP'>上传图片</p>												<input type='hidden' name='iconListppimageName' id='iconListpp0imageName' >												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconListpp0' >												</div>												<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>									<div>										<dl>											<dt>跳转地址:</dt>											<dd>												<input type='hidden' name='jumpType' id='peizhijumpType'>												<input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' autocomplete='off'>												<span class='jhsp ad' id='jhsp0'  >选择广告/聚合页</span>	<input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'>										</dd>										</dl>									</div><div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtoniop0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtoniop0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>									<div>										<dl>											<dt>展示权重:</dt>											<dd>												<input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' autocomplete='off'>																										</dd>										</dl>									</div>									<div>										<dl>											<dt>有效时间:</dt>											<dd class='yxsjdd'>												<input id='startTimepp' name='startTimepp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" autocomplete='off'/> ~ <input id='endTimepp' name='endTimepp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" />											</dd>										</dl>									</div>								</td>								<td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunpp(0)'>保存</a></td>							</tr>						</tbody>";
    }else{
        var tianzhi2="						   <thead>							<tr>								<th><input type='checkbox' class='allCheckbox'></th>								<th>序号</th>								<th>策略配置</th>			<th>状态</th>					<th>操作</th>							</tr>						</thead>						<tbody class='mytablebox'> 							<tr class='clxqq' id='policyIop0'>								<td><input type='checkbox' name='ioppp'></td>								<td id='xuhaoCount'>1</td>					<td>						<div><dl><dt>广告编码:</dt> <dd><input type=\"text\" id=\"policyGgwbm\" name=\"policyGgwbm\" class=\"policyGgwbm\"></dd></dl></div><div>										<dl>											<dt>策划ID:</dt>											<dd style='display: flex'>												<input type='hidden' name='policyId' id='policyId0'>  												<input type='text'  name='planId' id='planId0' autocomplete='off' readonly='readonly' class='selectLiCspzpp'>												<span class='jhsp jtIop' id='jhIop0'  >选择</span>											</dd>										</dl>									</div>									<div>										<dl>											<dt>图片:</dt>											<dd>												<div class='uploadImg normalData' readonly='readonly' class='selectLiCspzpp'>	<img src='' alt='' class='iconListpp0imgPerview'  id='iopPath0'>	<input type='hidden' name='iconListppimageName' id='iopPathImg'>																												</div>																							</dd>										</dl>									</div>									<div>										<dl>											<dt>跳转地址:</dt>											<dd>														<input type='text' readonly='readonly' class='selectLiCspzpp' class='jhinp'  name='jumpAddress' id='jumpAddressIop0' autocomplete='off'>																					</dd>										</dl>									</div><div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtoniop0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtoniop0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>									<div>										<dl>											<dt>展示权重:</dt>											<dd>												<input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeightsIop' autocomplete='off'>																										</dd>										</dl>									</div>									<div>										<dl>											<dt>有效时间:</dt>											<dd class='yxsjdd'>												<input id='startTimepp0' name='startTimepp' readonly='readonly' class='selectLiCspzpp' class='Wdate w150'  autocomplete='off'/> ~ <input id='endTimepp0' name='endTimepp' readonly='readonly' class='selectLiCspzpp' class='Wdate w150' />											</dd>										</dl>									</div>								</td>			<td>无</td>					<td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunpp(0)'>保存</a></td>							</tr>						</tbody>";
    }
    $('#htmlConCspzpp table').html('').append(tianzhi2);
}


// 公共关闭按钮
function closeC(a){
    $('.coMmodals').hide();// 隐藏公共蒙层
    $(a).fadeOut();// 隐藏弹层
}
// 移除本身class
function removeClassFunYa(_that) {
    $('.'+_that).removeClass(_that)
}
// 复制按钮
function copy() {
    var text = document.getElementById("floorId");
    text.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("复制成功");
    return;
}

// 删除轮播图广告js动效：
function deltab(dd){ 
	var imgNums = $(dd).parents('li').parents(".lbtdes");
    $(dd).parents('li').remove(); 
    var imgNum=$(imgNums).find(".cont_list li").length;
    for(var i= 0 ;i<imgNum;i++){ 
    		var j=i+1;
    		$(imgNums).find(".cont_list li").eq(i).find("table tbody  tr:nth-child(2)").find(".ifglgg").attr("name","ifglgg"+j).attr("id","ifglgg"+j);//是否关联广告
        }
}
// 前移轮播图广告js动效：
function qytab(aa){ 
    // 获取当前选中节点
    var bar = 'lbt_li';// class
    if($(aa).parents('.'+ bar).prev('.'+bar).html() != undefined){// 判断是否在最前面
        var obj = $(aa).parents('.'+bar).clone(true);// 克隆当前标签
        $(aa).parents('.'+bar).prev().before(obj);// 放置克隆过的标签，放到前一个位置
        // initStore();//重新排序
/*        var imgNums = $(aa).parents('li').parents(".lbtdes");
        var imgNum=$(imgNums).find(".cont_list li").length;
        for(var i= 0 ;i<imgNum;i++){ 
          var j=i+1;
          $(imgNums).find(".cont_list li").eq(i).find("table tbody  tr:nth-child(2)").find(".ifglgg").attr("name","ifglgg"+j).attr("id","ifglgg"+j);//是否关联广告
        }*/
        $(aa).parents('.'+bar).remove();// 删除被克隆标签
    }else{
        console.log('亲，现在已是最前面的哦，不能再前移了...');
    }
}

/************================================轮播图追加弹层 start ==============================******/
function tbplus(a){ 
    //增加前 lt获取已有li的个数
    var lbtth = $(a).parents(".nrks").find(".cont_list").children("li").length;
    lbtth = lbtth+1; 
    initLbt(lbtth);  
}
function initLbt(lbtth){ 
 
$("#c_1").append("<li class='lbt_li'>"
+"              <table class='intable' border='0' cellspacing='0' cellpadding='0'>"
+"                  <tr>"
+"                      <th>标题：</th>"
+"                      <td><input class='inputtxt lbtbt' name='' type='text' /></td>"
+"                  </tr>"
+"                 <tr class=''>"
+"                     <th>关联广告：</th>"
+"                     <td><input type='radio' name='ifglgg"+lbtth+"' id='ifglgg"+lbtth+"' value='1' class='ifglgg nninput '  onclick='qhglgg(this,&apos;1&apos;)'/><label for='ifglgg"+lbtth+"' class='ifdllb'>是</label>"
+"                        <input type='radio' name='ifglgg"+lbtth+"' id='fglgg"+lbtth+"' value='0' class='ifglgg nninput' checked onclick='qhglgg(this,&apos;0&apos;)'/><label for='fglgg"+lbtth+"' class='ifdllb'>否</label></td>"
+"                  </tr>"
+"                  <tr class='trLj'>"
+"                      <th>跳转链接：</th>"
+"                      <td><input class='inputtxt lbtlj' name='' type='text' /></td>"
+"                  </tr>"
+"                  <tr class='lbtxzgg' style='display:none;'>"
+"                      <th>选择广告：</th>"
+"                      <td><input type='text' class='jhinp ywinput lbtjhinp' placeholder='请选择广告'  value='' readonly style='width: 80px;line-height: 24px;height: 22px;'><span><a href='javascript:;' class='xxljgg lbtxzgg1' style='line-height:24px; height:24px;'>选择广告</a></span></td></td>"
+"                  </tr>"
+"                  <tr class='lbtxzgg' style='display:none;'>"
+"                      <th>所选名称：</th>"
+"                      <td><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='width: 100px;border: none;'></td>"
+"                  </tr>"
+"<tr>"
+"                  <th>终端列表：</th>"
+"                  <td><select class='selectTypePhoneHref' name='' id=''style=\"padding-left:0px;float: left;width: auto;height:25px;\"><option value='' bind=''>仅对终端广告生效</option><option value=\"1\" "
+ " bindclass=\"phoneList\">列表页</option> <option value=\"2\" "
+ "bindclass=\"phoneDetail\">详情页</option>"
+ "</select></td>        </tr>"
+"                  <tr>"
+"                      <th>轮播图片：</th>"
+"                      <td>"
+"                          <span class='zsp pic_span' >"
+"                          <a href='javascript:;' class='llbtn cllBtn llbtn_xlbt'>浏览</a> "
+"                          <input name='' type='file'  class='upload file' id='txtUploadFile' size='1'/>"
+"                          </span>"
+"                     <div class='yulanImg pic_img '><img src='../../images/decorate/demo.jpg' /></div>"
+"                      </td>"
+"                  </tr>"
+"                   <tr>"
+"                  <th>插码：</th>"
+"                  <td><input class='inputtxt goodCodeInputNewLB' id='goodCodeInputNewLB' name='' type='text' value=''></td>"
+"                </tr>"
+"                  <tr>"
+"                      <th></th>"
+"                      <td class='ydtd'>"
+"                          <a href='javascript:;' onclick='deltab(this)' class='llbtn j-delete llbtn_xlbt cee4358bb'>移除</a>&nbsp;&nbsp;&nbsp;&nbsp;"
+"                          <a href='javascript:;' onclick='qytab(this)' class='llbtn llbtn_xlbt c3c9be1bb'>前移</a>"
+"                      </td>"
+"                  </tr>"
+"              </table>"
+"          </li>");

}
/************================================轮播图片追加弹层 end ==============================******/

function savePolicyFun(a){
    
/*
 * if(vm.Shure=="1"){ a=a+1; }
 */
    // 点击保存之前需要判断是否点击了继续添加按钮
    // console.log($radio.data('waschecked'));
        var policyType=$("#policyType").val();
        var  policyGgwbm=$("#policy"+a).find(".policyGgwbm").val();
        var  planId=$("#policy"+a).find("#planId").val();
        var  startTime =$("#policy"+a).find("#startTime").val();
        var  endTime=$("#policy"+a).find("#endTime").val();
        var   policyId=$("#policy"+a).find("#policyId").val();
        var  jumpType=$("#policy"+a).find("#peizhijumpType").val();
        var   floorType=$("#floorType").val();
        var   ConfigType=$("#policy"+a).find("#ConfigType").val();
        var  jumpAddress=$("#policy"+a).find("#jumpAddress").val();
        var  titleOrName=$("#policy"+a).find("#jumpAddress").next().next().val();
        var  displayWeights=$("#policy"+a).find("#displayWeights").val();
        var  imageName=$("#policy"+a).find("#iconList"+a+"imageName").val();
        var  isHide=$('input[name=isHide]:checked').val();
        var  roomid=$("#decorater_roomid").val();
        var  isShowButton=$("#policy"+a).find("input[name=isShowButtoniop"+a+"]:checked").val();
        var  NextListimageName=$("#policy"+a).find("#NextList"+a+"imageName").val();
        var  NextButton=$("#policy"+a).find("input[name=NextButtoniop"+a+"]:checked").val();
        var popUpButtoniop=$("#policy"+a).find("input[name=popUpButtonLbiop"+a+"]:checked").val();
        var  SecondaryListimageName=$("#policy"+a).find("#SecondaryList"+a+"imageName").val();
        var  handleListimageName=$("#policy"+a).find("#handleList"+a+"imageName").val();
        var  introductioniconListimageName=$("#policy"+a).find("#introductioniconList"+a+"imageName").val();
        var secondIntroductioniconListimageName=$("#policy"+a).find(".introductioniconList"+a+"imgPerview").eq(1).next().next().val();
        var thirdIntroductioniconListimageName=$("#policy"+a).find(".introductioniconList"+a+"imgPerview").eq(2).next().next().val();
		
        var anwz=$("#policy"+a).find("input[name=anwz"+a+"]:checked").val();
        var dbzs=$("#policy"+a).find("input[name=dbzs"+a+"]:checked").val();
        var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
        if(planId==""||planId==undefined){
            alert("请输入策划id！");
            return false;
        }
        if(isHide==""||isHide==undefined){
            alert("请选择是否隐层楼层！");
            return false;
        }
        var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
        if(displayWeights==""||displayWeights==undefined){
            alert("请输入展示权重！");
            return false;
        }else{
            if(!reg.test(displayWeights)) {
                alert("请输入0-100的整数！");
                return false;
            }
        }
        if(startTime==""||startTime==undefined){
            alert("请输入有效期的初始时间！");
            return false;
        }
        if(endTime==""||endTime==undefined){
            alert("请输入有效期的结束时间！");
            return false;
        }
        if(imageName==""||imageName==undefined){
            alert("请上传图片！");
            return false;
        }
        if(isShowButton!="1"){
            if(NextListimageName==""||NextListimageName==undefined){
                alert("请上传下一步按钮图片！");
                return false;
            }
        }
        if(NextButton!="1"){
            if(SecondaryListimageName==""||SecondaryListimageName==undefined){
                alert("请上传二次确认页图片！");
                return false;
            }
            if(handleListimageName==""||handleListimageName==undefined){
                alert("请上传二次确认页办理按钮图片！");
                return false;
            }
        }
        
    $.ajax({
        type : "POST",
        dataType:"json", 
        url : vm.path+"/tWlmDecorate/savePolicy.do",
        data :{'policyType':policyType,'planId':planId,'jumpAddress':jumpAddress,'displayWeights':displayWeights,
            'startTime':startTime,'endTime':endTime,'imageName':imageName,'isHide':isHide,'policyId':policyId,'decorateId':vm.id,'decoraterRoomid':roomid,
            "isShowButton":isShowButton,"NextListimageName":NextListimageName,"NextButton":NextButton,"SecondaryListimageName":SecondaryListimageName,"handleListimageName":handleListimageName,
            "introductioniconListimageName":introductioniconListimageName,"ConfigType":ConfigType,"floorType":floorType,"jumpType":jumpType,"anwz":anwz,"dbzs":dbzs,"popUpButtoniop":popUpButtoniop,
            'titleOrName':titleOrName, "policyGgwbm":policyGgwbm,"secondIntroductioniconListimageName":secondIntroductioniconListimageName,"thirdIntroductioniconListimageName":thirdIntroductioniconListimageName},
        success : function(data) {
            if(data.flag==true){
                toast("保存成功");// 改成小黑窗
                var policyList;
                var policyListbuwei;
                jQuery.ajax({
                    url:vm.path + "/tWlmDecorate/querypolicyiop.do?id="+vm.id+"&roomId="+roomid,
                    type: "POST",// 方法类型
                    dataType:'json',
                    async:false,
                    success:function(data){
                        if(data.flag==true){
                            if(data.isHide==""||data.isHide==undefined){
                                vm.isHide="0";
                            }else {
                                vm.isHide=data.isHide;
                            }
                            policyList=data.policyList;
                            policyListbuwei= data.policyListbuwei;
                        }
                    },
                    // 调用出错执行的函数
                    error: function(){
                        alert("操作异常");
                    } 
                });
                var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
                	var tianzhi="";
                	var sbutton="";
                	var nextbutton="";
                	var ispop="";
                	var policy=policyList
                	var chooseas="";
                	var adoras="";
                	for(var int=0;int<policy.length;int++){
                		var isshowbutt=policy[int][11];
                		var isnext=policy[int][13];
                		var address=policy[int][5];
                		var nextimage=policy[int][12];
                		var nextimage1=policy[int][14];
                		var nextimage2=policy[int][15];
                    	var chooseAdOrSp=policy[int][17];
                    	var popUpButtoniop=policy[int][21];
                    	var policyGgwbm=policy[int][23];
	            		if(!policyGgwbm){
	            			policyGgwbm = "";
	            		}
	            		var secondIntrImgName=policy[int][24];//档位介绍第二图片
	            		var thirdIntrImgName=policy[int][25];//档位介绍第三图片
                		if(chooseAdOrSp=='2'){
                			chooseas="<option value='1'>广告</option><option value='2' selected='selected'>商品</option>";
                			adoras="<span class='jhsp sp' id='jhsp"+int+"'  >选择商品</span>";
                		}else{
                			chooseas="<option value='1' selected='selected'>广告</option><option value='2'>商品</option>";
                			adoras="<span class='jhsp ad' id='jhsp"+int+"'  >选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;' value="+policy[int][22]+">";
                		}
                		
                		var anwz=policy[int][19];//按钮位置
                    	var dbzs=policy[int][20];//底部展示
                    	var anwzDbzs = "<div class='anwzF'> <dl> 	<dt>按钮位置:</dt> 	<dd> <div id='anwzF'> 	<input type='radio' name='anwz"+int+"' value='y' class='anwz'";
                    	if('n' != anwz){
                    		anwzDbzs += "checked";
                    	}
                    	anwzDbzs += "/><label for='anwz1'>中间</label>  	<input type='radio' name='anwz"+int+"' value='n' class='anwz' ";
                    	if('n' == anwz){
                    		anwzDbzs += "checked";
                    	}
                    	anwzDbzs += "/><label for='anwz2'>底部</label> </div> 	</dd> </dl>  </div>  <div class='dbzsF'> <dl> 	<dt>底部展示:</dt> 	<dd> <div id='anwzF'> 	<input type='radio' name='dbzs"+int+"' value='y' class='anwz' ";
                    	if('y' == dbzs){
                    		anwzDbzs += "checked";
                    	}
                    	anwzDbzs += "/><label for='anwz1'>固定</label>  	<input type='radio' name='dbzs"+int+"' value='n'  class='anwz' ";
                    	if('y' != dbzs){
                    		anwzDbzs += "checked";
                    	}
                    	anwzDbzs += "/><label for='anwz2'>悬浮（仅按钮位置底部可用）</label> </div> 	</dd> </dl>  </div>";
                		
                		var shanchu="删除图片";
                		var shanchu1="删除图片";
                		var shanchu2="删除图片";
                		if(nextimage==null||nextimage==''||nextimage==undefined){
                			shanchu="上传图片";
                		}
                		if(nextimage1==null||nextimage1==''||nextimage1==undefined){
                			shanchu1="上传图片";
                		}
                		if(nextimage2==null||nextimage2==''||nextimage2==undefined){
                			shanchu2="上传图片";
                		}
                		if(address==null||address==''||address==undefined){
                			address="";
                		}
                		if(isshowbutt=="1"){
                			 sbutton="<input type='radio' name='isShowButtoniop"+int+"' class='rin'  value='0'/><label for='ifyc1' class='rlb'  >是</label><input type='radio' name='isShowButtoniop"+int+"'  class='rin'  checked='checked'  value='1'/><label for='ifyc1' class='rlb'  >否</label> ";
                		}else{
                			 sbutton="<input type='radio' name='isShowButtoniop"+int+"' class='rin'   checked='checked'  value='0'/><label for='ifyc1' class='rlb'  >是</label><input type='radio' name='isShowButtoniop"+int+"'  class='rin'   value='1'/><label for='ifyc1' class='rlb'  >否</label> ";
                		}
                		if(isnext=="0"){
                			nextbutton="<input type='radio' name='NextButtoniop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >二次确认页</label><input type='radio' name='NextButtoniop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >原二次确认页</label>";
                		}else{
                			nextbutton="<input type='radio' name='NextButtoniop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >二次确认页</label><input type='radio' name='NextButtoniop"+int+"' class='rin'  checked='checked' value='1'/><label for='ifyc2' class='rlb'  >原二次确认页</label>";
                		}
                		if(popUpButtoniop=="0"){
                			ispop="<input type='radio' name='popUpButtonLbiop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
                		}else{
                			ispop="<input type='radio' name='popUpButtonLbiop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiop"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
                		}
                		var xuhao=int+1;
                		tianzhi+="<tr class='clxqq'  id='policy"+int+"'><td><input type='checkbox' value="+policy[int][0]+" name='iop'></td>" +
                				"<td id='xuhaoCount'>"+xuhao+"</td><td><div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div><div><dl><dt>配置类型:</dt>" +
                				"<dd><select id='ConfigType' name='ConfigType' value="+policy[int][17]+" onchange='changeTiaoZhuan("+int+")'>" +
                				chooseas+"</select></dd></dl></div><div><dl>" +
                				"<dt>策划ID:</dt><dd><input type='hidden' name='policyId' id='policyId' value="+policy[int][0]+">" +
                				"<input type='text' placeholder='请输入策划ID' name='planId' id='planId' value="+policy[int][3]+" οnkeyup='this.value=this.value.replace(/[^\d\,]/g,'')'>" +
                				"<span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span></dd></dl></div><div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'>" +
                				"<img src='../../images/images.png' alt='' class='iconList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='iconList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='iconList"+int+"opacityP'  onclick="+"deleteImg('iconList"+int+"')>删除图片</p><input type='hidden' name='iconListimageName' id='iconList"+int+"imageName' value="+policy[int][4]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconList"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
                				"<div  ><dl><dt>档位介绍图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='introductioniconList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][16]+"' alt=''  class='introductioniconList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='introductioniconList"+int+"opacityP' onclick="+"deleteImgRemove('introductioniconList"+int+"','')>删除图片</p><input type='hidden' name='introductioniconListimageName' id='introductioniconList"+int+"imageName' value="+policy[int][16]+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2)' name='UploadBtn' id='introductioniconList"+int+"'></div>" ;
                				if(secondIntrImgName){
                        			tianzhi+=" <div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='introductioniconList"+int+"imagesZw'><img src='"+vm.path+"/"+secondIntrImgName+"' alt=''  class='introductioniconList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='introductioniconList"+int+"1opacityP' onclick="+"deleteImgRemove('introductioniconList"+int+"','1')>删除图片</p><input type='hidden' name='introductioniconListimageName' id='introductioniconList"+int+"imageName' value="+secondIntrImgName+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2,1)' name='UploadBtn' id='introductioniconList"+int+"1'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('introductioniconList"+int+"',1);showid('ts_ljzs')"+" id='introductioniconListfl"+int+"' title='图片'>预览</a></div>";
                        		}
                        		if(thirdIntrImgName){
                        			tianzhi+= "<div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='introductioniconList"+int+"imagesZw'><img src='"+vm.path+"/"+thirdIntrImgName+"' alt=''  class='introductioniconList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='introductioniconList"+int+"2opacityP' onclick="+"deleteImgRemove('introductioniconList"+int+"','2')>删除图片</p><input type='hidden' name='introductioniconListimageName' id='introductioniconList"+int+"imageName' value="+thirdIntrImgName+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2,2)' name='UploadBtn' id='introductioniconList"+int+"2'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('introductioniconList"+int+"',2);showid('ts_ljzs')"+" id='introductioniconListfl"+int+"' title='图片'>预览</a></div>";
                        		}
                		tianzhi+="<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>"+
                        		"<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' value="+address+">"+adoras+"</dd></dl></div>" +
                				"<div><dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>" +
                				"<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTime' name='startTime' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTime' name='endTime' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+">											</dd>										</dl>									</div>" +
                				"<div  ><dl><dt>是否显示下一步按钮:</dt><dd class='yxsjdd'>"+sbutton+"</dd></dl></div>" + anwzDbzs +
                				"<div  ><dl><dt>下一步按钮跳转:</dt><dd class='yxsjdd'><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='NextList"+int+"imagesZw'>	<img src='"+vm.path+"/"+policy[int][12]+"' alt=''  class='NextList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='NextList"+int+"opacityP' onclick="+"deleteImg('NextList"+int+"')>"+shanchu+"</p><input type='hidden'  name='NextListimageName' id='NextList"+int+"imageName' value="+policy[int][12]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='NextList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('NextList"+int+"');showid('ts_ljzs')"+" id='NextListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
                				"<div  ><dl><dt>下一步按钮跳转:</dt><dd class='yxsjdd'>"+nextbutton+"</dd>	</dl></div>" +
                				"<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                				"<div  ><dl><dt>二次确认页图片:</dt><dd class='yxsjdd'><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='SecondaryList"+int+"imagesZw'>	<img src='"+vm.path+"/"+policy[int][14]+"' alt=''  class='SecondaryList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='SecondaryList"+int+"opacityP' onclick="+"deleteImg('SecondaryList"+int+"')>"+shanchu1+"</p><input type='hidden' name='SecondaryListimageName' id='SecondaryList"+int+"imageName' value="+policy[int][14]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='SecondaryList"+int+"'>	</div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('SecondaryList"+int+"');showid('ts_ljzs')"+" id='SecondaryListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd>	</dl></div>" +
                				"<div ><dl><dt>二次确认办理按钮:</dt><dd class='yxsjdd'>	<div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='handleList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][15]+"' alt=''  class='handleList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='handleList"+int+"opacityP' onclick="+"deleteImg('handleList"+int+"')>"+shanchu2+"</p><input type='hidden' name='handleListimageName' id='handleList"+int+"imageName' value="+policy[int][15]+">	<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='handleList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('handleList"+int+"');showid('ts_ljzs')"+" id='handleListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div></td><td><a href='javascript:;' class='submitted saven' onclick='savePolicyFun("+int+")'>保存</a></td></tr>";
                	}
                	var tianzhi2=tbody+tianzhi+"</tbody>";
                	console.log(tianzhi2);
                	 $('#htmlConCspz table').html('').prepend(tianzhi2);
            }else if (data.code='1'){
                toast(decodeURIComponent(data.msg));
            }else{
                toast("网络故障");// 改成小黑窗
            }
        }
    });
    
}

function savePolicyFunpp(a){
			var roomType=$("#roomType").val();//iop 房间类型
			var goodcodeinputsign=$("#policypp"+a).find(".policyGgwbm").val();//插码
            var policyType=$("#policyType").val();
            var  planId=$("#policypp"+a).find("#planId").val();
            var  startTime =$("#policypp"+a).find("#startTimepp").val();
            var  endTime=$("#policypp"+a).find("#endTimepp").val();
            var   policyId=$("#policypp"+a).find("#policyId").val();
            var   jumpType=$("#policypp"+a).find("#peizhijumpType").val();
            var   floorType=$("#floorType").val();
            var   jumpAddress=$("#policypp"+a).find("#jumpAddress").val();
            var   titleOrName=$("#policypp"+a).find("#jumpAddress").next().next().val();
            var   displayWeights=$("#policypp"+a).find("#displayWeights").val();
            var   imageName=$("#policypp"+a).find("#iconListpp"+a+"imageName").val();
            var popUpButtoniop=$("#policypp"+a).find("input[name=popUpButtoniop"+a+"]:checked").val();
            var   isHide=$('input[name=isHidepp]:checked').val();
            var   roomid=$("#decorater_roomid").val();
            //集团IOP
            if($("input[name='tjiop']:checked").val() ==='2'){
                policyType="2";
                policyId=$("#policyIop"+a).find("#policyId").val();
                planId=$("#policyIop"+a).find("#planId"+a).val();
                goodcodeinputsign=$("#policyIop"+a).find(".policyGgwbm").val();//插码
                startTime =$("#policyIop"+a).find("#startTimepp"+a).val();
                endTime=$("#policyIop"+a).find("#endTimepp"+a).val();
                jumpAddress=$("#policyIop"+a).find("#jumpAddressIop"+a).val();
                imageName=$("#policyIop"+a).find("#iopPathImg").val();
                displayWeights=$("#policyIop"+a).find("#displayWeightsIop").val();
                popUpButtoniop=$("#policyIop"+a).find("input[name=popUpButtoniop"+a+"]:checked").val();
            }

            if(displayWeights==""||displayWeights==undefined){
                alert("请输入权重！");
                return false;
            }else{
                var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
                if(!reg.test(displayWeights)) {
                    alert("请输入0-100的整数！");
                    return false;
                }
            }
            if(startTime==""||startTime==undefined){
                alert("请输入有效期的初始时间！");
                return false;
            }
            if(endTime==""||endTime==undefined){
                alert("请输入有效期的结束时间！");
                return false;
            }
            if(imageName==""||imageName==undefined){
                alert("请上传图片！");
                return false;
            }
            if(!roomType){
            	if(isHide==""||isHide==undefined){
                    alert("请选择是否隐藏楼层！");
                    return false;
                }
            }
            if(!goodcodeinputsign){
   				 alert("请输入广告位编码！");
   				 return;
   			 }
            if(planId==""||planId==undefined){
                alert("请输入策划id！");
                return false;
            }
        $.ajax({
            type : "POST",
            dataType:"json", 
            url : vm.path+"/tWlmDecorate/savePolicy.do",
            data :{'policyType':policyType,'planId':planId,'jumpAddress':jumpAddress,'displayWeights':displayWeights,
                'startTime':startTime,'endTime':endTime,'imageName':imageName,'isHide':isHide,'policyId':policyId,'decorateId':vm.id,'decoraterRoomid':roomid,"floorType":floorType,
                "jumpType":jumpType,"roomType":roomType,"popUpButtoniop":popUpButtoniop,'titleOrName':titleOrName,'policyGgwbm':goodcodeinputsign},
            success : function(data) {
                if(data.flag==true){
                    toast("保存成功");// 改成小黑窗
                    var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
                    var policy;
                    var policyIopList;
                    jQuery.ajax({
                        url:vm.path + "/tWlmDecorate/querypolicyiop.do?id="+vm.id+"&roomId="+roomid,
                        type: "POST",// 方法类型
                        dataType:'json',
                        async:false,
                        success:function(data){
                            if(data.flag==true){
                            	vm.isHide=data.isHide;
                                policy=data.policyList;
                                policyIopList = data.policyIopList
                            }
                        },
                        // 调用出错执行的函数
                        error: function(){
                            alert("操作异常");
                        } 
                    });
                    	var tianzhi="";
                    	var ispop="";
                    	if(policyType!='2'){
                            if(policy!=null){
                                for(var int=0;int<policy.length;int++){
                                    var xuhao=int+1;
                                    var address=policy[int][5];
                                    var popUpButtoniop=policy[int][21];
                                    var policyGgwbm=policy[int][23];
                                    if(!policyGgwbm){
                                        policyGgwbm = "";
                                    }
                                    if(address==null||address==''||address==undefined){
                                        address="";
                                    }
                                    if(popUpButtoniop=="0"){
                                        ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
                                    }else{
                                        ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
                                    }
                                    tianzhi+="<tr class='clxqq' id='policypp"+int+"'>" +
                                        " <td><input type='checkbox' value="+policy[int][0]+" name='ioppp'></td> " +
                                        "<td id='xuhaoCount'>"+xuhao+"</td> <td>" +
                                        "<div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+"></dd></dl></div>"+
                                        "<div> <dl> <dt>策划ID:</dt> <dd> <input type='hidden' name='policyId' id='policyId' value="+policy[int][0]+"> <input type='text' placeholder='请输入策划ID' name='planId' id='planId' value="+policy[int][3]+" οnkeyup='this.value=this.value.replace(/[^\d\,]/g,'')'> <span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span></dd></dl></div>"+
                                        "<div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='iconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='iconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='iconListpp"+int+"opacityP' onclick="+"deleteImg('iconListpp"+int+"')>删除图片</p><input type='hidden' name='iconListppimageName' id='iconListpp"+int+"imageName' value="+policy[int][4]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>"+
                                        "<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'  >选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'  value='"+policy[int][22]+"'>	</dd>	</dl></div>"+
                                        "<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                                        "<div>	<dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>"+
                                        "<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTimepp' name='startTimepp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTimepp' name='endTimepp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div></td>"+
                                        "<td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunpp("+int+")'>保存</a></td></tr>"
                                }
                                var tianzhi2=tbody+tianzhi+"</tbody>";
                                $('#htmlConCspzpp table').html('').prepend(tianzhi2);
                            }
                        }else{
                            $('.cspzedit-layer .close1pp').trigger("click");
                        }

                }else if (data.code='1'){
                    toast(decodeURIComponent(data.msg));
                }else{
                    toast("网络故障");// 改成小黑窗
                }
                
            }
        });
        if(roomType){//房间类型
			 $("#"+roomid).find("a").attr('goodCodeInput',goodcodeinputsign);
			 $("#"+roomid).find("a").attr('goodcodeinputsign','goodcodeinputsign')
		 }
        
    }

function savePolicyFunbuwei(a){
    
    /*
     * if(vm.Shure=="1"){ a=a+1; }
     */
        // 点击保存之前需要判断是否点击了继续添加按钮
        // console.log($radio.data('waschecked'));
        	var policyGgwbm=$("#policybuwei"+a).find(".policyGgwbm").val();
            var policyType=$("#policyType").val();
            var isHide="";
            var planId="";
            var startTime =$("#policybuwei"+a).find("#startTime1").val();
            var endTime=$("#policybuwei"+a).find("#endTime1").val();
            var policyId=$("#policybuwei"+a).find("#buweipolicyId").val();
            var ConfigType=$("#policybuwei"+a).find("#ConfigType").val();
            var jumpType=$("#policybuwei"+a).find("#peizhijumpType").val();
            var floorType=$("#floorType").val();
            var jumpAddress=$("#policybuwei"+a).find("#jumpAddress").val();
            var titleOrName=$("#policybuwei"+a).find("#jumpAddress").next().next().val();
            var displayWeights=$("#policybuwei"+a).find("#displayWeights").val();
            var imageName=$("#policybuwei"+a).find("#buweiiconList"+a+"imageName").val();
            var roomid=$("#decorater_roomid").val();
            var isShowButton=$("#policybuwei"+a).find("input[name=isShowButtonbuwei"+a+"]:checked").val();
            var NextListimageName=$("#policybuwei"+a).find("#buweiNextList"+a+"imageName").val();
            var NextButton=$("#policybuwei"+a).find("input[name=NextButtonbuwei"+a+"]:checked").val();
            var popUpButtoniop=$("#policybuwei"+a).find("input[name=popUpButtonLbiopbuwei"+a+"]:checked").val();
            var SecondaryListimageName=$("#policybuwei"+a).find("#buweiSecondaryList"+a+"imageName").val();
            var handleListimageName=$("#policybuwei"+a).find("#buweihandleList"+a+"imageName").val();
            var introductioniconListimageName=$("#policybuwei"+a).find("#buweiintroductionList"+a+"imageName").val();
            var secondIntroductioniconListimageName=$("#policybuwei"+a).find(".buweiintroductionList"+a+"imgPerview").eq(1).next().next().val();
            var thirdIntroductioniconListimageName=$("#policybuwei"+a).find(".buweiintroductionList"+a+"imgPerview").eq(2).next().next().val();
            var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
            var anwz=$("#policybuwei"+a).find("input[name=anwz"+a+"]:checked").val();
            var dbzs=$("#policybuwei"+a).find("input[name=dbzs"+a+"]:checked").val();
            if(!policyGgwbm){
                alert("请输入广告位编码！");
                return false;
            }
            if(displayWeights==""||displayWeights==undefined){
                alert("请输入展示权重！");
                return false;
            }else{
                if(!reg.test(displayWeights)) {
                    alert("请输入0-100的整数！");
                    return false;
                }
            }
            if(startTime==""||startTime==undefined){
                alert("请输入有效期的初始时间！");
                return false;
            }
            if(endTime==""||endTime==undefined){
                alert("请输入有效期的结束时间！");
                return false;
            }
            if(imageName==""||imageName==undefined){
                alert("请上传图片！");
                return false;
            }
            if(isShowButton!="1"){
                if(NextListimageName==""||NextListimageName==undefined){
                    alert("请上传下一步按钮图片！");
                    return false;
                }
            }
            if(NextButton!="1"){
                if(SecondaryListimageName==""||SecondaryListimageName==undefined){
                    alert("请上传二次确认页图片！");
                    return false;
                }
                if(handleListimageName==""||handleListimageName==undefined){
                    alert("请上传二次确认页办理按钮图片！");
                    return false;
                }
            }
        $.ajax({
            type : "POST",
            dataType:"json", 
            url : vm.path+"/tWlmDecorate/savePolicy.do",
            data :{'policyType':policyType,'planId':planId,'jumpAddress':jumpAddress,'displayWeights':displayWeights,
                'startTime':startTime,'endTime':endTime,'imageName':imageName,'isHide':isHide,'policyId':policyId,'decorateId':vm.id,'decoraterRoomid':roomid,
                "isShowButton":isShowButton,"NextListimageName":NextListimageName,"NextButton":NextButton,"SecondaryListimageName":SecondaryListimageName,"handleListimageName":handleListimageName,
                "introductioniconListimageName":introductioniconListimageName,"ConfigType":ConfigType,"floorType":floorType,"jumpType":jumpType,"anwz":anwz,"dbzs":dbzs,"popUpButtoniop":popUpButtoniop,'titleOrName':titleOrName
                ,"policyGgwbm":policyGgwbm,"secondIntroductioniconListimageName":secondIntroductioniconListimageName,"thirdIntroductioniconListimageName":thirdIntroductioniconListimageName},
            success : function(data) {
                if(data.flag==true){
                    toast("保存成功");// 改成小黑窗
                    var policyListbuwei;
                    jQuery.ajax({
                        url:vm.path + "/tWlmDecorate/querypolicyiop.do?id="+vm.id+"&roomId="+roomid,
                        type: "POST",// 方法类型
                        dataType:'json',
                        async:false,
                        success:function(data){
                            if(data.flag==true){
                            	vm.isHide=data.isHide;
                                policyListbuwei= data.policyListbuwei;
                            }
                        },
                        // 调用出错执行的函数
                        error: function(){
                            alert("操作异常");
                        } 
                    });
                    var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
                    	var tianzhi="";
                    	var sbutton="";
                    	var ispop="";
                    	var nextbutton="";
                    	var policy=policyListbuwei;
                    	var chooseas="";
                    	var adoras="";
                    	for(var int=0;int<policy.length;int++){
                    		var policyGgwbm=policy[int][23];
		            		if(!policyGgwbm){
		            			policyGgwbm = "";
		            		}
		            		var secondIntrImgName=policy[int][24];//档位介绍第二图片
		            		var thirdIntrImgName=policy[int][25];//档位介绍第三图片
                    		var isshowbutt=policy[int][11];
                    		var isnext=policy[int][13];
                    		var address=policy[int][5];
                    		var nextimage=policy[int][12];
                    		var nextimage1=policy[int][14];
                    		var nextimage2=policy[int][15];
                        	var chooseAdOrSp=policy[int][17];
                        	var popUpButtoniop=policy[int][21];
                        	
                    		if(chooseAdOrSp=='2'){
                    			chooseas="<option value='1'>广告</option><option value='2' selected='selected'>商品</option>";
                    			adoras="<span class='jhsp sp' id='jhsp"+int+"'  >选择商品</span>";
                    		}else{
                    			chooseas="<option value='1' selected='selected'>广告</option><option value='2'>商品</option>";
                    			adoras="<span class='jhsp ad' id='jhsp"+int+"'  >选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;' value="+policy[int][22]+">";
                    		}

                        	var anwz=policy[int][19];//按钮位置
                        	var dbzs=policy[int][20];//底部展示
                        	var anwzDbzs = "<div class='anwzF'> <dl> 	<dt>按钮位置:</dt> 	<dd> <div id='anwzF'> 	<input type='radio' name='anwz"+int+"' value='y' class='anwz'";
                        	if('n' != anwz){
                        		anwzDbzs += "checked";
                        	}
                        	anwzDbzs += "/><label for='anwz1'>中间</label>  	<input type='radio' name='anwz"+int+"' value='n' class='anwz' ";
                        	if('n' == anwz){
                        		anwzDbzs += "checked";
                        	}
                        	anwzDbzs += "/><label for='anwz2'>底部</label> </div> 	</dd> </dl>  </div>  <div class='dbzsF'> <dl> 	<dt>底部展示:</dt> 	<dd> <div id='anwzF'> 	<input type='radio' name='dbzs"+int+"' value='y' class='anwz' ";
                        	if('y' == dbzs){
                        		anwzDbzs += "checked";
                        	}
                        	anwzDbzs += "/><label for='anwz1'>固定</label>  	<input type='radio' name='dbzs"+int+"' value='n'  class='anwz' ";
                        	if('y' != dbzs){
                        		anwzDbzs += "checked";
                        	}
                        	anwzDbzs += "/><label for='anwz2'>悬浮（仅按钮位置底部可用）</label> </div> 	</dd> </dl>  </div>";
                    		
                        	var shanchu="删除图片";
                    		var shanchu1="删除图片";
                    		var shanchu2="删除图片";
                    		if(nextimage==null||nextimage==''||nextimage==undefined){
                    			shanchu="上传图片";
                    		}
                    		if(nextimage1==null||nextimage1==''||nextimage1==undefined){
                    			shanchu1="上传图片";
                    		}
                    		if(nextimage2==null||nextimage2==''||nextimage2==undefined){
                    			shanchu2="上传图片";
                    		}
                    		if(address==null||address==''||address==undefined){
                    			address="";
                    		}
                    		if(isshowbutt=="1"){
                    			 sbutton="<input type='radio' name='isShowButtonbuwei"+int+"' class='rin'  value='0'/><label for='ifyc1' class='rlb'  >是</label><input type='radio' name='isShowButtonbuwei"+int+"'  class='rin'  checked='checked'  value='1'/><label for='ifyc1' class='rlb'  >否</label> ";
                    		}else{
                    			 sbutton="<input type='radio' name='isShowButtonbuwei"+int+"' class='rin'   checked='checked'  value='0'/><label for='ifyc1' class='rlb'  >是</label><input type='radio' name='isShowButtonbuwei"+int+"'  class='rin'   value='1'/><label for='ifyc1' class='rlb'  >否</label> ";
                    		}
                    		if(isnext=="0"){
                    			nextbutton="<input type='radio' name='NextButtonbuwei"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >二次确认页</label><input type='radio' name='NextButtonbuwei"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >原二次确认页</label>";
                    		}else{
                    			nextbutton="<input type='radio' name='NextButtonbuwei"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >二次确认页</label><input type='radio' name='NextButtonbuwei"+int+"' class='rin'  checked='checked' value='1'/><label for='ifyc2' class='rlb'  >原二次确认页</label>"
                    		}
                    		if(popUpButtoniop=="0"){
                    			ispop="<input type='radio' name='popUpButtonLbiopbuwei"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiopbuwei"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
                    		}else{
                    			ispop="<input type='radio' name='popUpButtonLbiopbuwei"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiopbuwei"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
                    		}
                    		var xuhao=int+1;
                    		tianzhi+="<tr class='clxqq'  id='policybuwei"+int+"'><td><input type='checkbox' value="+policy[int][0]+" name='buwei'></td>" +
                    				"<td>"+xuhao+"</td><td> <div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div><div  ><dl ><dt>配置类型:</dt><dd><select id='ConfigType' name='ConfigType' value="+policy[int][17]+" onchange='changeTiaoZhuan("+int+")'>" +
                    				chooseas+"</select></dd></dl></div>" +
                    				"<div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiiconList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='buweiiconList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiiconList"+int+"opacityP' onclick="+"deleteImg('buweiiconList"+int+"')>删除图片</p><input type='hidden' name='buweipolicyId' id='buweipolicyId' value="+policy[int][0]+">  <input type='hidden' name='buweiiconListimageName' value="+policy[int][4]+" id='buweiiconList"+int+"imageName'><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconList"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
                    				"<div  ><dl><dt>档位介绍图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiintroductionList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][16]+"' alt=''  class='buweiintroductionList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiintroductionList"+int+"opacityP' onclick="+"deleteImgRemove('buweiintroductionList"+int+"','0')>删除图片</p><input type='hidden' name='buweiintroductionListimageName'  id='buweiintroductionList"+int+"imageName' value="+policy[int][16]+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2)' name='UploadBtn' id='buweiintroductionList"+int+"'></div>" ;
		                    		if(secondIntrImgName){
		                    			tianzhi+=" <div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiintroductionList"+int+"imagesZw'><img src='"+vm.path+"/"+secondIntrImgName+"' alt=''  class='buweiintroductionList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiintroductionList"+int+"1opacityP' onclick="+"deleteImgRemove('buweiintroductionList"+int+"','1')>删除图片</p><input type='hidden' name='buweiintroductionListimageName' id='buweiintroductionList"+int+"imageName' value="+secondIntrImgName+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2,1)' name='UploadBtn' id='buweiintroductionList"+int+"1'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiintroductionList"+int+"',1);showid('ts_ljzs')"+" id='buweiintroductionListfl"+int+"' title='图片'>预览</a></div>";
		                    		}
		                    		if(thirdIntrImgName){
		                    			tianzhi+= "<div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiintroductionList"+int+"imagesZw'><img src='"+vm.path+"/"+thirdIntrImgName+"' alt=''  class='buweiintroductionList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiintroductionList"+int+"2opacityP' onclick="+"deleteImgRemove('buweiintroductionList"+int+"','2')>删除图片</p><input type='hidden' name='buweiintroductionListimageName' id='buweiintroductionList"+int+"imageName' value="+thirdIntrImgName+"?"+int+"><input type='file' multiple class='imgInput' onchange='uploadPolicyImageForMultiple(this,0,0,2,2)' name='UploadBtn' id='buweiintroductionList"+int+"2'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiintroductionList"+int+"',2);showid('ts_ljzs')"+" id='buweiintroductionListfl"+int+"' title='图片'>预览</a></div>";
		                    		}
                    		tianzhi+="<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>"+
                            		"<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress' value="+address+">"+adoras+"</dd></dl></div>" +
                    				"<div><dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+">				</dd></dl></div>" +
                    				"<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTime1' name='startTime1' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTime1' name='endTime1' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div>	" +
                    				"<div  >	<dl><dt>是否显示下一步按钮:</dt><dd class='yxsjdd'>"+sbutton+"</dd></dl></div>" + anwzDbzs +
                    				"<div  ><dl><dt>下一步按钮跳转:</dt><dd class='yxsjdd'><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiNextList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][12]+"' alt=''  class='buweiNextList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiNextList"+int+"opacityP' onclick="+"deleteImg('buweiNextList"+int+"')>"+shanchu+"</p><input type='hidden' name='buweiNextListimageName' id='buweiNextList"+int+"imageName' value="+policy[int][12]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiNextList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiNextList"+int+"');showid('ts_ljzs')"+" id='buweiNextListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
                    				"<div  ><dl><dt>下一步按钮跳转:</dt><dd class='yxsjdd'>"+nextbutton+"</dd>	</dl></div>" +
                    				"<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                    				"<div  ><dl><dt>二次确认页图片:</dt><dd class='yxsjdd'><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiSecondaryList"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][14]+"' alt=''  class='buweiSecondaryList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweiSecondaryList"+int+"opacityP' onclick="+"deleteImg('buweiSecondaryList"+int+"')>"+shanchu1+"</p><input type='hidden' name='buweiSecondaryListimageName' id='buweiSecondaryList"+int+"imageName' value="+policy[int][14]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiSecondaryList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweiSecondaryList"+int+"');showid('ts_ljzs')"+" id='buweiSecondaryListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
                    				"<div  ><dl><dt>二次确认办理按钮:</dt><dd class='yxsjdd'><div style='overflow:hidden;'><div class='uploadImg normalData'><img src='../../images/images.png' alt='' :class='['buweihandleList'+int+'imagesZw']'><img src='"+vm.path+"/"+policy[int][15]+"' alt=''  class='buweihandleList"+int+"imgPerview'><p class='opacityP j-deleteImg'  id='buweihandleList"+int+"opacityP' onclick="+"deleteImg('buweihandleList"+int+"')>"+shanchu2+"</p><input type='hidden' name='buweihandleListimageName' id='buweihandleList"+int+"imageName' value="+policy[int][15]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweihandleList' id='buweihandleList"+int+"'></div><a class='llbtn c3c9be1bb fl' style='margin-top:-28px; margin-left:150px;'  onClick="+"assignment('buweihandleList"+int+"');showid('ts_ljzs')"+" id='buweihandleListfl"+int+"' title='图片'>预览</a></div><span>注：建议上传宽度750xp像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div></td>" +
                    				"<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuwei("+int+")'>保存</a></td></tr>";
                    	}
                    	var tianzhi2=tbody+tianzhi+"</tbody>";
                    	 $('#htmlConCspz2 table').html('').prepend(tianzhi2);
                }else if (data.code='1'){
                    toast(decodeURIComponent(data.msg));
                }else{
                    toast("网络故障");// 改成小黑窗
                }
            }
        });
        
    }

function savePolicyFunbuweipp(a){
	var goodcodeinputsign=$("#policybuweipp"+a).find(".policyGgwbm").val();//插码
            var policyType=$("#policyType").val();
            var roomType=$("#roomType").val();
            var isHide="";
            var planId="";
            var startTime =$("#policybuweipp"+a).find("#startTime1pp").val();
            var endTime=$("#policybuweipp"+a).find("#endTime1pp").val();
            var policyId=$("#policybuweipp"+a).find("#buweipolicyId").val();
            var jumpType=$("#policybuweipp"+a).find("#peizhijumpType").val();
            var floorType=$("#floorType").val();
            var jumpAddress=$("#policybuweipp"+a).find("#jumpAddress").val();
            var   titleOrName=$("#policybuweipp"+a).find("#jumpAddress").next().next().val();
            var  displayWeights=$("#policybuweipp"+a).find("#displayWeights").val();
            var  imageName=$("#policybuweipp"+a).find("#buweiiconListpp"+a+"imageName").val();
            var popUpButtoniop=$("#policybuweipp"+a).find("input[name=popUpButtoniopbuwei"+a+"]:checked").val();
            var  roomid=$("#decorater_roomid").val();
            var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
            if(displayWeights==""||displayWeights==undefined){
                alert("请输入权重！");
                return false;
            }else{
                if(!reg.test(displayWeights)) {
                    alert("权重值请输入0-100的整数！");
                    return false;
                }
            }
            if(startTime==""||startTime==undefined){
                alert("请输入有效期的初始时间！");
                return ;
            }
            if(endTime==""||endTime==undefined){
                alert("请输入有效期的结束时间！");
                return false;
            }
            if(imageName==""||imageName==undefined){
                alert("请上传图片！");
                return false;
            }
        $.ajax({
            type : "POST",
            dataType:"json", 
            url : vm.path+"/tWlmDecorate/savePolicy.do",
            data :{'policyType':policyType,'planId':planId,'jumpAddress':jumpAddress,'displayWeights':displayWeights,
                'startTime':startTime,'endTime':endTime,'imageName':imageName,'isHide':isHide,'policyId':policyId,'decorateId':vm.id,'decoraterRoomid':roomid,"floorType":floorType,
            'jumpType':jumpType,"roomType":roomType,"popUpButtoniop":popUpButtoniop,'titleOrName':titleOrName,"policyGgwbm": goodcodeinputsign},
            success : function(data) {
                if(data.flag==true){
                    toast("保存成功");// 改成小黑窗
                    var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
                    var policyListbuwei;
                    jQuery.ajax({
                        url:vm.path + "/tWlmDecorate/querypolicyiop.do?id="+vm.id+"&roomId="+roomid,
                        type: "POST",// 方法类型
                        dataType:'json',
                        async:false,
                        success:function(data){
                            if(data.flag==true){
                            	vm.isHide=data.isHide;
                                policyListbuwei= data.policyListbuwei;
                            }
                        },
                        // 调用出错执行的函数
                        error: function(){
                            alert("操作异常");
                        } 
                    });
                    	var tianzhi="";
                    	var ispop="";
                    	var policy=policyListbuwei;
                    	for(var int=0;int<policy.length;int++){
                    		var xuhao=int+1;
                    		var address=policy[int][5];
                    		var popUpButtoniop=policy[int][21];
                    		var policyGgwbm=policy[int][23];
		            		if(!policyGgwbm){
		            			policyGgwbm = "";
		            		}
                    		if(address==null||address==''||address==undefined){
                    			address="";
                    		}
                    		if(popUpButtoniop=="0"){
                    			ispop="<input type='radio' name='popUpButtoniopbuwei"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniopbuwei"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
                    		}else{
                    			ispop="<input type='radio' name='popUpButtoniopbuwei"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniopbuwei"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
                    		}
                    		tianzhi+="<tr class='clxqq'  id='policybuweipp"+int+"'><td><input type='checkbox' value="+policy[int][0]+" name='buweipp'></td>" +
                    				"<td>"+xuhao+"</td><td> <div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+"></dd></dl></div><div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiiconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='buweiiconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='buweiiconListpp"+int+"opacityP' onclick="+"deleteImg('buweiiconListpp"+int+"')>删除图片</p><input type='hidden' name='policyId' id='buweipolicyId' value="+policy[int][0]+"><input type='hidden' name='buweiiconListppimageName' value="+policy[int][4]+" id='buweiiconListpp"+int+"imageName'><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
                    				"<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'>选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'value="+policy[int][22]+"></dd></dl></div>" +
                    				"<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                    				"<div><dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>" +
                    				"<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTime1pp' name='startTime1pp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTime1pp' name='endTime1pp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div>	</td>" +
                    				"<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuweipp("+int+")'>保存</a></td>							</tr>											"
                    	}
                    	var tianzhi2=tbody+tianzhi+"</tbody>";
                    	 $('#htmlConCspz2pp table').html('').prepend(tianzhi2);
                }else if (data.code='1'){
                    toast(decodeURIComponent(data.msg));
                }else{
                    toast("网络故障");// 改成小黑窗
                }
            }
        });
        if(roomType){//房间类型
			 $("#"+roomid).find("a").attr('goodCodeInput',goodcodeinputsign);
			 $("#"+roomid).find("a").attr('goodcodeinputsign','goodcodeinputsign')
		 }
    }


function upClick(obj) {
    var targObj = obj.find('input:file');
    document.getElementById(targObj.attr("id")).click();
}

function queryVideo(){
    var form = {
            title : $("#titleVideo").val()
    }
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryVideo.do" ,// url
        type: "POST",// 方法类型
        data: form,//$('#queryadid1').serialize(),
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.videoList=data.videoList;
                vm.limit4=data.limit;
                vm.pageObject4=data.pageObject;
                vm.rowsPerPage4=data. pageObject.rowsPerPage;
            }
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}


function queryPolicyAd(){
    
    var form = {
            title : $("#title").val() || '',
            goodsName : $("#goodsName").val() || '',
            type : $("#type").val() || '',
            startTime3 : $("#startTime3").val() || '',
            endTime3 : $("#endTime3").val() || ''
    }
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryPolicyAd.do" ,// url
        type: "POST",// 方法类型
        data: form,//$('#queryadid1').serialize(),
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.adList=data.adList;
                vm.limit=data.limit;
                vm.pageObject=data.pageObject;
                vm.rowsPerPage=data. pageObject.rowsPerPage;
                vm.type=data.type;
            }
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}
/** *******************************集团iopstart*********************************** **/

function queryPolicyIops(){
    var form = {
        policyIopId : $("#policyIopId").val() || '',
        productIopId : $("#productIopId").val() || '',
        startTime4 : $("#startTime4").val() || '',
        endTime4 : $("#endTime4").val() || ''
    }
    jQuery.ajax({
        url: vm.path+"/tWlmDecorateIop/queryGroupIop.do?v="+(new Date()).getTime(),
        type: "POST",// 方法类型
        data: form,//$('#queryadid1').serialize(),
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.list = data.list;
                vm.limitIop=data.limit;
                vm.pageObjectIop=data.pageObject;
                vm.rowsPerPageIop=data. pageObject.rowsPerPage;
                vm.rowinitIop= data.rowinitIop;
            }
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        }
    });
}

// 集团IOP选择聚合页
$(document).on('click','.jhyclick',function(e) {
    showJtIop('jtIop');
    $(".tiaoType").html('选择集团IOP推荐');
    $(".pmdtext").html('聚合页');
    $(".showiop").hide();
    $(".showpmd").show();
    $("#floorType").val('pmdjh');
    $(this).parent().find('.jpinput').attr('id','pmdjumpaddr')
    var id= this.id;
    var zhi=$(this).parent().find('.jpinput').val();
    huixianJH(zhi);
    huixanzhi=zhi;
    $("#jhspId").val(id);
    $('.modals_cspzjhy').fadeIn(200, function() {// 展示参数配置弹层
        var layer=$('.cspzedit-layer',this);
        layer.css({
            'margin-top':-(layer.height())/2,
            'margin-left':-(layer.width())/2
        }).fadeIn(100);// 弹窗位置设置
        // iop推荐弹窗拼串开始
        $('#htmlConjh').show();// 默认展示IOP推荐tab
    });

});
function chooseIop(item){
    var str0=item[0];
    var str1=item[2];
    var str3=item[3];
    var str4=item[4];
    var str5=item[5];
    var str7=item[7];

    var jhspId = $("#jhspId").val();
    var a = jhspId.substr(jhspId.length-1,jhspId.length);

    var policyStateName = "无";
    if(str5=="1"){
        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
    }else  if(str5=="2"){
        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
    }else  if(str5=="3"){
        policyStateName = "有效";
    }else  if(str5=="4"){
        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
    }else  if(str5=="5"){
        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
    }else  if(str5=="6"){
        policyStateName = "<span style='display: inline-block; text-align:left;width:100%;'>失效</span>";
    }
    
    $("#policyIop"+a).find("#iopPathImg").val(str0);
    $("#policyIop"+a).find("#iopPath"+a).attr("src",'/lmH/tWlmDecorate/findBlocIopImgById.do?policyId='+str0);
    $("#policyIop"+a).find("#planId"+a).val(str1);
    $("#policyIop"+a).find("#planId"+a).html(str1);

    $("#policyIop"+a).find("#startTimepp"+a).val(str3);
    $("#policyIop"+a).find("#startTimepp"+a).html(str3);
    $("#policyIop"+a).find("#endTimepp"+a).val(str4);
    $("#policyIop"+a).find("#endTimepp"+a).html(str4);
    $("#policyIop"+a).find("#jumpAddressIop"+a).val(str7);
    $("#policyIop"+a).find("#jumpAddressIop"+a).html(str7);

    $("#policyIop"+a).find("#displayWeightsIop").val(100);
    $("#policyIop"+a).find("#displayWeightsIop").html(100);

    $("#policyIop"+a).find('td').eq(3).html(policyStateName);
    //赋值完后关闭选择列表弹窗
    $('.cspzedit-layer .close1Iop').click();
}



/** *******************************集团iopend*********************************** **/

function queryPolicysp(){
    
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryPolicysp.do" ,// url
        type: "POST",// 方法类型
        data: $('#queryadid').serialize(),
        dataType:'json',
        success:function(data){
            if(data.flag==true){
            	 vm.goodsList=data.goodsList;
                 vm.limitsp=data.limit;
                 vm.pageObjectsp=data.pageObject;
                 vm.pageNumbersp=data.pageNumber;
            }
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}
function queryPolicyJh(){
    $("#id1").val(vm.id);
	var urls=vm.path+"/tWlmDecorate/queryPolicyJh.do";
	  var floorType=$("#floorType").val();
    if (floorType && floorType == 'newbottom') {
  	  urls=vm.path+"/tWlmDecorate/queryPolicyPage.do";
    }
    jQuery.ajax({
        url:urls ,// url
        type: "POST",// 方法类型
        data: $('#queryJH').serialize(),
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.limit1=data.limit1;
                vm.pageObject1=data.pageObject1;
                vm.aggname=data.name;
                vm.issuetime=data.issuetime;
                vm.pagetype=data.pagetype;
                vm.sysname=data.sysname;
                vm.aggregationList2=data.aggrelist;
            }
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}
function queryPolicyPage(){
    $("#decorateId").val(vm.id);
    $("#id1").val(vm.id);
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryPolicyPage.do" ,// url
        type: "POST",// 方法类型
        data: $('#queryJH').serialize(),
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.limit1=data.limit1;
                vm.pageObject1=data.pageObject1;
                vm.aggname=data.name;
                vm.issuetime=data.issuetime;
                vm.pagetype=data.pagetype;
                vm.sysname=data.sysname;
                vm.aggregationList2=data.aggrelist;
            }
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}
var vNum=/^[0-9]+$/;
function validIsNum(str){
    if(str==""){
        return false;
    }if(vNum.test(str)){
        return true;
    }return false;
} 

function querySumPrizeVideo(number){
    var num="";
    if(number=="+"){
        num=vm.pageObject4.currentPage+1;
    }else if(number=="-"){
         num=vm.pageObject4.currentPage-1;
    }else if(number=="1"){
        num="1";
    }else if(number=="0"){
        num=vm.pageObject4.totalPage;
    }
    document.getElementById('pageNumberVideo').value=num;
        jQuery.ajax({
            url: vm.path+"/tWlmDecorate/queryVideo.do" ,// url
            type: "POST",// 方法类型
            data: $('#queryVideo1').serialize(),
            dataType:'html',
            dataType:'json',
            success:function(data){
                if(data.flag==true){
                    vm.videoList=data.videoList;
                    vm.limit4=data.limit;
                    vm.pageObject4=data.pageObject;
                    vm.rowsPerPage4=data. pageObject.rowsPerPage;
                    vm.pageNumberVideo=data.pageNumber;
                }
                setTimeout(function(){ huixianJH(huixanzhi)},200);
            },
            // 调用出错执行的函数
            error: function(){
                alert("操作异常");
            } 
        });
 }

function querySumPrizead(number){
    var num="";
    if(number=="+"){
        num=vm.pageObject.currentPage+1;
    }else if(number=="-"){
         num=vm.pageObject.currentPage-1;
    }else if(number=="1"){
        num="1";
    }else if(number=="0"){
        num=vm.pageObject.totalPage;
    }
    document.getElementById('pageNumber').value=num;
        jQuery.ajax({
            url: vm.path+"/tWlmDecorate/queryPolicyAd.do" ,// url
            type: "POST",// 方法类型
            data: $('#queryadid1').serialize(),
            dataType:'html',
            dataType:'json',
            success:function(data){
                if(data.flag==true){
                    vm.adList=data.adList;
                    vm.limit=data.limit;
                    vm.pageObject=data.pageObject;
                    vm.rowsPerPage=data. pageObject.rowsPerPage;
                    vm.type=data.type;
                    vm.pageNumber=data.pageNumber;
                }
                setTimeout(function(){ huixianJH(huixanzhi)},200);
            },
            // 调用出错执行的函数
            error: function(){
                alert("操作异常");
            } 
        });
 }

function querySumPrizeIops(number){
    var num="";
    if(number=="+"){
        num=vm.pageObjectIop.currentPage+1;
    }else if(number=="-"){
        num=vm.pageObjectIop.currentPage-1;
    }else if(number=="1"){
        num="1";
    }else if(number=="0"){
        num=vm.pageObjectIop.totalPage;
    }
    document.getElementById('pageNumberIop').value=num;
    jQuery.ajax({
        url: vm.path+"/tWlmDecorateIop/queryGroupIop.do?v="+(new Date()).getTime(),// url
        type: "POST",// 方法类型
        data: $('#queryadid1').serialize(),
        dataType:'html',
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.list=data.list;
                vm.limitIop=data.limit;
                vm.pageObjectIop=data.pageObject;
                vm.rowsPerPageIop=data. pageObject.rowsPerPage;
                vm.pageNumberIop=data.pageNumber;
                vm.rowinitIop= data.rowinitIop;
            }
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        }
    });
}

function querySumPrizesp(number){
    var num="";
    if(number=="+"){
        num=vm.pageObjectsp.currentPage+1;
    }else if(number=="-"){
         num=vm.pageObjectsp.currentPage-1;
    }else if(number=="1"){
        num="1";
    }else if(number=="0"){
        num=vm.pageObject.totalPage;
    }
    document.getElementById('pageNumbersp').value=num;
        jQuery.ajax({
            url: vm.path+"/tWlmDecorate/queryPolicysp.do" ,// url
            type: "POST",// 方法类型
            data: $('#queryadid').serialize(),
            dataType:'html',
            dataType:'json',
            success:function(data){
                if(data.flag==true){
                    vm.goodsList=data.goodsList;
                    vm.limitsp=data.limit;
                    vm.pageObjectsp=data.pageObject;
                    vm.pageNumbersp=data.pageNumber;
                }
                setTimeout(function(){ huixianJH(huixanzhi)},200);
            },
            // 调用出错执行的函数
            error: function(){
                alert("操作异常");
            } 
        });
 }

function querySumPrizejh(number){
    var num="";
    if(number=="+"){
        num=vm.pageObject1.currentPage+1;
    }else if(number=="-"){
         num=vm.pageObject1.currentPage-1;
    }else if(number=="1"){
        num="1";
    }else if(number=="0"){
        num=vm.pageObject1.totalPage;
    }
    $("#id1").val(vm.id);
    document.getElementById('pageNumber1').value=num;
	var urls=vm.path+"/tWlmDecorate/queryPolicyJh.do";
	var floorType=$("#floorType").val();
    if (floorType && floorType == 'newbottom') {
  	  urls=vm.path+"/tWlmDecorate/queryPolicyPage.do";
    }
        jQuery.ajax({
             url: urls ,// url
                type: "POST",// 方法类型
                data: $('#queryJH').serialize(),
                dataType:'json',
                success:function(data){
                    if(data.flag==true){
                        vm.limit1=data.limit1;
                        vm.pageObject1=data.pageObject1;
                        vm.aggname=data.name;
                        vm.issuetime=data.issuetime;
                        vm.pagetype=data.pagetype;
                        vm.sysname=data.sysname;
                        vm.aggregationList2=data.aggrelist;
                    }
                    setTimeout(function(){ huixianJH(huixanzhi)},200);
                },
            // 调用出错执行的函数
            error: function(){
                alert("操作异常");
            } 
        });
 }

function querySumPrizexx(number){
  var num="";
  if(number=="+"){
      num=vm.pageObject11.currentPage+1;
  }else if(number=="-"){
       num=vm.pageObject11.currentPage-1;
  }else if(number=="1"){
      num="1";
  }else if(number=="0"){
      num=vm.pageObject11.totalPage;
  }
  document.getElementById('pageNumber11').value=num;
  console.log(GetQueryString("pageType"));
  var form = {
      title : $("#title11").val() || '',
      pageType : GetQueryString("pageType") || '',
      pubStartTime : $("#pubStartTime").val() || '',
      pubEndTime : $("#pubEndTime").val() || '',
      fBeginDate : $("#fBeginDate").val() || '',
      fEndDate : $("#fEndDate").val() || ''
  }
  jQuery.ajax({
    url: vm.path+"/tWlmDecorate/queryNotice.do" ,// url
    type: "POST",// 方法类型
    data: form,
    dataType:'json',
    success:function(data){
        if(data.flag==true){
            vm.noticeList=data.noticeList;
            vm.limit11=data.limit;
            vm.pageObject11=data.pageObject;
            vm.rowsPerPage11=data. pageObject.rowsPerPage;
        }
    },
    // 调用出错执行的函数
    error: function(){
        alert("操作异常");
    } 
  });
}

function queryNotice(){

  var form = {
          title : $("#title11").val() || '',
          pageType : GetQueryString("pageType") || '',
          pubStartTime : $("#pubStartTime").val() || '',
          pubEndTime : $("#pubEndTime").val() || '',
          fBeginDate : $("#fBeginDate").val() || '',
          fEndDate : $("#fEndDate").val() || ''
  }
  jQuery.ajax({
      url: vm.path+"/tWlmDecorate/queryNotice.do" ,// url
      type: "POST",// 方法类型
      data: form,//$('#queryadid1').serialize(),
      dataType:'json',
      success:function(data){
          if(data.flag==true){
              vm.noticeList=data.noticeList;
              vm.limit11=data.limit;
              vm.pageObject11=data.pageObject;
              vm.rowsPerPage11=data. pageObject.rowsPerPage;
          }
      },
      // 调用出错执行的函数
      error: function(){
          alert("操作异常");
      } 
  });
}
queryNotice();

    
function goToPage(pagesize){
        var pagevalue=document.getElementById('gopage').value;
        if(!validIsNum(pagevalue)||pagevalue==''){
                    alert("请输入合法页数!");
                    return false;
                }else if(pagevalue>pagesize||pagevalue==0){
                    alert("请输入合法页数!");
                    document.getElementById('gopage').value='';
                    document.getElementById('gopage').focus();
                    return false;
                }
        querySumPrize(pagevalue);
}

function goToPagexx(pagesize){
  var pagevalue=document.getElementById('gopage').value;
  if(!validIsNum(pagevalue)||pagevalue==''){
              alert("请输入合法页数!");
              return false;
          }else if(pagevalue>pagesize||pagevalue==0){
              alert("请输入合法页数!");
              document.getElementById('gopage').value='';
              document.getElementById('gopage').focus();
              return false;
          }
  querySumPrizexx(pagevalue);
}

function resetValueXX() {
  $("#title11").val('');
  $("#pubStartTime").val('');
  $("#pubEndTime").val('');
  $("#fBeginDate").val('');
  $("#fEndDate").val('');
  queryNotice();
}

function resetValuejh(){
    /*
     * $("#decorateId").val(vm.id); $("#aggname").val("");
     * $("#issuetime").val(""); $("#pagetype").val(""); $("#sysname").val("");
     */
	  $("#id1").val(vm.id);
	var urls=vm.path+"/tWlmDecorate/queryPolicyJh.do";
	  var floorType=$("#floorType").val();
      if (floorType && floorType == 'newbottom') {
    	  urls=vm.path+"/tWlmDecorate/queryPolicyPage.do";
      }
    $('#jhname').val('');
    $('#pagetype').val('');
    $('#sysName').val('');
    jQuery.ajax({
        url:  urls,// url
        type: "POST",// 方法类型
        data: $('#queryJH').serialize(),
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.limit1=data.limit1;
                vm.pageObject1=data.pageObject1;
                vm.aggname=data.name;
                vm.issuetime=data.issuetime;
                vm.pagetype=data.pagetype;
                vm.sysname=data.sysname;
                vm.aggregationList2=data.aggrelist;
            }
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}


function resetValuead(){
    $("#title").val("");
    $("#goodsName").val("");
    $("#type").val("");
    $("#startTime3").val("");
    $("#endTime3").val("");
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryPolicyAd.do" ,// url
        type: "POST",// 方法类型
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.adList=data.adList;
                vm.limit=data.limit;
                vm.pageObject=data.pageObject;
                vm.rowsPerPage=data. pageObject.rowsPerPage;
                vm.type=data.type;
            }
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}
function resetValuesp(){
    $("#title1").val("");
    $("#goodsName").val("");
    $("#type1").val("");
    $("#startTime5").val("");
    $("#endTime5").val("");
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryPolicysp.do" ,// url
        type: "POST",// 方法类型
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.goodsList=data.goodsList;
                vm.limitsp=data.limit;
                vm.pageObjectsp=data.pageObject;
                vm.pageNumbersp=data.pageNumber;
            }
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}
function resetValueIop(){
    $("#productIopId").val("");
    $("#policyIopId").val("");
    $("#startTime4").val("");
    $("#endTime4").val("");
}
function changeTiaoZhuan(index){
    var policyType=$("#policyType").val();
    if(policyType=="0"){
        var v=$("#policy"+index).find("#ConfigType").val();
        if(v==2){
            var s=$("#policy"+index).find("#jhsp"+index);
            $("#policy"+index).find("#jhsp"+index).attr("class","jhsp sp");
            $("#policy"+index).find("#jhsp"+index).text("选择商品");
        }else{
            $("#policy"+index).find("#jhsp"+index).attr("class","jhsp ad");
            $("#policy"+index).find("#jhsp"+index).text("选择广告/聚合页");
        }
    }else{
        var v=$("#policybuwei"+index).find("#ConfigType").val();
        if(v==2){
            $("#policybuwei"+index).find("#jhsp"+index).attr("class","jhsp sp");
            $("#policybuwei"+index).find("#jhsp"+index).text("选择商品");
        }else{
            $("#policybuwei"+index).find("#jhsp"+index).attr("class","jhsp ad");
            $("#policybuwei"+index).find("#jhsp"+index).text("选择广告/聚合页");
        }
    }
}

function querypolicyiop(roomId){
    jQuery.ajax({
        url:vm.path + "/tWlmDecorate/tWlmUpdateIndexPolicy.do?id="+vm.id+"&roomId="+roomId,
        type: "POST",// 方法类型
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.policyList= data.policyList;
                vm.shure=data.shure;
                vm.policyListbuwei=data.policyListbuwei;
                vm.shurebuwei=data.shurebuwei;
            }
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}
// 上传图片
var xh = 0;
$(document).on('change','.imgUpload',function(){
	
    var id = this.id;
    var xxh = id + xh;
    $(this).parents('.uploadImg').find('.imgInput').attr( 'id', xxh);
    $(this).parents('.uploadImg').find('.imagesZw').attr( 'id', xxh +'imagesZw');
    $(this).parents('.uploadImg').find('.imgPerview').attr( 'id',  xxh +'imgPerview');
    $(this).parents('.uploadImg').find('.opacityP').attr( 'id', xxh +'opacityP');
    uploadImg(xxh,'350','350','100',function(err, imgsrc) {
        if (err) {
          alert(JSON.stringify(err));
          return;
        }
        $("#"+xxh+"imagesZw").css("display","none");
        $("#"+xxh+"imgPerview").show().attr("src", imgsrc);
        $("#"+xxh+"opacityP").text('删除').addClass('j-deleteImg');
        xh ++;
        alert("上传成功！");
        return;
      });
});

function uploadImg(id,imgWidth,imgHeight,imgSize,fn) {
    var enFn = fn || function() {
    };

    var fileupId = id;
    $.ajaxFileUpload({
        url:vm.path+'/tWlmDecorate/uploadPolicyImage.do', 
        secureuri:false, 
        type:"POST", 
        fileElementId:fileupId, 
        data:{"cz":imgSize,"size":imgWidth+"#"+imgHeight}, 
        dataType:"json", 
        success: function (returnData) {
            if(returnData.flag == true){
                  if(returnData.imgName!=null&&returnData.imgName!=""){
                   var imgSrcPath =returnData.imgName;
                	   return enFn(null, vm.path+"/"+imgSrcPath);
                   return;
                 } 
             }else{
               if(returnData.messages=="1"){
                   alert("只允许上传jpg,png格式的图片");
               }else if(returnData.messages=="2"){
                   alert("图片格式不正确，请上传小于150k的图片");
               }else if(returnData.messages=="3"){
                   alert("保存文件出错 ，请检查上传图片是否有误！");
               }else{
                   alert("网络故障")
               }
             }
    },
    error:function(a,b,c){
       // alert("a " + a + " b " + b + " c " + c);
    }
   });
  }


function upLoadImgChannel(path,imgWidth,imgHeight,imgSize){
     var fileupId = path.id;
     $.ajaxFileUpload({
         url:vm.path+'/tWlmDecorate/uploadPolicyImage.do', 
         secureuri:false, 
         type:"POST", 
         fileElementId:fileupId, 
         data:{"cz":imgSize,"size":imgWidth+"#"+imgHeight}, 
         dataType:"json", 
         success: function (returnData) {
             if(returnData.flag == true){
                   if(returnData.imgName!=null&&returnData.imgName!=""){
                    alert("上传成功！");
                    var imgSrcPath =returnData.imgName;
                    imgSrcPath = returnData.imgName;
                    $("input[id=" + fileupId + "imageName]").val(imgSrcPath);
                    $("."+fileupId+"imagesZw").css("display","none");
                    $("."+fileupId+"imgPerview").show().attr("src", vm.path+"/"+imgSrcPath);
                    $("#"+fileupId+"opacityP").text('删除').attr('onclick',"deleteImg('"+fileupId+"')");
                    return;
                  } 
              }else{
                if(returnData.messages=="1"){
                    alert("只允许上传jpg,png格式的图片");
                }else if(returnData.messages=="2"){
                    alert("图片格式不正确，请上传小于150k的图片");
                }else if(returnData.messages=="3"){
                    alert("保存文件出错 ，请检查上传图片是否有误！");
                }else{
                    alert("网络故障")
                }
              }
     },
     error:function(a,b,c){
        // alert("a " + a + " b " + b + " c " + c);
     }
    });
}
function uploadPolicyImageForMultiple(path,imgWidth,imgHeight,imgSize,sign){
	 var fileupId = path.id;
	var fileCount = $("#"+fileupId)[0].files.length;
	if(fileCount==undefined||fileCount==''){
		return ;
	}
	if(fileCount > 3){
		alert ("最多选择三张图片，请重新选择！");
		return ;
	}
	if(sign && sign == '1' && fileCount > 2) {
		alert ("最多选择两张图片，请重新选择！");
		return ;
	}
	if(sign && sign == '2' && fileCount > 1) {
		alert ("最多选择一张图片，请重新选择！");
		return ;
	}
    $.ajaxFileUpload({
        url:vm.path+'/tWlmDecorate/uploadPolicyImageForMultiple.do', 
        secureuri:false, 
        type:"POST", 
        fileElementId:fileupId, 
        data:{"cz":imgSize,"size":imgWidth+"#"+imgHeight}, 
        dataType:"json", 
        success: function (returnData) {
        	if(!sign) {
     	    	$("."+fileupId+"imgPerview").eq(0).parent().parent().next().next("div").remove();
     	    	$("."+fileupId+"imgPerview").eq(0).parent().parent().next("div").remove();
     	   } else if('1' == sign){
     		  fileupId = fileupId.substring(0,fileupId.length - 1);
  	    	  $("."+fileupId+"imgPerview").eq(1).parent().parent().next("div").remove();
     	   } else if('2' == sign){
     		  fileupId = fileupId.substring(0,fileupId.length - 1);
     	   }
        	var Url = $("input[id=" + fileupId + "imageName]").parent().parent().eq(0);//获取文本框id
     	    var urlCopy ;
			var str;
			if(fileupId.indexOf("buwei")!=-1){
				str=fileupId.split("buweiintroductionList")[1]
			}else{
				str=fileupId.split("introductioniconList")[1];
			}
            if(returnData.flag == true){
               if(!sign && returnData.minStr){
                   alert("上传成功！");
                   var imgSrcPath = returnData.minStr.split("_AAA_")[0];
                   $("input[id=" + fileupId + "imageName]").val(imgSrcPath+"?"+str);
                   $("."+fileupId+"imagesZw").css("display","none");
                   $("."+fileupId+"imgPerview").show().attr("src", vm.path+"/"+imgSrcPath);
                   $("#"+fileupId+"opacityP").text('删除图片').attr('onclick',"deleteImgRemove('"+fileupId+"','0')");
               }
               if((!sign && returnData.midStr) || (sign == '1' && returnData.minStr)) {//第二张
             		if(!sign) {
             			imgSrcPath = returnData.midStr.split("_AAA_")[0];
             			urlCopy = Url.clone();
             			$("input[id=" + fileupId + "imageName]").closest("dd").find("span").before(urlCopy); //复制
             		} else if (sign == '1'){ //从第二张上传
             			imgSrcPath = returnData.minStr.split("_AAA_")[0];
             		}
             	    $("."+fileupId+"imgPerview").eq(1).next().next().attr("name","secondIntroductioniconListimageName"); 
 					$("."+fileupId+"imgPerview").eq(1).next().next().attr("id","secondintroductioniconList0imageName"); 
             	    $("."+fileupId+"imgPerview").eq(1).next().next().val(imgSrcPath);
                    $("."+fileupId+"imgPerview").eq(1).next().next().next().attr("id",fileupId+"1");
                    $("."+fileupId+"imgPerview").eq(1).next().next().next().attr("onchange","uploadPolicyImageForMultiple(this,0,0,2,1)");

                    $("."+fileupId+"imagesZw").eq(1).css("display","none");
                    $("."+fileupId+"imgPerview").eq(1).show().attr("src", vm.path+"/"+imgSrcPath);
                    $("."+fileupId+"imgPerview").eq(1).next().text('删除图片').attr('onclick',"deleteImgRemove('"+fileupId+"','1')");
                    $("."+fileupId+"imgPerview").eq(1).next().attr("id",fileupId+"1opacityP");			
                    $("."+fileupId+"imgPerview").eq(1).parent().next("a").attr("onclick","assignment(''"+fileupId+"'',1);showid('ts_ljzs')");
               } 
               if((!sign && returnData.maxStr) || (sign == '1' && returnData.midStr) || (sign == '2' && returnData.minStr)) {//第三张
        		   if(!sign) {
            			imgSrcPath = returnData.maxStr.split("_AAA_")[0];
            			urlCopy = Url.clone();
                 	　  $("input[id=" + fileupId + "imageName]").closest("dd").find("span").before(urlCopy); //复制一份
            		} else if (sign == '1'){ //从第二张上传
            			imgSrcPath = returnData.midStr.split("_AAA_")[0];
            			urlCopy = Url.clone();
                 	　  $("input[id=" + fileupId + "imageName]").closest("dd").find("span").before(urlCopy); //复制一份
            		} else if (sign == '2'){ //从第二张上传
            			imgSrcPath = returnData.minStr.split("_AAA_")[0];
            		}
            	   $("."+fileupId+"imgPerview").eq(2).next().next().attr("name","thirdIntroductioniconListimageName");
        		   $("."+fileupId+"imgPerview").eq(2).next().next().val(imgSrcPath);
                   $("."+fileupId+"imgPerview").eq(2).next().next().next().attr("id",fileupId+"2");
                   $("."+fileupId+"imgPerview").eq(2).next().next().next().attr("onchange","uploadPolicyImageForMultiple(this,0,0,2,2)");
                   $("."+fileupId+"imagesZw").eq(2).css("display","none");
                   $("."+fileupId+"imgPerview").eq(2).show().attr("src", vm.path+"/"+imgSrcPath);
                   $("."+fileupId+"imgPerview").eq(2).next().text('删除图片').attr('onclick',"deleteImgRemove('"+fileupId+"','2')");
                   $("."+fileupId+"imgPerview").eq(2).next().attr("id",fileupId+"2opacityP");
                   $("."+fileupId+"imgPerview").eq(2).parent().next("a").attr("onclick","assignment('"+fileupId+"',2);showid('ts_ljzs')");
                   
               }
				var s1= $("."+fileupId+"imgPerview").eq(0).next().next().val();
				var s2= $("."+fileupId+"imgPerview").eq(1).next().next().val();
				var s3= $("."+fileupId+"imgPerview").eq(2).next().next().val();
				if(s1.indexOf("?")==-1){
					$("."+fileupId+"imgPerview").eq(0).next().next().val(s1+"?"+str);
				}
				if(s2.indexOf("?")==-1){
					$("."+fileupId+"imgPerview").eq(1).next().next().val(s2+"?"+str);
				}
				if(s3.indexOf("?")==-1){
					$("."+fileupId+"imgPerview").eq(2).next().next().val(s3+"?"+str);
				}
               return;
             }else{
               if(returnData.messages=="1"){
                   alert("只允许上传jpg,png格式的图片");
               }else if(returnData.messages=="2"){
                   alert("图片格式不正确，请上传小于150k的图片");
               }else if(returnData.messages=="3"){
                   alert("保存文件出错 ，请检查上传图片是否有误！");
               }else if(returnData.messages=="4"){
            	   alert ("最多选择三张图片，请重新选择！");
               }else{
                   alert("网络故障")
               }
             }
    },
    error:function(a,b,c){
       // alert("a " + a + " b " + b + " c " + c);
    }
   });
}
function deleteImgRemove(id,sign) {
	$("."+id+"imgPerview").eq(sign).attr('src','');
    $("."+id+"imgInput").eq(sign).val('');
    $("."+id+"imgPerview").eq(sign).css("display","none");
    $("."+id+"imagesZw").eq(sign).css("display","block");
    $("."+id+"imgPerview").eq(sign).next().next().val("");
    $("."+id+"imgPerview").eq(sign).next().text('上传图片');
    if(sign == '1') {
    	$("."+id+"imgPerview").eq(sign).parent().parent().next("div").remove();
    } else if(sign == '0') {
    	$("."+id+"imgPerview").eq(sign).parent().parent().next().next("div").remove();
    	$("."+id+"imgPerview").eq(sign).parent().parent().next("div").remove();
    }
}

function assignmentImg2(id,sign) {
    if(sign == '1') {
    	$("."+id+"imgPerview").eq(sign).parent().parent().next("div").remove();
    } else if(sign == '0') {
    	$("."+id+"imgPerview").eq(sign).parent().parent().next().next("div").remove();
    	$("."+id+"imgPerview").eq(sign).parent().parent().next("div").remove();
    }else if(sign=='2'){
	
}
}


function upLoadImgChannel_newBottom(path,imgWidth,imgHeight,imgSize){
    var fileupId = path.id;
    $.ajaxFileUpload({
        url:vm.path+'/tWlmDecorate/uploadPolicyImage.do', 
        secureuri:false, 
        type:"POST", 
        fileElementId:fileupId, 
        data:{"cz":imgSize,"size":imgWidth+"#"+imgHeight}, 
        dataType:"json", 
        success: function (returnData) {
            if(returnData.flag == true){
                  if(returnData.imgName!=null&&returnData.imgName!=""){
                   alert("上传成功！");
                   var imgSrcPath =returnData.imgName;
                   imgSrcPath = returnData.imgName;
                   $("input[id=" + fileupId + "imageName]").val(imgSrcPath);
                	   $("#"+fileupId+"imgPerview").show().attr("src", vm.path+"/"+imgSrcPath);
                   return;
                 } 
             }else{
               if(returnData.messages=="1"){
                   alert("只允许上传jpg,png格式的图片");
               }else if(returnData.messages=="2"){
                   alert("图片格式不正确，请上传小于150k的图片");
               }else if(returnData.messages=="3"){
                   alert("保存文件出错 ，请检查上传图片是否有误！");
               }else{
                   alert("网络故障")
               }
             }
    },
    error:function(a,b,c){
       // alert("a " + a + " b " + b + " c " + c);
    }
   });
}




// 移除td
function delqyxq(a){
  $(a).parent("td").parent("tr").remove();
} 


/** *******************************跑马灯start*********************************** **/


$('.sidebar-nav .wdgN').draggable({
    connectToSortable: '.demo .col .col',
    helper: 'clone',
    opacity:0.5,
    start: function(e,t) {drag++},
    drag: function(e, t) {t.helper.width(300);},
    stop: function() { 
        reSlide();
        drag--;
        htmlRec(0,'wwdgN');
        sizeInit(); 
        
    }
});
  



 
   function initpmd(a,lt){
         
//     <input class="" name="lx'+lt+'" type="radio" id="xxlx'+lt+'"  value="'+lt+'" onclick="qhlx(this,&apos;xjp'+lt+'&apos;)">\
//       <label for="xxlx'+lt+'">消息通知</label>\
       
//       <td class="lxactive"  id="xjp'+lt+'" ><input class="jpinput" name="jumpaddre'+lt+'" type="hidden" value="" /> <a href="javascript:;" class="xxljgg xxclick" >选择消息</a></td>\
       
            var c = '<li class="pmd_li">\
                <table class="pmdtable" border="0" cellspacing="0" cellpadding="0">\
                    <tbody>\
                        <tr>\
                            <th style="border-right: 1px solid #d7d7d7;text-align: center;" rowspan="4">'+lt+'</th>\
                            <th>类型：</th>\
                            <td>\
                              <input class="" name="lx'+lt+'" type="radio" id="xxlx'+lt+'"  value="'+1+'" onclick="qhlx(this,&apos;xjp'+lt+'&apos;)">\
                              <label for="xxlx'+lt+'">消息通知</label>\
                              <input class="" name="lx'+lt+'" type="radio" id="gglx'+lt+'" checked value="'+2+'" onclick="qhlx(this,&apos;gjp'+lt+'&apos;)">\
                              <label for="gglx'+lt+'" >广告</label>\
                              <input class="" name="lx'+lt+'" type="radio" id="jhylx'+lt+'" value="'+3+'" onclick="qhlx(this,&apos;jjp'+lt+'&apos;)">\
                              <label for="jhylx'+lt+'" >聚合页</label>\
                              <input class="" name="lx'+lt+'" type="radio" id="dzlx'+lt+'" value="'+4+'" onclick="qhlx(this,&apos;djp'+lt+'&apos; )">\
                              <label for="dzlx'+lt+'" >地址</label>\
                            </td>\
                            <td rowspan="4" style="vertical-align:middle;">\
                            <span class="ydicon"><image src="../../images/sm_01.png" width="18" onclick="zhidingCk(this)"></span>\
                            <span class="ydicon"><image src="../../images/sm_02.png" width="18" onclick="moveUpModule(this)"></span>\
                            <span class="ydicon"><image src="../../images/sm_03.png" width="18" onclick="moveDownModule(this)"></span>\
                            <span class="ydicon"><image src="../../images/sm_04.png" width="18" onclick="delpmd(this)"></span>\
                            </td>\
                    </tr>\
                    <tr class="jumpa">\
                        <th>跳转地址：</th>\
                        <td class="lxactive"  id="xjp'+lt+'" ><input class="jpinput" name="jumpaddre'+lt+'"  value="" /> <a href="javascript:;" class="xxljgg xxclick" >选择消息</a></td>\
                        <td class="shactive" id="gjp'+lt+'"><input class="jpinput" name="jumpaddre'+lt+'" value="" /> <a href="javascript:;" class="xxljgg xzclick" >选择广告</a></td>\
                        <td class="lxactive" id="jjp'+lt+'"><input class="jpinput" name="jumpaddre'+lt+'" value="" /> <a href="javascript:;" class="xxljgg jhyclick"  >选择聚合页</a></td>\
                        <td class="lxactive" id="djp'+lt+'"><input class="jpinput" name="jumpaddre'+lt+'" placeholder="请输入跳转地址" style="width:30%;" type="text" value="" /></td>\
                    </tr><tr><th>所选名称：</th><td><input type=\"text\" readonly=\"readonly\" name=\"jumpAddressStr\" class=\"jumpAddressStrReadOnly\" style=\"border: none;height: 30px;\"></td></tr>\
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
   
   // /跑马灯文本编辑弹窗
   var pmdthisClickObj=''; // 该变量在保存中也会用到
   $(demo).on('click','.pmdEdit',function(e) {
       pmdthisClickObj = $(this).parent().parent(),// edit父标签的父标签
       that=$(this);
       a = that.parent().next();// view
       e.preventDefault();
       $('.coMmodals').show();// 展示蒙版
       var p=$(this).parent().parent();
       $('.pmdTips').fadeIn(200, function() {
           var layer=$('.pmdmodal',this);
           layer.css({
               'margin-top':-(layer.height())/2,
               'margin-left':-(layer.width())/2
           }).fadeIn(100);

           var imgNum = p.find('.xxpmd .swiper-slide').length+1;// 遍历
           var editHtmlImg = "<ul>";
           
               for(var i= 1 ;i<imgNum;i++){  
                   // console.log( p.find('.xxpmd
                   // .swiper-slide').children('input'));
                   var editLx = p.find('.xxpmd .swiper-slide').children('input[name="xxtzlx'+i+'"]').val(),// 获取类型
                       editbt = p.find('.xxpmd .swiper-slide').children('input[name="btname'+i+'"]').val(),// 超链接标题
                       editHref = '';//p.find('.xxpmd .swiper-slide').children("a").eq(i-1).attr('href'),// 获取超链接
                       adidhref = p.find('.xxpmd .swiper-slide').children("a").eq(i-1).find('#adidhref').val(),// 获取超链接
                       jhyhref = p.find('.xxpmd .swiper-slide').children("a").eq(i-1).find('#jhyhref').val(),// 获取超链接
                       titleorname = p.find('.xxpmd .swiper-slide').children("a").eq(i-1).attr('titleorname'),// 所选名称
                       
             // 这里是汉字的时候prop是以ip形式呈现的请注意
             // 用attr试试
                       editText = p.find('.xxpmd .swiper-slide').children("a").children("span").eq(i-1).text(); // 获取文本
                  if (!editLx) {
                      continue;
                  }
                  if(!titleorname){
                  	titleorname = '';
                  }
                  if (adidhref) {
                      editHref = 'adid=' + adidhref;
                  }else if (jhyhref) {
                      editHref = jhyhref;
                  }else{
                      editHref = p.find('.xxpmd .swiper-slide').children("a").eq(i-1).attr('href');// 获取超链接
                  }

                   var editxxtj = "<li class='pmd_li' style='padding:0px;'>"
                       +"          <table class='pmdtable' border='0' cellspacing='0' cellpadding='0'>"
                       +"              <tr>"
                       +"                  <th style=' border-right: 1px solid #d7d7d7;text-align: center;' rowspan='4'>" + i + "</th>"
                       +"                  <th>类型：</th>"
                       +"                  <td>"
                       if(editLx==1){// 判断类型
                         editxxtj += "   <input class='' name='lx" + i + "' type='radio'  id='xxlx" + i + "' checked value='" + editLx + "' onclick='qhlx(this,&apos;xjp"+i+"&apos;)'/><label for='xxlx" + i + "'>消息通知</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='gglx" + i + "' value='2' onclick='qhlx(this,&apos;gjp"+i+"&apos;)'/><label for='gglx" + i + "' >广告</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='jhylx" + i + "' value='3'  onclick='qhlx(this,&apos;jjp"+i+"&apos;)'/><label for='jhylx" + i + "'>聚合页</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='dzlx" + i + "' value='4' onclick='qhlx(this,&apos;djp"+i+"&apos;)'/><label for='dzlx" + i + "' >地址</label>"
                                  +" </td>"  
                                  +" <td  rowspan='4' style='vertical-align:middle;' >" 
                                  +"<span class='ydicon'><image src='../../images/sm_01.png' width='18' onclick='zhidingCk(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_02.png' width='18' onclick='moveUpModule(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_03.png' width='18' onclick='moveDownModule(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_04.png' width='18' onclick='delpmd(this)'></span>"
                                  +"</td>"
                                  +"</tr>"
                                  +"<tr class='jumpa'>"
                                  +"     <th>跳转地址：</th> "
                                      if(!editHref){
                                          editxxtj += " <td id='xjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre1' value='' /> <a href='javascript:;' class='xxljgg xxclick' >选择消息</a></td>"
                                      }else{
                                          editxxtj += " <td id='xjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre1' value='" + editHref + "' /> <a href='javascript:;' class='xxljgg xxclick' >选择消息</a></td>"
                                      }
                                      editxxtj += " <td class='lxactive' id='gjp"+i+"'><input class='jpinput' name='jumpaddre2'  value='' /> <a href='javascript:;' id='jhsp0' class='xxljgg xzclick' >选择广告</a></td>"
                                      +" <td class='lxactive' id='jjp"+i+"'><input class='jpinput' name='jumpaddre3'  value='' /> <a href='javascript:;' class='xxljgg jhyclick' >选择聚合页</a></td>"
                                      +" <td class='lxactive' id='djp"+i+"'><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value='' style='width:30%;' /></td>"
                                 +"</tr>"
                       }else if(editLx==2){
                        editxxtj +="   <input class='' name='lx" + i + "' type='radio'  id='xxlx" + i + "' value='1' onclick='qhlx(this,&apos;xjp"+i+"&apos;)'/><label for='xxlx" + i + "'>消息通知</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='gglx" + i + "' checked value='" + editLx + "' onclick='qhlx(this,&apos;gjp"+i+"&apos;)'/><label for='gglx2'>广告</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='jhylx" + i + "' value='3' onclick='qhlx(this,&apos;jjp"+i+"&apos;)'/><label for='jhylx" + i + "'>聚合页</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='dzlx" + i + "' value='4' onclick='qhlx(this,&apos;djp"+i+"&apos;)'/><label for='dzlx" + i + "'>地址</label>"
                                  +" </td>"  
                                  +" <td  rowspan='4' style='vertical-align:middle;' >" 
                                  +"<span class='ydicon'><image src='../../images/sm_01.png' width='18' onclick='zhidingCk(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_02.png' width='18' onclick='moveUpModule(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_03.png' width='18' onclick='moveDownModule(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_04.png' width='18' onclick='delpmd(this)'></span>"
                                  +"</td>"
                                  +"</tr>"
                                  +"<tr class='jumpa'>"
                                  +"     <th>跳转地址：</th> "
                                  +      "<td class='lxactive'  id='xjp"+i+"'><input class='jpinput' name='jumpaddre1' value='' /> <a href='javascript:;' class='xxljgg xxclick' >选择消息</a></td>"
                                                   
                                      if(!editHref){
                                          editxxtj += " <td  id='gjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre2' readonly value='' /> <a href='javascript:;' class='xxljgg xzclick' >选择广告</a></td>"
                                                   }else{
                                          editxxtj += " <td  id='gjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre2' readonly  value='" + editHref + "' /> <a href='javascript:;' class='xxljgg xzclick' >选择广告</a></td>"
                                      } 
                                      editxxtj += "<td class='lxactive' id='jjp"+i+"'><input class='jpinput' name='jumpaddre3' value='' /> <a href='javascript:;' class='xxljgg jhyclick' >选择聚合页</a></td>"
                                      +" <td class='lxactive'  id='djp"+i+"'><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value='' style='width:30%;'/></td>"
                                 +"</tr>"
                       }else if(editLx==3){
                         editxxtj += "   <input class='' name='lx" + i + "' type='radio'  id='xxlx" + i + "' value='1' onclick='qhlx(this,&apos;xjp"+i+"&apos;)'/><label for='xxlx" + i + "'>消息通知</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='gglx" + i + "' value='2' onclick='qhlx(this,&apos;gjp"+i+"&apos;)'/><label for='gglx" + i + "'>广告</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='jhylx" + i + "' checked value='" + editLx + "'  onclick='qhlx(this,&apos;jjp"+i+"&apos;)'/><label for='jhylx" + i + "'>聚合页</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='dzlx" + i + "' value='4' onclick='qhlx(this,&apos;djp"+i+"&apos;)'/><label for='dzlx" + i + "'>地址</label>"
                                  +" </td>"  
                                  +" <td  rowspan='4' style='vertical-align:middle;' >" 
                                  +"<span class='ydicon'><image src='../../images/sm_01.png' width='18' onclick='zhidingCk(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_02.png' width='18' onclick='moveUpModule(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_03.png' width='18' onclick='moveDownModule(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_04.png' width='18' onclick='delpmd(this)'></span>"
                                  + "</td>"
                                  +"</tr>"
                                  +"<tr class='jumpa'>"
                                  +"     <th>跳转地址：</th> "
                                  +      "<td class='lxactive'  id='xjp"+i+"'><input class='jpinput' name='jumpaddre1' value='' /> <a href='javascript:;' class='xxljgg xxclick' >选择消息</a></td>"
                                  +"      <td class='lxactive'  id='gjp"+i+"'><input class='jpinput' name='jumpaddre2'  value='' /> <a href='javascript:;' class='xxljgg xzclick' >选择广告</a></td>"
                                                   
                                      if(!editHref){
                                          editxxtj +=" <td id='jjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre3'  value='' /> <a href='javascript:;' class='xxljgg jhyclick' >选择聚合页</a></td>"
                                                  
                                     }else{
                                          editxxtj += " <td id='jjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre3'  readonly  value='" + editHref + "' /> <a href='javascript:;' class='xxljgg jhyclick' >选择聚合页</a></td>"
                                      } 
                                      editxxtj += " <td class='lxactive'  id='djp"+i+"'><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value='' style='width:30%;' /></td>"
                                  +"</tr>"
                       }else if(editLx==4){      
                         editxxtj += "   <input class='' name='lx" + i + "' type='radio'  id='xxlx" + i + "' value='1' onclick='qhlx(this,&apos;xjp"+i+"&apos;)'/><label for='xxlx" + i + "'>消息通知</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='gglx" + i + "' value='2' onclick='qhlx(this,&apos;gjp"+i+"&apos;)'/><label for='gglx" + i + "'>广告</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='jhylx" + i + "' value='3'  onclick='qhlx(this,&apos;jjp"+i+"&apos;)'/><label for='jhylx" + i + "'>聚合页</label>"
                                  +"     <input class='' name='lx" + i + "' type='radio'  id='dzlx" + i + "' checked value='" + editLx + "' onclick='qhlx(this,&apos;djp"+i+"&apos;)'/><label for='dzlx" + i + "'>地址</label>"
                                  +" </td>"  
                                  +" <td  rowspan='4' style='vertical-align:middle;' >" 
                                  +"<span class='ydicon'><image src='../../images/sm_01.png' width='18' onclick='zhidingCk(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_02.png' width='18' onclick='moveUpModule(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_03.png' width='18' onclick='moveDownModule(this)'></span>"
                                  +"<span class='ydicon'><image src='../../images/sm_04.png' width='18' onclick='delpmd(this)'></span>"
                                  +"</td>"
                                  +"</tr>"
                                  +"<tr class='jumpa'>"
                                  +"     <th>跳转地址：</th> "
                                  +     "<td class='lxactive'  id='xjp"+i+"' ><input class='jpinput' name='jumpaddre1' value='' /> <a href='javascript:;' class='xxljgg xxclick' >选择消息</a></td>"
                                  +"    <td class='lxactive'  id='gjp"+i+"'><input class='jpinput' name='jumpaddre2'  value='' /> <a href='javascript:;' class='xxljgg xzclick' >选择广告</a></td>"
                                  +"    <td  class='lxactive' id='jjp"+i+"'><input class='jpinput' name='jumpaddre3'  value='' /> <a href='javascript:;' class='xxljgg jhyclick' >选择聚合页</a></td>"
                                  
                              if(!editHref){
                                 editxxtj +=" <td  id='djp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value='' style='width:30%;'/></td>"
                             }else{
                                 editxxtj += " <td  id='djp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value='" + editHref + "'  style='width:30%;'/></td>"
                             } 
                             editxxtj += "</tr>" 
                       }else{
                    	   editxxtj +="   <input class='' name='lx" + i + "' type='radio'  id='xxlx" + i + "' value='1' onclick='qhlx(this,&apos;xjp"+i+"&apos;)'/><label for='xxlx" + i + "'>消息通知</label>"
                           +"     <input class='' name='lx" + i + "' type='radio'  id='gglx" + i + "' checked value='2' onclick='qhlx(this,&apos;gjp"+i+"&apos;)'/><label for='gglx2'>广告</label>"
                           +"     <input class='' name='lx" + i + "' type='radio'  id='jhylx" + i + "' value='3' onclick='qhlx(this,&apos;jjp"+i+"&apos;)'/><label for='jhylx" + i + "'>聚合页</label>"
                           +"     <input class='' name='lx" + i + "' type='radio'  id='dzlx" + i + "' value='4' onclick='qhlx(this,&apos;djp"+i+"&apos;)'/><label for='dzlx" + i + "'>地址</label>"
                           +" </td>"  
                           +" <td  rowspan='4' style='vertical-align:middle;' >"
                           +"<span class='ydicon'><image src='../../images/sm_01.png' width='18' onclick='zhidingCk(this)'></span>"
                           +"<span class='ydicon'><image src='../../images/sm_02.png' width='18' onclick='moveUpModule(this)'></span>"
                           +"<span class='ydicon'><image src='../../images/sm_03.png' width='18' onclick='moveDownModule(this)'></span>"
                           +"<span class='ydicon'><image src='../../images/sm_04.png' width='18' onclick='delpmd(this)'></span>"
                           +"</td>"
                           +"</tr>"
                           +"<tr class='jumpa'>"
                           +"     <th>跳转地址：</th> "
                           +      "<td class='lxactive'  id='xjp"+i+"'><input class='jpinput' name='jumpaddre1' value='' /> <a href='javascript:;' class='xxljgg xxclick' >选择消息</a></td>"
                                            
                               if(!editHref){
                                   editxxtj += " <td  id='gjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre2' readonly value='' /> <a href='javascript:;' class='xxljgg xzclick' >选择广告</a></td>"
                                            }else{
                                   editxxtj += " <td  id='gjp"+i+"' class='shactive' ><input class='jpinput' name='jumpaddre2' readonly  value='' /> <a href='javascript:;' class='xxljgg xzclick' >选择广告</a></td>"
                               } 
                               editxxtj += "<td class='lxactive' id='jjp"+i+"'><input class='jpinput' name='jumpaddre3' value='' /> <a href='javascript:;' class='xxljgg jhyclick' >选择聚合页</a></td>"
                               +" <td class='lxactive'  id='djp"+i+"'><input class='jpinput' name='jumpaddre4' placeholder='请输入跳转地址' type='text' value='' style='width:30%;'/></td>"
                          +"</tr>"
                       }
                       editxxtj +=" </tr><tr><th>所选名称：</th><td><input type=\"text\" readonly=\"readonly\" name=\"jumpAddressStr\" class=\"jumpAddressStrReadOnly\" style=\"border: none;height: 30px;\" value="+titleorname+" ></td></tr>"
                       +"   <tr>"
                       +"      <th>描述：</th>"
                       +"      <td>"  
                       +"          <input name='' type='text'  class='pmddesc' value='"+editText +"'   />"
                       +"      </td>"
                       +"  </tr>"; 
                   editxxtj +="</table>"
                       +"      </li>";
                       editHtmlImg+=editxxtj;
                   }
               editHtmlImg +="</ul>";
           $('.pmdTips #pmdhtmlCon').html('').append(editHtmlImg);// modals3图片广告弹窗使用
       });
   });

/* *********** 2021 1129便民功能元素 开始 *********** */
//编辑
var feeClickObj = '';//这里创建元素方便下面保存按钮回显添加到该div中
var bmmklisum = 0;//便民元素计数
$(demo).on('click','.feebtn',function(e) {//deme下轮播图片弹窗加载事件
    $("#floorType").val('bmmkedit');//赋值便民模块在广告保存时用来处理逻辑
    feeClickObj = $(this).parent().parent(),//edit父标签的父标签
    e.preventDefault();
    var bmmum = $(feeClickObj).find("input[class='bmnum']").val();
    $("#bmzs").val(bmmum);//选中之前已选的一屏展示
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
            var bmhref = bmli.find(".bmbtna").children("a").attr("url");
            bmhref = bmhref == undefined?"":bmhref;
            var oriData = bmli.find(".bmbtna").children("a").attr("oriData");
            oriData = oriData == undefined?"":oriData;
            var bgbmo = bmli.attr("imgUrl");//首次编辑肯定是none，再次编辑地址应该是带着http的
            bmgneditHtml+=`<li class="bmmoli">
                        <div class="bmmonli_div">
                        <div class="bmmotit">
                        <div><span class="cred"> * </span><span>便民模块名称：</span></div><input type="text" class="bminput titin blockname" value="`+bmName+`">
                        </div>
                        <div class="bmmotit">
                        <div><span>名称排序：</span></div>
                        <div class="proj p_left">`
                        if(bmPor>0){
                            bmgneditHtml+=`<span class="active" data-por="1"  onclick="jpor(this)">居左</span><span class="" data-por="2" onclick="jpor(this)">居中</span>`
                        }else if(bmPor==0){
                            bmgneditHtml+=`<span class="" data-por="1"  onclick="jpor(this)">居左</span><span class="active" data-por="2" onclick="jpor(this)">居中</span>`
                        }
            bmgneditHtml+=`</div></div><div class="bmmotit">
                        <div><span class="cred"> * </span><span>参数值：</span></div>
                        <select class="form-control form-control-select input-sm bmcs">
                        <option value="bmtyll"`;
                        if(csz == "bmtyll"){
                            bmgneditHtml+=`selected`;
                        }
            bmgneditHtml+=`>通用流量剩余</option>
                        <option value="bmhfye"`;
                        if(csz == "bmhfye"){
                            bmgneditHtml+=`selected`;
                        }
            bmgneditHtml+=`>话费余额</option>
                        <option value="bmyyth"`;
                        if(csz == "bmyyth"){
                            bmgneditHtml+=`selected`;
                        }
            bmgneditHtml+=`>语音通话</option>
                        <option value="bmdqld"`;
                        if(csz == "bmdqld"){
                            bmgneditHtml+=`selected`;
                        }
            bmgneditHtml+=`>当前辽豆</option>
                        <option value="bmjf"`;
                        if(csz == "bmjf"){
                            bmgneditHtml+=`selected`;
                        }
            bmgneditHtml+=`>积分</option>
                        <option value="jtkd"`;
                        if(csz == "jtkd"){
                            bmgneditHtml+=`selected`;
                        }
            bmgneditHtml+=`>家庭宽带</option>
                        <option value="jtmbh"`;
                        if(csz == "jtmbh"){
                            bmgneditHtml+=`selected`;
                        }
            bmgneditHtml+=`>家庭魔百和</option>`;
            bmgneditHtml+=`</select>
                        </div>
                        <div class="bmmotit"><div class=""><span>链接地址：</span></div><input type="hidden" class="bmmkChHi" value="`+oriData+`"><input type="text" class="bminput blockurl" value="`+bmhref+`"><span class='jhsp bmjh bmmkadsec'>选择广告/聚合页</span></div>
                        <div class="bmmotit">
                        <div class="">背景图片：</div>
                        <div class="upimgdiv">
                        <div class="uploadImg normalData" >`;
            if(bgbmo == "none" || bgbmo == "" || bgbmo == undefined){
                bmgneditHtml+=`<img src="images/images.png" alt="" class="bmmkimg`+i+`imagesZw" style='display:block;'>
                            <img src="" alt="" class="bmmkimg`+i+`imgPerview" style='display:none;'>
                             <p class="opacityP" id="bmmkimg`+i+`opacityP">上传图片</p>
                            <input type="hidden" name="bmmkimg" value="" id="bmmkimg`+i+`imageName">
                            <input type="file" class="imgInput" id="bmmkimg`+i+`" onchange="upLoadImgChannel(this,0,0,2)" name="UploadBtn">`
            }
            else {
                bmgneditHtml+=`<img src="images/images.png" alt="" class="imagesZw" style='display:none;'>
                            <img src="`+vm.path+`/`+ bgbmo +`" alt="" class="bmmkimg`+i+`imgPerview"  style='display:block;'>
                            <p class="opacityP j-deleteImg" id="bmmkimg`+i+`opacityP" onclick="deleteImg('bmmkimg`+i+`')">删除</p>
                            <input type="hidden" name="bmmkimg" id="bmmkimg`+i+`imageName" value="`+bgbmo+`">
                            <input type="file" class="imgInput" id="bmmkimg`+i+`" onchange="upLoadImgChannel(this,0,0,2)" name="UploadBtn">`
            }
            bmgneditHtml+=`</div>
                        <span class='cred' style="padding-top: 5px; font-size: 12px;">注:图片格式支持上传jpg/png格式,100KB以内。</span>
                        </div>
                        </div>
                        </div>
                        <div class="bm_btn"><a class="cee4358bb" href="javascript:;" onclick="delodule(this)">移除</a><a href="javascript:;" class="c3c9be1bb" onclick="moveBfModule(this)">前移</a></div>
                        </li>`
        }
        $('#bmmould').html('').append(bmgneditHtml);//modals3图片广告弹窗使用
        if(bmmklisum === 0){
            bmmklisum=$("#bmmould").find("li").length;
        }
    });
});

/**
 * 便民元素居中居左切换
 * 是否隐藏参数值
 * */
function jpor(data){
    $(data).addClass("active").siblings("span").removeClass("active");
}

//便民功能弹窗编辑保存
$('.feedit-layer').on('click','.savebmgn',function(e){
    e.preventDefault();
    var imgNum = $(this).parents('.feedit-layer').children(".bmgnmain-content").find("#bmmould li").length;
    console.log(imgNum);
    var swipNum = $("#bmzs").val();
    var editBmgn='<input type="hidden" value="'+swipNum+'" class="bmnum">';
    for(var i= 0 ;i<imgNum;i++){
        //获取业务图片地址style="background-image:url(../images/bmbg1.png);"titin
        console.log($(this));
        var lidiv = $(this).parents('.feedit-layer').children(".bmgnmain-content").find("#bmmould li").eq(i);
        var tit = lidiv.find(".titin").val();
        var seltit = lidiv.find(".bmcs").val();
        //20220128 add 增加居中居左
        var porjj = $(lidiv).find(".p_left .active").attr("data-por");//是否居中
        var imgSrc2 = lidiv.find("input[name='bmmkimg']").val();
        var dis = lidiv.find(".imgPerview").css("display");
        var url = lidiv.find("input:text[class='bminput blockurl']").val();
        var oriData = lidiv.find("input[class='bmmkChHi']").val();
        console.log(tit,seltit,dis);
        if(imgSrc2 != "none" && imgSrc2!=""){
            if(seltit == 'jtkd'||seltit == 'jtmbh'){//居左//20220128 add 增加居中居左
                editBmgn += `<li class="swiper-slide slidebm slidebm_kd jbmgnslide" style="background-image:url('`+vm.path+`/`+imgSrc2+`');" imgUrl="`+imgSrc2+`">`;
            }else{
                editBmgn += `<li class="swiper-slide slidebm jbmgnslide" style="background-image:url('`+vm.path+`/`+imgSrc2+`');" imgUrl="`+imgSrc2+`">`;
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
        editBmgn += `<div class="inclass my_bjgn"><input type="hidden"  class="hidetit"  value="`+ seltit +`">`
        if(porjj == "1"){//居左
            editBmgn += `<p class="md_des md_des_left">`+ tit +`</p>`;
        }else if(porjj=="2"){//居中
            editBmgn += `<p class="md_des ">`+ tit +`</p>`;
        }
        if(seltit == 'bmtyll'){
            editBmgn +=`<p class="md_txt_bd"><span>--</span><span>GB</span> </p>`
        }else if(seltit == 'bmhfye'){
            editBmgn +=`<p class="md_txt_bd"><span>--</span><span>元</span> </p>`
        }else if(seltit == 'bmyyth'){
            editBmgn +=`<p class="md_txt_bd"><span>--</span><span>分钟</span> </p>`
        }else if(seltit == 'bmdqld'){
            editBmgn +=`<p class="md_txt_bd"><span>--</span><span>豆</span> </p>`
        }else if(seltit == 'bmjf'){
            editBmgn +=`<p class="md_txt_bd"><span>--</span><span>分</span> </p>`
        }
        if(url != "none" && url!=""){
            if(seltit == 'jtkd'||seltit == 'jtmbh'){ //20220128 add 增加宽带判断
                editBmgn += `<div class="bmzwbtn bmzwbtnExp bmbtna"><a href="javascript:void(0);" clickfun="javascript:addToProductStore.executeFvsStatcAdidForPhone('`+url.trim()+`','1',this,'02','','1','','1');" url="`+url.trim()+`
            " oriData="`+oriData+`"></a></div>`;
            }else {
                editBmgn += `<div class="bmzwbtn bmbtna"><a href="javascript:void(0);" onclick="javascript:addToProductStore.executeFvsStatcAdidForPhone('`+url.trim()+`','1',this,'02','','1','','1');" url="`+url.trim()+`
            " oriData="`+oriData+`"></a></div>`;
            }
        }else{
            if(seltit == 'jtkd'||seltit == 'jtmbh'){ //20220128 add 增加宽带判断
                editBmgn +=`<div class="bmzwbtn bmzwbtnExp bmbtna hidefee"><a href="javascript:void(0);"></a></div>`;
            }else{
                editBmgn +=`<div class="bmzwbtn bmbtna hidefee"><a href="javascript:void(0);"></a></div>`;
            }
        }
        editBmgn +=`</div></li>`;
    }
    $(feeClickObj).find('.bmgnView .showFeeUl').html(editBmgn);
    $(feeClickObj).find('.bmgnView .showFeeUl').find(".bmnum").val(swipNum);
    var a = $(feeClickObj).find(".jbmgnswip");
    console.log(a);
    //初始化菜单滑动
    // ;//添加事件执行的唯一样式
    var swiperbmgn1 = new Swiper(a, {
        slidesPerView: swipNum, //这里默认3.5个，实际参数可配置， 头部一行显示多少个 .5表示显示半个
        paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
        spaceBetween: 10,
        freeMode: true, //默认为false，普通模式: slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
        loop: false, //是否可循环
        scrollbarHide : false,
        scrollbarSnapOnRelease:true
    });
    closeC('.modals_bmgn');//保存回显成功关闭弹窗
});
/* *********** 20211129add便民功能元素 结束 *********** */

/* *********** 20220411家庭宽带元素新增元素 开始 *********** */
// 类型控制按钮
//编辑 20220128 update feebtn
var feeClickObj_jtkd = ''; //这里创建元素方便下面保存按钮回显添加到该div中
$(demo).on('click', '.feejtkdbtn', function (e) { //deme下轮播图片弹窗加载事件
    feeClickObj_jtkd = $(this).parent().parent(), //edit父标签的父标签
        e.preventDefault();
    $('.coMmodals').show(); //展示蒙版
    var p = $(this).parent().parent();
    // var b = $(this).parent().parent();
    $('.modals_jtkd').fadeIn(200, function () { //展示元素弹窗编辑
        var layer = $('.feedit-layerkd', this);
        layer.css({
            'margin-top': -(layer.height()) / 2,
            'margin-left': -(layer.width()) / 2
        }).fadeIn(100);
        var imgNum = p.find('.jtkdswip .jtkdslide').length; //遍历元素并添加值
        var jtkdeditHtml = "";
        //通过for循环遍历显示页面的li组件
        for (var i = 0; i < imgNum; i++) {
            var jtkdli = p.find('.jtkdswip .jtkdslide').eq(i);
            var jtkdName = jtkdli.find(".kd_des").text();
            var para = jtkdli.find(".kd_txt_bd").text();
            var jtkdbtn = jtkdli.find(".kd_txt_ft").text();
            var jtkdPor = jtkdli.find(".kd_des_left").length;
            console.log(jtkdPor, "jtkdPor的长度");
            var csz = jtkdli.find(".hidetit").val();
            var jtkdhref = jtkdli.find(".kdbtna").children("input").prop("value");
            if (!jtkdhref){
                jtkdhref = "";
            }
            var bgbmo = jtkdli.css("backgroundImage");
            bgbmo = bgbmo.substr(5, bgbmo.length - 1); //将backgroundImage中url地址截取字符串适应img中src
            var jtkdbtnProb = p.find('.jtkdswip_pro .jtkd_mykd .kdbtn_link').text();
            var jtkdbtnProd = p.find('.jtkdswip_pro .jtkd_mykdvedio .kdbtn_link').text();
            var jtkdproLinkb = p.find(".jtkdswip_pro .jtkd_mykd .pro_kd").children("input").prop("value");
            if (!jtkdproLinkb){
                jtkdproLinkb = "";
            }
            var jtkdproLinkd = p.find(".jtkdswip_pro .jtkd_mykdvedio .pro_video").children("input").prop("value");
            if (!jtkdproLinkd){
                jtkdproLinkd = "";
            }
            console.log(jtkdproLinkd, "获取原先页面链接的值");
            jtkdeditHtml += `<li class="bmmoli">
						<div class="bmmonli_div">
							<div class="bmmotit">
								<div><span class="cred"> * </span><span>家庭模块名称：</span></div><input type="text" class="bminput titinkd" value="` + jtkdName + `">
							</div>
							<div class="bmmotit">
								<div><span>名称排序：</span></div>
								<div class="proj p_left">`
            if (jtkdPor > 0) {
                jtkdeditHtml += `<span class="active" data-por="1"  onclick="jpor(this)">居左</span><span class="" data-por="2" onclick="jpor(this)">居中</span>`
            } else if (jtkdPor == 0) {
                jtkdeditHtml += `	<span class="" data-por="1"  onclick="jpor(this)">居左</span><span class="active" data-por="2" onclick="jpor(this)">居中</span>`
            }

            jtkdeditHtml += `</div>
							</div>
							<div class="bmmotit">
								<div><span class="cred"> * </span><span>参数值：</span></div><input type="text" class="bminput titinbd" value="` + para + `">`
            jtkdeditHtml += `</select>
							</div>
						
							<div class="bmmotit">
								<div><span>按钮文字：</span></div><input type="text" class="bminput titin_ft" value="` + jtkdbtn + `">
								</div>
							<div class="bmmotit"><div class=""><span>链接地址：</span></div><input type="text" class="bminput btn_link bminput_" value="` + jtkdhref + `"><span class='jhsp jtkdjh' onclick="chooseAdinfo3(this,'1','');">选择广告/聚合页</span></div>
							<div class="bmmotit">
								<div class="">背景图片：</div>
								<div class="upimgdiv">
									<div class="uploadImg normalData" >`;
            // 20220412add图片链接
            if (bgbmo == "none" || bgbmo == "") {
                jtkdeditHtml += `<img src="images/images.png" alt="" class="imagesZw" style='display:block;'>
											   <img src="" alt="" class="imgPerview" style='display:none;'>
											   <p class="opacityP">上传图片</p>`
            } else {
                jtkdeditHtml += `<img src="images/images.png" alt="" class="imagesZw" style='display:none;'>
											<img src="` + bgbmo + `" alt="" class="imgPerview" style='display:block;'>
											<p class="opacityP j-deleteImg">删除</p>`
            }
            jtkdeditHtml += `<input type="file" class="imgInput" onchange="imgInput_file(this.files,this)">
									</div>
									<span class='cred' style="padding-top: 5px; font-size: 12px;">注:图片格式支持上传jpg/png格式,100KB以内。</span>
								</div>
							</div>`;

            if (i == 1) {
                // 	//展示宽带属性
                jtkdeditHtml += `<div class="bmmotit" id="properties">
										<div><span>我的宽带属性：</span></div>
										<form action="#" method="post" name="" id="broadband">
											<input type="radio" name="show" id="no_kd">不展示
											<input type="radio" name="show" id="yes_kd" checked="checked">展示
										</form>
									</div>
									<div class="bmmotit" id="kdproshowb_btn">
								<div><span>按钮文字：</span></div><input type="text" class="bminput  tit_btnb" value="` + jtkdbtnProb + `">
								</div>
							<div class="bmmotit" id="kdproshowb_btn">
								<div class=""><span>链接地址：</span></div><input type="text" class="bminput btnpro_linkb bminput_" value="` + jtkdproLinkb + `"><span class='jhsp jtkdjh' onclick="chooseAdinfo3(this,'1','');">选择广告/聚合页</span></div>

						</div> `
            } else if (i == 3) {
                jtkdeditHtml += `<div class="bmmotit" id="properties">
									<div><span>宽带视频属性：</span></div>
									<form action="#" method="post" name="" id="Broadbandvideo">
										<input type="radio" name="show" id="no_vd">不展示
										<input type="radio" name="show" id="yes_vd"  checked="checked">展示
									</form>
								</div> 
								<div class="bmmotit">
								<div><span>按钮文字：</span></div><input type="text" class="bminput  tit_btnd" value="` + jtkdbtnProd + `">
								</div>
							<div class="bmmotit">
								<div class=""><span>链接地址：</span></div><input type="text" class="bminput btnpro_linkd bminput_" value="` + jtkdproLinkd + `"><span class='jhsp jtkdjh' onclick="chooseAdinfo3(this,'1','');">选择广告/聚合页</span></div>

						</div>`
            }
            jtkdeditHtml += `</li>`
        }

        $('#jtkdmould').html('').append(jtkdeditHtml); //modals3图片广告弹窗使用
    });
});

//20220411家庭宽带元素新增弹窗编辑保存
$('.feedit-layerkd').on('click', '.savejtkd', function (e) {
    e.preventDefault();
    var imgNum = $(this).parents('.feedit-layerkd').children(".jtkdmain-content").find("#jtkdmould li").length;
    console.log(imgNum);
    var editJtkd = '';

    for (var i = 0; i < imgNum; i++) {
        var lidiv = $(this).parents('.feedit-layerkd').children(".jtkdmain-content").find("#jtkdmould li").eq(i);
        var tit = lidiv.find(".titinkd").val();
        var tit_ft = lidiv.find(".titin_ft").val();
        var tit_bd = lidiv.find(".titinbd").val();
        if (!tit_bd){
            alert("请填写参数值");
            return;
        }
        var seltit = lidiv.find(".bmcs").val();
        //20220128 add 增加居中居左
        var porjj = $(lidiv).find(".p_left .active").attr("data-por"); //是否居中
        console.log(porjj, "居中数字 1或2");
        var btnlink = lidiv.find(".btn_link").val();
        var btnlink_ = "javascript:addToProductStore.executeFvsStatcAdidForPhone('"+btnlink+"','1',this,'02','','1','','1')";
        var imgSrc2 = lidiv.find(".imgPerview").attr("src");
        var dis = lidiv.find(".imgPerview").css("display");
        if (imgSrc2 != "none" && imgSrc2 != "") {
            //20220128 add 增加宽带判断
            if (seltit == 'jtkd' || seltit == 'jtmbh') { //居左//20220128 add 增加居中居左
                editJtkd += `<li class="swiper-slide slidebm slidebm_kd jtkdslide" style="background-image:url('` + imgSrc2 + `');">`;
            } else {

                editJtkd += `<li class="swiper-slide slidebm jtkdslide" style="background-image:url('` + imgSrc2 + `');">`;
            }
        } else {
            //20220128 add 增加宽带判断
            if (seltit == 'jtkd' || seltit == 'jtmbh') { //居左//20220128 add 增加居中居左
                editJtkd += `<li class="swiper-slide slidebm slidebm_kd jtkdslide" >`;
            } else {

                editJtkd += `<li class="swiper-slide slidebm  jtkdslide" >`;
            }
        }
        //20220128 add 增加居中居左
        editJtkd += `<div class="my_jtkd">
										<input type="hidden"  class="hidetit"  value="` + seltit + `">`
        if (porjj == "1") { //居左
            editJtkd += `<p class="kd_des kd_des_left">` + tit + `</p>`;
        } else if (porjj == "2") { //居中
            editJtkd += `<p class="kd_des ">` + tit + `</p>`;
        }
        editJtkd += `<p class="kd_txt_bd">` + tit_bd + `</p>`
        //除了位置1切换手机号按钮以外的按钮删除
        if(i>0){
            editJtkd += `<p class="kd_txt_ft kdbtna"><input type="hidden"   value="` + btnlink + `"></p>`;
        }else {
            editJtkd += `<p class="kd_txt_ft kdbtna"><input type="hidden"   value="` + btnlink + `"><a href="javascript:void(0)" onclick="` + btnlink_ + `">` + tit_ft + `</a></p>`;
        }
        editJtkd += `</div>
							</li>`;

    }
    var jtkdNoneAll = $("#jtkdNoneAll").val();
    var jtkdNoneTV = $("#jtkdNoneTV").val();
    var jtkdHasAll = $("#jtkdHasAll").val();
    editJtkd += '<input type="hidden" id="jtkdNoneAllHidden" value="'+jtkdNoneAll+'"/><input type="hidden" id="jtkdNoneTVHidden" value="'+jtkdNoneTV+'"/>'+
        '<input type="hidden" id="jtkdHasAllHidden" value="'+jtkdHasAll+'"/>';
    $(feeClickObj_jtkd).find('.jtkdView .showFeeUl').html(editJtkd);

    // 编辑宽带属性
    var editJtkd_pro = '';
    for (var i = 0; i < imgNum; i++) {
        //获取业务图片地址style="background-image:url(../images/bmbg1.png);"titin
        // var swipNum = $("#bmzs").val();
        var lidiv_pro = $(this).parents('.feedit-layerkd').children(".jtkdmain-content").find("#jtkdmould li").eq(i);
        var attribute = lidiv_pro.find("#properties");
        var my_kd = attribute.find("#broadband");
        var show_kd = my_kd.find("#yes_kd");
        var kd_video = attribute.find("#Broadbandvideo");
        var show_kdvideo = kd_video.find("#yes_vd");
        //20220413
        var tit_linkbtnb = lidiv_pro.find(".tit_btnb").val();
        var btnproLinkb = lidiv_pro.find(".btnpro_linkb").val();
        var btnproLinkb_ = "javascript:addToProductStore.executeFvsStatcAdidForPhone('"+btnproLinkb+"','1',this,'02','','1','','1')";
        var tit_linkbtnd = lidiv_pro.find(".tit_btnd").val();
        var btnproLinkd = lidiv_pro.find(".btnpro_linkd").val();
        var btnproLinkd_ = "javascript:addToProductStore.executeFvsStatcAdidForPhone('"+btnproLinkd+"','1',this,'02','','1','','1')";
        // console.log(tit_linkbtnd,"获取");
        if ($(show_kd).prop("checked")) {
            editJtkd_pro += `<li class="panel jtkd_mykd jtkdslide_pro">
				<div class="content_top pro_kd">
					<h5>我的宽带</h5>
					<input type="hidden"   value="` + btnproLinkb + `">
					<a href="javascript:void(0)"  class="kdbtn_link"  onclick="` + btnproLinkb_ + `">` + tit_linkbtnb + `</a>
				</div>
				<p class="con_title">200M家庭宽带员工体验240元/12个月</p>
				<p class="efftime">生效时间：<span >2022年04月20日</span></p>
				<p class="failtime">失效时间：<span >2022年04月20日</span></p>
				<p class="address">安装地址：<span>沈阳市和平区南市场街道xx小区4-1-2</span></p>

			</li> `

        }
        if ($(show_kdvideo).prop("checked")) {
            editJtkd_pro += `<li class="panel jtkd_mykdvedio jtkdslide_pro">
				<div class="content_top pro_video">
					<h5>我的宽带电视</h5>
					<input type="hidden"   value="` + btnproLinkd + `">
					<a href="javascript:void(0)" class="kdbtn_link" onclick="` + btnproLinkd_ + `">` + tit_linkbtnd + `</a>
				</div>
				<p class="con_title">魔百盒120元/年</p>
				<p class="efftime">生效时间：<span >2022年04月20日</span></p>
				<p class="failtime">失效时间：<span >2022年04月20日</span></p>
			</li>`

        }
    }
    $(feeClickObj_jtkd).find('.jtkdView .jtkd_pro').html(editJtkd_pro);
    $(" .jtkdswip").each(function (i, u) {
        //初始化菜单滑动
        // ;//添加事件执行的唯一样式
        var swiperjtkd1 = new Swiper('.jtkd_' + i, {
            // slidesPerView: swipNum, //这里默认3.5个，实际参数可配置， 头部一行显示多少个 .5表示显示半个
            slidesPerView: 3,
            paginationClickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
            spaceBetween: 10,
            freeMode: true, //默认为false，普通模式: slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
            loop: false, //是否可循环
            scrollbarHide: false,
            scrollbarSnapOnRelease: true


        });
    });
    var editLogin_no = '';
    var liNum = $(this).parents('.feedit-layerkd').children(".jtkdmain-content").find("#jtkd_no_opend li").length;
    for (var i = 0; i < liNum; i++) {
        var lidiv = $(this).parents('.feedit-layerkd').children(".jtkdmain-content").find("#jtkd_no_opend li").eq(i);
        var tit_lo = lidiv.find(".titinkd_login").val();
        var tit_lo_btn = lidiv.find(".btn_text").val();
        var tip_p = lidiv.find(".btn_tip").val();
        var login_href = lidiv.find(".lo_href").val();
        //20220128 add 增加居中居左
        var porjj = $(lidiv).find(".p_left .active").attr("data-por");//是否居中
        editLogin_no += `<li class="panel no_loginkd_text">
				<div class="msg">`;
        if (porjj == "1") { //居左
            editLogin_no += `<p class="text lo_des kd_des_left">` + tit_lo + `</p>`
        } else if (porjj == "2") { //居中
            editLogin_no += `<p class="text lo_des">` + tit_lo + `</p>`
        }
        if (i == 0) {
            editLogin_no += `<a href="` + login_href + `" class="btn btn_0429">` + tit_lo_btn + `</a>`
            editLogin_no += `</div>
							</li>`;
        } else if (i == 1) {
            editLogin_no += `<a href="` + login_href + `" class="btn btn_0429">` + tit_lo_btn + `</a>`
            editLogin_no += `</div>	<p class="tipwx">` + tip_p + `</p>
							</li>`;
        }


    }
    $(feeClickObj_jtkd_login).find('.jtkdView .showFee_nolo').html(editLogin_no);
    closeC('.modals_jtkd'); //保存回显成功关闭弹窗
});
/* *********** 20220411家庭宽带元素新增 结束 *********** */
/* *********** 20220413add宽带未开通模块 开始 *********** */
var feeClickObj_jtkd_login = ''; //这里创建元素方便下面保存按钮回显添加到该div中
$(demo).on('click', '.feejtkdbtn', function (e) { //deme下轮播图片弹窗加载事件
    feeClickObj_jtkd_login = $(this).parent().parent(), //edit父标签的父标签
        e.preventDefault();
    $('.coMmodals').show(); //展示蒙版
    var p = $(this).parent().parent();
    var jtkdNoneAll = $("#jtkdNoneAllHidden").val();
    var jtkdNoneTV = $("#jtkdNoneTVHidden").val();
    var jtkdHasAll = $("#jtkdHasAllHidden").val();
    $("#jtkdNoneAll").val(jtkdNoneAll);
    $("#jtkdNoneTV").val(jtkdNoneTV);
    $("#jtkdHasAll").val(jtkdHasAll);
    $('.modals_jtkd').fadeIn(200, function () { //展示元素弹窗编辑
        var layer = $('.feedit-layerkd', this);
        layer.css({
            'margin-top': -(layer.height()) / 2,
            'margin-left': -(layer.width()) / 2
        }).fadeIn(100);
        var textNum = p.find('.no_loginkd .no_loginkd_text').length;
        //遍历元素并添加值
        var loginHtml = "";

        for (var i = 0; i < textNum; i++) {
            var loginli = p.find('.no_loginkd .no_loginkd_text').eq(i);
            var textName = loginli.find(".text").text();
            var loginbtn = loginli.find(".btn").text();
            var loginPor = loginli.find(".kd_des_left").length;
            // var loginhref = loginli.find(".msg").children("a").prop("href");
            var tiptext = loginli.find(".tipwx").text();
            loginHtml += `<li class="jtkd_noli">
						<div class="bmmonli_div">
						<div class="bmmotit">
								<div><span>内容显示：</span></div>`;
            if (i == 0) {
                loginHtml += `<div class="">无号码</div>`
            } else if (i == 1) {
                loginHtml += `<div class="">有号码</div>`
            }

            loginHtml += `</div>
							<div class="bmmotit">
								<div><span class="cred"> * </span><span>家庭模块名称：</span></div><input type="text" class="logininput titinkd_login" value="` + textName + `">
							</div>
							<div class="bmmotit">
								<div><span>名称排序：</span></div>
								<div class="proj p_left">`
            if (loginPor > 0) {
                loginHtml += `<span class="active" data-por="1"  onclick="jpor(this)">居左</span><span class="" data-por="2" onclick="jpor(this)">居中</span>`
            } else if (loginPor == 0) {
                loginHtml += `	<span class="" data-por="1"  onclick="jpor(this)">居左</span><span class="active" data-por="2" onclick="jpor(this)">居中</span>`
            }

            loginHtml += `</div>
							</div> `;
            //下面这行代码原先按钮文字下面 之前是按钮的链接地址
            // <div class="bmmotit"><div class=""><span>链接地址：</span></div><input type="text" class="bminput lo_href" value="` + loginhref + `"><span class='jhsp jtkdjh'>选择广告/聚合页</span></div>
            if (i == 0) {
                loginHtml += `<div class="bmmotit">
								<div><span>按钮文字：</span></div><input type="text" class="bminput btn_text" value="` + loginbtn + `">
								</div>
							`
            } else if (i == 1) {
                loginHtml += `<div class="bmmotit">
					<div><span>按钮文字：</span></div><input type="text" class="bminput btn_text" value="` + loginbtn + `">
					</div>
					<div class="bmmotit">
								<div><span>文字描述：</span></div><input type="text" class="logininput btn_tip" value="` + tiptext + `">
								</div>`
            }
            loginHtml += `</li>`
        }

        $('#jtkd_no_opend').html('').append(loginHtml); //modals3图片广告弹窗使用
    });
});

/* *********** 20220413add宽带未开通模块 结束 *********** */

/* 20211130 add */
// 便民模块功能前移
function moveBfModule(obj) {
    var current = $(obj).parents("li"); //获取当前div模块
    var prev = current.prev(); //获取当前div前一个元素
    if (current.index() > 0) {
        current.insertBefore(prev); //插入到当前div前一个元素前
        initSortPmd();
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

//添加便民功能模块
function addbmgnmo(){
    var bmgnStr = `<li class="bmmoli">
        <div class="bmmonli_div">
        <div class="bmmotit">
        <div><span class="cred"> * </span><span>便民模块名称：</span></div><input type="text" class="bminput titin blockname" value="">
        </div>
        <div class="bmmotit">
        <div><span>名称排序：</span></div>
        <div class="proj p_left">
        <span class="active" data-por="1"  onclick="jpor(this)">居左</span><span class="" data-por="2"  onclick="jpor(this)">居中</span>
        </div>
        </div>
        <div class="bmmotit">
        <div><span class="cred"> * </span><span>参数值：</span></div>
        <select class="form-control form-control-select input-sm bmcs">
        <option value="bmtyll" selected>通用流量剩余</option>
        <option value="bmhfye">话费余额</option>
        <option value="bmyyth">语音通话</option>
        <option value="bmdqld">当前辽豆</option>
        <option value="bmjf">积分</option>
        <option value="jtkd">家庭宽带</option>
        <option value="jtmbh">家庭魔百和</option>
        </select>
        </div>
        <div class="bmmotit"><div class=""><span>链接地址：</span></div><input type="hidden" class="bmmkChHi" value="">
        <input type="text" class="bminput blockurl" value=""><span class='jhsp bmjh bmmkadsec'>选择广告/聚合页</span></div>
        <div class="bmmotit">
        <div class="">背景图片：</div>
        <div class="upimgdiv">
        <div class="uploadImg normalData" >
        <img src="images/images.png" alt="" class="imagesZw" >
        <img src="" alt="" class="bmmkimg`+bmmklisum+`imgPerview">
        <p class="opacityP" id="bmmkimg`+bmmklisum+`opacityP ">上传图片</p>
        <input type="hidden" name="bmmkimg" value="" id="bmmkimg`+bmmklisum+`imageName">
        <input type="file" class="imgInput" id="bmmkimg`+bmmklisum+`" onchange="upLoadImgChannel(this,0,0,2)" name="UploadBtn">
        </div>
        <span class='cred' style="padding-top: 5px; font-size: 12px;">注:图片格式支持上传jpg/png格式,100KB以内。</span>
        </div>
        </div>
        </div>
        <div class="bm_btn"><a class="cee4358bb" href="javascript:void(0);" onclick="delodule(this)">移除</a><a href="javascript:void(0);" class="c3c9be1bb" onclick="moveBfModule(this)">前移</a></div>
        </li>`;
    bmmklisum ++;
    $("#bmmould").append(bmgnStr);
}
//便民模块选择广告
var bmmkAdSecObj;
$(document).on('click','.bmmkadsec',function (e) {
    bmmkAdSecObj = $(this);
    $('.modals_cspzjhy').fadeIn(200, function() {//展示参数配置弹层
        var zhi=$(bmmkAdSecObj).parents(".bmmoli").find("input[class='bmmkChHi']").val();
        huixianJH(zhi);
        huixanzhi=zhi;
        var layer=$('.cspzedit-layer',this);
        layer.css({
            'margin-top':-(layer.height())/2,
            'margin-left':-(layer.width())/2
        }).fadeIn(100);//弹窗位置设置
        //iop推荐弹窗拼串开始
        $('#htmlConjh').show();//默认展示IOP推荐tab
    });
})
   
 ///////////////////////////////////////////////////选择消息start////////////////////////////////////////////////////////////
   $(document).on('click','.xxclick',function(e) { 
     //弹窗前给当前选择的btn增加个class
     $(this).prev().addClass("upActive");//为了获取该标识并赋值
     $(this).parent().find('.jpinput').attr('id','pmdjumpaddr')
     $('.cmsModalTips').fadeIn(200, function() { 
       var layer=$('.cmszedit-layer',this);
       layer.css({
         'margin-top':-(layer.height())/2,
         'margin-left':-(layer.width())/2
       }).fadeIn(100);  
       $(this).children("#tcname").val($("#pmdtc").val());//标识是哪个弹窗的按钮发起的
     });
   });
   ///////////////////////////////////////////////////选择消息end///////////////////////////////////////////////////////////

   // 跑马灯选择广告
   $(document).on('click','.xzclick',function(e) {
       resetValuead();
       showggjh('ggtable');
       $(".tiaoType").html('选择广告');
       $(".pmdtext").html('广告');
       $(".showiop").hide();
       $(".showpmd").show();
       $("#floorType").val('pmdad');
       $(this).parent().find('.jpinput').attr('id','pmdjumpaddr')
       var id= this.id;
       $("#jhspId").val(id);
       var zhi=$(this).parent().find('.jpinput').val();
       console.log(zhi);
       huixianJH(zhi);
       huixanzhi=zhi;
        $('.modals_cspzjhy').fadeIn(200, function() {// 展示参数配置弹层
            var layer=$('.cspzedit-layer',this);
            layer.css({
                'margin-top':-(layer.height())/2,
                'margin-left':-(layer.width())/2
            }).fadeIn(100);// 弹窗位置设置
            // iop推荐弹窗拼串开始
            $('#htmlConjh').show();// 默认展示IOP推荐tab
        });

     });
 
// 跑马灯选择聚合页
 $(document).on('click','.jhyclick',function(e) {
     showggjh('jhytable');
     $(".tiaoType").html('选择聚合页');
     $(".pmdtext").html('聚合页');
     $(".showiop").hide();
     $(".showpmd").show();
     $("#floorType").val('pmdjh');
     $(this).parent().find('.jpinput').attr('id','pmdjumpaddr')
     var id= this.id;
     var zhi=$(this).parent().find('.jpinput').val();
     huixianJH(zhi);
     huixanzhi=zhi;
     $("#jhspId").val(id);
      $('.modals_cspzjhy').fadeIn(200, function() {// 展示参数配置弹层
          var layer=$('.cspzedit-layer',this);
          layer.css({
              'margin-top':-(layer.height())/2,
              'margin-left':-(layer.width())/2
          }).fadeIn(100);// 弹窗位置设置
          // iop推荐弹窗拼串开始
          $('#htmlConjh').show();// 默认展示IOP推荐tab
      });

   });
 


// 跑马灯增加
 function addpmd(a){
     // 增加前 lt获取已有li的个数
     var lt = $(a).parents(".pmdmodal").find(".pmddes").children("ul").children("li").length;

     lt = lt+1;
     // 新增追加完成后需要遍历初始化各列id等 由于时间关系 ，这里不做详细处理。时间实在太紧张了。
     initpmd(a,lt);
 }

   // 跑马灯文本保存
   $(".pmdmodal").on('click','.savepmd',function(e) {
       var imgNum = $(this).parents('.pmdmodal').children(".pmddes").find("li").length; 
       var editPmd='';
       for(var i= 0 ;i<imgNum;i++){

           var btnm = $(this).parents('.pmdmodal').children(".pmddes").find(".pmdtable").eq(i).find("tr:first-child").find("td").find('input[type="radio"]:checked').val();// 类型
           var implj = $(this).parents('.pmdmodal').children(".pmddes").find(".shactive .jpinput").eq(i).val();// 跳转地址
           var titleorname = $(this).parents('.pmdmodal').children(".pmddes").find(".shactive .jpinput").eq(i).closest("tr").next().find("input").val();// 跳转地址名
           var descpmd = $(this).parents('.pmdmodal').children(".pmddes").find(".pmddesc").eq(i).val();// 描述
           if (!btnm ) {
               continue;
           }
            console.log(implj);
           editPmd +=  '<div class="swiper-slide">\
           <input type="hidden" name="xxtzlx'+(i+1)+'" value="'+btnm+'">\
           <input type="hidden" name="jumpadres1" value="'+implj+'">\
           <input type="hidden" name="destxt1">';
           
           if (!descpmd) {
               alert('第'+(i+1)+'行请填写描述')
               return;
           }
           
           if (implj.indexOf('adid=')>-1) {
               implj = implj.substring(implj.indexOf('=') +1);
             if (!implj) {
                 alert('第'+(i+1)+'行请选择广告')
                 return;
             }
               var click = ' onclick=\"javascript:addToProductStore.executeFvs1('+ '\'' + implj + '\'' + ',\'1\',this,\'02\',\'\',\'1\')\"';
               editPmd += '<a titleorname='+titleorname+' "href="javascript:void(0)" '+click+'>';
               editPmd += '<input type="hidden" id="adidhref" value="'+implj+'">';
           } else if (implj.indexOf('decorateId')>-1) {
               if (!implj) {
                   alert('第'+(i+1)+'行请选择聚合页')
                   return;
               }
               editPmd += '<a titleorname='+titleorname+' href="javascript:void(0)" onclick=\"javascript:addToProductStore.executeFvsStatcAdid('+ '\'' + implj + '\'' + ',\'1\',this,\'02\',\'\',\'1\')\">';
               editPmd += '<input type="hidden" id="jhyhref" value="'+implj+'">';
           } else if (implj.indexOf('noticeId')>-1) {
             if (!implj) {
               alert('第'+(i+1)+'行请选择消息')
               return;
             }
             editPmd += '<a titleorname='+titleorname+' href="javascript:void(0)" onclick=\"window.location='+ '\'' +implj + '\'' + '\">';
             editPmd += '<input type="hidden" id="jhyhref" value="'+implj+'">';
           } else {
               editPmd += '<a href="'+implj+ ' ">';
           }
           editPmd += '<span class="index-message-text limit1 c333">'+descpmd+'</span>\
           </a>\
       </div>'; 
        
       }
       $(pmdthisClickObj).find('.xxpmd .msgwrap').html(editPmd);

       closeC('.pmdTips');// 保存成功后关闭
   });

// 跑马灯删除
   function delpmd(a){
     $(a).parents("li").remove();
   }
   
/** *******************************跑马灯end*********************************** **/

 //点击切换是否关联广告轮播图使用 lbtxzgg
   function qhglgg(dqys,gl){
       console.log($(dqys).parent("tr").next(".trLj"));
       if(gl=='0'){//1是关联广告 0 不是关联广告
           $(dqys).parent("td").parent("tr").next(".trLj").show();
           $(dqys).parent("td").parent("tr").next("tr").next(".lbtxzgg").hide();
           $(dqys).parent("td").parent("tr").next("tr").next().next(".lbtxzgg").hide();
       }
       if(gl=='1'){
           $(dqys).parent("td").parent("tr").next("tr").next(".lbtxzgg").show();
           $(dqys).parent("td").parent("tr").next("tr").next().next(".lbtxzgg").show();
           $(dqys).parent("td").parent("tr").next(".trLj").hide();
           
       }
   }
   

// 切换类型tabraido
function qhlx(t,a){ 
  
//  if (a.indexOf('xjp') > -1) {
//      $("#"+a).siblings("td").addClass("lxactive").removeClass("shactive");// 同级tdnone
//      $("#"+a).siblings("th").addClass("lxactive").removeClass("shactive");// 同级tdnone
//      return;
//  }
//  $("#"+a).siblings("th").addClass("lxactive").removeClass("lxactive");// 同级tdnone
  $(t).parents("tr").next().children("#"+a).removeClass("lxactive").addClass("shactive");// 展示对应的id
  $("#"+a).siblings("td").addClass("lxactive").removeClass("shactive");// 同级tdnone

}

//新底部导航移除
function delwhy(a){
	$(a).parent("td").parent("tr").remove();
	//删除后重新排序菜单
}
function goToPageAD(){
	var pagevalue=$("#gopageAd").val();
	 var pagesize=vm.pageObject.totalPage;
	if(!validIsNum(pagevalue)||pagevalue==''){
		alert("请输入合法页数!");
		return false;
	}else if(pagevalue>pagesize||pagevalue==0){
		alert("请输入合法页数!");
		document.getElementById('gopage').value='';
		document.getElementById('gopage').focus();
		return false;
	}
	 document.getElementById('pageNumber').value=pagevalue;
     jQuery.ajax({
         url: vm.path+"/tWlmDecorate/queryPolicyAd.do" ,// url
         type: "POST",// 方法类型
         data: $('#queryadid1').serialize(),
         dataType:'html',
         dataType:'json',
         success:function(data){
             if(data.flag==true){
                 vm.adList=data.adList;
                 vm.limit=data.limit;
                 vm.pageObject=data.pageObject;
                 vm.rowsPerPage=data. pageObject.rowsPerPage;
                 vm.type=data.type;
                 vm.pageNumber=data.pageNumber;
             }
             setTimeout(function(){ huixianJH(huixanzhi)},200);
         },
         // 调用出错执行的函数
         error: function(){
             alert("操作异常");
         } 
     });
}

function goToPageVideo(){
	var pagevalue=$("#gopageVideo").val();
	 var pagesize=vm.pageObject4.totalPage;
	if(!validIsNum(pagevalue)||pagevalue==''){
		alert("请输入合法页数!");
		return false;
	}else if(pagevalue>pagesize||pagevalue==0){
		alert("请输入合法页数!");
		document.getElementById('gopageVideo').value='';
		document.getElementById('gopageVideo').focus();
		return false;
	}
	 document.getElementById('pageNumberVideo').value=pagevalue;
     jQuery.ajax({
         url: vm.path+"/tWlmDecorate/queryVideo.do" ,// url
         type: "POST",// 方法类型
         data: $('#queryVideo1').serialize(),
         dataType:'html',
         dataType:'json',
         success:function(data){
             if(data.flag==true){
                 vm.videoList=data.videoList;
                 vm.limit4=data.limit;
                 vm.pageObject4=data.pageObject;
                 vm.rowsPerPage4=data. pageObject.rowsPerPage;
                 vm.pageNumberVideo=data.pageNumber;
             }
             setTimeout(function(){ huixianJH(huixanzhi)},200);
         },
         // 调用出错执行的函数
         error: function(){
             alert("操作异常");
         } 
     });
}

function goToPageSP(){
	var pagevalue=$("#gopagesp").val();
	 var pagesize=vm.pageObjectsp.totalPage;
	if(!validIsNum(pagevalue)||pagevalue==''){
		alert("请输入合法页数!");
		return false;
	}else if(pagevalue>pagesize||pagevalue==0){
		alert("请输入合法页数!");
		document.getElementById('gopagesp').value='';
		document.getElementById('gopagesp').focus();
		return false;
	}
	 document.getElementById('pageNumbersp').value=pagevalue;
     jQuery.ajax({
         url: vm.path+"/tWlmDecorate/queryPolicysp.do" ,// url
         type: "POST",// 方法类型
         data: $('#queryadid').serialize(),
         dataType:'html',
         dataType:'json',
         success:function(data){
             if(data.flag==true){
                 vm.goodsList=data.goodsList;
                 vm.limitsp=data.limit;
                 vm.pageObjectsp=data.pageObject;
                 vm.pageNumbersp=data.pageNumber;
             }
             setTimeout(function(){ huixianJH(huixanzhi)},200);
         },
         // 调用出错执行的函数
         error: function(){
             alert("操作异常");
         } 
     });
}
function goToPageJh(){
	 $("#id1").val(vm.id);
	var urls=vm.path+"/tWlmDecorate/queryPolicyJh.do";
	  var floorType=$("#floorType").val();
    if (floorType && floorType == 'newbottom') {
  	  urls=vm.path+"/tWlmDecorate/queryPolicyPage.do";
    }
	var pagevalue=$("#gopageJh").val();
	 var pagesize=vm.pageObject.totalPage;
	if(!validIsNum(pagevalue)||pagevalue==''){
		alert("请输入合法页数!");
		return false;
	}else if(pagevalue>pagesize||pagevalue==0){
		alert("请输入合法页数!");
		document.getElementById('gopage').value='';
		document.getElementById('gopage').focus();
		return false;
	}
	  document.getElementById('pageNumber1').value=pagevalue;
	  jQuery.ajax({
          url: urls ,// url
             type: "POST",// 方法类型
             data: $('#queryJH').serialize(),
             dataType:'json',
             success:function(data){
                 if(data.flag==true){
                	  vm.limit1=data.limit1;
                      vm.pageObject1=data.pageObject1;
                      vm.aggname=data.name;
                      vm.issuetime=data.issuetime;
                      vm.pagetype=data.pagetype;
                      vm.sysname=data.sysname;
                      vm.aggregationList2=data.aggrelist;
                     vm.rowinit1=data.rowinit;
                 }
                 setTimeout(function(){ huixianJH(huixanzhi)},200);
             },
         // 调用出错执行的函数
         error: function(){
             alert("操作异常");
         } 
     });
}

function goToPageIop(){
    var pagevalue=$("#gopageIop").val();
    var pagesize=vm.pageObjectIop.totalPage;
    if(!validIsNum(pagevalue)||pagevalue==''){
        alert("请输入合法页数!");
        return false;
    }else if(pagevalue>pagesize||pagevalue==0){
        alert("请输入合法页数!");
        document.getElementById('gopagIop').value='';
        document.getElementById('gopageIop').focus();
        return false;
    }
    document.getElementById('pageNumberIop').value=pagevalue;
    jQuery.ajax({
        url: vm.path+"/tWlmDecorateIop/queryGroupIop.do?v="+(new Date()).getTime(),// url
        type: "POST",// 方法类型
        data: $('#queryadid').serialize(),
        dataType:'html',
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.list=data.list;
                vm.limitIop=data.limit;
                vm.pageObjectIop=data.pageObject;
                vm.pageNumberIop=data.pageNumber;
                vm.rowinitIop= data.rowinitIop;
            }
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        }
    });
}

function querySumPrizeJhTiao(){
	 $("#id1").val(vm.id);
	var urls=vm.path+"/tWlmDecorate/queryPolicyJh.do";
	  var floorType=$("#floorType").val();
    if (floorType && floorType == 'newbottom') {
  	  urls=vm.path+"/tWlmDecorate/queryPolicyPage.do";
    }
	var options=$("#paginationRowDisplayed_crdjh option:selected").val();
	$("#rowinit1").val(options);
	  jQuery.ajax({
          url: urls ,// url
             type: "POST",// 方法类型
             data: $('#queryJH').serialize(),
             dataType:'json',
             success:function(data){
                 if(data.flag==true){
                	  vm.limit1=data.limit1;
                      vm.pageObject1=data.pageObject1;
                      vm.aggname=data.name;
                      vm.issuetime=data.issuetime;
                      vm.pagetype=data.pagetype;
                      vm.sysname=data.sysname;
                      vm.aggregationList2=data.aggrelist;
                     vm.rowinit1=data.rowinit;
                 }
                 setTimeout(function(){ huixianJH(huixanzhi)},200);
             },
         // 调用出错执行的函数
         error: function(){
             alert("操作异常");
         } 
     });
}
function querySumPrizeAdTiao(){
	var options=$("#paginationRowDisplayed_crdad option:selected").val();
	$("#rowinit").val(options);
	  jQuery.ajax({
          url: vm.path+"/tWlmDecorate/queryPolicyAd.do" ,// url
             type: "POST",// 方法类型
             data: $('#queryIop').serialize(),
             dataType:'json',
             success:function(data){
                 if(data.flag==true){
                	   vm.adList=data.adList;
                       vm.limit=data.limit;
                       vm.pageObjectIop=data.pageObject;
                       vm.rowsPerPageIop=data. pageObject.rowsPerPage;
                       vm.pageNumberIop=data.pageNumber;
                 }
                 setTimeout(function(){ huixianJH(huixanzhi)},200);
             },
         // 调用出错执行的函数
         error: function(){
             alert("操作异常");
         } 
     });
}


function querySumPrizeVideoTiao(){
	var options=$("#RowDisplayed_crd_video option:selected").val();
	$("#rowinit4").val(options);
	$("#pageNumberVideo").val('1');
	  jQuery.ajax({
          url: vm.path+"/tWlmDecorate/queryVideo.do" ,// url
             type: "POST",// 方法类型
             data: $('#queryVideo1').serialize(),
             dataType:'json',
             success:function(data){
                 if(data.flag==true){
                	   vm.videoList=data.videoList;
                       vm.limit4=data.limit;
                       vm.pageObject4=data.pageObject;
                       vm.rowsPerPage4=data. pageObject.rowsPerPage;
                       vm.rowinit4=data.rowinit;
                       vm.pageNumberVideo=data.pageNumber;
                 }
                 setTimeout(function(){ huixianJH(huixanzhi)},200);
             },
         // 调用出错执行的函数
         error: function(){
             alert("操作异常");
         } 
     });
}

function querySumPrizeIopTiao(){
    var options=$("#paginationRowDisplayed_crdIop option:selected").val();
    $("#rowinitIop").val(options);
    jQuery.ajax({
        url: vm.path+"/tWlmDecorateIop/queryGroupIop.do?v="+(new Date()).getTime(),// url
        type: "POST",// 方法类型
        data: $('#queryadid1').serialize(),
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.list=data.list;
                vm.limit=data.limit;
                vm.pageObjectIop=data.pageObject;
                vm.rowsPerPageIop=data. pageObject.rowsPerPage;
                vm.pageNumberIop=data.pageNumber;
                vm.rowinitIop=data.rowinitIop;
            }
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        }
    });
}

function jixuaddpp(index){
	if(index=="0"){
        if($("input[name='tjiop']:checked").val() =='1'){
            var coun=$("#htmlConCspzpp .cont_box table tbody").children("tr").length-1;
            var a = $("#htmlConCspzppCanClone .cont_box").find("table thead tr:nth-child(2)").clone();
            var ntable = $("#htmlConCspzpp .cont_box table tbody").append(a);
            cloneSavepp++;
            var ntrer = ntable.children("tr");
            $.each(ntrer,function(i,eleName){// 遍历tr
                var j=i+1;
                $(eleName).children("td:nth-child(2)").text(j);
                if(i>coun){
                    $(eleName).attr("style","");
                    $(eleName).attr("id","policypp"+i);
                    $(eleName).children("td:nth-child(3)").find("#iconListpp-1").attr("id","iconListpp"+i);
                    $(eleName).children("td:nth-child(3)").find("#iconListpp-1imageName").attr("id","iconListpp"+i+"imageName");
                    $(eleName).children("td:nth-child(3)").find(".iconListpp-1imagesZw").attr("class","iconListpp"+i+"imagesZw");
                    $(eleName).children("td:nth-child(3)").find(".iconListpp-1imgPerview").attr("class","iconListpp"+i+"imgPerview");
                    $(eleName).children("td:nth-child(3)").find("#iconListpp-1opacityP").attr("id","iconListpp"+i+"opacityP");
                    var popUpButtoniop1=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtoniop-1]")[0];
                    var popUpButtoniop2=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtoniop-1]")[1];
                    $(popUpButtoniop1).attr("name","popUpButtoniop"+i);
                    $(popUpButtoniop2).attr("name","popUpButtoniop"+i);
                    $(eleName).children("td:nth-child(3)").find("#jhsp-1").attr("id","jhsp"+i);
                    $(eleName).children("td:nth-child(4)").children("a").attr("onclick","savePolicyFunpp("+i+")");
                }
            });
        }else{
            var coun=$("#htmlConCspzpp .cont_box table tbody").children("tr").length-1;
            var a = $("#htmlConCspzppCanCloneIop .cont_box").find("table").find("#policyIop-1").clone();
            console.log($("#htmlConCspzpp .cont_box table tbody"),a);
            var ntable = $("#htmlConCspzpp .cont_box table tbody").append(a);
            cloneSavepp++;
            var ntrer = ntable.children("tr");
            $.each(ntrer,function(i,eleName){// 遍历tr
                var j=i+1;
                $(eleName).children("td:nth-child(2)").text(j);
                if(i>coun){
                    $(eleName).attr("style","");
                    $(eleName).attr("id","policyIop"+i);
                    $(eleName).children("td:nth-child(3)").find("#iconListpp-1").attr("id","iconListpp"+i);

                    var popUpButtoniop1=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtoniop-2]")[0];
                    var popUpButtoniop2=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtoniop-2]")[1];
                    $(popUpButtoniop1).attr("name","popUpButtoniop"+i);
                    $(popUpButtoniop2).attr("name","popUpButtoniop"+i);
                    $(eleName).children("td:nth-child(3)").find("#jhIop-1").attr("id","jhIop"+i);
                    $(eleName).children("td:nth-child(3)").find("#planId-1").attr("id","planId"+i);
                    $(eleName).children("td:nth-child(3)").find("#iopPath-1").attr("id","iopPath"+i);
                    $(eleName).children("td:nth-child(3)").find("#jumpAddressIop-1").attr("id","jumpAddressIop"+i);
                    $(eleName).children("td:nth-child(3)").find("#startTimepp-iop").attr("id","startTimepp"+i);
                    $(eleName).children("td:nth-child(3)").find("#endTimepp-iop").attr("id","endTimepp"+i);
                    $(eleName).children("td:nth-child(5)").children("a").attr("onclick","savePolicyFunpp("+i+")");
                }
            });
        }

	}
	if(index=="1"){
		  var a = $("#htmlConCspz2ppCanClone .cont_box").find("table thead tr:nth-child(2)").clone();
          var coun=$("#htmlConCspz2pp .cont_box table tbody").children("tr").length-1; 
          var ntable = $("#htmlConCspz2pp .cont_box table tbody").append(a);
          cloneSaveBuWeipp++;
          var ntr = ntable.children("tr");
          $.each(ntr,function(i,eleName){// 遍历tr
              i;
              var j=i+1;
              $(eleName).children("td:nth-child(2)").text(j);
              if(i>coun){
                  $(eleName).attr("style","");
                  $(this).attr("id","policybuweipp"+i);
                  $(eleName).children("td:nth-child(3)").find("#jhsp-1").attr("id","jhsp"+i);
                  $(eleName).children("td:nth-child(3)").find("#buweiiconListpp-1").attr("id","buweiiconListpp"+i);
                  $(eleName).children("td:nth-child(3)").find("#buweiiconListpp-1imageName").attr("id","buweiiconListpp"+i+"imageName");
                  $(eleName).children("td:nth-child(3)").find(".buweiiconListpp-1imagesZw").attr("class","buweiiconListpp"+i+"imagesZw");
                  $(eleName).children("td:nth-child(3)").find(".buweiiconListpp-1imgPerview").attr("class","buweiiconListpp"+i+"imgPerview");
                  $(eleName).children("td:nth-child(3)").find("#buweiiconListpp-1opacityP").attr("id","buweiiconListpp"+i+"opacityP");
                  var popUpButtoniop1=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtoniopbuwei-1]")[0];
                  var popUpButtoniop2=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtoniopbuwei-1]")[1];
                  $(popUpButtoniop1).attr("name","popUpButtoniopbuwei"+i);
                  $(popUpButtoniop2).attr("name","popUpButtoniopbuwei"+i);
                  $(eleName).children("td:nth-child(4)").children("a").attr("onclick","savePolicyFunbuweipp("+i+")");
              }               
          });
	}
}
function jixuaddlp(index){
	if(index=="0"){
		 var coun=$("#htmlConCspz .cont_box table tbody").children("tr").length-1;
		   var a = $("#htmlConCspzCanClone .cont_box").find("table thead tr:nth-child(2)").clone();
           var ntable = $("#htmlConCspz .cont_box table tbody").append(a);
           cloneSave++;
           var ntrer = ntable.children("tr");
           $.each(ntrer,function(i,eleName){// 遍历tr
               i;
               var j=i+1;
               $(eleName).children("td:nth-child(2)").text(j);
               if(i>coun){
                   $(eleName).attr("style","");
                   $(eleName).attr("id","policy"+i);
                   $(eleName).children("td:nth-child(3)").find("#iconList-1").attr("id","iconList"+i);
                   var s=$(eleName).children("td:nth-child(3)").find("input[name=isShowButtoniop-1]")[0];
                   var ss=$(eleName).children("td:nth-child(3)").find("input[name=isShowButtoniop-1]")[1];
                   $(s).attr("name","isShowButtoniop"+i);
                   $(ss).attr("name","isShowButtoniop"+i);
                   var nexbutton1=$(eleName).children("td:nth-child(3)").find("input[name=NextButtoniop-1]")[0];
                   var nexbutton2=$(eleName).children("td:nth-child(3)").find("input[name=NextButtoniop-1]")[1];
                   $(nexbutton1).attr("name","NextButtoniop"+i);
                   $(nexbutton2).attr("name","NextButtoniop"+i);
                   
                   var popUpButtoniop1=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtonLbiop-1]")[0];
                   var popUpButtoniop2=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtonLbiop-1]")[1];
                   $(popUpButtoniop1).attr("name","popUpButtonLbiop"+i);
                   $(popUpButtoniop2).attr("name","popUpButtonLbiop"+i);
                   /* 2020 03 23 */
                   //按钮位置
                   var anwz1 = $(eleName).children("td:nth-child(3)").find("input[name=anwz-1]")[0];
                   var anwz2 = $(eleName).children("td:nth-child(3)").find("input[name=anwz-1]")[1];
                   $(anwz1).attr("name","anwz"+i);
                   $(anwz2).attr("name","anwz"+i);
                   //底部展示
                   var dbzs1 = $(eleName).children("td:nth-child(3)").find("input[name=dbzs-1]")[0];
                   var dbzs2 = $(eleName).children("td:nth-child(3)").find("input[name=dbzs-1]")[1];
                   $(dbzs1).attr("name","dbzs"+i);
                   $(dbzs2).attr("name","dbzs"+i);
                   /* 2020 03 23 */
                   // $(eleName).children("td:nth-child(3)").find("input[name=NextButtoniop0]")[1].attr("name","NextButton"+i);
                   $(eleName).children("td:nth-child(3)").find("#ConfigType").attr("onchange","changeTiaoZhuan("+i+")");
                   $(eleName).children("td:nth-child(3)").find("#iconList-1imageName").attr("id","iconList"+i+"imageName");
                   $(eleName).children("td:nth-child(3)").find(".iconList-1imagesZw").attr("class","iconList"+i+"imagesZw");
                   $(eleName).children("td:nth-child(3)").find(".iconList-1imgPerview").attr("class","iconList"+i+"imgPerview");
                   $(eleName).children("td:nth-child(3)").find("#iconList-1opacityP").attr("id","iconList"+i+"opacityP");
                   $(eleName).children("td:nth-child(3)").find("#iconListfl-1").attr("onclick","assignment('iconList"+i+"');showid('ts_ljzs')");
                   $(eleName).children("td:nth-child(3)").find("#jhsp-1").attr("id","jhsp"+i);
                   $(eleName).children("td:nth-child(3)").find("#introductioniconList-1").attr("id","introductioniconList"+i);
                   $(eleName).children("td:nth-child(3)").find("#introductioniconList"+i).attr("onchange","uploadPolicyImageForMultiple(this,0,0,2)");
                   $(eleName).children("td:nth-child(3)").find("#introductioniconList"+i).attr("multiple","multiple");
                   
                   $(eleName).children("td:nth-child(3)").find("#introductioniconList-1imageName").attr("id","introductioniconList"+i+"imageName");
                   $(eleName).children("td:nth-child(3)").find(".introductioniconList-1imagesZw").attr("class","introductioniconList"+i+"imagesZw");
                   $(eleName).children("td:nth-child(3)").find(".introductioniconList-1imgPerview").attr("class","introductioniconList"+i+"imgPerview");
                   $(eleName).children("td:nth-child(3)").find("#introductioniconList-1opacityP").attr("id","introductioniconList"+i+"opacityP");
                   
                   $(eleName).children("td:nth-child(3)").find("#introductioniconList"+i+"opacityP").attr("onclick","deleteImgRemove('introductioniconList'"+i+",'0')")
                   $(eleName).children("td:nth-child(3)").find("#introductfl-1").attr("onclick","assignment('introductioniconList"+i+"');showid('ts_ljzs')");
                   $(eleName).children("td:nth-child(3)").find("#NextList-1").attr("id","NextList"+i);
                   $(eleName).children("td:nth-child(3)").find("#NextList-1imageName").attr("id","NextList"+i+"imageName");
                   $(eleName).children("td:nth-child(3)").find(".NextList-1imagesZw").attr("class","NextList"+i+"imagesZw");
                   $(eleName).children("td:nth-child(3)").find(".NextList-1imgPerview").attr("class","NextList"+i+"imgPerview");
                   $(eleName).children("td:nth-child(3)").find("#NextList-1opacityP").attr("id","NextList"+i+"opacityP");
                   $(eleName).children("td:nth-child(3)").find("#NextListfl-1").attr("onclick","assignment('NextList"+i+"');showid('ts_ljzs')");
                   $(eleName).children("td:nth-child(3)").find("#SecondaryList-1").attr("id","SecondaryList"+i);
                   $(eleName).children("td:nth-child(3)").find("#SecondaryList-1imageName").attr("id","SecondaryList"+i+"imageName");
                   $(eleName).children("td:nth-child(3)").find(".SecondaryList-1imagesZw").attr("class","SecondaryList"+i+"imagesZw");
                   $(eleName).children("td:nth-child(3)").find(".SecondaryList-1imgPerview").attr("class","SecondaryList"+i+"imgPerview");
                   $(eleName).children("td:nth-child(3)").find("#SecondaryList-1opacityP").attr("id","SecondaryList"+i+"opacityP");
                   $(eleName).children("td:nth-child(3)").find("#SecondaryListfl-1").attr("onclick","assignment('SecondaryList"+i+"');showid('ts_ljzs')");
                   $(eleName).children("td:nth-child(3)").find("#handleList-1").attr("id","handleList"+i);
                   $(eleName).children("td:nth-child(3)").find("#handleList-1imageName").attr("id","handleList"+i+"imageName");
                   $(eleName).children("td:nth-child(3)").find(".handleList-1imagesZw").attr("class","handleList"+i+"imagesZw");
                   $(eleName).children("td:nth-child(3)").find(".handleList-1imgPerview").attr("class","handleList"+i+"imgPerview");
                   $(eleName).children("td:nth-child(3)").find("#handleList-1opacityP").attr("id","handleList"+i+"opacityP");
                   $(eleName).children("td:nth-child(3)").find("#handleListfl-1").attr("onclick","assignment('handleList"+i+"');showid('ts_ljzs')");
                   $(eleName).children("td:nth-child(4)").children("a").attr("onclick","savePolicyFun("+i+")");
               }
           });
	}
	if(index=="1"){
        var coun=$("#htmlConCspz2 .cont_box table tbody").children("tr").length-1;
        var a = $("#htmlConCspz2CanClone .cont_box").find("table thead tr:nth-child(2)").clone();
        var ntable = $("#htmlConCspz2 .cont_box table tbody").append(a);
        cloneSaveBuWei++;
        var ntr = ntable.children("tr");
        $.each(ntr,function(i,eleName){// 遍历tr
            i;
            var j=i+1;
            $(eleName).children("td:nth-child(2)").text(j);
            if(i>coun){
                  $(eleName).attr("style","");
                var s=$(eleName).children("td:nth-child(3)").find("input[name=isShowButtonbuwei-1]")[0];
                var ss=$(eleName).children("td:nth-child(3)").find("input[name=isShowButtonbuwei-1]")[1];
                $(s).attr("name","isShowButtonbuwei"+i);
                $(ss).attr("name","isShowButtonbuwei"+i);
                var nexbutton1=$(eleName).children("td:nth-child(3)").find("input[name=NextButtonbuwei-1]")[0];
                var nexbutton2=$(eleName).children("td:nth-child(3)").find("input[name=NextButtonbuwei-1]")[1];
                $(nexbutton1).attr("name","NextButtonbuwei"+i);
                $(nexbutton2).attr("name","NextButtonbuwei"+i);

                var popUpButtoniop1=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtonLbiopbuwei-1]")[0];
                var popUpButtoniop2=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtonLbiopbuwei-1]")[1];
                $(popUpButtoniop1).attr("name","popUpButtonLbiopbuwei"+i);
                $(popUpButtoniop2).attr("name","popUpButtonLbiopbuwei"+i);
                /* 2020 03 23 */
                //按钮位置
                var anwz1 = $(eleName).children("td:nth-child(3)").find("input[name=anwz-1]")[0];
                var anwz2 = $(eleName).children("td:nth-child(3)").find("input[name=anwz-1]")[1];
                $(anwz1).attr("name","anwz"+i);
                $(anwz2).attr("name","anwz"+i);
                //底部展示
                var dbzs1 = $(eleName).children("td:nth-child(3)").find("input[name=dbzs-1]")[0];
                var dbzs2 = $(eleName).children("td:nth-child(3)").find("input[name=dbzs-1]")[1];
                $(dbzs1).attr("name","dbzs"+i);
                $(dbzs2).attr("name","dbzs"+i);
                /* 2020 03 23 */
                // $(eleName).children("td:nth-child(3)").find("input[name=NextButtoniop0]")[1].attr("name","NextButton"+i);
                $(eleName).children("td:nth-child(3)").find("#ConfigType").attr("onchange","changeTiaoZhuan("+i+")");
                $(eleName).children("td:nth-child(3)").find("#iconList-1imageName").attr("id","iconList"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".iconList-1imagesZw").attr("class","iconList"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".iconList-1imgPerview").attr("class","iconList"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#iconList-1opacityP").attr("id","iconList"+i+"opacityP");
                $(eleName).children("td:nth-child(3)").find("#iconListfl-1").attr("onclick","assignment('iconList"+i+"');showid('ts_ljzs')");
                $(eleName).children("td:nth-child(3)").find("#jhsp-1").attr("id","jhsp"+i);
                $(eleName).children("td:nth-child(3)").find("#introductioniconList-1").attr("id","introductioniconList"+i);
                $(eleName).children("td:nth-child(3)").find("#introductioniconList"+i).attr("onchange","uploadPolicyImageForMultiple(this,0,0,2)");
                $(eleName).children("td:nth-child(3)").find("#introductioniconList"+i).attr("multiple","multiple");

                $(eleName).children("td:nth-child(3)").find("#introductioniconList-1imageName").attr("id","introductioniconList"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".introductioniconList-1imagesZw").attr("class","introductioniconList"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".introductioniconList-1imgPerview").attr("class","introductioniconList"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#introductioniconList-1opacityP").attr("id","introductioniconList"+i+"opacityP");

                $(eleName).children("td:nth-child(3)").find("#introductioniconList"+i+"opacityP").attr("onclick","deleteImgRemove('introductioniconList'"+i+",'0')")
                $(eleName).children("td:nth-child(3)").find("#introductfl-1").attr("onclick","assignment('introductioniconList"+i+"');showid('ts_ljzs')");
                $(eleName).children("td:nth-child(3)").find("#NextList-1").attr("id","NextList"+i);
                $(eleName).children("td:nth-child(3)").find("#NextList-1imageName").attr("id","NextList"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".NextList-1imagesZw").attr("class","NextList"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".NextList-1imgPerview").attr("class","NextList"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#NextList-1opacityP").attr("id","NextList"+i+"opacityP");
                $(eleName).children("td:nth-child(3)").find("#NextListfl-1").attr("onclick","assignment('NextList"+i+"');showid('ts_ljzs')");
                $(eleName).children("td:nth-child(3)").find("#SecondaryList-1").attr("id","SecondaryList"+i);
                $(eleName).children("td:nth-child(3)").find("#SecondaryList-1imageName").attr("id","SecondaryList"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".SecondaryList-1imagesZw").attr("class","SecondaryList"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".SecondaryList-1imgPerview").attr("class","SecondaryList"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#SecondaryList-1opacityP").attr("id","SecondaryList"+i+"opacityP");
                $(eleName).children("td:nth-child(3)").find("#SecondaryListfl-1").attr("onclick","assignment('SecondaryList"+i+"');showid('ts_ljzs')");
                $(eleName).children("td:nth-child(3)").find("#handleList-1").attr("id","handleList"+i);
                $(eleName).children("td:nth-child(3)").find("#handleList-1imageName").attr("id","handleList"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".handleList-1imagesZw").attr("class","handleList"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".handleList-1imgPerview").attr("class","handleList"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#handleList-1opacityP").attr("id","handleList"+i+"opacityP");
                $(eleName).children("td:nth-child(3)").find("#handleListfl-1").attr("onclick","assignment('handleList"+i+"');showid('ts_ljzs')");
                $(eleName).children("td:nth-child(4)").children("a").attr("onclick","savePolicyFun("+i+")");
            }
        });
    }
	//集团IOP
    if(index=="2"){
        var coun=$("#htmlConCspz2 .cont_box table tbody").children("tr").length-1;
        var a = $("#htmlConCspzppCanCloneIop .cont_box").find("table thead tr:nth-child(2)").clone();
        var ntable = $("#htmlConCspz2 .cont_box table tbody").append(a);
        cloneSaveBuWei++;
        var ntr = ntable.children("tr");
        $.each(ntr,function(i,eleName){// 遍历tr
            i;
            var j=i+1;
            $(eleName).children("td:nth-child(2)").text(j);
            if(i>coun){

                var popUpButtoniop1=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtonLbiopbuwei-2]")[0];
                var popUpButtoniop2=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtonLbiopbuwei-2]")[1];
                $(popUpButtoniop1).attr("name","popUpButtonLbiopbuwei"+i);
                $(popUpButtoniop2).attr("name","popUpButtonLbiopbuwei"+i);


                /* 2020 03 23 */
                $(this).attr("id","policybuwei"+i);
                $(eleName).children("td:nth-child(3)").find("#jhsp-1").attr("id","jhsp"+i);
                $(eleName).children("td:nth-child(3)").find("#ConfigType").attr("onchange","changeTiaoZhuan("+i+")");
                $(eleName).children("td:nth-child(3)").find("#buweiiconList-1").attr("id","buweiiconList"+i);
                $(eleName).children("td:nth-child(3)").find("#buweiiconList-1imageName").attr("id","buweiiconList"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".buweiiconList-1imagesZw").attr("class","buweiiconList"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".buweiiconList-1imgPerview").attr("class","buweiiconList"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#buweiiconList-1opacityP").attr("id","buweiiconList"+i+"opacityP");
                $(eleName).children("td:nth-child(3)").find("#buweiiconListfl-1").attr("onclick","assignment('buweiiconList"+i+"');showid('ts_ljzs')");
                $(eleName).children("td:nth-child(3)").find("#buweiintroductionList-1").attr("id","buweiintroductionList"+i);
                $(eleName).children("td:nth-child(3)").find("#buweiintroductionList"+i).attr("onchange","uploadPolicyImageForMultiple(this,0,0,2)");
                $(eleName).children("td:nth-child(3)").find("#buweiintroductionList"+i).attr("multiple","multiple");

                $(eleName).children("td:nth-child(3)").find("#buweiintroductionList-1imageName").attr("id","buweiintroductionList"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".buweiintroductionList-1imagesZw").attr("class","buweiintroductionList"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".buweiintroductionList-1imgPerview").attr("class","buweiintroductionList"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#buweiintroductionList-1opacityP").attr("id","buweiintroductionList"+i+"opacityP");
                $(eleName).children("td:nth-child(3)").find("#buweiintroductionList"+i+"opacityP").attr("onclick","deleteImgRemove('buweiintroductionList'"+i+",'0')")


                $(eleName).children("td:nth-child(3)").find("#buweiintroductionListfl-1").attr("onclick","assignment('buweiintroductionList"+i+"');showid('ts_ljzs')");
                $(eleName).children("td:nth-child(3)").find("#buweiNextList-1").attr("id","buweiNextList"+i);
                $(eleName).children("td:nth-child(3)").find("#buweiNextList-1imageName").attr("id","buweiNextList"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".buweiNextList-1imagesZw").attr("class","buweiNextList"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".buweiNextList-1imgPerview").attr("class","buweiNextList"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#buweiNextList-1opacityP").attr("id","buweiNextList"+i+"opacityP");
                $(eleName).children("td:nth-child(3)").find("#buweiNextListfl-1").attr("onclick","assignment('buweiNextList"+i+"');showid('ts_ljzs')");
                $(eleName).children("td:nth-child(3)").find("#buweiSecondaryList-1").attr("id","buweiSecondaryList"+i);
                $(eleName).children("td:nth-child(3)").find("#buweiSecondaryList-1imageName").attr("id","buweiSecondaryList"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".buweiSecondaryList-1imagesZw").attr("class","buweiSecondaryList"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".buweiSecondaryList-1imgPerview").attr("class","buweiSecondaryList"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#buweiSecondaryList-1opacityP").attr("id","buweiSecondaryList"+i+"opacityP");
                $(eleName).children("td:nth-child(3)").find("#buweiSecondaryListfl-1").attr("onclick","assignment('buweiSecondaryList"+i+"');showid('ts_ljzs')");
                $(eleName).children("td:nth-child(3)").find("#buweihandleList-1").attr("id","buweihandleList"+i);
                $(eleName).children("td:nth-child(3)").find("#buweihandleList-1imageName").attr("id","buweihandleList"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".buweihandleList-1imagesZw").attr("class","buweihandleList"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".buweihandleList-1imgPerview").attr("class","buweihandleList"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#buweihandleList-1opacityP").attr("id","buweihandleList"+i+"opacityP");
                $(eleName).children("td:nth-child(3)").find("#buweihandleListfl-1").attr("onclick","assignment('buweihandleList"+i+"');showid('ts_ljzs')");
                $(eleName).children("td:nth-child(4)").children("a").attr("onclick","savePolicyFunbuwei("+i+")");
            }
        });
    }
}

function deleteImg(id){
	$("."+id+"imgPerview").attr('src','');
    $("."+id+"imgInput").val('');
    $("."+id+"imgPerview").css("display","none");
    $("."+id+"imagesZw").css("display","block");
    $("#"+id+"imageName").val("");
    $("#"+id+"opacityP").text('上传图片');
}

function saveBathchpp(index){//index iop推荐或补位
	 var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
	 var policyType=$("#policyType").val();
	 var floorType=$("#floorType").val();
	 var roomid=$("#decorater_roomid").val();
	 var roomType=$("#roomType").val();
    var msgNumMap = new Map();
    var msgPlanMap = new Map();
    var msglineMap = new Map();
	 if(index=="0"){
         var tsMsg = "策划ID或者广告编码出现重复现象，具体行数为lineNums，请检查后重新填写！";//编码重复提示语
         var lineNum = "";//重复行
         msgNumMap = new Map();
         msgPlanMap = new Map();
         msglineMap = new Map();
		 var flag=true;
		 $("#policyTypepp").val(policyType);
		 $("#floorTypepp").val(floorType);
		 $("#decorater_roomidpp").val(roomid);
		 $("#decorateIdpp").val(vm.id);
		 var ntable = $("#htmlConCspzpp .cont_box table tbody");
		 var ntrer = ntable.children("tr");
	        var  isHide=$('input[name=isHidepp]:checked').val();
		 $.each(ntrer,function(i,eleName){// 遍历tr
		 	 var goodcodeinputsign= $(eleName).find(".policyGgwbm").val();
			 var planId= $(eleName).find("#planId").val();
			 var imageName= $(eleName).find("input[name=iconListppimageName]").val();
			 var displayWeights= $(eleName).find("#displayWeights").val();
			 var startTimepp= $(eleName).find("#startTimepp").val();
			 var endTimepp= $(eleName).find("#endTimepp").val();
             var j=i+1;
             //集团IOP
			 var jumpAddress="";
			 var popUpButtoniop="";
             if ($("input[name='tjiop']:checked").val() === '2') {
                 //集团IOP推荐类型为2
                 $("#policyTypepp").val('2');
                 console.log(eleName.id);
                 var b = eleName.id;
                 var a = b.substr(b.length-1,b.length);
                 policyType = "2";
                 planId = $(eleName).find("#planId" + a).val();
                 goodcodeinputsign = $(eleName).find(".policyGgwbm").val();//插码
                 startTimepp = $(eleName).find("#startTimepp" + a).val();
                 endTimepp = $(eleName).find("#endTimepp" + a).val();
                 jumpAddress = $(eleName).find("#jumpAddressIop" + a).val();
                 imageName = $(eleName).find("#iopPathImg").val();
                 displayWeights = $(eleName).find("#displayWeightsIop").val();
                 popUpButtoniop = $(eleName).find("input[name=popUpButtoniop" + a + "]:checked").val();

             }
             msgNumMap.set(j,goodcodeinputsign);
             msgPlanMap.set(j,planId);
			 if(!goodcodeinputsign){
         	 	alert("请输入第"+j+"行广告编码！");
				flag=false ;
         	 }
			 if(displayWeights==""||displayWeights==undefined||displayWeights==null){
	                alert("请输入第"+j+"行权重！");
	                flag=false;
	            }else{
	                var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
	                if(!reg.test(displayWeights)) {
	                    alert("第"+j+"行权重请输入0-100的整数！");
	                    flag=false;
	                }
	            }
	            if(startTimepp==""||startTimepp==undefined||startTimepp==null){
	                alert("请输入第"+j+"行有效期的初始时间！");
	                flag= false;
	            }
	            if(endTimepp==""||endTimepp==undefined||endTimepp==null){
	                alert("请输入第"+j+"行有效期的结束时间！");
	                flag= false;
	            }
	            if(imageName==""||imageName==undefined||imageName==null){
	                alert("请上传第"+j+"行图片！");
	                flag= false;
	            }
	            if(planId==""||planId==undefined||planId==null){
	                alert("请输入第"+j+"行策划id！");
	                flag= false;
	            }
	            if(!flag){
	           	 return ;
	            }
		 });
		 //策略跟广告编码重复判断
         msgNumMap.forEach(function (v,k) {
             var ckCount = 0;
             msgNumMap.forEach(function (innv,innk) {
                 if(innv==v){
                     ckCount ++;
                 }
             });
             if(ckCount>1){
                 msglineMap.set(k,k);
             }
         });
         msgPlanMap.forEach(function (v,k) {
             var ckCount = 0;
             msgPlanMap.forEach(function (innv,innk) {
                 if(innv==v){
                     ckCount ++;
                 }
             });
             if(ckCount>1){
                 msglineMap.set(k,k);
             }
         });
         if(msglineMap.size>0){
             msglineMap.forEach(function (v,k) {
                 lineNum+=v+",";
             });
             if(lineNum.length>0 && lineNum.indexOf(",")>-1){
                 lineNum = lineNum.substring(0,lineNum.length-1);
             }
             tsMsg = tsMsg.replace("lineNums",lineNum.toString());
             alert(tsMsg);
             flag=false;
         }

		 if(!roomType){//非房间类型
			 if(isHide==""||isHide==undefined||isHide==null){
				 alert("请选择是否隐藏楼层！");
				 flag= false;
			 }
		 }
		 if(!flag){
			 return ;
		 }
		 console.log( $('#pplc').serialize());
		 jQuery.ajax({
		        url: vm.path+"/tWlmDecorate/savepolicyBatchpp.do?v="+(new Date()).getTime(),// url
		        type: "POST",// 方法类型
		        data: $('#pplc').serialize(),
		        dataType:'json',
		        success:function(data){
		            if(data.flag==true){
		            	 toast("保存成功");// 改成小黑窗
		            	 var policy;
		                 var policyListbuwei;
		                 jQuery.ajax({
		                     url:vm.path + "/tWlmDecorate/querypolicyiop.do?id="+vm.id+"&roomId="+roomid,
		                     type: "POST",// 方法类型
		                     dataType:'json',
		                     async:false,
		                     success:function(data){
		                         if(data.flag==true){
		                         	vm.isHide=data.isHide;
		                             policy=data.policyList;
		                             policyListbuwei= data.policyListbuwei;
		                         }
		                     },
		                     // 调用出错执行的函数
		                     error: function(){
		                         alert("操作异常");
		                     } 
		                 });
		                 	var tianzhi="";
		                 	var ispop="";
		                 	if(policyType!="2"){
                                for(var int=0;int<policy.length;int++){
                                    var xuhao=int+1;
                                    var address=policy[int][5];
                                    var popUpButtoniop=policy[int][21];
                                    var policyGgwbm=policy[int][23];
                                    if(!policyGgwbm){
                                        policyGgwbm = "";
                                    }
                                    if(address==null||address==''||address==undefined){
                                        address="";
                                    }
                                    if(popUpButtoniop=="0"){
                                        ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
                                    }else{
                                        ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
                                    }
                                    tianzhi+="<tr class='clxqq' id='policypp"+int+"'>" +
                                        " <td><input type='checkbox' value="+policy[int][0]+" name='ioppp'></td> " +
                                        "<td id='xuhaoCount'>"+xuhao+"</td> <td>" +
                                        "<div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div>"+
                                        "<div> <dl> <dt>策划ID:</dt> <dd> <input type='hidden' name='policyId' id='policyId' value="+policy[int][0]+"> <input type='text' placeholder='请输入策划ID' name='planId' id='planId' value="+policy[int][3]+" οnkeyup='this.value=this.value.replace(/[^\d\,]/g,'')'> <span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span></dd></dl></div>"+
                                        "<div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='iconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='iconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='iconListpp"+int+"opacityP' onclick="+"deleteImg('iconListpp"+int+"')>删除图片</p><input type='hidden' name='iconListppimageName' id='iconListpp"+int+"imageName' value="+policy[int][4]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>"+
                                        "<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'  >选择广告/聚合页</span>	<input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;' value='" +policy[int][22]+ "'></dd>	</dl></div>"+
                                        "<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                                        "<div>	<dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>"+
                                        "<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTimepp' name='startTimepp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTimepp' name='endTimepp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div></td>"+
                                        "<td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunpp("+int+")'>保存</a></td></tr>"
                                }
                                var tianzhi2=tbody+tianzhi+"</tbody>";
                                $('#htmlConCspzpp table').html('').prepend(tianzhi2);
                            }else{
                                $('.cspzedit-layer .close1pp').trigger("click");
                            }

		            }
		        },
		        // 调用出错执行的函数
		       /* error: function(){
		            alert("操作异常");
		        } */
		    });
		 
	 }else{
         var tsMsg = "广告编码出现重复现象，具体行数为lineNums，请检查后重新填写！";
         var lineNum = "";//重复行
         msgNumMap = new Map();
         msglineMap = new Map();
		 var flag=true;
		 $("#policyTypepp2").val(policyType);
		 $("#floorTypepp2").val(floorType);
		 $("#decorater_roomidpp2").val(roomid);
		 $("#decorateIdpp2").val(vm.id);
         var ntable = $("#htmlConCspz2pp .cont_box table tbody");
         var ntr = ntable.children("tr");
         $.each(ntr,function(i,eleName){// 遍历tr
         	 var goodcodeinputsign= $(eleName).find(".policyGgwbm").val();
         	 if(!goodcodeinputsign){
         	 	alert("请输入第"+j+"行广告编码！");
				flag=false ;
         	 }
			 var imageName= $(eleName).find("input[name=buweiiconListppimageName]").val();
			 var displayWeights= $(eleName).find("#displayWeights").val();
			 var startTimepp= $(eleName).find("#startTime1pp").val();
			 var endTimepp= $(eleName).find("#endTime1pp").val();
			 var j=i+1;
			 if(displayWeights==""||displayWeights==undefined||displayWeights==null){
				 alert("请输入第"+j+"行权重！");
				 flag=false ;
			 }else{
				 var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
				 if(!reg.test(displayWeights)) {
					 alert("第"+j+"行权重值请输入0-100的整数！");
					 flag=false ;
				 }
			 }
             msgNumMap.set(j,goodcodeinputsign);
			 if(startTime==""||startTime==undefined||startTime==null){
				 alert("请输入第"+j+"行有效期的初始时间！");
				 flag=false ;
			 }
			 if(endTime==""||endTime==undefined||endTime==null){
				 alert("请输入第"+j+"行有效期的结束时间！");
				 flag=false ;
			 }
			 if(imageName==""||imageName==undefined||imageName==null){
				 alert("请上传第"+j+"行图片！");
				 flag=false ;
			 }
			  if(!flag){
		        	 return ;
		         }
         });
         //策略跟广告编码重复判断
         msgNumMap.forEach(function (v,k) {
             var ckCount = 0;
             msgNumMap.forEach(function (innv,innk) {
                 if(innv==v){
                     ckCount ++;
                 }
             });
             if(ckCount>1){
                 msglineMap.set(k,k);
             }
         });
         if(msglineMap.size>0){
             msglineMap.forEach(function (v,k) {
                 lineNum+=v+",";
             });
             if(lineNum.length>0 && lineNum.indexOf(",")>-1){
                 lineNum = lineNum.substring(0,lineNum.length-1);
             }
             tsMsg = tsMsg.replace("lineNums",lineNum.toString());
             alert(tsMsg);
             flag=false;
         }
         if(!flag){
        	 return ;
         }
		 jQuery.ajax({
		        url: vm.path+"/tWlmDecorate/savepolicyBatchppbuwei.do",// url
		        type: "POST",// 方法类型
		        data: $('#pplc2').serialize(),
		        dataType:'json',
		        success:function(data){
		            if(data.flag==true){
		            	 toast("保存成功");// 改成小黑窗
		                 var policyListbuwei;
		                 jQuery.ajax({
		                     url:vm.path + "/tWlmDecorate/querypolicyiop.do",
		                     type: "POST",// 方法类型
		                     dataType:'json',
		                     async:false,
		                     success:function(data){
		                         if(data.flag==true){
		                         	vm.isHide=data.isHide;
		                             policy=data.policyList;
		                             policyListbuwei= data.policyListbuwei;
		                         }
		                     },
		                     // 调用出错执行的函数
		                     error: function(){
		                         alert("操作异常");
		                     } 
		                 });
		                 	var tianzhi="";
		                 	var ispop="";
		                 	var policy=policyListbuwei;
		                 	for(var int=0;int<policy.length;int++){
		                 		var xuhao=int+1;
		                 		var address=policy[int][5];
		                 		var popUpButtoniop=policy[int][21];
		                 		var policyGgwbm=policy[int][23];
			            		if(!policyGgwbm){
			            			policyGgwbm = "";
			            		}
		                		if(address==null||address==''||address==undefined){
		                			address="";
		                		}
		                		if(popUpButtoniop=="0"){
		                			ispop="<input type='radio' name='popUpButtonLbiop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
		                		}else{
		                			ispop="<input type='radio' name='popUpButtonLbiop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiop"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
		                		}
		                 		tianzhi+="<tr class='clxqq'  id='policybuweipp"+int+"'><td><input type='checkbox' value="+policy[int][0]+" name='buweipp'></td>" +
		                 			
		                 				"<td>"+xuhao+"</td><td><div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div><div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiiconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='buweiiconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='buweiiconListpp"+int+"opacityP' onclick="+"deleteImg('buweiiconListpp"+int+"')>删除图片</p><input type='hidden' name='policyId' id='buweipolicyId' value="+policy[int][0]+"><input type='hidden' name='buweiiconListimageName' value="+policy[int][4]+" id='buweiiconListpp"+int+"imageName'><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
		                 				"<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'>选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'></dd></dl></div>" +
		                 				"<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
		                 				"<div><dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>" +
		                 				"<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTime1pp' name='startTime1pp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTime1pp' name='endTime1pp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div>	</td>" +
		                 				"<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuweipp("+int+")'>保存</a></td>							</tr>											"
		                 	}
		                 	var tianzhi2=tbody+tianzhi+"</tbody>";
		                 	 $('#htmlConCspz2pp table').html('').prepend(tianzhi2);
		            }else if (data.code='1'){
                        toast(decodeURIComponent(data.msg));
                    }
		        },
		        // 调用出错执行的函数
		        /*error: function(){
		            alert("操作异常");
		        } */
		    });
	 }
	 if(roomType){//房间类型
		 $("#"+roomid).find("a").attr('goodCodeInput',goodcodeinputsign);
		 $("#"+roomid).find("a").attr('goodcodeinputsign','goodcodeinputsign')
	 }
}
function huixianJH(val){
	var arr="";
	var arrAppDown = "";//app下载
	if(val==undefined){
		return ;
	}
	if(val.indexOf('?')>0){
		arr=val.split("?")[0];
        arrAppDown = "?"+val.split("?")[1];
	}else{
		arr=val;
	}
	var objAppDOwn=document.getElementsByName('yyxzy');
	for(var i=0; i<objAppDOwn.length; i++){//引用下载回显
        if(objAppDOwn[i].value==arrAppDown){
            objAppDOwn[i].checked=true;
        } else{
            objAppDOwn[i].checked=false;
        }
    }
	var obj=document.getElementsByName('jhr');
	 for(var i=0; i<obj.length; i++){ 
         if(obj[i].value==arr){
              obj[i].checked=true; 
         } else{
        	 obj[i].checked=false; 
         }
     }
	 var obj3=document.getElementsByName('jhrad');
	 for(var i=0; i<obj3.length; i++){ 
		 if(obj3[i].value==arr){
			 obj3[i].checked=true; 
		 } else{
			 obj3[i].checked=false; 
		 }
	 }
	 var array="";
	 if(val.indexOf('=')>0){
		 array= val.split('=')[1];
	 }else{
		  array=val;
	 }
	 var obj2=document.getElementsByName('jhrjhAd');
	 for(var i=0; i<obj2.length; i++){ 
         if(obj2[i].value==array){
              obj2[i].checked=true; 
         } else{
        	 obj2[i].checked=false; 
         }
     }

    var objAgree=document.getElementsByName('agreeId');
    for(var i=0; i<objAgree.length; i++){
        if(objAgree[i].value==array){
            objAgree[i].checked=true;
        } else{
            objAgree[i].checked=false;
        }
    }
}

function queryPolicyYy(){
    
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryPolicyAppInfo.do" ,// url
        type: "POST",// 方法类型
        data: {"appName":$("#yyname").val(),"id":vm.id},
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.appInfoList=data.appInfoList;
                vm.limit3=data.limit3;
                vm.pageObject3=data.pageObject3;
                vm.rowsPerPage=data. pageObject3.rowsPerPage;
            }
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}

function querySumPrizeyy(number){
    var num="";
    if(number=="+"){
        num=vm.pageObject3.currentPage+1;
    }else if(number=="-"){
         num=vm.pageObject3.currentPage-1;
    }else if(number=="1"){
        num="1";
    }else if(number=="0"){
        num=vm.pageObject3.totalPage;
    }
    document.getElementById('pageNumber3').value=num;
        jQuery.ajax({
             url: vm.path+"/tWlmDecorate/queryPolicyAppInfo.do" ,// url
                type: "POST",// 方法类型
                data: {"appName":$("#yyname").val(),"id":vm.id,"pageNumber3":num},
                dataType:'json',
                success:function(data){
                    if(data.flag==true){
                    	 vm.appInfoList=data.appInfoList;
                    	 vm.pageNumber3=data.pageNumber3;
                         vm.limit3=data.limit3;
                         vm.pageObject3=data.pageObject3;
                         vm.rowsPerPage=data. pageObject3.rowsPerPage;
                    }
                },
            // 调用出错执行的函数
            error: function(){
                alert("操作异常");
            } 
        });
 }

function goToPageApp(){
	var pagevalue=$("#gopageApp").val();
	 var pagesize=vm.pageObject3.totalPage;
	if(!validIsNum(pagevalue)||pagevalue==''){
		alert("请输入合法页数!");
		return false;
	}else if(pagevalue>pagesize||pagevalue==0){
		alert("请输入合法页数!");
		document.getElementById('gopageApp').value='';
		document.getElementById('gopageApp').focus();
		return false;
	}
	 document.getElementById('pageNumber3').value=pagevalue;
     jQuery.ajax({
         url: vm.path+"/tWlmDecorate/queryPolicyAppInfo.do" ,// url
         type: "POST",// 方法类型
         data: {"appName":$("#yyname").val(),"id":vm.id},
         dataType:'json',
         success:function(data){
             if(data.flag==true){
                 vm.appInfoList=data.appInfoList;
                 vm.limit3=data.limit3;
                 vm.pageObject3=data.pageObject3;
                 vm.rowsPerPage=data. pageObject.rowsPerPage;
                 vm.pageNumber3=data.pageNumber3;
             }
         },
         // 调用出错执行的函数
         error: function(){
             alert("操作异常");
         } 
     });
}
function querySumPrizeAppTiao(){
	var options=$("#paginationRowDisplayed_crdapp option:selected").val();
	$("#rowinit3").val(options);
	  jQuery.ajax({
          url: vm.path+"/tWlmDecorate/queryPolicyAppInfo.do" ,// url
             type: "POST",// 方法类型
             data: {"appName":$("#yyname").val(),"id":vm.id},
             dataType:'json',
             success:function(data){
                 if(data.flag==true){
                	  vm.limit3=data.limit3;
                      vm.pageObject3=data.pageObject3;
                      vm.appInfoList=data.appInfoList;
                     vm.rowinit3=data.rowinit;
                 }
             },
         // 调用出错执行的函数
         error: function(){
             alert("操作异常");
         } 
     });
}

//协议分页跳转
function querySumPrizeAgree(number) {
    var num="";
    if(number=="+"){
        num=vm.pageObjectAgree.currentPage+1;
    }else if(number=="-"){
        num=vm.pageObjectAgree.currentPage-1;
    }else if(number=="1"){
        num="1";
    }else if(number=="0"){
        num=vm.pageObjectAgree.totalPage;
    }
    document.getElementById('pageNumberAgree').value=num;
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryAgreement.do" ,// url
        type: "POST",// 方法类型
        data: $('#queryAgree').serialize(),
        dataType:'json',
        success:function(data){
            vm.agreeList=data.list;
            vm.limitAgree=data.limit;
            vm.pageObjectAgree=data.pageObject;
            vm.rowsPerPageAgree=data. pageObject.rowsPerPage;
            vm.pageNumberAgree=data.pageNumber;
            vm.rowinitAgree=data.rowinitAgree;
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        }
    });
}

function goToPageAgreement(){
    var pagevalue=$("#gopageAgreement").val();
    var pagesize=vm.pageObjectAgree.totalPage;
    if(!validIsNum(pagevalue)||pagevalue==''){
        alert("请输入合法页数!");
        return false;
    }else if(pagevalue>pagesize||pagevalue==0){
        alert("请输入合法页数!");
        document.getElementById('gopageAgreement').value='';
        document.getElementById('gopageAgreement').focus();
        return false;
    }
    document.getElementById('pageNumberAgree').value=pagevalue;
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryAgreement.do" ,// url
        type: "POST",// 方法类型
        data: {"agreeTitle":$("#agreeTitle").val()},
        dataType:'json',
        success:function(data){
            vm.agreeList=data.list;
            vm.limitAgree=data.limit;
            vm.pageObjectAgree=data.pageObject;
            vm.rowsPerPageAgree=data. pageObject.rowsPerPage;
            vm.pageNumberAgree=data.pageNumber;
            vm.rowinitAgree=data.rowinitAgree;
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        }
    });
}

function querySumPrizeAgreementTiao(){
    var options=$("#paginationRowDisplayed_crdagree option:selected").val();
    $("#rowinitAgree").val(options);
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryAgreement.do" ,// url
        type: "POST",// 方法类型
        data: $('#queryAgree').serialize(),
        dataType:'json',
        success:function(data){
            vm.agreeList=data.list;
            vm.limitAgree=data.limit;
            vm.pageObjectAgree=data.pageObject;
            vm.rowsPerPageAgree=data. pageObject.rowsPerPage;
            vm.pageNumberAgree=data.pageNumber;
            vm.rowinitAgree=data.rowinitAgree;
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        }
    });
}

function queryAgreement() {
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryAgreement.do" ,// url
        type: "POST",// 方法类型
        data: {"agreeTitle":$("#agreeTitle").val()},
        dataType:'json',
        success:function(data){
            vm.agreeList=data.list;
            vm.limitAgree=data.limit;
            vm.pageObjectAgree=data.pageObject;
            vm.rowsPerPageAgree=data. pageObject.rowsPerPage;
            vm.pageNumberAgree=data.pageNumber;
            vm.rowinitAgree=data.rowinitAgree;
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        }
    });
}

function restAgreement() {
    $("#agreeTitle").val("");
    jQuery.ajax({
        url: vm.path+"/tWlmDecorate/queryAgreement.do" ,// url
        type: "POST",// 方法类型
        data: {"agreeTitle":$("#agreeTitle").val()},
        dataType:'json',
        success:function(data){
            vm.agreeList=data.list;
            vm.limitAgree=data.limit;
            vm.pageObjectAgree=data.pageObject;
            vm.rowsPerPageAgree=data. pageObject.rowsPerPage;
            vm.pageNumberAgree=data.pageNumber;
            vm.rowinitAgree=data.rowinitAgree;
            setTimeout(function(){ huixianJH(huixanzhi)},200);
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        }
    });
}

function resetValueYy(){
    $('#yyname').val('');
    jQuery.ajax({
        url:  vm.path+"/tWlmDecorate/queryPolicyAppInfo.do" ,// url
        type: "POST",// 方法类型
        data: {"appName":$("#yyname").val(),"id":vm.id},
        dataType:'json',
        success:function(data){
            if(data.flag==true){
                vm.limit3=data.limit3;
                vm.pageObject3=data.pageObject3;
                vm.appInfoList=data.appInfoList;
            }
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        } 
    });
}
//重新排序跑马灯 - 后续处理
function initSortPmd(obj){
	var xhli = $(obj).parents("li").parent("ul").find("li");
	$.each(xhli,function(k,v){
		 
		$(this).children("table").children("tbody").children("tr").eq(0).children("th:first-child").text(k+1); 
	//	console.log($(this).children("table").children("tbody").children("tr").eq(0).children("th:first-child").text());
	});
}


//置顶方法 
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

  // 模块上移
  function moveUpModule(obj) { 
	var current = $(obj).parents("li"); //获取当前div模块
	var prev = current.prev();  //获取当前div前一个元素
	console.log(current.index());
	if (current.index() > 0) { 
	  current.insertBefore(prev); //插入到当前div前一个元素前 
	  initSortPmd(obj);
	}else{
	  alert("亲，已经是最上面了，不能上移了");
	} 
  } 
  
  // 模块下移 
  function moveDownModule(obj) {
	var current = $(obj).parents("li"); //获取当前div模块
	var next = current.next(); //获取当前div后面一个元素
	if (next.length>0) { 
	  current.insertAfter(next);  //插入到当前div后面一个元素后面 
	  initSortPmd(obj);
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
		initSortTable(obj);
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
		initSortTable(obj);
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
	  initSortTable(obj);
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
	  initSortTable(obj);
	}else{
	  alert("亲，已经是最下面了，不能下移了");
	} 
  } 
/* 2020-11-9 新增 结束 */
  
  

//置顶方法 
function tablezdCktransverse(obj){ 
	var current = $(obj).parents("tr");
	if (current.index() != 0) { 
		$(obj).parents("tr").parent("tbody").prepend(current);
		initSortTabletransverse(obj);
	}else{
		alert("已经置顶啦~");
		return;
	}
}

//置底方法
function tableendCktransverse(obj){ 
	var current = $(obj).parents("tr");
	var nextAll = current.nextAll();
	if (nextAll.index() > 0) { 
		$(obj).parents("tr").parent("tbody").append(current);
		initSortTabletransverse(obj);
	}else{
		alert("已经到底啦~");
		return;
	}
}

  // 模块上移
  function tableUpModuletransverse(obj) { 
	var current = $(obj).parents("tr"); //获取当前div模块
	var prev = current.prev();  //获取当前div前一个元素
	console.log(current.index());
	if (current.index() > 0) { 
	  current.insertBefore(prev); //插入到当前div前一个元素前 
	  initSortTabletransverse(obj);
	}else{
	  alert("亲，已经是最上面了，不能上移了");
	} 
  } 
  
  // 模块下移 
  function tableDownModuletransverse(obj) {
	var current = $(obj).parents("tr"); //获取当前div模块
	var next = current.next(); //获取当前div后面一个元素
	if (next.length>0) { 
	  current.insertAfter(next);  //插入到当前div后面一个元素后面 
	  initSortTabletransverse(obj);
	}else{
	  alert("亲，已经是最下面了，不能下移了");
	} 
  } 
  
  function initSortTable(t,count){
	    var trIndex = $(t).parents('tr').index();
	    console.log(trIndex);
	    var jumpType = $(".jumpType");
	    for(var i = 0 ; i < jumpType.length ; i ++ ){
	        $(jumpType[i]).find(".ljInput").attr("id","ljInput" + (i + 1));
	        $(jumpType[i]).find("input[type='radio']").attr("name","linkType" + (i + 1));
	        $(jumpType[i]).find(".ggInput").attr("id","ggInput" + (i + 1));
	        $(jumpType[i]).find(".jhyInput").attr("id","jhyInput" + (i + 1));
	        
	        $(jumpType[i]).find("input[type='radio']").eq(0).attr("value","lj" + (i + 1));
	        $(jumpType[i]).find("input[type='radio']").eq(1).attr("value","gg" + (i + 1));
	        $(jumpType[i]).find("input[type='radio']").eq(2).attr("value","jhy" + (i + 1));
	        
	    }
	    /** * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求 start ** */
	    var ggwbms = $('#htmlCon table').find(".ggwbm");
	    for(var i = 0 ; i < ggwbms.length ; i ++ ){
	        $(ggwbms[i]).find("p").attr("id","goodCodeInput" + (i + 1));
	    }
	    /** * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求 start ** */
	}
  
  function initSortTabletransverse(t,count){
      var imgNum=$(t).parent("td").parent("tr").parent("tbody").children();
	    console.log(imgNum);
	    $.each(imgNum,function(k,v){
			 
			$(this).children("td:first-child").text(k+1); 
		//	console.log($(this).children("table").children("tbody").children("tr").eq(0).children("th:first-child").text());
		});
	    /** * add by dingchuan 20190704 441-YH19070202优化装修页面各广告位插码的需求 start ** */
	}

	//map转字符串
function mapToString(map) {
    let this_ = this;
    let obj= Object.create(null);
    if(map != null){
        for (let[k,v] of map) {
            if(typeof(v)=="object"){
                let chMap;
                chMap = this_.mapToObj(v);
                obj[k] = chMap;
            }else{
                obj[k] = v;
            }
        }
    }
    return JSON.stringify(obj);
}
//特殊字符处理
function escapeHtml(string) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

//调整弹窗大小
var cliObj;
function resetSize(obj,isClose){
    cliObj = obj;
    if(isClose=='Y'){
        $(obj).parent().find("img[class='expand_or_shrink']").attr('src','../../images/iopexpand.png');
        $(obj).parent().removeClass("iop_box_resize");
        $(obj).parent().find("div[id='htmlConCspzpp']").removeClass("child_resize");
        $(obj).parent().find("div[id='htmlConCspz2pp']").removeClass("child_resize");
    }else{
        if($(obj).parent().hasClass("iop_box_resize")){
            $(obj).find("img[class='expand_or_shrink']").attr('src','../../images/iopexpand.png');
            $(obj).parent().removeClass("iop_box_resize");
            $(obj).parent().find("div[id='htmlConCspzpp']").removeClass("child_resize");
            $(obj).parent().find("div[id='htmlConCspz2pp']").removeClass("child_resize");
        }else{
            $(obj).find("img[class='expand_or_shrink']").attr('src','../../images/iopshrink.png');
            $(obj).parent().addClass("iop_box_resize");
            $(obj).parent().find("div[id='htmlConCspzpp']").addClass("child_resize");
            $(obj).parent().find("div[id='htmlConCspz2pp']").addClass("child_resize");
        }
    }
    initIopSize();
}
function resetSizeFloor(obj,isClose){
    cliObj = obj;
    if(isClose=='Y'){
        $(obj).parent().find("img[class='expand_or_shrink']").attr('src','../../images/iopexpand.png');
        $(obj).parent().removeClass("iop_box_resize");
        $(obj).parent().find("div[id='htmlConCspz']").removeClass("child_resize");
        $(obj).parent().find("div[id='htmlConCspz2']").removeClass("child_resize");
    }else{
        if($(obj).parent().hasClass("iop_box_resize")){
            $(obj).find("img[class='expand_or_shrink']").attr('src','../../images/iopexpand.png');
            $(obj).parent().removeClass("iop_box_resize");
            $(obj).parent().find("div[id='htmlConCspz']").removeClass("child_resize");
            $(obj).parent().find("div[id='htmlConCspz2']").removeClass("child_resize");
        }else{
            $(obj).find("img[class='expand_or_shrink']").attr('src','../../images/iopshrink.png');
            $(obj).parent().addClass("iop_box_resize");
            $(obj).parent().find("div[id='htmlConCspz']").addClass("child_resize");
            $(obj).parent().find("div[id='htmlConCspz2']").addClass("child_resize");
        }
    }
    initIopSize();
}


$(window).resize(function () {
    initIopSize();
})

function initIopSize() {
    if($(cliObj).parent().hasClass("iop_box_resize")){
        var screenHeight = $(window).height();// 窗口高度
        var screenWidth = $(window).width();// 窗口宽度
        $(cliObj).parent().width(screenWidth);// 设置内容区域宽度
        $(cliObj).parent().height(screenHeight);// 设置内容区域高度
        $(cliObj).parent().find("div[class='tc iop-edit iop-edit1pp active']").attr('style','padding:0;margin:0;');
        $(cliObj).parent().find("div[class='tc iop-edit iop-editbwpp']").attr('style','padding:0;margin:0;');
    }else{
        $(cliObj).parent().width("810px");// 设置内容区域宽度
        $(cliObj).parent().height("470px");// 设置内容区域高度
    }
}

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
            var xyid = xyli.attr("agreeId");//协议id
            dbxyeditHtml+=`<li class="bmmoli">
                        <div class="bmmonli_div xymotit">
                        <div class=" "><span class="cred"> * </span><span>协议名称：</span></div><input type="text" disabled class="bminput namexy" value="`+ xyname +`"><span class='bmjh j_pzxymo secAgreeShow'>选择协议</span>
                        <input type="hidden" class="agreeIdHi" value="`+xyid+`">
                        </div>
                        <div class="bm_btn"><a href="javascript:;" class="cee4358bb" onclick="delodule(this)">移除</a></div>
                        </li>`;
        }
        $('#dbxyulId').html('').append(dbxyeditHtml);//modals3图片广告弹窗使用
    });
});

//协议保存
$('.dbxy-layer').on('click','.savebmgn',function(e){
    e.preventDefault();
    var xyNum = $(this).parents('.dbxy-layer').find("#dbxyulId li").length;
    console.log(xyNum);
    var editDbxy='';
    for(var i= 0 ;i<xyNum;i++){
        //获取协议名称
        var xydiv = $(this).parents('.dbxy-layer').find("#dbxyulId li").eq(i);
        console.log(xydiv.find(".namexy").val());
        var xynm = xydiv.find(".namexy").val().replaceAll("《","").replaceAll("》","");
        var agreeId = xydiv.find(".agreeIdHi").val();
        if(agreeId == ""){
            alert("第" +(i+1)+ "个协议没有选择协议，请选择后保存！");
            return;
        }
        editDbxy += `<a class="xieyi_btn" href="javascript:void(0);" agreeId="`+agreeId+`" onclick="turnToAgreePage('`+agreeId+`')">《`+ xynm+`》</a>`;
    }
    $(xyClickObj).find('.xieyi_btn_container p').html(editDbxy);
    closeC('.modals_dbxy');
});
/* ****** 20211201协议end ****** */
//新增协议模块内容
function addxymo(){
    if($("#dbxyulId").find("li").length >=4){
        alert("最多可添加4个协议哦");
        return;
    }
    var xystr = `<li class="bmmoli">
                <div class="bmmonli_div xymotit">
                <div class=" "><span class="cred"> * </span><span>协议名称：</span></div><input type="text" disabled class="bminput namexy" value=""><span class='bmjh j_pzxymo secAgreeShow'>选择协议</span>
                <input type="hidden" class="agreeIdHi" value="">
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
var agreeObj
$(document).on('click','.secAgreeShow',function(e) {// 选择
    agreeObj = $(this);
    var agreeId = $(this).parents('.bmmonli_div').find(".agreeIdHi").val();
    $(".tiaoType").html('选择协议');
    var id= this.id;
    $("#agreeId").val(id);
    huixianJH(agreeId);
    huixanzhi=agreeId;
    $('.modals_cspzagree').fadeIn(200, function() {// 展示参数配置弹层
        var layer=$('.cspzedit-layer',this);
        layer.css({
            'margin-top':-(layer.height())/2,
            'margin-left':-(layer.width())/2
        }).fadeIn(100);
    });
});
//saveAgree
$(document).on('click','.saveAgree',function(e) {// 选择
    var agreeId = $(this).parents(".cspzedit-layeragree").find("input:radio[name='agreeId']:checked").val();
    var agreeName = $(this).parents(".cspzedit-layeragree").find("input:radio[name='agreeId']:checked").attr("agreeName");
    $(agreeObj).parents('.bmmonli_div').find(".agreeIdHi").val(agreeId);
    $(agreeObj).parents('.bmmonli_div').find(".namexy").val(agreeName);
    $('.modals_cspzagree').fadeOut(200, function() {// 展示参数配置弹层
        $(this).find('.cspzedit-layer').hide();
    });
});


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

/**
 * 2021add 1223 qsf
 * 新的模板设置index-src，
 * 旧的模板编辑保存的时候也设置一遍index-src
 * 编辑和新建首次进来在本地缓存是没有数据的，当保存触发后才会设置缓存
 * 因此在设置缓存前将页面设置index-src属性后再保存本地缓存或者是数据库
 **/
function setDatasrc(){
    var dm = document.getElementsByClassName("savehtml")[0];
    var imgs = dm.querySelectorAll("img");

    imgs.forEach((el)=>{
        if(!eachTab(el)){
            var srcurl = el.getAttribute("src");
            el.setAttribute("index-src",srcurl);
            if(srcurl.indexOf("demo") == -1){//默认图片不存在时替换
                el.setAttribute("src","../../images/decorate/zhanwei.png")
            }
        }else {
            console.log('保存编辑图标没有设置哦');
        }
    })
}

 


/**
 * 20211215add
 * 页面渲染时重构index-src
 * 渲染页面获取img标签是否有index-src属性
 * 判断index-src属性赋值给img标签
 * 回显保存都不设置编辑按钮图片src属性
 **/
function reDatasrc(){
    var div = document.getElementsByClassName("demo")[0];

    var imgs = div.querySelectorAll("img");

    imgs.forEach((el)=>{
        //判断已经有index-src的或者是其他功能img的不是展示的不需要设置index-src属性
        if(!!(el.getAttribute("index-src"))){
            // console.log("判断是编辑按钮不设置index-src属性,并且将赋值src");
            var url = el.getAttribute("index-src");
            el.setAttribute("src",url);
        }else{
            //设置index-src属性
            //  console.log(el.getAttribute("src"),"hahah")
            var url = el.getAttribute("src");
            el.setAttribute("index-src",url);

        }
    })
}
//2021 add wubin 楼层左移
$('.demo').on('click','.lefttb',function(){
    var current = $(this).parents('.kdli'); //获取当前<tr>
    var prev = current.prev();  //获取当前>前一个元素

    var divcur = $('.demo .tabslc .bydiv').eq(current.index());
    var divprev = divcur.prev();//获取当前div的前一个

    if (current.index() > 0) {
        current.insertBefore(prev); //插入到当前前一个元素前
        divcur.insertBefore(divprev);//插入到当前前一个元素前
        console.log(current.index(),divcur.index());
        /*$('.demo .tabslc .bydiv').css("display","none");
        $('.demo .tabslc .bydiv').eq(current.index()).css("display","block");*/
        $(this).parent().prev().find('.lcwx').click();
    }else{
        alert('不能左移了')
    }
})
//2021 add wubin tab楼层右移
$('.demo').on('click','.righttb',function(){
    var current = $(this).parents('.kdli'); //获取当前
    var next = current.next('.kdli'); //获取当前后面一个元素

    var divcur = $('.demo .tabslc .bydiv').eq(current.index());
    var divprev = divcur.next();
    if (next.length>0) { 
      current.insertAfter(next);  //插入到当前后面一个元素后面
      divcur.insertAfter(divprev);
      console.log(current.index(),divcur.index());
      /*$('.demo .tabslc .bydiv').css("display","none");
      $('.demo .tabslc .bydiv').eq(current.index()).css("display","block");*/
      $(this).parent().prev().find('.lcwx').click();
    }else{
      alert('不能右移了')
    }
})
//点击空心星星
$(".demo").on('click','.noCheckStar',function(e){
    $(this).addClass('none')
    $(this).next().removeClass('none')
    $(this).parents('.swiper-slide.kdli').siblings().find('.yesCheckStar').addClass('none').prev().removeClass('none')
    $(this).parent().prev().find('.lcwx').click()
});
$(".demo").on('click','.lcwx',function(e){
    e.stopPropagation();
    $(this).parent().next().find('.yesCheckStar').removeClass('none').prev().addClass('none')
    $(this).parents('.swiper-slide.kdli').siblings().find('.yesCheckStar').addClass('none').prev().removeClass('none')
});




function imgInput_file(files,x){
    var AllowImgFileSize = 200000; // 上传图片最大值(单位字节)（ 1 M = 1048576
    // B ）超过1M上传失败
    var image = '';
    if(!files || !files[0]){
        return;
    }
    var shareImg = URL.createObjectURL(files[0]);
    var img = new Image();
    img.src = shareImg;
    img.onload = function () {//增加判断图片尺寸逻辑，图片加载完执行判断，图片上传，否则会因为异步加载导致判断不了
        if(img.complete){
            console.log($(x).parent().attr("class"))
            if($(x).parent().attr("class").indexOf("shareImg")>=0){
                if(img.width!=210||img.height!=168){
                    alert("分享图片必须是210*168，请重新选择！");
                    return ;
                }
            }
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = function(evt){
                if (AllowImgFileSize != 0 && AllowImgFileSize < reader.result.length) {
                    alert( '上传失败，请上传不大于150k的图片！');
                    $(x).parents('td').find('.yulanImg img').attr("src","../../images/decorate/demo.jpg");
                    return;
                }else{
                    // 执行上传操作
                    image = evt.target.result;
                    $.ajax({
                        type:'POST',
                        url: vm.path + '/tWlmDecorate/uploadimage.do',
                        data: {image: image},
                        async: false,
                        dataType: 'json',
                        success: function(data){
                            if(data.flag){
                                console.log(data.message);
                                // if(!$(x).prev().hasClass("llbtn_xlbt")){
                                //     $(x).prev().text(vm.path + "/" + data.imgFilePath);
                                // }
                                // $(x).parents('td').find('.yulanImg img').attr("src",vm.path + "/" + data.imgFilePath);
                                // $(x).next().show();
                                $(x).parent().children('.imgPerview').attr("src",vm.path + "/" + data.imgFilePath);

                                console.log(data.imgFilePath);
                            }else{
                                console.log(data.message);
                            }
                        },
                        error: function(err){
                            alert('网络故障');
                        }
                    });
                }

            }
        }
    };
}


//静态广告选择广告/页面
function chooseAdinfo3(this1,sign,num){// 弹出广告id弹窗
    $('.bminput_').removeClass('chooseAdinfo3');
    $("#floorType").val('chooseAdinfo3_');
    queryPolicyPage();
    $("#tjnr2yy").hide();
    // $(this).parent().find('.link_href').attr("id","jumpNew");
    $(this1).parent().find('.bminput_').addClass("chooseAdinfo3");

    $('.modals_cspzjhy').fadeIn(200, function() {//展示参数配置弹层
        var zhi=$(this).parent().find('.bminput_').val();
        huixianJH(zhi);
        huixanzhi=zhi;
        var layer=$('.cspzedit-layer',this);
        layer.css({
            'margin-top':-(layer.height())/2,
            'margin-left':-(layer.width())/2
        }).fadeIn(100);//弹窗位置设置
        //iop推荐弹窗拼串开始
        $('#htmlConjh').show();//默认展示IOP推荐tab
    });
}


//保存时给a标签增加插码序号属性
//tab楼层特殊处理，每个tab为 X-X,楼层下的元素为 X-X-X,元素下的属性为 X-X-X-X
function addAttrToTaga() {
    let a = 0
    $('.demo').find('.bigFloor').each(function(i){//楼层循环
        let _this = $(this)
        if($(this).attr('bind') != 'floorAttr_3'){ //非tab楼层
            $(this).find('.ui-draggable').each(function(){
                if($(this).hasClass("box")){
                    $(this).find('a').each(function(u) {
                        $(this).attr('data-codeInser',a+1+'-'+(u+1))
                    })
                    if($(this).find("a").length>0){
                        a++;
                    }
                }else if($(this).hasClass("wdg")){
                    $(this).find('a').each(function(u) {
                        $(this).attr('data-codeInser',a+1+'-'+(u+1))
                    })
                    if($(this).find("a").length>0){
                        a++;
                    }
                }

            })
        }else{
            $(this).find(".smtb").each(function(u){
                let n = 0;
                $(this).find('.ui-draggable').each(function(){
                    if($(this).hasClass("box")){
                        $(this).find('a').each(function(m) {
                            $(this).attr('data-codeInser',a+1+'-'+(u+1)+'-'+(n+1)+'-'+(m+1))
                        })
                        if($(this).find("a").length>0){
                            n++;
                        }
                    }else if($(this).hasClass("wdg")){
                        $(this).find('a').each(function(m) {
                            $(this).attr('data-codeInser',a+1+'-'+(u+1)+'-'+(n+1)+'-'+(m+1))
                        })
                        if($(this).find("a").length>0){
                            n++;
                        }
                    }
                })
            })
            a++;
        }
    })
}
//iop轮播配置条件搜索 --开始
function searchIopSetting(obj,str1,str2,cla) {
    var searchAd = $("#"+str1).val();
    var searchCl = $("#"+str2).val();
    var divPar = $(obj).parents("div[id='"+cla+"']").find("tbody[class='mytablebox']");
    //展示的配置如果查询中不存在则隐藏
    divPar.find("tr:visible").each(function (i,e) {
        var trCl = $(e).find("input[name=planId]").val();
        var trAd = $(e).find("input[class=policyGgwbm]").val();
        if(trAd.indexOf(searchAd)>-1 && trCl.indexOf(searchCl)>-1){

        }else {
            $(e).hide();
        }
    });
    //隐藏的配置查询中如果存在则显示
    divPar.find("tr:hidden").each(function (i,e) {
        var trCl = $(e).find("input[name=planId]").val();
        var trAd = $(e).find("input[class=policyGgwbm]").val();
        if(trAd.indexOf(searchAd)>-1 && trCl.indexOf(searchCl)>-1){
            $(e).show();
        }else {

        }
    });
    //如果查询的数据都是空数据则显示所有
    if(searchCl == '' && searchAd == ''){
        divPar.find("tr:hidden").each(function (i,e) {
            $(e).show();
        });
    }
}
//补位广告
function searchIopSettingBw(obj,str,cla) {
    var searchAd = $("#"+str).val();
    var divPar = $(obj).parents("div[id='"+cla+"']").find("tbody[class='mytablebox']");
    //展示的配置如果查询中不存在则隐藏
    divPar.find("tr:visible").each(function (i,e) {
        var trAd = $(e).find("input[class=policyGgwbm]").val();
        if(trAd.indexOf(searchAd)>-1){

        }else {
            $(e).hide();
        }
    });
    //隐藏的配置查询中如果存在则显示
    divPar.find("tr:hidden").each(function (i,e) {
        var trAd = $(e).find("input[class=policyGgwbm]").val();
        if(trAd.indexOf(searchAd)>-1){
            $(e).show();
        }else {

        }
    });
    //如果查询的数据都是空数据则显示所有
    if(searchAd == ''){
        divPar.find("tr:hidden").each(function (i,e) {
            $(e).show();
        });
    }
}
//重置
function resetIopQuerySetting(obj,str1,str2,cla) {
    $("#"+str1).val('');
    $("#"+str2).val('');
    var divPar = $(obj).parents("div[id='"+cla+"']").find("tbody[class='mytablebox']");
    divPar.find("tr:hidden").each(function (i,e) {
        $(e).show();
    });
}
//补位广告重置
function resetIopQuerySettingBw(obj,str,cla) {
    $("#"+str).val('');
    var divPar = $(obj).parents("div[id='"+cla+"']").find("tbody[class='mytablebox']");
    divPar.find("tr:hidden").each(function (i,e) {
        $(e).show();
    });
}
//保存全部 需要先设置为显示，否则保存方法取不到数据
function saveBathchMain(obj,type) {
    if(type == '0'){
        var divPar = $(obj).parents("div[id='cspzedit-layer']").find("div[id='htmlConCspz']").find("tbody[class='mytablebox']");
        divPar.find("tr:hidden").each(function (i,e) {
            $(e).show();
        })
    } else if (type == '1'){
        var divPar2 = $(obj).parents("div[id='cspzedit-layer']").find("div[id='htmlConCspz2']").find("tbody[class='mytablebox']");
        divPar2.find("tr:hidden").each(function (i,e) {
            console.log(e)
            $(e).show();
        })
    }
    saveBathch(type);
}
function saveBathchMain(obj,type) {
    if(type == '0'){
        var divPar = $(obj).parents("div[id='cspzedit-layer']").find("div[id='htmlConCspz']").find("tbody[class='mytablebox']");
        divPar.find("tr:hidden").each(function (i,e) {
            $(e).show();
        })
    } else if (type == '1'){
        var divPar2 = $(obj).parents("div[id='cspzedit-layer']").find("div[id='htmlConCspz2']").find("tbody[class='mytablebox']");
        divPar2.find("tr:hidden").each(function (i,e) {
            console.log(e)
            $(e).show();
        })
    }
    saveBathch(type);
}
//iop轮播配置条件搜索 --结束
//辽友会转盘元素活动查询
function queryActiveInfo(obj) {
    var activeNo = $(obj).val();
    if(activeNo!=''){
        $.ajax({
            url:vm.path+"/tWlmDecorate/queryActiveInfo.do",
            type:"post",
            data:{activeNo:activeNo},
            success:function (data) {
                if(data.code=='suc'){
                    $("#activeTitle").val(data.actName);
                    editor.html(data.actDesc);
                }else {
                    alert("查询活动信息失败");
                }
            },
            error:function () {
                alert("查询活动信息失败！");
            }
        });
    }else {
        $("#activeTitle").val("");
        editor.html("");
    }
}



$(document).on('click','.cspzBQ',function(e) {
    selectLiCspzBq(0, 3);
    $('.modals_cspz_bq').fadeIn(200, function() {// 展示参数配置弹层
        var layer=$('.cspzedit-layer',this);
        layer.css({
            'margin-top':-(layer.height())/2,
            'margin-left':-(layer.width())/2
        }).fadeIn(100);// 弹窗位置设置
        // iop推荐弹窗拼串开始
    });
    var p=$(this).context.parentElement.nextElementSibling.children["0"].id;
    if(p!=null && p!=""){
        vm.bigfloorId =p;
    }else{
        p= vm.bigfloorId;
    }

    console.log($(this).context.parentElement.nextElementSibling.children["0"]);
    $("#decorater_roomid").val(p);
    $("#decorater_roomidbq").val(p);
    $('#htmlConCspzBq').show();// 默认展示IOP推荐tab
    $("#htmlConCspzBq .cont_box .iopFloor").show();
    $(".iopRoom").hide();
    var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
    var policy = null;;
    var policyListbuwei = null;
    jQuery.ajax({
        url:vm.path + "/tWlmDecorate/querypolicyBq.do?id="+vm.id+"&roomId="+p,
        type: "POST",// 方法类型
        dataType:'json',
        async:false,
        success:function(data){
            if(data.flag==true){
                vm.isHide=data.isHide;
                policy=data.policyList;
                policyListbuwei= data.policyListbuwei;
            }
        },
        // 调用出错执行的函数
        error: function(){
            alert("操作异常");
        }
    });
    $("#floorType").val("0");
    console.log(vm.isHide);
    if(vm.isHide=="0"){
        $("#ifyc1ppbq").attr('checked', 'checked');
    }else{
        $("#ifyc2ppbq").attr('checked', 'checked');
    }
    if(policy!=null){
        var ispop="";
        var tianzhi="";
        for(var int=0;int<policy.length;int++){
            var xuhao=int+1;
            var address=policy[int][5];
            var popUpButtoniop=policy[int][21];
            var policyGgwbm=policy[int][23];
            if(!policyGgwbm){
                policyGgwbm = "";
            }
            if(address==null||address==''||address==undefined){
                address="";
            }
            if(popUpButtoniop=="0"){
                ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonbq"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
            }else{
                ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonbq"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
            }
            var addrname = policy[int][22];
            if(addrname == null){
                addrname = "";
            }
            tianzhi+="<tr class='clxqq' id='policybq"+int+"'>" +
                " <td><input type='checkbox' value="+policy[int][0]+" name='ioppp'></td> " +
                "<td id='xuhaoCount'>"+xuhao+"</td> <td>" +
                "<div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div>"+
                "<div> <dl> <dt>标签ID:</dt> <dd> <input type='hidden' name='policyId' id='policyId' value="+policy[int][0]+"> <input type='text' placeholder='请输入标签ID' name='planId' id='planId' value="+policy[int][3]+" onkeyup=\"value=value.replace(/[\u4e00-\u9fa5]/ig,'')\"> <span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span></dd></dl></div>"+
                "<div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='iconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='iconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='iconListpp"+int+"opacityP' onclick="+"deleteImg('iconListpp"+int+"')>删除图片</p><input type='hidden' name='iconListppimageName' id='iconListpp"+int+"imageName' value="+policy[int][4]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>"+
                "<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'  >选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'value="+addrname+">	</dd>	</dl></div>"+
                "<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                "<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTimepp' name='startTimepp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+" /> ~ <input id='endTimepp' name='endTimepp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div></td>"+
                "<td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunBq("+int+")'>保存</a></td></tr>"
        }

        var tianzhi2=tbody+tianzhi+"</tbody>";
        $('#htmlConCspzBq table').html('').prepend(tianzhi2);
    }else{
        showJtBq();
    }
    if(policyListbuwei!=null){
        var tianzhi="";
        var ispop="";
        var policy=policyListbuwei;
        for(var int=0;int<policy.length;int++){
            var address=policy[int][5];
            var popUpButtoniop=policy[int][21];
            var policyGgwbm=policy[int][23];
            if(!policyGgwbm){
                policyGgwbm = "";
            }
            if(address==null||address==''||address==undefined){
                address="";
            }
            if(popUpButtoniop=="0"){
                ispop="<input type='radio' name='popUpButtoniopbuwei"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniopbuwei"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
            }else{
                ispop="<input type='radio' name='popUpButtoniopbuwei"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniopbuwei"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
            }
            var addrname = policy[int][22];
            if(addrname == null){
                addrname = "";
            }
            var xuhao=int+1;
            tianzhi+="<tr class='clxqq'  id='policybuweibq"+int+"'><td><input type='checkbox' value="+policy[int][0]+" name='buweipp'></td>" +
                "<td>"+xuhao+"</td><td><div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div><div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiiconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='buweiiconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='buweiiconListpp"+int+"opacityP' onclick="+"deleteImg('buweiiconListpp"+int+"')>删除图片</p><input type='hidden' name='policyId' id='buweipolicyId' value="+policy[int][0]+"><input type='hidden' name='buweiiconListppimageName' value="+policy[int][4]+" id='buweiiconListpp"+int+"imageName'><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
                "<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'>选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'value="+addrname+"></dd></dl></div>" +
                "<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                "<div><dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>" +
                "<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTime1pp' name='startTime1pp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+" /> ~ <input id='endTime1pp' name='endTime1pp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+" /></dd></dl></div>	</td>" +
                "<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuweiBq("+int+")'>保存</a></td>							</tr>											"
        }
        var tianzhi2=tbody+tianzhi+"</tbody>";
        $('#htmlConCspz2Bq table').html('').prepend(tianzhi2);
    }else{
        var tianzhi2="						<thead>							<tr>								<th><input type='checkbox' class='allCheckbox'></th>								<th>序号</th>								<th>策略配置</th>								<th>操作</th>							</tr>						</thead>						<tbody class='mytablebox'>							<tr class='clxqq'  id='policybuweibq0'>								<td><input type='checkbox' name='buweipp'></td>								<td>1</td>								<td> <div><dl><dt>广告编码:</dt> <dd><input type=\"text\" name=\"policyGgwbm\" class=\"policyGgwbm\"></dd></dl></div>									<div >										<dl>											<dt>图片:</dt>											<dd>												<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='buweiiconListpp0imagesZw'>												<img src='' alt='' class='buweiiconListpp0imgPerview'>												<p class='opacityP' id='buweiiconListpp0opacityP'>上传图片</p>												<input type='hidden' name='policyId' id='policyId'>  												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconListpp0'>												<input type='hidden' name='buweiiconListppimageName' id='buweiiconListpp0imageName' >												</div>												<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div >									<div>										<dl>											<dt>跳转地址:</dt>											<dd>												<input type='hidden' name='jumpType' id='peizhijumpType'>												<input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress'>												<span class='jhsp ad' id='jhsp0'>选择广告/聚合页</span>				<input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'>							</dd>										</dl>									</div><div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtoniopbuwei0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtoniopbuwei0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>									<div>										<dl>											<dt>展示权重:</dt>											<dd>												<input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights'>																										</dd>										</dl>									</div>									<div>										<dl>											<dt>有效时间:</dt>											<dd class='yxsjdd'>												<input id='startTime1pp' name='startTime1pp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value='' /> ~ <input id='endTime1pp' name='endTime1pp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value='' />											</dd>										</dl>									</div>								</td>								<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuweiBq(0)'>保存</a></td>							</tr>						</tbody>";
        $('#htmlConCspz2Bq table').html('').append(tianzhi2);
    }
}) ;


function selectLiCspzBq(thisIndex, v){
    $('.selectLiCspzBq li').eq(thisIndex).addClass('cur').siblings('li').removeClass('cur');

    $('.main-content3').eq(thisIndex).show().siblings('.main-content3').hide();

    $("#policyType").val(v);
    $('.bqtabs').eq(thisIndex).show().siblings('.bqtabs').hide();
}

$('.selectLiCspzBq li').click(function(){
    var thisIndex=$(this).index();
    var v=$(this).attr("value");
    selectLiCspzBq(thisIndex, v);
})

function searchBqSetting(obj,str1,str2,cla) {
    var searchAd = $("#"+str1).val();
    var searchCl = $("#"+str2).val();
    var divPar = $(obj).parents("div[id='"+cla+"']").find("tbody[class='mytablebox']");
    //展示的配置如果查询中不存在则隐藏
    divPar.find("tr:visible").each(function (i,e) {
        var trCl = $(e).find("input[name=planId]").val();
        var trAd = $(e).find("input[class=policyGgwbm]").val();
        if(trAd.indexOf(searchAd)>-1 && trCl.indexOf(searchCl)>-1){

        }else {
            $(e).hide();
        }
    });
    //隐藏的配置查询中如果存在则显示
    divPar.find("tr:hidden").each(function (i,e) {
        var trCl = $(e).find("input[name=planId]").val();
        var trAd = $(e).find("input[class=policyGgwbm]").val();
        if(trAd.indexOf(searchAd)>-1 && trCl.indexOf(searchCl)>-1){
            $(e).show();
        }else {

        }
    });
    //如果查询的数据都是空数据则显示所有
    if(searchCl == '' && searchAd == ''){
        divPar.find("tr:hidden").each(function (i,e) {
            $(e).show();
        });
    }
}
//补位广告
function searchBqSettingBw(obj,str,cla) {
    var searchAd = $("#"+str).val();
    var divPar = $(obj).parents("div[id='"+cla+"']").find("tbody[class='mytablebox']");
    //展示的配置如果查询中不存在则隐藏
    divPar.find("tr:visible").each(function (i,e) {
        var trAd = $(e).find("input[class=policyGgwbm]").val();
        if(trAd.indexOf(searchAd)>-1){

        }else {
            $(e).hide();
        }
    });
    //隐藏的配置查询中如果存在则显示
    divPar.find("tr:hidden").each(function (i,e) {
        var trAd = $(e).find("input[class=policyGgwbm]").val();
        if(trAd.indexOf(searchAd)>-1){
            $(e).show();
        }else {

        }
    });
    //如果查询的数据都是空数据则显示所有
    if(searchAd == ''){
        divPar.find("tr:hidden").each(function (i,e) {
            $(e).show();
        });
    }
}
function showJtBq(){
    var tianzhi2="						   <thead>							<tr>								<th><input type='checkbox' class='allCheckbox'></th>								<th>序号</th>								<th>策略配置</th>								<th>操作</th>							</tr>						</thead>						<tbody class='mytablebox'> 							<tr class='clxqq' id='policybq0'>								<td><input type='checkbox' name='ioppp'></td>								<td id='xuhaoCount'>1</td>								<td>									<div><dl><dt>广告编码:</dt> <dd><input type=\"text\" name=\"policyGgwbm\" class=\"policyGgwbm\"></dd></dl></div><div>										<dl>											<dt>标签ID:</dt>											<dd>												<input type='hidden' name='policyId' id='policyId'>  												<input type='text' placeholder='请输入标签ID' name='planId' id='planId' autocomplete='off' onkeyup=\"value=value.replace(/[\u4e00-\u9fa5]/ig,'')\">												<span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span>											</dd>										</dl>									</div>									<div>										<dl>											<dt>图片:</dt>											<dd>												<div class='uploadImg normalData'>												<img src='../../images/images.png' alt='' class='iconListpp0imagesZw'>												<img src='' alt='' class='iconListpp0imgPerview'>												<p class='opacityP' id='iconListpp0opacityP'>上传图片</p>												<input type='hidden' name='iconListppimageName' id='iconListpp0imageName' >												<input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconListpp0' >												</div>												<span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span>											</dd>										</dl>									</div>									<div>										<dl>											<dt>跳转地址:</dt>											<dd>												<input type='hidden' name='jumpType' id='peizhijumpType'>												<input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' autocomplete='off'>												<span class='jhsp ad' id='jhsp0'  >选择广告/聚合页</span>	<input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'>										</dd>										</dl>									</div><div  >										<dl>											<dt>页面展示:</dt>											<dd class='yxsjdd'>												<input type='radio' name='popUpButtoniop0' class='rin'  value='0'/><label for='ifyc1' class='rlb'>父页面</label> 											<input type='radio' name='popUpButtoniop0' class='rin'  checked value='1'/><label for='ifyc2' class='rlb'>新页面</label>											</dd>										</dl>									</div>																		<div>										<dl>											<dt>有效时间:</dt>											<dd class='yxsjdd'>												<input id='startTimepp' name='startTimepp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" autocomplete='off'/> ~ <input id='endTimepp' name='endTimepp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" />											</dd>										</dl>									</div>								</td>								<td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunBq(0)'>保存</a></td>							</tr>						</tbody>";
    $('#htmlConCspzBq table').html('').append(tianzhi2);
}


var cloneSaveBq=0 ;
var cloneSaveBuWeiBq=0;
function jixuaddBq(index){
    if(index=="0"){
        var coun=$("#htmlConCspzBq .cont_box table tbody").children("tr").length-1;
        var a = $("#htmlConCspzBqCanClone .cont_box").find("table thead tr:nth-child(2)").clone();
        var ntable = $("#htmlConCspzBq .cont_box table tbody").append(a);
        cloneSaveBq++;
        var ntrer = ntable.children("tr");
        $.each(ntrer,function(i,eleName){// 遍历tr
            var j=i+1;
            $(eleName).children("td:nth-child(2)").text(j);
            if(i>coun){
                $(eleName).attr("style","");
                $(eleName).attr("id","policybq"+i);
                $(eleName).children("td:nth-child(3)").find("#iconListpp-1").attr("id","iconListpp"+i);
                $(eleName).children("td:nth-child(3)").find("#iconListpp-1imageName").attr("id","iconListpp"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".iconListpp-1imagesZw").attr("class","iconListpp"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".iconListpp-1imgPerview").attr("class","iconListpp"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#iconListpp-1opacityP").attr("id","iconListpp"+i+"opacityP");
                var popUpButtoniop1=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtoniop-1]")[0];
                var popUpButtoniop2=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtoniop-1]")[1];
                $(popUpButtoniop1).attr("name","popUpButtoniop"+i);
                $(popUpButtoniop2).attr("name","popUpButtoniop"+i);
                $(eleName).children("td:nth-child(3)").find("#jhsp-1").attr("id","jhsp"+i);
                $(eleName).children("td:nth-child(4)").children("a").attr("onclick","savePolicyFunBq("+i+")");
            }
        });

    }
    if(index=="1"){
        var a = $("#htmlConCspz2BqCanClone .cont_box").find("table thead tr:nth-child(2)").clone();
        var coun=$("#htmlConCspz2Bq .cont_box table tbody").children("tr").length-1;
        var ntable = $("#htmlConCspz2Bq .cont_box table tbody").append(a);
        cloneSaveBuWeiBq++;
        var ntr = ntable.children("tr");
        $.each(ntr,function(i,eleName){// 遍历tr
            i;
            var j=i+1;
            $(eleName).children("td:nth-child(2)").text(j);
            if(i>coun){
                $(eleName).attr("style","");
                $(this).attr("id","policybuweibq"+i);
                $(eleName).children("td:nth-child(3)").find("#jhsp-1").attr("id","jhsp"+i);
                $(eleName).children("td:nth-child(3)").find("#buweiiconListpp-1").attr("id","buweiiconListpp"+i);
                $(eleName).children("td:nth-child(3)").find("#buweiiconListpp-1imageName").attr("id","buweiiconListpp"+i+"imageName");
                $(eleName).children("td:nth-child(3)").find(".buweiiconListpp-1imagesZw").attr("class","buweiiconListpp"+i+"imagesZw");
                $(eleName).children("td:nth-child(3)").find(".buweiiconListpp-1imgPerview").attr("class","buweiiconListpp"+i+"imgPerview");
                $(eleName).children("td:nth-child(3)").find("#buweiiconListpp-1opacityP").attr("id","buweiiconListpp"+i+"opacityP");
                var popUpButtoniop1=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtoniopbuwei-1]")[0];
                var popUpButtoniop2=$(eleName).children("td:nth-child(3)").find("input[name=popUpButtoniopbuwei-1]")[1];
                $(popUpButtoniop1).attr("name","popUpButtoniopbuwei"+i);
                $(popUpButtoniop2).attr("name","popUpButtoniopbuwei"+i);
                $(eleName).children("td:nth-child(4)").children("a").attr("onclick","savePolicyFunbuweiBq("+i+")");
            }
        });
    }
}

function resetSizeBq(obj,isClose){
    cliObj = obj;
    if(isClose=='Y'){
        $(obj).parent().find("img[class='expand_or_shrink']").attr('src','../../images/iopexpand.png');
        $(obj).parent().removeClass("iop_box_resize");
        $(obj).parent().find("div[id='htmlConCspzBq']").removeClass("child_resize");
        $(obj).parent().find("div[id='htmlConCspz2Bq']").removeClass("child_resize");
    }else{
        if($(obj).parent().hasClass("iop_box_resize")){
            $(obj).find("img[class='expand_or_shrink']").attr('src','../../images/iopexpand.png');
            $(obj).parent().removeClass("iop_box_resize");
            $(obj).parent().find("div[id='htmlConCspzBq']").removeClass("child_resize");
            $(obj).parent().find("div[id='htmlConCspz2Bq']").removeClass("child_resize");
        }else{
            $(obj).find("img[class='expand_or_shrink']").attr('src','../../images/iopshrink.png');
            $(obj).parent().addClass("iop_box_resize");
            $(obj).parent().find("div[id='htmlConCspzBq']").addClass("child_resize");
            $(obj).parent().find("div[id='htmlConCspz2Bq']").addClass("child_resize");
        }
    }
    initIopSize();
}

$('.cspzedit-layer .close1bq').click(function(e){// iop楼层关闭弹窗
    $("#roomTypeBq").val("");
    e.preventDefault();
    iopBqFadeOut();
    return false;
});

function iopBqFadeOut(){
    $('.modals_cspz_bq').fadeOut(100, function() {
        $(this).find('.cspzedit-layeriop').hide();
    });
};

function savePolicyFunBq(a){
    var roomType=$("#roomTypeBq").val();//iop 房间类型
    var goodcodeinputsign=$("#policybq"+a).find(".policyGgwbm").val();//插码
    var policyType=$("#policyType").val();
    var  planId=$("#policybq"+a).find("#planId").val();
    var  startTime =$("#policybq"+a).find("#startTimepp").val();
    var  endTime=$("#policybq"+a).find("#endTimepp").val();
    var   policyId=$("#policybq"+a).find("#policyId").val();
    var   jumpType=$("#policybq"+a).find("#peizhijumpType").val();
    var   floorType=$("#floorType").val();
    var   jumpAddress=$("#policybq"+a).find("#jumpAddress").val();
    var   titleOrName=$("#policybq"+a).find("#jumpAddress").next().next().val();
    var   displayWeights=$("#policybq"+a).find("#displayWeights").val();
    var   imageName=$("#policybq"+a).find("#iconListpp"+a+"imageName").val();
    var popUpButtoniop=$("#policybq"+a).find("input[name=popUpButtoniop"+a+"]:checked").val();
    var   isHide=$('input[name=isHidepp]:checked').val();
    var   roomid=$("#decorater_roomid").val();

    if(startTime==""||startTime==undefined){
        alert("请输入有效期的初始时间！");
        return false;
    }
    if(endTime==""||endTime==undefined){
        alert("请输入有效期的结束时间！");
        return false;
    }
    if((new Date(startTime.replace(/-/g,"/")).getTime() > new Date(endTime.replace(/-/g,"/")).getTime())){
        alert("开始时间不能晚于结束时间！");
        return;
    }
    if(imageName==""||imageName==undefined){
        alert("请上传图片！");
        return false;
    }
    if(!roomType){
        if(isHide==""||isHide==undefined){
            alert("请选择是否隐藏楼层！");
            return false;
        }
    }
    if(!goodcodeinputsign){
        alert("请输入广告位编码！");
        return;
    }
    if(planId==""||planId==undefined){
        alert("请输入标签id！");
        return false;
    }
    $.ajax({
        type : "POST",
        dataType:"json",
        url : vm.path+"/tWlmDecorate/savePolicy.do",
        data :{'policyType':policyType,'planId':planId,'jumpAddress':jumpAddress,'displayWeights':displayWeights,
            'startTime':startTime,'endTime':endTime,'imageName':imageName,'isHide':isHide,'policyId':policyId,'decorateId':vm.id,'decoraterRoomid':roomid,"floorType":floorType,
            "jumpType":jumpType,"roomType":roomType,"popUpButtoniop":popUpButtoniop,'titleOrName':titleOrName,'policyGgwbm':goodcodeinputsign},
        success : function(data) {
            if(data.flag==true){
                toast("保存成功");// 改成小黑窗
                var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
                var policy;
                var policyIopList;
                jQuery.ajax({
                    url:vm.path + "/tWlmDecorate/querypolicyBq.do?id="+vm.id+"&roomId="+roomid,
                    type: "POST",// 方法类型
                    dataType:'json',
                    async:false,
                    success:function(data){
                        if(data.flag==true){
                            vm.isHide=data.isHide;
                            policy=data.policyList;
                        }
                    },
                    // 调用出错执行的函数
                    error: function(){
                        alert("操作异常");
                    }
                });
                var tianzhi="";
                var ispop="";
                if(policy!=null){
                    for(var int=0;int<policy.length;int++){
                        var xuhao=int+1;
                        var address=policy[int][5];
                        var popUpButtoniop=policy[int][21];
                        var policyGgwbm=policy[int][23];
                        if(!policyGgwbm){
                            policyGgwbm = "";
                        }
                        if(address==null||address==''||address==undefined){
                            address="";
                        }
                        if(popUpButtoniop=="0"){
                            ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
                        }else{
                            ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
                        }
                        var addrname = policy[int][22];
                        if(addrname == null){
                            addrname = "";
                        }
                        tianzhi+="<tr class='clxqq' id='policybq"+int+"'>" +
                            " <td><input type='checkbox' value="+policy[int][0]+" name='ioppp'></td> " +
                            "<td id='xuhaoCount'>"+xuhao+"</td> <td>" +
                            "<div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+"></dd></dl></div>"+
                            "<div> <dl> <dt>标签ID:</dt> <dd> <input type='hidden' name='policyId' id='policyId' value="+policy[int][0]+"> <input type='text' placeholder='请输入标签ID' name='planId' id='planId' value="+policy[int][3]+" onkeyup=\"value=value.replace(/[\u4e00-\u9fa5]/ig,'')\"> <span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span></dd></dl></div>"+
                            "<div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='iconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='iconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='iconListpp"+int+"opacityP' onclick="+"deleteImg('iconListpp"+int+"')>删除图片</p><input type='hidden' name='iconListppimageName' id='iconListpp"+int+"imageName' value="+policy[int][4]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>"+
                            "<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'  >选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'  value='"+addrname+"'>	</dd>	</dl></div>"+
                            "<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                            "<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTimepp' name='startTimepp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTimepp' name='endTimepp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div></td>"+
                            "<td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunBq("+int+")'>保存</a></td></tr>"
                    }
                    var tianzhi2=tbody+tianzhi+"</tbody>";
                    $('#htmlConCspzBq table').html('').prepend(tianzhi2);
                }

            }else if (data.code='1'){
                toast(decodeURIComponent(data.msg));
            }else{
                toast("网络故障");// 改成小黑窗
            }

        }
    });
    if(roomType){//房间类型
        $("#"+roomid).find("a").attr('goodCodeInput',goodcodeinputsign);
        $("#"+roomid).find("a").attr('goodcodeinputsign','goodcodeinputsign')
    }

}

function savePolicyFunbuweiBq(a){
    var goodcodeinputsign=$("#policybuweibq"+a).find(".policyGgwbm").val();//插码
    var policyType=$("#policyType").val();
    var roomType=$("#roomTypeBq").val();
    var isHide="";
    var planId="";
    var startTime =$("#policybuweibq"+a).find("#startTime1pp").val();
    var endTime=$("#policybuweibq"+a).find("#endTime1pp").val();
    var policyId=$("#policybuweibq"+a).find("#buweipolicyId").val();
    var jumpType=$("#policybuweibq"+a).find("#peizhijumpType").val();
    var floorType=$("#floorType").val();
    var jumpAddress=$("#policybuweibq"+a).find("#jumpAddress").val();
    var   titleOrName=$("#policybuweibq"+a).find("#jumpAddress").next().next().val();
    var  displayWeights=$("#policybuweibq"+a).find("#displayWeights").val();
    var  imageName=$("#policybuweibq"+a).find("#buweiiconListpp"+a+"imageName").val();
    var popUpButtoniop=$("#policybuweibq"+a).find("input[name=popUpButtoniopbuwei"+a+"]:checked").val();
    var  roomid=$("#decorater_roomid").val();
    var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
    if(displayWeights==""||displayWeights==undefined){
        alert("请输入权重！");
        return false;
    }else{
        if(!reg.test(displayWeights)) {
            alert("权重值请输入0-100的整数！");
            return false;
        }
    }
    if(startTime==""||startTime==undefined){
        alert("请输入有效期的初始时间！");
        return false;
    }
    if(endTime==""||endTime==undefined){
        alert("请输入有效期的结束时间！");
        return false;
    }
    if((new Date(startTime.replace(/-/g,"/")).getTime() > new Date(endTime.replace(/-/g,"/")).getTime())){
        alert("开始时间不能晚于结束时间！");
        return false;
    }
    if(imageName==""||imageName==undefined){
        alert("请上传图片！");
        return false;
    }
    if(!goodcodeinputsign){
        alert("请输入广告位编码！");
        return false;
    }
    $.ajax({
        type : "POST",
        dataType:"json",
        url : vm.path+"/tWlmDecorate/savePolicy.do",
        data :{'policyType':policyType,'planId':planId,'jumpAddress':jumpAddress,'displayWeights':displayWeights,
            'startTime':startTime,'endTime':endTime,'imageName':imageName,'isHide':isHide,'policyId':policyId,'decorateId':vm.id,'decoraterRoomid':roomid,"floorType":floorType,
            'jumpType':jumpType,"roomType":roomType,"popUpButtoniop":popUpButtoniop,'titleOrName':titleOrName,"policyGgwbm": goodcodeinputsign},
        success : function(data) {
            if(data.flag==true){
                toast("保存成功");// 改成小黑窗
                var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
                var policyListbuwei;
                jQuery.ajax({
                    url:vm.path + "/tWlmDecorate/querypolicyBq.do?id="+vm.id+"&roomId="+roomid,
                    type: "POST",// 方法类型
                    dataType:'json',
                    async:false,
                    success:function(data){
                        if(data.flag==true){
                            vm.isHide=data.isHide;
                            policyListbuwei= data.policyListbuwei;
                        }
                    },
                    // 调用出错执行的函数
                    error: function(){
                        alert("操作异常");
                    }
                });
                var tianzhi="";
                var ispop="";
                var policy=policyListbuwei;
                for(var int=0;int<policy.length;int++){
                    var xuhao=int+1;
                    var address=policy[int][5];
                    var popUpButtoniop=policy[int][21];
                    var policyGgwbm=policy[int][23];
                    if(!policyGgwbm){
                        policyGgwbm = "";
                    }
                    if(address==null||address==''||address==undefined){
                        address="";
                    }
                    if(popUpButtoniop=="0"){
                        ispop="<input type='radio' name='popUpButtoniopbuwei"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniopbuwei"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
                    }else{
                        ispop="<input type='radio' name='popUpButtoniopbuwei"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniopbuwei"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
                    }
                    var addrname = policy[int][22];
                    if(addrname == null){
                        addrname = "";
                    }
                    tianzhi+="<tr class='clxqq'  id='policybuweibq"+int+"'><td><input type='checkbox' value="+policy[int][0]+" name='buweipp'></td>" +
                        "<td>"+xuhao+"</td><td> <div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+"></dd></dl></div><div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiiconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='buweiiconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='buweiiconListpp"+int+"opacityP' onclick="+"deleteImg('buweiiconListpp"+int+"')>删除图片</p><input type='hidden' name='policyId' id='buweipolicyId' value="+policy[int][0]+"><input type='hidden' name='buweiiconListppimageName' value="+policy[int][4]+" id='buweiiconListpp"+int+"imageName'><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
                        "<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'>选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'value="+addrname+"></dd></dl></div>" +
                        "<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                        "<div><dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>" +
                        "<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTime1pp' name='startTime1pp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTime1pp' name='endTime1pp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div>	</td>" +
                        "<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuweiBq("+int+")'>保存</a></td>							</tr>											"
                }
                var tianzhi2=tbody+tianzhi+"</tbody>";
                $('#htmlConCspz2Bq table').html('').prepend(tianzhi2);
            }else if (data.code='1'){
                toast(decodeURIComponent(data.msg));
            }else{
                toast("网络故障");// 改成小黑窗
            }
        }
    });
    if(roomType){//房间类型
        $("#"+roomid).find("a").attr('goodCodeInput',goodcodeinputsign);
        $("#"+roomid).find("a").attr('goodcodeinputsign','goodcodeinputsign')
    }
}

function saveBathchBq(index){
    var tbody="<thead><tr><th><input type='checkbox' class='allCheckbox'></th><th>序号</th><th>策略配置</th><th>操作</th>	</tr></thead><tbody class='mytablebox'>";
    var policyType=$("#policyType").val();
    var floorType=$("#floorType").val();
    var roomid=$("#decorater_roomid").val();
    var roomType=$("#roomTypeBq").val();
    var msgNumMap = new Map();
    var msgPlanMap = new Map();
    var msglineMap = new Map();
    if(index=="0"){
        var tsMsg = "策划ID或者广告编码出现重复现象，具体行数为lineNums，请检查后重新填写！";//编码重复提示语
        var lineNum = "";//重复行
        msgNumMap = new Map();
        msgPlanMap = new Map();
        msglineMap = new Map();
        var flag=true;
        $("#policyTypebq").val(policyType);
        $("#floorTypebq").val(floorType);
        $("#decorater_roomidbq").val(roomid);
        $("#decorateIdbq").val(vm.id);
        var ntable = $("#htmlConCspzBq .cont_box table tbody");
        var ntrer = ntable.children("tr");
        var  isHide=$('input[name=isHidepp]:checked').val();
        $.each(ntrer,function(i,eleName){// 遍历tr
            var goodcodeinputsign= $(eleName).find(".policyGgwbm").val();
            var planId= $(eleName).find("#planId").val();
            var imageName= $(eleName).find("input[name=iconListppimageName]").val();
            var startTimepp= $(eleName).find("#startTimepp").val();
            var endTimepp= $(eleName).find("#endTimepp").val();
            var j=i+1;
            var jumpAddress="";
            var popUpButtoniop="";
            msgNumMap.set(j,goodcodeinputsign);
            msgPlanMap.set(j,planId);
            if(!goodcodeinputsign){
                alert("请输入第"+j+"行广告编码！");
                flag=false ;
            }
            if(startTimepp==""||startTimepp==undefined||startTimepp==null){
                alert("请输入第"+j+"行有效期的初始时间！");
                flag= false;
            }
            if(endTimepp==""||endTimepp==undefined||endTimepp==null){
                alert("请输入第"+j+"行有效期的结束时间！");
                flag= false;
            }
            if((new Date(startTimepp.replace(/-/g,"/")).getTime() > new Date(endTimepp.replace(/-/g,"/")).getTime())){
                alert("第"+j+"行开始时间不能晚于结束时间！");
                flag= false;
            }
            if(imageName==""||imageName==undefined||imageName==null){
                alert("请上传第"+j+"行图片！");
                flag= false;
            }
            if(planId==""||planId==undefined||planId==null){
                alert("请输入第"+j+"行标签id！");
                flag= false;
            }
            if(!flag){
                return ;
            }
        });
        //策略跟广告编码重复判断
        msgNumMap.forEach(function (v,k) {
            var ckCount = 0;
            msgNumMap.forEach(function (innv,innk) {
                if(innv==v){
                    ckCount ++;
                }
            });
            if(ckCount>1){
                msglineMap.set(k,k);
            }
        });
        msgPlanMap.forEach(function (v,k) {
            var ckCount = 0;
            msgPlanMap.forEach(function (innv,innk) {
                if(innv==v){
                    ckCount ++;
                }
            });
            if(ckCount>1){
                msglineMap.set(k,k);
            }
        });
        if(msglineMap.size>0){
            msglineMap.forEach(function (v,k) {
                lineNum+=v+",";
            });
            if(lineNum.length>0 && lineNum.indexOf(",")>-1){
                lineNum = lineNum.substring(0,lineNum.length-1);
            }
            tsMsg = tsMsg.replace("lineNums",lineNum.toString());
            alert(tsMsg);
            flag=false;
        }

        if(!roomType){//非房间类型
            if(isHide==""||isHide==undefined||isHide==null){
                alert("请选择是否隐藏楼层！");
                flag= false;
            }
        }
        if(!flag){
            return ;
        }
        console.log( $('#bqlc').serialize());
        jQuery.ajax({
            url: vm.path+"/tWlmDecorate/savepolicyBatchpp.do?v="+(new Date()).getTime(),// url
            type: "POST",// 方法类型
            data: $('#bqlc').serialize(),
            dataType:'json',
            success:function(data){
                if(data.flag==true){
                    toast("保存成功");// 改成小黑窗
                    var policy;
                    var policyListbuwei;
                    jQuery.ajax({
                        url:vm.path + "/tWlmDecorate/querypolicyBq.do?id="+vm.id+"&roomId="+roomid,
                        type: "POST",// 方法类型
                        dataType:'json',
                        async:false,
                        success:function(data){
                            if(data.flag==true){
                                vm.isHide=data.isHide;
                                policy=data.policyList;
                                policyListbuwei= data.policyListbuwei;
                            }
                        },
                        // 调用出错执行的函数
                        error: function(){
                            alert("操作异常");
                        }
                    });
                    var tianzhi="";
                    var ispop="";
                    for(var int=0;int<policy.length;int++){
                        var xuhao=int+1;
                        var address=policy[int][5];
                        var popUpButtoniop=policy[int][21];
                        var policyGgwbm=policy[int][23];
                        if(!policyGgwbm){
                            policyGgwbm = "";
                        }
                        if(address==null||address==''||address==undefined){
                            address="";
                        }
                        if(popUpButtoniop=="0"){
                            ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
                        }else{
                            ispop="<input type='radio' name='popUpButtoniop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtoniop"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
                        }
                        var addrname = policy[int][22];
                        if(addrname == null){
                            addrname = "";
                        }
                        tianzhi+="<tr class='clxqq' id='policybq"+int+"'>" +
                            " <td><input type='checkbox' value="+policy[int][0]+" name='ioppp'></td> " +
                            "<td id='xuhaoCount'>"+xuhao+"</td> <td>" +
                            "<div> <dl> <dt>广告编码:</dt> <dd> <input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div>"+
                            "<div> <dl> <dt>标签ID:</dt> <dd> <input type='hidden' name='policyId' id='policyId' value="+policy[int][0]+"> <input type='text' placeholder='请输入标签ID' name='planId' id='planId' value="+policy[int][3]+" onkeyup=\"value=value.replace(/[\u4e00-\u9fa5]/ig,'')\"> <span style='display: inline-block; text-align:left;width:100%;'>注：输入ID请用英文,分隔 </span></dd></dl></div>"+
                            "<div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='iconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='iconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='iconListpp"+int+"opacityP' onclick="+"deleteImg('iconListpp"+int+"')>删除图片</p><input type='hidden' name='iconListppimageName' id='iconListpp"+int+"imageName' value="+policy[int][4]+"><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='iconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>"+
                            "<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告' name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'  >选择广告/聚合页</span>	<input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;' value='" +addrname+ "'></dd>	</dl></div>"+
                            "<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                            "<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTimepp' name='startTimepp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTimepp' name='endTimepp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div></td>"+
                            "<td><a href='javascript:;' class='submitted saven' onclick='savePolicyFunBq("+int+")'>保存</a></td></tr>"
                    }
                    var tianzhi2=tbody+tianzhi+"</tbody>";
                    $('#htmlConCspzBq table').html('').prepend(tianzhi2);

                }
            },
            // 调用出错执行的函数
            /* error: function(){
                 alert("操作异常");
             } */
        });

    }else{
        var tsMsg = "广告编码出现重复现象，具体行数为lineNums，请检查后重新填写！";
        var lineNum = "";//重复行
        msgNumMap = new Map();
        msglineMap = new Map();
        var flag=true;
        $("#policyTypebq2").val(policyType);
        $("#floorTypebq2").val(floorType);
        $("#decorater_roomidbq2").val(roomid);
        $("#decorateIdbq2").val(vm.id);
        var ntable = $("#htmlConCspz2Bq .cont_box table tbody");
        var ntr = ntable.children("tr");
        $.each(ntr,function(i,eleName){// 遍历tr
            var j=i+1;
            var goodcodeinputsign= $(eleName).find(".policyGgwbm").val();
            if(!goodcodeinputsign){
                alert("请输入第"+j+"行广告编码！");
                flag=false ;
            }
            var imageName= $(eleName).find("input[name=buweiiconListppimageName]").val();
            var displayWeights= $(eleName).find("#displayWeights").val();
            var startTimepp= $(eleName).find("#startTime1pp").val();
            var endTimepp= $(eleName).find("#endTime1pp").val();
            if(displayWeights==""||displayWeights==undefined||displayWeights==null){
                alert("请输入第"+j+"行权重！");
                flag=false ;
            }else{
                var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
                if(!reg.test(displayWeights)) {
                    alert("第"+j+"行权重值请输入0-100的整数！");
                    flag=false ;
                }
            }
            msgNumMap.set(j,goodcodeinputsign);
            if(startTimepp==""||startTimepp==undefined||startTimepp==null){
                alert("请输入第"+j+"行有效期的初始时间！");
                flag=false ;
            }
            if(endTimepp==""||endTimepp==undefined||endTimepp==null){
                alert("请输入第"+j+"行有效期的结束时间！");
                flag=false ;
            }
            if((new Date(startTimepp.replace(/-/g,"/")).getTime() > new Date(endTimepp.replace(/-/g,"/")).getTime())){
                alert("第"+j+"行开始时间不能晚于结束时间！");
                flag=false ;
            }
            if(imageName==""||imageName==undefined||imageName==null){
                alert("请上传第"+j+"行图片！");
                flag=false ;
            }
            if(!flag){
                return ;
            }
        });
        //策略跟广告编码重复判断
        msgNumMap.forEach(function (v,k) {
            var ckCount = 0;
            msgNumMap.forEach(function (innv,innk) {
                if(innv==v){
                    ckCount ++;
                }
            });
            if(ckCount>1){
                msglineMap.set(k,k);
            }
        });
        if(msglineMap.size>0){
            msglineMap.forEach(function (v,k) {
                lineNum+=v+",";
            });
            if(lineNum.length>0 && lineNum.indexOf(",")>-1){
                lineNum = lineNum.substring(0,lineNum.length-1);
            }
            tsMsg = tsMsg.replace("lineNums",lineNum.toString());
            alert(tsMsg);
            flag=false;
        }
        if(!flag){
            return ;
        }
        jQuery.ajax({
            url: vm.path+"/tWlmDecorate/savepolicyBatchppbuwei.do",// url
            type: "POST",// 方法类型
            data: $('#bqlc2').serialize(),
            dataType:'json',
            success:function(data){
                if(data.flag==true){
                    toast("保存成功");// 改成小黑窗
                    var policyListbuwei;
                    jQuery.ajax({
                        url:vm.path + "/tWlmDecorate/querypolicyBq.do?id="+vm.id+"&roomId="+roomid,
                        type: "POST",// 方法类型
                        dataType:'json',
                        async:false,
                        success:function(data){
                            if(data.flag==true){
                                vm.isHide=data.isHide;
                                policy=data.policyList;
                                policyListbuwei= data.policyListbuwei;
                            }
                        },
                        // 调用出错执行的函数
                        error: function(){
                            alert("操作异常");
                        }
                    });
                    var tianzhi="";
                    var ispop="";
                    var policy=policyListbuwei;
                    for(var int=0;int<policy.length;int++){
                        var xuhao=int+1;
                        var address=policy[int][5];
                        var popUpButtoniop=policy[int][21];
                        var policyGgwbm=policy[int][23];
                        if(!policyGgwbm){
                            policyGgwbm = "";
                        }
                        if(address==null||address==''||address==undefined){
                            address="";
                        }
                        if(popUpButtoniop=="0"){
                            ispop="<input type='radio' name='popUpButtonLbiop"+int+"'  class='rin' value='0' checked='checked'/><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiop"+int+"' class='rin' value='1'/><label for='ifyc2' class='rlb'  >新页面</label>";
                        }else{
                            ispop="<input type='radio' name='popUpButtonLbiop"+int+"'  class='rin' value='0' /><label for='ifyc1' class='rlb'  >父页面</label><input type='radio' name='popUpButtonLbiop"+int+"' class='rin' value='1' checked='checked'/><label for='ifyc2' class='rlb'  >新页面</label>";
                        }
                        var addrname = policy[int][22];
                        if(addrname == null){
                            addrname = "";
                        }
                        tianzhi+="<tr class='clxqq'  id='policybuweibq"+int+"'><td><input type='checkbox' value="+policy[int][0]+" name='buweipp'></td>" +

                            "<td>"+xuhao+"</td><td><div> <dl> <dt>广告编码:</dt> <dd><input type='text' class='policyGgwbm' name='policyGgwbm' value="+policyGgwbm+" ></dd></dl></div><div><dl><dt>图片:</dt><dd><div class='uploadImg normalData'><img src='../../images/images.png' alt='' class='buweiiconListpp"+int+"imagesZw'><img src='"+vm.path+"/"+policy[int][4]+"' alt=''  class='buweiiconListpp"+int+"imgPerview' ><p class='opacityP j-deleteImg'  id='buweiiconListpp"+int+"opacityP' onclick="+"deleteImg('buweiiconListpp"+int+"')>删除图片</p><input type='hidden' name='policyId' id='buweipolicyId' value="+policy[int][0]+"><input type='hidden' name='buweiiconListppimageName' value="+policy[int][4]+" id='buweiiconListpp"+int+"imageName'><input type='file' class='imgInput' onchange='upLoadImgChannel(this,0,0,2)' name='UploadBtn' id='buweiiconListpp"+int+"'></div><span>注：建议上传350*350像素，大小不超过100k，格式为jpg，png的图片。</span></dd></dl></div>" +
                            "<div><dl><dt>跳转地址:</dt><dd><input type='hidden' name='jumpType' id='peizhijumpType' value="+policy[int][18]+"><input type='text' class='jhinp' placeholder='请输入跳转地址或选择跳转广告'  name='jumpAddress' id='jumpAddress' value="+address+"><span class='jhsp ad' id='jhsp"+int+"'>选择广告/聚合页</span><input type='text' readonly='readonly' name='jumpAddressStr' class='jumpAddressStrReadOnly' style='margin-left: 5px; width: 80px; float: right;border: none;'value="+addrname+"></dd></dl></div>" +
                            "<div  ><dl><dt>页面展示:</dt><dd class='yxsjdd'>"+ispop+"</dd>	</dl></div>" +
                            "<div><dl><dt>展示权重:</dt><dd><input type='text' placeholder='请输入所占权重1~100，数值越大排位越靠前' name='displayWeights' id='displayWeights' value="+policy[int][6]+"></dd></dl></div>" +
                            "<div><dl><dt>有效时间:</dt><dd class='yxsjdd'><input id='startTime1pp' name='startTime1pp' readonly='readonly' class='Wdate w150'  onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][7]+"> ~ <input id='endTime1pp' name='endTime1pp' readonly='readonly' class='Wdate w150' onclick="+"WdatePicker({dateFmt:'yyyy-MM-dd'})"+" value="+policy[int][8]+"></dd></dl></div>	</td>" +
                            "<td><a href='javascript:;' class='submitted saven1' onclick='savePolicyFunbuweiBq("+int+")'>保存</a></td>							</tr>											"
                    }
                    var tianzhi2=tbody+tianzhi+"</tbody>";
                    $('#htmlConCspz2Bq table').html('').prepend(tianzhi2);
                }else if (data.code='1'){
                    toast(decodeURIComponent(data.msg));
                }
            },
            // 调用出错执行的函数
            /*error: function(){
                alert("操作异常");
            } */
        });
    }
    if(roomType){//房间类型
        $("#"+roomid).find("a").attr('goodCodeInput',goodcodeinputsign);
        $("#"+roomid).find("a").attr('goodcodeinputsign','goodcodeinputsign')
    }
}


$('.cspzedit-layer').on('click','.iop-edit1bq .alldel',function(e){
    var xzcd = $("#htmlConCspzBq .cont_box").find("table tbody").children("tr");
    var xzin = $("#htmlConCspzBq .cont_box").find("table tbody").children("tr").children("td:first-child").children("input:checked");// 遍历tr
    var ii=0;
    var obj=document.getElementsByName('ioppp');
    var ids="";
    for(var i=0; i<obj.length; i++){
        if(obj[i].checked){
            if(i < obj.length){
                ids+=obj[i].value+',';
            }
        }
    }
    if(ids!=null&&ids!=""&&ids!=undefined){
        ids = ids.substring(0,ids.length-1);
        $.ajax({
            type : "post",
            url : vm.path+"/tWlmDecorate/deletePolicy.do",
            data :{"ids":ids},
            dataType:'json',
            success : function(data) {
                if(data.flag==true){
                    toast("删除成功");// 改成小黑窗
                }else{
                    toast("网络故障");// 改成小黑窗
                }

            }
        });
    }

    $.each(xzin,function(i,eleName){// 遍历选中的个数删除
        var deldata = $(this).parents("tr");// 获取选中input
        ii++;
        $(deldata).remove();

    });



    if(xzcd.length == ii){// 遍历tr总个数与删除的个数相同说明已全部删除
        console.log("全部删除");
        if($("input[name='tjiop']:checked").val() ==='2') {
            showJtIop(1);
        }else{
            $("#htmlConCspzBq .cont_box").find("table tbody").append(jxtjData1);
        }
    } else{
        console.log("没有全部删除");
    }

});

$('.cspzedit-layer').on('click','.iop-editbwbq .alldel',function(e){
    var xzcd = $("#htmlConCspz2Bq .cont_box").find("table tbody").children("tr");
    var xzin = $("#htmlConCspz2Bq .cont_box").find("table tbody").children("tr").children("td:first-child").children("input:checked");// 遍历tr
    var ii=0;

    var obj=document.getElementsByName('buweipp');
    var ids="";
    for(var i=0; i<obj.length; i++){
        if(obj[i].checked){
            if(i < obj.length){
                ids+=obj[i].value+',';
            }
        }
    }
    if(ids!=null&&ids!=""&&ids!=undefined){
        ids = ids.substring(0,ids.length-1);
        $.ajax({
            type : "post",
            url : vm.path+"/tWlmDecorate/deletePolicy.do",
            data :{"ids":ids},
            dataType:'json',
            success : function(data) {
                if(data.flag==true){
                    toast("删除成功");// 改成小黑窗
                }else{
                    toast("网络故障");// 改成小黑窗
                }

            }
        });
    }

    $.each(xzin,function(i,eleName){// 遍历选中的个数删除
        var deldata = $(this).parents("tr");// 获取选中input
        ii++;
        $(deldata).remove();

    });

    if(xzcd.length == ii){// 遍历tr总个数与删除的个数相同说明已全部删除
        console.log("全部删除");
        $("#htmlConCspz2Bq .cont_box").find("table tbody").append(jxtjData2);
    } else{
        console.log("没有全部删除");
    }
});
