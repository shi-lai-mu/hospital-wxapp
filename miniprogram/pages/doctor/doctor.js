const app = getApp();
Page({
  data: {
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
    this.setData({
      tag: {
        [e.target ? e.target.dataset.tag : e]: true
      }
    });
  }
})