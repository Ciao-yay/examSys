// pages/teaIndex/teaIndex.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: 1,
    userInfo: {},
    courses: []
  },

  /**
   * 跳转到授课管理
   */
  toManageTeach: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../manageTeach/manageTeach?courses=' + JSON.stringify(that.data.courses) + '&userInfo=' + JSON.stringify(that.data.userInfo),
    })
  },
  /**
   * 跳转到课程详情
   */
  toTeachDes: function(e) {
    var that = this;
    var i = e.currentTarget.dataset.index;
    console.log(that.data.courses[i],that.data.userInfo)
    wx.navigateTo({
      url: '../courseDes/courseDes?course=' + JSON.stringify(that.data.courses[i]) + '&userInfo=' + JSON.stringify(that.data.userInfo),
    })
  },
  /**
   * 注销
   */
  unLogin: function(e) {
    wx.showModal({
      title: '退出登录',
      content: '是否退出登录并清空缓存？',
      success: function(res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          // wx.clearStorage()
          wx.showLoading({
            title: '注销中',
            success: function() {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /**
     * 获取教师信息
     */
    var that = this;
    fuc.request(api.getTeacherInfo, {
      tid: that.data.tid
    }).then(function(res) {
      var newUserInfo = res.data[0];
      that.setData({
        userInfo: newUserInfo
      })
    })
    /**
     * 获取授课信息
     */
    fuc.request(api.getTeachInfo, {
      tid: that.data.tid
    }).then(function(res) {
      var newCourses = res.data;
      console.log(newCourses)
      that.setData({
        courses: newCourses
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