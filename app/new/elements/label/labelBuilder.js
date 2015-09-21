function LabelBuilder() {
    _.superClass(TextEditorBaseBuilder, this);
    this.initialize_editorBaseBuilder();
}

_.inherit(LabelBuilder, ElementBuilder);

_.extend(LabelBuilder.prototype, {

    applyMetadata: function(params){
        var element = params.element;
        ElementBuilder.prototype.applyMetadata.call(this, params);
        this.applyMetadata_editorBaseBuilder(params);

        element.setLineCount(params.metadata.LineCount);
        element.setTextWrapping(params.metadata.TextWrapping);
        this.initDisplayFormat(params);
        this.initScriptsHandlers(params);
        //this.initHorizontalTextAlignmentProperty(params);
        //this.initForeground(params);
        //this.initBackground(params);
        //this.initTextStyle(params);

    },

    initDisplayFormat: function (params) {
        var metadata = params.metadata;
        var element = params.element;
        var displayFormat;

        if (metadata.DisplayFormat) {
            var format = params.builder.buildType('ObjectFormat', {});
            displayFormat = function (context, args) {
                args = args || {};
                return format.format(args.value);
            }
        } else {
            displayFormat = function (context, args) {
                args = args || {};
                return args.value;
            }
        }
        element.setDisplayFormat(displayFormat);
    },

    initScriptsHandlers: function(params){
        var metadata = params.metadata;

        //Скриптовые обработчики на события
        if (params.view && metadata.OnLoaded){
            params.element.onLoaded(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnLoaded.Name);
            });
        }

        if (params.view && metadata.OnValueChanged){
            params.element.onValueChanged(function() {
                new ScriptExecutor(params.view).executeScript(metadata.OnValueChanged.Name);
            });
        }
    },

    createElement: function(params){
        var label = new Label(params.view);
        label.getHeight = function () {
            return 34;
        };
        return label;
    }

},
    editorBaseBuilderMixin
    //builderHorizontalTextAlignmentPropertyMixin,
    //builderBackgroundMixin,
    //builderForegroundMixin,
    //builderTextStyleMixin
);