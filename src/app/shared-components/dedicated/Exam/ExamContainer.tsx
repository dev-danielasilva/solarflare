import { Box, Button, Card, CardContent, Container, FormControlLabel, Switch, Tooltip, useTheme } from '@mui/material';
import { debug, getValueSafe, removeFirstAndLast } from 'src/app/utils';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import FuseUtils from '@fuse/utils';
import { LoadingButton } from '@mui/lab';
import jwtService from 'src/app/auth/services/jwtService';
import { useParams } from 'react-router';
import moment from 'moment';
import GeneralQuestion from './QuestionTypes/GeneralQuestion';
import ExamGradesCard from './ExamGradesCard';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';

const QuestionCard = styled(Card)<any>(() => ({
	marginBottom: '3rem'
}));

const QuickActionsContainer = styled(Box)<any>(({}) => ({
	marginBottom: '2rem',
	textAlign: 'right',
	display: 'flex',
	justifyContent: 'space-between'
}));

const BackButton = styled(Button)<any>(({}) => ({
	margin: '0rem',
	color: '#000',
	padding: '0 2rem',
	backgroundColor: '#FFF',
	'&:hover': {
		backgroundColor: '#FFF',
		boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.4)'
	}
}));

const SliderStartButton = styled(Button)<any>(({ theme }) => ({
	margin: '0rem',
	color: '#000',
	backgroundColor: '#FFF',
	'&:hover': {
		backgroundColor: '#FFF',
		boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.4)'
	},
	'& svg': {
		transform: 'scale(0.8)',
		marginLeft: '0.5rem'
	}
}));

const AppendButton = styled(Button)<any>(() => ({
	margin: '2rem 0 4rem 0',
	backgroundColor: 'white',
	border: '1px solid #e0e0e0',
	'&:hover': {
		backgroundColor: '#e0e0e0'
	}
}));

function ExamContainer({ todo, examRecord, updateTodo, updateExam }) {
	const user: BaseUserType = useSelector(selectUser);
	const isPremium = user.tenant.license.type.toLowerCase() === 'premium';
	const theme = useTheme();
	const questions: any = getQuestions();
	const [showCorrect, setShowCorrect] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [randomize, setRandomize] = useState(todo?.content?.randomize || false);
	const [isLoadingRand, setIsLoadingRand] = useState(false);
	const dispatch = useAppDispatch();

	const getResponsesState = () => {
		if (_.isNumber(todo.score) && todo.submission_date) {
			return JSON.parse(todo.quiz_status);
		}
		return {};
	};

	const [responsesState, setResponsesState] = useState(getResponsesState());
	const [responsesFromCache, setResponsesFromCache] = useState(null);
	const [isOnEditMode, setIsOnEditMode] = useState(false);
	const [quizReady, setQuizReady] = useState(false);
	const { courseid, todoid } = useParams();

	function getQuestions() {
		const currentQuestions: any = getValueSafe(() => todo.content.pages[0].elements, []);
		if (currentQuestions?.length > 0) {
			for (let index = 0; index < currentQuestions.length; index++) {
				currentQuestions[index] = {
					...currentQuestions[index],
					index
				};
			}
		}
		return currentQuestions;
	}

	useEffect(() => {
		if (user.role === 'student' && _.isNumber(todo.score)) {
			setShowResults(true);
		}
		// const _responsesState = JSON.parse(
		//   window.localStorage.getItem('examprogress')
		// )
		// console.log('>>>>>>>>>>>>>>. Responses state ', _responsesState)
		// if (_responsesState) {
		//   setResponsesFromCache(_responsesState)
		// }
	}, []);

	const setExamAnswered = () => {};

	const sendUpdateTodo = (value) => {
		updateTodo(value);
	};

	const handleSeeAnswers = () => {
		setShowCorrect(!showCorrect);
	};

	useEffect(() => {
		// jwtService.clearExamCache()
		if (_.isNumber(todo.score) && todo.submission_date) {
			// jwtService.clearExamCache()
			const _examProgress = JSON.parse(todo.quiz_status);
			setResponsesState(_examProgress);
			setShowResults(true);
		}
	}, [todo]);

	useEffect(() => {
		if (examRecord.state === 'review' && user.role === 'student') {
			const _examProgress = JSON.parse(todo.quiz_status);
			setResponsesState(_examProgress);
			setShowResults(true);
		}
	}, [examRecord]);

	const updateResponses = (questionName, state) => {
		setResponsesState((prevResponsesState) => {
			return {
				...prevResponsesState,
				[questionName]: state
			};
		});
	};

	useEffect(() => {
		// const _examProgress = JSON.parse(window.localStorage.getItem('exam'))
		const _examProgress = JSON.stringify(responsesState);
		window.localStorage.setItem(`examprogress-${todoid}`, _examProgress);
		areAllQuestionsAnswered();
	}, [responsesState]);

	const addQuestion = () => {
		let currentContent = todo?.content;

		const choiceid = FuseUtils.generateGUID();
		const questionName = FuseUtils.generateGUID();
		const newQuestion = {
			type: 'checkbox',
			name: questionName,
			title: 'Nueva pregunta...',
			correctAnswer: [choiceid],
			isRequired: true,
			hidden: true,
			choices: [
				{
					value: choiceid,
					text: 'Primer opción...'
				}
			]
		};

		if (!currentContent.pages) {
			currentContent = {
				pages: [
					{
						elements: [newQuestion]
					}
				]
			};
		} else {
			currentContent.pages?.[0].elements.push(newQuestion);
		}

		const formatedContent = removeFirstAndLast(JSON.stringify(currentContent));

		const updatedTodo = {
			...todo,
			content: currentContent
		};

		updateTodo(updatedTodo);
	};

	const handleSubmitExam = () => {
		const _examPayload = {
			quiz_status: JSON.stringify(responsesState),
			score: calculateScore(),
			attempts: 1,
			submission_date: moment().unix() * 1000
		};

		if (_.isNumber(_examPayload.score)) {
			submitExam(_examPayload);
		}
	};

	const calculateScore = () => {
		const questions = todo?.content?.pages?.[0]?.elements;
		const totalQuestions = questions.filter((question) => !question.hidden);
		let correctQuestions = 0;
		const maxGrade = user?.tenant?.max_grade ? user.tenant.max_grade : 10;

		totalQuestions.forEach((question) => {

			if (responsesState[question.name].length > 0 && question.correctAnswer) {

				if(_.isArray(question.correctAnswer)){
					// let isCorrect:boolean = true; // This is for when all correct should be chosen to mark as correct answer
					let selectedFailed:boolean = false;

					// This is for when all correct should be chosen to mark as correct answer
					// question.correctAnswer.forEach((choiceId) => {
					// 	if(!responsesState[question.name].includes(choiceId)){
					// 		isCorrect = false
					// 	}
					// })

					// Check if any the choices is wrong.
					responsesState[question.name].forEach((selectedChoiceId) => {
						if(!question.correctAnswer.includes(selectedChoiceId)){
							selectedFailed = true
						}
					})
					
					// This is for when all correct should be chosen to mark as correct answer
					// if(isCorrect && !selectedFailed){ 
					if(!selectedFailed){
						correctQuestions++;
					}
				}else{
					if (question.correctAnswer == responsesState[question.name][0]) {
						correctQuestions++;
					}
				}
			}

		});

		return _.toNumber(((correctQuestions * maxGrade) / totalQuestions.length).toFixed(1));
	};

	const handleTeacherSubmit = (updatedTodo) => {
		const mergedTodo = {
			...todo,
			...updatedTodo
		};
		updateTodo(mergedTodo);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	const submitExam = (examState) => {
		const isStudentDemo = user.role === 'student' && user.is_demo;
		if(user.role !== 'student' || isStudentDemo){
			handleTeacherSubmit(examState);
			return;
		}

		setIsLoading(true);
		jwtService
			.updateTodoUser(courseid, todoid, examState)
			.then((updatedTodo: any) => {
				// delete updatedTodo['id']
				// const mergedTodo = {
				//   ...todo,
				//   updatedTodo,
				// }
				// const mergedTodo = _.merge(todo, updatedTodo)
				const mergedTodo = {
					...todo,
					quiz_status: updatedTodo.quiz_status,
					score: updatedTodo.score,
					attempts: updatedTodo.attempts,
					submission_date: updatedTodo.submission_date
				};
				// mergedTodo.content = JSON.stringify(todo.content).replace('{', '')
				// mergedTodo.content = todo.original_content
				mergedTodo.content = todo.content;
				updateTodo(mergedTodo);
				setIsLoading(false);
				window.scrollTo({ top: 0, behavior: 'smooth' });
			})
			.catch((e) => {
				setIsLoading(false);
				debug('GET Error on updateTodoUser() ', e);
			});
	};

	const updateRandomize = (_todo) => {
		setIsLoadingRand(true)
		jwtService
			.updateQuizTodo(courseid, todoid, _todo)
			.then((updatedTodo: any) => {
				setRandomize(updatedTodo.content.randomize)
				setIsLoadingRand(false)
				showAlert('El examen se ha actualizado correctamente', 'success')
			})
			.catch((e) => {
				debug('GET Error on updateTodoUser() ', e);
				setIsLoadingRand(false)
				showAlert('Ocurrió un error actualizando el examen. Por favor intenta de nuevo.', 'error')
			});
	}

	const areAllQuestionsAnswered = () => {
		if (!responsesState) {
			setQuizReady(true);
			return;
		}
		for (const [key, value] of Object.entries(responsesState)) {
			if (!responsesState[key] || responsesState[key].length === 0) {
				setQuizReady(false);
				return;
			}
		}

		setQuizReady(true);
	};

	const questionModeStateChanged = (mode) => {
		setIsOnEditMode(mode == 'edit');
	};

	const handleRandomChange = (e) => {
		const formatedContent = getContentWithRandomizeAs(!randomize)
		const formData = new FormData()
		formData.append('content', formatedContent)
		updateRandomize(formData)
	}

	const showAlert = (message, variant) => {
		dispatch(
			showMessage({
				message: message,
				autoHideDuration: 6000,
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'center'
				},
				variant: variant
			})
		);
	};

	const getContentWithRandomizeAs = (state) => {
		let currentTodoContent = todo.content;

		currentTodoContent = {
			...currentTodoContent,
			randomize: state
		}

		const formatedContent = removeFirstAndLast(
			JSON.stringify(currentTodoContent).replace(/[\""]/g, '\\"')
		)

		return formatedContent
	}

	const retryExam = () => {
		const mergedTodo = {
			...todo,
			quiz_status: '{}',
			score: null,
			submission_date: null,
			attempts: 0
		};
		const _examProgress = JSON.parse('{}');
		setResponsesState(_examProgress);
		setShowResults(false);
		updateTodo(mergedTodo);
	}

	const goBack = () => {
		if(user.role !== 'student' || user.is_demo){
			retryExam();
		}
		updateExam({ state: '' })
	}

	return (
		<Container maxWidth="lg">
			<QuickActionsContainer>
				<Box>
					{(_.isNumber(todo.score) || user.role !== 'student') && (
						<BackButton onClick={() => goBack()}>Regresar</BackButton>
					)}
					{/* {(_.isNumber(todo.score) && (user.role !== 'student' || user.is_demo)) && (
						<BackButton sx={{marginLeft: '2rem'}} onClick={() => retryExam()}>Reintentar</BackButton>
					)} */}
				</Box>
				{questions.length > 0 && !_.isNumber(todo.score) && !isOnEditMode && user.role !== 'student' && (
					<SliderStartButton
						variant="contained"
						onClick={() => handleSeeAnswers()}
					>
						{showCorrect ? (
							<>
								Ocultar guía <FuseSvgIcon>heroicons-outline:eye-off</FuseSvgIcon>
							</>
						) : (
							<>
								Ver guía <FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
							</>
						)}
					</SliderStartButton>
				)}
			</QuickActionsContainer>
			{questions.length > 0 && !_.isNumber(todo.score) && !isOnEditMode && user.role !== 'student' && (
					<Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center', marginBottom: '1rem', opacity: isLoadingRand ? 0.5 : 1}}>
							<Switch
								checked={randomize}
								onChange={handleRandomChange}
								inputProps={{ 'aria-label': 'Aleatorizar preguntas' }}
							/>
							Aleatorizar preguntas
						</Box>
				)}
			{_.isNumber(todo.score) && <ExamGradesCard todo={todo} />}
			{questions.map((question, idx) => {
				return (
					(user.role === 'teacher' || (user.role === 'student' && !question.hidden)) && (
						<QuestionCard
							className="mt-0 p-24"
							sx={{ position: 'relative' }}
							id={`form-question-${question.name}`}
						>
							<CardContent sx={{ padding: '0 !important' }}>
								<GeneralQuestion
									key={`question-${idx}`}
									todo={todo}
									question={question}
									updateTodo={sendUpdateTodo}
									showCorrect={showCorrect}
									showResults={showResults}
									updateResponses={updateResponses}
									responsesFromCache={responsesFromCache}
									questionModeStateChanged={questionModeStateChanged}
								/>
							</CardContent>
						</QuestionCard>
					)
				);
			})}
			{user.role !== 'student' && !_.isNumber(todo.score) && isPremium && (
				<Tooltip
					title="No puedes editar este examen. Ya ha sido respondido por al menos un alumno."
					disableHoverListener={!todo.blockEdit}
				>
					<Box
						sx={{
							width: '100%',
							textAlign: 'center'
						}}
					>
						<AppendButton
							component="label"
							role={undefined}
							variant="contained"
							tabIndex={-1}
							startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
							onClick={() => addQuestion()}
							disabled={todo.blockEdit}
						>
							Añadir pregunta
						</AppendButton>
					</Box>
				</Tooltip>
			)}

			{!showResults && (
				<Box
					sx={{
						width: '100%',
						textAlign: 'center',
						marginBottom: '3rem'
					}}
				>
					<LoadingButton
						loading={isLoading}
						variant="contained"
						color="secondary"
						aria-label="Guardar cambios"
						disabled={!quizReady || showCorrect}
						onClick={() => handleSubmitExam()}
						size="large"
						sx={{
							color: theme.palette.common.white,
							maxWidth: '180px'
						}}
					>
						Enviar
					</LoadingButton>
				</Box>
			)}
			{/* {showResults && (
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateExam({ state: '' })}
            sx={{
              color: theme.palette.common.white,
              maxWidth: '180px',
            }}
          >
            Regresar
          </Button>
        </Box>
      )} */}
		</Container>
	);
}

export default ExamContainer;
