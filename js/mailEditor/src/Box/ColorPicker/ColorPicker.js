define([
    "jquery",
    "base/declare",
    "base/_WidgetBase"
], function ($, declare, _WidgetBase) {

    var colorIgnore = ["rgb(39, 38, 54)", "rgba(0, 0, 0, 0)", "#fff", "rgb(255, 255, 255)"];
    var elemIgnore = ["span", "font"];
    var listenerSelector = "color-listener";
    var onlyStyleSelector = "only-styles";

    function _convertColor(tinycolor) {
        if (!tinycolor) {
            return "transparent";
        }
        var value = tinycolor.toHexString();
        if (tinycolor._a == 0) {
            value = "transparent";
        } else if (tinycolor._a < 1) {
            value = tinycolor.toRgbString();
        }
        return value;
    }

    function getMatchedCSSRules(el) {
        el = el || this.element;
        if (!el) {
            return {};
        }
        var dom = el.ownerDocument;
        if (!dom) {
            return {};
        }
        //if (dom.defaultView.getMatchedCSSRules !== undefined) {
        //    return dom.defaultView.getMatchedCSSRules(el, null);
        //} else {
        var styles = dom.styleSheets,
            result = {};
        for (var s = 0; s < styles.length; s++) {
            var styleSheet = styles[s],
                cssRules = styleSheet.cssRules;

            for (var c = 0; c < cssRules.length; c++) {
                var cssRule = cssRules[c];
                if ($(cssRule.selectorText, dom).is(el)) {
                    result[Object.keys(result).length] = cssRule;
                }
            }
        }
        result["length"] = Object.keys(result).length;
        return result;
        //}
    }


    function getOwnStyle(el, styles) {
        var doc = el.ownerDocument,
            style = el.style,
            s = getMatchedCSSRules(el);
        var result = {};
        _.each(styles, function (st) {
            _.each(s, function (CssRule) {
                if (CssRule.style[st] && colorIgnore.indexOf(CssRule.style[st]) === -1) {
                    result[st] = CssRule.style[st];
                    result["has"] = true;
                }
            });
            if (style[st] && colorIgnore.indexOf(style[st]) === -1) {
                result[st] = style[st];
                result["has"] = true;
            }
        });
        return result || {};
    }

    return declare(_WidgetBase, {
        baseClass: "mail-toolbar-color-picker",
        templateString: "<div  style=\"position:absolute;z-index: 3; width: 54px;\"><input   data-kb-attach-point='_colorNode'></div>",
        colorShowing: false,
        node: null,
        root: null,
        isShow: false,
        _colorNode: null,
        _styles: null,
        init: function () {
            this.inherited(arguments);
            this._initSpectrum();
        },
        _initSpectrum: function () {
            var self = this;
            $(this._colorNode).spectrum({
                color: "#f9c502",
                showInput: true,
                containerClassName: "full-spectrum",
                showInitial: true,
                showPalette: true,
                showButtons: false,
                togglePaletteOnly: true,
                showSelectionPalette: true,
                showAlpha: true,
                maxPaletteSize: 6,
                maxSelectionSize: 6,
                showPaletteOnly: true,
                togglePaletteMoreText: "+",
                togglePaletteLessText: "-",
                preferredFormat: "hex",
                localStorageKey: false,
                palette: [
                    ["rgb(204, 0, 51)", "rgb(247, 148, 30)", "rgb(0, 102, 102)", "rgb(0, 0, 204)", "rgb(0, 159, 227)", "rgb(249, 197, 2)"]
                ],
                move: function (tinycolor) {
                    self.setNodeColor(_convertColor(tinycolor));
                },
                change: function (tinycolor) {
                    self.setNodeColor(_convertColor(tinycolor));
                    // self.emit("spectrumHide", self, tinycolor);
                },
                hide: function (tinycolor) {
                    self.colorShowing = false;
                    self.emit("spectrumHide", self, tinycolor);
                },
                cancelClick: function () {
                    self.reset();
                },
                okClick: function () {

                }
            }).on('show.spectrum', function () {
                self.colorShowing = true;
                self.emit("colorShow");
            });
        },
        _initColor: function () {
            var self = this;
            _.each(this._styles, function (value, name) {
                if (name !== "has") {
                    self.color = value;
                }
            });
            this.setSpectrumColor(this.color);
        },
        _show: function (fix) {
            var $node = $(this.node),
                offset = this.node.getBoundingClientRect();
            $(this.domNode).css({
                left: offset.left + fix.left,
                top: offset.top + fix.top + $node.outerHeight()
            }).show();
            $(this._colorNode).spectrum("hide");
            //offset.left + fix.left, offset.top + fix.top + $el.height()
        },
        show: function (o) {
            var def = {
                    node: this.node,
                    root: this.root
                },
                conf = _.extend(def, o);
            this.clear();
            this._setNode(conf.node, conf.root);
            if (this._styles) {
                this._initColor();
                this._show(conf.fix);
            }
            this.isShow = true;
            return this;
        },
        hide: function () {
            $(this.domNode).hide();
            $(this._colorNode).spectrum("hide");
            this.isShow = false;
            return this;
        },
        startup: function () {
            this.hide();
            return this;
        },
        setNodeColor: function (color) {
            var self = this;
            _.each(this._styles, function (value, name) {
                $(self.node).css(name, color);
            });
            this.setListenerColor(color);
        },
        setListenerColor: function (color) {
            var $listeners = $(this.node).find("> [data-" + listenerSelector + "]");
            $listeners.each(function () {
                var $this = $(this), styles = $this.data(listenerSelector).split(",");
                _.each(styles, function (name) {
                    $this.css(name, color);
                })
            });
        },
        setSpectrumColor: function (color) {
            return $(this._colorNode).spectrum("set", color);
        },
        _setNode: function (node, root) {
            var self = this, p = node, tmp = {},
                styles, eg, onlyStyles;
            var s = ["background-color",
                "border-bottom-color",
                "border-top-color",
                "border-left-color",
                "border-right-color"
            ];
            while (p && p != root.parentNode) {
                eg = {};
                if (elemIgnore.indexOf(p.tagName.toLocaleLowerCase()) === -1) {
                    eg = getOwnStyle(p, s);
                    if (eg.has) {
                        this._styles = eg;
                        this.node = p;
                        this.root = root;
                        if ($(p).data(onlyStyleSelector)) {
                            onlyStyles = $(p).data(onlyStyleSelector).split(",");
                            _.each(onlyStyles, function (name) {
                                tmp[name] = self._styles[name];
                            });
                            self._styles = tmp;
                        }
                        break;
                    }
                }
                p = p.parentNode;
            }
        },
        _value: function (value) {
            var self = this;
            if (value) {
                self.color = value;
                $(this._colorNode).spectrum("set", value);
            } else {
                return $(this._colorNode).spectrum("get", value);
            }
        },
        reset: function () {
            return this.setSpectrumColor(this.color);
        },
        clear: function () {
            this._styles = null;
            this.node = null;
            this.root = null;
            this.isShow = false;
        },
        destroy: function () {
            $(this._colorNode).spectrum("destroy");
            this.inherited(arguments);
            delete this._colorNode;
            delete this._styles;
            delete this.node;
            delete this.root;
        }
    });
});
