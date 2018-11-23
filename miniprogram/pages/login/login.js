const app = getApp();
let mssion_id = null;
Page({
  data: {
    shouji: '',
    suo: '',
    phone: '',
    codes: '',
    bindMode: true,
    token: '',
    inputValue: {
      code: false,
      codePhone: false
    }
  },
  onLoad: function(t) {
    t.bindMode && this.setData(t);
  },
  onReady: function() {
    this.data.bindMode && this.setData({
      toast: {
        text: '请完成手机绑定...',
        icon: 'zhiwen'
      }
    });
  },
  inputFocus: function(t) {
    var a = {};
    a[t.target.dataset.id] = 'changed', this.setData(a);
  },
  inputBlur: function(t) {
    var a = {};
    a[t.target.dataset.id] = t.detail.value ? 'nick' : '', this.setData(a);
  },
  login: function() {
    this.setData({
      toast: {text: '正在为您绑定微信...',icon: 'warning'}
    }), this.setData({
      toast: {
        text: '绑定成功!',
        icon: 'success',
        callback: function() {
          wx.switchTab({
            url: '/pages/account/account'
          });
        }
      }
    });
  },
  bind: function(e) {
    let value = e.detail.value;
    if (value.phone) {
      if (value.codes) {
        if (!mssion_id) return this.setData({
          toast: { text: '未找到验证信息!', icon: 'error' }
        });
        app.request(`${mssion_id}/${value.codes}/?token=${this.data.token}`, 'finishBind', res => {
          if (res.error) {
            this.setData({
              toast: { text: '验证码错误!', icon: 'error' }
            });
          } else {
            this.setData({
              toast: { text: '验证码错误!', icon: 'error' }
            });
            wx.navigateBack({
              delta: 1
            });
          }
        });
      } else {
        app.request(`${value.phone}/?token=${this.data.token}`, 'existAccount', res => {
          if (res.data) {
            mssion_id = res.data.mssion_id;
            this.setData({
              toast: { text: '验证码已发送!请输入...', icon: 'success', hideTime: 3000 }
            });
          } else this.setData({
            toast: {text: '验证码发送失败:' + res.data.error, icon: 'error'}
          });
        });
      }
    } else return this.setData({
      toast: {text: '手机信息为空!',icon: 'error'}
    });
  }
});