var BaseDataSource = Backbone.Model.extend({
    defaults: {
        name: null,
        idProperty: 'Id',
        pageNumber: 0,
        pageSize: 15,
        sorting: null,
        criteriaList: [],

        view: null,

        isDataReady: false,

        dataProvider: null,

        modifiedItems: [],
        items: null,
        itemsById: {},
        selectedItem: null,
        stringifySelectedItem: null,

        fillCreatedItem: true,
        isUpdateSuspended: false,
        showingWarnings: false,

        isRequestInProcess: false

    },

    initialize: function(){
        this.initDataProvider();

        if(!this.get('view')){
            throw 'BaseDataSource.initialize: ��� �������� ������� �� ���� ������ view.'
        }
    },

    initDataProvider: function(){
        throw 'BaseDataSource.initDataProvider � ������� BaseDataSource �� ����� ��������� ������.'
    },

    onPageNumberChanged: function (handler) {
        this.on('change:pageNumber', handler);
    },

    onPageNumberSize: function (handler) {
        this.on('change:pageSize', handler);
    },

    onError: function (handler) {
        this.on('error', handler);
    },

    onItemCreated: function (handler) {
        this.on('onItemCreated', handler);
    },

    onItemsUpdated: function (handler) {
        this.on('onItemsUpdated', handler);
    },

    getName: function(){
        return this.get('name');
    },

    setName: function(name){
        this.set('name', name);
    },

    getView: function(){
        return this.get('view');
    },

    getItems: function(){
        return this.get('items');
    },

    getSelectedItem: function(){
        return this.get('selectedItem');
    },

    setSelectedItem: function(item, success, error){
        var currentSelectedItem = this.getSelectedItem(),
            idProperty = this.get('idProperty'),
            itemId = item[idProperty],
            items = this.get('itemsById');


        if(!items[itemId]){
            if(!error){
                throw 'BaseDataSource.setSelectedItem() ������� ������� ������� �������� �� �� ������ ���������';
            }else{
                error(this.getContext(), {error: 'BaseDataSource.setSelectedItem() ������� ������� ������� �������� �� �� ������ ���������'});
            }
        }

        if(currentSelectedItem[idProperty] == ){

        }
        this.set('selectedItem', item);
    },

    getIdProperty: function () {
        return this.get('idProperty');
    },

    getFillCreatedItem: function () {
        return this.get('fillCreatedItem');
    },

    setFillCreatedItem: function (fillCreatedItem) {
        this.set('fillCreatedItem', fillCreatedItem);
    },

    suspendUpdate: function () {
        this.set('isUpdateSuspended', true);
    },

    resumeUpdate: function () {
        this.set('isUpdateSuspended', false);
    },

    getPageNumber: function () {
        return this.get('pageNumber');
    },

    setPageNumber: function (value) {
        if(!Number.isInteger(value) || value < 0){
            throw 'BaseDataSource.setPageNumber() ������� ������������ ��������: ' + value + '. ������ ���� �����, ��������������� �����.';
        }

        if (value != this.get('pageNumber')) {
            this.set('pageNumber', value);
            this.updateItems();
        }


    },

    getPageSize: function () {
        return this.get('pageSize');
    },

    setPageSize: function (value) {
        if(!Number.isInteger(value) || value < 0){
            throw 'BaseDataSource.setPageSize() ������� ������������ ��������: ' + value + '. ������ ���� �����, ��������������� �����.';
        }

        if (value != this.get('pageSize')) {
            this.set('pageSize', value);
            this.updateItems();
        }
    },

    isModifiedItems : function () {
        return this.isModified();
    },

    isModified : function (item) {
        if(arguments.length == 0){
            return this.get('modifiedItems').length > 0;
        }

        if (item != null && item !== undefined) {
            return false;
        }
        else {
            var index = this.get('modifiedItems').indexOf(item);
            return index != -1;
        }
    },

    setProperty: function(property, value){
        var selectedItem = this.getSelectedItem(),
            relativeProperty;

        if(!selectedItem){
            return;
        }

        if(property != '$'){
            if(property.substr(0,2) == '$.'){
                relativeProperty = property.substr(0,2);
            }else{
                relativeProperty = property;
            }

            InfinniUI.ObjectUtils.setPropertyValue(selectedItem, relativeProperty, value);
        }else{

        }
    },

    saveItem : function (item, onSuccess) {

    },

    isDataReady: function(){
        return this.get('isDataReady');
    },

    getItems: function(){
        if(this.isDataReady()){
            logger.warn({
                message: 'BaseDataSource: ������� �������� ������ ��������� ������ (' + this.get('name') + '), �� ���� ��� �� ��� ������������������ �������',
                source: this
            });
        }

        return this.get('items');
    },

    updateItems: function(onSuccess, onError){
        if (!this.get('isUpdateSuspended')){
            var filters = this.getFilter(),
                pageNumber = this.get('pageNumber'),
                pageSize = this.get('pageSize'),
                sorting = this.get('sorting'),
                dataProvider = this.get('dataProvider'),
                that = this;

            this.set('isRequestInProcess', true);
            dataProvider.getItems( filters, pageNumber, pageSize, sorting, function(data){

                that.set('isRequestInProcess', false);
                that._handleUpdatedItemsData(data, onSuccess);

            }, onError );
        }

    },

    _handleUpdatedItemsData: function(itemsData, successHandler){
        this.set('items', itemsData);
        this.set('isDataReady', true);
        this.set('modifiedItems', []);

        this._notifyAboutItemsUpdated(itemsData, successHandler);
    },

    _notifyAboutItemsUpdated: function(itemsData, successHandler){
        var context = this.getContext(),
            argument = {
                value: itemsData
            };

        successHandler(context, argument);
        this.trigger('onItemsUpdated', context, argument);
    },

    createItem: function(success, error){
        var dataProvider = this.get('dataProvider'),
            that = this;

        if(this.get('fillCreatedItem')){
            dataProvider.createItem(function (item) {
                that._handleDataForCreatingItem(item, success);
            });
        }else{
            this._handleDataForCreatingItem({}, success);
        }
    },

    _handleDataForCreatingItem: function(itemData, successHandler){
        itemData['__Id'] = this._generateLocalId();

        this.set('items', [itemData]);
        this.set('isDataReady', true);
        this.get('modifiedItems').push(itemData);

        this._notifyAboutItemCreated(itemData, successHandler);
    },

    _notifyAboutItemCreated: function(createdItem, successHandler){
        var context = this.getContext(),
            argument = {
                value: createdItem
            };

        successHandler(context, argument);
        this.trigger('onItemCreated', context, argument);
    },

    _generateLocalId: function(){
        return guid();
    },



    getFilter: function(){
        return this.get('criteriaList');
    },

    setFilter: function(filter){
        this.set('criteriaList', filter);
        this.updateItems();
    },

    setIdFilter: function(itemId){
        this.setFilter([{
            "Property": "Id",
            "Value": itemId,
            "CriteriaType": 1
        }]);
    },

    getContext: function(){
        return this.getView().getContext();
    }

});
