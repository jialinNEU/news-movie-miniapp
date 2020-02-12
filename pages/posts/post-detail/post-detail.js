var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({
  data: { isPlayingMusic: false },

  onLoad: function(option) {
    var postId = option.id;
    var postData = postsData.postList[postId];

    // 下面第一行同步数据绑定(数据主要用于js层），第二行是异步（数据用于view层）
    this.data.currentPostId = postId;
    this.setData({ postData });

    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      if (postCollected) {
        this.setData({ collected: postCollected });
      }
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }

    // music
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({ isPlayingMusic: true });
    }
    // 设置监听backgroundAudio的回调函数
    this.setMusicMonitor();
  },

  onShareAppMessage: function(event) {
    return {
      title: '分享标题',
      desc: '分享内容',
      path: '/pages/posts/post-detail/post-detail?id=0',
    };
  },

  /** 自定义函数 */
  setMusicMonitor: function () {
    //点击播放图标和总控开关都会触发这个函数
    var that = this;

    wx.onBackgroundAudioPlay(function(event) {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];

      if (currentPage.data.currentPostId === that.data.currentPostId) {
        // 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到到
        // 当前页面的postid，只处理当前页面的音乐播放。
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          // 播放当前页面音乐才改变图标
          that.setData({
            isPlayingMusic: true
          });
        }
      }
      app.globalData.g_isPlayingMusic = true;
    });

    wx.onBackgroundAudioPause(function() {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      if (currentPage.data.currentPostId === that.data.currentPostId) {
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          that.setData({
            isPlayingMusic: false
          })
        }
      }
      app.globalData.g_isPlayingMusic = false;
    });

    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
  },

  onCollectionTap: function(event) {
    this.getPostsCollectedAsync();
  },

  getPostsCollectedAsync: function() {
    var _this = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function(res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[_this.data.currentPostId];
        // 收藏 与 未收藏 互换
        postCollected = !postCollected;
        postsCollected[_this.data.currentPostId] = postCollected;
        _this.showModal(postsCollected, postCollected);
      },
    })
  },

  getPostsCollectedSync: function() {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 收藏 与 未收藏 互换
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showModal(postsCollected, postCollected);
  },

  showToast: function(postsCollected, postCollected) {
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({ collected: postCollected });
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      duration: 1000,
      icon: 'success',
    });
  },

  showModal: function (postsCollected, postCollected) {
    var _this = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章？' : '取消收藏该文章',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          _this.setData({ collected: postCollected });
        }
      },
    });
  },

  onShareTap: function(event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function(res) {
        // res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: "用户 " + itemList[res.tapIndex],
          content: "是否确定？",
        });
      },
      fail: function(res) {
        console.log('取消分享', res.errMsg);
      }
    });
  },

  onMusicTap: function(event) {
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;

    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({ isPlayingMusic: false });
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg,
      });
      this.setData({ isPlayingMusic: true });
      app.globalData.g_currentMusicPostId = this.data.currentPostId;
      app.globalData.g_isPlayingMusic = true;
    }
  },
});


// app.globalData.g_isPlayingMusic 是微信的总控开关
// this.data.isPlayingMusic 页面的开关