// pages/chooseIdentity/chooseIdentity.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    isAlive: false
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
  fastLogin: function() {
    wx.showToast({
      title: '即将跳转到首页',
      icon: 'success',
      success: function() {
        wx.reLaunch({
          url: '../stuIndex/stuIndex',
        })
      }
    })
  },
  inputLogin:function(){
    wx.showLoading({
      title: '切换中',
    })
    var that = this
    wx.clearStorageSync("userInfo")
    that.setData({
      isAlive:false,
      userInfo:null
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    if (wx.getStorageSync("userInfo")) {
      var userStor = wx.getStorageSync("userInfo")
      console.log(true, userStor)
      /**
       * wx.login
       */
      fuc.request(api.fastLogin, {
        sopenid: userStor.s_openid,
        stuid: userStor.student_id
      }).then(function(res) {
        console.log(res.data)
        wx.hideLoading()
        switch (res.data) {
          case 0:
            wx.clearStorageSync("userInfo")
            wx.showModal({
              title: '缓存失效',
              content: '缓存失效，请输入账号登录',
            })
            break;
          case 1:
            that.setData({
              isAlive: true,
              userInfo: userStor
            })
            break;
          default:
            wx.showToast({
              title: '系统出问题了',
            })
            break;
        }
      })
    }else{
      wx.hideLoading()
    }
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