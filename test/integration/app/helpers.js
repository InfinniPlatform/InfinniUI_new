window.testHelpers = {

	DEFAULT_VALUES: {
		maxTimeout: 10000,
		timeoutStep: 10
	},

	waitCondition: function(condition, success, error, maxTimeout, step){
		maxTimeout = maxTimeout || window.testHelpers.DEFAULT_VALUES.maxTimeout;
		step = step || window.testHelpers.DEFAULT_VALUES.timeoutStep;
		var i = 1;

		var waiting = function(){
			if( condition() ){
				if($.isFunction(success)){
					success();
				}				

				return;
			}

			if( i * step >= maxTimeout ){
				if($.isFunction(error)){
					error();
				} else {
					debugger;
				}

				return;
			}
			
			++i;
			setTimeout(waiting, step);
		}
		
		setTimeout(waiting, step);
	},

	waitView: function(viewName, success, error, maxTimeout, step){
		var waitView = function(){
			if(!window.configWindow.contextApp)
				return false;
			var view = window.configWindow.contextApp.getChildView(viewName);
			return view && view.isLoaded();
		};

		window.testHelpers.waitCondition(waitView, success, error, maxTimeout, step);
	},

	waitModalView: function(viewName, success, error, maxTimeout, step){
		var waitView = function(){
			var view = window.currentView.getChildView(viewName) || window.configWindow.contextApp.getChildView(viewName);
			return view && view.isLoaded();
		};

		window.testHelpers.waitCondition(waitView, success, error, maxTimeout, step);
	},

	getCurrentDate: function(){
		var today = new Date();
		//YYYY-MM-DD
        var currentDate = String.prototype.concat(today.getFullYear(), '-', today.getMonth() + 1, '-', today.getDate()); //+1 - January-0
        return window.configWindow.moment(currentDate).toISOString();
	},
	
	getControlByName: function(controlName){
		var indexInfo = /\[(\d+)\]/.exec(controlName);
		
		if(indexInfo == null){
			return window.currentViewContext.Controls[controlName];
		}else{
			var itemIndex = parseInt(indexInfo[1]);
			var itemName = controlName.match(/\w+/)[0];
			
			if(window.currentListBox == undefined || itemIndex.toString() == "NaN" || window.currentListBox.children.get(itemIndex) == undefined){
				return undefined;
			}
			
			var gridPanel = window.currentListBox.children.get(itemIndex);
			var result = gridPanel.children.findAllChildrenByName(itemName)[0];
			
			window.currentListBox.setSelectedItem(window.currentListBox.getItems()[itemIndex]);
					
			return result;
		}
	}
};