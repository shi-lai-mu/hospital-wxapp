const app = getApp();
Page({
  onLoad: function(e) {

    app.bar({
      title: "我的咨询",
      bgColor: "#B5CFFF"
    });
    e.type = 'DocClose'
    // 按页面参数 进行请求
    e.type && app.request(app.globalData.userInfo.token, `getDocAskListBy${e.type}`, res => {
      if (res.data) {

        //排序 已回复 > 待回复 > 已结束
        let sorting = [
          [],// 已回复
          [],// 待回复
          [] // 已结束
        ];
        res.data.forEach(value => {
          if (value.status == 1) {
            sorting[2].push(value);
          } else if (value.status == -1) {
            sorting[1].push(value);
          } else sorting[0].push(value);
        });
        let newArr = []
        newArr.push(...sorting[0], ...sorting[1], ...sorting[2]);

        this.setData({
          docList: newArr
        });
      }
    });

  },

})