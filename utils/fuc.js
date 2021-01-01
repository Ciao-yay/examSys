const app = getApp();
// 封装一些函数
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
function getLevel(isRight, minLevel, maxLevel, currentLevel) {
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
}

/**
 * 成绩判定算法（测试版本）
 * 每个难度占的分值：题目难度*当前难度答对的题/当前难度总共答的题
 * 分数：每个难度占的分值的和/难度和
 * 
 */
function getScore(subResult,maxLevel) {
  // console.log(maxLevel)
  let score = 0
  let levelTotal = 0
  let base = 4
  let baseScore = 40
  levelTotal = ((base+1)+maxLevel+base)*maxLevel/2
  for (var i = 0; i < subResult.length; i++) {
    let rightTotal = subResult[i].rightTotal
    let wrongTotal = subResult[i].wrongTotal
    let total = rightTotal + wrongTotal
    let level = subResult[i].level+base
    if (total != 0) {
      score += (100-baseScore) * level * rightTotal / total
    }
    console.log(score)
  }
  let tempScore = Math.round(score / levelTotal+baseScore)
  console.log(score,levelTotal,tempScore)
  return score===0?0:tempScore
}

/**
 * 封封微信的的request
 */
function request(url, data = {}) {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      header: {
        "Content-Type": "application/json"
      }, // 设置请求的 header
      success: res => resolve(res),
      fail: err => reject(err)
    });
  });
}
/*
转换题目选项格式的函数
数据库的存储的题目格式与前端需求的题目格式不一致，每次得到题目后需要先修改下格式
*/
function addOptions(subject) {
  var options = [{
    id: 0,
    content: ""
  }, {
    id: 1,
    content: ""
  }, {
    id: 2,
    content: ""
  }, {
    id: 3,
    content: ""
  }]
  options[0].content = subject.optionA
  options[1].content = subject.optionB
  options[2].content = subject.optionC
  options[3].content = subject.optionD
  subject.options = options
  return subject
}

//生成从minNum到maxNum的随机数
// function randomNum(maxNum) {
//   switch (arguments.length) {
//     case 1:
//       return parseInt(Math.random() + 1, 10)-1;
//     case 2:
//       return parseInt(Math.random() * maxNum + 1, 10)-1;
//     default:
//       return 0;
//   }
// }
function randomNum(maxNum) {
  return parseInt(Math.random() * maxNum + 1, 10)-1;
}
//时间戳转换为时间
function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
//时间转换为时间戳
function formatTimeStamp(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//2020-08-07T00:00:00.000Z格式转换
function rTime(date) {
  var json_date = new Date(date).toJSON();
  return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

//判断题目是否正确
function isRight(yourAnswer, rightAnswer) {
  return yourAnswer == rightAnswer
}

function isRightToNum(isRight) {
  return isRight?1:0
}

function numToIsRight(num) {
  return num == 1
}

// 判断是否能开始新的考试
function isFree(exams){
  for(var i=0,len=exams.length;i<len;i++){
    if(exams[i].status == 1 && !exams[i].isOut){
      return i;
    }
    return -1;
  }
}

//添加答题记录(要改一下的)
function addRecord( answer, result, prbm_id, ex_id, s_id,tst_id) {
  var obj = {}
  obj.answer = answer;
  obj.result = result;
  obj.prbm_id = prbm_id;
  obj.ex_id = ex_id;
  obj.s_id = s_id;
  obj.tst_id = tst_id
  return obj;
}

//添加考试结果数据
function addExamResult(score, tst_id) {
  var obj = {}
  obj.score = score;
  obj.tst_id = tst_id;
  return obj;
}

//改变选项，清楚其他颜色
function changeOption(abcd, id) {
  for (var x of abcd) {
    if (x.id == id) {
      abcd[x.id].isSelected = true
    } else {
      abcd[x.id].isSelected = false
    }
  }
  return abcd
}
//清楚所有选项，清楚所有颜色
function removeOptionColor(abcd) {
  for (var i = 0; i < 4; i++) {
    abcd[i].isSelected = false;
  }
  return abcd
}

//创建subResult数组，用来存每种难度的正误数
function createSubResult(minLevel, maxLevel) {
  var subResult = []
  var length = maxLevel - minLevel + 1
  var level = minLevel
  for (var i = 0; i < length; i++) {
    let subResultObject = {}
    subResultObject.level = level;
    subResultObject.rightTotal = 0;
    subResultObject.wrongTotal = 0;
    subResult.push(subResultObject);
    level++
  }
  return subResult
}

//将数组中的对象转化成字符串
function arrObjectToStr(arr) {
  var newArr = []
  for (var i in arr) {
    var key = Object.keys(arr[i])[0]
    console.log(key)
    newArr.push(arr[i].key)
  }
  return newArr
}
//将LaTex数学公式解析成markdown格式
function latexToMarkdown(subjects) {
  const app = getApp();
  var newSubjects = []
  for (var i = 0; i < subjects.length; i++) {
    var subject = subjects[i]
    subject.question = app.towxml(subject.question, 'markdown');
    subject.optionA = app.towxml(subject.optionA, 'markdown');
    subject.optionB = app.towxml(subject.optionB, 'markdown');
    subject.optionC = app.towxml(subject.optionC, 'markdown');
    subject.optionD = app.towxml(subject.optionD, 'markdown');
    newSubjects.push(subject)
  }
  return newSubjects
}

// function isNum(val) {
//   // 先判定是否为number
//   if (typeof val !== 'number') {
//     return false;
//   }
//   if (!isNaN(val)) {
//     return true;
//   } else {
//     return false;
//   }
// }
function formatExams(exams){
  let ptime = ''
  let etime = ''
  let now = ''
  for (var i = 0; i < exams.length; i++) {
    ptime = new Date(exams[i].public_time)
    etime = new Date(exams[i].end_time)
    exams[i].public_time1 = `${ptime.getFullYear()}-${ptime.getMonth()+1}-${ptime.getDate()} ${ptime.toLocaleTimeString('chinese', { hour12: false })}`.substr(0,19)
    exams[i].end_time1 = `${etime.getFullYear()}-${etime.getMonth()+1}-${etime.getDate()} ${etime.toLocaleTimeString('chinese', { hour12: false })}`.substr(0,19)
    exams[i].isOut = false
    now = new Date()
    if(now>etime){
      exams[i].isOut = true
    }
  }
  return exams
}
module.exports = {
  // isNum: isNum,
  formatExams,
  isFree,
  latexToMarkdown,
  addOptions,
  randomNum,
  request,
  formatTime,
  formatTimeStamp,
  rTime,
  getLevel,
  isRight,
  isRightToNum,
  numToIsRight,
  addRecord,
  changeOption,
  removeOptionColor,
  createSubResult,
  getScore,
  addExamResult,
  arrObjectToStr
}