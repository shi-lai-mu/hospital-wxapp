App({
  /**
   * 公共数据
   */
  globalData: {
    version: "0.5.9 [Alpha]",
    title: "康达互联网医院",

    // 域名
    ip: "http://107.173.140.29/",
    // 全部部门列表
    dept: [],

    // 接口
    url: {
      // 小程序登录
      login: "login/",
      // 小程序注册
      register: "register/",
      // 获取用户信息
      accountData: "getUserDetail/?token=",
      // 绑定到主系统[第一步]
      existAccount: "bindExistAccount/",
      // 绑定到主系统[第二步]
      finishBind: "finishBind/",
      // 搜索医生
      searchDoctor: "searchDoctor",
      // 获取所有部门列表
      getAllDept: "getAllDept",
      // 医生注册
      doctorRegister: "bindAndRegMainSysAccountDoc/?token=",
      // 用户注册
      userRegister: "bindAndRegMainSysAccountPat/?token="
    },
  },

  onLaunch: function() {
    wx.cloud.init();

    // 获取全部部门列表 [读取本地,超过一小时则重新获取]
    let data = wx.getStorageSync('dept');

    if (data && data.time < new Date().getTime()) {
      this.globalData.dept = data.data;
    } else {
      this.request("", "getAllDept", res => {
        // 过期时间 
        wx.setStorage({
          key: 'dept',
          data: {
            data: res.data,
            time: new Date().getTime() + 3600
          },
        })
        this.globalData.dept = res.data;
      });
    }
  },

  /**
   * 请求函数封装：
   * @param {string/object} data 传入字符串为get请求 反之 post 请求
   * @param {string} api 调用设定好的url接口,如果不存在则会被当成url
   * @param {function} callback 当得到请求内容时的回调
   * @param {string} note 当为post请求时，url需要额外添加的参数
   */
  request: function(data, api, callback, note) {
    let url = this.globalData.ip + (this.globalData.url[api] ? "api/" + this.globalData.url[api] : api),
      post = (typeof data == "string");
    let req = wx.request({
      url: url + (post ? data : "") + (note ? note : ""),
      method: post ? "GET" : "POST",
      data: post ? false : data,
      success: res => {
        if (res.statusCode == 200 || res.statusCode == 304) {
          callback && (!res.error ? callback(res) : callback(false));
        } else {
          wx.showToast({
            title: `内部服务器出现问题!请稍后再试[ERROR: ${api}]`,
            icon: "none",
            mask: true,
            duration: 2000
          });
          console.error(res);
        }
      },
      fail: err => {
        console.log('请求调用出错: ' + err);
      }
    });
    //console.log("发送请求 <" + (new Date().toTimeString()) + ">: " + url + (post ? data : "") + (note ? note : ""));
  },

  /**
   * 设置顶部封装
   * @param {string/object} data 传入string为单项属性设置 反之 多项设定
   * @param {string} value 单项设定时调用
   */
  bar: function(json, value) {
    value ? setBar(value, json) : Object.keys(json).forEach((val, key) =>
      setBar.apply(this, [val, json[val]])
    );

    function setBar(key, val) {
      key == 'title' ?
        wx.setNavigationBarTitle({
          title: `${this.globalData.title} - ${val}`
        }) :
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: val,
        });
    }
  },
  
});