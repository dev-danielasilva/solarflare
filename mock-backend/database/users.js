module.exports = [
  // {
  //   user: {
  //     id: 2,
  //     username: 'student1',
  //     first_name: 'Armando',
  //     middle_name: 'Luis',
  //     last_name: 'Rivas Morelos',
  //     password: 'Django123',
  //     role: {
  //       id: 3,
  //       name: 'STUDENT',
  //     },
  //     email_address: 'student1@sample.com',
  //     avatar: {
  //       id: 1,
  //       name: 'Panda',
  //       image:
  //         'http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/panda-profile.svg',
  //       level: 'primary',
  //       target_role: {
  //         name: 'student',
  //       },
  //     },
  //   },
  //   tenant: {
  //     id: 4,
  //     logo: {
  //       image: null,
  //       alt: 'Castillo de Chapultepec Andrómeda_logo',
  //     },
  //     name: 'Castillo de Chapultepec Andrómeda',
  //     max_grade: 10,
  //     passing_grade: 7,
  //     active: true,
  //     max_admins: 10,
  //     max_teachers: 60,
  //     max_students: 3000,
  //     created: '2023-10-30',
  //     code: 'GH2023MQT',
  //     street_address: null,
  //     definition: {
  //       logo: '',
  //       name: 'Green Hat',
  //       skin: {
  //         primary: {
  //           image_pad: [{ id: 13, name: 'Pig', image: 'https://' }],
  //           login_image: 'https://',
  //           card_characters: {
  //             step_one: {},
  //             step_two: {},
  //             step_three: {},
  //             item_graded: {
  //               alt: 'Detalles del examen',
  //               image: 'https://dummyimage.com/100x100/ededed/242424',
  //             },
  //             quiz_details: {},
  //             topic_summary: {},
  //             weekly_summary: { alt: 'Panda reading', image: 'https://' },
  //           },
  //           background_color: '#E0F2F1',
  //           modal_characters: {
  //             quiz_timeout: {},
  //             quiz_finished: {},
  //             quiz_time_left: {},
  //             forgotten_password: {},
  //           },
  //           background_pattern:
  //             'http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/definition/clouds-bg-set.svg',
  //           grades_banner_image: '',
  //           welcome_banner_image: {
  //             alt: 'Little fox',
  //             image:
  //               'http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/definition/fox-header.svg',
  //           },
  //         },
  //         middleschool: {},
  //       },
  //     },
  //     license: {
  //       id: 1,
  //       name: 'basic',
  //       publisher: {
  //         id: 1,
  //         name: 'GreenHat',
  //         definition: null,
  //       },
  //     },
  //   },
  // },
  {
    user: {
      id: 4,
      username: 'teacher1',
      first_name: 'Diana',
      middle_name: 'Alicia',
      last_name: 'Morales Lago',
      password: 'Django123',
      role: {
        id: 4,
        name: 'TEACHER',
      },
      email_address: 'teacher1@sample.com',
      avatar: {
        id: 1,
        name: 'Panda',
        image:
          'http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/panda-profile.svg',
        level: 'primary',
        target_role: {
          name: 'teacher',
        },
      },
    },
    tenant: {
      id: 5,
      logo: {
        image: null,
        alt: 'Dunder Mifflin_logo',
      },
      name: 'Dunder Mifflin',
      max_grade: 10,
      passing_grade: 7,
      active: true,
      max_admins: 10,
      max_teachers: 60,
      max_students: 3000,
      created: '2023-10-30',
      code: 'GH2023MQT',
      street_address: null,
      definition: {
        logo: '',
        name: 'Green Hat',
        skin: {
          primary: {
            image_pad: [{ id: 13, name: 'Pig', image: 'https://' }],
            login_image: 'https://',
            card_characters: {
              step_one: {},
              step_two: {},
              step_three: {},
              item_graded: {
                alt: 'Detalles del examen',
                image: 'https://dummyimage.com/100x100/ededed/242424',
              },
              quiz_details: {
                alt: 'Detalles del examen',
                image: 'https://dummyimage.com/100x100/ededed/242424',
              },
              topic_summary: {},
              weekly_summary: { alt: 'Panda reading', image: 'https://' },
            },
            background_color: '#E0F2F1',
            modal_characters: {
              quiz_timeout: {},
              quiz_finished: {},
              quiz_time_left: {},
              forgotten_password: {},
            },
            background_pattern:
              'http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/definition/clouds-bg-set.svg',
            grades_banner_image: '',
            welcome_banner_image: {
              alt: 'Little fox',
              image:
                'http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/definition/fox-header.svg',
            },
          },
          middleschool: {},
        },
      },
      license: {
        id: 1,
        name: 'basic',
        publisher: {
          id: 1,
          name: 'GreenHat',
          definition: {
            logo: '',
            name: 'Green Hat',
            skin: {
              primary: {
                image_pad: [{ id: 13, name: 'Pig', image: 'https://' }],
                login_image: 'https://',
                card_characters: {
                  step_one: {},
                  step_two: {},
                  step_three: {},
                  item_graded: {},
                  quiz_details: {
                    alt: 'Detalles del examen',
                    image: 'https://dummyimage.com/100x100/ededed/242424',
                  },
                  topic_summary: {},
                  weekly_summary: { alt: 'Panda reading', image: 'https://' },
                },
                background_color: '#E0F2F1',
                modal_characters: {
                  quiz_timeout: {},
                  quiz_finished: {},
                  quiz_time_left: {},
                  forgotten_password: {},
                },
                background_pattern:
                  'http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/definition/clouds-bg-set.svg',
                grades_banner_image: '',
                welcome_banner_image: {
                  alt: 'Little fox',
                  image:
                    'http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/definition/fox-header.svg',
                },
              },
              middleschool: {},
            },
          },
        },
      },
    },
  },
  //     {
  //         user: {
  //             id: 2,
  //             username: "student1",
  //             first_name: "Armando",
  //             middle_name: "Luis",
  //             last_name: "Rivas Morelos",
  //             password: "Django123",
  //             role: {
  //                 id: 3,
  //                 name: "STUDENT"
  //             },
  //             email_address: "student1@sample.com",
  //             avatar: {
  //                 id: 1,
  //                 name: "Panda",
  //                 image: "http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/panda-profile.svg",
  //                 level: "primary",
  //                 target_role: {
  //                     name: "student"
  //                 }
  //             }
  //         },
  //         tenant: {
  //             id: 4,
  //             logo: {
  //                 image: null,
  //                 alt: "Castillo de Chapultepec Andrómeda_logo"
  //             },
  //             name: "Castillo de Chapultepec Andrómeda",
  //             max_grade: 10,
  //             passing_grade: 7,
  //             active: true,
  //             max_admins: 10,
  //             max_teachers: 60,
  //             max_students: 3000,
  //             created: "2023-10-30",
  //             code: "GH2023MQT",
  //             street_address: null,
  //             definition: {"logo": "", "name": "Green Hat", "skin": {"primary": {"image_pad": [{"id": 13, "name": "Pig", "image": "https://"}], "login_image": "https://", "card_characters": {"step_one": {}, "step_two": {}, "step_three": {}, "item_graded": {}, "quiz_details": {}, "topic_summary": {}, "weekly_summary": {"alt": "Panda reading", "image": "https://"}}, "background_color": "#E0F2F1", "modal_characters": {"quiz_timeout": {}, "quiz_finished": {}, "quiz_time_left": {}, "forgotten_password": {}}, "background_pattern": "http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/definition/clouds-bg-set.svg", "grades_banner_image": "", "welcome_banner_image": {"alt": "Little fox", "image": "http://ada.assets.vermicstudios.com.s3.amazonaws.com/2023/LearningHub/demo/definition/fox-header.svg"}}, "middleschool": {}}},
  //             license: {
  //                 id: 1,
  //                 name: "basic",
  //                 publisher: {
  //                     id: 1,
  //                     name: "GreenHat",
  //                     definition: null
  //                 }
  //             }
  //         }
  //     }
]
