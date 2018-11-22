App({
  globalData: {
    version: "0.5.1 [Alpha]",
    ip: 'http://107.173.140.29/',
    url: {
      register: 'register/',
      login: 'login/',
      accountData: 'getUserDetail/?token='
    }
  },
  onLaunch: function () {
    wx.cloud.init();
  },
  request: function (data, type, callback) {
    let url = this.globalData.ip;
    url += this.globalData.url[type] ? 'api/' + this.globalData.url[type] : type;
    url = url + data;
    console.log(url)
    wx.request({
      url: url,
      success: res => {
        callback && !res.error ? callback(res) : callback(false);
      },
      fail: err => new Error(err)
    });
  }
});
