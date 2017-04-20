function AddAction( parentView ) {
    _.superClass( AddAction, this, parentView );
}

_.inherit( AddAction, BaseEditAction );


_.extend( AddAction.prototype, {
    setSelectedItem: function() {
        var editDataSource = this.getProperty( 'editDataSource' ),
            editView = editDataSource.getView();

        editView.onBeforeLoaded( function() {
            editDataSource.createItem();
        } );

        return true;
    },

    save: function() {
        var editDataSource = this.getProperty( 'editDataSource' ),
            destinationDataSource = this.getProperty( 'destinationDataSource' ),
            destinationProperty = this.getProperty( 'destinationProperty' ) || '';

        if( !destinationDataSource ) {
            return;
        }

        if( this._isObjectDataSource( editDataSource ) ) {
            var newItem = editDataSource.getSelectedItem();

            if( this._isRootElementPath( destinationProperty ) ) {
                destinationDataSource._includeItemToModifiedSet( newItem );
                destinationDataSource.saveItem( newItem, function() {
                    destinationDataSource.updateItems();
                } );
            } else {
                var items = destinationDataSource.getProperty( destinationProperty ) || [];

                items = _.clone( items );
                items.push( newItem );

                destinationDataSource.setProperty( destinationProperty, items );
            }
        } else {
            destinationDataSource.updateItems();
        }
    }
} );

window.InfinniUI.AddAction = AddAction;
