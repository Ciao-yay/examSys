//app.js
App({
  // 引入`towxml3.0`解析方法
  towxml: require('/towxml/index'),
  //声明一个数据请求方法
  getText: (url, callback) => {
    wx.request({
      url: url,
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded'
      // },
      success: (res) => {
        if (typeof callback === 'function') {
          callback(res);
        };
      }
    });
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    sid: 1,
    abcd: [{
      id: 0,
      name: "A",
      isSelected: false,
    }, {
      id: 1,
      name: "B",
      isSelected: false,
    }, {
      id: 2,
      name: "C",
      isSelected: false,
    }, {
      id: 3,
      name: "D",
      isSelected: false,
    }],
    ex_ids:[]
  }
})