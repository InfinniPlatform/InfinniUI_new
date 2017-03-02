function TooltipBuilder() {
    _.superClass( TooltipBuilder, this );
}

InfinniUI.TooltipBuilder = TooltipBuilder;

_.inherit( TooltipBuilder, ElementBuilder );

_.extend( TooltipBuilder.prototype, {

    createElement: function( params ) {
        return new InfinniUI.Tooltip();
    },

    normalizeMetadata: function( metadata ) {
        if( typeof metadata === 'string' ) {
            metadata = {
                Text: metadata
            }
        }

        return metadata;
    },

    applyMetadata: function( params ) {
        var tooltip = params.element;

        params.metadata = this.normalizeMetadata( params.metadata );

        ElementBuilder.prototype.applyMetadata.call( this, params );
        tooltip.setContent( this.buildContent( params.metadata, params ) );

        var exchange = InfinniUI.global.messageBus;

        exchange.send(messageTypes.onToolTipInit, {element: params.parent, content: tooltip});
        params.parent.onRemove(function () {
            exchange.send(messageTypes.onToolTipDestroy, {element: params.parent});
        });

    },

    buildContent: function( metadata, params ) {
        var builder = params.builder;
        var builderParams = {
            parent: params.element,
            parentView: params.parentView,
            basePathOfProperty: params.basePathOfProperty
        };
        var content;

        if( 'Text' in metadata ) {
            content = this.buildTextContent( metadata[ 'Text' ], builder, builderParams );
        } else {
            content = this.buildElementContent( metadata, builder, builderParams );
        }

        return content;
    },

    /**
     * @protected
     * @param text
     * @param builder
     * @param builderParams
     * @return {*}
     */
    buildTextContent: function( text, builder, builderParams ) {
        return builder.buildType( "Label", {
            "Text": text
        }, builderParams )
    },

    /**
     * @protected
     * @param metadata
     * @param builder
     * @param builderParams
     */
    buildElementContent: function( metadata, builder, builderParams ) {
        return builder.build( metadata, builderParams );
    }

} );