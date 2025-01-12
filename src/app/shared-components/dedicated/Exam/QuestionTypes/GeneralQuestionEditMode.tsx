// prettier-ignore
import { Alert, Box, Button, Checkbox, Switch, TextField, Tooltip, useTheme } from '@mui/material'
import { StringifyObject, debug, maskRadioGroupQuestions, removeFirstAndLast } from 'src/app/utils'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useForm, useFieldArray } from 'react-hook-form'
import _ from '@lodash'
import { LoadingButton } from '@mui/lab'
import FuseSvgIcon from '@fuse/core/FuseSvgIcon'
import jwtService from 'src/app/auth/services/jwtService'
import { useSelector } from 'react-redux'
import { selectUser } from 'app/store/user/userSlice'
import FuseUtils from '@fuse/utils'
import { useParams } from 'react-router'
import { useAppDispatch } from 'app/store'
import { showMessage } from 'app/store/fuse/messageSlice'
// prettier-ignore-end

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const UploadImageButton = styled(Button)<any>(() => ({
  backgroundColor: '#FFF',
  minWidth: '40px',
  padding: 0,
  margin: '0 0.5rem',
  border: '0px solid rgba(0, 0, 0, 0.23)',
  '& .MuiButton-startIcon': {
    margin: '0',
  },
  '& svg': {
    color: '#979797',
  },
}))

const OptionBox = styled(Box)<any>(() => ({
  display: 'block',
}))

const LinedOptionBox = styled(Box)<any>(() => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: '2rem',
}))

const DeleteOptionButton = styled(Button)<any>(() => ({
  minWidth: '40px',
  '& svg': {
    color: '#979797',
  },
}))

const PreviewImage = styled(Box)<any>(() => ({
  width: '200px',
  borderRadius: '1rem',
}))

const PreviewImageContainer = styled(Box)<any>(() => ({
  display: 'block',
  marginTop: '2rem',
  position: 'relative',
  maxWidth: '200px',
}))

const RemoveFileButton = styled(Button)<any>(() => ({
  minWidth: '30px',
  minHeight: '30px',
  width: '30px',
  height: '30px',
  backgroundColor: 'white',
  position: 'absolute',
  top: '1rem',
  padding: 0,
  right: '1rem',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#FFF',
    transform: 'scale(1.1)',
  },
  '& svg': {
    transform: 'scale(0.7)',
  },
}))

const EditQuestionActions = styled(Box)<any>(({theme}) => ({
  borderTop: '1px solid #979797',
  marginTop: '2rem',
  paddingTop: '2rem',
  display: 'block',
  justifyContent: 'flex-start',
  // [theme.breakpoints.up('sm')]: {
  //   display: 'flex',
	// },
}))

const AppendButton = styled(Button)<any>(() => ({
  marginTop: '2rem',
  backgroundColor: 'white',
  border: '1px solid #e0e0e0',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
}))

const CancelButton = styled(Button)<any>(() => ({
  backgroundColor: 'white',
  border: '1px solid #e0e0e0',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  marginRight: '1rem',
}))

const MB = 1048576

function GeneralQuestion({ todo, question, updateTodo, setMode, mode }) {
  const theme = useTheme()
  const { courseid, todoid } = useParams()
  const user = useSelector(selectUser)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [selectedImages, setSelectedImages] = useState({})
  const [customError, setCustomError] = useState<any>({})
  const [hasDefaultLink, setHasDefaultLink] = useState<any>([])
  const [isLoading, setIsLoading] = useState<any>('')
  const [defaultChoices, setDefaultChoices] = useState<any>([])
  const dispatch = useAppDispatch()

  const defaultValues = () => {
    let result = {
      question: question.title,
    }
    return result
  }
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setError,
    formState,
    setValue,
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultValues(),
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  })
  const { dirtyFields } = formState

  // Reset form when user exits edit mode.
  useEffect(() => {
    resetForm()
  }, [mode])

  const resetForm = () => {
    remove()
    if (mode === 'edit') {
      question.choices.forEach((choice) => {
        if (choice.imageLink) {
          setHasDefaultLink((prev) => [...prev, choice.value])
        }
        // value: `image-${choice.value}-${FuseUtils.generateGUID()}`,
        const defaultChoice = {
          value: choice.value,
          text: choice.text || '',
          imageLink: choice.imageLink,
          isCorrect: question.correctAnswer.includes(choice.value)
            ? true
            : false,
          image: {},
        }
        append(defaultChoice)
      })
    }
  }

  // Form actions
  const handleAppend = () => {
    append({ value: FuseUtils.generateGUID(), text: '' })
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (mode === 'edit') {
        setHasUnsavedChanges(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, mode])

  const removeDefaultLink = (choiceValue) => {
    const filtered = hasDefaultLink.filter((value) => value !== choiceValue)
    setHasDefaultLink(filtered)
  }

  const imageChange = (e, item, index) => {
    if (isFileValid(e.target.files[0])) {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedImages((prevSelectedImages) => {
          return {
            ...prevSelectedImages,
            [item.id]: e.target.files[0],
          }
        })
      }
      removeDefaultLink(item.value)
    } else {
      removeFile(index)
    }
  }

  const removeFile = (index) => {
    setValue(`options.${index}.image`, undefined)
  }

  const removeSelectedImage = (id, index, value) => {
    setValue(`options.${index}.image`, undefined)
    setSelectedImages((prevSelectedImages) => {
      let result = prevSelectedImages
      delete result[id]
      return result
    })
    removeDefaultLink(value)
  }

  const handleCancel = () => {
    setHasUnsavedChanges(false)
    setMode('view')
  }

  // Submit actions
  const modifyTodo = (data) => {
    let content = todo.content
    let updatedQuestion
    let updatedOptions = []
    let correctAnswers = []

    const formData = new FormData()

    data.options.forEach((option, idx) => {
      updatedOptions.push({
        text: option.text,
        value: option.value,
      })

      if (option?.image?.[0]) {
        const id = FuseUtils.generateGUID()
        updatedOptions[idx].imageLink = '-'
        formData.append(`image-${option.value}-${id}`, option?.image?.[0])
        updatedOptions[idx].value = `image-${option.value}-${id}`
      } else if (option?.imageLink) {
        updatedOptions[idx].imageLink = option?.imageLink
      } else {
        updatedOptions[idx].imageLink = ''
      }

      if (option.isCorrect) {
        correctAnswers.push(updatedOptions[idx].value)
      }
    })

    const imageOptions = updatedOptions.filter((option) => option.imageLink)
    let questionType = 'checkbox';
    let selectionType = '';

    if(imageOptions?.length > 0){
      questionType = 'imagepicker'
      if(data.isSingle){
        selectionType = 'radiogroup'
      }else{
        selectionType = 'checkbox'
      }
    } else if(data.isSingle){
      questionType = 'radiogroup'
    }

    updatedQuestion = {
      ...question,
      correctAnswer: correctAnswers,
      hidden: data.hidden,
      title: data.question,
      choices: updatedOptions,
      type: questionType,
    }

    if(selectionType){
      updatedQuestion.selectionType = selectionType
    }

    delete updatedQuestion.index

    updatedQuestion.type = questionType;

    content.pages[0].elements[question.index] = updatedQuestion

    const _contentRestoreType = contentRestoreType(content)

    const formatedContent = removeFirstAndLast(
      JSON.stringify(_contentRestoreType).replace(/[\""]/g, '\\"')
    )

    // console.log(
    //   'This is the same, but as string ',
    //   removeFirstAndLast(JSON.stringify(_contentRestoreType).replace(/[\""]/g, '\\"'))
    // )

    formData.append('content', formatedContent)

    return formData
  }

  const contentRestoreType = (content) => {
    const questions = content?.pages?.[0]?.elements
		let result;

		if(questions){
			questions.forEach((question, idx) => {
        if(question.type != 'imagepicker'){
          questions[idx].type = questions[idx].originalType ? questions[idx].originalType : questions[idx].type          
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

  const scrollToQuestion = () => {
    let questionElement = document.getElementById(
      `form-question-${question.name}`
    )
    let topHeight = 70

    questionElement.scrollIntoView(true)

    let scrolledY = window.scrollY

    if (scrolledY) {
      window.scrollTo({
        top: scrolledY - topHeight,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  const processSubmit = (data) => {
    setCustomError(null)

    if(data.delete){
      let updatedContent = todo.content
      let updatedQuestions = updatedContent?.pages[0]?.elements.filter(question => question.name != data.name);
      
      updatedContent.pages[0].elements = updatedQuestions

      const formData = new FormData()
      // updatedContent = removeFirstAndLast(
      //   JSON.stringify(updatedContent).replace(/[\""]/g, '\\"')
      // )
    
      const _contentRestoreType = contentRestoreType(updatedContent)

      formData.append('content', JSON.stringify(_contentRestoreType))
      formData.append('name', todo.name)
      formData.append('description', todo.description)
      updateQuizTodo(formData, true)

    }else if (isSubmissionValid(data)) {
      const submitFormated = modifyTodo(data)
      updateQuizTodo(submitFormated, false)
    } else {
      scrollToQuestion()
    }
  }

  const formatTodo = (todo) => {
    let updatedTodo = todo;
    const questions = todo?.content?.pages[0]?.elements || [];
  
    questions.forEach((question, idx) => {
        let isImage:boolean = false;
        const choices = question?.choices || []
        choices.forEach(choice => {
          if(choice.imageLink && choice.imageLink != '-'){
            isImage = true
          }
        });

        updatedTodo.content.pages[0].elements[idx].type = isImage ? 'imagepicker' : 'checkbox'
    });

    return todo
  }

  const updateQuizTodo = (updatedTodo, isDelete) => {
    setIsLoading(isDelete ? 'delete' :  'submit')
    jwtService
      .updateQuizTodo(courseid, todoid, updatedTodo)
      .then((todo: any) => {
        
        // let formatedTodo = formatTodo(todo)

        updateTodo(todo)
        dispatch(
          showMessage({
            message: 'Los cambios se han realizado correctamente.', //text or html
            autoHideDuration: 6000, //ms
            anchorOrigin: {
              vertical: 'top', //top bottom
              horizontal: 'center', //left center right
            },
            variant: 'success', //success error info warning null
          })
        )
        setMode('view')
        scrollToQuestion()
        setIsLoading('')
      })
      .catch((e) => {
        setIsLoading('')
        dispatch(
          showMessage({
            message: 'Ocurrió un error. Por favor intenta de nuevo.', //text or html
            autoHideDuration: 6000, //ms
            anchorOrigin: {
              vertical: 'top', //top bottom
              horizontal: 'center', //left center right
            },
            variant: 'error', //success error info warning null
          })
        )
        debug('GET Error on updateQuizTodo() ', e)
      })
  }

  const isSubmissionValid = (data) => {
    if (data.options?.length === 0) {
      triggerError('La pregunta debe tener al menos una opción')
      return false
    }

    let hasCorrect = false
    for (let index = 0; index < data.options.length; index++) {
      const option = data.options[index]
      if (
        option.text == '' &&
        !option?.image?.[0] &&
        !hasDefaultLink?.includes(option.value)
      ) {
        triggerError(
          'Tienes una opción que no tiene ni texto ni una imagen. Agrega un valor, o elimínala.'
        )
        return false
      }

      if (option.isCorrect) {
        hasCorrect = true
      }
    }

    if (!hasCorrect) {
      triggerError('Al menos una opción tiene que ser marcada como correcta.')
      return false
    }

    return true
  }

  const isFileValid = (file) => {
    if (file?.size > 10 * MB) {
      triggerError(
        'El archivo excede el tamaño límite. Comprímelo e intenta de nuevo.'
      )
      return false
    }
    return true
  }

  const triggerError = (message) => {
    setCustomError({
      message: message,
    })
  }

  // Prevent reload / loosing changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  const removeQuestion = () => {
    const definedQuestion = {
      ...question,
      delete: true
    }
    processSubmit(definedQuestion)
  }

  return (
    <form onSubmit={handleSubmit((data) => processSubmit(data))}>
      <ul>
        {customError && customError.message && (
          <Box>
            <Alert
              sx={{ marginBottom: '1.5rem', width: 'unset !important' }}
              severity="error"
            >
              {customError.message}
            </Alert>
          </Box>
        )}

        <TextField
          {...register(`question`)}
          defaultValue={question.title}
          label={'Pregunta'}
          sx={{ width: '100%' }}
        />
        {fields.map((item, index) => (
          <OptionBox key={item.id}>
            <LinedOptionBox>
              <TextField
                {...register(`options.${index}.text`)}
                sx={{ width: '100%' }}
                label={`Opción ${index + 1}`}
                autoFocus
                // error
                // helperText="Incorrect entry."
              />
              <UploadImageButton
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<FuseSvgIcon>heroicons-outline:image</FuseSvgIcon>}
                onChange={(e) => imageChange(e, item, index)}
              >
                <VisuallyHiddenInput
                  {...register(`options.${index}.image`)}
                  type="file"
                  accept=".jpge, .png, .jpg"
                />
              </UploadImageButton>
              {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
              <Box>
                <Checkbox
                  {...register(`options.${index}.isCorrect`)}
                  defaultChecked={
                    question.correctAnswer.includes(item.value) ? true : false
                  }
                />
              </Box>
              <DeleteOptionButton onClick={() => remove(index)}>
                <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
              </DeleteOptionButton>
            </LinedOptionBox>
            {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
            {hasDefaultLink?.includes(item.value) && (
              <PreviewImageContainer>
                <PreviewImage
                  component="img"
                  src={item.imageLink}
                  alt="Thumb"
                />
                <RemoveFileButton onClick={() => removeDefaultLink(item.value)}>
                  <FuseSvgIcon sx={{ transform: 'scale (0.8)' }}>
                    heroicons-outline:trash
                  </FuseSvgIcon>
                </RemoveFileButton>
              </PreviewImageContainer>
            )}
            {selectedImages[item.id] && (
              <PreviewImageContainer>
                {URL.createObjectURL(selectedImages[item.id]) && (
                  <PreviewImage
                    component="img"
                    src={
                      selectedImages[item.id]
                        ? URL.createObjectURL(selectedImages[item.id])
                        : ''
                    }
                    alt="Thumb"
                  />
                )}
                <RemoveFileButton
                  onClick={() =>
                    removeSelectedImage(item.id, index, item.value)
                  }
                >
                  <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
                </RemoveFileButton>
              </PreviewImageContainer>
            )}
          </OptionBox>
        ))}
      </ul>

      <AppendButton
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
        onClick={() => handleAppend()}
      >
        Añadir opción
      </AppendButton>

      <EditQuestionActions>
        <FormControlLabel
          control={
            <Switch {...register(`hidden`)} defaultChecked={question.hidden} />
          }
          sx={{ marginRight: '1rem' }}
          label={
            <Box sx={{ display: 'flex' }}>
              Ocultar pregunta
              <Tooltip title="Si está encendido, los estudiantes no verán la pregunta.">
                <FuseSvgIcon sx={{ transform: 'scale(0.7)' }}>
                  heroicons-outline:information-circle
                </FuseSvgIcon>
              </Tooltip>
            </Box>
          }
        />
        <FormControlLabel
          control={
            <Switch {...register(`isSingle`)} defaultChecked={question.type === 'radiogroup' || question.selectionType === 'radiogroup' ? true : false} />
          }
          sx={{ marginRight: 'auto' }}
          label={
            <Box sx={{ display: 'flex' }}>
              Permitir solo una respuesta
              <Tooltip title="Si está encendido, solo una opción podrá ser seleccionada.">
                <FuseSvgIcon sx={{ transform: 'scale(0.7)' }}>
                  heroicons-outline:information-circle
                </FuseSvgIcon>
              </Tooltip>
            </Box>
          }
        />
      </EditQuestionActions>
      <Box sx={{
        float: 'right',
        marginTop: '2rem'
      }}>
          <LoadingButton
            loading={isLoading === 'delete'}
            variant="contained"
            onClick={() => removeQuestion()}
            aria-label="Eliminar"
            size="large"
            sx={{
              backgroundColor: '#DC2C2C',
              color: 'white',
              maxWidth: '180px',
              marginRight: '1rem',
              '&:hover':{
                backgroundColor: '#B42D2D',
              }
            }}
          >
            Eliminar
          </LoadingButton>
          <CancelButton
            variant="contained"
            size="large"
            onClick={() => handleCancel()}
          >
            Cancelar
          </CancelButton>
          <LoadingButton
            loading={isLoading === 'submit'}
            variant="contained"
            color="secondary"
            aria-label="Guardar cambios"
            disabled={_.isEmpty(dirtyFields) && customError.message}
            type="submit"
            size="large"
            sx={{
              color: theme.palette.common.white,
              maxWidth: '180px',
            }}
          >
            Guardar cambios
          </LoadingButton>
        </Box>
    </form>
  )
}

export default GeneralQuestion
