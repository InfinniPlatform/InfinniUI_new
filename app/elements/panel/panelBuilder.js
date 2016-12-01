/**
 * @constructor
 * @augments ContainerBuilder
 */
function PanelBuilder() {
    _.superClass(PanelBuilder, this);
}

window.InfinniUI.PanelBuilder = PanelBuilder;

_.inherit(PanelBuilder, ContainerBuilder);

_.extend(PanelBuilder.prototype, /** @lends PanelBuilder.prototype*/ {
    createElement: function (params) {
        return new Panel(params.parent);
    },

    /**
     * @param {Object} params
     * @param {Panel} params.element
     * @param {Object} params.metadata
     */
    applyMetadata: function (params) {
        var
            metadata = params.metadata,
            element = params.element;

        var data = ContainerBuilder.prototype.applyMetadata.call(this, params);

        element.setCollapsible(metadata.Collapsible);
        element.setCollapsed(metadata.Collapsed);
        element.setCollapseChanger(metadata.CollapseChanger);

        if (metadata.Header && typeof metadata.Header === 'object') {
            //Header указывает на DataBinding
            var
                builder = params.builder,
                binding = builder.buildType('PropertyBinding', metadata.Header, {
                    parent: element,
                    parentView: params.parentView,
                    basePathOfProperty: params.basePathOfProperty
                });

            binding.bindElement(element, 'header');
        } else {
            //Header содержит значение для шаблона
            element.setHeader(metadata.Header);
        }

        if(!metadata.Header && !metadata.HeaderTemplate) {
            element.setHeaderTemplate(null);
        } else {
            var headerTemplate = this.buildHeaderTemplate(metadata.HeaderTemplate, params);
            element.setHeaderTemplate(headerTemplate);
        }

        this.initEventHandler(params);

        return data;
    },

    /**
     * @protected
     * @param {Object} params
     */
    initEventHandler: function (params) {
        var
            metadata = params.metadata,
            element = params.element;

        if (metadata.OnExpanding) {
            element.onExpanding(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnExpanding.Name || metadata.OnExpanding, args);
            });
        }
        if (metadata.OnExpanded) {
            element.onExpanded(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnExpanded.Name || metadata.OnExpanded, args);
            });
        }
        if (metadata.OnCollapsing) {
            element.onCollapsing(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnCollapsing.Name || metadata.OnCollapsing, args);
            });
        }
        if (metadata.OnCollapsed) {
            element.onCollapsed(function (context, args) {
                return createScriptExecutor()
                    .executeScript(metadata.OnCollapsed.Name || metadata.OnCollapsed, args);
            });
        }

        function createScriptExecutor () {
            return new ScriptExecutor(params.parentView)
        }
    },

    /**
     * @protected
     * @param {Object} headerTemplateMetadata
     * @param {Object} params
     * @returns {Function}
     */
    buildHeaderTemplate: function (headerTemplateMetadata, params) {
        var headerTemplate;
        if (typeof headerTemplateMetadata === 'undefined' || _.isEmpty(headerTemplateMetadata)) {
            headerTemplate = this.buildDefaultHeaderTemplate(params);
        } else {
            headerTemplate = this.buildMetadataHeaderTemplate(headerTemplateMetadata, params);
        }

        return headerTemplate;
    },

    /**
     * @protected
     * @params {Object} params
     * @return {Function}
     */
    buildDefaultHeaderTemplate: function (params) {

        return function (context, args) {
            var label = new Label(this);
            label.setText(args.value);
            return label;
        }
    },

    /**
     * @protected
     * @param {Object} headerTemplateMetadata
     * @param {Object} params
     * @returns {Function}
     */
    buildMetadataHeaderTemplate: function (headerTemplateMetadata, params) {
        var element = params.element;
        var builder = params.builder;

        return function(context, args) {
            var argumentForBuilder = {
                parent: element,
                parentView: params.parentView,
                basePathOfProperty: params.basePathOfProperty
            };

            return builder.build(headerTemplateMetadata, argumentForBuilder);
        };
    }

});
