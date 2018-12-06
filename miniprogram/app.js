App({
  /**
   * 公共数据
   */
  globalData: {
    version: "0.6.1 [Alpha]",
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
      userRegister: "bindAndRegMainSysAccountPat/?token=",
      // 获取家庭成员列表
      getFamilyList: "getFamilyList?",
      // 获取专家列表
      getExpertDoc: "getExpertDoc",
    },
  },

  onLaunch: function() {
    wx.cloud.init();

    // 内测版代码区域 //

    this.globalData.userInfo = wx.getStorageSync('userInfo') || [];
    console.log(this.globalData.userInfo)
    /////////////////

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
        });
        this.globalData.dept = res.data;
      });
    }
  },

  /**
   * 请求函数封装：
   * @param {string} data get请求
   *        {object} data post 请求
   * @param {string} api 调用设定好的url接口,如果不存在则会被当成url
   * @param {function} callback 当得到请求内容时的回调
   * @param {string} note 当为post请求时，url需要额外添加的参数
   *        {number} note 缓存过期时间/下次在过期时间内读取直接返回缓存数据
   */
  request: function(data, api, callback, note) {

    let post = (typeof data == "string"),

      url = this.globalData.ip +
      (this.globalData.url[api] ? "api/" + this.globalData.url[api] : api) +
      (post ? data : "") +
      (note && isNaN(note) ? note : "");

    // 查看是否存在缓存,有则直接返回[GET]
    if (post) {
      let storage = wx.getStorageSync(api);
      // 存在数据 && url相等 && 数据未过期
      console.log(api + '调用了本地缓存!')
      if (storage &&
        storage.url == url &&
        storage.end >= new Date().getTime()
      ) return callback(storage.data);
    }

    let req = wx.request({
      url,
      method: post ? "GET" : "POST",
      data: post ? false : data,
      success: res => {

        if (res.statusCode == 200 || res.statusCode == 304) {
          callback && (!res.error ? callback(res) : callback(false));

          // 设置了缓存过期时间 [只缓存GET|且正常请求]
          // ps: 过期请求会被直接覆盖
          if (post && !res.error && !isNaN(note)) {
            wx.setStorage({
              key: api,
              data: {
                url,
                end: new Date().getTime() + (note * 1000),
                data: res
              },
            });
            console.log(api + '存入了本地!')
          }
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
        console.log('请求调用出错: ', err);
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

    let setBar = (key, val) => {
      key == 'title' ?
        wx.setNavigationBarTitle({
          title: `${this.globalData.title} - ${val}`
        }) :
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: val,
        });
    }

    value ? setBar(json, value) : Object.keys(json).forEach((val, key) =>
      setBar(val, json[val])
    );
  },

});