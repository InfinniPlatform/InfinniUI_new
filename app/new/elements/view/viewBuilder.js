/**
 * @constructor
 * @augments ViewBuilder
 */
function ViewBuilder() {
    _.superClass(StackPanelBuilder, this);
}

_.inherit(ViewBuilder, ContainerBuilder);

_.extend(ViewBuilder.prototype, {
    createElement: function (params) {
        return new View();
    },

    applyMetadata: function (params) {
        ElementBuilder.prototype.applyMetadata.call(this, params);

        var
            metadata = params.metadata,
            element = params.element,
            builder = params.builder;

        var scripts = element.getScripts();
        var parameters = element.getParameters();

        element.setIcon(metadata.Icon);

        if (metadata.Scripts) {
            for (var i = 0, len = metadata.Scripts.length; i < len; ++i) {
                var scriptMetadata = metadata.Scripts[i];

                var script = {
                    name: scriptMetadata.Name,
                    func: builder.buildType('Script', scriptMetadata, {parentView: element})
                };

                scripts.add(script);
            }
        }

        if (metadata.Parameters) {
            for (var i = 0, len = metadata.Parameters.length; i < len; ++i) {
                var param = builder.buildType('Parameter', metadata.Parameters[i], {parentView: element});
                parameters.add(param);
            }
        }

        if (metadata.DataSources) {
            var dataSources = builder.buildMany(metadata.DataSources, {parentView: element});

            element.getDataSources()
                .addAll(dataSources);
        }

        if(metadata.OnOpening){
            element.onOpening(function() {
                new ScriptExecutor(element).executeScript(metadata.OnOpening);
            });
        }

        if(metadata.OnOpened){
            element.onOpened(function() {
                new ScriptExecutor(element).executeScript(metadata.OnOpened);
            });
        }

        if(metadata.OnClosing){
            element.onClosing(function() {
                new ScriptExecutor(element).executeScript(metadata.OnClosing);
            });
        }

        if(metadata.OnClosed){
            element.onClosed(function() {
                new ScriptExecutor(element).executeScript(metadata.OnClosed);
            });
        }
    }
});