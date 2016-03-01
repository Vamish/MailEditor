define([
    "jquery",
    "underscore",
    "base/declare",
    "base/_WidgetBase",
    "./ToolbarItem",
    "Editor/DownList/DownList",
    "Editor/ColorPicker/ColorPicker",
    "Editor/DownDialog/DownDialog",
    "text!./Toolbar.html"
], function ($, _, declare, _WidgetBase, ToolbarItem, DownList, ColorPicker, DownDialog, template) {
    var ap = Array.prototype,
        slice = ap.slice;

    var colors = [
        ['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500', '#009900'],
        ['#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF', '#337FE5', '#003399'],
        ['#4C33E5', '#9933E5', '#CC33E5', '#EE33EE', '#FFFFFF', '#CCCCCC', '#999999'],
        ['#666666', '#333333', '#000000']
    ];
    return declare(_WidgetBase, {
        baseClass: "mail-editor-toolbar",
        templateString: template,
        height: 50,
        buttonContainer: null,
        linkButtonContainer: null,
        main: null,
        //_widgetsInTemplate: true,
        init: function () {
            this.inherited(arguments);
            this.items = {};
            this.buttons = [];
            return this;
        },
        addItem: function (name) {
            this.items[name] = new ToolbarItem();
        },
        initItem: function (widget, name) {
            var self = this, toolbarItem = this.items[name], dl;
            if (toolbarItem) {
                widget.appendTo(toolbarItem.rendering(widget.type == "button" ? "u-btn-grid" : "u-linkbtn-grid").domNode);
                toolbarItem.appendTo(this[widget.type + "Container"]);
                function createDownList() {
                    if (widget.items) {
                        dl = new DownList({
                            items: widget.items,
                            hasCustom: widget.hasCustom
                        }).appendTo(toolbarItem.domNode);
                        dl.on("itemClick", function (e) {
                            widget.onClick($(e.currentTarget).attr("value") || ($(e.currentTarget).val() + dl.suffix));
                        });
                    }
                }

                function createColorPicker() {
                    if (widget.colorPicker) {
                        dl = new ColorPicker({colors: colors}).appendTo(toolbarItem.domNode);
                        dl.on("colorSelect", function (e) {
                            widget.onClick(e.currentTarget.title || (dl.prefix + e.currentTarget.value));
                        });
                    }
                }

                function createDialog() {
                    if (widget.dialog) {
                        var dg = widget.dialog;
                        dl = new DownDialog({items: dg.items}).appendTo(toolbarItem.domNode);
                        dl.on("save", function (e) {
                            dg.onSave && dg.onSave(dl, self.main);
                        });
                        dl.on("cancel", function (e) {

                        });
                        widget.on("show", function (e) {
                            dg.onShow && dg.onShow(dl, self.main);
                        });
                    }
                }

                function initToggle() {
                    widget.on("click", function (wg) {
                        var $d = $(wg.domNode).siblings(".dropdown");
                        var isShow = !$d.is(":visible ");
                        $(".u-btn-grid .dropdown").hide();
                        $d.toggle(isShow);
                        widget.emit("show", self);
                    });
                }

                createDownList();
                createColorPicker();
                createDialog();
                initToggle();
                this.buttons.push(widget);
            }
        },
        state: function (name, val) {
            if (this.items[name]) {
                this.items[name].domNode.style.backgroundColor = val ? "#d1d1d1" : ""
            }
        },
        startup: function () {
            this.inherited(arguments);
            return this;
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.items;
            delete this.buttonContainer;
            delete this.linkButtonContainer;
            delete this.main;
            delete this.buttons;
        }
    });
});
