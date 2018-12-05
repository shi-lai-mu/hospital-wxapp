const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isId: "",
    theId: ""
  },
  
  camera: function(e) {
    let self = this;
    console.log(e)
    wx.chooseImage({
      count: 1,
      success: function (res) {
        self.setData({
          [e.currentTarget.dataset.name]: res.tempFilePaths[0]
        });
        console.log(app.globalData)
        wx.uploadFile({
          url: app.globalData.ip + 'api/SetIDCard?token=' + app.globalData.userInfo.token,
          filePath: res.tempFilePaths[0],
          name: 'idcard',
          success: function (res) {
            console.log(res)
          },
          fail: console.log
        });
      }
    });
  }
})