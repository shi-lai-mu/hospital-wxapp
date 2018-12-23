const app = getApp();
const timeC = 60 * 1000;
Page({

  data: {
    msg: [],
    end: 0,
    inputValue: '',
    scrollTop: 0,
    loading: true
  },

  onLoad: function(option) {
    console.log(app.globalData.userInfo)

    // option.id = 648;

    this.setData({
      user: app.globalData.userInfo,
      id: option.id
    });
    app.bar({
      title: "咨询医生",
      bgColor: "#B5CFFF"
    });
    let token = app.globalData.userInfo.token;
    let value = `${option.id}?token=${token}`;
    // 咨询消息读取
    app.request(value, "getAskDoctorDetail", res => {
      console.log(res.data)
      if (res.data) {
        console.log(res.data)
        this.setData({
          detail: res.data
        });
      } else this.setData({
        toast: {
          text: "咨询数据读取错误,不存在或无权限!",
          icon: "error"
        }
      });
    });
    // 已读内容获取
    app.request(value, "getHistoryQA", res => {

      // 计算时间差
      let list = res.data.map((val, ind, arr) => {
        let date = new Date(val.create_time),
          date2 = arr[ind - 1] ? new Date(arr[ind - 1].create_time) : 0;
        val.addDate = date2 - date < -timeC ? val.create_time : false;
        return val;
      });
      (list.length > 0) && (list[list.length - 1].old = true); 
      this.setData({
        msg: list,
        end: list.length - 1,
        loading: false
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
    if (typeof con == 'string') {
      let msg = this.data.msg;
      // 时差计算
      let time = app.getDate("yyyy-MM-dd hh:mm:ss");
      msg.push({
        l_content: con,
        is_question: 1,
        create_time: time,
        addDate: msg[msg.length - 1] ? (new Date(msg[msg.length - 1].create_time) - new Date(time) < -timeC) ? time : false : time
      });
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

  /**
   * 
   */
  addContent: function(e) {
    if (e._relatedInfo) {
      this.setData({
        inputValue: e._relatedInfo.anchorTargetText
      })
    }
  },
})