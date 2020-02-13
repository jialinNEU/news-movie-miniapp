function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
}

function http(url, callback) {
  wx.request({
    url: url,
    method: 'GET',
    header: { 'Content-Type': 'json' },
    success: function(res) {
      callback(res.data);
    },
    fail: function(error) {
      console.log(error);
    },
  });
}

function convertToCastString(casts) {

}

function convertToCastInfos(casts) {

}

module.exports = {
  convertToStarsArray,
  convertToCastString,
  convertToCastInfos,
  http,
};