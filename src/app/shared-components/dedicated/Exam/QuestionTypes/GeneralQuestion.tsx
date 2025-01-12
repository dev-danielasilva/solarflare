// prettier-ignore
import { Box, Checkbox, Radio, RadioGroup, TextField, Tooltip, useTheme } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import FormLabel from '@mui/material/FormLabel'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import _ from '@lodash'
import FuseSvgIcon from '@fuse/core/FuseSvgIcon'
import { useSelector } from 'react-redux'
import { selectUser } from 'app/store/user/userSlice'
import GeneralQuestionEditMode from './GeneralQuestionEditMode'
import { StringifyObject } from 'src/app/utils'
// prettier-ignore-end

const PlusAction = styled(Box)<any>(({ disabled }) => ({
	position: 'absolute',
	right: 0,
	top: 0,
	backgroundColor: 'white',
	display: 'flex',
	borderRadius: '50px',
	padding: '0.5rem',
	opacity: disabled ? 0.5 : 1,
	boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
	'& .material-icons': {
		color: '#000',
		padding: '0.5rem'
	},
	cursor: 'pointer',
	'& svg': {
		transform: 'scale(0.8)'
	}
}));

const QuestionText = styled(FormLabel)<any>(() => ({
	fontSize: '2rem',
	color: '#000 !important',
	marginBottom: '1.5rem',
	fontWeight: '700'
}));

const ChoiceText = styled(FormControlLabel)<any>(({ hidden, mode }) => ({
	opacity: hidden && mode === 'view' ? 0.3 : 1,
	'& span': {
		fontSize: '1.6rem'
	},
	'&.correct': {
		'& span': {
			color: '#39C74A'
		},
		'& .MuiTypography-root': {
			color: '#39C74A'
		}
	},
	'&.incorrect': {
		'& span': {
			color: 'red'
		},
		'& .MuiTypography-root': {
			color: 'red'
		}
	}
}));

const FormControlLabelRadio = styled(FormControlLabel)<any>(({ hidden, mode }) => ({
	opacity: hidden && mode === 'view' ? 0.3 : 1,
	'& span': {
		fontSize: '1.6rem'
	},
	'&.correct': {
		'& span': {
			color: '#39C74A'
		},
		'& .MuiTypography-root': {
			color: '#39C74A'
		}
	},
	'&.correct-shadow':{
		'&::after':{
			content: '""',
			width: '10px',
			backgroundColor: 'limegreen',
			height: '10px',
			position: 'absolute',
			left: '5px',
			borderRadius: '10px'
		}
	},
	'&.incorrect': {
		'& span': {
			color: 'red'
		},
		'& .MuiTypography-root': {
			color: 'red'
		}
	},
	'&.incorrect-shadow':{
		'&::after':{
			content: '""',
			width: '10px',
			backgroundColor: 'red',
			height: '10px',
			position: 'absolute',
			left: '5px',
			borderRadius: '10px'
		}
	},
}));

const ChoiceTextImage = styled(FormControlLabel)<any>(({ hidden, mode }) => ({
	opacity: hidden && mode === 'view' ? 0.3 : 1,
	display: 'inline-block',
	'& span': {
		fontSize: '1.6rem'
	},
	'&.correct': {
		'& span': {
			color: '#39C74A'
		},
		'& .MuiTypography-root': {
			color: '#39C74A'
		}
	},
	'&.incorrect': {
		'& span': {
			color: 'red'
		},
		'& .MuiTypography-root': {
			color: 'red'
		}
	}
}));

const PreviewImage = styled(Box)<any>(({ theme }) => ({
	width: '200px',
	borderRadius: '1rem',
	[theme.breakpoints.down('sm')]: {
		width: '120px'
	}
}));

const ChoicesContainer = styled(Box)<any>(({ theme }) => ({
  '&:not(.imagepicker)': {
    display: 'contents',
  },
  '&.imagepicker': {
    justifyContent: 'flex-start',
    display: 'flex',
    padding: '0 1rem',
    flexWrap: 'wrap',
  },
  '&.imagepicker .MuiCheckbox-root': {
    display: 'none',
  },
  '&.imagepicker .MuiTypography-root': {
    padding: '0 1rem',
    display: 'block',
    width: '200px',
    [theme.breakpoints.down('sm')]: {
      width: '120px',
    },
  },
}))

const PreviewImageContainer = styled(Box)<any>(({ theme }) => ({
	display: 'block',
	position: 'relative',
	marginTop: '1rem',
	maxWidth: '200px',
	padding: '0.5rem',
	'&:hover': {
		border: 'none',
		borderRadius: '1rem',
		backgroundColor: '#e9e9e9'
	},
	'&.selected': {
		border: 'none',
		borderRadius: '1rem',
		padding: '1rem',
		backgroundColor: '#6F99F5'
	},
	'&.correct': {
		border: 'none',
		borderRadius: '1rem',
		padding: '1rem',
		backgroundColor: '#39C74A'
	},
	'&.incorrect': {
		border: 'none',
		borderRadius: '1rem',
		padding: '1rem',
		backgroundColor: 'red'
	}
}));

function GeneralQuestion({
	todo,
	question,
	updateTodo,
	showCorrect,
	showResults,
	updateResponses,
	responsesFromCache,
	questionModeStateChanged
}) {
	const user: BaseUserType = useSelector(selectUser);
	const isPremium = user.tenant.license.type.toLowerCase() === 'premium';
	const theme = useTheme();
	const [mode, setMode] = useState('view');
	const getExamProgressFromCache = () => {
		const _progressFromCache = window.localStorage.getItem(`examprogress-${todo.id}`);
		const isStudentDemo = user.role === 'student' && user.is_demo;
		if (_progressFromCache && _progressFromCache !== 'undefined' && !isStudentDemo) {
			// console.log(
			//   'Progress from cache ',
			//   JSON.parse(_progressFromCache)[question.name]
			// )
			return JSON.parse(_progressFromCache)?.[question.name] ? JSON.parse(_progressFromCache)?.[question.name] : []
		}
		return [];
	};
	const [selectedValues, setSelectedValues] = useState(getExamProgressFromCache());

	const { control, formState, setError, watch, handleSubmit, setValue, getValues } = useForm({
		mode: 'onChange'
	});

	const handleOptionClick = (e, value?, type?) => {
		if (question.hidden) {
			return;
		}

		if (type != 'radiogroup' && (question.selectionType !== 'radiogroup')) {
			const isChecked = e.target.checked;
			if (isChecked) {
				setSelectedValues((prevSelectedValues) => {
					if (prevSelectedValues) {
						const prev = [...prevSelectedValues];
						prev.push(value);
						return prev;
					}
					return [...value];
				});
			} else {
				setSelectedValues((prevSelectedValues) => {
					const result = prevSelectedValues.filter((currentValue) => currentValue != value);
					return result;
				});
			}
		} else {
			setSelectedValues([value]);
		}
	};

	useEffect(() => {
		updateResponses(question.name, selectedValues);
	}, [selectedValues]);

	useEffect(() => {
		questionModeStateChanged(mode);
	}, [mode]);

	useEffect(() => {
		if (showCorrect) {
			setSelectedValues(question.correctAnswer);
		} else if (user.role !== 'student' && !_.isNumber(todo.score)) {
			setSelectedValues([]);
		}
		// else {
		//   setSelectedValues([])
		//   // console.log('Responses from cache ', responsesFromCache)
		//   // if (responsesFromCache) {
		//   //   setSelectedValues(responsesFromCache[question.name])
		//   // } else {
		//   //   // setSelectedValues([])
		//   // }
		//   // // console.log('RESPONSES STATE! ', _responsesState)
		//   // // if (_responsesState) {
		//   // //   setResponsesState(_responsesState)
		//   // // }
		// }
	}, [showCorrect]);

  useEffect(() => {
    if (showCorrect) {
      setSelectedValues(question.correctAnswer)
    } else if (user.role !== 'student' && !_.isNumber(todo.score) ) {
      setSelectedValues([])
    }
    // else {
    //   setSelectedValues([])
    //   // console.log('Responses from cache ', responsesFromCache)
    //   // if (responsesFromCache) {
    //   //   setSelectedValues(responsesFromCache[question.name])
    //   // } else {
    //   //   // setSelectedValues([])
    //   // }
    //   // // console.log('RESPONSES STATE! ', _responsesState)
    //   // // if (_responsesState) {
    //   // //   setResponsesState(_responsesState)
    //   // // }
    // }
  }, [showCorrect])


  useEffect(() => {
	if(!showResults && (user.role != 'student' || user.is_demo)){
		setSelectedValues([])
	}
  }, [showResults])


	const getClassNameImage = (choice) => {
		let classes = '';

		if (showResults) {
			if (question.correctAnswer.includes(choice.value) && selectedValues?.includes(choice.value)) {
				return 'correct';
			}
			if (showResults && selectedValues?.includes(choice.value)) {
				return 'incorrect';
			}
		} else if (showCorrect && question.correctAnswer.includes(choice.value)) {
			return 'correct';
		} else if (selectedValues?.includes(choice.value)) {
			classes = 'selected';
		}

		return classes;

		// return selectedValues.includes(choice.value) && !showCorrect && !showResults
		//   ? 'selected'
		//   : question.correctAnswer.includes(choice.value) &&
		//     (showCorrect || showResults)
		//   ? `correct`
		//   : 'incorrect'
	};

	const getClassNameCheckbox = (choice) => {
		let classes = '';
		if (selectedValues?.includes(choice.value)) {
			if (question.correctAnswer.includes(choice.value)) {
				classes = 'correct';
			} else {
				classes = 'incorrect';
			}
		}

		return classes;
	};

	const handleSetMode = (mode) => {
		if (!todo.blockEdit) {
			setMode(mode);
		}
	};

	return mode == 'edit' ? (
		<GeneralQuestionEditMode
			todo={todo}
			question={question}
			updateTodo={updateTodo}
			setMode={setMode}
			mode={mode}
		/>
	) : (
		<Box>
			<FormControl
				disabled={!!showCorrect}
				sx={{ width: '100%' }}
			>
				<QuestionText
					id="demo-radio-buttons-group-label"
					sx={{ opacity: question.hidden && mode === 'view' ? 0.3 : 1 }}
				>
					{question.title}
				</QuestionText>
				{user?.role !== 'student' && !_.isNumber(todo.score) && isPremium && (
					<Tooltip
						title="No puedes editar este examen. Ya ha sido respondido por al menos un alumno."
						disableHoverListener={!todo.blockEdit}
					>
						<PlusAction
							onClick={() => handleSetMode('edit')}
							disabled={todo.blockEdit}
						>
							<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
						</PlusAction>
					</Tooltip>
				)}

				<ChoicesContainer className={`choice-container ${question.type}`}>
					{/* SHOW RESPONSES FOR CHECKBOX AS TEXT */}
					{showCorrect &&
						question.type === 'checkbox' &&
						question.choices.map((choice, idx) => {
							return (
								<ChoiceText
									key={`choice-${idx}`}
									value={choice.value}
									className={`${question.correctAnswer.includes(choice.value) ? 'correct' : ''}`}
									sx={{
										pointerEvents: showCorrect || showResults ? 'none' : 'auto',
										cursor: showCorrect || showResults ? 'auto' : 'pointer'
									}}
									hidden={question.hidden}
									mode={mode}
									control={<Checkbox checked={!!question.correctAnswer.includes(choice.value)} />}
									label={choice.text}
								/>
							);
						})}

					{/* <pre>{JSON.stringify(selectedValues, null, 2)}</pre> */}
					{showResults &&
						question.type === 'checkbox' &&
						question.choices.map((choice, idx) => {
							return (
								<ChoiceText
									key={`choice-${idx}`}
									value={choice.value}
									className={getClassNameCheckbox(choice)}
									hidden={question.hidden}
									mode={mode}
									sx={{
										pointerEvents: showCorrect || showResults ? 'none' : 'auto',
										cursor: showCorrect || showResults ? 'auto' : 'pointer'
									}}
									control={<Checkbox 
										checked={!!selectedValues.includes(choice.value)} 
										className={`checkbox-showresults-${getClassNameCheckbox(choice)}`}
										/>}
									label={choice.text}
								/>
							);
						})}


					{/* SHOW RESPONSES FOR RADIO AS TEXT */}
					{question.type === 'radiogroup' && (
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							name="radio-buttons-group"
							defaultValue={showCorrect ? question.correctAnswer[0] : undefined}
						>
							{question.choices.map((choice, idx) => {
								return (
									<FormControlLabelRadio
										key={`choice-${idx}`}
										value={choice.value}
										control={<Radio 
											onChange={(e) => handleOptionClick(e, choice.value, question.type)}
										/>}
										label={
											<span>
												{choice.text}
											</span>
										}
										hidden={question.hidden}
										mode={mode}
										className={
											selectedValues.includes(choice.value) && 
											question.correctAnswer.includes(choice.value) && showResults ? 'correct correct-shadow' :  
											selectedValues.includes(choice.value) && showResults && !question.correctAnswer.includes(choice.value) ? 'incorrect incorrect-shadow' : 
											showCorrect && question.correctAnswer.includes(choice.value) ? 'correct correct-shadow' : ''
										}
									/>
								);
							})}
						</RadioGroup>
					)}

					{/* CHECKBOX AS TEXT */}
					{!showCorrect &&
						!showResults &&
						question.type === 'checkbox' &&
						question.choices.map((choice, idx) => {
							return (
								<ChoiceText
									key={`choice-${idx}`}
									value={choice.value}
									control={
										<Checkbox
											defaultChecked={selectedValues?.includes(choice.value)}
                      checked={selectedValues?.includes(choice.value)}
											onChange={(e) => handleOptionClick(e, choice.value, question.type)}
										/>
									}
									label={choice.text}
									hidden={question.hidden}
									mode={mode}
								/>
							);
						})}

          {/* CHECKBOX AS TEXT */}
          {/* {!showCorrect &&
            !showResults &&
            question.type === 'checkbox' &&
            question.choices.map((choice, idx) => {
              return (
                <ChoiceText
                  key={`choice-${idx}`}
                  value={choice.value}
                  control={
                    <Checkbox
                      defaultChecked={selectedValues?.includes(choice.value)}
                      checked={selectedValues?.includes(choice.value)}
                      onChange={(e) =>
                        handleOptionClick(e, choice.value, question.type)
                      }
                    />
                  }
                  label={choice.text}
                  hidden={question.hidden}
                  mode={mode}
                />
              )
            })} */}

					{/* <pre>{JSON.stringify(selectedValues, null, 2)}</pre> */}

					{/* RESPONSES FOR CHECKBOX AS IMAGE */}
					{question.type === 'imagepicker' &&
						question.choices.map((choice, idx) => {
							return (
								<ChoiceTextImage
									key={`choice-${idx}`}
									value={choice.value}
									hidden={question.hidden}
									mode={mode}
									sx={{
										pointerEvents: showCorrect || showResults ? 'none' : 'auto'
									}}
									control={
										<Box>
											<Checkbox
												onChange={(e) => handleOptionClick(e, choice.value, question.type)}
											/>
											{/* <pre>{JSON.stringify(choice.value, null, 2)}</pre>
                      <p>
                        {question.correctAnswer.includes(choice.value)
                          ? 'is correct'
                          : 'no correct'}
                      </p> */}
											<PreviewImageContainer
												// className={`${
												//   selectedValues.includes(choice.value) &&
												//   !showCorrect &&
												//   !showResults
												//     ? 'selected'
												//     : question.correctAnswer.includes(choice.value) &&
												//       (showCorrect || showResults)
												//     ? `correct`
												//     : 'incorrect'
												// }`}
												className={getClassNameImage(choice)}
											>
												{choice.imageLink && (
													<PreviewImage
														component="img"
														src={choice.imageLink}
														alt="Thumb"
													/>
												)}
											</PreviewImageContainer>
										</Box>
									}
									label={choice.text}
								/>
							);
						})}
				</ChoicesContainer>
			</FormControl>
		</Box>
	);
}

export default GeneralQuestion;
