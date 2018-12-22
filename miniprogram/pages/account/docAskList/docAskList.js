const app = getApp();
Page({
  data: {

  },

  onLoad: function (options) {
    app.bar({
      title: "我的咨询",
      bgColor: "#B5CFFF"
    });

    app.request(app.globalData.userInfo.token, "getDocAskListByPat", res => {
      console.log(res)
    });
  },

})