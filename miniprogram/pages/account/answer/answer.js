const app = getApp();
Page({

  data: {
    msg: [{
      l_content: "我发送了一条回复",
      is_question: 1,
      create_time: "2018-12-20 18:09:00"
    }, {
        l_content: "我发送了一条回复",
        is_question: 1,
        create_time: "2018-12-20 18:09:00"
      }, {
        l_content: "我发送了一条回复",
        is_question: 1,
        create_time: "2018-12-20 18:09:00"
      }, {
        l_content: "我发送了一条回复",
        is_question: 1,
        create_time: "2018-12-20 18:09:00"
      }, {
        l_content: "我发送了一条回复",
        is_question: 1,
        create_time: "2018-12-20 18:09:00"
      }, {
        l_content: "我发送了一条回复",
        is_question: 1,
        create_time: "2018-12-20 18:09:00"
      }, {
        l_content: "我发送了一条回复",
        is_question: 1,
        create_time: "2018-12-20 18:09:00"
      }],
    inputValue: '',
    scrollTop: 1000000
  },

  onLoad: function(option) {
    console.log(option)
    console.log(app.globalData.userInfo)
    this.setData({
      user: app.globalData.userInfo
    })
    app.bar({
      title: "咨询医生",
      bgColor: "#B5CFFF"
    });
  },

  onShow: function() {},

  /**
   * 发送消息
   */
  sendInput: function(e) {
    let con = e.detail.value.content;
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
        scrollTop: 1000000
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