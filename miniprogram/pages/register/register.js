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
    userType: 1, // 【0: 用户/1：医生】
    bmArray: [
      ['部门ID1', '部门ID2', '部门ID3', '部门ID4', '部门ID5'], 
      ['子部门ID1', '子部门ID2', '子部门ID3', '子部门IDID4', '子部门IDID5'],
      ['科室代码', '科室代码']
    ],

    bmIndex: [-1, 0, 0]// + bmSelect[1][bmIndex[1]] + bmSelect[2][bmIndex[2]] 
  },

  onShow: function() {
    app.bar({
      title: '注册',
      bgColor: '#3285FF'
    })
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