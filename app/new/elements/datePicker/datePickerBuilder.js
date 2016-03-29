function DatePickerBuilder() {
    _.superClass(DatePickerBuilder, this);
}

_.inherit(DatePickerBuilder, DateTimePickerBuilder);

DatePickerBuilder.prototype.applyDefaultMetadata = function (params) {

    DateTimePickerBuilder.call(this, params);

    var metadata = params.metadata;
    metadata.Mode = 'DatePicker';

    _.defaults(metadata, {
        DisplayFormat: '{:d}',
        EditMask: {DateTimeEditMask: {Mask: 'd'}}
    });

};