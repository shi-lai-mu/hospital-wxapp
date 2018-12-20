const app = getApp();
// 手机号返回的mssion_id
let mssion_id = null,
  outInter = null,
  outTime = 0;
Page({
  data: {
    sendState: "发送",
  },
  onReady: function() {
    app.bar({
      title: '绑定账号',
      bgColor: '#3285FF'
    });
  },

  /**
   * 聚焦事件
   */
  inputFocus: function(t) {
    var a = {};
    a[t.target.dataset.id] = "changed", this.setData(a);
  },

  /**
   * 失焦事件
   */
  inputBlur: function(t) {
    var a = {};
    a[t.target.dataset.id] = t.detail.value ? "nick" : "", this.setData(a);
  },

  /**
   * 绑定账号事件
   */
  bind: function (e) {
    let value = e.detail.value;

    // 获取token
    let token = wx.getStorageSync('login');
    if (!token) return;

    // 判断 手机号和验证码 是否输入
    if (value.phone) {
      if (value.codes) {
        // 判断是否存在验证码
        if (!mssion_id) return this.setData({
          toast: {
            text: "未找到验证信息!",
            icon: "error"
          }
        });

        // 请求验证码是否正确 销毁mssion_id
        app.request(`${mssion_id}/${value.codes}/?token=${token.data.data.token}`, "finishBind", res => {
          if (res.error) {
            this.setData({
              toast: {
                text: "验证码错误!",
                icon: "error"
              }
            });
          } else {
            wx.switchTab({
              url: '../account?reload'
            });
          }
        });
        mssion_id = null;
      } else {
        // 检测冷却
        if (outTime) return;

        // 如果未输入验证码 则 发送验证码
        app.request(`${value.phone}/?token=${token.data.data.token}`, "existAccount", res => {
          if (!isNaN(res)) {
            outTime = (res / 1000).toFixed(0);
            this.countDown(outTime);
            return
          }
          if (res.data.mssion_id) {
            mssion_id = res.data.mssion_id;
            this.setData({
              toast: {
                text: "验证码已发送!请输入...",
                icon: "success",
                hideTime: 3000
              }
            });
            this.countDown(60);
          } else this.setData({
            toast: {
              text: "验证码发送失败:" + res.data.error,
              icon: "error"
            }
          });

        }, false, 60);
      }
    } else return this.setData({
      toast: {
        text: "手机信息为空!",
        icon: "error"
      }
    });
  },

  /**
   * 倒计时
   */
  countDown: function(outTime) {
    outInter = setInterval(() => {
      if (!outTime) {
        clearInterval(outInter);
        outTime = "发送";
      }
      this.setData({
        sendState: outTime
      });
      outTime--;
    }, 1000);
  }
});