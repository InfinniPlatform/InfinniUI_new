/**
 * @constructor
 * @augments ElementBuilder
 * @mixes editorBaseBuilderMixin
 */
function PasswordBoxBuilder() {
    _.superClass( PasswordBoxBuilder, this );
    this.initialize_editorBaseBuilder();
}

InfinniUI.PasswordBoxBuilder = PasswordBoxBuilder;

_.inherit( PasswordBoxBuilder, ElementBuilder );

_.extend( PasswordBoxBuilder.prototype, {

    applyMetadata: function( params ) {
        ElementBuilder.prototype.applyMetadata.call( this, params );
        this.applyMetadata_editorBaseBuilder( params );

        var metadata = params.metadata;
        var element = params.element;

        this.initBindingToProperty( params, 'LabelText' );
        this.resolveExpressionInText( params, 'LabelText' );
        element.setAutocomplete( metadata.Autocomplete );
    },

    createElement: function( params ) {
        var element = new PasswordBox( params.parent );
        return element;
    }

}, editorBaseBuilderMixin );
