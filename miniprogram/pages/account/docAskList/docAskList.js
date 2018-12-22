const app = getApp();
Page({
  onShow: function() {
    app.bar({
      title: "我的咨询",
      bgColor: "#B5CFFF"
    });

    app.request(app.globalData.userInfo.token, "getDocAskListByPat", res => {
      if (res.data) {

        //排序 已回复 -> 待回复 -> 已结束
        let sorting = [[], [], []];
        res.data.forEach(value => {
          if(value.status == 1) {
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