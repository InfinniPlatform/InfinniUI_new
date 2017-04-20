/**
 * @description Билдер BooleanFormat
 * @class BooleanFormatBuilder
 */
function BooleanFormatBuilder() {
    /**
     * @description Создает и инициализирует экземпляр {@link BooleanFormat}
     * @memberOf BooleanFormatBuilder
     * @instance
     * @param context
     * @param args
     * @returns {BooleanFormat}
     */

    this.build = function( context, args ) {
        var format = new BooleanFormat();

        format.setFalseText( args.metadata.FalseText );
        format.setTrueText( args.metadata.TrueText );

        return format;
    };
}

window.InfinniUI.BooleanFormatBuilder = BooleanFormatBuilder;
