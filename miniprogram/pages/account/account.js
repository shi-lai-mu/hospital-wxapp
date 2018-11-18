var app = getApp();

Page({
  data: {
    version: "1.0.0",
    userInfo: {
      nickName: "点击登录",
      avatarUrl: "/images/avatar_1.jpg"
    }
  },
  onLoad: function(a) {
    this.setData({
      version: app.globalData.version
    });

    wx.getSetting({
      success: setting => {
        if (setting.authSetting['scope.userInfo']) {
          wx.getUserInfo({ success: this.settingAccount });
        }
      }
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
        text: "VERSION " + this.data.version,
        icon: "loading",
        hideTime: 4e3
      }
    });
  },
  settingAccount: function (res) {
    // 兼容事件处理
    res.detail && (res = res.detail);

    // 检测授权
    if (res.userInfo) {

      // 获取openid
      wx.cloud.callFunction({
        name: 'getOpenId',
        complete: data => {
          res.userInfo.id = data.result;
          this.setData({ userInfo: res.userInfo });

          // 拉取主系统数据
          wx.request({
            url: `http://${app.globalData.ip}/api/getUserDetail/${data.result.openId}`,
            success: res => {
              if (!res.data.error) { //user not exist
                
              } else {
                /*this.setData({
                  toast: {
                    text: "检测到您还未绑定主账号!即将跳转...",
                    icon: "loading",
                    hideTime: 3000,
                    callback: () => {
                      wx.navigateTo({ url: '../login/login' });
                    }
                  }
                });*/
              }
            }
          });

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
  }
});