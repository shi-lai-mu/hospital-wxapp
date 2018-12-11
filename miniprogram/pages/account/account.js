var app = getApp();

Page({
  data: {

    // 小程序版本
    version: "1.0.0",

    // 用户信息
    userInfo: {
      avatarUrl: "/images/avatar_1.jpg",
      bind_account: {
        zxyy_id: "------",
        patientname: "点击授权"
      }
    }
  },

  onShow: function () {

    wx.getSetting({
      success: setting => {
        if (setting.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: res => {
              this.settingAccount(res, true);
            }
          });
        }
      }
    });

  },

  onLoad: function(a) {

    app.bar({
      title: "我的",
      bgColor: "#b5cfff"
    });

    // 初始化版本
    this.setData({
      version: app.globalData.version
    });

    // 监听数据 同步全局
    Object.defineProperty(this.data, "userInfo", {
      set: data => {
        app.globalData.userInfo = data;
        
      }
    });
  },

  // 页面不存在
  PageErrorNot: function() {
    this.setData({
      toast: {
        text: "此页面正在开发中...",
        icon: "error",
        hideTime: 2e3
      }
    });
  },

  // 提示版本
  printVersion: function() {
    this.setData({
      toast: {
        text: "VERSION " + this.data.version,
        icon: "loading",
        hideTime: 4e3
      }
    });
  },

  // 设置账号
  settingAccount: function(res, load) {
    if (this.data.userInfo) return;

    // 兼容事件处理
    res.detail && (res = res.detail);

    // 检测授权
    if (res.userInfo) {

      // 如果本地已存储数据且没过期则用本地的
      let storage = wx.getStorageSync("userInfo");
      if (storage && storage.endTime > Date.now() / 1000) return this.setData({
        userInfo: storage
      });

      // 获取openid
      wx.cloud.callFunction({
        name: "getOpenId",
        complete: data => {

          // 拉取主系统数据 data.result.openId
          // data.result.openId = "test9"
          let getLoginData = () => {
            app.request(data.result.openId, "login", login => {

              // 用户是否注册
              if (login.data.token) {

                app.globalData.token = login.data.token;
                // 获取账号数据
                app.request(login.data.token, "accountData", info => {
                  let user = Object.assign(res.userInfo, login.data, info.data);

                  // 判断绑定
                  if (user.bind_id) {
                    res.userInfo.endTime = user.token.split("-")[2] || Date.now() + 259200;
                    this.setData({
                      userInfo: user
                    });
                    wx.setStorage({
                      key: "userInfo",
                      data: user
                    });
                  } else {
                    !load && wx.navigateTo({
                      url: "login/login?bindMode=true&token=" + login.data.token
                    });
                  }
                });
              } else {

                // 注册账号
                app.request(data.result.openId, "register", getLoginData);
              }
            });
          };

          // 主动执行一次
          getLoginData();

        }
      });
    } else {
      this.setData({
        toast: {
          text: "获取授权失败!请允许授权...",
          icon: "error",
          hideTime: 2000
        }
      });
    }
  },

});