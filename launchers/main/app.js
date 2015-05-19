﻿moment.lang('ru');

window.adjustLoginResult = function (result) {
    var defer = $.Deferred();

    if (result == null) {
        defer.resolve(result);
    } else {
        var metadata = {
                ConfigId: 'Resources',
                DocumentId: 'MedicalWorker'
            },
            filter = [
                {
                    Property: 'Login.DisplayName',
                    CriteriaType: 1,
                    Value: result.UserName
                }
            ];

        var provider = new DataProviderREST(metadata, new QueryConstructorStandard(InfinniUI.config.serverUrl, metadata));

        provider.getItems(filter, 0, 1, null, function (data) {
            if (data.length) {
                defer.resolve({ UserName: data[0].LastName + ' ' + data[0].FirstName + ' ' + data[0].MiddleName });
                window.currentMedicalWorker = data[0];
            } else {
                defer.resolve({ UserName: result.UserName });
            }
        });
    }

    return defer.promise();
};

$.ajaxSetup({
    complete: function (jqXHR, textStatus) {
        if (textStatus == 'error' && jqXHR.responseText.indexOf('access denied') > -1) {
            toastr.error('Недостаточно прав для выполнения данной операции');
        }

    }
});


(function ($target, metadata) {

    var host = InfinniUI.config.serverUrl;

    function showSerialPopup() {
        var defer = $.Deferred();
        var metadata = {
            ConfigId: 'Administration',
            DocumentId: 'Serial'
        };

        var provider = new DataProviderREST(metadata, new QueryConstructorStandard(host, metadata));
        provider.getItems(null, 0, 1, null, function (data) {
            if (!data.length) {
                var serial = prompt('Для доступа в систему введите лицензионный ключ', '');
                if (serial == '004165') {
                    provider.replaceItem({
                        Number: '004165'
                    });
                    defer.resolve(true);
                } else {
                    if (window.location.hostname == 'localhost') {
                        alert('Некорректный лицензионный ключ. Продолжена работа тез ключа.');
                        defer.resolve(true);
                    } else {
                        alert('Некорректный лицензионный ключ.');
                        defer.resolve(false);
                    }
                }
            }

            defer.resolve(true);
        });

        return defer.promise();
    }

    $.ajax({
        type: 'post',
        url: host + '/SystemConfig/StandardApi/metadata/getregisteredconfiglist',
        data: JSON.stringify({
            "id": null,
            "changesObject": "null",
            "replace": false
        }),
        success: function (data) {
            var $list = $('#configs'),
                items = data.ConfigList;
            for (var i = 0, ii = items.length; i < ii; i++) {
                $list.append('<option>' + items[i].Name + '</option>');
            }
        }
    });

    $('#configs').change(function () {
        var val = $('#configs').val();
        if (val != '') {
            location.href = location.href.replace(/#?\S*$/, '#/' + val);
            location.reload();
        }
    });

    window.providerRegister.register('UploadDocumentDataSource', function (metadataValue) {
        return new DataProviderUpload(new QueryConstructorUpload(host, metadataValue));
    });

    setTimeout(layoutManager.init.bind(layoutManager), 1000);
    window.providerRegister.register('MetadataDataSource', function (metadataValue) {
        var $pageContent = $('body');
        for (var i = 3; i >= 0; i--) {
            setTimeout(function () {
                //adaptHeightInsideElement($('body'));
                layoutManager.init();
            }, 500 + i * 300);
        }

        return new MetadataProviderREST(new QueryConstructorMetadata(host, metadataValue));
    });

    window.providerRegister.register('DocumentDataSource', function (metadataValue) {
        return new DataProviderREST(metadataValue, new QueryConstructorStandard(host, metadataValue));
    });

    window.providerRegister.register('MetadataInfoDataSource', function (metadataValue) {
        return new MetadataDataSourceProvider(new QueryConstructorMetadataDataSource(host, metadataValue));
    });

    var builder = new ApplicationBuilder(),
        rootView = new ApplicationView();

    rootView.open($target);

    if (typeof metadata === 'string') {
        //Загрузка данных из стаба
        var linkView = new LinkView(rootView, function (resultCallback) {
            resultCallback(builder.buildType(rootView, 'View', loadStub(metadata)));
        });
    } else {
        //Обычная загрузка
        var linkView = new LinkView(rootView, function (resultCallback) {
            window.providerRegister.build('MetadataDataSource', metadata).getViewMetadata(function (data) {
                if (data.LayoutPanel) {
                    resultCallback(builder.buildType(rootView, 'View', data));
                } else {
                    alert('Нет home page для этой конфигурации.');
                }

            });
        });
    }

    var viewContext = null;
    linkView.setOpenMode('Application');
    linkView.createView(function (view) {
        /** @TODO Переделать на обработку только нового диалога. @see {@link layoutManager.resizeDialog} **/
        viewContext = view.getContext();
        var exchange = messageBus.getExchange('modal-dialog');
        exchange.subscribe(messageTypes.onLoaded, function (/*messageBody*/) {
            (function updateDialogLayout(intervals) {
                var timeout = intervals.splice(0, 1).pop();
                if (typeof timeout === 'undefined') return;
                setTimeout(function () {
                    layoutManager.init();
                    updateDialogLayout(intervals);
                }, timeout);
            })([500]);
        });

        messageBus.getExchange('global').subscribe(messageTypes.onViewClosed, function () {
            var $pageContent = $('body');
            setTimeout(function () {
                //adaptHeightInsideElement($('body'));
                layoutManager.init();
            }, 100);
        });
        showSerialPopup().then(function (result) {
            if (result)
                view.open();
        });
    });


    window.getHomePageContext = function () {
        return viewContext;
    };

    window.onSuccessSignOut = function (context) {

        var builder = new ApplicationBuilder();
        var metadata = {
            ConfigId: 'Administration',
            DocumentId: 'UserOrganizationSession',
            Name: 'MainDataSource',
            UpdateAction: 'RemoveSession'
        };

        var dataSource = builder.buildType(context.ParentView, 'DocumentDataSource', metadata);
        dataSource.saveItem({

        });
    };

    window.onSuccessSignIn = function (context, result) {
        context.Global.executeAction({
            OpenViewAction: {
                View: {
                    AutoView: {
                        ConfigId: 'Administration',
                        DocumentId: 'UserOrganizationSession',
                        MetadataName: 'EditView',
                        OpenMode: 'Dialog'
                    }
                }
            }
        });
    };

    //window.onSuccessSignIn = function(callback){
    //    callback(viewContext);
    //};
    //
    //window.onSuccessSignOut = function(callback){
    //    callback(viewContext);
    //};

    /**
     * Загрузка стаба
     * @param url напр. '/app/stubs/combobox.json'
     * @returns {boolean|Object}
     */
    function loadStub(url) {
        metadata = false;

        $.ajax({url: url, async: false})
            .done(function (data) {
                metadata = data
            })
            .fail(function (err) {
                alert(err.responseText);
            });
        return metadata;
    }
})(
    $('body'),
    //'/app/stubs/twoView.json'
    {ConfigId: window.location.hash.slice(2), DocumentId: 'Common', ViewType: 'HomePage'}
);