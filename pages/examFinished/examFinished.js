// pages/examFinshed/examFinshed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subResult:[],
    score : 0,
  },
  backHome:function(e){
    // wx.navigateTo({
    //   url: '../stuIndex/stuIndex',
    // })
    // wx.switchTab({
    //   url: '../stuIndex/stuIndex',
    //   success:function(e){
    //     var page = getCurrentPages().pop()
    //     console.log(page)
    //     if(page == undefined || page == null) return;
    //     page.onLoad();
    //   }
    // })
    wx.reLaunch({
      url: '../stuIndex/stuIndex',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var subResult = JSON.parse(options.subResult)

    that.setData({
      subResult: subResult,
      score : options.score
    })
    console.log(subResult)
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