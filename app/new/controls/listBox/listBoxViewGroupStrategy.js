function ListBoxViewGroupStrategy(listbox) {
    this.listbox = listbox;
};

_.extend(ListBoxViewGroupStrategy.prototype, {

    prepareItemsForRendering: function(){
        var items = this.listbox.getItems(),
            inputName = 'listbox-' + guid(),
            result = {
                isMultiselect: this.listbox.isMultiselect(),
                inputName: inputName,
                groups: []
            },
            groups = {},
            groupingFunction = this.listbox.getGroupValueSelector();

        items.forEach(function(item, index){
            var groupKey = groupingFunction(undefined, {value:item});

            if(! (groupKey in groups)){
                groups[groupKey] = [];
            }

            groups[groupKey].push(item);
        });

        for(var k in groups){
            result.groups.push({
                items: groups[k]
            })
        }

        return result;
    },

    getTemplate: function(){
        return this.listbox.template.grouped;
    },

    appendItemsContent: function(preparedItems){
        var $listbox = this.listbox.$el,
            $listboxItems = $listbox.find('.pl-listbox-body'),
            itemTemplate = this.listbox.getItemTemplate(),
            groupTitleTemplate = this.listbox.getGroupItemTemplate(),
            index = 0,
            groups = preparedItems.groups,
            itemEl, titleEl;

        $listbox.find('.pl-listbox-group-title').each(function(i, el){
            titleEl = groupTitleTemplate(undefined, {index: index, item: groups[i]});
            $(el).append(titleEl.render());

            _.forEach( groups[i].items, function(item){
                itemEl = itemTemplate(undefined, {index: i, item: item});
                $listboxItems.eq(index).append(itemEl.render());

                index++;
            });

        });
    },

    updateValue: function(ignoreWasRendered){
        var listbox = this.listbox;

        if(!listbox.wasRendered && ignoreWasRendered != true){
            return;
        }

        listbox.ui.items.removeClass('pl-listbox-i-chosen');
        listbox.ui.checkingInputs.prop('checked', false);

        var value = listbox.model.get('value'),
            indexOfChoosingItem; // = ;

        if($.isArray(value)){
            for(var i= 0, ii=value.length; i < ii; i++){
                indexOfChoosingItem = listbox.model.itemIndexByValue(value[i]);
                if(indexOfChoosingItem != -1){
                    listbox.ui.items.eq(indexOfChoosingItem).addClass('pl-listbox-i-chosen');
                    listbox.ui.checkingInputs.eq(indexOfChoosingItem).prop('checked', true);
                }
            }
        }
    }
});