Page({
  data: {
    /* 输入状态数据 */
    csrq: "",
    sex: "",
    name: "",
    sex: "",
    userType: -1, // 【0: 用户/1：医生】
  },

  /**
   * 聚焦函数
   */
  inputFocus: function (t) {
    var a = {};
    a[t.target.dataset.id] = 'changed', this.setData(a);
  },

  /**
   * 失焦函数
   */
  inputBlur: function (t) {
    var a = {};
    a[t.target.dataset.id] = t.detail.value ? 'nick' : '', this.setData(a);
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
    if (!val.sex || !(/[男女]/g).test(val.phone))
      error = "性别 格式错误: 男/女";
    if (!val.phone || !(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/g))
      error = "姓名 格式错误!";
    if (!val.phone || !(/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,4}$/g).test(val.phone))
      error = "姓名 格式错误!";

    if (error) return this.setData({
      toast: { text: error, icon: 'error' }
    });
  },
  selectUserType: function(e) {
    this.setData({
      userType: e.target.dataset.i
    });
  }
})