var a = getApp();

Page({
  data: {
    searchClass: '',
    department: [{
      tag: "皮肤科",
      icon: "pifuke color1",
      page: ""
    }, {
      tag: "推拿",
      icon: "tuina color2",
      page: ""
    }, {
      tag: "骨科",
        icon: "guke color3",
      page: ""
    }, {
      tag: "耳鼻咽喉",
        icon: "erbihouke color4",
      page: ""
    }, {
      tag: "检验",
        icon: "jianyan color5",
      page: ""
    }, {
      tag: "B超",
        icon: "Bchaoyuyue-K color6",
      page: ""
    }, {
      tag: "科室7",
        icon: "wrong color7",
      page: ""
    }, {
      tag: "科室8",
        icon: "wrong color8",
      page: ""
    }]
  },
  onLoad: function () {
    
    wx.request({
      url: 'http://107.173.140.29/api/getUserDetail/1',
      success: function(res) {
        console.log(res)
      }
    })
  }
});