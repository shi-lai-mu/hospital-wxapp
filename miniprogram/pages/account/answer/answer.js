const app = getApp();
Page({

  data: {

  },

  onLoad: function(option) {
    console.log(option)
    console.log(app.globalData.userInfo)
    this.setData({
      user: app.globalData.userInfo
    })
    app.bar({
      title: "咨询医生",
      bgColor: "#B5CFFF"
    });
  },

  onShow: function () {
  },

  /**
   * 发送消息
   */
  sendInput: function(e) {
    console.log(e)
  }
})