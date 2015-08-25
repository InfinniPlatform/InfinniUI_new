/**
 * Билдер DateTimeEditMask
 * @constructor
 */
function DateTimeEditMaskBuilder () {
    this.build = function (context, args) {

        var editMask = new DateTimeEditMask();
        var culture = new Culture(InfinniUI.config.lang);
        var mask;

        if (typeof InfinniUI.localizations[culture.name].patternDateFormats[args.metadata.Mask] !== 'undefined') {
            mask = InfinniUI.localizations[culture.name].patternDateFormats[args.metadata.Mask];
        } else {
            mask = args.metadata.Mask;
        }

        editMask.mask = mask;

        editMask.format = args.builder.buildType(args.view, 'DateTimeFormat', {Format: args.metadata.Mask});

        return editMask;
    }
}