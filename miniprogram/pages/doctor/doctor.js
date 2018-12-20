const app = getApp();
Page({
  data: {

    // 显示简介
    introduce: true,

    // 菜单标签
    tag: {
      consulting: {
        page1: true
      }
    },

    // 家庭列表
    family: ['郑余国', '啦啦啦', '阿鲁巴吧', '休息休息'],
    focusFamily: 0,
    familyList: []
  },
  onLoad: function(options) {
    options && this.setData(options);
    app.bar({
      title: '医生信息',
      bgColor: '#B5CFFF'
    });

    app.request(`token=${app.globalData.userInfo.token}`, "getFamilyList", res => {
      let data = [];
      console.log(res.data)
      for (let obj of res.data) data.push(obj.patientname);
      this.setData({
        family: data,
        familyList: res.data
      });
    });
    
    // 默认选中 咨询
    this.showContent('consulting');
  },

  /**
   * 菜单点击后显示
   */
  showContent: function(e) {
    let tag = e.target ? e.target.dataset.tag : e;
    if (this.data.tag[tag]) return;
    this.setData({
      tag: {
        [tag]: {}
      },
      introduce: true
    });
  },

  /**
   * 切換内页
   */
  switchPage: function(e) {
    this.setData({
      [e.target.dataset.page]: true,
      introduce: false
    });
  },

  /**
   * 姓名选择
   */
  con_picker: function(e) {
    this.setData({
      focusFamily: e.detail.value
    });
  },

  /**
   * 咨询提交
   */
  consulting: function(e) {
    if (e.detail.value.content.length < 4) {
      this.setData({
        toast: {
          text: "请至少输入4个字符!",
          icon: "error"
        }
      })
      return;
    }
    
  },
})