const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listSelect: 0,
    results: []
  },

  onShow: function() {

    // 整理部门
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
    // 主部门
    for (let id in dept) {
      let value = {
        tag: dept[id].name,
        icon: icon[dept[id].name] || 'wrong',
        list: []
      };
      // 子部门
      let subDrpt = dept[id].subDept;
      for (let subId in subDrpt) {
        value.list.push({
          name: subDrpt[subId].name,
          id: subDrpt[subId].id
        });
      }
      all.push(value);
    }
    this.setData({all});
  },

  // 大类选择
  unSelect: function(e) {
    if (e.target.dataset.i !== undefined) {
      this.setData({
        listSelect: e.target.dataset.i
      });
    }
  },

  // 搜索子部门医生
  search: function (e, data = {}) {
    console.log(e)
    // 兼容非事件
    let tar = e.target ? e.target.dataset : {};

    // 不允许全局[无条件]搜索
    if (!Object.keys(tar).length && !Object.keys(data).length) return;

    // 搜索请求
    app.request({
      "doc_name": data.name || tar.name || "",
      "depId": data.depId || tar.depid || -1,
      "subdepId": data.subdepId || tar.subdepid || -1
    }, 'searchDoctor', res => {

      let data = res.data,
        dept = app.globalData.dept;

      if (data.error) return this.setData({
        toast: {
          text: "未找到属于此部门的医生...",
          icon: "error"
        }
      });

      // 写入 子部门ID
      let results = data.map(value => {
        let sub = dept[value.dept_id].subDept;
        for (let subId in sub) {
          if(sub[subId].id == value.sub_dept_id) {
            value.tag = sub[subId].name;
            break;
          }
        }
        return value;
      });
      this.setData({ results });
    });
  },

  /**
   * 【返回】清空搜索结果
   */
  clearResults: function () {
    console.log(123456)
    this.setData({ results: [] });
  },
})