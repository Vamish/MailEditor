define([
    "jquery",
    "underscore",
    "base/declare",
    "base/_WidgetBase",
    "Editor/Toolbar/Toolbar",
    "Editor/pluginManager",
    "Editor/Button/Button",
    "text!Editor/Editor.html",
    "domReady!"
], function ($, _, declare, _WidgetBase, Toolbar, pluginManager, Button, template) {
    var ap = Array.prototype,
        slice = ap.slice;

    function getFontFamilies() {
        var defaultFontsFormats =
            '宋体=宋体;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆;雅黑=雅黑' +
            'Andale Mono=andale mono,times;' +
            'Arial=arial,helvetica,sans-serif;' +
            'Arial Black=arial black,avant garde;' +
            'Book Antiqua=book antiqua,palatino;' +
            'Comic Sans MS=comic sans ms,sans-serif;' +
            'Courier New=courier new,courier;' +
            'Georgia=georgia,palatino;' +
            'Helvetica=helvetica;' +
            'Impact=impact,chicago;' +
            'Symbol=symbol;' +
            'Tahoma=tahoma,arial,helvetica,sans-serif;' +
            'Terminal=terminal,monaco;' +
            'Times New Roman=times new roman,times;' +
            'Trebuchet MS=trebuchet ms,geneva;' +
            'Verdana=verdana,geneva;' +
            'Webdings=webdings;' +
            'Wingdings=wingdings,zapf dingbats';
        var items = [],
            fonts = createFormats(defaultFontsFormats);

        function createFormats(formats) {
            formats = formats.replace(/;$/, '').split(';');

            var i = formats.length;
            while (i--) {
                formats[i] = formats[i].split('=');
            }

            return formats;
        }

        _.each(fonts, function (font) {
            items.push({
                text: font[0],
                style: font[1].indexOf('dings') == -1 ? 'font-family:' + font[1] : '',
                value: font[1]
            });
        });
        return items;
    }

    var defaultButtons = {
        "bold": {
            title: "bold",
            cls: "u-btnicon-bold",
            cmd: "bold",
            value: null,
            disabled: false,
            needValue: false
        },
        "italic": {
            title: "italic",
            cls: "u-btnicon-italic",
            cmd: "italic",
            value: null,
            disabled: false,
            needValue: false
        },
        "underline": {
            title: "underline",
            cls: "u-btnicon-underline",
            cmd: "underline",
            value: null,
            disabled: false,
            needValue: false
        },
        "fontFamily": {
            title: "font-family",
            cls: "u-btnicon-font",
            cmd: "fontname",
            value: null,
            disabled: false,
            items: getFontFamilies(),
            needValue: true
        },
        "fontSize": {
            title: "font-size",
            cls: "u-btnicon-font-size",
            cmd: "fontsize",
            value: null,
            disabled: false,
            items: [{
                text: '10pt',
                style: 'font-size: 10pt;',
                value: '10pt'
            }, {
                text: '12pt',
                style: 'font-size: 12pt;',
                value: '12pt'
            }, {
                text: '14pt',
                style: 'font-size: 14pt;',
                value: '14pt'
            }, {
                text: '16pt',
                style: 'font-size: 16pt;',
                value: '16pt'
            }, {
                text: '18pt',
                style: 'font-size: 18pt;',
                value: '18pt'
            }],
            hasCustom: true,
            needValue: true
        },
        "textColor": {
            title: "text-color",
            cls: "u-btnicon-text-color",
            cmd: "mceFontcolor",
            value: null,
            colorPicker: true,
            disabled: false,
            needValue: true
        },
        "backgroundColor": {
            title: "background-color",
            cls: "u-btnicon-background-color",
            cmd: "mceBackcolor",
            value: null,
            colorPicker: true,
            disabled: false,
            needValue: true
        },
        "textAlign": {
            title: "text-align",
            cls: "u-btnicon-text-align",
            cmd: null,
            value: null,
            disabled: false,
            items: [{
                text: '左对齐',
                style: '',
                value: 'JustifyLeft'
            }, {
                text: '居中对齐',
                style: '',
                value: 'JustifyLeft'
            }, {
                text: '右对齐',
                style: '',
                value: 'JustifyRight'
            }],
            needValue: true
        },
        "textHeight": {
            title: "text-height",
            cls: "u-btnicon-text-height",
            cmd: "mceLineHeight",
            value: null,
            disabled: false,
            items: [{
                text: '10pt',
                style: 'font-size: 10pt;',
                value: '10pt'
            }, {
                text: '12pt',
                style: 'font-size: 12pt;',
                value: '12pt'
            }, {
                text: '14pt',
                style: 'font-size: 14pt;',
                value: '14pt'
            }, {
                text: '16pt',
                style: 'font-size: 16pt;',
                value: '16pt'
            }, {
                text: '18pt',
                style: 'font-size: 18pt;',
                value: '18pt'
            }],
            hasCustom: true,
            needValue: true
        },
        "link": {
            title: "link",
            cls: "u-btnicon-link",
            cmd: null,
            value: null,
            dialog: {
                items: [{
                    type: "text",
                    text: "文字:",
                    id: "_text"
                }, {
                    type: "text",
                    text: "链接:",
                    id: "_href"
                }],
                onSave: function (dg, editor) {
                    editor.execCommand("setMailLink", dg);
                },
                onShow: function (dg, editor) {
                    editor.execCommand("showMailLink", dg);
                }
            },
            needValue: false
        },
        "undo": {
            title: "undo",
            cls: "u-btnicon-undo",
            cmd: "undo",
            value: null,
            state: function (ed) {
                if (tinyMCE.isIE && ed.getContent({format: "raw"}) === '<br data-mce-bogus="1">') {
                    return false;
                }
                return ed.undoManager.hasUndo();
            },
            needValue: false
        },
        "redo": {
            title: "redo",
            cls: "u-btnicon-redo",
            cmd: "redo",
            value: null,
            state: function (ed) {
                return ed.undoManager.hasRedo();
            },
            needValue: false
        }
    };

    return declare(_WidgetBase, {
        baseClass: "mail-editor",
        templateString: template,
        _widgetsInTemplate: true,
        //private
        src: null,
        height: null,
        plugins: null,
        toolbar: null,
        contentCss: null,
        //widgets
        _toolbar: null,
        _editor: null,
        _tinymceContainer: null,
        init: function () {
            this.inherited(arguments);
            this._buttons = {};
            this._initToolBar();
            this._initButtons();
            this._initPlugins();
            this.emit("init", this);
            return this;
        },
        _initToolBar: function () {
            var self = this;
            _.each(this.toolbar, function (name) {
                self._toolbar.addItem(name);
            });
            self._toolbar.main = self;
        },
        _initButtons: function () {
            var self = this;
            var config = {
                title: "",
                cls: "",
                cmd: "",
                hasCustom: "",
                items: null,
                disabled: false,
                colorPicker: false,
                needValue: false
            };
            _.each(defaultButtons, function (btn, name) {
                self._buttons[name] = new Button(_.extend({
                    onClick: function (value, c) {
                        // Execute editor command based on data parameters
                        var val = value || btn.value,
                            cmd = btn.cmd;
                        if (val instanceof Object) {
                            val = btn.value
                        }
                        if (typeof value === "string") {
                            cmd = cmd || value || c
                        }
                        if (((btn.needValue && val) || !btn.needValue) && cmd && (val || !btn.items)) {
                            if (btn.state && !btn.state(self._editor)) {
                                return false;
                            }
                            self.execCommand(cmd, val);
                        }
                    }
                }, config, btn));
                self._toolbar.initItem(self._buttons[name], name);
            });
        },
        _initPlugins: function () {
            pluginManager.addComponents(this.plugins, this);
        },
        getBody: function () {
            return this._editor.getBody();
        },
        getEditor: function () {
            return this._editor;
        },
        getToolbar: function () {
            return this._toolbar;
        },
        render: function () {
            this.inherited(arguments);
        },
        startup: function () {
            this.buildEditor();
            return this;
        },
        buildEditor: function () {
            var self = this;
            setTimeout(function () {
                tinymce.init({
                    mode: "exact",
                    //no_events: true,
                    elements: "tinymceIframe",
                    plugins: "preview,insertMailWidget,lineHeight,fontcolor,backcolor,mailLink,paste", //,autosave
                    content_css: self.contentCss,
                    object_resizing: false,
                    browser_spellcheck: false,
                    //trim_span_elements:false,
                    schema: "html5",
                    menubar: false,
                    //force_p_newlines: true,
                    forced_root_block: "",
                    //remove_internals:false,
                    //end_container_on_empty_block:true,
                    setup: function (ed) {
                        ed.on('keydown', function (e) {
                            //BACKSPACE: 8,
                            //DELETE: 46,
                            var isForward = e.keyCode == 46, isMeta = e.metaKey || (e.ctrlKey && !e.altKey) || e.shiftKey,
                                rng = ed.selection.getRng(), container = rng.startContainer, endContainer = rng.endContainer, offset = rng.startOffset, node = ed.selection.getNode();
                            if (e.keyCode >= 113 && e.keyCode <= 123)return;
                            if (!isMeta && (!$(container).closest(".widget").length || $(container).closest(".noneditable").length
                                || ($(container).closest(".widget").get(0) != $(endContainer).closest(".widget").get(0)) || node.tagName.toLowerCase() === "img" || $(ed.selection.getSelectedBlocks()).is(".noneditable"))) {
                                e.preventDefault();
                                return false;
                            }
                            if (!e.isDefaultPrevented(e) && $(container).closest(".widget div").find("p").length === 1) {
                                if (isForward || e.keyCode == 8) {
                                    // Ignore non meta delete in the where there is text before/after the caret
                                    if (!isMeta && container.nodeType == 3) {
                                        if (rng.collapsed) {
                                            if (container.nodeValue && (!isForward && offset == 1 && container.nodeValue.length === 1 ) || (isForward && offset === 0 && container.nodeValue.length == 1 && rng.endOffset == 0 )) {
                                                e.preventDefault();
                                                rng.setStart(container, 0);
                                                rng.setEnd(container, container.nodeValue.length);
                                                ed.selection.setRng(rng);
                                                ed.selection.setContent("&nbsp;");
                                                rng.setStart(container, 0);
                                                rng.setEnd(container, 0);
                                                ed.selection.setRng(rng);
                                            }
                                        } else if ((!isForward && offset == 0) || ( container.nodeValue && isForward && rng.endOffset >= container.nodeValue.length)) {
                                            e.preventDefault();
                                            ed.selection.setContent("&nbsp;");
                                            rng.setStart(container, 0);
                                            rng.setEnd(container, 0);
                                            ed.selection.setRng(rng);
                                        }
                                    } else if (container.tagName.toLowerCase() === "p") {
                                        //e.preventDefault();
                                    }
                                    //customDelete(isForward);
                                } else {
                                    if (!isMeta) {
                                        if (container.nodeValue && offset == 0 && rng.endOffset >= container.nodeValue.length) {
                                            ed.selection.setContent("&nbsp;");
                                            rng.setStart(container, 0);
                                            rng.setEnd(container, 0);
                                            ed.selection.setRng(rng);
                                            //e.preventDefault();
                                        }
                                    }
                                }
                            }
                        });
                    },
                    theme: function (editor, target) {
                        var dom = tinymce.DOM,
                            editorContainer;
                        // Generate UI
                        editorContainer = $(target).prependTo(self._tinymceContainer).next();

                        // Set editor container size to target element size
                        dom.setStyle(editorContainer, 'width', target.offsetWidth);
                        // Register state change listeners
                        editor.on('init', function () {
                            tinymce.each(self._toolbar.buttons, function (button) {
                                if (button.cmd) {
                                    editor.formatter.formatChanged(button.cmd, function (state) {
                                        self._toolbar.state(button.cmd, state);
                                    });
                                }
                            });
                        });

                        // Return editor and iframe containers
                        return {
                            editorContainer: editorContainer[0],
                            iframeContainer: editorContainer.children().eq(-1),

                            // Calculate iframe height: target height - toolbar height
                            iframeHeight: self.height - editorContainer.first().outerHeight() - 2
                        };
                    },
                    init_instance_callback: function (ed) {
                        self._editor = ed;
                        $.ajax({
                            type: "get",
                            url: self.src,
                            dataType: "html",
                            success: function (result) {
                                if (result.length === 0 || /^\s+$/.test(result)) {
                                    result = '<br data-mce-bogus="1">';
                                }
                                ed.setContent(result, {
                                    format: "raw"
                                });
                                self.emit("init", ed.contentDocument);
                                ed.on("BeforeSetContent", function () {
                                    self.emit("beforeSetContent", ed);
                                });
                                ed.on("SetContent", function () {
                                    self.emit("afterSetContent", ed);
                                });
                                ed.on("undo", function () {
                                    self.emit("afterUndoRedo", ed);
                                });
                                ed.on("redo", function () {
                                    self.emit("afterUndoRedo", ed);
                                });
                            }
                        });
                    },
                    exit_onexitcallback: function (ed) {
                        //ed.save();
                        //ed.remove();
                        //self.emit("exit", ed);
                    }
                })
            }, 0);
        },
        focus: function () {
            this._editor.focus();
        },
        getHtml: function () {
            return this._editor.getContent({
                format: "raw"
            });
        },
        preview: function (w, h) {
            this._editor.settings.plugin_preview_width = w;
            this._editor.settings.plugin_preview_height = h;
            this.execCommand("mcePreview");
        },
        edit: function () {

        },
        append: function (html) {
            this.execCommand('mceInsertMailWidget', html);
        },
        insert: function (html) {
            this._editor.insertContent(html, {
                format: "raw"
            });
        },
        setContent: function (html) {
            this._editor.execCommand("mceSetContent", 0, html);
        },
        hasChange: function () {
            return this._editor.undoManager.hasUndo() || this._editor.undoManager.hasRedo();
        },
        execCommand: function (name, value) {
            this._editor.execCommand(name, 0, value);
        },
        exit: function () {
            this._editor && this._editor.execCommand("mceExit");
            this._editor = null;
        },
        destroy: function () {
            this.inherited(arguments);
            this._toolbar.destroy();
            this._editor.remove();
            delete this._tinymceContainer;
            delete this._editor;
            delete this._toolbar;
            delete this.plugins;
            delete this.toolbar;
            delete this.contentCss;
            delete this._buttons;
        }
    });
});
