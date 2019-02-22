let loading = null;
App({
  /**
   * 公共数据
   */
  globalData: {
    version: "0.8.0 [Alpha]",
    title: "康达互联网医院",

    // 域名
    ip: "http://127.0.0.1/",
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
      // 获取 专家列表
      getExpertDoc: "getExpertDoc",

      // 医生注册
      doctorRegister: "bindAndRegMainSysAccountDoc/?token=",
      // 用户注册
      userRegister: "bindAndRegMainSysAccountPat/?token=",
      // 注册 [验证 验证码]
      finishBindAndRegMssion: "finishBindAndRegMssion/",

      // 获取 家庭成员列表
      getFamilyList: "getFamilyList?",
      // 添加 家庭成员[发送验证码]
      addFamilyGetCode: "addFamilyUserStep2/",
      // 添加 家庭成员[验证码验证]
      addFamilySendCode: "addFamilyUserStep3/",
      // 删除 家庭成员
      deleteFamilyUser: "deleteFamilyUser/",

      // 添加医生咨询
      addDoctorAsk: "addDoctorAsk?token=",
      // 医生发送聊天：回复
      docAddAnswer: "docAddAnswer?token=",
      // 病人发送聊天：咨询
      patAddAnswer: "patAddAnswer?token=",
      // 获取咨询信息
      getAskDoctorDetail: "getAskDoctorDetail/",
      // 获取未读的聊天信息
      getUnreadQA: "getUnreadQA/",
      // 设置 标记聊天消息已读
      qaMarkAsRead: "QAMarkAsRead/",
      // 获取 历史聊天记录
      getHistoryQA: "getHistoryQA/",
      // 获取 [病人]活跃的咨询列表
      getDocAskListByPatAlive: "getDocAskListByPatAlive?token=",
      // 获取 [病人]活跃的咨询列表
      getDocAskListByPatClose: "getDocAskListByPatClose?token=",
      // 获取 [医生]活跃的咨询列表
      getDocAskListByDocAlive: "getDocAskListByDocAlive?token=",
      // 获取 [医生]关闭的咨询列表
      getDocAskListByDocClose: "getDocAskListByDocClose?token=",
    },
    userInfo: {},
    doctor: false
  },



  onLaunch: function() {
    wx.cloud.init();

    let storage = wx.getStorageSync("userInfo");
    if (storage && storage.bind_account && storage.endTime > Date.now() / 1000) {
      this.globalData.userInfo = storage;
      this.globalData.doctor = this.isDoctor();
    }

      /////////////////

      // 初始化本地缓存
      !wx.getStorageSync('colling') && wx.setStorage({
        key: 'colling',
        data: {},
      });


    // 获取全部部门列表 [读取本地,超过一小时则重新获取]

    this.request("", "getAllDept", res => {

      let deptList = [];
      // 主部门
      for (let id in res.data) {
        // 子部门
        let subDrpt = res.data[id].subDept;
        for (let subId of subDrpt) {
          // 格式 主部门ID.子部门ID = 子部门名字
          deptList[`${id}.${subId.id}`] = subId.name;
        }
      }

      this.globalData.dept = res.data;
      this.globalData.deptList = deptList;
    }, 3600);
  },



  /**
   * 判断是否登录
   */
  isLogin: function() {
    return this.globalData.userInfo.bind_account ? this.globalData.userInfo : false;
  },



  /**
   * 判断是否上传身份证
   */
  isCard: function() {
    return this.isLogin() ? this.globalData.userInfo.bind_account.patientname : false;
  },



  /**
   * 判断是否为医生
   */
  isDoctor: function() {
    return this.isLogin() ? !!this.globalData.userInfo.bind_account.ysdm : false;
  },


  /**
   * 获取公共信息
   */
  getMessage: function(tag) {

    let msg = {
      'not login': '请先登录!'
    }

    if (tag in msg) return msg[tag];

    return 'error msg!';
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
  request: function(data, api, callback, note, colling) {

    let post = (typeof data == "string"),

      url = this.globalData.ip +
      (this.globalData.url[api] ? "api/" + this.globalData.url[api] : api) +
      (post ? data : "") +
      (note && isNaN(note) ? note : "");

    let storage_coll = wx.getStorageSync('colling');

    // 查看是否存在缓存,有则直接返回[GET]
    if (post && note) {
      let storage = wx.getStorageSync(api);

      // 存在数据 && url相等 && 数据未过期
      if (storage &&
        storage.url == url &&
        storage.end >= Date.now()
      ) {
        // 添加缓存识别
        storage.data.storage = true;
        return callback(storage.data);
      }
    } else if (colling) {
      // 非缓存数据 才有冷却
      if (api in storage_coll) {
        if (storage_coll[api] > Date.now()) {
          return callback(storage_coll[api] - Date.now());
        }
      }
    }

    // 设定过久显示互动
    let showToast = false;
    // 禁止显示toast api列表
    let notLoading = {
      getHistoryQA : 1,
      patAddAnswer : 1,
      qaMarkAsRead : 1,
      docAddAnswer : 1,
      getUnreadQA: 1
    };
    // 如果不在不显示toast列表内
    if (!(api in notLoading)) {
      loading = setTimeout(() => {
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          mask: true,
          duration: 10000
        });
        showToast = true;
      }, 1500);
    }

    let req = wx.request({
      url,
      method: post ? "GET" : "POST",
      data: post ? false : data,
      success: res => {
        // 是否有计数器 有则 清除
        if (loading) {
          clearTimeout(loading);
          loading = null;

          // 判断是否正在显示图标
          if (showToast) {
            wx.hideToast();
            showToast = false;
          }
        }

        if (res.statusCode == 200 || res.statusCode == 304) {
          callback && (!res.error ? callback(res) : callback(false));

          // 设置了缓存过期时间 [只缓存GET|且正常请求]
          // ps: 过期请求会被直接覆盖
          if (post && !res.error) {
            if (!isNaN(note) && note) {
              res.header && delete res.header;
              wx.setStorage({
                key: api,
                data: {
                  url,
                  end: Date.now() + note * 1000,
                  data: res
                },
              });
            }
            if (colling) {
              storage_coll[api] = Date.now() + colling * 1000;
              wx.setStorage({
                key: 'colling',
                data: storage_coll,
              });
            }
          }
        } else {
          wx.showToast({
            title: `内部服务器出现问题!请稍后再试[ERROR: ${api}]`,
            icon: "none",
            mask: true,
            duration: 2000
          });
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
   * @param {string} value 单项设定时调用,当包含","文字将会是黑色反之白色[格式 "#ffffff,000"]
   */
  bar: function(json, value) {

    let setBar = (key, val) => {
      key == 'title' ?
        wx.setNavigationBarTitle({
          title: `${this.globalData.title} - ${val}`
        }) :
        wx.setNavigationBarColor({
          frontColor: val.indexOf(',') == -1 ? "#ffffff" : "#000000",
          backgroundColor: val.split(',')[0],
        });
    }

    value ? setBar(json, value) : Object.keys(json).forEach((val, key) =>
      setBar(val, json[val])
    );
  },



  /**
   * 返回格式的时间
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * eg:
   * "yyyy-MM-dd hh:mm:ss.S"   ==> 2006-07-02 08:09:04.423
   * "yyyy-MM-dd E HH:mm:ss"   ==> 2009-03-10 二 20:09:04
   * "yyyy-MM-dd EE hh:mm:ss"  ==> 2009-03-10 周二 08:09:04
   * "yyyy-MM-dd EEE hh:mm:ss" ==> 2009-03-10 星期二 08:09:04
   * "yyyy-M-d h:m:s.S"        ==> 2006-7-2 8:9:4.18
   */
  getDate: function(fmt) {
    let date = new Date();
    let o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
      "H+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    };
    let week = {
      "0": "日",
      "1": "一",
      "2": "二",
      "3": "三",
      "4": "四",
      "5": "五",
      "6": "六"
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

});