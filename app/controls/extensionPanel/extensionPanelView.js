﻿var ExtensionPanelView = ContainerView.extend({
    className: 'pl-extension-panel',

    initialize: function () {
        ContainerView.prototype.initialize.apply(this);
        this.extensionObject = null;
    },

    render: function () {
        this.prerenderingActions();

        if (!this.extensionObject) {
            this.initExtensionObject();
        }

        this.extensionObject.render();

        this.updateProperties();
        this.trigger('render');

        this.postrenderingActions();
        //devblockstart
        window.InfinniUI.global.messageBus.send('render', {element: this});
        //devblockstop
        return this;
    },

    updateGrouping: function(){

    },

    initExtensionObject: function () {
        var extensionName = this.model.get('extensionName'),
            context = this.model.get('context'),
            itemTemplate = this.model.get('itemTemplate'),
            parameters = this.model.get('parameters'),
            items = this.model.get('items'),
            builder = this.model.get('builder');

        this.extensionObject = new window[extensionName](context, {$el: this.$el, parameters: parameters, itemTemplate: itemTemplate, items: items, builder: builder});
    }
});
