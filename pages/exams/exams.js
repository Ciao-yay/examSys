// pages/exam/exam.js
var app = getApp()
var api = require('../../utils/api.js')
var fuc = require('../../utils/fuc.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: app.globalData.userInfo
    exams: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var data = {}
    data.sid = app.globalData.userInfo.s_id
    console.log(data)
    fuc.request(api.getExamAllBySid, data).then(function(res) {
      var exams = res.data;
      // 时间格式转换
      for (var i = 0; i < exams.length; i++) {
        exams[i].start_time = fuc.rTime(exams[i].start_time)
        exams[i].end_time = fuc.rTime(exams[i].end_time)
      }
      console.log(res.data)
      that.setData({
        exams:res.data
      })
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