// pages/teachDes/teachDes.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {},
    userInfo: {},
    isShow: false,
    exams: []
  },
  /**
   * 跳转到发布测试页面
   */
  toPublishExam: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../publishExam/publishExam?course=' + JSON.stringify(that.data.course) + '&userInfo=' + JSON.stringify(that.data.userInfo),
    })
  },
  /**
   * 是否展示功能
   */
  showMore: function(e) {
    var that = this;
    var flag = !that.data.isShow;
    that.setData({
      isShow: flag
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    /**
     * 接收参数,将json字符串转换成对象
     */
    var newCourse = JSON.parse(options.course);
    var userInfo = JSON.parse(options.userInfo);
    that.setData({
      course: newCourse,
      userInfo: userInfo
    })
    /**
     * 获取已发布测试信息
     */
    fuc.request(api.getExamInfoByte_id, {
      te_id: newCourse.te_id
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