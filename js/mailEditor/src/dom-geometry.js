define(function () {
    var wind=window;
    return {
        docScroll: function (doc) {
            doc = doc || wind.document;
            var win = doc.defaultView, left = 0, top = 0;

            if ("pageXOffset" in win) {
                left = win.pageXOffset;
                top = win.pageYOffset;
            } else {
                left = doc.documentElement.scrollLeft;
                top = doc.documentElement.scrollTop;
            }

            return {
                left: left,
                top: top
            };
        },
        position: function (el, includScroll) {
            var rect = el.getBoundingClientRect(), left = rect.left, top = rect.top, right = rect.right, bottom = rect.bottom, scroll,
                width = rect.right - rect.left, height = rect.bottom - rect.top;

            if (includScroll) {
                scroll = this.docScroll(el.ownerDocument);
                left += scroll.left;
                top += scroll.top;
            }
            return {
                left: left,
                top: top,
                right: right,
                bottom: bottom,
                width: width,
                height: height
            };
        },
        getComputedStyle: function (el) {
            var s;
            if (el.currentStyle) {
                s = el.currentStyle;
            }
            else {
                s = el.ownerDocument.defaultView.getComputedStyle(el);
            }
            return s || {};
        },

        getMarginExtents: function (el) {
            var cs = this.getComputedStyle(el),
                l = parseFloat(cs.marginLeft) || 0,
                t = parseFloat(cs.marginTop) || 0,
                r = parseFloat(cs.marginRight) || 0,
                b = parseFloat(cs.marginBottom) || 0;

            return {
                l: l,
                t: t,
                r: r,
                b: b,
                w: l + r,
                h: t + b
            }
        },
        getMarginSize: function (el) {
            var me = this.getMarginExtents(el), size = el.getBoundingClientRect();
            return {
                w: size.right - size.left + me.w,
                h: size.bottom - size.top + me.h
            }
        },

        getMarginBox: function (el) {
            var me = this.getMarginExtents(el),
                l = el.offsetLeft - me.l,
                t = el.offsetTop - me.t;
            return {
                l: l,
                t: t,
                w: el.offsetWidth + me.w,
                h: el.offsetHeight + me.h
            };
        },

        getBorderExtents: function (el) {
            var cs = this.getComputedStyle(el), none = "none",
                l = cs.borderLeftStyle != none ? parseFloat(cs.borderLeftWidth) : 0,
                t = cs.borderTopStyle != none ? parseFloat(cs.borderTopWidth) : 0,
                r = cs.borderRightStyle != none ? parseFloat(cs.borderRightWidth) : 0,
                b = cs.borderBottomStyle != none ? parseFloat(cs.borderBottomWidth) : 0;
            return {l: l, t: t, r: r, b: b, w: l + r, h: t + b};
        },

        getPadExtents: function (el) {
            var cs = this.getComputedStyle(el),
                l = parseFloat(cs.paddingLeft),
                t = parseFloat(cs.paddingTop),
                r = parseFloat(cs.paddingRight),
                b = parseFloat(cs.paddingBottom);
            return {
                l: l,
                t: t,
                r: r,
                b: b,
                w: l + r,
                h: t + b
            }
        }
    };
});