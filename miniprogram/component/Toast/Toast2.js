// component/Toast.js
// 组件作者: 郑余国

// 任务列表
let Task = [],
  // 显示状态
  show = null,
  self = null;

Component({

  properties: {

    // 传入参数
    data: {
      type: Object,
      value: {}
    }
  },

  data: {

    // icon图标
    error: 'wrong',
    success: 'chenggong',
    warning: 'jinggao',
    loading: 'loading',
    zhiwen: 'zhiwen',
    saoma: 'saoma',
  },

  methods: {},

  ready: function() {

    self = this;

    // 监听 data 数据变化
    Object.defineProperty(this.data, 'data', {

      // 当数据被改变时 被设置
      set: function(data) {

        let Toast = new Message(data);
        // 如果 没有正在显示的Toast则 显示 否则 如果是无限期显示的Toast则隐藏后显示
        !show ? Toast.send() : !show.data.hide && show.hide();
        
      }

    });

  },
  pageLifetimes: {
    hide: function () {
      show && (Task = [], show = null, clearTimeout(n), a.setData({
        msg: {
          _text: "",
          _type: "",
          _icon: ""
        }
      }));
    }
  }
});

function Message(data) {
  if (typeof data !== 'object') throw Error('data 必须为 Object!');
  if (!data.text) throw Error('data.text 值不能为空!');

  // 隐藏时间或持续显示 否则 1500ms 后消失
  data.hideTime = (data.hideTime || data.hideTime === false) ? data.hideTime : 2500;

  // 加入任务列队
  Task.push({
    text: data.text,
    icon: self.data[data.icon] || "",
    back: data.icon,
    hide: data.hideTime,
    callback: data.callback
  });

}

Message.prototype = {

  data: {},

  // 显示Toast
  send: function() {
    let after = Task[0];
    if (after && !show) {
      self.setData({
        msg: {
          _text: after['text'],
          _type: after['back'],
          _icon: after['icon']
        }
      });
      // 如果Toast不是false则有消失时间
      after['hide'] && setTimeout(this.hide, after['hide']);
      this.data = after;
      show = this;
      Task.shift();
    }
  },

  // 隐藏Toast
  hide: function () {
    show.data.callback && show.data.callback();
    // 清空显示
    show = null;
    self.setData({
      msg: {
        _text: "",
        _type: "",
        _icon: ""
      }
    });
    // 400毫秒后检测列队
    setTimeout(Message.check, 400);
  }

};

Message.check = function () {
  if (Task[0]) !show ? Message.prototype.send() : !show.data.hide && show.hide();
}