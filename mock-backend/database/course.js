module.exports = {
  id: 1,
  name: 'Matemáticas - Curso 1',
  grade: 1,
  group: 'A',
  tenant: 1,
  subject: {
    id: 1,
    icon: 'computer',
    name: 'Matemáticas',
    topics:[
      {
        id: 32,
        name: 'Sumas y restas',
        image: 'https://dummyimage.com/320x260/000/fff',
        imageAlt: 'Sumas y restas',
        hidden: true,
        description: "Conceptos básicos de operaciones matemáticas que involucran la adición y la sustracción de números."
      },
      {
        id: 23,
        name: 'Multiplicaciones y divisiones',
        image: 'https://dummyimage.com/320x260/000/fff',
        imageAlt: 'Sumas y restas',
        hidden: false,
        description: "Conceptos básicos de operaciones matemáticas que involucran la adición y la sustracción de números."
      },
      {
        id: 66,
        name: 'Operaciones con fracciones',
        image: 'https://dummyimage.com/320x260/000/fff',
        imageAlt: 'Sumas y restas',
        hidden: false,
        description: "Conceptos básicos de operaciones matemáticas que involucran la adición y la sustracción de números."
      }
    ]
  }
}