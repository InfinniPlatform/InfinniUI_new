function OpenActionBuilder() {
}


_.extend( OpenActionBuilder.prototype,
    BaseActionBuilderMixin,
    {
        build: function( context, args ) {
            var action = new OpenAction( args.parentView );

            this.applyBaseActionMetadata( action, args );

            var linkView = args.builder.build( args.metadata.LinkView, { parent: args.parent, parentView: args.parentView, basePathOfProperty: args.basePathOfProperty } );
            action.setProperty( 'linkView', linkView );

            return action;
        }
    }
);

window.InfinniUI.OpenActionBuilder = OpenActionBuilder;
