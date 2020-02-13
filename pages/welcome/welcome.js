Page({
  onTap: function() {
    // wx.navigateTo({
    //   url: '../posts/posts',
    // });

    // wx.redirectTo({
    //   url: '../posts/posts',
    // });
    
    wx.switchTab({
      url: '../posts/posts',
    });
  },

  onUnload: function() {
    console.log('unload');
  },

  onHide: function() {
    console.log('hide');
  },
});

/*
  wx.navigateTo({})
    - 可以回到来源页面，触发onHide

  wx.redirectTo({})
    - 无法回到来源页面，触发onUnload
 */