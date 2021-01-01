// pages/wrongSubs/wrongSubs.js
const fuc = require('../../utils/fuc')
const api = require('../../utils/api')
const app = getApp();
Page({
  data: {
    isLoading: false,
    activeNames: ['0'],
    isCourseSelected: false,
    crsNameList: [],
    wrongSubs: [],
    isShow: false,
  },
  /**
   * 跳转到详情
   */
  toDetail(e) {
    // console.log(e)
    let prbm_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../wsDetail/wsDetail?prbm_id=' + prbm_id,
    })
  },
  /**
   * 选择科目
   */
  chooseCourse(e) {
    var that = this;
    // console.log(e)
    that.setData({
      indexCourse: e.detail.value,
      isCourseSelected: true
    })
  },
  onChange(e) {
    // console.log(e)
    this.setData({
      activeNames: e.detail,
    });
  },
  /**
   * 生命周期函数
   */
  onLoad(options) {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log(app.globalData.userInfo.sid)
    /* 获取错题 */
    fuc.request(api.tGetWrongSubs, {
      sid: app.globalData.userInfo.s_id
    }).then(res => {
      console.log(res)
      if (res.data == -1 || res.data.length === 0) {
        that.setData({
          isShow: false
        })
      } else {
        let tempSubs = res.data.map(item => {
          item.totalWrong = 0
          return item
        })
        let crsNameList = tempSubs.map(item => item.crs_name).filter((item, i, self) => self.indexOf(item) === i)
        let tempSubs1 = []
        tempSubs1[0] = tempSubs[0]
        tempSubs1[0].totalWrong = 0
        console.log(tempSubs1)
        for (let i = 0; i < tempSubs.length; i++) {
          for (let j = 0; j < tempSubs1.length; j++) {
            if (tempSubs[i].prbm_id === tempSubs1[j].prbm_id) {
              tempSubs1[j].totalWrong += 1
              break
            }
            if (j == tempSubs1.length - 1) {
              tempSubs1.push(tempSubs[i])
            }
          }
        }
        // console.log(tempSubs1)
        /* 列出知识点 */
        let wrongSubs = []
        let temp = {}
        temp.knName = tempSubs1[0].kn_name
        temp.subs = []
        temp.id = 0
        wrongSubs.push(temp)
        for (let i = 0; i < tempSubs1.length; i++) {
          for (let j = 0; j < wrongSubs.length; j++) {
            if (tempSubs1[i].kn_name === wrongSubs[j].knName) {
              break;
            }
            temp.knName = tempSubs1[i].kn_name
            temp.subs = []
            temp.id = j + 1
            wrongSubs.push(temp)
          }
        }
        // console.log(wrongSubs)
        /* 绑定题目与知识点 */
        for (let i = 0; i < wrongSubs.length; i++) {
          for (let j = 0; j < tempSubs1.length; j++) {
            // console.log(i,wrongSubs[i].knName,tempSubs[j].kn_name)
            if (wrongSubs[i].knName === tempSubs1[j].kn_name) {
              tempSubs1[j].question = app.towxml(tempSubs1[j].question, 'markdown');
              wrongSubs[i].subs.push(tempSubs1[j])
              // continue
            }
          }
        }
        // console.log(wrongSubs)
        that.setData({
          crsNameList,
          wrongSubs,
          isLoading: false,
          isShow: true
        })
      }
      wx.hideLoading()
    }, err => {
      wx.hideLoading()
      // wx.reLaunch({
      //   url: '../err/err?err='+err,
      // })
      throw new Error(`${err}服务器开小差了`)
    })

    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效

  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      currentTab: 0 //当前页的一些初始数据，视业务需求而定
    })
    this.onLoad(); //重新加载onLoad()
  },
});