// pages/chooseIdentity/chooseIdentity.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 跳转到教师首页
   */
  toTeaIndex: function(e) {
    wx.navigateTo({
      url: '../teaIndex/teaIndex',
    })
    // wx.switchTab({
    //   url: '../teaIndex/teaIndex',
    // })
  },
  /**
   * 跳转到学生首页
   */
  toStuIndex: function(e) {
    // wx.navigateTo({
    //   url: '../stuIndex/stuIndex',
    // });
    // wx.switchTab({
    //   url: '../stuIndex/stuIndex',
    // })
    wx.reLaunch({
      url: '../loginTest/loginTest',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.login({
      success: res => {
        //发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res.code);
        fuc.request(api.getOpenid, {
          "code": res.code,
          "appid": app.globalData.appid,
          "appsecret": app.globalData.appsecret
        }).then(function(res) {
          var userInfo = wx.getStorageSync("userInfo")
          if (res.data == userInfo.s_openid) {
            wx.showLoading({
              title: '跳转中',
              success: function(res) {
                wx.reLaunch({
                  url: '../stuIndex/stuIndex',
                })
              }
            })

          } else {

          }
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})