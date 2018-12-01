const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listSelect: 0
  },

  onShow: function() {
    console.log(app.globalData)
    let all = [],
      dept = app.globalData.dept,
      icon = {
        '疼痛科': 'tengtongke',
        '其他':"qitake",
        "皮肤科": "pifuke",
        "内科": "neike",
        "口腔科": "kouqiangke",
        "骨科": "guke",
        "妇产科": "fuchanke",
        "耳鼻咽喉科": "erbihouke",
        "儿科": "erke",
      };
    for (let id in dept) {
      let value = {
        tag: dept[id].name,
        icon: icon[dept[id].name] || 'wrong',
        list: []
      };
      for (let subId in dept[id].subDept) {
        value.list.push({
          name: dept[id].subDept[subId].name
        });
      }
      all.push(value);
    }
    this.setData({all});
  },

  unSelect: function(e) {
    if (e.target.dataset.i !== undefined) {
      this.setData({
        listSelect: e.target.dataset.i
      });
    }
  }
})