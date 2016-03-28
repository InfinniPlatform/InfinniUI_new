/**
 *
 * @constructor
 */
function DataGridColumnBuilder () {


}

_.extend(DataGridColumnBuilder.prototype, displayFormatBuilderMixin);

/**
 *
 * @param {DataGrid} element
 * @param {Object} metadata метаданные колонки грида
 * @param {Object} params
 * @returns {DataGridColumn}
 */
DataGridColumnBuilder.prototype.build = function (element, metadata, params) {
    var column = new DataGridColumn();


    this
        .buildHeader(column, metadata, params)
        .buildHeaderTemplate(column, metadata, params)
        .buildCellTemplate(column, metadata, params)
        .buildWidth(column, metadata);

    return column;
};

DataGridColumnBuilder.prototype.buildWidth = function (column, metadata) {
    var width = metadata.Width;

    if (width !== null && typeof width !== 'undefined') {
        column.setWidth(width);
    }

    return this;
};

/**
 * @protected
 * @param {DataGridColumn} column
 * @param {Object} metadata
 * @param {Object} params
 * @returns {DataGridColumnBuilder}
 */
DataGridColumnBuilder.prototype.buildHeader = function (column, metadata, params) {

    if (metadata.Header && typeof metadata.Header === 'object') {
        //Header указывает на DataBinding
        var
            builder = params.builder,
            binding = builder.buildType('PropertyBinding', metadata.Header, {
                parent: params.element,
                parentView: params.parentView,
                basePathOfProperty: params.basePathOfProperty
            });

        binding.bindElement(column, 'header');
    } else {
        //Header содержит значение для шаблона
        column.setHeader(metadata.Header);
    }
    return this;
};

/**
 * @protected
 * @param {DataGridColumn} column
 * @param {Object} metadata
 * @param {Object} params
 * @returns {DataGridColumnBuilder}
 */
DataGridColumnBuilder.prototype.buildCellTemplate = function (column, metadata, params) {
    var cellTemplate;

    if ('CellTemplate' in metadata) {
        cellTemplate = this.buildCellTemplateByTemplate(params, metadata.CellTemplate);
    } else if ('CellFormat' in metadata) {
        cellTemplate = this.buildCellTemplateByFormat(params, metadata.CellFormat);
    } else if ('CellSelector' in metadata) {
        cellTemplate = this.buildCellTemplateBySelector(params, metadata.CellSelector);
    } else {
        var cellProperty = 'CellProperty' in metadata ? metadata.CellProperty : '';
        cellTemplate = this.buildCellTemplateByDefault(params, cellProperty);
    }
    column.setCellTemplate(cellTemplate);
    return this;
};

DataGridColumnBuilder.prototype.buildCellTemplateByTemplate = function (params, cellTemplateMetadata) {
    var dataGrid = params.element;
    var builder = params.builder;
    var basePathOfProperty = params.basePathOfProperty || new BasePathOfProperty('');

    return function (itemsBinding) {
        return function  (context, args) {
            var index = args.index;
            var argumentForBuilder = {
                parent: dataGrid,
                parentView: params.parentView
            };
            argumentForBuilder.basePathOfProperty = basePathOfProperty.buildChild('', index);

            return builder.build(cellTemplateMetadata, argumentForBuilder);
        }

    };
};

DataGridColumnBuilder.prototype.buildCellTemplateByFormat = function (params, cellFormatMetadata) {
    var column = params.element,
        grid = column.parent,
        format = this.buildDisplayFormat(cellFormatMetadata, params);

    return function  (itemsBinding) {
        return function (context, args) {
            var index = args.index;
            var label = new Label(this);

            var sourceProperty = itemsBinding.getSourceProperty();
            var source = itemsBinding.getSource();
            var binding = new DataBinding(this);

            sourceProperty = index.toString();
            if (itemsBinding.getSourceProperty() != '') {
                sourceProperty = itemsBinding.getSourceProperty() + '.' + sourceProperty;
            }

            label.setDisplayFormat(format);

            binding.bindSource(source, sourceProperty);
            binding.bindElement(label, 'value');

            return label;
        };
    };

};

DataGridColumnBuilder.prototype.buildCellTemplateBySelector = function (params, cellSelectorMetadata) {
    var column = params.element,
        grid = column.parent;

    return function  () {
        return function (context, args) {
            var label = new Label(this);
            var scriptExecutor = new ScriptExecutor(grid.getScriptsStorage());
            var value = scriptExecutor.executeScript(cellSelectorMetadata.Name || cellSelectorMetadata, {
                value: args.item
            });

            label.setText(value);
            return label;
        };
    };
};

DataGridColumnBuilder.prototype.buildCellTemplateByDefault = function (params, cellProperty) {
    var column = params.element,
        grid = column.parent;

    return function  (itemsBinding) {

        return function (context, args) {
            var index = args.index;
            var label = new Label(grid);


            var sourceProperty;
            var source = itemsBinding.getSource();
            var binding = new DataBinding(this);

            sourceProperty = index.toString();
            if (itemsBinding.getSourceProperty() != '') {
                sourceProperty = itemsBinding.getSourceProperty() + '.' + sourceProperty;
            }

            if (cellProperty != '') {
                sourceProperty = sourceProperty + '.' + cellProperty;
            }

            binding.bindSource(source, sourceProperty);
            binding.bindElement(label, 'value');

            return label;
        }
    }

};

/**
 * @protected
 * @param {DataGridColumn} column
 * @param {Object} metadata
 * @param {Object} params
 * @returns {DataGridColumnBuilder}
 */
DataGridColumnBuilder.prototype.buildCellSelector = function (column, metadata, params) {

    var cellSelector;

    if (metadata.CellSelector) {
        cellSelector = function (context, args) {
            var scriptExecutor = new ScriptExecutor(params.parent);
            return scriptExecutor.executeScript(metadata.CellSelector.Name || metadata.CellSelector, args)
        };
    } else if (metadata.CellProperty) {
        var propertyName = metadata.CellProperty;
        cellSelector = function (value) {
            return InfinniUI.ObjectUtils.getPropertyValue(value, propertyName);
        }
    } else {
        cellSelector = function (value) {
            return value;
        }
    }

    column.setCellSelector(cellSelector);
    return this;
};

/**
 * @protected
 * @param {DataGridColumn} column
 * @param {Object} metadata
 * @param {Object} params
 * @returns {DataGridColumnBuilder}
 */
DataGridColumnBuilder.prototype.buildHeaderTemplate = function (column, metadata, params) {
    var
        headerTemplate,
        headerTemplateMetadata = metadata.HeaderTemplate;

    if (typeof headerTemplateMetadata === 'undefined' || _.isEmpty(headerTemplateMetadata)) {
        headerTemplate = this.buildHeaderTemplateByDefault(params);
    } else {
        headerTemplate = this.buildHeaderTemplateByMetadata(headerTemplateMetadata, params);
    }

    column.setHeaderTemplate(headerTemplate);

    return this;
};

/**
 * @protected
 * @param {Object} headerTemplateMetadata
 * @param {Object} params
 * @returns {Function}
 */
DataGridColumnBuilder.prototype.buildHeaderTemplateByMetadata = function (headerTemplateMetadata, params) {
    var element = params.element;
    var builder = params.builder;

    return function(context, args) {
        var argumentForBuilder = {
            parent: element,
            parentView: params.parentView
        };

        return builder.build(headerTemplateMetadata, argumentForBuilder);
    };
};

/**
 * @protected
 * @param {Object} params
 * @returns {Function}
 */
DataGridColumnBuilder.prototype.buildHeaderTemplateByDefault = function (params) {

    return function (context, args) {
        var label = new Label(this);
        label.setText(args.value);
        return label;
    };

};
