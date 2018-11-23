// component/Toast.js 
// 组件作者: 郑余国     https://gitee.com/slm47888/wechat_applet__component_toast

// 任务列表
let Task = [], show = null, self = null, hide = null, fn = [];

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
  methods: {
    selectClick: function (e) {
      // 点击按钮时执行函数
      let Id = e.target.dataset.fn;
      fn[Id - 1] && fn[Id - 1]();
    }
  },
  ready: function () {
    // 监听 data 数据变化
    Object.defineProperty(this.data, 'data', {
      // 当数据被改变时 被设置
      set: function (data) {
        let Toast = new Message(data);
        // 如果 没有正在显示的Toast则 显示 否则 如果是无限期显示的Toast则隐藏后显示
        !show ? Toast.send() : !show.data.hide && show.hide();
      }
    });
  },
  pageLifetimes: {
    // 修复切换页面的BUG
    hide: function () {
      show && (Task = [], show = null, clearTimeout(hide), this.setData({
        msg: {}
      }));
    },
    show: function () {
      self = this;
    },
  }
});

function Message(data) {
  if (typeof data !== 'object') throw Error('data 必须为 Object!');
  // 隐藏时间或持续显示 否则 1500ms 后消失
  data.hideTime = (data.hideTime || data.hideTime === false) ? data.hideTime : 2500;
  // 修复耦合度 短时间内最多重复两条相同消息
  if (Task.length) {
    let t = Task[Task.length - 1];
    if (t.text == data.text && t.icon == self.data[data.icon]) return;
  }
  // 加入任务列队
  Task.push({
    text: data.text,
    icon: self.data[data.icon] || "",
    back: data.icon,
    hide: data.hideTime,
    callback: data.callback,
    select: data.select || false
  });
}

Message.prototype = {
  data: {},
  // 显示Toast
  send: function () {
    let after = Task[0];
    if (after && !show) {
      // 记录触发函数
      for (let key in after['select']) {
        let val = after['select'][key];
        after['select'][key]._fn = val.click ? fn.push(val.click) : false
      }
      // 触发驱动
      self.setData({
        msg: {
          _text: after['text'],
          _type: after['back'],
          _icon: after['icon'],
          select: after['select']
        }
      });
      // 如果Toast不是false则有消失时间
      after['hide'] && (hide = setTimeout(this.hide, after['hide']));
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