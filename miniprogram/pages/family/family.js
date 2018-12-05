const app = getApp();
Page({

  data: {
    familyList: []
  },
  
  onShow: function() {
    app.bar("title", "家庭成员");

    console.log(`token=${app.globalData.userInfo.token}`)
    app.request(`token=${app.globalData.userInfo.token}`, "getFamilyList", res => {
      console.log(res)
      if (res.data.length) this.setData({
        familyList: res.data
      });
      console.log(this.data)
    });
  },

  click: function(e) {
    let target = e.target.dataset;
    if (target.name) {
      let slef = this;

    }
  }
})