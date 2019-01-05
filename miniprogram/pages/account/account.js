var app = getApp();
let register = false;

Page({
  data: {

    // 小程序版本
    version: "1.0.0",

    // 用户信息
    userInfo: {
      avatarUrl: "/images/avatar_user_0.png",
      bind_account: {
        zxyy_id: "------"
      },
      doctor: false
    }
  },

  onShow: function() {
    if (!Boolean(app.globalData.userInfo + []) ||
      !app.globalData.userInfo.bind_account) {
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
      })
    } else {
      this.setData({
        userInfo: app.globalData.userInfo,
        doctor: !!app.globalData.userInfo.bind_account.ysdm
      });
    }

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
  settingAccount: function (res, load) {
    // if (this.__viewData__.userInfo.xcxid) return;

    // 兼容事件处理
    res.detail && (res = res.detail);

    // 检测授权
    if (res.userInfo) {
      this.setData({
        userInfo: res.userInfo
      });

      // 如果本地已存储数据且没过期则用本地的
      // let storage = wx.getStorageSync("userInfo");
      // if (storage && storage.bind_account && storage.endTime > Date.now() / 1000) return this.setData({
      //   userInfo: storage,
      //   doctor: storage.bind_account ? !!storage.bind_account.ysdm : false
      // });

      // 获取openid
      wx.cloud.callFunction({
        name: "getOpenId",
        complete: data => {

          // 拉取主系统数据
          let getLoginData = e => {
            data.result.openId = 'o-PgA5R0PU-6L-JS_XN0jHGDp-3w';
            app.request(data.result.openId, "login", login => {
              // 用户是否注册
              if (login.data.token) {

                app.globalData.token = login.data.token;
                // 获取账号数据
                app.request(login.data.token, "accountData", info => {
                  let user = Object.assign(res.userInfo, login.data, info.data);
                  // 判断绑定
                  if (user.bind_account) {
                    res.userInfo.endTime = user.token.split("-")[2] || Date.now() + 259200;
                    this.setData({
                      userInfo: user,
                      doctor: user.bind_account ? !!user.bind_account.ysdm : false
                    });
                    wx.setStorage({
                      key: "userInfo",
                      data: user
                    });

                  } else {
                    !load && wx.navigateTo({
                      url: "login/login?token=" + login.data.token
                    });
                  }
                });
              } else if (!register) {

                // 注册账号
                register = true;
                app.request(data.result.openId, "register", getLoginData, false, 20);
              }
            }, 5);
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

  /**
   * 权限检测
   */
  navgiate: function(e) {

    let data = e.currentTarget.dataset;
    if (data.page) {
      if (data.pro) {
        let error = false;
        console.log(app.globalData.doctor)
        if (data.pro == 'put' && !app.globalData.userInfo.nickName) {
          error = '请先登录!';
        } else if (data.pro == 'doc' && !app.globalData.doctor) {
          error = '非医生不能进行此操作!';
        } else if (data.pro == 'card' && !app.globalData.userInfo.bind_account.patientname) {
          error = '此操作必须在实名后!';
        }
        if (error) return this.setData({
          toast: {
            text: error,
            icon: 'error'
          }
        });
      }
      wx.navigateTo({
        url: data.page,
      });
    }
    console.log(e, data)
    if (!app.globalData.userInfo.nickName) {}
  },

});