const app = getApp();
let outInter = null,
  mssion_id = 0;

Page({

  data: {
    isId: "",
    sendState: "发送",
    res: {}
  },

  onLoad: function(e) {
    e && this.setData(e);
  },

  onShow: function() {
    app.bar({
      title: "身份认证",
      bgColor: "#b5cfff"
    });
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
  inputBlur: function(t) {
    this.setData({
      [t.target.dataset.id]: t.detail.value.length ? "nick" : ""
    });
  },

  /**
   * 选择图片
   */
  camera: function(e) {
    let self = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        self.setData({
          isId: res.tempFilePaths[0]
        });
      }
    });
  },

  /**
   * 身份证上传
   */
  upload: function() {

    if (!this.data.isId) return this.setData({
      toast: {
        text: '请拍摄或者选择一张身份证正面照片!',
        icon: 'error'
      }
    });

    // 如果为上传家庭成员身份证
    if (this.data.addFamily) return this.addFamily();

    this.uploadFile(res => {
      if (res.status) {
        app.globalData.userInfo = [];
        wx.removeStorageSync('userInfo');
        wx.switchTab({
          url: '../../account/account'
        });
      }
    });
  },

  /**
   * 上传家庭成员身份证
   */
  addFamily: function() {
    this.uploadFile(res => {

      this.setData({
        code: true,
        res
      });
    });

  },

  /**
   * 返回按钮
   */
  hideCode: function() {
    this.setData({
      code: false
    });
  },

  /**
   * 发送验证码
   */
  sendCode: function (e) {
    e = e.detail.value;
    if (e.codes) {
      // 验证 验证码是否正确
      app.request(`${mssion_id}/${e.codes}?token=${app.globalData.userInfo.token}`, 'addFamilySendCode', res => {
        if (res.data.status) {
          wx.navigateBack({
            delta: 1
          });
        } else this.setData({
          toast: {
            text: "身份证验证失败:" + res.data.error,
            icon: "error"
          }
        });
      });
    } else if (e.phone) {
      let res = this.data.res;
      app.request(`${res.mssion_id}/${res.code}/${e.phone}?token=${app.globalData.userInfo.token}`, 'addFamilyGetCode', res => {

        // 冷却
        if (!isNaN(res)) return this.countDown((res / 1000).toFixed(0));

        // 如果存在mssion_id
        if (res.data.mssion_id) {

          mssion_id = res.data.mssion_id;
          this.setData({
            toast: {
              text: "验证码已发送!请输入...",
              icon: "success",
              hideTime: 3000
            }
          });
          // 冷却倒计时
          this.countDown(60);
        } else this.setData({
          toast: {
            text: "验证码发送失败:" + res.data.error,
            icon: "error"
          }
        });
      }, false, 60);
    }
  },

  /**
   * 身份证错误信息翻译
   */
  idCardError: function(error) {
    let err = error;
    switch (error) {
      case "not a patient account":
        err = "不是病人的账号!";
        break;
      case "Unbound main system account":
        err = "未绑定的主系统账号!";
        break;
      case "no image file upload":
        err = "图片上传程序错误!";
        break;
      case "recognize error":
        err = "图片无法识别,请按要求拍摄!";
        break;
      case "Image type error":
        err = "图片类型错误,无法识别为身份证!";
        break;
      case "please upload face side":
        err = "请上传身份证正面的照片!";
        break;
      case "card number is empty":
        err = "卡号为空!";
        break;
    }
    return err;
  },

  uploadFile: function(callback) {

    let self = this,
      url = !this.data.addFamily ?
        app.globalData.ip + "api/SetIDCard?token=" + app.globalData.userInfo.token :
        app.globalData.ip + "api/addFamilyUserStep1?token=" + app.globalData.userInfo.token;

    wx.uploadFile({
      url,
      filePath: this.data.isId,
      name: "idcard",
      success: function(res) {

        let data = JSON.parse(res.data);
        if (data.error) {
          let err = self.idCardError(data.error);
          return self.setData({
            toast: {
              text: err,
              icon: 'error',
              hideTime: 4000
            }
          });
        } else callback(data);
      },
      fail: console.error
    });
  },

  /**
   * 倒计时
   */
  countDown: function (outTime) {
    outInter = setInterval(() => {
      if (!outTime) {
        clearInterval(outInter);
        outTime = "发送";
      }
      this.setData({
        sendState: outTime
      });
      outTime--;
    }, 1000);
  }
})