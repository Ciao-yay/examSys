// pages/teachDes/teachDes.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
var moment = require("../../utils/moment.js")

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
  examDetail() {
    /* 
      进入一个新的页面？

    */
  },
  /**
   * 跳转到发布测试页面
   */
  toPublishExam: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../publishExam/publishExam?course=' + JSON.stringify(that.data.course) + '&userInfo=' + JSON.stringify(that.data.userInfo),
    })
  },
  /**
   * 是否展示功能
   */
  showMore: function (e) {
    var that = this;
    that.setData({
      isShow: !that.data.isShow
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /**
     * 接收参数,将json字符串转换成对象
     */
    // console.log()
    var newCourse = JSON.parse(options.course);
    var userInfo = JSON.parse(options.userInfo);
    // var newCourse = { cl_name: "测试班级", countExam: 0, countStu: 10, crs_id: 1, crs_name: "大学数学",status: "1",te_id: 21}
    // var userInfo = { t_id: 1, t_name: "张老师", t_createTime: "2020-08-06T16:00:00.000Z", t_openid: "", tno: "t001" }
    console.log(newCourse)
    that.setData({
      course: newCourse,
      userInfo: userInfo
    })
    /**
     * 获取已发布测试信息
     */
    fuc.request(api.getExamInfoByte_id, {
      te_id: newCourse.te_id
    }).then(function (res) {
      var exams = res.data;
      console.log(exams);
      // 时间格式转换
      exams = that.formatTime(exams)
      console.log(exams);
      that.setData({
        exams: exams
      })
    })
  },
  // 格式化时间
  formatTime(exams) {
    return exams.map(item => {
      item.startTime = moment(item.startTime).format("YYYY-MM-DD HH:mm:ss")
      item.finishTime = moment(item.finishTime).format("YYYY-MM-DD HH:mm:ss")
      item.public_time = moment(item.public_time).format("YYYY-MM-DD HH:mm:ss")
      item.end_time = moment(item.end_time).format("YYYY-MM-DD HH:mm:ss")
      item.isOut = moment(item.end_time).isBefore(new Date());
      return item
    })
  },
})