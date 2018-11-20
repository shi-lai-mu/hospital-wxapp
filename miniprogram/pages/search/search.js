// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all: [
      {
        tag: '儿科',
        icon: "icon-erke",
        list: [
          { name: '儿科专', page: '' },
          { name: '儿科', page: '' }
        ]
      },
      {
        tag: '耳鼻咽喉科',
        icon: "icon-erbihouke",
        list: [
          { name: '五官科', page: '' },
          { name: '急诊五官', page: '' },
          { name: '五官专', page: '' }
        ]
      },
      {
        tag: '妇产科',
        icon: "iicon-fuchanke",
        list: [
          { name: '妇产科', page: '' },
          { name: '急诊五官', page: '' },
          { name: '妇产科专', page: '' }
        ]
      },
      {
        tag: '骨科',
        icon: "icon-guke",
        list: [
          { name: '骨科', page: '' },
          { name: '骨科专', page: '' }
        ]
      },
      {
        tag: '口腔科',
        icon: "icon-kouqiangke",
        list: [
          { name: '口腔科', page: '' },
          { name: '急诊口腔科', page: '' },
          { name: '口腔专', page: '' }
        ]
      },
      {
        tag: '内科',
        icon: "icon-neike",
        list: [
          { name: '内科(普)', page: '' },
          { name: '肠道科', page: '' },
          { name: '肿瘤专', page: '' },
          { name: '急症内科', page: '' },
          { name: '精神内科专', page: '' },
          { name: '内分泌专', page: '' },
          { name: '心血管专', page: '' },
          { name: '肝病内科专', page: '' },
          { name: '呼吸内科专', page: '' },
          { name: '消化内科专', page: '' },
          { name: '血液科专', page: '' },
          { name: '内科专', page: '' },
          { name: '肾内科专', page: '' },
          { name: '风湿免疫专', page: '' },
        ]
      },
      {
        tag: '皮肤科',
        icon: "icon-pifuke",
        list: [
          { name: '皮肤科', page: '' },
          { name: '皮肤专', page: '' }
        ]
      },
      {
        tag: '其他',
        icon: "icon-qitake",
        list: [
          { name: '干部门诊', page: '' },
          { name: '急诊科', page: '' },
          { name: '医生办', page: '' }
        ]
      },
      {
        tag: '疼痛科',
        icon: "icon-tengtongke",
        list: [
          { name: '疼痛专科', page: '' }
        ]
      },
      {
        tag: '一个测试',
        icon: "icon-wrong",
        list: [
          { name: '1', page: '' },
          { name: '2', page: '' },
          { name: '3', page: '' },
          { name: '4', page: '' },
          { name: '5', page: '' },
          { name: '6', page: '' },
          { name: '7', page: '' },
          { name: '8', page: '' },
          { name: '9', page: '' },
          { name: '10', page: '' },
          { name: '11', page: '' },
          { name: '12', page: '' },
          { name: '13', page: '' },
          { name: '14', page: '' },
          { name: '15', page: '' },
          { name: '16', page: '' },
          { name: '19', page: '' },
          { name: '20', page: '' },
          { name: '21', page: '' },
          { name: '22', page: '' },
          { name: '23', page: '' },
          { name: '。', page: '' },
          { name: '。', page: '' },
          { name: '。', page: '' },
          { name: '。', page: '' },
          { name: '。', page: '' },
          { name: '。', page: '' },
          { name: '。', page: '' },
          { name: '。', page: '' },
          { name: '。', page: '' },
          { name: '。', page: '' },
        ]
      }
    ],
    listSelect: 0
  },

  unSelect: function(e) {
    this.setData({
      listSelect: e.target.dataset.i
    });
    console.log(this.data.listSelect)
  }
})