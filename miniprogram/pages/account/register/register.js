const app = getApp();
let sendState = null,
  colling = 0,
  mssion = 0;
Page({
  data: {
    // 【0: 用户/1：医生】
    userType: 0,
    // 部门列表
    bmArray: [],
    // 部门选择器 [已选择]
    bmIndex: [-1, 0],
    // 部门选择器 [对象]
    bmObject: [],
    // 验证码冷却时间
    sendState: '发送'
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

    if (dept[1]) {
      for (let id in dept) {
        // 存入主部门ID
        dept[id].uid = id;
        bmObject.push(dept[id]);
        bmArray[0].push(dept[id].name);
      }
      // 写入第一个部门的子部门
      for (let id in dept[1].subDept) {
        bmArray[1].push(dept[1].subDept[id].name);
      }
      this.setData({
        bmArray,
        bmObject
      });
    }

  },

  /**
   * 选择结束
   */
  select: function(e) {
    this.setData({
      [e.target.dataset.key]: e.detail.value
    });
    this.inputBlur(e);
  },

  /**
   * 更新选择内容
   */
  updateSelect: function(e) {
    // 滑动子部门 不更新
    if (e.detail.column) return;
    
    let dept = this.data.bmObject[e.detail.value]
    if (dept) {
      let arr = [];
      for (let id in dept.subDept) arr.push(dept.subDept[id].name);
      this.setData({
        bmArray: [this.data.bmArray[0], arr]
      })
    }
  },

  /**
   * 聚焦函数
   */
  inputFocus: function(t) {
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
  register: function(e) {
    let error = "";
    let val = e.detail.value;

    // 倒序检查!!!

    // 医生注册
    if ('ysdm' in val) {
      !val.ysbm && (error = "所在部门 不能为空!");
      !val.ysdm && (error = "医生代码 不能为空!");
    }
    // 条件判断
    if (!val.csrq || !(/^(\d){4}-(\d){1,2}-(\d){1,2}$/g).test(val.csrq))
      error = "出生日期 格式错误: 1999-01-01!"
    if (!val.phone || !(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/g).test(val.phone))
      error = "手机号 格式错误!";
    if (!val.name || !(/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,4}$/g).test(val.name))
      error = "姓名 格式错误!";

    if (error) return this.setData({
      toast: {
        text: error,
        icon: "error"
      }
    });

    // 都没问题开始注册
    let api = 'userRegister';
    if ('ysdm' in val) {
      let dept = this.data.bmObject[this.data.bmIndex[0]];
      val.hospital_id = "";
      val.dept_id = dept.uid;
      val.sub_dept_id = dept.subDept[this.data.bmIndex[1]].id;
      val.ksdm = dept.ksdm;
      delete val.ysbm;
      api = 'doctorRegister';
    }

    app.request(val, api, res => {
      console.log(res)
      if (res.data.mssion_id) {
        this.setData({
          showCode: 1
        });
        mssion = res.data.mssion_id;
      } else this.setData({
        toast: {
          text: res.data.error,
          icon: "error"
        }
      });
    }, app.globalData.token);
    
    console.log(val)
  },

  /**
   * 发送验证码
   */
  sendCode: function(e) {
    let code = e.detail.value.codes;
    if(!code) return this.setData({
      toast: {
        text: '验证码不能为空!',
        icon: "error"
      }
    });
    app.request(`${mssion}/${code}?token=${app.globalData.token}`, "finishBindAndRegMssion", res => {
      console.log(res)
      if (res.data.status) {
        wx.navigateBack({
          delta: 3
        });
      } this.setData({
        toast: {
          text: res.data.error,
          icon: "error"
        }
      });
    });
  },

  /**
   * 隐藏验证码界面
   */
  hideCode: function() {
    this.setData({
      showCode: 0
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