define([
    "jquery",
    "app/Box/Lighter/Lighter",
    "app/Box/Toolbar/Toolbar",
    "app/Box/ToolItem/DeleteItem",
    "app/Box/ToolItem/DragItem",
    "app/Box/ImagePicker/ImagePicker",
    "app/Box/ColorPicker/ColorPicker",
    "base/topic",
    "app/dom-geometry"
], function ($, Lighter, Toolbar, DeleteItem, DragItem, ImagePicker, ColorPicker, topic, geom) {

    var wind = window,
        $wind = $(wind),
        doc = wind.document,
        $doc = $(doc),
        body = doc.body,
        $body = $(body),
        dragging = false,
        vars = {
            delete_widget_confirm: "Are you sure you want to delete this widget?"
        },
        handlers = [],
        $ph = $('<div class="editor-status editor-placeholder"></div>'),
        $eWind, eDoc, eBody, $eDoc, $eBody, hover, toolbar, $cntr, cntr, delItem, dragItem, colorPicker, imgPicker, overWidgetEl, editor, fix, $iframe, origClientY;

    function bind(el) {
        var $el = $(el), offset = el.getBoundingClientRect();
        fix = getFix();
        hover.mask(el, fix);
        toolbar.show(offset.left + $el.outerWidth() + fix.left, offset.top + fix.top);
    }

    function unbind() {
        toolbar.hide();
        hover.unmask();
    }

    function _createPlaceHolder(refEl) {
        return $ph.css({
            height: $(refEl).height(),
            width: $(refEl).width()
        });
    }

    function getFix() {
        return $iframe.offset();
    }

    function hideDown() {
        $(".u-btn-grid .dropdown").hide();
    }

    function run(options) {
        var self = this;
        this.opts = $.extend({}, options);
        eDoc = this.opts.doc;
        editor = this.opts.editor;
        $iframe = this.opts.$iframe;
        $eWind = $(eDoc.defaultView || eDoc.parentWindow);
        $eDoc = $(eDoc);
        eBody = eDoc.body;
        $eBody = $(eBody);
        fix = getFix();
        $cntr = $("<div id='__container' style=\"position:absolute;\"></div>").prependTo(body);
        cntr = $cntr.get(0);
        hover = new Lighter({
            borderStyle: "dotted",
            borderColor: "#00b3ef",
            borderWidth: 2
        }).appendTo(cntr).startup();

        toolbar = new Toolbar().appendTo(cntr).startup();
        dragItem = new DragItem({
            callback: function (e) {
                var self = this;
                if (!dragging) {
                    var el = overWidgetEl, $el = $(el), width = $el.width(), topFix = 5, leftFix = 5;
                    var scrollTop = $eDoc.scrollTop();
                    var $placeHolder = _createPlaceHolder(el).insertAfter(el);
                    $eBody.addClass('mail-drag-active');
                    fix = getFix();
                    dragging = true;
                    origClientY = e.pageY + topFix - fix.top + scrollTop;
                    $el.addClass('mail-dragged').css({
                        width: width,
                        left: e.pageX - width + leftFix - fix.left,
                        top: origClientY
                    });
                    bind(el);
                    var scrollSensitivity = 80, scrollSpeed = 20;
                    $eDoc.on("mousemove.mail-widget-drag", function (e) {
                        $el.css({
                            left: e.pageX - width + leftFix,
                            top: e.pageY + topFix
                        });
                        bind(el);

                        var $oel = $(overWidgetEl).parents("table.widget"),
                            height = $oel.height(), offset = $oel.offset(),
                            pageY = e.pageY, clientY = e.clientY,
                            middleY = (offset.top + height / 2);

                        if (pageY > middleY) {
                            $placeHolder.parents("table.widget").insertAfter($oel);
                        } else {
                            $placeHolder.parents("table.widget").insertBefore($oel);
                        }

                        scrollTop = $eDoc.scrollTop();
                        var fr = $doc.find("#tinymceIframe_ifr").get(0);
                        var frRect = fr.getBoundingClientRect(), up;

                        if ((clientY - scrollSensitivity) < 0 && frRect.top - editor.getToolbar().height < 0) {
                            up = scrollTop - scrollSpeed;
                            $eDoc.scrollTop(up);
                            if ($eDoc.scrollTop() === 0) {
                                $doc.scrollTop($doc.scrollTop() - scrollSpeed);
                            }
                        } else if ((clientY - scrollSensitivity) < 0 && $eDoc.scrollTop() > 0) {
                            up = scrollTop - scrollSpeed;
                            $eDoc.scrollTop(up);
                        } else if (origClientY <= clientY && (clientY + $placeHolder.height() ) >= eDoc.documentElement.clientHeight - frRect.top) {
                            $eDoc.scrollTop(scrollTop + scrollSpeed / 3);
                            $doc.scrollTop($doc.scrollTop() + scrollSpeed / 3);
                        }
                        origClientY = clientY;
                    }).on("mouseup.mail-widget-drag", function () {
                        $eDoc.off("mousemove.mail-widget-drag").off("mouseup.mail-widget-drag");
                        $eBody.removeClass('mail-drag-active');
                        var offset = $placeHolder.offset();
                        unbind();
                        colorPicker.hide();
                        $el.animate({
                            left: offset.left + leftFix,
                            top: offset.top + topFix
                        }, 400, 'swing', function () {
                            $el.removeClass('mail-dragged').css({
                                width: '',
                                left: '',
                                top: ''
                            });
                            $placeHolder.replaceWith(el);
                            dragging = false;
                            //  editor.nodeChanged({target: body});
                        });
                    }).on("mouseleave", function (e) {

                    });
                }
                e.preventDefault();
            }
        });
        delItem = new DeleteItem({
            callback: function (e) {
                //if (wind.confirm(vars.delete_widget_confirm)) {
                if (!dragging) {
                    var $el = $(overWidgetEl), $wg = $el.parents("table.widget");
                    var count = $wg.find(" > tbody > tr > td").length;
                    if (count === 1) {
                        $wg.remove();
                    } else {
                        $el.parents("table.widget > tbody > tr > td").remove();
                    }
                    setTimeout(function () {
                        unbind();
                        colorPicker.hide();
                    }, 0);
                }
                e.preventDefault();
            }
            //}
        });
        toolbar.addItem(dragItem);
        toolbar.addItem(delItem);
        imgPicker = new ImagePicker();
        colorPicker = new ColorPicker();
        imgPicker.appendTo(cntr).startup();
        colorPicker.appendTo(cntr).startup();
        $eDoc.on("mouseover", "table.widget td", function () {
            var ct = $(this).find(".widget-container").get(0);
            if (overWidgetEl != ct && !colorPicker.colorShowing) {
                // imgPicker.hide();
                colorPicker.hide();
            }
            overWidgetEl = ct;
            if (!dragging && !colorPicker.colorShowing && overWidgetEl) {
                bind(overWidgetEl);
            }
        }).on("mouseleave", "table.widget", function (e) {
            //if (!dragItem.dragging
            //    && !hover.domNode.contains(e.toElement)
            //    && !cntr.contains(e.toElement)
            //    && !imgPicker.domNode.contains(this)) {
            //    unbind();
            //    imgPicker.hide();
            //}
        }).on("click", "table.widget img", function (e) {
            var $this = $(this), offset = this.getBoundingClientRect(), topFix = 2;
            imgPicker.hide();
            imgPicker.setImg(this);
            imgPicker.show(offset.left + fix.left, offset.top + fix.top + $this.height() + topFix);
            colorPicker.hide();
            hideDown();
            topic.publish("workspace/box/show/img/picker", {target: this});
            e.preventDefault();
            e.stopPropagation();
        }).on("mousedown", "table.widget img", function (e) {
            e.preventDefault();
            e.stopPropagation();
        }).on("click", ":not(img)", function (e) {
            var $this = $(this), $ct = $this.closest(".widget-container");
            if (!imgPicker.domNode.contains(this)) {
                imgPicker.hide();
            }
            colorPicker.hide();
            if ($ct.length) {
                colorPicker.show({
                    node: e.target,
                    root: $ct.get(0),
                    fix: getFix()
                });
            }
            hideDown();
            e.preventDefault();
            e.stopPropagation();
        }).on("click", function () {

        });

        $doc.on("click", ":not(.u-btn-grid >,.u-btn-grid)", function (e) {
            var dr = $(".u-btn-grid .dropdown:visible");
            if (dr.length && $(e.target).is(":not(.u-btn-grid :text,.u-btn-grid >,.u-btn-grid)")) {
                dr.hide();
            }
        }).on("mouseup", function () {
            $eDoc.trigger("mouseup.mail-widget-drag");
        });
        handlers = handlers.concat([
            topic.subscribe("workspace/library/insert/material", function (e) {
                editor.append(e.target.code);
                //setTimeout(function(){
                //    $eBody.find("table.widget:last").focus();
                //},50);
            }),
            topic.subscribe("workspace/library/insert/mail", function (e) {
                editor.setContent(e.target.code);
            }),
            topic.subscribe("workspace/library/insert/image", function (e) {
                if (imgPicker.isShow) {
                    imgPicker.replace(e.target.code);
                    colorPicker.hide();
                    hover.el && bind(hover.el);
                }
            }),
            topic.subscribe("workspace/ifame/dom/ready", function (e) {
                editor.edit();
            })
        ]);
        handlers = handlers.concat([
            editor.on("beforeSetContent", function (ed) {
                unbind();
                imgPicker.hide();
                colorPicker.hide();
            }),
            editor.on("afterSetContent", function (ed) {

            }),
            editor.on("afterUndoRedo", function (ed) {
                var $elDragging = $eDoc.find(".mail-dragged"), $placeHolder = $eDoc.find(".editor-placeholder");
                if ($elDragging.length) {
                    $elDragging.removeClass('mail-dragged').css({
                        width: '',
                        left: '',
                        top: ''
                    });
                    $placeHolder.replaceWith($elDragging);
                }
            })
        ]);
        $wind.on("resize", function () {
            imgPicker.hide();
            hover.el && bind(hover.el);
            colorPicker.show({fix: getFix()});
        });

        $eWind.on("scroll", function () {
            imgPicker.hide();
            colorPicker.hide();
            unbind();
        });
    }

    return {
        run: run,
        cleanup: function () {
            editor && editor.exit();
            toolbar && toolbar.destroy();
            hover && hover.destroy();
            imgPicker && imgPicker.destroy();
            colorPicker && colorPicker.destroy();
            $cntr.remove();
            editor = null;
            toolbar = null;
            hover = null;
            $cntr = null;
            cntr = null;
            overWidgetEl = null;
            $iframe = null;
            this.opts.onCleanup && this.opts.onCleanup.apply(this);
        }
    };
});
