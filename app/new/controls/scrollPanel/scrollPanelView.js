/**
 * @class
 * @augments ControlView
 */
var ScrollPanelView = ContainerView.extend(/** @lends ScrollPanelView.prototype */ {

    className: 'pl-scrollpanel panel panel-default',

    template: InfinniUI.Template["new/controls/scrollPanel/template/scrollPanel.tpl.html"],

    UI: {

    },

    initialize: function (options) {
        ContainerView.prototype.initialize.call(this, options);
    },

    render: function () {
        this.prerenderingActions();

        this.removeChildElements();
        console.log(this.model.get('items'));
        this.$el.html(this.template({
            items: this.model.get('items')
        }));
        this.renderItemsContents();

        this.bindUIElements();

        this.postrenderingActions();

        this.trigger('render');
        this.updateProperties();
        return this;
    },

    initHandlersForProperties: function () {
        ContainerView.prototype.initHandlersForProperties.call(this);
        this.listenTo(this.model, 'change:horizontalScroll', this.updateHorizontalScroll);
        this.listenTo(this.model, 'change:verticalScroll', this.updateVerticalScroll);
    },

    updateProperties: function () {
        ContainerView.prototype.updateProperties.call(this);
        this.updateHorizontalScroll();
        this.updateVerticalScroll();
    },

    updateHorizontalScroll: function () {
        var name = '';
        switch (this.model.get('horizontalScroll')) {
            case ScrollVisibility.visible:
                name = 'visible';
                break;
            case ScrollVisibility.hidden:
                name = 'hidden';
                break;
            case ScrollVisibility.auto:
            default:
                name = 'auto';
                break;
        }
        this.switchClass('pl-horizontal-scroll', name, this.$el);
    },

    updateVerticalScroll: function (model, value) {
        var name = '';
        switch (this.model.get('verticalScroll')) {
            case ScrollVisibility.visible:
                name = 'visible';
                break;
            case ScrollVisibility.hidden:
                name = 'hidden';
                break;
            case ScrollVisibility.auto:
            default:
                name = 'auto';
                break;
        }
        this.switchClass('pl-vertical-scroll', name, this.$el);
    },

    renderItemsContents: function () {
        var $items = this.$el.find('.pl-scrollpanel-i'),
            items = this.model.get('items'),
            itemTemplate = this.model.get('itemTemplate'),
            that = this,
            element, item;

        $items.each(function (i, el) {
            item = items.getByIndex(i);
            element = itemTemplate(undefined, {item: item, index: i});
            that.addChildElement(element);
            $(el)
                .append(element.render());
        });
    },
    //
    //initOrientation: function () {
    //    this.listenTo(this.model, 'change:orientation', this.updateOrientation);
    //    this.updateOrientation();
    //},

    //updateOrientation: function () {
    //    var orientation = this.model.get('orientation');
    //    this.$el.toggleClass('horizontal-orientation', orientation == 'Horizontal');
    //},

    updateGrouping: function () {

    }

});
