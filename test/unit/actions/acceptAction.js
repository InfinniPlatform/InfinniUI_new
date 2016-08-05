describe('AcceptAction', function () {
    it('successful build', function () {
        // Given
        var view = new View();
        var builder = new ApplicationBuilder();

        // When
        var acceptAction = builder.build({ AcceptAction: {} }, {parentView: view});

        // Then
        assert.isNotNull( acceptAction );
        assert.isNotNull( acceptAction.execute, 'action should have execute' );
    });

    it('set accept as DialogResult for parentView', function () {
        // Given
        var view = new View();
        var builder = new AcceptActionBuilder();
        var acceptAction = builder.build(null, {parentView: view, metadata: {}});

        assert.equal(view.getDialogResult(), DialogResult.none);

        // When
        acceptAction.execute();

        // Then
        assert.equal(view.getDialogResult(), DialogResult.accepted, 'DialogResult should be accepted');
    });

    it('should call onExecuted', function () {
        // Given
        var view = new View();
        var builder = new AcceptActionBuilder();
        var acceptAction = builder.build(null, {
                                                parentView: view,
                                                metadata: {
                                                    OnExecuted: "{ window.onExecutedWasCalled = true; }"
                                                }
                                            });

        assert.isUndefined(window.onExecutedWasCalled);

        // When
        acceptAction.execute();

        // Then
        assert.isTrue(window.onExecutedWasCalled);

        // cleanup
        window.onExecutedWasCalled = undefined;
    });
});