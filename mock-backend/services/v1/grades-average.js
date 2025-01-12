const __gradesAverage = require('../../database/gradesAverage')
const __gradesAverageTeacher = require('../../database/gradesAverageTeacher')

const getGradesAverage = () => {
  return __gradesAverage
  // return __gradesAverageTeacher
}

module.exports = {
  getGradesAverage,
}
