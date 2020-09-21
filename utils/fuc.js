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
function getLevel(isRight,minLevel,maxLevel,currentLevel){
  if (isRight){
    if (currentLevel >= minLevel && currentLevel < maxLevel){
      return currentLevel+1
    }else{
      return 0
    }
  }else{
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
function getScore(subResult){
  var score = 0;
  var levelTotal = 0;
  for (var i = 0;i < subResult.length;i++){
    var rightTotal = subResult[i].rightTotal
    var wrongTotal = subResult[i].wrongTotal
    var total = rightTotal + wrongTotal
    var level = subResult[i].level
    if (total != 0){
      score += Math.round(100*level*rightTotal/total)
      levelTotal += level
    }
  }
  score = Math.round(score/levelTotal)
  return score
}

/**
 * 封封微信的的request
 */
function request(url, data = {}) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      header: {
        "Content-Type": "application/json"
      }, // 设置请求的 header
      success: function (res) {
        resolve(res);
      },
      fail: function () {
        reject(res);
      }
    });
  });
}
/*
转换题目选项格式的函数
数据库的存储的题目格式与前端需求的题目格式不一致，每次得到题目后需要先修改下格式
*/
function addOptions(subject) {
  var options = [{id: 0,content: ""}, {id: 1,content: ""}, {id: 2,content: ""}, {id: 3,content: ""}]
  options[0].content = subject.optionA
  options[1].content = subject.optionB
  options[2].content = subject.optionC
  options[3].content = subject.optionD
  subject.options = options
  return subject
}

/*
定义一个简单的stringBuffer,因为需要动态拼接sql语句
*/
function StringBuffer() {
  this.__strings__ = [];
};
StringBuffer.prototype.Append = function (str) {
  this.__strings__.push(str);
  return this;
};
// //格式化字符串
// StringBuffer.prototype.AppendFormat = function (str) {
//   for (var i = 1; i < arguments.length; i++) {
//     var parent = "\\{" + (i - 1) + "\\}";
//     var reg = new RegExp(parent, "g")
//     str = str.replace(reg, arguments[i]);
//   }

//   this.__strings__.push(str);
//   return this;
// }
StringBuffer.prototype.ToString = function () {
  return this.__strings__.join('');
};
// StringBuffer.prototype.clear = function () {
//   this.__strings__ = [];
// }
StringBuffer.prototype.size = function () {
  return this.__strings__.length;
}


/*
获取题目
*/

function getSubject(){

}

/*
拼接sql语句
*/
function conSql() {
  var sb = new StringBuffer()
  sb.append("SELECT prbm_id,question,optionA,optionB,optionC,optionD,anwser,kn_name AS knowledge FROM problem_store p LEFT JOIN knowledge k ON p.kn_id = k.kn_id LEFT JOIN course c ON k.crs_id = c.crs_id WHERE prbm_id = '").append(uid).append("' bm in (")
  for (var i = 0, k = sessionBMQX.size(); i < k; i++) {//sessionBMQX为List
    if (i > 0) {
      sb.append(",");
    }
    sb.append("'").append(sessionBMQX.get(i)).append("'");
  }
  sb.append(")");
  System.out.println("sql==========" + sb.toString());//输出这个sql语句，看有没语法错误
  }
//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
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
function isRight(yourAnswer,rightAnswer){
  return yourAnswer == rightAnswer
}
function isRightToNum(isRight) {
  if(isRight){
    return 1
  }else{
    return 0
  }
}
function numToIsRight(num) {
    return num == 1
}

//添加答题记录(要改一下的)
function addRecord(replyRecord, answer, result, prbm_id, ex_id,s_id){
  replyRecord.answer = answer;
  replyRecord.result = result;
  replyRecord.prbm_id = prbm_id;
  replyRecord.ex_id = ex_id;
  replyRecord.s_id = s_id;
  return replyRecord;
}

//添加考试结果数据
function addExamResult(sid, startTime, score, ex_id) {
  var obj = {}
  obj.sid = sid;
  obj.startTime = startTime;
  obj.score = score;
  obj.ex_id = ex_id;
  return obj;
}

//改变选项，清楚其他颜色
function changeOption(abcd,id){
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
function createSubResult(minLevel,maxLevel){
  var subResult = []
  var length = maxLevel - minLevel + 1
  var level = minLevel
  for (var i = 0;i < length;i++){
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
function arrObjectToStr(arr){
  var newArr = []
  for(var i in arr){
    var key = Object.keys(arr[i])[0]
    console.log(key)
    newArr.push(arr[i].key)
  }
  return newArr
}

module.exports = {
  addOptions: addOptions,
  StringBuffer: StringBuffer,
  randomNum: randomNum,
  request:request,
  formatTime: formatTime,
  formatTimeStamp: formatTimeStamp,
  rTime: rTime,
  getLevel: getLevel,
  isRight: isRight,
  isRightToNum: isRightToNum,
  numToIsRight: numToIsRight,
  addRecord: addRecord,
  changeOption: changeOption,
  removeOptionColor: removeOptionColor,
  createSubResult: createSubResult,
  getScore: getScore,
  addExamResult:addExamResult,
  arrObjectToStr: arrObjectToStr
}