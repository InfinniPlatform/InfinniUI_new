function ListBoxControl( viewMode ) {
    _.superClass( ListBoxControl, this, viewMode );
}

_.inherit( ListBoxControl, ListEditorBaseControl );

_.extend( ListBoxControl.prototype, {

    createControlModel: function() {
        return new ListBoxModel();
    },

    createControlView: function( model, viewMode ) {
        if( !viewMode || ! viewMode in InfinniUI.viewModes.ListBox ) {
            viewMode = 'common';
        }

        var ViewClass = InfinniUI.viewModes.ListBox[ viewMode ];

        return new ViewClass( { model: model } );
    }

} );

InfinniUI.ListBoxControl = ListBoxControl;
