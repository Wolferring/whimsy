var search = {
	keys:{},
	values:{},//存储搜索值
	current:-1,//当前选中的li
	init:function(){
		var dom = document.querySelectorAll('.search-group');
		for (var i=0;i<dom.length;i++){
			var list = dom[i].querySelectorAll("select option")
			var inputNode = document.createElement('input');
			inputNode.type = "text";
			inputNode.className = "search-input";
			var resultNode = document.createElement('ul');
			resultNode.className = "result-list";
			dom[i].appendChild(inputNode)
			dom[i].appendChild(resultNode)

			dom[i].setAttribute('data-id',"search"+i )
			search.values["search"+i] = [];
			search.keys["search"+i] = [];
			for(var j = 0;j<list.length;j++){
				search.values["search"+i].push(list[j].textContent)
				search.keys["search"+i].push(list[j].value)
			}
		}//通过dom，将搜索内容按不同的搜索框分组写入search.values
		this.listnerBinder();
	},//初始化
	listnerBinder:function(){
		var inputTimer;//输入延时器
		var input = document.querySelectorAll('.search-input');
		for(var i = 0;i<input.length;i++){
			input[i].addEventListener('input', function(e){
				clearTimeout(inputTimer);
				var value = this.value;
				var that = this;
				// if (value=="") {search.clear(this.parentNode);return false;}
				inputTimer = setTimeout(function(){
					search.find(value,that.parentNode)
				},200);
			});//绑定输入事件
			input[i].addEventListener('keyup', function(e){
				e.preventDefault()
				var result = this.parentNode.querySelectorAll('.result-list li');
				var e = e||window.event;
				if (e.keyCode == 40) {
					e.preventDefault()
					search.removeClass(result[search.current==-1?0:search.current],"active")
					search.current+=1;
					search.addClass(result[search.current<result.length?search.current:0],"active")
					if (search.current==result.length) {search.current=0}
				}//键盘方向键下事件
				if (e.keyCode == 38) {
					e.preventDefault();
					search.removeClass(result[search.current==-1?0:search.current],"active");
					search.current-=1;
					if (search.current<0) {search.current=result.length-1}
					search.addClass(result[search.current],"active")
				}//键盘方向键上事件
				if(e.keyCode==13){
					var selected = this.parentNode.querySelector('.result-list .active')
					if (selected) {
						search.set(selected.getAttribute('data-value'),selected.textContent,this.parentNode)
					}
				}//回车事件
				if (e.keyCode==27) {
					this.blur()
					search.clear(this.parentNode)
				}//ESC事件
			});
			input[i].addEventListener('blur', function(){
				search.current = -1;
				var dom = this.parentNode;
				var result = search.values[dom.getAttribute('data-id')];
				var val = this.value;
				var flag = false;
				for (var i = 0; i < result.length; i++) {
					if(result[i]==val){
						flag = true;
					};

				}
				if (!flag) {
					dom.querySelector('.search-input').value = "";
					dom.querySelector('select').value = "";
				}
				setTimeout(function(){
					search.clear(dom);
				},300)
				
			})//失去焦点清空结果
			input[i].addEventListener('focus', function(){
				if (this.value!="") {return false;}
				search.find("",this.parentNode)
			})//获得焦点显示所有结果
		}
		document.querySelector('body').addEventListener('click',function(e){
			var e = e||window.event;
			//IE没有e.target，有e.srcElement
			var target = e.target||e.srcElement;
			//判断事件目标是否是td，是的话target即为目标节点td
			if(target.tagName.toLowerCase()=="li"&&search.hasClass(target.parentNode,"result-list")){
			    search.set(target.getAttribute('data-value'),target.textContent,e.target.parentNode.parentNode)
			}
		})

	},
	find:function(input,which){
		var input = String(input)||"";
		var id = which.getAttribute('data-id');
		var val = search.values[id];
		var key = search.keys[id]
		var dom = which.querySelector('.result-list');
		var str = "";
		for(var i = 0;i<val.length;i++){
			if (val[i].indexOf(input)>-1) {
				str+='<li class="result-item" data-value='+key[i]+'>'+val[i]+'</li>'
			}
		}
		dom.innerHTML = str;
		dom.style.display = "block";
		if (str.length<=0) {
		dom.style.display = "none";

		}
	},
	clear:function(which){
		which.querySelector('.result-list').style.display = "none";
	},
	set:function(key,val,which){
		which.querySelector('.search-input').value = val;
		var select = which.querySelector('select');
	 	for(var i=0; i<select.options.length; i++){  
	        if(select.options[i].value == key){  
	            select.options[i].selected = true;  
	            break;  
	        }  
	    }  
		this.clear(which)
		search.current = -1;
	},
	hasClass:function(obj,cls){
	    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	},
	addClass:function(obj,cls){
		if (!this.hasClass(obj, cls)) obj.className += " " + cls; 
	},
	removeClass:function(obj,cls){
		if (this.hasClass(obj, cls)) {  
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
        obj.className = obj.className.replace(reg, ' ');  
    }  
	//三个必要方法，判断有无class，增加移除class  
	}
}//单例模式