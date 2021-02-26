// pages/stuIndex/stuIndex.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
var moment = require("../../utils/moment.js")

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    exams: [],
    isShow: false
  },
  //查看所有测试
  toExams: function (e) {
    // console.log(e)
    wx.navigateTo({
      url: '../exams/exams',
    })
  },
  //参加考试
  joinExam: function (e) {
    let that = this;
    let todo = that.data.userInfo.todo
    let i = e.currentTarget.dataset.index;
    let exam = that.data.exams[i];
    if (exam.isOut) {
      wx.showModal({
        title: '时间已过',
        content: '当前时间已超过截止时间，不能进行考试'
      })
    } else {
      if (todo >= 0) {
        wx.showModal({
          title: '测试' + that.data.exams[todo].ex_name + '未完成',
          content: '是否继续考试？',
          success: function (res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              exam = that.data.exams[todo];
              console.log(exam)
              wx.reLaunch({
                url: '../preExam/preExam?exam=' + JSON.stringify(exam),
              })
            }
          }
        })
      } else {
        console.log(exam)
        wx.showModal({
          title: '是否立即参加考试？',
          content: '点击确定立即开始考试！',
          success(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../preExam/preExam?exam=' + JSON.stringify(exam),
              })
            } else if (res.cancel) { }
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    wx.login({
      success: res => {
        //发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res.code);
        fuc.request(api.getOpenid, {
          "code": res.code
        }).then(function (res) {
          if (res.data == wx.getStorageSync("userInfo").s_openid) {
            // console.log('进入true')
            let userInfoNew = wx.getStorageSync("userInfo");
            // console.log(userInfoNew)
            app.globalData.userInfo = userInfoNew
            that.setData({
              userInfo: userInfoNew
            })
            // that.data.userInfo = userInfoNew;
            fuc.request(api.getExamList, {
              sid: userInfoNew.s_id
            }).then(function (res) {
              if (res.data.code) {
                var exams = res.data.data;
                // 时间格式转换
                exams = that.formatTime(exams)
                exams = exams.filter(item => item.status < 2)
                that.setData({
                  exams,
                  isShow: exams.length
                })
                /* 判断有不有已经开始作答的试卷 */
                userInfoNew.todo = fuc.isFree(exams)
                // console.log(userInfoNew.todo)
                that.data.userInfo = userInfoNew
                app.globalData.userInfo = userInfoNew;
                wx.hideLoading()
                if (userInfoNew.todo >= 0) {
                  wx.showModal({
                    title: '还有考试未完成',
                    content: '是否继续考试？',
                    success: function (res) {
                      if (res.cancel) {
                        //点击取消,默认隐藏弹框
                      } else {
                        var exam = that.data.exams[userInfoNew.todo];
                        console.log(exam)
                        wx.reLaunch({
                          url: '../preExam/preExam?exam=' + JSON.stringify(exam),
                        })
                      }
                    }
                  })
                }
              } else {
                that.setData({
                  isShow: false
                })
                wx.hideLoading()
              }
            })
          } else {
            wx.hideLoading()
            wx.getStorageSync("userInfo")
            wx.showLoading({
              title: '身份过期',
              success: function (res) {
                wx.reLaunch({
                  url: '../chooseIdentity/chooseIdentity',
                })
              }
            })
          }
        })
      }
    })
  },
  unLogin: function (e) {
    wx.showModal({
      title: '退出登录',
      content: '是否退出登录并清空缓存？',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          wx.clearStorage()
          wx.showLoading({
            title: '注销中',
            success: function () {
              wx.reLaunch({
                url: '../chooseIdentity/chooseIdentity',
              })
            }
          })
        }
      }
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