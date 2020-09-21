// pages/addTeach/addTeach.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: 1,
    courseList: [],
    courses: [],
    classList: [],
    directionClass: [],
    isClassSelected: false,
    isCourseSelected: false,
    teachData: {},
  },
  /**
   * 选择课程
   */
  chooseCourse: function(e) {
    var that = this;

    // console.log(e)
    that.setData({
      index: e.detail.value,
      isCourseSelected: true
    })
  },
  /**
   * 选择班级
   */
  chooseClass: function(e) {
    var that = this;
    // console.log(e)
    that.setData({
      indexClass: e.detail.value,
      isClassSelected: true
    })
  },
  /**
   * 提交授课信息
   */
  commit: function(e) {
    var that = this;
    var flag = that.data.isClassSelected && that.data.isCourseSelected;
    if (flag) {
      wx.showModal({
        title: '确认添加',
        content: '是否添加授课？',
        success(res) {
          if (res.confirm) {
            var teachData = that.data.teachData;
            var courseList = that.data.courseList;
            var classList = that.data.classList;
            var tid = that.data.tid;
            var staCrsName = that.data.courses[that.data.index];
            var staClName = that.data.directionClass[that.data.indexClass];
            teachData.tid = tid;
            for (var i in courseList) {
              if (courseList[i].crs_name == staCrsName) {
                teachData.crsid = courseList[i].crs_id
              }
            }
            for (var i in classList) {
              if (classList[i].cl_name == staClName) {
                teachData.clid = classList[i].cl_id
              }
            }
            console.log(teachData);
            fuc.request(api.addTeach, teachData).then(function(res) {
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                mask: true,
                complete(res) {
                  wx.navigateTo({
                    url: '../teaIndex/teaIndex',
                  })
                }
              })
            })
          } else if (res.cancel) {

          }
        }
      })
    } else {
      wx.showModal({
        title: '信息缺失!',
        content: '请完善信息！',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    /**
     * 获取课程列表
     */
    fuc.request(api.getCourseList, {}).then(function(res) {
      var courseList = res.data;
      var courses = [];
      for (var x in courseList) {
        courses.push(courseList[x].crs_name)
      }
      that.setData({
        courseList: courseList,
        courses: courses
      })
    })


    /**
     * 获取班级列表
     */
    fuc.request(api.getClassList, {}).then(function(res) {
      var classList = res.data;
      var directionClass = [];
      for (var x in classList) {
        directionClass.push(classList[x].cl_name)
      }
      that.setData({
        classList: classList,
        directionClass: directionClass
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