const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listSelect: 0,
    results: [],
    tag: ''
  },
  onLoad: function(e) {

    app.bar({
      title: "查找",
      bcColor: "#F7F7F7,000"
    });

    // 选中 指定的部门
    e.tag && this.setData(e);

    // 搜索 指定的医生
    e.name && this.search({}, e);

    // 显示 专家列表
    e.expertDoc && app.request("", "getExpertDoc", res => {

      // 判断部门标签是否注明 否则写入
      let dept = app.globalData.dept;
      console.log(res.data)
      if (!res.data[0].tag && dept[1]) {
        let deptList = {};

        // 写入医生信息
        for (let index in res.data) {
          let info = res.data[index],
            tag = `${info.dept_id}.${info.sub_dept_id}`;
            
          if (tag in app.globalData.deptList) {
            res.data[index].tag = app.globalData.deptList[tag];
          } else res.data[index].tag = 'not dept';
        }
      }
      this.setData({
        results: res.data
      });
    }, 3600);
  },

  onShow: function() {

    // 整理部门
    let all = [],
      icon = {
        '疼痛科': 'tengtongke',
        '其他': "qitake",
        "皮肤科": "pifuke",
        "内科": "neike",
        "口腔科": "kouqiangke",
        "骨科": "guke",
        "妇产科": "fuchanke",
        "耳鼻咽喉科": "erbihouke",
        "儿科": "erke",
      },
      tag = this.data.tag,
      i = 0;

    let dept = app.globalData.dept;
    // 主部门
    for (let id in dept) {
      let name = dept[id].name;

      // 外面图标点入时 自动选中部门
      (name == tag) && this.setData({
        listSelect: i
      });

      let value = {
        tag: name,
        icon: icon[name] || 'wrong',
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
      i++;
    }
    this.setData({
      all
    });
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
  search: function(e, data = {}) {

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
          if (sub[subId].id == value.sub_dept_id) {
            value.tag = sub[subId].name;
            break;
          }
        }
        return value;
      });
      this.setData({
        results
      });
      console.log(results)
    });
  },

  /**
   * 【返回】清空搜索结果
   */
  clearResults: function() {
    this.setData({
      results: []
    });
  },

  /**
   * 按 医生名字 搜索
   */
  searchName: function(e) {
    let val = e.detail.value;

    // 兼容 键盘按下搜索
    (typeof val == 'string') && (val = {
      name: val
    });
    this.search({}, val);
  },

  /**
   * 打开医生信息页
   */
  doctorPage: function(e) {
    if(!app.isLogin()) return this.setData({
      toast: {
        text: app.getMessage("not login"),
        icon: "error"
      }
    });
    let doctor = e.target.dataset.doctor;
    doctor && wx.navigateTo({
      url: '../doctor/doctor?' + doctor,
    });
  },
})