function CollectionStrategyId(idProperty) {
    CollectionStrategy.apply(this);
    this._idProperty = idProperty;
    this._resetData();
}

CollectionStrategyId.prototype = Object.create(CollectionStrategy.prototype);
CollectionStrategyId.prototype.constructor = CollectionStrategyId;

CollectionStrategyId.prototype.push = function (newItem) {
    this._items.push(newItem);
    this._storeData(newItem, this._items.length - 1);
    return true;
};

CollectionStrategyId.prototype.add = function (newItem) {
    return this.push(newItem);
};

CollectionStrategyId.prototype.addAll = function (newItems) {
    if (!Array.isArray(newItems)) {
        return false;
    }

    newItems.forEach(this.add.bind(this));
    return true;
};

CollectionStrategyId.prototype.insert = function (index, newItem) {
    var length = this._items.length,
        position = (index < 0) ? 0 : Math.min(index, length);

    this._reindex(position, 1);
    this._items.splice(position, 0, newItem);
    this._storeData(newItem, position);

    return true;
};

CollectionStrategyId.prototype.insertAll = function (index, newItems) {
    if (!Array.isArray(newItems) || newItems.length === 0) {
        return false;
    }

    var position = (index < 0) ? 0 : Math.min(index, length);

    Array.prototype.splice.apply(this._items, [position, 0].concat(newItems));
    this._reindex(position, newItems.length);
    for (var i = 0; i < newItems.length; i = i + 1) {
        this._storeData(newItems[i], position + i);
    }

    return true;
};

CollectionStrategyId.prototype.reset = function (newItems) {
    if (!Array.isArray(newItems)) {
        return false;
    }

    var
        changed = this.length !== newItems.length;

    if (!changed) {
        for (var i = 0; i < newItems.length; i = i + 1) {
            if (this.indexOf(newItems[i], 0) === -1) {
                changed = true;
                break;
            }
        }
    }

    if (changed) {
        this._resetData();
        this.insertAll(0, newItems);
    }
    return changed;
};

CollectionStrategyId.prototype.replace = function (oldItem, newItem) {
    var
        id,
        changed = false;

    if (typeof oldItem === 'undefined' || oldItem === null || typeof oldItem !== 'object') {
        //выборка по значению
        for (var i = 0; i < this._items.length; i = i + 1) {
            if (this._items[i] !== oldItem) {
                continue;
            }
            this._items[i] = newItem;
            this._storeData(newItem, i);
            changed = true;
        }
    } else {
        //выборка по ключу
        id = oldItem[this._idProperty];

        if (id in this._data) {
            var data = this._data[id];
            for (var i = 0; i < data.length; i = i + 1) {
                this._items.splice(data[i].index, 1, newItem);
                this._data[i] = newItem;
            }
            changed = true;
        }
    }

    return changed;
};

CollectionStrategyId.prototype.pop = function () {
    if (this._items.length === 0) {
        return;
    }

    var
        item = this._items.pop(),
        index = this._items.length;

    if (item !== null && typeof item === 'object') {
        var id = item[this._idProperty];
        if (id in this._data) {
            var data = this._data[id];
            for (var i = 0; i < data.length; i = i + 1) {
                if (i !== index) {
                    continue;
                }
                data.splice(index, 1);
                break;
            }
        }
    }

    return item;
};


CollectionStrategyId.prototype.remove = function (item) {
    var
        changed = false,
        _items = this._items;

    if (item !== null && typeof item === 'object') {
        //Удаление по ключу
        changed = this.removeById(item[this._idProperty]);
    } else {
        //Удаление по значению
        while (true) {
            var index = _items.indexOf(item);
            if (index === -1) {
                break;
            }
            _items.splice(index, 1);
            changed = true;
        }
    }

    return changed;
};


CollectionStrategyId.prototype.removeById = function (id) {
    var
        changed = false,
        _items = this._items;

    if (id in this._data) {
        this._data[id]
            .map(function (data) {
                return _items[data.index];
            })
            .forEach(function (item) {
                _items.splice(_items.indexOf(item), 1);
            });

        changed = this._data[id].length > 0;
        this._data[id] = [];
    }

    return changed;
};

CollectionStrategyId.prototype.getById = function (id) {
    return this._getById(id);
};

CollectionStrategyId.prototype.indexOf = function (item, fromIndex) {
    var start = fromIndex || 0,
        index = -1;

    if (typeof item === 'undefined' || item === null || typeof item !== 'object') {
        index = this._items.indexOf(item, start);
    } else {
        var
            id = item[this._idProperty],
            data = this._data[id],
            items;

        if (Array.isArray(data) && data.length > 0) {
            items = data
                .filter(function (data) {
                    return data.index >= start;
                })
                .sort(function (a, b) {
                    return a.index - b.index;
                });

            if (items.length > 0) {
                index = items[0].index;
            }
        }
    }

    return index;
};

CollectionStrategyId.prototype.lastIndexOf = function (item, fromIndex) {
    if (item !== null && typeof item !== 'object') {
        return this._items.lastIndexOf(item, fromIndex);
    }

    var id = item[this._idProperty];
    var data = this._data[id];

    if (!Array.isArray(data)) {
        return -1;
    } else if (data.length === 1) {
        return data[0].index;
    } else if (data.length === 0) {
        return -1;
    }

    var index = data
        .filter(function (data) {
            return data.index <= fromIndex;
        })
        .map(function (data) {
            return data.index
        });

    return Math.max.apply(Math, index);
};

CollectionStrategyId.prototype.contains = function (item, fromIndex) {
    var contains = false;

    if (item !== null && typeof item !== 'object') {
        //Поиск по значению
        contains = CollectionStrategy.prototype.contains.call(this, item, fromIndex);
    } else {
        var id = item[this._idProperty];
        var data = this._data[id];
        if (fromIndex === 0) {
            contains = Array.isArray(data) && data.length > 0;
        } else {
            contains = data
                    .filter(function (data) {
                        return data.index >= fromIndex;
                    })
                    .length > 0;

        }

    }
    return contains;
};

CollectionStrategyId.prototype.move = function (oldIndex, newIndex) {
    //@TODO
};


/**
 *
 * @private
 */
CollectionStrategyId.prototype._resetData = function () {
    this._data = Object.create(null);
    this._items = [];
};

/**
 *
 * @param {object} item
 * @param {number} index
 * @private
 */
CollectionStrategyId.prototype._storeData = function (item, index) {

    if (typeof item === 'undefined' || item === null || typeof item !== 'object') {
        //Если undefined, null или простой тип - элемент не доступен по ключу
        return;
    }

    var id = item[this._idProperty],
        data = {
            index: index,
            item: item
        };

    if (id in this._data) {
        this._data[id].push(data);
    } else {
        this._data[id] = [data];
    }
};

/**
 *
 * @param id
 * @param position
 * @returns {*}
 * @private
 */
CollectionStrategyId.prototype._getById = function (id, position) {
    var data = this._data[id],
        index = position || 0,
        item;

    if (Array.isArray(data) && index < data.length) {
        item = data[index].item;
    }

    return item;
};

/**
 *
 * @param index
 * @param count
 * @private
 */
CollectionStrategyId.prototype._reindex = function (index, count) {
    var
        items,
        length = this._items.length;

    if (index >= length) {
        return;
    }

    //Пересчет индексов
    for (var key in this._data) {
        items = this._data[key];
        items.forEach(function (item) {
            if (item.index < index) {
                item.index += count;
            }
        });
    }

};



