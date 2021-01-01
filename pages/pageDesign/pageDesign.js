// pages/pageDesign/pageDesign.js
const fuc = require('../../utils/fuc')
const api = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  start() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.start();
  },

  pause() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.pause();
  },

  reset() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.reset();
  },

  finished() {
    Toast('倒计时结束');
  },
  show: function (e) {
    console.log(e)
  },
  toErrPage(err) {
    wx.reLaunch({
      url: '../err/err?err=' + err,

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    fuc.request(api.getLatexSubject, {}).then(res => {

      console.log(res.data)
      wx.hideLoading()
      wx.showLoading({
        title: '加载中',
      })
      return fuc.request(api.teacherTest, {})
    }, err => {
      this.toErrPage(err)
    }).then(res => {
      console.log(res.data)
      wx.hideLoading()
    }, err => {
      this.toErrPage(err)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})