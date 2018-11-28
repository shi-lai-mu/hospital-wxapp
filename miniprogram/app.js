App({
  /**
   * 公共数据
   */
  globalData: {
    version: "0.5.5 [Alpha]",

    // 域名
    ip: 'http://107.173.140.29/',

    // 接口
    url: {
      // 登录
      login: 'login/',
      // 注册
      register: 'register/',
      // 获取用户信息
      accountData: 'getUserDetail/?token=',
      // 绑定到主系统[第一步]
      existAccount: 'bindExistAccount/',
      // 绑定到主系统[第二步]
      finishBind: 'finishBind/',
      // 搜索医生
      searchDoctor: 'searchDoctor'
    }
  },

  onLaunch: function () {
    wx.cloud.init();
  },

  /**
   * 请求函数封装
   */
  request: function (data, type, callback) {
    let url = this.globalData.ip + (this.globalData.url[type] ? 'api/' + this.globalData.url[type] : type),
      post = (typeof data == 'string');
    console.log(post)
    let req = wx.request({
      url: url + (post ? data : ""),
      method: post ? 'GET' : 'POST',
      data: post ? false : data,
      success: res => {
        callback && (!res.error ? callback(res) : callback(false));
      }
    });
    console.log('发送请求 <' + (new Date().toTimeString()) + '>: ', req);
  }
});
