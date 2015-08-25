function MetadataDataSourceBuilder() {

    this.build = function (context, args) {

        var idProperty = args.metadata.IdProperty || 'Id';

        var dataSource = new MetadataDataSource(args.view, args.metadata);
        new BaseDataSourceBuilder().build(context,
                                            _.extend(args, {dataSource: dataSource}));

        return dataSource;
    }
}
