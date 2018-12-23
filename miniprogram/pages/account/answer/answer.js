const app = getApp();
Page({

  data: {
    msg: [],
    end: 0,
    inputValue: '',
    scrollTop: 0
  },

  onLoad: function(option) {
    console.log(app.globalData.userInfo)

    option.id = 648;
    
    this.setData({
      user: app.globalData.userInfo,
      id: option.id
    });
    app.bar({
      title: "咨询医生",
      bgColor: "#B5CFFF"
    });
    let token = app.globalData.userInfo.token;
    app.request(`${option.id}?token=${token}`, 'getHistoryQA', res => {
      console.log(res)
      this.setData({
        msg: res.data,
        end: res.data.length
      });
    });
  },

  onShow: function() {

  },

  /**
   * 发送消息
   */
  sendInput: function(e) {
    let con = e.detail.value.content || e.detail.value;
    if (con) {
      let msg = this.data.msg;
      console.log(this.data.inputValue)
      msg.push({
        "l_content": con,
        "is_question": 1,
        "create_time": app.getDate("yyyy-MM-dd EEE hh:mm:ss")
      });
      console.log(msg)
      this.setData({
        msg,
        inputValue: '',
        scrollTop: msg.length * 100 + 'px'
      });
    }
  },

  /**
   * 切换工具栏
   */
  toggleTool: function() {
    this.setData({
      tool: !!!this.data.tool
    });
  },
})