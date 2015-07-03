function Collection(items, idProperty, comparator) {
    this._eventDispatcher = new EventDispatcher();
    this._idProperty = idProperty;
    this._comparator = comparator;
    this.initStrategy();
    this.reset(items || []);

    //this._eventDispatcher.applyTo(this);
}

Collection.prototype.initStrategy = function () {
    var idProperty =  this._idProperty;
    if (typeof idProperty === 'undefined' || idProperty === null || idProperty === '') {
        this._strategy = new CollectionStrategyIndex();
    } else {
        this._strategy = new CollectionStrategyId(idProperty);
    }
};

Collection.EVENTS = {
    OnAdd: 'onAdd',
    OnChange: 'onChange',
    OnReplace: 'onReplace',
    OnReset: 'onReset',
    OnRemove: 'onRemove'
};

Object.defineProperties(Collection.prototype, {
    idProperty: {
        get: function () {
            return this._idProperty;
        },
        enumerable: false
    },
    length: {
        get: function () {
            return this._strategy.length;
        },
        enumerable: false
    },
    hasIdProperty: {
        get: function () {
            return typeof this._idProperty !== 'undefined';
        },
        enumerable: false
    }
});

Collection.prototype.toString = function () {
    return this._strategy.toString();
};

Collection.prototype.size = function () {
    return this.length;
};

Collection.prototype.push = function (newItem) {
    var changed = this._strategy.push(newItem);
    return changed;
};

Collection.prototype.add = function (newItem) {
    var changed = this._strategy.add(newItem);
    return changed;
};

Collection.prototype.addAll = function (newItems) {
    var changed = this._strategy.addAll(newItems);
    return changed;
};

Collection.prototype.insert = function (index, newItem) {
    var changed = this._strategy.insert(index, newItem);
    return changed;
};

Collection.prototype.insertAll = function (index, newItems) {
    var changed = this._strategy.insertAll(index, newItems);
    return changed;
};

Collection.prototype.reset = function (newItems) {
    var changed = this._strategy.reset(newItems);
    return changed;
};

//@TODO set

Collection.prototype.replace = function (oldItem, newItem) {
    var changed = this._strategy.replace(oldItem, newItem);
    return changed;
};

Collection.prototype.pop = function () {
    var item = this._strategy.pop();
    return item;
};

Collection.prototype.remove = function (item) {
    var changed = this._strategy.remove(item);
    return changed;
};


Collection.prototype.removeById = function (id) {
    var changed = this._strategy.removeById(id);
    return changed;
};

Collection.prototype.indexOf = function (item, fromIndex) {
    var index = this._strategy.indexOf(item, fromIndex);
    return index;
};

Collection.prototype.getById = function (id) {
    var item = this._strategy.getById(id);
    return item;
};

Collection.prototype.lastIndexOf = function (item, fromIndex) {
    var maxIndex = this.length - 1,
        index = (typeof fromIndex === 'undefined') ? maxIndex : fromIndex;

    if(index < 0 || index > maxIndex) {
        return -1;
    }
    return this._strategy.lastIndexOf(item, index);
};

Collection.prototype.getByIndex = function (index) {
    return this._strategy.getByIndex(index);
};

Collection.prototype.findIndex = function (predicate, thisArgs) {
    return this._strategy.findIndex(predicate, this, thisArgs);
};

Collection.prototype.find = function (predicate, thisArgs) {
    return this._strategy.find(predicate, this, thisArgs);
};

Collection.prototype.contains = function (item, fromIndex) {
    var index = typeof fromIndex === 'undefined' ? 0 : fromIndex;

    return this._strategy.contains(item, index);
};

Collection.prototype.every = function (predicate, thisArgs) {
    return this._strategy.every(predicate, this, thisArgs);
};

Collection.prototype.some = function (predicate, thisArgs) {
    return this._strategy.some(predicate, this, thisArgs);
};

Collection.prototype.forEach = function (predicate, thisArgs) {
    return this._strategy.forEach(predicate, this, thisArgs);
};

Collection.prototype.filter = function (predicate, thisArgs) {
    return this._strategy.filter(predicate, this, thisArgs);
};

Collection.prototype.take = function (fromIndex, count) {
    return this._strategy.take(fromIndex, count);
};

Collection.prototype.toArray = function () {
    return this._strategy.toArray();
};

Collection.prototype.onChange = function (handler) {
    this._eventDispatcher.register(Collection.EVENTS.OnChange, handler);
};

Collection.prototype.notifyOnRemove = function () {
    var eventParams = {
        action: 'remove'
    };

    this.emit(Collection.EVENTS.OnRemove, eventParams);
    this.emit(Collection.EVENTS.OnChange, eventParams);
};

Collection.prototype.notifyOnAdd = function () {
    var eventParams = {
        action: 'add'
    };

    this.emit(Collection.EVENTS.OnAdd, eventParams);
    this.emit(Collection.EVENTS.OnChange, eventParams);
};

Collection.prototype.notifyOnReset = function () {
    var eventParams = {
        action: 'reset'
    };

    this.emit(Collection.EVENTS.OnReset, eventParams);
    this.emit(Collection.EVENTS.OnChange, eventParams);
};
