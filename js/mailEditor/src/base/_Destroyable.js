define([
    "./declare",
    "underscore"
], function (declare, _) {
    var ap = Array.prototype,slice = ap.slice;
    return declare(null, {
        init: function () {
            this._hdhs = [];
            return this;
        },
        own: function () {
            var self = this, args = slice.call(arguments,0), cleanupMethods = [
                "destroy",
                "remove"
            ];
            _.each(args, function (handle) {
                var destroyMethodName;
                _.each(cleanupMethods, function (cleanupMethod) {
                    if (_.isFunction(handle[cleanupMethod])) {
                        if (!destroyMethodName) {
                            destroyMethodName = cleanupMethod;
                            self._hdhs.push(function () {
                                handle[cleanupMethod]();
                            });
                        }
                    }
                });
            });
            return args;
        },
        _clearHdhs: function () {
            var h;
            while (h = this._hdhs.pop()) {
                h();
            }
        },
        destroy: function () {
            this._destroyed = true;
            this._clearHdhs();
            delete this._hdhs;
        }
    });
});