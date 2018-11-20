App({
  globalData: {
    version: "0.5.1 [Alpha]",
    ip: '107.173.140.29'
  },
  onLaunch: function () {
    wx.cloud.init();
  }
});