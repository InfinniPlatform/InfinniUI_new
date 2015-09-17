function ListBox(parentView) {
    _.superClass(ListBox, this, parentView);
}

_.inherit(ListBox, Element);

_.extend(ListBox.prototype, {

    createControl: function () {
        return new ListBoxControl();
    },

    getMultiSelect: function () {
        return this.control.get('multiSelect');
    },

    setMultiSelect: function (value) {
        this.control.set('multiSelect', value);
    },

    getValueProperty: function () {
        return this.control.get('valueProperty');
    },

    setValueProperty: function (value) {
        this.control.set('valueProperty', value);
    },

    getDisplayProperty: function () {
        return this.control.get('displayProperty');
    },

    setDisplayProperty: function (value) {
        this.control.set('displayProperty', value);
    },

    getItemFormat: function () {
        return this.control.get('itemFormat');
    },

    setItemFormat: function (value) {
        return this.control.get('itemFormat');
    },

    addItem: function (item) {

    },

    removeItem: function (item) {

    },

    getItems: function () {
        return this.control.get('items');
    },

    setItems: function (value) {
        this.control.set('items', value);
    },

    getReadOnly: function () {
        return this.control.get('readOnly');
    },

    setReadOnly: function (value) {
        this.control.set('readOnly', value);
    },

    onDoubleClick: function () {

    },

    setSelectedItem: function (value) {
        this.control.set('selectedItem', value);
    },

    getSelectedItem: function () {
        return this.control.get('selectedItem');
    },

    onChangeSelectedItem: function (handler) {
        this.control.onChangeSelectedItem(handler);
    },

    setValueSelector: function (value) {
        return this.control.set('valueSelector', value);
    },

    getValueSelector: function () {
        return this.control.get('valueSelector');
    },

    setItemTemplate: function (value) {
        return this.control.set('itemTemplate', value);
    },

    getItemTemplate: function () {
        return this.control.get('itemTemplate');
    },

    setCollapsible: function (value) {
        this.control.set('collapsible', value);
    },

    setCollapsed: function (value) {
        this.control.set('collapsed', value);
    },

    setGroupTemplate: function (value) {
        this.control.set('groupTemplate', value);
    }

}, valuePropertyMixin);