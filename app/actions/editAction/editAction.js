function EditAction(parentView){
    _.superClass(EditAction, this, parentView);
}

_.inherit(EditAction, BaseEditAction);


_.extend(EditAction.prototype, {
    setSelectedItem: function(){
        var editDataSource = this.getProperty('editDataSource'),
            destinationDataSource = this.getProperty('destinationDataSource'),
            destinationProperty = this.getProperty('destinationProperty');

        var selectedItem = destinationDataSource.getProperty(destinationProperty);

        if( selectedItem == null ){

            // if selectedItem is empty and it is must be document
            // return error
            if( this._isDocumentPath(destinationProperty) ){
                var logger = window.InfinniUI.global.logger;
                var message = stringUtils.format('EditAction: edit item has not been found. {0} does not have item by path "{1}"', [destinationDataSource.getName(), destinationProperty]);
                logger.error(message);

                return false;
            }

            // but if selectedItem is property of document
            // it will be created
            selectedItem = selectedItem || {};
        }

        if( this._isObjectDataSource(editDataSource) ) {
            this._setItem(editDataSource, selectedItem);
        } else {
            this._setDocument(editDataSource, selectedItem);
        }

        return true;
    },

    _resumeUpdateEditDataSource: function () {
        var editDataSource = this.getProperty('editDataSource');
        editDataSource.resumeUpdate('BaseEditAction');
    },

    _setDocument: function (editDataSource, selectedItem){
        var selectedItemId = editDataSource.idOfItem( selectedItem );
        editDataSource.setIdFilter(selectedItemId);
        editDataSource.tryInitData();
        this._resumeUpdateEditDataSource();
    },

    _setItem: function(editDataSource, selectedItem){
        var item = _.clone( selectedItem );

        if(item === undefined || item === null){
            item = {};
        }
        this._resumeUpdateEditDataSource();
        editDataSource.setItems( [item] );
        editDataSource.setSelectedItem( item );
    },

    save: function(){
        var editDataSource = this.getProperty('editDataSource'),
            destinationDataSource = this.getProperty('destinationDataSource'),
            destinationProperty = this.getProperty('destinationProperty');

        if( this._isObjectDataSource(editDataSource) ) {
            var item = editDataSource.getSelectedItem();
            destinationDataSource.setProperty(destinationProperty, item);
        } else {
            destinationDataSource.updateItems();
        }
    },

    _isDocumentPath: function(path){
        return !path.includes('.');
    }
});