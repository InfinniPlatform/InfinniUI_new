var CheckBoxModel = ControlModel.extend({
    defaults: _.defaults({
        value: false
    }, ControlModel.prototype.defaults),

    initialize: function () {
        ControlModel.prototype.initialize.apply(this);
    }
});