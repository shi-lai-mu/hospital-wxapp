const app = getApp();
Page({
  data: {
    /* 输入状态数据 */
    // 用户
    user: {
      csrq: "",
      sex: "",
      name: "",
      sex: ""
    },
    // 医生
    doctor: {
      csrq: "",
      sex: "",
      name: "",
      sex: ""
    },
    // 【0: 用户/1：医生】
    userType: 1,
    // 部门列表
    bmArray: [],
    // 部门选择器 [已选择]
    bmIndex: [-1, 0],
    // 部门选择器 [对象]
    bmObject: []
  },

  onShow: function() {
    // 设置标题
    app.bar({
      title: '注册',
      bgColor: '#3285FF'
    });

    // 整理部门数据
    let dept  = app.globalData.dept,
      bmArray = [[], []],
      bmObject = [];

    for (let id in dept) {
      // 存入主部门ID
      dept[id].uid = id;
      bmObject.push(dept[id]);
      bmArray[0].push(dept[id].name);

    }
    for (let id in dept[1].subDept) {
      bmArray[1].push(dept[1].subDept[id].name);
    }
    this.setData({
      bmArray,
      bmObject
    });
  },

  /**
   * 选择结束
   */
  select: function(e) {
    this.setData({
      bmIndex: e.detail.value
    });
    this.inputBlur(e);
  },

  /**
   * 更新选择内容
   */
  updateSelect: function(e) {
console.log(e)
  },

  /**
   * 聚焦函数
   */
  inputFocus: function(t) {
    console.log('focus')
    this.setData({
      [t.target.dataset.id]: "changed"
    });
  },

  /**
   * 失焦函数
   */
  inputBlur: function (t) {
    this.setData({
      [t.target.dataset.id]: t.detail.value.length ? "nick" : ""
    });
  },

  /**
   * 用户提交注册事件
   */
  userRegister: function(e) {
    let error = "";
    let val = e.detail.value;

    // 条件判断
    if (!val.csrq || !(/^(\d){4}-(\d){1,2}-(\d){1,2}$/g).test(val.phone))
      error = "出生日期 格式错误: 1999-01-01!"
    // if (!val.sex || !(/[男女]/g).test(val.phone))
    //   error = "性别 格式错误: 男/女";
    if (!val.phone || !(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/g))
      error = "姓名 格式错误!";
    if (!val.phone || !(/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,4}$/g).test(val.phone))
      error = "姓名 格式错误!";

    if (error) return this.setData({
      toast: {
        text: error,
        icon: "error"
      }
    });
  },

  /**
   * 选择用户类型事件
   */
  selectUserType: function(e) {
    e.target.dataset.i && this.setData({
      userType: e.target.dataset.i
    });
  },

  /**
   * 页面滑动事件
   */
  pageChange: function(e) {
    this.setData({
      userType: e.detail.current
    });
  },
})