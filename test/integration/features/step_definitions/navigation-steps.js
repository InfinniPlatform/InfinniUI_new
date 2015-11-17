
// When

this.When(/^я нажму на кнопку "([^"]*)"$/, function (buttonName, next) {
    try {
        window.currentViewContext.Controls[buttonName].click();
        next();
    } catch (err) {
        next(err);
    }
});

this.When(/^я нажму на ссылку "([^"]*)"$/, function (linkName, next) {
	var haveLink = function(){
		return window.currentViewContext.Controls[linkName] != undefined;
	}
	
	var success = function(){
		try{
			var link = window.currentViewContext.Controls[linkName];
			link.click();
			next();
		}catch(err){
			next(err);
		}
	}
	
	var fail = function(){
		next(new Error(linkName + " not found!"));
	}
	
	window.testHelpers.waitCondition(haveLink, success, fail);
});

this.When(/^я нажму на ссылку "([^"]*)" в списке "([^"]*)"$/, function (linkName, listBoxName, next) {
	var haveLink = function(){
		return 	window.currentViewContext.Controls[linkName] != undefined &&
				window.currentViewContext.Controls[listBoxName] != undefined;
	}
	
	var success = function(){
		try{
			var listBox = window.currentViewContext.Controls[listBoxName]; 
			var link = window.currentViewContext.Controls[linkName];
			var items = listBox.getItems();
			
			if(items.length != 0){
				var obj = null;
				
				items.forEach(function(item){
					if(item.Name == link.getValue()){
						obj = item;
					}
				});
				
				if(obj != null){
					listBox.setSelectedItem(obj);
					link.click();
					next();
				}else{
					next(new Error(linkName + " not found!"));
				}
				
			}else{
				next(new Error("Empty listbox '" + listBoxName + "'"));
			}
		}catch(err){
			next(err);
		}
	}
	
	var fail = function(){
		var errorString = (window.currentViewContext.Controls[linkName] == undefined ? linkName : listBoxName) + " not found!";
		next(new Error(errorString));
	}
	
	window.testHelpers.waitCondition(haveLink, success, fail);
});

this.When(/^я нажму на выпадающий список кнопок "([^"]*)"$/, function (buttonName, next) {
    try {
        var buttonSelector = "[data-pl-name=\"{buttonName}\"] .pl-popup-btn-toggle".replace("{buttonName}", buttonName);
        window.configWindow.$(buttonSelector).click();
        next();
    } catch (err) {
        next(err);
    }
});

this.When(/^я нажму на выпадающий список "([^"]*)"$/, function (buttonName, next) {
    try {
        var buttonSelector = "[data-pl-name=\"{buttonName}\"] .select2-chosen".replace("{buttonName}", buttonName);
        window.configWindow.$(buttonSelector).mousedown(); //click() не срабатывает
        setTimeout(next, 100); //TODO: Найти аналог (элементы списка подгружаются после раскрытия)
    } catch (err) {
        next(err);
    }
});

this.When(/^я выберу пункт "([^"]*)"$/, function (value, next) {
    var selector = ".select2-results > li .select2-result-label:contains('{VALUE}')".replace("{VALUE}", value);
    window.configWindow.$(selector).mousedown().mouseup(); //TODO: Это бред конечно, но пока click() не работает
    setTimeout(next, 3000);
});