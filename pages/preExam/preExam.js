// pages/preExam/preExam.js
var fuc = require("../../utils/fuc.js");
var api = require("../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    exam: {},
    hasDone: 0,
    subject: {},
    subjects: [],
    isRight: true,
    subResult: [{
      "rightTotal": 0,
      "wrongTotal": 0,
      "level": 1
    }],
    countDown: false,
    yourAnswer: ''
  },

  /**
   * 提交并开始下一题（测试用）
   */
  async nextSubject(e) {
    let that = this
    let {
      subject,
      exam,
      subjects,
      subResult,
      yourAnswer
    } = that.data
    let isRight = yourAnswer === subject.answer
    let isRightNum = isRight ? 1 : 0
    let replyRecord = {}
    let sid = app.globalData.userInfo.s_id;
    wx.showModal({
      title: '提交题目',
      content: '是否提交本题答案并开始下一题？',
      success(res) {
        if (res.confirm) {
          commitSubject()
        }
      }
    })
    function commitSubject(){
      wx.showLoading({
        title: '提交中',
      })
      if (yourAnswer != '') {
        //添加答题记录
        replyRecord = that.addRecord(yourAnswer, isRightNum, subject.prbm_id, exam.ex_id, sid, exam.tst_id)
        let hasDoneL = 0 //同等级难度一共做的题目量
        let newSubResult = subResult //更新答题记录
        fuc.request(api.addReplyRecord, replyRecord).then((res, err) => {
          if (res.data == 1) {
            for (let i = 0; i < subResult.length; i++) {
              if (subject.level == subResult[i].level) {
                if (isRight) {
                  newSubResult[i].rightTotal += 1
                } else {
                  newSubResult[i].wrongTotal += 1
                }
                let total = newSubResult[i].rightTotal + newSubResult[i].wrongTotal
                hasDoneL = total > hasDoneL ? total : hasDoneL
                break
              }
              if (i == subResult.length - 1) {
                newSubResult.push({
                  rightTotal: isRight ? 1 : 0,
                  wrongTotal: isRight ? 0 : 1,
                  level: subject.level
                })
              }
            }
            that.data.subResult = newSubResult
            wx.hideLoading()
            wx.showLoading({
              title: '加载中',
            })
            //获取题目难度
            let newLevel = that.getLevel(isRight, exam.min_level, exam.max_level, subject.level);
            // console.log(newLevel)
            if ((isRight && newLevel == 0) || hasDoneL >= 5) {
              /**
               * 1、提交试卷
               * 2、生成完整试卷，生成成绩
               * 3、跳转到考试结束页面
               */
              wx.hideLoading()

              console.log("(isRight && newLevel == 0) || hasDoneL >= 5",isRight,newLevel,hasDoneL)
              that.commitResult(exam)
            } else {
              let tittle = "回答错误！"
              let content = "下一题难度降低！"
              if (isRight) {
                tittle = "回答正确！"
                content = "下一题难度增加！"
              }
              wx.hideLoading()
              wx.showModal({
                title: tittle,
                content: content,
                showCancel: false,
                success: function (res) {
                  wx.showLoading({
                    title: '加载中',
                  })
                  let subjectsL = subjects.filter(item => item.level === newLevel)
                  /* 初始题目 */
                  let i = fuc.randomNum(subjectsL.length);
                  that.setData({
                    subject: {}
                  })
                  subject = fuc.addOptions(subjectsL[i])
                  that.data.yourAnswer = ''
                  that.data.isRight = false,
                    that.setData({
                      subject,
                      hasDone: that.data.hasDone + 1
                    });
                  wx.hideLoading()
                }
              })
            }
          } else {
            console.log(err)
          }
        })
      } else {
        wx.hideLoading()
        wx.showModal({
          title: '无法提交！',
          content: '当前还未作答，无法提交，请先完成本题！',
        })
      }
    }
  },
  /**
   * 处理错误，跳转到错误页面
   * @param {*} err 
   */
  toErrPage(err) {
    wx.reLaunch({
      url: '../err/err?err=' + err,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this
    let exam = JSON.parse(options.exam)
    that.data.exam = exam
    let tstid = exam.tst_id
    let etime = new Date(exam.end_time).getTime()
    let ntime = new Date().getTime()
    console.log(ntime > etime)
    // 进入时刚好时间截止则立即结束测试
    if (ntime > etime) {
      wx.showLoading({
        title: '考试已结束',
        mask: true
      })
      setTimeout(() => {
        wx.hideLoading({
          success: (res) => {
            console.log("考试已结束")
            wx.reLaunch({
              url: '../stuIndex/stuIndex',
            })
          },
        })
      }, 2000)
    } else {
    // 否则开始倒计时 
      /* 自动提交 */
      setTimeout(() => {
        try {
          that.commitResult(exam)
        } catch (error) {
          console.log(error)
        }
      }, (etime - ntime))
      that.countDown()
      let newLevel = 1
      let subjectsL = []
      let subjects = []
      /**
       * 先获取考试状态（从上个页面传过来）
       *    看tst.status,1为进行中、0为未开始、2为已完成
       *    1:
       *      接着做，查答题记录，计算下一题难度
       *    0：
       *      初始化
       */
      if (exam.status === 0) {
        /* 更改考试状态 */
        try {
          await fuc.request(api.toTodo, { tstid })
        } catch (error) {
          console.log(error)
        }
      } else {
        /* 查看记录 */
        try {
          let res = await fuc.request(api.hasRecord, { tstid })
          if (res.data != -1) {
            that.setData({
              hasDone: res.data.hasDone
            })
            that.data.subResult = res.data.result
            let tempLevel = res.data.recentRecord.level
            let tempResult = res.data.recentRecord.result
            console.log(tempLevel, tempResult)
            if (tempResult == 0) {
              if (tempLevel == 1) {
                newLevel = tempLevel
              } else {
                newLevel = tempLevel - 1
              }
            } else {
              newLevel = tempLevel + 1
            }
          }
        } catch (error) {
          console.log(error)
        }
      }
      /* 获取考试列表 */
      if (newLevel > exam.max_level) {
        console.log("newLevel > exam.max_level")
        that.commitResult(exam)
      } else {
        try {
          let res = await fuc.request(api.tGetSubjects, {
            level:newLevel,
            exid: exam.ex_id
          })
          if (res.data) {
            subjects = res.data
            console.log(subjects)
            // 解析题目
            fuc.latexToMarkdown(subjects);
            that.data.subjects = subjects
            console.log(newLevel,exam.max_level)
            console.log(exam)

            subjectsL = subjects.filter(item => item.level === newLevel)
            /* 初始题目 */
            let i = fuc.randomNum(subjectsL.length);
            console.log(i)
            console.log(subjectsL)
            let subject = fuc.addOptions(subjectsL[i])
            that.setData({
              subject
            })
            wx.hideLoading()
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  },

  // 监听子组件，获取选择的答案
  getChooseAnwser(e) {
    this.data.yourAnswer = e ? e.detail.yourAnwser : ''
  },
  // 倒计时
  countDown: function () {
    var that = this;
    var nowTime = new Date().getTime(); //现在时间（时间戳）
    var endTime = new Date(that.data.exam.end_time).getTime(); //结束时间（时间戳）
    var time = (endTime - nowTime) / 1000; //距离结束的毫秒数
    // 获取天、时、分、秒
    let day = parseInt(time / (60 * 60 * 24));
    let hou = parseInt(time % (60 * 60 * 24) / 3600);
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    // console.log(day + "," + hou + "," + min + "," + sec)
    day = that.timeFormin(day),
      hou = that.timeFormin(hou),
      min = that.timeFormin(min),
      sec = that.timeFormin(sec)
    that.setData({
      day: that.timeFormat(day),
      hou: that.timeFormat(hou),
      min: that.timeFormat(min),
      sec: that.timeFormat(sec)
    })
    // 每1000ms刷新一次
    if (time > 0) {
      that.setData({
        countDown: true
      })
      setTimeout(this.countDown, 1000);
    } else {
      that.setData({
        countDown: false
      })
    }
  },
  //小于10的格式化函数（2变成02）
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  //小于0的格式化函数（不会出现负数）
  timeFormin(param) {
    return param < 0 ? 0 : param;
  },
  // 提交测试
  async commitResult(exam) {
    wx.showLoading({
      title: '考试结束',
      mask: true
    })
    let score
    // 查看是否有记录
    try {
      let res = await fuc.request(api.hasRecord, { tstid: exam.tst_id })
      if (res.data.hasDone == 0) {
        score = 0
      } else {
        let subResult = res.data.result
        score = this.getScore(subResult, exam.max_level)
      }
      console.log(exam.max_level, score)
    } catch (error) {
      console.log(error)
    }
    // 封装答题结果
    let examResult = this.addExamResult(score, exam.tst_id)
    try {
      let res = await fuc.request(api.commitResult, examResult)
      if (res.data == 1) {
        wx.reLaunch({
          url: '../examFinished/examFinished?score=' + score,
        })
      } else {
        wx.hideLoading()
        wx.showLoading({
          title: '提交失败',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
        console.log("提交失败")
        wx.reLaunch({
          url: '../stuIndex/stuIndex',
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
  //添加答题记录(要改一下的)
  addRecord(answer, result, prbm_id, ex_id, s_id, tst_id) {
    var obj = {}
    obj.answer = answer;
    obj.result = result;
    obj.prbm_id = prbm_id;
    obj.ex_id = ex_id;
    obj.s_id = s_id;
    obj.tst_id = tst_id
    return obj;
  },
  /**
 * 难度判定算法（测试版本）
 * 参数
 * isRight 是否回答正确,
 * minLevel 最小难度,
 * maxLevel 最大难度,
 * currentLevel 当前难度
 * 判定：
 * -答对了
 * --难度在最小难度到最大难度之间 不包括最大难度，返回难度加1
 * --难度等于最大难度，则认为都已掌握，结束答题
 * -答错了
 * --难度在最小难度到最大难度之间 包括最大难度，不包括最小难度，返回难度-1
 * --难度等于最小难度，返回难度不变
 */
  getLevel(isRight, minLevel, maxLevel, currentLevel) {
    if (isRight) {
      if (currentLevel >= minLevel && currentLevel < maxLevel) {
        return currentLevel + 1
      } else {
        return 0
      }
    } else {
      if (currentLevel > minLevel && currentLevel <= maxLevel) {
        return currentLevel - 1
      } else {
        return currentLevel
      }
    }
  },
  //添加考试结果数据
  addExamResult(score, tst_id) {
    var obj = {}
    obj.score = score;
    obj.tst_id = tst_id;
    return obj;
  },
  /**
 * 成绩判定算法（测试版本）
 * 每个难度占的分值：题目难度*当前难度答对的题/当前难度总共答的题
 * 分数：每个难度占的分值的和/难度和
 * 
 */
  getScore(subResult, maxLevel) {
    // console.log(maxLevel)
    let score = 0
    let levelTotal = 0
    let base = 4
    let baseScore = 40
    levelTotal = ((base + 1) + maxLevel + base) * maxLevel / 2
    for (var i = 0; i < subResult.length; i++) {
      let rightTotal = subResult[i].rightTotal
      let wrongTotal = subResult[i].wrongTotal
      let total = rightTotal + wrongTotal
      let level = subResult[i].level + base
      if (total != 0) {
        score += (100 - baseScore) * level * rightTotal / total
      }
    }
    let tempScore = Math.round(score / levelTotal + baseScore)
    console.log(score, levelTotal, tempScore)
    return score === 0 ? 0 : tempScore
  }
})