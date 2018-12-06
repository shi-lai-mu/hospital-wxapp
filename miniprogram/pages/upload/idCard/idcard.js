const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isId: ""
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

    let self = this;
    if (!this.data.isId) return this.setData({
      toast: {
        text: '请拍摄或者选择一张身份证正面照片!',
        icon: 'error'
      }
    });

    wx.uploadFile({
      url: app.globalData.ip + "api/SetIDCard?token=" + app.globalData.userInfo.token,
      filePath: this.data.isId,
      name: "idcard",
      success: function(res) {
        let data = JSON.parse(res.data);
        if(data.error) {
          let err = data.error;
          switch (data.error) {
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
          return self.setData({
            toast: {
              text: err,
              icon: 'error',
              hideTime: 4000
            }
          });
        } else if (data.status == "ok") {

        }
      },
      fail: console.error
    });
  }
})