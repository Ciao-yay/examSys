// pages/examDes/examDes.js
var app = getApp()
var api = require('../../utils/api.js')
var fuc = require('../../utils/fuc.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo:app.globalData.userInfo
    userInfo:wx.getStorageSync('userInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(that.data.userInfo)
  },
})