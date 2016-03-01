define([
    "jquery",
    "underscore",
    "./declare",
    "./_EventMixin",
    "./_StatefulMixin",
    "./registry",
    "./parser",
    "./_Destroyable"
], function ($, _, declare, _EventMixin, _StatefulMixin,registry, parser, _Destroyable) {
    var attachPointAttr = "data-kb-attach-point",
        attachEventAttr = "data-kb-attach-event";


    function contains(parentNode, childNode) {
        if (parentNode.contains) {
            return parentNode != childNode && parentNode.contains(childNode);
        } else {
            return !!(parentNode.compareDocumentPosition(childNode) & 16);
        }
    }
    function checkHover(e,target){
        return !contains(target,e.relatedTarget) && !(e.relatedTarget===target);
    }

    var _WidgetBase = declare(_Destroyable, {
        id: "",
        baseClass:"",
        styleClass:"",
        domNode: null,
        templateString: null,
        _widgetsInTemplate: false,
        attachScope: null,
        attachPoint: null,
        srcNodeRef: null,
        init: function (params, srcNodeRef) {
            _Destroyable.prototype.init.apply(this,arguments);

            declare.mixin(this, params);

            if (srcNodeRef) {
                if(_.isString(srcNodeRef)){
                    srcNodeRef = $(srcNodeRef).get(0);
                }
                this.srcNodeRef = srcNodeRef;
            }

            this._attachPoints = [];

            if (this.attachScope && this.attachPoint) {
                this.attachScope[this.attachPoint] = this;
                this.attachScope._attachPoints.push(this.attachPoint);
            }
            this.render();

            this._init = true;
            return this;
        },
        template: function () {
            var tmpl = "<div></div>";
            if (this.templateString) {
                this._template = _.template(this.templateString);
                tmpl = this._template(this);
            }
            this.domNode = $.parseHTML(tmpl)[0];
            return this;
        },
        refresh:function(params){
            this._rendeded = false;
            this.init(params, this.domNode);
        },
        //render domNode
        render: function () {
            if (this.srcNodeRef) {
                this.id = this.srcNodeRef.id;
            }
            if (!this.id) {
                this.id = registry.getUniqueId();
            }
            if (!this._rendeded) {
                this._rendeded = true;
                registry.add(this);

                this.template();

                this.domNode.setAttribute("id", this.id);
                this.domNode.setAttribute("data-kb-widget-id", this.id);

                this._attachTemplateNodes(this.domNode);
                this._attachTemplateEvents(this.domNode);

                if (this.srcNodeRef) {
                    this._fillContent(this.srcNodeRef);
                    $(this.srcNodeRef).replaceWith(this.domNode);
                }
            }
            if (this._widgetsInTemplate) {
                parser.parse(this.domNode, this);
            }
            return this;
        },
        _fillContent: function (/*DomNode*/ source) {
            // summary:
            //		Relocate source contents to templated container node.
            //		this.containerNode must be able to receive children, or exceptions will be thrown.
            // tags:
            //		protected
            var dest = this.containerNode;
            if (source && dest) {
                while (source.hasChildNodes()) {
                    dest.appendChild(source.firstChild);
                }
            }
            return this;
        },
        appendTo: function (el) {
            el.appendChild(this.domNode);
            return this;
        },
        prependTo: function (el){
            el.insertBefore(this.domNode,el.firstChild);
            return this;
        },
        //dom节点append到页面之后调用
        startup: function () {
            _.each(this.getChildren(), function (it) {
                it.startup();
            });
            return this;
        },
        _attachTemplateNodes: function (rootNode) {
            var self = this, $rootNode = $(rootNode), prop = $rootNode.attr(attachPointAttr);

            if (prop) {
                self[prop] = rootNode;
                self._attachPoints.push(prop);
            }

            $rootNode.find("[" + attachPointAttr + "]").each(function (ix, it) {
                var $it = $(it);
                if (!$it.attr("data-kb-type")) {
                    prop = $it.attr(attachPointAttr);
                    self[prop] = it;
                    self._attachPoints.push(prop);
                }
            });
            return this;
        },
        _detachTemplateNodes: function () {
            _.each(this._attachPoints, function (it) {
                delete this[it];
            });
            this._attachPoints = [];
            return this;
        },
        _attachTemplateEvents: function (rootNode) {
            var self = this, $rootNode = $(rootNode), prop = $rootNode.attr(attachEventAttr), pairs;

            if (prop) {
                pairs = prop.split(',');
                _.each(pairs, function (part) {
                    var pair = part.split(':'), evName = pair[0], fnName = pair[1];
                    if(evName == "mouseover" || evName == "mouseout"){
                        $rootNode.on(evName, function (e) {
                            if(checkHover(e,this)){
                                self[fnName].apply(self, arguments);
                            }
                        });
                    }else{
                        $rootNode.on(evName, function (e) {
                            self[fnName].apply(self, arguments);
                        });
                    }
                    
                });
            }

            $rootNode.find("[" + attachEventAttr + "]").each(function (ix, it) {
                var $it = $(it);
                prop = $it.attr(attachEventAttr);
                pairs = prop.split(',');
                _.each(pairs, function (part) {
                    var pair = part.split(':'), evName = pair[0], fnName = pair[1];
                    if(evName == "mouseover" || evName == "mouseout"){
                        $it.on(evName, function (e) {
                            if(checkHover(e,this)){
                                self[fnName].apply(self, arguments);
                            }
                        });
                    }else{
                        $it.on(evName, function (e) {
                            self[fnName].apply(self, arguments);
                        });
                    }
                });
            });
            return this;
        },
        getChildren: function () {
            return this.domNode ? registry.findWidgets(this.domNode) : [];
        },
        destroyChildren: function () {
            _.each(this.getChildren(), function (it) {
                it.destroy();
            });
        },
        destroy: function () {
            //if(!this._destroyed){
                _Destroyable.prototype.destroy.apply(this,arguments);
                this._detachTemplateNodes();
                if (this.domNode) {
                    $(this.domNode).remove();
                    this.destroyChildren();
                }
                registry.remove(this.id);
                delete this.domNode;
                delete this._attachPoints;
                delete this._events;
            //}
        }
    });

    var proto = _WidgetBase.prototype;
    declare.mixin(proto, _StatefulMixin);
    declare.mixin(proto, _EventMixin);

    return _WidgetBase;
});