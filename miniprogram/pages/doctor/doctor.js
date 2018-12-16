const app = getApp();
Page({
  data: {

    // 显示简介
    introduce: true,

    // 菜单标签
    tag: {},
  },
  onLoad: function(options) {
    
    // 默认选中 咨询
    this.showContent('consulting');
  },

  /**
   * 菜单点击后显示
   */
  showContent: function(e) {
    let tag = e.target ? e.target.dataset.tag : e;
    if (this.data.tag[tag]) return;
    this.setData({
      tag: {
        [tag]: {}
      },
      introduce: true
    });
  },

  /**
   * 切換内页
   */
  switchPage: function(e) {
    this.setData({
      [e.target.dataset.page]: true,
      introduce: false
    });
  }
})