// pages/exam/exam.js
var app = getApp()
var api = require('../../utils/api.js')
var fuc = require('../../utils/fuc.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    exams: [],
    isShow: false,
    show: false,
  },
  /**
   *  点击判断status
   *  0进入测试
   *  1继续完成测试
   *  2查看分数、答题记录
   */
  clickExam(e) {
    let that = this
    let i = e.currentTarget.dataset.index
    let exam = that.data.exams[i]
    let userInfo = that.data.userInfo
    console.log(e, exam.status)
    /* 已完成，点击查看成绩 */
    /* 待完成，先看时间截止没，再看有不有待做的，然后是进入考试 */
    switch (exam.status) {
      /* 待完成，先看有不有待完成 */
      case 0:
        // 判断是否结束
        if (exam.isOut) {
          // 考试结束
          that.examOut()
        } else {
          // 参加考试
          if (userInfo.todo >= 0) {
            wx.showModal({
              tittle: '不能进行当前考试',
              content: `还有测试${that.data.exams[todo].ex_name}未完成，是否先去完成${that.data.exams[todo].ex_name}`,
              success: res => {
                if (res.confirm) {
                  exam = that.data.exams[todo]
                  that.joinExam(exam)
                }
              }
            })
          } else {
            console.log(`参加考试`)
            that.joinExam(exam)
          }
        }
        break
      case 1:
        // 判断是否结束
        if (exam.isOut) {
          // 考试结束
          that.examOut()
        } else {
          that.joinExam(exam)
        }
        break
        /* 已完成，查看详细情况 */
      case 2:
        wx.navigateTo({
          url: '../examDes/examDes?exam=' + JSON.stringify(exam),
        })
        break
    }
    // console.log(exam)
  },

  /**
   *  弹出层控制
   */  
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let sid = app.globalData.userInfo.s_id
    // let sid = 10
    that.data.userInfo = app.globalData.userInfo
    // that.data.userInfo = wx.getStorageSync('userInfo')
    fuc.request(api.getExamAllBySid, {
      sid
    }).then(function (res) {
      if (res.data != null && res.data.length > 0) {
        var exams = res.data;
        // 时间格式转换
        exams = fuc.formatExams(exams)
        that.setData({
          exams: res.data,
          isShow: true
        })
      } else {
        that.setData({
          isShow: false
        })
      }
    })
  },
  /* 自定义函数 */
  joinExam(exam) {
    let title = "是否立即参加考试？"
    let content = "点击确定立即开始考试！"
    if (exam.status == 1) {
      title = "继续答题？"
      content = "当前考试还未完成，点击确定继续答题！"
    }
    wx.showModal({
      title,
      content,
      success: res => {
        if (res.cancel) {} else {
          wx.reLaunch({
            url: '../preExam/preExam?exam=' + JSON.stringify(exam),
          })
        }
      }
    })
  },
  /* 考试过期 */
  examOut() {
    wx.showModal({
      title: '时间已过',
      content: '当前时间已超过截止时间，不能进行考试'
    })
  }
})