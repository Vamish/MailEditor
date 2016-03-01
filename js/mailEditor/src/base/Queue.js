define([
    "./declare"
], function(declare) {

    return declare(null, {
        queue: [],
        offset: 0,
        init: function() {
            this.queue = [];
            this.offset = 0;
        },
        //Empty the queue.
        clear: function () {
            this.queue = [];
            this.offset = [];
        },

        // Returns the length of the queue.
        getLength: function() {
            return (this.queue.length - this.offset);
        },

        // Returns true if the queue is empty, and false otherwise.
        isEmpty: function() {
            return (this.queue.length == 0);
        },

        /* Enqueues the specified item. The parameter is:
         *
         * item - the item to enqueue
         */
        enqueue: function(item) {
            this.queue.push(item);
        },

        /* Dequeues an item and returns it. If the queue is empty, the value
         * 'undefined' is returned.
         */
        dequeue: function() {

            // if the queue is empty, return immediately
            if (this.queue.length == 0) return undefined;

            /*
            // store the item at the front of the queue
            var item = queue[offset];

            // increment the offset and remove the free space if necessary
            if (++offset * 2 >= queue.length) {
                queue = queue.slice(offset);
                offset = 0;
            }

            // return the dequeued item
            return item;
            */

            return this.queue.pop();
        },

        /* Returns the item at the front of the queue (without dequeuing it). If the
         * queue is empty then undefined is returned.
         */
        // peek: function() {
        //     return (this.queue.length > 0 ? this.queue[offset] : undefined);
        // },

        peek: function() {
            return (this.queue.length > 0 ? this.queue[this.queue.length-1] : undefined);
        }
    });
});
