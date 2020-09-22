// pages/publishExam/publishExam.js
const fuc = require('../../utils/fuc.js')
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {},
    userInfo: {},
    knowledge: [],
    knowledgeList: [],
    isKnowSelected: false
  },
  /**
   * 选择知识点
   */
  chooseKnow: function(e) {
    var that = this;
    // console.log(e)
    that.setData({
      indexKnow: e.detail.value,
      isKnowSelected: true
    })
  },
  /**
   * 选择知识点
   */
  commit: function(e) {
    var that = this;
    var flag = that.data.isKnowSelected;
    var startTime = "2020/09/20 08:00";
    var endTime = "2020/09/26 08:00";
    var exName = "test";
    var memo = "测试";
    if (flag) {
      wx.showModal({
        title: '确认发布',
        content: '是否发布测试？',
        success(res) {
          if (res.confirm) {
            var examData = {};
            var knowledgeList = that.data.knowledgeList;
            var staKnName = that.data.knowledge[that.data.indexKnow];
            for (var i in knowledgeList) {
              if (knowledgeList[i].kn_name == staKnName) {
                examData.kn_id = knowledgeList[i].kn_id
              }
            }
            var te_id = that.data.course.te_id;
            examData.startTime = startTime;
            examData.endTime = endTime;
            // examData.kn_id = kn_id;
            examData.te_id = te_id;
            examData.exName = exName;
            examData.memo = memo;
            fuc.request(api.publicExamTest, examData).then(function(res) {
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
     * 接收参数,将json字符串转换成对象
     */
    var newCourse = JSON.parse(options.course);
    var userInfo = JSON.parse(options.userInfo);
    that.setData({
      course: newCourse,
      userInfo: userInfo
    })

    /**
     * 获取课程列表
     */
    var crs_id = newCourse.crs_id;
    console.log(crs_id)
    fuc.request(api.getKnowledgeBycrs_id, {
      crs_id
    }).then(function(res) {
      var knowledgeList = res.data;
      var knowledge = [];
      console.log(knowledgeList);
      for (var x in knowledgeList) {
        knowledge.push(knowledgeList[x].kn_name)
      }
      console.log(knowledge);
      that.setData({
        knowledgeList: knowledgeList,
        knowledge: knowledge
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