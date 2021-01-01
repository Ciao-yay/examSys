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
  /* 考试详情 */
  examDetail(){
    /* 
      进入一个新的页面？

    */
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
      // console.log(exams);
      // 时间格式转换
      exams = fuc.formatExams(exams)
      console.log(exams);
      that.setData({
        exams: exams
      })
    })
  },
})