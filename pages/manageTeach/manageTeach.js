// pages/manageTeach/manageTeach.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: 1,
    courses: [],
    userInfo: {}
  },
  /**
   * 添加授课
   */
  toAddTeach: function(e) {
    wx.navigateTo({
      url: '../addTeach/addTeach',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    /**
     * 接收考试信息,将json字符串转换成对象
     */
    var newCourses = JSON.parse(options.courses);
    var userInfo = JSON.parse(options.userInfo);
    that.setData({
      courses: newCourses,
      userInfo: userInfo
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