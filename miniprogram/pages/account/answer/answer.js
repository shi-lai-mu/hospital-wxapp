const app = getApp();
const timeC = 60 * 1000;
let msgBox = {},
  token = false,
  last = 0,
  scroll = null;

let unRead = null;

Page({

  data: {
    msg: [],
    end: 0,
    inputValue: '',
    scrollTop: 0,
    loading: true
  },

  onLoad: function(option) {

    option.id = 659;
    this.setData({
      user: app.globalData.userInfo,
      id: option.id,
      doctor: app.globalData.doctor
    });
    app.bar({
      title: "咨询医生",
      bgColor: "#B5CFFF"
    });
    token = app.globalData.userInfo.token;
    let value = `${option.id}?token=${token}`;

    // 未读读内容获取[权重 高]
    app.request(value, "getUnreadQA", res => {

      setTimeout(() => {
        this.setData({
          loading: false
        });
      }, 5000);

      if (!res.data.length) return;

      // 计算时差
      let list = this.unDate(res.data);

      // 如果 未读先得到则合并 但是 已读一定得在未读后面
      if (this.data.msg.length) {
        this.data.msg.push(...res.data);
        list = this.data.msg;
      }

      this.setData({
        msg: list,
        end: list.length - 1,
        loading: false
      });

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

      // 未读位置
      last = list.length;

      // 最后一条消息后面显示历史消息
      // (list.length > 0) && (list[list.length - 1].old = true);
      let listLast = list.length;
      // 如果 未读先得到则合并 但是 已读一定得在未读后面
      this.data.msg.length && list.push(...this.data.msg);

      if (listLast) {
        if (!this.data.doctor) {
          // 最后一条消息后面显示历史消息 但如果已读的前几条为病人的消息 则往下直到医生
          while (list[listLast] && list[listLast].is_question) {
            listLast++;
          }
        } else {
          // 与上条相反 直到病人
          while (list[listLast] && !list[listLast].is_question) {
            listLast++;
          }
        }
        list[listLast - 1].old = true
      }

      this.setData({
        msg: list,
        end: list.length - 1,
        loading: false
      });

      this.update();
      // 滑动到历史位置[测试]
      let query = wx.createSelectorQuery();
      query.select('.old').boundingClientRect();
      query.exec(res => {
        (res[0].top && msgBox.box) && this.setData({
          scrollTop: res[0].top + msgBox.box.height + 'rpx'
        });
      });

    });

    unRead = setInterval(() => {

      app.request(value, "getUnreadQA", res => {

        if (!this.data.msg.length && !res.data.length) return;

        // 计算时差
        let list = this.unDate(res.data);
        // 过滤出自己的消息
        for (let i = 0, l = res.data.length - 1; i < l; i++) {
          if (this.data.doctor) {
            if (!res.data[i].is_question) res.data.splice(i, 1)
          } else {
            if (res.data[i].is_question) res.data.splice(i, 1)
          }
        }
        if (res.data.length) {
          this.data.msg.push(...res.data);
          this.setData({
            msg: this.data.msg
          });
          let oldLast = last;
          // 根据 得到消息进行判断
          for (let i = last, l = this.data.msg.length; i < l; i ++) {
            if (!this.data.doctor && !this.data.msg[i].is_question) last = i;
            if (this.data.doctor && this.data.msg[i].is_question) last = i;
          }
          if (oldLast < last) {
            app.request(`${this.data.id}/${res.data[res.data.length - 1].id}?token=${token}`, "qaMarkAsRead");
          }

          this.update();
          // 滑动到历史位置[测试]
          let query = wx.createSelectorQuery();
          query.select('.msg-box').boundingClientRect();
          query.exec(res => {
            (res[0].top && msgBox.box) && this.setData({
              scrollTop: (last * 150) + 'rpx'
            });
          });
        }

      });
    }, 5000)
  },


  onUnload: function () {
    clearInterval(unRead);
  },

  /**
   * 视图大小更新
   */
  update: function() {
    let query = wx.createSelectorQuery();
    // 得到聊天视图大小
    query.select('.msg-box').boundingClientRect();
    query.exec(res => {
      msgBox.box = res[0];
      let child = wx.createSelectorQuery();
      child.selectAll('.in-box').boundingClientRect();
      child.selectViewport()

      child.exec(res => {
        msgBox.child = res[0];
      });
    });
  },

  onShow: function() {

  },

  /**
   * 发送咨询消息
   */
  sendInput: function(e) {
    let con = e.detail.value.content || e.detail.value;
    if (con && typeof con == 'string') {
      let msg = this.data.msg;
      // 时差计算
      let time = app.getDate("yyyy-MM-dd HH:mm:ss");
      let index = msg.push({
        l_content: con,
        is_question: this.data.doctor ? 0 : 1,
        create_time: time,
        addDate: msg[msg.length - 1] ? (new Date(time) - new Date(msg[msg.length - 1].create_time) > timeC) ? time : false : time
      });

      // 写入数据 并 滚动至底部
      this.setData({
        msg,
        inputValue: '',
        scrollTop: msg.length * 100 + 'px'
      });

      // 向服务器发送消息
      app.request({
        ask_id: this.data.id,
        content: con
      }, this.data.doctor ? "docAddAnswer" : "patAddAnswer", res => {
        if (!res.data.status) {
          this.data.msg[index - 1].error = ' [发送失败]';
          this.setData({
            msg: this.data.msg
          });
        }
      }, token);
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
   * 直接发送内容
   */
  addContent: function(e) {
    if (e._relatedInfo) {
      this.sendInput({
        detail: {
          value: e._relatedInfo.anchorTargetText
        }
      });
    }
  },

  /**
   * 滚动时节流算法触发 [已读算法]
   */
  lower: function(e) {
    // 节流
    clearTimeout(scroll);
    scroll = setTimeout(() => {
      this.update();
      let height = msgBox.box ? msgBox.box.height : 0;
      // 计算可视角大小
      let top = e.detail.scrollTop + height,
        newVl = last;
      
      // 从最后一条开始往下遍历 防止多余的遍历
      for (let i = last, l = msgBox.child.length; i < l; i++) {
        (msgBox.child[i].top <= top && 
          (
            // 标记医生消息
            (!this.data.doctor && !this.data.msg[i].is_question) ||
            // 标记用户消息
            (this.data.doctor && this.data.msg[i].is_question)
          )
        ) && (last = i);
      }

      // 得到屏幕最后一条可见消息 标记已读
      if (newVl < last) {
        app.request(`${this.data.id}/${this.data.msg[last].id}?token=${token}`,"qaMarkAsRead");
      }
    }, 1000);
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