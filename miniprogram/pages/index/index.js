var a = getApp();

Page({
  data: {
    searchClass: '',
    department: [{
      tag: "皮肤科",
      icon: "pifuke color1"
    }, {
      tag: "推拿",
      icon: "tuina color2"
    }, {
      tag: "骨科",
      icon: "guke color3"
    }, {
      tag: "耳鼻咽喉",
      icon: "erbihouke color4"
    }, {
      tag: "检验",
      icon: "jianyan color5"
    }, {
      tag: "B超",
      icon: "Bchaoyuyue-K color6"
    }, {
      tag: "科室7",
      icon: "wrong color7"
    }, {
      tag: "科室8",
      icon: "wrong color8"
    }]
  },
  onLoad: function () {

  },
  /**
   * 搜索栏聚焦
   */
  searchFocus: function () {
    this.setData({
      searchClass: 'inputFocus'
    })
  },
  searchBlur: function () {
    this.setData({
      searchClass: ''
    })
  }
});