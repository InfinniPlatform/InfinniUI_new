window.InfinniUI = window.InfinniUI || {};
window.InfinniUI.config = window.InfinniUI.config || {};

// перекрываем дефолтные конфиги, лажащие в InfinniUI/app/config.js

window.InfinniUI.config.cacheMetadata = false;
window.InfinniUI.config.serverUrl = 'http://10.0.0.32:9900';
window.InfinniUI.config.configId = 'PTA';
window.InfinniUI.config.configName = 'Хабинет';

window.InfinniUI.config.homePage = {ConfigId: InfinniUI.config.configId, DocumentId: 'Common', MetadataName: 'HomePage'}; //'stab.json'