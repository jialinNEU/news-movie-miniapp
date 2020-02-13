import { Movie } from 'model/Movie.js';
var app = getApp();

Page({
  data: { movie: {} },

  onLoad: function(options) {
    var movieId = options.id;
    var url = app.globalData.doubanBase +
      "/v2/movie/subject/" + movieId;
    var movie = new Movie(url);

    movie.getMovieData((movie) => {
      this.setData({ movie });
    });
  },

  viewMoviePostImg: function(event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的 http 链接
      urls: [src], // 需要预览的图片http链接列表
    });
  },
});