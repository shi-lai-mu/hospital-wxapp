App({
  globalData: {
    version: "0.4.5 [Alpha]",
    ip: '107.173.140.29'
  },
  onLaunch: function () {
    wx.cloud.init();
  }
});