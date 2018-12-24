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
    let value = `${option.id}?token=${token}`;
    // 未读读内容获取[权重 高]
    app.request(value, "getUnreadQA", res => {
      if (!res.data.length) return;

      // 如果 未读先得到则合并 但是 已读一定得在未读后面
      if(this.data.msg.length) {
        this.data.msg.push(...res.data);
        list = this.data.msg;
      }

      // 计算时差
      let list = this.unDate(res.data);
      this.setData({
        msg: list,
        end: list.length - 1,
        loading: false
      });
      console.log(list)
    });
    // 咨询消息读取[权重 中]
    app.request(value, "getAskDoctorDetail", res => {
      if (res.data) {
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
    // 已读内容获取[权重 低]
    app.request(value, "getHistoryQA", res => {
      if (!res.data.length) return;

      // 计算时差
      let list = this.unDate(res.data);

      // 最后一条消息后面显示历史消息
      (list.length > 0) && (list[list.length - 1].old = true);

      // 如果 未读先得到则合并 但是 已读一定得在未读后面
      this.data.msg.length && list.push(...this.data.msg);

      this.setData({
        msg: list,
        end: list.length - 1,
        loading: false
      });
      // 滑动到历史位置[测试]
      let query = wx.createSelectorQuery();
      query.select('.old').boundingClientRect();
      query.exec(res => {
        this.setData({
          scrollTop: res[0].top + 'rpx'
        });
      });
      console.log(list)

    });
  },

  onShow: function() {

  },

  /**
   * 发送消息
   */
  sendInput: function(e) {
    let con = e.detail.value.content || e.detail.value;
    if (con && typeof con == 'string') {
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


  ss: function(e) {
    //选择id
    query.select('.old').boundingClientRect()
    query.exec(function(res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      console.log(res);
      //取高度
      console.log(res[0].top);
    })

  },

  /**
   * 时差计算
   */
  unDate: function(date) {
    // 计算时间差
    return date.map((val, ind, arr) => {
      let date = new Date(val.create_time),
        date2 = arr[ind - 1] ? new Date(arr[ind - 1].create_time) : 0;

      val.addDate = date2 - date < -timeC ? val.create_time : false;
      return val;
    });
  },
})