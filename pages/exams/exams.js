// pages/exam/exam.js
var app = getApp()
var api = require('../../utils/api.js')
var fuc = require('../../utils/fuc.js')
var moment = require("../../utils/moment.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    exams: [],
    isShow: false,
    show: false,
    examsTodo:[],
    examsDone:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this
    let sid = app.globalData.userInfo.s_id
    that.data.userInfo = app.globalData.userInfo
    try {
      let result = await fuc.request(api.getExamList, { sid })
      console.log(result)
      if (result.data.code) {
        let exams = result.data.data
        exams = that.formatTime(exams)
        let examsTodo = exams.filter(item=>item.status<2)
        let examsDone = exams.filter(item=>item.status===2)
        that.setData({
          exams,
          examsTodo,
          examsDone,
          isShow: true
        })
      } else {
        console.log(result.data.msg)
        that.setData({
          isShow: false
        })
      }
    } catch (e) {
      console.log(e)
      that.setData({
        isShow: false
      })
    }
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