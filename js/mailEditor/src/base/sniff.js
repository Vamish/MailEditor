define(["has"],function(has){
    var n = navigator,
        dua = n.userAgent;

    has.add("chrome", parseFloat(dua.split("Chrome/")[1]) || undefined);
    has.add("quirks", document.compatMode == "BackCompat");

    return has;
});
