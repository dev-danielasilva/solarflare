import moment from 'moment';
import { IStudents } from './shared-components/dedicated/GradesSummaryTeacher/CourseGradesCard';
import BaseUserType from './store/user/BaseUserType';

/*
 * Builds the name, given the user.
 * The include param is optional, it determines what items should be
 * included in the name:
 *
 * f = first name
 * m = middle name
 * l = last name
 *
 * By default, all are included, but if you want, for instance, to only get
 * the first and last names, you would send: 'fl'
 */
export const getName = (user: BaseUserType | IStudents, include: string = 'fml') => {
	let userFullName = '';

	if (user.first_name && include.includes('f')) {
		userFullName = user.first_name;
	}

	if (user.middle_name && include.includes('m')) {
		userFullName = `${userFullName} ${user.middle_name}`;
	}

	if (user.last_name && include.includes('l')) {
		userFullName = `${userFullName} ${user.last_name}`;
	}

	userFullName = userFullName.trimStart();

	return userFullName;
};

export const getFullDate = (date: string | number): string => {
	const newDate = new Date(date);
	const day = newDate.getDate();
	const month = newDate.getMonth();
	const year = newDate.getFullYear();
	const months = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre'
	];

	return `${day} de ${months[month]} del ${year}`;
};

export const getValueSafe = (value, defaultsTo): string => {
	let safeValue: any;

	try {
		safeValue = value();
	} catch (e) {
		return defaultsTo;
	}

	if (isDefined(value) && safeValue !== null) {
		return safeValue;
	}
	return defaultsTo;
};

export const contentToJson = (content): string => {
	let result: any;

	try {
		// // result = JSON.parse('{' + content + '}')
		result = JSON.parse(content);
	} catch (e) {
		console.error('Error parsing JSON ', e);
		return '';
	}

	return result;
};

export const isDefined = (value) => {
	return typeof value !== 'undefined';
};

export const debug = (message, value?) => {
	const params = new URLSearchParams(getLocationSearch());
	const debugParam = params.get('debug');
	const isLocal = getHost().includes('localhost');

	if ((debugParam || isLocal) && message) {
		if (!value) {
			console.log(message);
		} else if (value) {
			console.log(message, value);
		}
	}
};

export const getLocationSearch = () => {
	return window.location.search;
};

export const getHost = () => {
	return window.location.hostname;
};

export const getRandomString = () => {
	return 'x'
		.repeat(5)
		.replace(
			/./g,
			(c) => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]
		);
};

export const formatDate = (timestamp: number): string => {
	const dueDate = new Date(timestamp);
	let dueDateFormatted = moment(dueDate).format('DD-MM-YYYY');
	if (dueDateFormatted === 'Invalid date') {
		dueDateFormatted = '-';
	}
	return dueDateFormatted;
};

export const removeFirstAndLast = (str: string) => {
	const arr = str.split('');
	arr.shift();
	arr.pop();
	return arr.join('');
};

export const decodeString = (input: string) => {
	const cleanedString = input.replace(/rn/g, '\n');

	// Step 2: Parse the cleaned string as JSON
	try {
		const jsonObject = JSON.parse(`{${cleanedString}}`);
		return jsonObject;
	} catch (error) {
		console.error('Invalid JSON string:', error);
		return null;
	}
};

export const unmaskQuiz = (response, topicid, todoid) => {
	const topic = response?.course?.subject?.topics.find((topic) => topic.id === parseInt(topicid));

	if (topic) {
		const session = topic?.sessions?.[0];

		if (session) {
			const sessionItem = session?.session_items?.find((si) => si.id === parseInt(todoid));

			if (sessionItem) {
				return sessionItem;
			}

			return '';
		}
		return '';
	}

	return '';
};

export const StringifyObject = (object) => ( 
  <pre>
    {JSON.stringify(object, null, 2)}
  </pre>
)

export const isLocal = () => window.location.hostname.includes('localhost');

export const maskRadioGroupQuestions = (content) => {
	const questions = content?.pages?.[0]?.elements
	let result;

	if(questions){
		questions.forEach((question, idx) => {
			questions[idx].originalType = questions[idx].type;
			if(questions[idx].type === 'radiogroup'){
				questions[idx].type = 'checkbox'
				console.log('The original type of radiogrpup is ', questions[idx].type)
			}
		});

		result = {
			...content,
			pages: [
				{
					name: content?.pages?.[0]?.name || 'page1',
					elements: questions
				}
			]
		}
	}else{
		result = {}
	}

	return result
}

export const isFuture = (timestamp) => {
	const _date = new Date(timestamp)
	const currentDate = new Date()
	return _date >= currentDate
}

export const daysUntilDueDate = (timestamp: number, status: string, isGraded) => {

	if (isGraded) {
		return { label: 'Calificado', color: '#2D9723', backgroundColor: '#CBF5CD' };
	}

	if (status && status != 'pending') {
		return { label: 'Completado', color: '#2D9723', backgroundColor: '#CBF5CD' };
	}

	const currentDate = new Date();
	const incomingDate = new Date(timestamp)
	const timeDiff = incomingDate.getTime() - currentDate.getTime();
	const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

	if (dayDiff === 0) {
		return { label: 'Hoy', color: '#847700', backgroundColor: '#FFF3D6' };
	}
	if (dayDiff === 1) {
		return { label: 'Mañana', color: '#004D84', backgroundColor: '#D6E6FF' };
	}
	if (dayDiff > 1) {
		return {
			label: `En ${dayDiff} días`,
			color: '#004D84',
			backgroundColor: '#D6E6FF'
		};
	}
	return {
		label: `Hace ${Math.abs(dayDiff)} ${Math.abs(dayDiff) === 1 ? 'día' : 'días'}`,
		color: '#C90000',
		backgroundColor: '#E4BCBC'
	};
};

export const getTimeToEOD = (_date:Date):number => {
	let d = new Date(_date.valueOf());
	d.setHours(23);
	d.setMinutes(59);
	d.setSeconds(59);
	return d.valueOf() / 1000
}


export const getDayOfWeekAsName = (timestamp) => {
	const _date = new Date(timestamp)
	return _date.toLocaleDateString('es', { weekday: 'long' })
};

export const getFullYear = (timestamp) => {
	const _date = new Date(timestamp)
	return _date.getFullYear()
};

export const formatDateDayOfMonth= (timestamp) => {
	const _date = new Date(timestamp)
	return _date.getDate()
};

export const formatDateMonth= (timestamp) => {
	const _date = new Date(timestamp)
	return _date.toLocaleString('es', { month: 'long' });
};
