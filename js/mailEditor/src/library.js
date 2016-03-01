define([
    "jquery",
    "base/topic"
], function ($, topic) {
    function initLibrary(doc) {
        var $doc=$(doc);

        function ajaxDo(el, event) {
            var url = el.dataset["codeUrl"];
            $.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
                success: function (res) {
                    if (res["Success"]) {
                        topic.publish(event, {target: res["Model"]});
                    }
                    else {
                        var msg = res["Messages"].join(";");
                        alert(msg);
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            });
        }

        function insertMaterial(e) {
            ajaxDo(e.currentTarget, "workspace/library/insert/material");
            e.stopPropagation();
        }

        function insertMail(e) {
            ajaxDo(e.currentTarget, "workspace/library/insert/mail");
            e.stopPropagation();
        }

        function insertImage(e) {
            ajaxDo(e.currentTarget, "workspace/library/insert/image");
            e.stopPropagation();
        }

        $doc.on("click", "#material-lib-tab .material-item-list li a", insertMaterial);
        $doc.on("click", "#mail-lib-tab .mail-item-list li a", insertMail);
        $doc.on("click", "#photo-lib-tab .photo-item-list li a", insertImage);
        $.fn.tab.call($(".photo-library a,.mail-library a,.material-library a"));
        return {
            showMail: function () {
                $(".mail-library a").data('bs.tab').show()
            },
            showImage: function () {
                $(".photo-library a").data('bs.tab').show()
            },
            showMaterial: function () {
                $(".material-library a").data('bs.tab').show()
            }
        }
    }

    return {
        init: initLibrary
    };
});