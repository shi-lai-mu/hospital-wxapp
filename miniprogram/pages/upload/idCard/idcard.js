// miniprogram/pages/upload/idCard/idcard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  camera: function() {

    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
      }
    });
  }
})