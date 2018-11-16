// pages/family/family.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '家庭成员'
    });
  },

  click: function(e) {
    let target = e.target.dataset;
    if (target.name) {
      let slef = this;

    }
  }
})