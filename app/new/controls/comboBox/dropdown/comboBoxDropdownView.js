var ComboBoxDropdownView = Backbone.View.extend({

    className: "pl-dropdown-container",
    events: {
        'click .backdrop': 'onClickBackdropHandler',
        //'keypress .pl-combobox-search-text': 'onKeyPressHandler',
        'keydown': 'onKeyDownHandler',
        'keyup .pl-combobox-filter-text': 'onKeyUpHandler'
    },

    UI: {
        items: '.pl-combobox-items',
        filter: '.pl-combobox-filter',
        text: '.pl-combobox-filter-text',
        noItems: '.pl-combobox-items-empty',
        search: '.pl-combobox-items-empty > span'
    },

    initialize: function () {
        var isGrouped = this.model.get('groupValueSelector') != null;

        if (isGrouped) {
            this.strategy = new ComboBoxGroupViewStrategy(this);
        } else {
            this.strategy = new ComboBoxPlainViewStrategy(this);
        }

        this.listenTo(this.model, 'change:dropdown', this.onChangeDropdownHandler);
        this.listenTo(this.model, 'change:search', this.onChangeSearchHandler);
        this.listenTo(this.model, 'change:autocomplete', this.updateAutocomplete);
        this.listenTo(this.model, 'change:selectedItem', this.onChangeSelectedItem);
        this.listenTo(this.strategy, 'click', this.onClickItemHandler);
        this.model.onValueChanged(this.onChangeValueHandler.bind(this));

        var items = this.model.get('items');

        var view = this;
        items.onChange(function () {
            view.renderItems();
        });
    },

    updateProperties: function () {
        this.updateAutocomplete();
    },

    render: function () {
        var template = this.strategy.getTemplate();
        this.$el.html(template({
            multiSelect: this.model.get('multiSelect')
        }));
        this.bindUIElements();
        this.updateProperties();
        this.renderItems();
        return this.$el;
    },

    renderItems: function () {
        var $items = this.strategy.renderItems();
        this.$items = $items;
        var items = this.model.get('items');

        var noItems = (items && items.length == 0);
        this.ui.noItems.toggleClass('hidden', !noItems);

        //this.markCheckedItems();
        this.markSelectedItems();
    },

    setItemsContent: function (content) {
        var $items = this.ui.items;
        $items.empty();
        $items.append(content);
    },

    close: function () {
        this.model.set('dropdown', false);
    },

    setSearchFocus: function () {
        this.ui.text.focus();
    },

    onClickBackdropHandler: function () {
        this.close();
    },

    onChangeValueHandler: function () {
        this.markCheckedItems();
    },

    markSelectedItems: function () {
        var model = this.model;
        if (!Array.isArray(this.$items)) {
            return;
        }

        var $items = this.$items;
        var selectedItem = model.getSelectedItem();

        $items.forEach(function ($item) {
            var selected = selectedItem === $item.data('pl-data-item');
            $item.toggleClass('pl-combobox-selected', selected);
        });
    },

    markCheckedItems: function () {
        var model = this.model;
        var value = model.getValue();

        if (!Array.isArray(this.$items)) {
            return;
        }

        var $items = this.$items;
        var isMultiSelect = !!model.get('multiSelect');
        var items = [];

        if (isMultiSelect && Array.isArray(value)) {
            items = value.map(function (val) {
                return model.itemByValue(val);
            });
        } else {
            items = [model.itemByValue(value)];
        }

        $items.forEach(function ($item) {
            var selected = items.indexOf($item.data('pl-data-item')) !== -1;
            $item.toggleClass('pl-combobox-selected', selected);
        });
    },

    onChangeDropdownHandler: function (model, dropdown) {
        if (!dropdown) {
            this.remove();
        }
    },

    updateAutocomplete: function () {
        var autocomplete = this.model.get('autocomplete');
        this.ui.filter.toggleClass('hidden', !autocomplete);
    },

    onClickItemHandler: function (item) {
        var model = this.model;

        model.toggleItem(item);
        this.close();
    },

    onKeyUpHandler: function (event) {
        //@TODO grow input
        var text = this.ui.text.val();
        this.trigger('search', text);
    },

    onKeyDownHandler: function (event) {
        var model = this.model;
        switch (event.which) {
            case 36://Home;
                model.selectFirstItem();
                break;
            case 35: //End
                model.selectLastItem();
                break;
            case 38: //Up
                model.selectPrevItem();
                break;
            case 40: //Down
                model.selectNextItem();
                break;
            case 32:
            case 13:
                this.onClickItemHandler(model.getSelectedItem());
                break;
        }
    },

    onChangeSearchHandler: function (model, value) {
        this.ui.search.text(value);
    },

    onChangeSelectedItem: function (model, value) {
        this.markSelectedItems();
    }

});

_.extend(ComboBoxDropdownView.prototype, bindUIElementsMixin);