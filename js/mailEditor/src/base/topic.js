define([
    "./_EventMixin"
], function (_EventMixin) {

    var topic = {
        publish: function (topic, data) {
            return _EventMixin.emit.call(this, topic, data);
        },
        subscribe: function (topic, fn) {
            return _EventMixin.on.call(this, topic, fn);
        }
    };

    return topic;
});