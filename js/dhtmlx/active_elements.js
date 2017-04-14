(function(){
	// search nested form control
	for (var a in window.dhtmlXForm.prototype.items) {
		window.dhtmlXForm.prototype.items[a].getNode = function(item){return item;};
	}
	window.dhtmlXForm.prototype.getNode = function(name, value){
		if (value != null) name = [name,value]
		return this.doWithItem(name,"getNode");
	};






	var selectNodeInDesigner = function(ev, name){
		var event = ev;

		if(event.skip){//instead of stopPropagation & cancelBubble, to make default components handlers work
			return;
		}
		event.skip = true;
		
		var target = event.target || event.srcElement;
		if(window.activeControlsAgent.elements[name].type == "grid" && target.nodeName.toLowerCase() == "td"){
			window.activeControlsAgent.selectInDesigner(name, target._cellIndex);
			window.activeControlsAgent.select(name, target._cellIndex);
		}else{
			window.activeControlsAgent.selectInDesigner(name);
			window.activeControlsAgent.select(name);
		}


	};
	window.activeControlsAgent = {
		supported_controls:{
			layout	:true,
			main_layout:true,
			accordion:true,
			grid	:true,
			form	:true,
			chart	:true,
			data_view:true,
			menu	:true,
			scheduler:true,
			toolbar	:true,
			status	:true,
			tabbar	:true,
			sidebar	:true,
			sidebar_item: true,
			sidebar_separator: true,
			carousel: true,
			carousel_item: true,
			tree	:true,
			win	:true,
			cell	:true,
			panel	:true,
			footer_line:true,
			header_line:true,

			ajax_content:true,
			iframe:true,
			menuitem:true ,
			menuitem_separator:true ,
			tab:true,
			button_text:true,
			button_separator:true,
			button_select:true,
			button_input:true,
			button_2state:true,
			button_normal:true,

			form_fieldset:true,
			form_template:true,
			form_checkbox:true,
			form_radio:true,
			form_input:true,
			form_select:true,
			form_password:true,
			form_label:true,
			form_file:true,
			form_button:true,
			form_btn2state:true,
			form_multiselect:true,
			form_block:true,
			form_calendar:true,
			form_combo:true,
			form_editor:true,
			form_colorpicker:true,
			form_upload:true,
			form_container:true,
			
			ribbon : true,
			ribbon_tab : true,
			ribbon_block : true,
			
			ribbon_button : true,
			ribbon_buttonTwoState : true,
			ribbon_buttonSegment : true,
			ribbon_buttonSelect : true,
			ribbon_group : true,
			ribbon_input : true,
			ribbon_checkbox : true,
			ribbon_text : true,
			ribbon_buttonCombo : true,
			ribbon_slider : true
		},
		elements:{},
		selectInDesigner:function(name, index){
			window.parent.des.activeControls.skip = true;
			window.parent.des.activeControls.select(name, index);
			window.parent.des.activeControls.skip = false;
		},
		unselect:function(){
			if(this._highlighter){

				for(var i=0; i<this._highlighter.length; i++ ){
					this._highlighter[i].parentNode.removeChild(this._highlighter[i]);
				}
			}
			window.activeControlsAgent._selectedItem = null;
			this._highlighter = [];
		},
		getZIndex:function(node){
			var index=0;
			while(!index && node && node.parentNode){
				index = this._getZIndex(node);
				node = node.parentNode;
			}
			return index;
		},
		_getZIndex:function(node){
			var style , zIndex;
			if (node.currentStyle) {
				style = node.currentStyle;
			}
			else if (document.defaultView && document.defaultView.getComputedStyle) {
					style = document.defaultView.getComputedStyle(node,"");
			}
			if (style) {
				zIndex = style.zIndex*1;
			} else {
				zIndex = node.style.zIndex*1;
			}
			return zIndex;
		},
		select:function(name, columnIndex){
			var addContentSice = true;
			if(!this.elements[name])
				return;

			      /* get z-index*/
			var node = this.elements[name].obj;
			var zIndex = 5000;
			
			if(this.elements[name].type === "data_view") addContentSice = false;

			   /* get z-index*/
			if(node){
				var coordinate = this.getCoordinates(node, addContentSice);
				if(columnIndex !== undefined){//grid column
					var cell = node.getElementsByTagName("tr");
					var row = null;
					for(var i=0; i < cell.length; i++){
						var dat = cell[i].getElementsByTagName("td")
						if(dat.length){
							row = dat;
							break;
						}
					}
					if(row){
						if(row[columnIndex]){
							var tmp_coord = this.getCoordinates(row[columnIndex]);
							coordinate.x = tmp_coord.x;
							coordinate.width = tmp_coord.width;
						}
					}
				}


				this._attachHighlighters(coordinate, zIndex);
				window.activeControlsAgent._selectedItem ={name:name, index:columnIndex};
			}
		},
		_attachHighlighters:function(coord, zIndex){


			this.unselect();
			var cont = document.createElement("div");
			this._highlighter.push(cont);

			var items = this.createHighlighters(coord, zIndex);
				for(var i = 0; i < items.length; i++){
					//this._highlighter.push(items[i]);
					cont.appendChild(items[i]);
					//document.body.appendChild(items[i]);
			}
			document.body.appendChild(cont);
		},
		_attachControl:function(controlName, obj){
			var node  = (typeof obj.tagName === "string")? obj : this._getNodeFormControl(obj);
			dhtmlxEvent(node, "mousedown", function(event){selectNodeInDesigner(event, controlName);});
			dhtmlxEvent(node, "click", function(event){selectNodeInDesigner(event, controlName);});
			
			if (obj instanceof dhtmlXAccordion) {
				obj.attachEvent("onActive", function(id){
					var cell = this.cells(id);
					selectNodeInDesigner({target: cell.cell}, id);
				});
			}else if (obj instanceof  dhtmlXWindowsCell) {
				var collb = function(){
					var cont = this.cell.parentNode;
					selectNodeInDesigner({target: cont}, this._idd);
				};
				obj.attachEvent('onResizeFinish', collb);
				obj.attachEvent('onParkDown', collb);
				obj.attachEvent('onParkUp', collb);
				obj.attachEvent('onMoveFinish', collb);
				obj.attachEvent('onMaximize', collb);
				obj.attachEvent('onMinimize', collb);
			}else if (obj instanceof dhtmlXTabBar) {
				obj.attachEvent("onSelect", function(id){
					var cont = this.cells(id).cell;
					setTimeout(function(){selectNodeInDesigner({target: cont}, id);},1);
					return true;
				});
			}
		},

		_getNodeFormControl : function(controlNode){
			if (controlNode instanceof dhtmlXLayoutObject || controlNode instanceof dhtmlXAccordion || controlNode instanceof dhtmlXTabBar) {
				return controlNode.base;
			} else if (controlNode instanceof dhtmlXLayoutCell || controlNode instanceof dhtmlXAccordionCell || controlNode instanceof dhtmlXCarouselCell) {
				return controlNode.cell;
			} else if (controlNode instanceof dhtmlXTabBarCell) {
				return controlNode.tabbar.t[controlNode._idd].tab;
			} else if (controlNode instanceof dhtmlXWindowsCell) {
				return (controlNode.cell && controlNode.cell) ? controlNode.cell.parentNode : null;
			} else if (controlNode.allTree) {
				return controlNode.allTree;
			} else if (controlNode.tagName) {
				return controlNode;
			} else if (controlNode instanceof dhtmlXCellTop) {
				return controlNode.base;
			} else {
				debugger;
				return null;
			}
		},
		
		getConttainerNode : function(obj){
			if (obj instanceof dhtmlXLayoutCell
			|| obj instanceof dhtmlXAccordionCell) {
				return obj.cell.childNodes[1];
			}else{
				return null;
			}
		},

		attach:function(items){
			for(var i =0; i < items.length; i++){
				var contr = items[i];

				if(contr.type === "windows" && contr.object && contr.object._carcass){
					window.dhtmlxEvent(contr.object._carcass, "mouseup", function(event){
						if(window.activeControlsAgent._selectedItem){
							var item = window.activeControlsAgent._selectedItem;
							if(item !== null){
								window.setTimeout(function(){

									window.activeControlsAgent.unselect();
									window.activeControlsAgent.select(item.name, item.index);
								}, 10);
							}
						}
					});
				}
				if(this.supported_controls[ contr.type ] && contr.object){
					var obj = this._getContainer(this.supported_controls[contr.type], contr.object);
					this._attachControl(contr.name, obj);

					this.elements[contr.name] = {obj:obj, type:contr.type};
				}
			}
			(function(){
				var resInterval = false;
				window.dhtmlxEvent(window, "resize", function(){
					if(resInterval)
						window.clearTimeout(resInterval);
					resInterval = window.setTimeout(function(){
						var agent = window.activeControlsAgent;
						if(agent._selectedItem){
							agent.select(agent._selectedItem.name, agent._selectedItem.index);
						}
					},210);//dhtmlx redraws layout on resize after 200ms

				});
			})();
		},
		_getContainer:function(configObj, obj){
			if(!configObj){
				return null;
			}
			if(configObj === true)
				return obj;
		},
		_getElementLeft:function(el){
			return this._getElementOffset(el, "Left");
		},
		_getElementHeight:function(el){

			return this._getElementSize(el, "Height");
		},
		_getElementWidth:function(el){

			return this._getElementSize(el, "Width");
		},
		_getElementSize:function(el, dir){
			return el["offset" + dir];
		},
		_getElementOffset:function(el, dir){
			if(el.className == "item_absolute"){
				if(el.firstChild){
					if(el.firstChild["offset" + dir] < el.lastChild["offset" + dir] ||  el.lastChild.type == "hidden"){
						el = el.firstChild;
					}else{
						el = el.lastChild;
					}
				}
			}
			var pos = el["offset" + dir];
			var tempEl = el.offsetParent;
			while (!!tempEl) {
				pos += tempEl["offset" + dir];
				if(!isNaN(tempEl["scroll" + dir]))
					pos -= tempEl["scroll" + dir];
				tempEl = tempEl.offsetParent;
			}
			return pos;
		},
		_getElementTop:function(el){
			return this._getElementOffset(el, "Top");
		},
		getCoordinates:function(obj, addContentSice){
			return this._getAbsoluteFormItemCoolrdinates(obj, addContentSice);
		},
		_getPos:function(obj){
			var paddingTop = 0;
			if(obj && obj.className && obj.className.indexOf("dhxform_item_label") != -1){
				paddingTop = 4;// as defined in css :(
			}
			var pos = {
				x:this._getElementLeft(obj),
				y:this._getElementTop(obj) + paddingTop,
				width:this._getElementWidth(obj),
				height:this._getElementHeight(obj) - paddingTop
			};
			if(Math.abs(pos.width) - paddingTop > 0 && Math.abs(pos.height) - paddingTop > 0){
				return pos;
			}else{
				return null;
			}
		},
		
		getAbsoluteFormNodeCoolrdinates : function(node, addContentSice){
			addContentSice =  (addContentSice === false)? false : true;
			
			var answer = {
				x      : NaN,
				y      : NaN,
				width  : NaN,
				height : NaN
			};
			
			var limits = this._getLimitSize();
			
			var contentSize = (node && node.parentNode && addContentSice)
				? this._getContentSize(node.childNodes)
				: {x:NaN, y:NaN, width:NaN, height:NaN};
			
			if (node && node.parentNode) {
				answer.x = Math.max( dhx4.absLeft(node), limits.x ),
				answer.y = Math.max( dhx4.absTop(node), limits.y );
				
				answer.width = Math.min( this._max(node.offsetWidth, contentSize.width)-1, limits.width );
				answer.height = Math.min( this._max(node.offsetHeight, contentSize.height)-1, limits.height );
			}
			
			return answer;
		},
		
		_getContentSize : function(nodelist){
			var answer = { x:NaN, y:NaN, width:NaN, height:NaN };
			var chSize = { x:NaN, y:NaN, width:NaN, height:NaN };
			var i,n = nodelist.length, node=null;
			var x,y;
			
			for (i=0; i<n; i++){
				node = nodelist[i];
				chSize = this._getContentSize(node.childNodes);
				x = dhx4.absLeft(node);
				y = dhx4.absTop(node);
				answer.x = this._min(answer.x, x, chSize.x);
				answer.y = this._min(answer.y, y, chSize.y);
				answer.width = this._max(answer.width, (node.offsetWidth), chSize.width);
				answer.height = this._max(answer.height, (node.offsetHeight), chSize.height);
			}
			
			return answer;
		},
		
		_min : function(){
			var i, n = arguments.length;
			var ans = NaN, t=NaN;
			
			for(i=0; i<n; i++){
				t = arguments[i];
				if (isNaN(ans) && !isNaN(t)) {
					ans = t;
				}else if (!isNaN(ans) && !isNaN(t)) {
					ans = Math.min(ans,t);
				}
			};
			
			return ans;
		},
		
		_max : function(){
			var i, n = arguments.length;
			var ans = NaN, t=NaN;
			
			for(i=0; i<n; i++){
				t = arguments[i];
				if (isNaN(ans) && !isNaN(t)) {
					ans = t;
				}else if (!isNaN(ans) && !isNaN(t)) {
					ans = Math.max(ans,t);
				}
			};
			
			return ans;
		},
		
		_getLimitSize : function(){
			return {
				x : 1,
				y : 1,
				width : document.body.offsetWidth-3,
				height : document.body.offsetHeight-3
			};
		},
		
		_getAbsoluteFormItemCoolrdinates:function(obj, addContentSice){
			var node = this._getNodeFormControl(obj);
			return (node)? this.getAbsoluteFormNodeCoolrdinates(node, addContentSice) : this._getLimitSize();
		},

		createHighlighters:function(coordinates, zIndex){
			var line_weight = 1;
			var poss_correction = +1;

			var borders = [];

			for(var i=0; i < 4; i++){
				var hl = document.createElement("div");
				hl.className = "active_ev_highlighter";
				if(zIndex){
					hl.style.zIndex = zIndex*1 + 1;
				}
				borders.push(hl);
			}
			var hor = [0,2];
			for(var i = 0; i < hor.length; i++){

				borders[hor[i]].style.height = line_weight+ 'px';
				borders[hor[i]].style.width = coordinates.width + line_weight + poss_correction +'px';
			}
			borders[0].style.left = coordinates.x - poss_correction + 'px';
			borders[2].style.left = coordinates.x - poss_correction + 'px';

			borders[0].style.top =  coordinates.y - poss_correction  + 'px';
			borders[2].style.top =  coordinates.y + poss_correction + coordinates.height + 'px';

			var vert = [1,3];
			for(var i = 0; i < vert.length; i++){
				borders[vert[i]].style.height = coordinates.height + line_weight+ 2*poss_correction + 'px';
				borders[vert[i]].style.width = line_weight+ 'px';
			}
			borders[1].style.left =  coordinates.x - poss_correction  + 'px';
			borders[3].style.left =  coordinates.x + line_weight + coordinates.width + 'px';

			borders[1].style.top =  coordinates.y - poss_correction  + 'px';
			borders[3].style.top =  coordinates.y - poss_correction + 'px';



			return borders;
		}
	};


})();



function _deserializeItem(item, obj){
	if (item.parent) {
		switch(item.parent){
			case "layout":
			case "main_layout":
			case "accordion":
				item.object = obj.cells(item.local_name || item.name);
				break;
			case "carousel":
				item.object = obj.cells(item.local_name || item.name);
				break;
			case "sidebar":
				if (item.type == "sidebar_separator") {
					item.object = obj.s[item.local_name || item.name].sep;
				} else {
					item.object = obj.t[item.local_name || item.name].item;
				}
				break;
			case "tabbar":
				item.object = obj.cells(item.local_name || item.name);
				break;
			case "toolbar":
				for(var els in obj.objPull){
					if(endsWith(els, item.name)){
						item.object = obj.objPull[els].obj;
						break;
					}
				}
				break;

			case "menu":
				if (!obj) {
					item.object = undefined;
				}else{
					if(item.type == "menuitem_separator"){
						var prefix = "separator_"+obj.idPrefix;
					}else{
						var prefix = obj.idPrefix;
					}
					if(obj.idPull[prefix + item.name])
						item.object = obj.idPull[prefix + item.name];
				}
				break;
			case "form":
				if(item.type == "form_radio"){
					item.object = obj.getNode(item.group_name, item.value);
				}else{
					item.object = obj.getNode(item.name);
				}

				if(item.type == "form_button" && item.object){
					item.object = item.object.firstChild;
				}
				break;
			case "ribbon":
				var _item = obj._items[item.name];
				if (_item) {
					if (item.type === "ribbon_tab") {
						item.object = obj.tabs(item.name);
					}else item.object = _item.base;
				}
				break;
			}
	} else {
		switch (item.type){
			case "layout":
			case "main_layout":
			case "accordion":
				item.object = obj;
				break;
			case "menu":
				item.object = obj.base;
				break;
			case "form":
			case "toolbar":
				item.object = obj.cont;
				break;
			case "tabbar":
			case "carousel":
			case "sidebar":
				item.object = obj;
				break;
			case "grid":
				item.object = obj.entBox;
				break;
			case "chart":
			case "data_view":
				item.object = document.getElementById(obj.config.container);
				break;
			case "status":
				item.object = obj.firstChild;
				break;
			case "scheduler":
				item.object = obj._obj;
				break;
			case "tree":
				item.object = obj;
				break;
			case "ribbon":
				item.object = obj._base;
				break;
			default:
				item.object = obj;
				break;
		}
	}
	return item;
}


function endsWith(string, substring){
    return string.length >= substring.length && string.substr(string.length - substring.length) == substring;
}

