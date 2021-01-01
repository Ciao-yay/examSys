  // pages/loginTest/loginTest.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    studentid: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  getUserid: function(e) {
    var that = this;
    var temp = e.detail.value;
    that.data.studentid = temp
  },
  formSubmit(e) {
    // console.log(e.detail.value.input)
    // let input = parseInt(e.detail.value.input)
    // console.log(input)
    let that = this;
    let isRight = false
    const reg = /[0-9]{3,11}$/
    //先判断格式
    isRight = reg.test(e.detail.value.input);
    if (isRight) {
      wx.showLoading({
        title: '查询中',
        mask:true
      })
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          fuc.request(api.loginTest, {
            "code": res.code,
            "studentid": e.detail.value.input
          }).then(function(res) {
            var data = res.data
            wx.hideLoading();
            if(data == -1){
              wx.showToast({
                title: '小程序正在调整',
              })
            }
            switch (data[0].statusUser) {
              case -1:
                //学号输入错误或没有该学生信息
                // console.log("case -1:")
                that.reinput();
                break;
              case 0:
                //未绑定当前微信号，请先绑定
                wx.showModal({
                  title: '确认信息',
                  content: "您的姓名：" + data[0].s_name,
                  success: function(res) {
                    if (res.cancel) {
                      //点击取消,默认隐藏弹框
                    } else {
                      //点击确定
                      wx.showModal({
                        title: '账号绑定',
                        content: '该账号暂未绑定微信，是否绑定当前微信号？',
                        success: function(res) {
                          if (res.cancel) {
                            //点击取消,默认隐藏弹框
                          } else {
                            //点击确定
                            fuc.request(api.bindUser, {
                              "stuid": data[0].student_id,
                              "openid": data[1]
                            }).then(function(res) {
                              if (res.data = 1) {
                                data[0].s_openid = data[1]
                                let newUserInfo = data[0]
                                newUserInfo.todo = -1
                                wx.setStorageSync("userInfo", newUserInfo)
                                // console.log(wx.getStorageSync("userInfo"))
                                wx.showToast({
                                  title: '绑定成功，即将跳转到首页',
                                  icon: 'success',
                                  success: function() {
                                    wx.reLaunch({
                                      url: '../stuIndex/stuIndex',
                                    })
                                  }
                                })
                              } else {
                                wx.showToast({
                                  title: '绑定失败',
                                })
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
                break;
              case 1:
                //已绑定，选择是否直接登录
                let newUserInfo = data[0]
                newUserInfo.todo = -1
                wx.setStorageSync("userInfo", newUserInfo)
                // console.log(wx.getStorageSync("userInfo"))
                wx.showLoading({
                  title: '登录成功，即将跳转到首页',
                  icon: 'success',
                  success: function() {
                    wx.reLaunch({
                      url: '../stuIndex/stuIndex',
                    })
                  }
                })
                break;
              case 2:
                //该账号已绑定，请输入正确学号
                wx.showToast({
                  title: '账号不匹配',
                  icon: 'none'
                })
                break;
            }
          })
        }
      })
    } else {
      // console.log("格式错误，不可以提交")
      wx.showToast({
        title: '格式错误，不可以提交',
        icon: 'none'
      })
    }
  },
  //给出提示并重新输入
  reinput: function() {
    wx.showToast({
      title: '没有该账号！请重新输入！',
      icon: 'none',
      mask: true
    })
  }
})