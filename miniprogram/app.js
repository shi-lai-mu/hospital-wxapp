App({
  /**
   * 公共数据
   */
  globalData: {
    version: "0.5.5 [Alpha]",
    title: "康达互联网医院",

    // 域名
    ip: "http://107.173.140.29/",

    // 接口
    url: {
      // 登录
      login: "login/",
      // 注册
      register: "register/",
      // 获取用户信息
      accountData: "getUserDetail/?token=",
      // 绑定到主系统[第一步]
      existAccount: "bindExistAccount/",
      // 绑定到主系统[第二步]
      finishBind: "finishBind/",
      // 搜索医生
      searchDoctor: "searchDoctor"
    }
  },

  onLaunch: function() {
    wx.cloud.init();
  },

  /**
   * 请求函数封装
   */
  request: function(data, type, callback) {
    let url = this.globalData.ip + (this.globalData.url[type] ? "api/" + this.globalData.url[type] : type),
      post = (typeof data == "string");
    let req = wx.request({
      url: url + (post ? data : ""),
      method: post ? "GET" : "POST",
      data: post ? false : data,
      success: res => {
        callback && (!res.error ? callback(res) : callback(false));
      }
    });
    console.log("发送请求 <" + (new Date().toTimeString()) + ">: ", req);
  },

  /**
   * 设置顶部封装
   */
  bar: function(json, value) {
    value ? setBar(value, json) : Object.keys(json).forEach((val, key) =>
      setBar.apply(this, [val, json[val]])
    );

    function setBar(key, val) {
      key == 'title' ?
        wx.setNavigationBarTitle({
          title: `${this.globalData.title} - ${val}`
        }) :
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: val,
        });
    }
  }
});