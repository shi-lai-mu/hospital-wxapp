var t = getApp();

Page({
    data: {
        version: "1.0.0"
    },
    onLoad: function(a) {
        this.setData({
            version: t.globalData.version
        });
    },
    PageErrorNot: function() {
        this.setData({
            toast: {
                text: "此页面正在开发中...",
                icon: "error",
                hideTime: 2e3
            }
        });
    },
    printVersion: function() {
        this.setData({
            toast: {
                text: "VERSION " + t.globalData.version,
                icon: "loading",
                hideTime: 4e3
            }
        });
    }
});