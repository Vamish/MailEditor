define([
    "underscore"
], function (_) {
    
    var rdashAlpha = /([a-z])/i;

    function fcamelCase(all, letter) {
        return (letter + "").toUpperCase();
    }

    function camelCase(string) {
        return string.replace(rdashAlpha, fcamelCase);
    }

    return {
        get: function (propName) {
            return this[propName];
        },
        set: function (propName, value) {
            if (typeof propName == "object") {
                var self = this, 
                    props = _.keys(propName);

                _.each(props, function (prop) {
                    self.__set(prop, propName[prop]);
                });

            } else {
                this.__set(propName, value);
            }
        },
        __set: function (propName, value) {
            var setter;
            if (propName in this) {
                setter = "_set" + camelCase(propName) + "Attr";
                if (setter in this) {
                    this[setter](value);
                } else {
                    this[propName] = value;
                }
            }
        }
    };
});
