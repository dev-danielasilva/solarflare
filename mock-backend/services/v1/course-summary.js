const __courseGradeSummary = require('../../database/courseGradeSummary')
const __courseGradeSummaryByStudent = require('../../database/courseGradeSummaryByStudent')
const __courseStudentsAverages = require('../../database/courseStudentsAverages')

const getCourseGradesSummary = (courseId, studentid) => {
    const courseByStudent = __courseGradeSummaryByStudent;
    
    const course = __courseGradeSummary.find((_course) =>{ 
        return _course.id === parseInt(courseId) }
    )
    
    if(!course || !courseByStudent){
        return {
            message: "There's no information for that course"
        }
    }

    return studentid ? courseByStudent : course;
}

const getCourseStudentsAverages = (courseId) => {
    const course = __courseStudentsAverages.find((_course) =>{ 
        return _course.id === parseInt(courseId) }
    )
    
    if(!course){
        return {
            message: "There's no information for that course"
        }
    }

    return course
}


module.exports = {
    getCourseGradesSummary,
    getCourseStudentsAverages
}
  