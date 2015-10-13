function EditActionBuilder() {
    this.build = function (context, args) {
        var action = new BaseAction(args.view);

        action.setAction(function (callback) {
            var parentDataSource = args.view.getDataSource(args.metadata.DataSource),
                editItem, idProperty, editItemId;

            if(args.itemId){
                editItemId = args.itemId;
            }else{
                editItem = parentDataSource.getSelectedItem();

                if(!editItem){
                    new MessageBox({
                        type: 'error',
                        text:'Не выбран объект для редактирования.',
                        buttons:[
                            {
                                name:'Закрыть'
                            }
                        ]
                    });
                    return;
                }

                idProperty = parentDataSource.getIdProperty();
                editItemId = InfinniUI.ObjectUtils.getPropertyValue(editItem, idProperty);
            }

            var linkView = args.builder.build(args.view, args.metadata.View);
            linkView.createView(function (editView) {
                var editDataSource = _.find(editView.getDataSources(), function (ds) {
                    return isMainDataSource(ds);
                });

                editDataSource.suspendUpdate();
                editDataSource.setEditMode();
                editDataSource.setIdFilter(editItemId);

                editView.onClosed(function (closeResult) {
                    parentDataSource.updateItems();

                    if (callback && closeResult == dialogResult.accept) {

                        callback(editItemId);
                    }
                });

                editView.open();
            });
        });

        return action;
    };
}


/*
function BaseActionBuilder(){

}

_.extend(BaseActionBuilder.prototype, {
    build: function(context, args){
        var that = this,
            action = function(){
                that.executingAction(args);
            };

        return action;
    },

    executingAction: function(params){
        var metadata = params.metadata;
        var parentView = params.parentView;
        var builder = params.builder;
        var editingItemId;

        if('itemId' in params){
            editingItemId = params.itemId;
        }else{
            var dataSource = parentView.getContext().dataSources[metadata.DataSource];
            var editItem = dataSource.getSelectedItem();
            editingItemId = dataSource.idOfItem(editItem);
        }


        var linkView = builder.build(metadata['LinkView'], {parentView: parentView});

        linkView.createView(function(createdView){

        });
    }
});*/