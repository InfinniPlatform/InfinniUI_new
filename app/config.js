_.defaults( InfinniUI.config, {
    lang: 'ru-RU',
    maxLengthUrl: 2048,
    cacheMetadata: false, //boolean - enable/disable cache | milliseconds
    serverUrl: 'http://localhost:9900',//'http://10.0.0.32:9900';
    configId: 'PTA',
    configName: 'Хабинет'
//devblockstart
    ,editorService: {
        url: 'http://localhost:5500/api/metadata/saveMetadata'
    }
//devblockstop

});