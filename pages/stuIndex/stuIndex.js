// pages/stuIndex/stuIndex.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      sid: 1,
      sname: '小明',
      studentid: 17320220301
    },
    time: 1,
    sid: 1,
    exams: []
  },
  //参加考试
  joinExam: function(e) {
    var that = this;
    console.log(e)
    var i = e.currentTarget.dataset.index;
    //将对象转换成json字符串
    var exam = that.data.exams[i];
    console.log(exam);
    wx.showModal({
      title: '是否立即参加考试？',
      content: '点击确定立即开始考试！',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../preExam/preExam?exam=' + JSON.stringify(exam),
          })
        } else if (res.cancel) {}
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var userInfoNew = wx.getStorageSync("userInfo");
    console.log(userInfoNew);
    app.globalData.userInfo = userInfoNew;
    that.setData({
      userInfo: userInfoNew
    })
    fuc.request(api.getExamInfo, {
      sid: userInfoNew.s_id
    }).then(function(res) {
      var exams = res.data;
      // 时间格式转换
      for (var i = 0; i < exams.length; i++) {
        exams[i].start_time = fuc.rTime(exams[i].start_time)
        exams[i].end_time = fuc.rTime(exams[i].end_time)
      }
      console.log(exams);
      that.setData({
        exams: exams
      })
    })
  },
  unLogin: function(e) {
    wx.showModal({
      title: '退出登录',
      content: '是否退出登录并清空缓存？',
      success: function(res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          wx.clearStorage()
          wx.showLoading({
            title: '注销中',
            success: function () {
              wx.reLaunch({
                url: '../chooseIdentity/chooseIdentity',
              })
            }
          })
        }
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