import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import jwtService from 'src/app/auth/services/jwtService';
import { debug, getValueSafe, maskRadioGroupQuestions } from 'src/app/utils';
import { Banner } from 'app/shared-components/general/Banner';
import ExamContainer from 'app/shared-components/dedicated/Exam/ExamContainer';
import ExamDetailsCard from 'app/shared-components/dedicated/Exam/ExamDetailsCard';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import ExamGradesCard from 'app/shared-components/dedicated/Exam/ExamGradesCard';
import _ from 'lodash';
import ExamResultsCard from 'app/shared-components/dedicated/Exam/ExamResultsCard';
import moment from 'moment';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import GeneralMessageCard from 'app/shared-components/general/GeneralMessageCard/GeneralMessageCard';
import { isFuture } from 'date-fns';
import LoadingPage from 'app/shared-components/general/LoadingComponents/LoadingPage';

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function TodoPageExam() {
	const { courseid, topicid, todoid, subjectid } = useParams();
	const user = useSelector(selectUser);
	const navigate = useNavigate();
	const [todo, setTodo] = useState(null);
	const [studentTodo, setStudentTodo] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useAppDispatch();
	const isPremium = user.tenant.license.type.toLowerCase() === 'premium';
	const errorMessage =
		user.role !== 'student'
			? 'Ocurrió un error al generar el examen. Por favor reporta este incidente.'
			: 'Ocurrió un error al generar el examen. Por favor repórtalo con tu maestro o maestra.';

	const getExamValueFromCache = () => {
		const examFromCache = window.localStorage.getItem(`exam-${todoid}`);
		if (examFromCache && examFromCache !== 'undefined') {
			const _exam = JSON.parse(window.localStorage.getItem(`exam-${todoid}`));
			const current = moment().unix();
			if (_exam.expiration < current || user.role != 'student') {
				window.localStorage.removeItem(`exam-${todoid}`);
			} else {
				return _exam;
			}
			// if (_exam.expiration < current) {
			//   window.localStorage.removeItem('exam')
			// } else {
			//   return _exam
			// }
		} else {
			return {};
		}
	};
	const [exam, setExam] = useState(getExamValueFromCache());

	useEffect(() => {
		if (courseid && topicid && subjectid && todoid) {
			getTodo();
		}
	}, [courseid, topicid, subjectid, todoid]);

	useEffect(() => {
		window.localStorage.setItem(`exam-${todoid}`, JSON.stringify(exam));
	}, [exam]);

	const handleSetTodo = (todo, submissions) => {

		let elements = todo?.content?.pages?.[0]?.elements ? todo.content.pages[0].elements : [];

		// When randomize is set to true, the questions for the student should be shown in random order.
		const randomizeQuestions =  todo?.content?.randomize && user.role === 'student' ? 
		_.shuffle(elements) : elements;

		let _formatedContent = {
			...todo.content,
			pages:[
				{
					elements: randomizeQuestions
				}
			]
		};

		setTodo({
			...todo,
			content: _formatedContent,
			original_content: todo.content,
			blockEdit: isAnyQuizGraded(submissions)
		});
		if (todo.quiz_status && _.isNumber(todo.score)) {
			window.localStorage.setItem(`examprogress-${todoid}`, todo.quiz_status);
		}

		if (!_.isObject(todo.content)) {
			triggerMessage(errorMessage);
		}
	}

	async function getTodo() {
		setIsLoading(true)
		try {
			const [todo, submissions]: [any, any] = await Promise.all([
				jwtService.getSessionItem(courseid, todoid, user.role),
				jwtService.getSubmissions(courseid, todoid)
			]);
			setIsLoading(false)

			if (todo) {
				if(todo.start_date && user.role === 'student'){
					const currentDate = new Date();
					const startDate = new Date(todo.start_date * 1000);

					if(startDate < currentDate){
						handleSetTodo(todo, submissions);
					}
				}else{
					handleSetTodo(todo, submissions);
				}
			}
		} catch (error) {
			setIsLoading(false)
			if (error?.response?.status === 400 || error?.response?.status === 401) {
				navigate('/404');
			} else {
				triggerMessage(errorMessage);
			}
			debug('GET Error on getSessionItem() / getSubmissions() ', error);
		}

		// jwtService
		//   .getSessionItem(courseid, todoid, user.role)
		//   .then((todo: any) => {
		//     console.log('The session item! ', todo)
		//     // const contentAsJson = contentToJson(todo.content)
		//     const contentAsJson = todo.content
		//     setTodo({
		//       ...todo,
		//       content: contentAsJson,
		//       original_content: todo.content,
		//     })
		//     if (todo.quiz_status && _.isNumber(todo.score)) {
		//       window.localStorage.setItem('examprogress', todo.quiz_status)
		//     }

		//     if(!_.isObject(todo.content)){
		//       triggerMessage(errorMessage)
		//     }

		// })
		// .catch((e) => {
		//   if(e?.response?.status === 400){
		//     navigate('/404');
		//   }else{
		//     triggerMessage(errorMessage)
		//   }
		//   debug('GET Error on getSessionItem() ', e)
		// })
	}

	const isAnyQuizGraded = (submissions) => {
		if (!submissions) {
			return false;
		}

		const gradedQuizzes = submissions.filter((submission) => !_.isNull(submission.score));
		return !!(gradedQuizzes && gradedQuizzes.length > 0);
	};

	const triggerMessage = (message) => {
		dispatch(
			showMessage({
				message,
				autoHideDuration: 10000, // ms
				anchorOrigin: {
					vertical: 'top', // top bottom
					horizontal: 'center' // left center right
				},
				variant: 'error' // success error info warning null
			})
		);
	};

	function previewExam() {
		setExam((prevExam) => {
			return {
				...prevExam,
				state: 'preview'
			};
		});
	}

	function updateTodo(updatedTodo) {
		// let contentAsString = JSON.stringify(updatedTodo.content)
		// contentAsString = contentAsString.replaceAll('radiogroup', 'checkbox')
		// const contentAsJson = JSON.parse(contentAsString);
		
		// console.log('The content that will be corrected type', updatedTodo)

		// console.log('caller 2')
        // const formatedContent = maskRadioGroupQuestions(updatedTodo.content);

		// const _updatedTodo = {
		// 	...updatedTodo,
		// 	content: formatedContent
		// };

		setTodo(updatedTodo);
	}

	const updateExam = (updatedExam) => {
		const expiration = moment().add(1, 'hours').unix();

		if(updatedExam?.state === ''){
			setStudentTodo(null)
		}

		setExam((exam) => {
			return {
				...exam,
				...updatedExam,
				expiration
			};
		});
	};

	useEffect(() => {
		if (studentTodo) {
			window.localStorage.setItem(`examprogress-${todoid}`, studentTodo.quiz_status);
			updateExam({
				state: 'review'
			});
		}
	}, [studentTodo]);

	const updateStudentTodo = (studentTodo) => {
		setStudentTodo({...studentTodo, content: todo.content});
	};

	return todo ? (
		<Root
			header={
				<Container
					maxWidth="lg"
					sx={{
						margin: 0
					}}
				>
					<Banner
						subtitle={getValueSafe(() => todo?.description, '')}
						title={getValueSafe(() => todo?.name, 'Tema sin nombre')}
						subtitlePosition="under"
						isContent
					/>
				</Container>
			}
			content={
				todo.start_date && isFuture(todo.start_date * 1000) && user.role === 'student' && isPremium ? 
				<Container maxWidth="lg">
					<GeneralMessageCard message={'Esta actividad aún no está disponible. Inténtalo más tarde.'}/>
				</Container> :
				exam?.state != 'review' && exam?.state != 'active' ? (
					<Container maxWidth="lg">
						{_.isNumber(todo.score) && user.role === 'student' && <ExamGradesCard todo={todo} />}
						<ExamDetailsCard
							todo={todo}
							// startExam={startExam}
							previewExam={previewExam}
							updateTodo={updateTodo}
							updateExam={updateExam}
						/>
						{user.role !== 'student' && (
							<ExamResultsCard
								todo={todo}
								updateStudentTodo={updateStudentTodo}
							/>
						)}
					</Container>
				) : (
					<ExamContainer
						todo={studentTodo || todo}
						examRecord={exam}
						updateTodo={updateTodo}
						updateExam={updateExam}
					/>
				)
			}
		/>
	) : isLoading ? <LoadingPage/> : (
		<Root
		header={
			<Container
				maxWidth="lg"
				sx={{
					marginTop: '7rem'
				}}
			>
				<GeneralMessageCard message="Esta actividad no existe o no está disponible en este momento. Por favor intenta más tarde."/>
			</Container>
		}
	/>
	);
}

export default TodoPageExam;
