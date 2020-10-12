// pages/preExam/preExam.js
var fuc = require("../../utils/fuc.js");
var api = require("../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sid: app.globalData.sid,
    abcd: app.globalData.abcd,
    tittle: "回答错误！",
    content: "下一题难度降低，请继续作答！",
    ex_id: 0,
    yourAnswer: '',
    isRight: true,
    prePrbm_id: 0,
    level: 0,
    crsid: 0,
    countDown: "00:09:59",
    exam: {},
    subject: {},
    subjects: [],
    data: {},
    hasDone: 0,
    startTime: '',
    subResult: [],
    isLoading: true, // 判断是否尚在加载中
  },
  //单选，选中的选项变色，其他选项恢复正常
  selectFuc: function(e) {
    // console.log(arguments)
    var id = e.currentTarget.dataset.id;
    var abcd = this.data.abcd;
    abcd = fuc.changeOption(abcd, id);
    this.setData({
      abcd: abcd,
      yourAnswer: abcd[id].name
    });
  },

  commitFuc: function(e) {
    var that = this;
    that.testFuc(1);
  },
  testFuc: function(a) {
    // console.log("现在还不能交卷呢！" + a)
  },
  /**
   * 同难度随机换一题（测试用）
   */
  changeSubject: function(e) {
    var that = this;
    that.changeSubFuc(that.data.subjects);

  },
  //难度不变的情况下切换题目
  changeSubFuc: function(subjects) {
    var that = this;
    //生成随机数，从题目对象中随机选一道题目
    var i = fuc.randomNum(1, subjects.length) - 1
    var subject = fuc.addOptions(subjects[i]);
    that.setData({
      subject: subject,
      abcd: fuc.removeOptionColor(that.data.abcd),
      yourAnswer: ''
    });
  },
  /**
   * 提交并开始下一题（测试用）
   */
  nextSubject: function(e) {
    var that = this;
    var yourAnswer = that.data.yourAnswer;
    var subject = that.data.subject;
    var replyRecord = that.data.data;
    var isRight = fuc.isRight(yourAnswer, subject.answer);
    var isRightNum = fuc.isRightToNum(isRight); //0（错误）或1（正确），数据库字段需要
    var level = that.data.level;
    var exam = that.data.exam;
    var content = that.data.content;
    var tittle = that.data.tittle;
    var abcd = that.data.abcd;
    var sid = that.data.sid;
    var level = that.data.level;
    var newSubResult = that.data.subResult;
    var examResult = {}
    // console.log(sid);
    // console.log(isRight + '' + abcd);
    wx.showModal({
      title: '提交题目',
      content: '是否提交本题答案并开始下一题？',
      success(res) {
        if (res.confirm) {
          if (yourAnswer != '') {
            /**
             * 1、添加答题记录
             * 2、判断答案是否正确
             * 3、获取题目难度
             */
            //添加传入数据
            // console.log(sid);
            replyRecord = fuc.addRecord(replyRecord, yourAnswer, isRightNum, subject.prbm_id, that.data.ex_id, sid);
            //  console.log(replyRecord);
            //添加答题记录
            fuc.request(api.addReplyRecord, replyRecord).then(function(res) {
              // console.log(res);
            })
            //记录答题正误数
            if (isRight) {
              newSubResult[level - exam.min_level].rightTotal += 1;
            } else {
              newSubResult[level - exam.min_level].wrongTotal += 1;
            }
            // console.log(newSubResult);
            //获取题目难度
            // console.log(isRight);
            var newLevel = fuc.getLevel(isRight, exam.min_level, exam.max_level, level);
            // console.log(newLevel);
            if (isRight && newLevel == 0) {
              /**
               * 1、提交试卷
               * 2、生成完整试卷，生成成绩
               * 3、跳转到考试结束页面
               */
              wx.showModal({
                title: '考试结束！',
                content: '前往查看成绩！',
                success: function(res) {
                  var score = fuc.getScore(newSubResult);
                  // console.log(fuc.addExamResult(sid, that.data.startTime, score, exam.ex_id));
                  examResult = fuc.addExamResult(sid, that.data.startTime, score, exam.ex_id)
                  fuc.request(api.commitResult, examResult).then(function(res) {
                    // console.log(res.data)
                    if(res.data == 1){
                      wx.navigateTo({
                        url: '../examFinished/examFinished?subResult=' + JSON.stringify(newSubResult) + '&score=' + score,
                      })
                    }else{
                      wx.showLoading({
                        title: '提交失败',
                      })
                      setTimeout(function () {
                        wx.hideLoading()
                      }, 500)
                      wx.reLaunch({
                        url: '../stuIndex/stuIndex',
                      })
                    }
                  })
                }
              })
            } else {
              fuc.request(api.test, {
                level: newLevel,
                crsid: that.data.crsid,
              }).then(function(res) {
                // console.log(res.data);
                //获取题目对象
                var subjects = res.data;
                var newSubs = [];
                newSubs = fuc.latexToMarkdown(subjects);
                if (isRight) {
                  tittle = "回答正确！",
                    content = "下一题难度增加！"
                }
                wx.showModal({
                  title: tittle,
                  content: content,
                  showCancel: false,
                  success: function(res) {
                    //生成随机数，从题目对象中随机选一道题目
                    // console.log(''+136+subjects);
                    var i = fuc.randomNum(1, newSubs.length) - 1;
                    that.setData({
                      subject:{}
                    })
                    var newSub = {};
                    newSub = fuc.addOptions(newSubs[i]);
                    // console.log(subject)
                    //清除选项颜色
                    fuc.removeOptionColor(abcd);
                    console.log(newSub)
                    that.setData({
                      subject: newSub,
                      hasDone: that.data.hasDone + 1,
                      subjects: newSubs,
                      level: newLevel,
                      abcd: abcd,
                      yourAnswer: '',
                      isRight: false,
                      subResult: newSubResult,
                      isLoading:false
                    });
                  }
                })
              })
            }
          } else {
            wx.showModal({
              title: '无法提交！',
              content: '当前还未作答，无法提交，请先完成本题！',
            })
          }
        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    /**
     * 接收考试信息,将json字符串转换成对象
     */
    var exam = JSON.parse(options.exam);
    // console.log(exam);
    //获取开始答题时间
    var time = new Date();
    var startTime = time.toLocaleString('chinese', {
      hour12: false
    });
    //生成题目记录
    var newSubResult = fuc.createSubResult(exam.min_level, exam.max_level);
    // console.log(newSubResult);
    that.setData({
      crsid: exam.crs_id,
      ex_id: exam.ex_id,
      level: exam.min_level,
      exam: exam,
      startTime: startTime,
      subResult: newSubResult
    })
    // console.log(that.data.startTime);
    // console.log(that.data.crsid);
    /**
     * 初始化第一道题
     */
    fuc.request(api.test, {
      level: exam.min_level,
      crsid: that.data.crsid,
    }).then(function(res) {
      // console.log(res.data);
      //获取题目对象
      var subjects = res.data;
      var subjects = fuc.latexToMarkdown(subjects);
      // console.log(subjects)
      //生成随机数，从题目对象中随机选一道题目
      var i = fuc.randomNum(1, subjects.length) - 1
      var subject = fuc.addOptions(res.data[i]);
      that.setData({
        subject: subject,
        hasDone: 0,
        subjects: subjects,
        isLoading: false
      });
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