Page({
  data: {
    shouji: "",
    suo: "",
    phone: ""
  },
  onLoad: function (t) { },
  inputFocus: function (t) {
    var a = {};
    a[t.target.dataset.id] = "changed", this.setData(a);
  },
  inputBlur: function (t) {
    var a = {};
    a[t.target.dataset.id] = t.detail.value ? "nick" : "", this.setData(a);
  },
  login: function () {
    this.setData({
      toast: {
        text: "正在为您绑定微信...",
        icon: "warning",
        hideTime: 3e3
      }
    }), this.setData({
      toast: {
        text: "绑定成功!",
        icon: "success",
        callback: function () {
          wx.switchTab({
            url: "/pages/account/account"
          });
        }
      }
    });
  }
});