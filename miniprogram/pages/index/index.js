var a = getApp(),
  change = null;

Page({
  data: {
    searchClass: "",
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
    }],
    searchDoctor: []
  },
  /**
   * 搜索栏聚焦
   */
  searchFocus: function() {
    this.setData({
      searchClass: "inputFocus"
    });
  },
  /**
   * 搜索栏失焦
   */
  searchBlur: function() {
    this.setData({
      searchClass: ""
    })
  },
  /**
   * 搜索关键词
   */
  searchKey: function(e) {

    // 节流算法
    change && clearTimeout(change);

    change = setTimeout(() => {
      change = null;
      let val = e.detail.value;
      val && a.request({
        "doc_name": val,
        "depId": -1,
        "subdepId": -1
      }, "searchDoctor", data => {
        data = data.data;
        if (typeof data == "object") {
          data.map && data.map(res => {
            res.split = res.name.split(val);
            res.key = val;
            return res;
          });
          this.setData({
            searchDoctor: data
          });
        }
      });
    }, 500);
  }
});