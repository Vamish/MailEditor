define([
    "jquery",
    "underscore"
], function ($, _) {
    var plugins = [], splice = [].splice;
    return {
        addComponents: function (plugins, editor) {
            var modules = _.map(plugins,function (it) {
                plugins[it]=true;
                return "Editor/plugins/" + it + "/plugin";
            });
            require(modules, function () {
                var items = splice.call(arguments, 0);
                _.each(items, function (itemCtor) {
                    itemCtor(editor);
                });
            });
        }
    }
});