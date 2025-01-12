module.exports = {
	courses: [
		{
			id: 1,
			name: 'Conocimiento del Medio',
			score: 10,
			color: '#4cc1b6',
			background_color: '#cdede9',
			subject: {
				id: 1,
				name: 'Conocimiento del Medio'
			}
		},
		{
			id: 2,
			name: 'Matemáticas',
			score: 9.5,
			color: '#6F99F5',
			background_color: '#D0E4F5',
			subject: {
				id: 2,
				name: 'Matemáticas'
			}
		},
		{
			id: 3,
			name: 'Artes',
			score: 8,
			color: '#F8D87C',
			background_color: '#FFF3D6',
			subject: {
				id: 3,
				name: 'Artes'
			}
		},
		{
			id: 4,
			name: 'Educación Socioemocional',
			score: 7,
			color: '#F48CFF',
			background_color: '#FCE0FF',
			subject: {
				id: 4,
				name: 'Educación Socioemocional'
			}
		},
		{
			id: 5,
			name: 'Formación Cívica y Ética',
			score: 6,
			color: '#DC2C2C',
			background_color: '#E4BDBC',
			subject: {
				id: 4,
				name: 'Formación Cívica y Ética'
			}
		},
		{
			id: 6,
			name: 'Lengua Extranjera. Inglés',
			score: null,
			color: '#6A70EF',
			background_color: '#CFD1FB',
			subject: {
				id: 4,
				name: 'Lengua Extranjera. Inglés'
			}
		}
	],
	average_score: 7.3 // only return if requester is student role
};