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
    var e = this;
    a.globalData.userInfo ? this.setData({
      userInfo: a.globalData.userInfo,
      hasUserInfo: !0
    }) : this.data.canIUse ? a.userInfoReadyCallback = function (a) {
      e.setData({
        userInfo: a.userInfo,
        hasUserInfo: !0
      });
    } : wx.getUserInfo({
      success: function (n) {
        a.globalData.userInfo = n.userInfo, e.setData({
          userInfo: n.userInfo,
          hasUserInfo: !0
        });
      }
    });
  },
  getUserInfo: function (e) {
    a.globalData.userInfo = e.detail.userInfo, this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: !0
    });
  },
  searchFocus: function() {
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