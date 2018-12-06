const app = getApp();
Page({

  data: {
    familyList: []
  },
  
  onShow: function() {
    app.bar("title", "家庭成员");
    // 读取家庭成员列表
    app.request(`token=${app.globalData.userInfo.token}`, "getFamilyList", res => {
      if (res.data.length) this.setData({
        familyList: res.data
      });
    });
  },

  click: function(e) {
    let target = e.target.dataset;
    if (target.name) {
      let slef = this;

    }
  },

  addFamily: function(e) {
    console.log('add')
  }
})