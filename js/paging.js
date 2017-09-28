;(function($){

	function getPageList(currentPage,totalPage){
		var pageList = new Array();
		if(totalPage<=5){
			for(var i = 0;i < totalPage; i++){
				pageList[i] = i+1;
			}
		}else{
			if(currentPage <= 2){
				for(var i = 0;i < 5;i++){
					pageList[i] = i + 1;
				}
			}
			else if(currentPage > totalPage-2){
				for(var i = 0;i < 5;i++){
					pageList[i] = totalPage - 4 + i;
				}
			}
			else{
				for(var i = 0;i<5;i++){
					pageList[i] = currentPage - 2 + i;
				}
			}
		}
		return pageList;
	}

	function getPageHtml(idNum,totalPage,pageList){

		var strHtml = ""
			strHtml += "<ul id='page-ul-"+idNum+"' class='page-ul'>";
			strHtml += "<li class='font-page' id='font-page-"+idNum+"' data-page-num='1'><span>首页</span></li>";
			strHtml += "<li class='forward-page' id='forward-page-"+idNum+"'><span>&lt;</span></li>";
		for(var i = 0;i<pageList.length;i++){
			strHtml += "<li class='page-"+pageList[i]+"'><span>"+pageList[i]+"</span></li>";
		}
			strHtml += "<li class='backward-page' id='backward-page-"+idNum+"'><span>&gt;</span></li>";
		    strHtml += "<li class='last-page' id='last-page-"+idNum+"' data-page-num="+totalPage+"><span>尾页</span></li>";
		    strHtml += "";
		    strHtml += "</ul></div>";
		return strHtml;
	}

	function setPage($this,idNum,currentPage,totalPage){
		var forward_page_disable = null,
			backward_page_disable = null;

		$this.empty();
		var list = getPageList(currentPage,totalPage);
		$this.append(getPageHtml(idNum,totalPage,list));
		
		$this.find(".page-"+currentPage).addClass("active");
		$this.find(".page-record").text(currentPage+"/"+totalPage);

		currentPage == 1 ? forward_page_disable = true : forward_page_disable = false ;
		currentPage == totalPage ? backward_page_disable = true : backward_page_disable = false;
		if(forward_page_disable){
			$("#forward-page-"+idNum).addClass("disable");
		}else{
			$("#forward-page-"+idNum).removeClass("disable");
		}
		if(backward_page_disable){
			$("#backward-page-"+idNum).addClass("disable");
		}else{
			$("#backward-page-"+idNum).removeClass("disable");
		}

		function setHash(hash,id,p){
			if(hash == ''){
				window.location.hash = "#id="+id+"&page="+p;
			}else{
				var hashList = hash.split("#");
				var hash_ = '';
				for(var i = 1;i<hashList.length;i++){
					var id_ = hashList[i].split("&")[0].split("=")[1];
					if(id == id_){
						hash_ = "#"+hashList[i];
					}
				}
				if(hash_!=''){
					hash = hash.replace(hash_,"#id="+id+"&page="+p);
				}else{
					hash += "#id="+id+"&page="+p;
				}
				window.location.hash = hash;
			}
		}

		setHash(window.location.hash,$this.attr("id"),currentPage);
	
	}

	$.fn.initPaging = function(opt){
		var id = new Date().getTime();
		var optDeafault = {
			idNum: id,
			totalPage: 10,
			currentPage: 1,
			pageResides: false,
			func: function($div_content,currentPage,idNum){
				console.log('默认函数');
				console.log("三个参数,第一个是分页组件的父容器，第二个是当前页数，第三个是组件的idNum");
				console.log("分页idNum为 "+idNum+" 的父容器是：<br>")
				console.log($div_content);
				console.log("分页idNum为 "+idNum+" 的当前页数是："+currentPage);
				console.log("-------------------------------------------------------------");
			}
		};
		var op = $.extend(optDeafault,opt);
		if(op.pageResides){
			var hash = window.location.hash;
		
			if(hash == '' ){
				setPage($(this),op.idNum,op.currentPage,op.totalPage);
			}else{
				var hashList = hash.split("#");
				var currentPage = op.currentPage;
				
				for(var i = 1;i<hashList.length;i++){
					var id_ = hashList[i].split("&")[0].split("=")[1];
					if($(this).attr("id") == id_){
						currentPage = hashList[i].split("&")[1].split("=")[1];
						break;
					}
				}

				setPage($(this),op.idNum,currentPage,op.totalPage);
			}
		}else{
			setPage($(this),op.idNum,op.currentPage,op.totalPage);
		}
		
		$(this).after("<div style='display:none'>"+op.func+"</div>");
		
		return $(this);
	}


	$(window.document).on("click",".page-ul>li:not(.jump-page,.page-record)",function(){
		if($(this).attr('class').indexOf("disable") >= 0){
			return;
		}
		else{
			var div_content = $(this).parent().parent();
			var text = $(this).text().trim();
			var idNum = $(this).parent().attr("id").split("-")[2];

			if(text == '首页'){
				currentPage = 1;
			}
			else if(text == '尾页'){
				currentPage = parseInt($(this).attr("data-page-num"));
			}
			else if(text == '<'){
				currentPage = parseInt(div_content.find(".active").text().trim())-1;
			}
			else if(text == '>'){
				currentPage = parseInt(div_content.find(".active").text().trim())+1;
			}
			else{
				currentPage = parseInt(text);
			}
			var totalPage = parseInt($("#page-totalpage-"+idNum+" span").text().trim());
			
			setPage(div_content,idNum,currentPage,totalPage);
			
			var s = div_content.next().text();
			var f = new Function("return "+s);
			f()(div_content,currentPage,idNum);
		}

	});

	$(window.document).on("click",".jump-page a",function(){

		var text = parseInt($(this).prev().val().trim());
		var div_content = $(this).parents(".page-ul").parent();
		var totalPage = div_content.find(".page-totalpage span").text();
	
		if( text>0 && text<= totalPage){
			var idNum = div_content.find(".page-totalpage").attr("id").split("-")[2];
			var currentPage = text;
			setPage(div_content,idNum,currentPage,totalPage);
			
			div_content.find('.page-text').val(currentPage);
			
			var s = div_content.next().text();
			var f = new Function("return "+s);
			f()(div_content,currentPage,idNum);
		}
	});

	$(window.document).on("keydown",".page-text",function(e){
		if(e.keyCode == 13){
			$(this).next().trigger("click");
		}
		
	})

})(jQuery)