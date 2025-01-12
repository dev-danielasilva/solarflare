const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 5001
const fileUpload = require('express-fileupload')
const morgan = require('morgan')

const _login = require('./services/v1/login')
const _courses = require('./database/courses')
const _gradesAverage = require('./services/v1/grades-average')
const _courseGradesSummary = require('./services/v1/course-summary')
const _avatars = require('./services/v1/avatars')
const _progress = require('./services/v1/progress')
const _userUpdate = require('./services/v1/users-update')
let _course = require('./database/course')
let _topic = require('./database/topic')
let _todo = require('./database/todo')
let _submissions = require('./database/submissions')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(
  fileUpload({
    createParentPath: true,
  })
)
app.use(express.static(__dirname))
app.use('/', express.static(__dirname + '/uploads'))

app.use(cors())

app.post('/v1/auth/login', bodyParser.json(), (req, res) => {
  const payload = req.body
  const user = _login.postAuthLogin(payload)

  if (user) {
    res.status(200).send(user)
  } else {
    res.status(200).send({
      message: 'You have entered an invalid username or password',
    })
  }
})

app.post('/v1/auth/login/verify/', bodyParser.json(), (req, res) => {
  const payload = req.body
  const user = _login.postAuthLoginVerify(payload)

  res.status(200).send(user)
})

app.get('/v1/courses', (req, res) => {
  res.status(200).send(_courses)
})

app.get('/v1/courses/:courseid', (req, res) => {
  res.status(200).send(_course)
})

app.get('/v1/courses/:courseid/topics/:topicid/user', (req, res) => {
  res.status(200).send(_topic)
})

app.put('/v1/topics/:topicid', bodyParser.json(), (req, res) => {
  const payload = req.body
  const topicid = parseInt(req.params.topicid)
  let newtopics = _course.subject.topics
  const topicIdx = newtopics.findIndex((nt) => nt.id === topicid)
  newtopics[topicIdx] = { ...newtopics[topicIdx], ...payload }
  _course = {
    ..._course,
    subject: {
      ..._course.subject,
      topics: newtopics,
    },
  }
  res.status(200).send({
    message: 'Topic updated',
  })
})

app.post('/v1/courses/:courseid/topics', async (req, res) => {
  const topic = req.body
  let { image } = req.files
  image.mv('./uploads/' + image.name)

  const tid = Math.floor(100000000 + Math.random() * 90000000)

  _course.subject.topics.push({
    ...topic,
    id: tid,
    image: `http://localhost:5001/uploads/${image.name}`,
    imageAlt: image?.name,
    hidden: true,
  })

  setTimeout(() => {
    res.status(200).send({
      topic_data: {
        ..._course.subject.topics[_course.subject.topics.length - 1],
      },
    })
  }, 3000)
})

app.put(
  '/v1/courses/:courseid/session_items/:session_item_id/update.`/',
  async (req, res) => {
    const todo = req.body
    let file = req?.files?.file

    _todo = {
      ..._todo,
      name: todo.name,
      description: todo.description,
      weight: todo.weight,
    }

    if (file) {
      file.mv('./uploads/' + file.name)

      _todo.files = [
        {
          url: `http://localhost:5001/uploads/${file.name}`,
          name: file.name,
        },
      ]
    } else if (todo.remove_file) {
      _todo.files = []
    }

    setTimeout(() => {
      res.status(200).send(_todo)
    }, 3000)
  }
)

app.post('/v1/upload', async (req, res) => {
  const { image } = req.files
  image.mv('./uploads/' + image.name)
  setTimeout(() => {
    res.status(200).send({
      url: `http://localhost:5001/uploads/${image.name}`,
    })
  }, 3000)
})

app.get('/v1/grades/average', bodyParser.json(), (req, res) => {
  const gradesAverage = _gradesAverage.getGradesAverage()

  res.status(200).send(gradesAverage)
})

app.put('/v1/user/:uid/update', bodyParser.json(), (req, res) => {
  const payload = req.body

  const newAvatar = _userUpdate.putUser(payload.avatar)

  res.status(200).send(newAvatar)
})

app.get(
  '/v1/courses/:courseId/grades/summary',
  bodyParser.json(),
  (req, res) => {
    const id = req.params.courseId
    const studentId = req.query.uid

    console.log(req.params.courseId)
    console.log(req.query.uid)
    const courseGradesSummary = _courseGradesSummary.getCourseGradesSummary(
      id,
      studentId
    )

    res.status(200).send(courseGradesSummary)
  }
)

// app.get('/v1/courses/:uid/grades/summary',  bodyParser.json(), (req, res) => {
//   const id = req.params.uid
//   const courseGradesSummary = _courseGradesSummary.getCourseGradesSummary(id);

//   res.status(200).send(courseGradesSummary)
// })

app.get('/v1/courses/:uid/students/grades', bodyParser.json(), (req, res) => {
  const id = req.params.uid
  const studentsAverages = _courseGradesSummary.getCourseStudentsAverages(id)

  res.status(200).send(studentsAverages)
})

app.get('/v1/avatars', bodyParser.json(), (req, res) => {
  const avatars = _avatars.getAvatars()

  res.status(200).send(avatars)
})

app.get('/v1/student/progress', bodyParser.json(), (req, res) => {
  const progress = _progress.getProgress()

  res.status(200).send(progress)
})

app.get(
  '/v1/courses/:courseid/topics/:topicid/sessions/:sessionid',
  (req, res) => {
    const courseid = req.params.courseid
    const topicid = req.params.topicid
    const sessionid = req.params.sessionid

    res.status(200).send({
      id: '67',
      name: 'Multiplcaciones y divisiones - Clase 1',
      progress: 10,
      stars: 1.4,
      session_items: [
        {
          id: '789',
          name: '',
          type: 'html',
          content:
            'https://ada.assets.vermicstudios.com/Scratch/html/Slide1.html',
          note: '<p>Hola...',
          weigth: null,
        },
        {
          id: '678',
          name: 'Ejercicios de multiplicaciones',
          description: 'Practice...',
          type: 'image',
          order: null,
          weigth: 0.5,
          content:
            'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
          status: 'pending',
        },
        {
          id: '678',
          name: 'Ejercicios de multiplicaciones',
          description: 'Practice...',
          type: 'presentation',
          order: null,
          weigth: 0.5,
          content: `<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRqvK6d8JWke2KTrZY3s7G7bMNMrf0OD7PltGqThrGSNRLSAVWgWxUxAu4yoJW552C9m1LMqMyflUt8/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`,
          status: 'pending',
        },
      ],
    })
  }
)

app.get('/v1/courses/:courseid/session_items/:todoid', (req, res) => {
  res.status(200).send(_todo)
})

app.get('/v1/courses/:courseid/session_items/:todoid/user', (req, res) => {
  res.status(200).send({
    ..._todo,
    score: 0,
    quiz_status:
      '{"question2":["lion"],"question 3":["giraffe"],"question4":["giraffe"],"question5":["panda"],"question6":["lion"],"question7":["panda"],"question8":["lion"],"question9":["giraffe"],"question10":["panda"]}',
  })
})

app.get(
  '/v1/courses/:courseid/session_items/:todoid/submissions',
  (req, res) => {
    res.status(200).send(_submissions)
  }
)

app.post('/v1/todo/score', (req, res) => {
  res.status(200).send({})
})

app.post(
  '/v1/courses/:courseid/sessions/:sessionid/session_items/',
  bodyParser.json(),
  (req, res) => {
    const payload = req.body
    const base = {
      id: 6,
      name: '',
      image: '',
      description: '',
      type: 'quiz',
      content: '',
      active: true,
      due_date: null,
    }
    res.status(200).send({
      session_item_data: {
        ...base,
        ...payload,
      },
    })
  }
)

app.put(
  '/v1/courses/:courseid/session_items/:session_item/quiz/',
  (req, res) => {
    const _content = req.content
    console.log('The content we got ', _content)
    res.status(200).send({
      ..._todo,
      content:
        '"pages":[{"name":"page1","elements":[{"name":"question1","type":"imagepicker","title":"Selecciona la parte más importante de la computadora.","score":1,"choices":[{"text":"","value":"lion","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/mouse.jpg"},{"text":"","value":"giraffe","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/teclado.jpg"},{"text":"","value":"panda","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/bocinas.jpg"},{"text":"","value":"camel","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/cpu.jpg"},{"text":"Another one","value":"77f97848","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/mouse.jpg"}],"isRequired":true,"correctAnswer":["camel"],"hidden":true},{"name":"question2","score":1,"type":"imagepicker","title":"Luis quiere comprar un dispositivo para escuchar música. Selecciona la imagen que muestra el objeto que necesita.","choices":[{"value":"lion","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/mouse.jpg"},{"value":"giraffe","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/teclado.jpg"},{"value":"panda","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/bocinas2.jpg"},{"value":"camel","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/monitor.jpg"}],"isRequired":true,"correctAnswer":"panda","index":1},{"name":"question3","score":1,"type":"imagepicker","title":"Observa las imágenes y selecciona la computadora más moderna.","choices":[{"value":"lion","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora.jpg"},{"value":"giraffe","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora2.jpg"},{"value":"panda","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora3.jpg"},{"value":"camel","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora4.jpg"}],"isRequired":true,"correctAnswer":"camel","index":2},{"name":"question4","score":1,"type":"imagepicker","title":"Observa las imágenes y selecciona la computadora más antigua.","choices":[{"value":"lion","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora.jpg"},{"value":"giraffe","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora2.jpg"},{"value":"panda","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora3.jpg"},{"value":"camel","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora4.jpg"}],"isRequired":true,"correctAnswer":"lion","index":3},{"name":"question5","score":1,"type":"imagepicker","title":"Observa las imágenes y selecciona la imagen del mouse.","choices":[{"value":"lion","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/mouse.jpg"},{"value":"giraffe","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/teclado.jpg"},{"value":"panda","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/monitor.jpg"},{"value":"camel","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/cpu.jpg"}],"isRequired":true,"correctAnswer":"lion","index":4},{"name":"question6","type":"imagepicker","score":1,"title":"Observa las imágenes y selecciona la imagen del teclado.","choices":[{"value":"lion","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/mouse.jpg"},{"value":"giraffe","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/teclado.jpg"},{"value":"panda","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/monitor.jpg"},{"value":"camel","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/cpu.jpg"}],"isRequired":true,"correctAnswer":"giraffe","index":5},{"name":"question7","score":1,"type":"imagepicker","title":"Observa las imágenes y selecciona la imagen del monitor.","choices":[{"value":"lion","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/mouse.jpg"},{"value":"giraffe","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/teclado.jpg"},{"value":"panda","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/monitor.jpg"},{"value":"camel","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/cpu.jpg"}],"isRequired":true,"correctAnswer":"panda","index":6},{"name":"question8","score":1,"type":"imagepicker","title":"Selecciona la computadora que puedes llevar a cualquier lugar.","choices":[{"value":"lion","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/cpu.jpg"},{"value":"giraffe","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora3.jpg"},{"value":"panda","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora2.jpg"},{"value":"camel","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/computadora4.jpg"}],"isRequired":true,"correctAnswer":"camel","index":7},{"name":"question9","score":1,"type":"imagepicker","title":"Selecciona el teclado que Emmanuel le vendió a Joaquín.","choices":[{"value":"lion","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/mouse2.jpg"},{"value":"giraffe","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/cpu.jpg"},{"value":"panda","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/bocinas.jpg"},{"value":"camel","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/teclado2.jpg"}],"isRequired":true,"correctAnswer":"camel","index":8},{"name":"question10","score":1,"type":"imagepicker","title":"Observa las imágenes y selecciona la imagen del CPU","choices":[{"value":"lion","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/mouse2.jpg"},{"value":"giraffe","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/cpu.jpg"},{"value":"panda","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/bocinas.jpg"},{"value":"camel","imageLink":"https://ada.vermic.com/images/greenhat/p1t1/teclado2.jpg"}],"isRequired":true,"correctAnswer":"giraffe","index":9}]}]',
    })
  }
)

app.put(
  '/v1/courses/:courseid/session_items/:session_item/user/',
  (req, res) => {
    const merged = {
      ..._todo,
      score: req.body.score,
      attempts: req.body.attempts,
      quizStatus: req.body.quizStatus,
      submissionDate: req.body.submissionDate,
    }

    _todo = merged
    res.status(200).send(merged)
  }
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
