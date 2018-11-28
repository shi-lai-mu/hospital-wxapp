// pages/family/family.js
Page({

  data: {

  },
  
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