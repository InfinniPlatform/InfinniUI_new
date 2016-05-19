var TextEditorView = Backbone.View.extend({

    /**
     * @member {TextEditorModel} model
     */

    events: {
        'focusin': 'onFocusinHandler',
        'focusout': 'onFocusoutHandler',
        'keydown': 'onKeydownHandler',
        'keyup': 'onKeyupHandler',
        'keypress': 'onKeypressHandler',
        'click': 'onClickHandler',
        //'mousewheel': 'onMousewheelHandler',
        'paste': 'onPasteHandler'
    },

    onKeydownHandler: function (event) {
        if (event.ctrlKey || event.altKey) {
            return;
        }

        var editMask = this.model.getEditMask();
        if (!editMask) {
            return;
        }

        var model = this.model;
        var position;

        switch (event.which) {
            case InfinniUI.Keyboard.KeyCode.ESCAPE:
                //Отменить изменения и выйти из режима редактирования
                this.setDisplayMode(true);
                break;

            case InfinniUI.Keyboard.KeyCode.HOME:
                if(!event.shiftKey) {
                    position = editMask.moveToPrevChar(0);
                    if (position !== false) {
                        event.preventDefault();
                        this.setCaretPosition(position);
                    }
                }

                break;

            case InfinniUI.Keyboard.KeyCode.LEFT_ARROW:
                if(!event.shiftKey) {
                    position = editMask.moveToPrevChar(this.getCaretPosition());
                    if (position !== false) {
                        event.preventDefault();
                        this.setCaretPosition(position);
                    }
                }
                break;

            case InfinniUI.Keyboard.KeyCode.RIGHT_ARROW:
                if (!event.shiftKey) {
                    position = editMask.moveToNextChar(this.getCaretPosition());
                    if (position !== false) {
                        event.preventDefault();
                        this.setCaretPosition(position);
                    }
                }
                break;

            case InfinniUI.Keyboard.KeyCode.END:
                if (!event.shiftKey) {
                    position = editMask.moveToNextChar(this.getInput().val().length);
                    if (position !== false) {
                        event.preventDefault();
                        this.setCaretPosition(position);
                    }
                }
                break;

            case InfinniUI.Keyboard.KeyCode.UP_ARROW:
                if(!event.shiftKey) {
                    position = editMask.setNextValue(this.getCaretPosition());
                    if (position !== false) {
                        event.preventDefault();
                        model.setText(editMask.getText());
                        this.setCaretPosition(position);
                    }
                }
                break;

            case InfinniUI.Keyboard.KeyCode.DOWN_ARROW:
                if(!event.shiftKey) {
                    position = editMask.setPrevValue(this.getCaretPosition());
                    if (position !== false) {
                        event.preventDefault();
                        this.model.setText(editMask.getText());
                        this.setCaretPosition(position);
                    }
                }
                break;

            case InfinniUI.Keyboard.KeyCode.DELETE:
                event.preventDefault();
                position = editMask.deleteCharRight(this.getCaretPosition(), this.getSelectionLength());

                this.model.setText(editMask.getText());
                if (position !== false) {
                    this.setCaretPosition(position);
                }
                break;

            case InfinniUI.Keyboard.KeyCode.BACKSPACE:
                event.preventDefault();
                position = editMask.deleteCharLeft(this.getCaretPosition(), this.getSelectionLength());

                this.model.setText(editMask.getText());
                if (position !== false) {
                    this.setCaretPosition(position);
                }
                break;

            case InfinniUI.Keyboard.KeyCode.SPACE:
                if (editMask.value instanceof Date) {
                    event.preventDefault();
                    position = editMask.getNextItemMask(this.getCaretPosition());
                    if (position !== false) {
                        this.setCaretPosition(position);
                    }
                }
                break;

            default:

                //@TODO Зачем это все

                //TODO: не работает для DateTimeFormat
                //замена выделенного текста, по нажатию

                var char = InfinniUI.Keyboard.getCharByKeyCode(event.keyCode);

                //@TODO Зачем проверка "instanceof Date"??
                if (this.getSelectionLength() > 0) {
                    event.preventDefault();
                    position = editMask.deleteSelectedText(this.getCaretPosition(), this.getSelectionLength(), char);
                    this.model.setText(editMask.getText());
                    if (position !== false) {
                        this.setCaretPosition(position);
                    }
                }

                break;
        }


    },

    onKeyupHandler: function (event) {
        //@TODO this.parseInputValue()

        //this.trigger('onKeyDown', {
        //    keyCode: event.which,
        //    value: this.parseInputValue()
        //});
    },

    onKeypressHandler: function (event) {
        if (event.altKey || event.ctrlKey) {
            return;
        }

        var editMask = this.model.getEditMask();
        if (!editMask) {
            return;
        }

        var char = InfinniUI.Keyboard.getCharByKeyCode(event.which);

        var position;

        if (char === null) {
            return;
        }

        position = editMask.setCharAt(char, this.getCaretPosition(), this.getSelectionLength());
        event.preventDefault();
        this.model.setText(editMask.getText());

        if (position !== false) {
            this.setCaretPosition(position);
        }
    },

    onClickHandler: function (event) {
        this.checkCurrentPosition();
        event.preventDefault();
    },

    onPasteHandler: function (event) {
        var editMask = this.model.getEditMask();

        if (!editMask) {
            //Use default behavior
            return;
        }

        var originalEvent = event.originalEvent;

        var text = originalEvent.clipboardData.getData('text/plain') || prompt('Введите текст для вставки');
        if (text) {
            var chars = text.split('');

            for (var i = 0, position = this.getCaretPosition(); i < chars.length; i = i + 1) {
                position = editMask.setCharAt(chars[i], position);
            }

            event.preventDefault();
            this.model.setText(editMask.getText());
        }
    },

    checkCurrentPosition: function () {
        var editMask = this.model.getEditMask();
        if (!editMask) {
            return;
        }
        var currentPosition = this.getCaretPosition();
        var position = currentPosition === 0 ? editMask.moveToPrevChar(0) : editMask.moveToNextChar(currentPosition - 1);
        if (position !== currentPosition) {
            this.setCaretPosition(position);
        }

    },

    getSelectionLength: function () {
        /** @var HTMLInputElement **/
        var elem = this.getInputEl();
        var len = 0;
        var startPos = parseInt(elem.selectionStart, 10);
        var endPos = parseInt(elem.selectionEnd, 10);

        if (!isNaN(startPos) && !isNaN(endPos)) {
            len = endPos - startPos;
        }

        return len;
    },

    setCaretPosition: function (caretPosition) {

        if (_.isNumber(caretPosition)) {
            var elem = this.getInputEl();

            //IE9+
            if (typeof elem.selectionStart !== 'undefined') {
                elem.setSelectionRange(caretPosition, caretPosition);
            }
        }

    },

    /**
     * @private
     * Получение позиции курсора в поле редактирования
     * @returns {number}
     */
    getCaretPosition: function () {
        /** @var {HTMLInputElement} **/
        var elem = this.getInputEl();

        var position = 0;

        //IE9+
        if (elem.selectionStart || elem.selectionStart == '0') {
            position = elem.selectionStart;
        }

        return position;
    },

    initialize: function () {
        this.listenTo(this.model, 'change:mode', this.onChangeModeHandler);
        this.listenTo(this.model, 'change:text', this.onChangeTextHandler);
    },

    render: function () {

        var inputTemplate = this.model.get('inputTemplate');

        var $input = _.isString(inputTemplate) ? $(inputTemplate) : $(inputTemplate.call(null));

        this.ui = {
            input: $input
        };

        this.$el.append($input);

        return this.$el;
    },

    onFocusinHandler: function (/* event */) {
        this.model.setEditMode();
    },

    onFocusoutHandler: function (/* event */) {
        this.model.setDisplayMode();
    },

    onChangeModeHandler: function (model, mode) {
        this.checkCurrentPosition();
        console.log(mode);
    },

    onChangeTextHandler: function (model, text) {
        var $input = this.getInput();

        $input.val(text);
        if ($input.is(':focus')) {
            this.checkCurrentPosition();
        }
    },


    /**
     *
     * @returns {*|jQuery|HTMLElement}
     */
    getInput: function () {
        return this.ui.input;
    },

    /**
     *
     * @returns {HTMLInputElement}
     */
    getInputEl:  function () {
        return this.ui.input.get(0);
    }

});


/**
 *
 * @constructor
 */
function EditorModeStrategy() {}

/**
 * @abstract
 * @param {TextEditorModel} model
 */
EditorModeStrategy.prototype.updateText = function (model) {};

/**
 * @augments EditorModeStrategy
 * @constructor
 */
function EditorDisplayModeStrategy() {
    EditorModeStrategy.call(this);
}

EditorDisplayModeStrategy.prototype = Object.create(EditorModeStrategy.prototype);
EditorDisplayModeStrategy.prototype.constructor = EditorDisplayModeStrategy;
EditorDisplayModeStrategy.prototype.updateText = function (model) {
    var displayFormat = model.getDisplayFormat();
    var value = model.get('value');

    var text;

    if (_.isFunction(displayFormat)) {
        text = displayFormat.call(null, null, {value: value});
    } else {
        text = value;
    }

    model.set('text', text);
};

/**
 * @augments EditorModeStrategy
 * @constructor
 */
function EditorEditModeStrategy() {
    EditorModeStrategy.call(this);
}

EditorEditModeStrategy.prototype = Object.create(EditorModeStrategy.prototype);
EditorEditModeStrategy.prototype.constructor = EditorEditModeStrategy;
EditorEditModeStrategy.prototype.updateText = function (model) {
    var editMask = model.getEditMask();
    var value = model.get('value');
    var text;

    if (!editMask) {
        text = value;
    } else {
        editMask.reset(value);
        text = editMask.getText();
    }

    model.set('text', text);
};

var TextEditorModel = Backbone.Model.extend({

    Mode: {
        Edit: 'edit',
        Display: 'display'
    },

    initialize: function () {

        this.initEditMode();

        this.on('change:originalValue', this.onChangeOriginalValueHandler);
        this.on('change:value', this.onChangeValueHandler);
        this.on('change:mode', this.onChangeModeHandler);
    },

    initEditMode: function () {
        this.modeStrategies = {};
        this.modeStrategies[this.Mode.Edit] = new EditorEditModeStrategy();
        this.modeStrategies[this.Mode.Display] = new EditorDisplayModeStrategy();

        this.updateEditModeStrategy();
    },

    defaults: function () {
        return {
            mode: this.Mode.Display
        };
    },

    updateEditModeStrategy: function () {
        var mode = this.get('mode');
        this.set('modeStrategy', this.modeStrategies[mode]);
    },

    onChangeModeHandler: function () {
        this.updateEditModeStrategy();
        this.updateText();
    },

    /**
     *
     * @param {boolean} [cancel = false]
     */
    setDisplayMode: function (cancel) {
        cancel = !!cancel;

        this.set('mode', this.Mode.Display, {
            validate: !cancel
        });

    },

    setText: function (text) {
        this.set('text', text);
    },

    getEditMask: function () {
        return this.get('editMask');
    },

    getDisplayFormat: function () {
        return this.get('displayFormat');
    },

    setEditMode: function () {
        this.set('mode', this.Mode.Edit);
    },

    validate: function (attrs, options) {

        //@TODO Если меняется Mode Edit => Display, проверить введенное значение!!!
        var validateValue = this.get('validateValue');
        var value = this.get('value');

        if (_.isFunction(validateValue)) {
            return validateValue.call(null, value);
        }
    },

    updateText: function () {
        var modeStrategy = this.get('modeStrategy');
        modeStrategy.updateText(this);
    },

    onChangeValueHandler: function (/* model, value */) {
        this.updateText();
    },

    onChangeOriginalValueHandler: function (model, originalValue) {
        model.set('value', originalValue, {originalValue: true});
    }

});


/**
 *
 * @param {TextEditorBase} element
 * @constructor
 */
var TextEditor2 = function (element) {
    var displayFormat = element.getDisplayFormat();
    var editMask = element.getEditMask();

    var model = new TextEditorModel({
        displayFormat: displayFormat,
        editMask: editMask,
        validateValue: element.validateValue.bind(element)
    });

    model.on('change:value', function (model, value) {
        element.setValue(value);
    });

    var view = new TextEditorView({
        model: model
    });

    model.on('invalid', function (model, error) {
        console.log('error', error);
    });

    //@TODO Handle ReadOnly & Enabled state

    this._model = model;
    this._view = view;

};


TextEditor2.prototype.setInputTemplate = function (inputTemplate) {
    this._model.set('inputTemplate', inputTemplate);
};

/**
 *
 * @param {function|string} inputTemplate
 * @returns {*}
 */
TextEditor2.prototype.render = function (inputTemplate) {
    this.setInputTemplate(inputTemplate);

    return this._view.render();
};

TextEditor2.prototype.setValue = function (value) {
    this._model.set('originalValue', value);
};

TextEditor2.prototype.onChangeValue = function (handler) {
    this._model.on('change:value', function (model, value, options) {
        if (options.originalValue === true) {
            return;
        }

        handler.call(null, value);
    });
};