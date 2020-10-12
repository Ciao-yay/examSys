// pages/test/test.js
const app = getApp();
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true, // 判断是否尚在加载中
    questions: [],
    r: 0,
    question: {}
  },
  /**
   * 切换题目
   */
  switchQ: function(e) {
    var that = this;
    that.setData({
      isLoading: true,
      question:{}
    })
    var questions = that.data.questions; //题目列表
    var newR = fuc.randomNum(0, questions.length - 1); //0~列表长度-1间生成随机数
    var question = app.towxml(questions[newR], 'markdown') //解析公式
    console.log(question)
    console.log(questions[newR])
    that.setData({
      question: question,
      isLoading: false
    })

  },
  onLoad: function() {
    const _ts = this;
    /**
     * 获取题目
     */
    fuc.request(api.getLatexSubject, {}).then(function(res) {
      var questions = [];
      for (var i = 0; i < res.data.length; i++) {
        questions.push(res.data[i].question);//题目列表
      }
      var question = app.towxml(questions[0], 'markdown')//解析初始题目
      console.log(question)
      console.log(questions[0])
      _ts.setData({
        questions: questions,
        question: question
      })
    });
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