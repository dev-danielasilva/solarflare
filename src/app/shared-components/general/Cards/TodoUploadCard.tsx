import { Box, Card, CardContent, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import _ from "@lodash";
import definitionService from "src/app/services/definitionService";
import DropzoneUpload from "../TodoDropzone/DropzoneUpload";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/user/userSlice";
import { useState } from "react";
import FileDownload from "../FileDownload/FileDownload";
import jwtService from "src/app/auth/services/jwtService";
import { debug, isFuture } from 'src/app/utils';
import LoadingButton from "@mui/lab/LoadingButton";
import { useParams } from "react-router";
import { showMessage } from 'app/store/fuse/messageSlice'
import { useAppDispatch } from "app/store";

const CardHeader = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	marginBottom: '2rem',
	[theme.breakpoints.down('sm')]: {
		display: 'block'
	}
}));

const CardTitle = styled(Typography)<any>(({ role, theme }) => ({
	fontSize: '2.5rem',
	fontWeight: 600,
	margin: role === 'student' ? 'auto 1.5rem auto 0' : 0,
	[theme.breakpoints.down('sm')]: {
		margin: role === 'student' ? '1rem 0' : 0
	}
}));

const CardHeaderImage = styled(Box)<any>(({ theme }) => ({
	borderRadius: '100px',
	maxWidth: '85px',
	marginRight: '1.5rem'
}));


function TodoUploadCard({ todo, updateTodo }) {
  const user = useSelector(selectUser);
  const { courseid, todoid } = useParams();
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const headerImage = definitionService.getSkinFromDefinition(
    "card_characters.step_two",
    {}
  );
  const [file, setFile] = useState(null);
  const [initialSubmission, setInitialSubmission] = useState(todo.submission);
  const [isLoading, setIsLoading] = useState(null);
  const [isFileLoading, setFileLoading] = useState(false);
	const isPremium = user?.tenant?.license.type.toLowerCase() === 'premium';
  
  const setUploadedFiles = (files) => {
    setFile(files[0])
  }

  const saveFile = (removeFile=false) => {

    // TODO: Change after there is a fix on the MSD side.
    const sfile = new File(["foo"], "foo.txt", {
      type: "text/plain",
    })
    const _file = removeFile ? sfile : file;
    
    const formData = new FormData();
    formData.append('submission', _file)

    if(!removeFile){
      setIsLoading(true);
    }else{
      setFileLoading(true);
    }

		jwtService
			.updateTodoUser(courseid, todo.id, formData)
			.then((updatedTodo: any) => {
				updateTodo(updatedTodo);
				setIsLoading(false);
				window.scrollTo({ top: 0, behavior: 'smooth' });
        triggerMessage('El cambio se efectuó adecuadamente.', 'success')
        setFileLoading(false);
        resetFile();

        // TODO: Remove after there is a fix on the MSD side.
        if(updatedTodo.submission){
          const submissionSplit = updatedTodo.submission?.split('.');
          const submissionExt = submissionSplit[submissionSplit.length - 1];
  
          if(submissionExt === 'txt'){
            updatedTodo.submission = ''
          }
          
          setInitialSubmission(updatedTodo.submission)
        }
			})
			.catch((e) => {
				setIsLoading(false);
				debug('GET Error on updateTodoUser() ', e);
        triggerMessage('Ocurrió un error. Por favor, intenta de nuevo.', 'error')
			});
    
  }

  const triggerMessage = (message, variant) => {
    dispatch(
      showMessage({
        message: message, //text or html
        autoHideDuration: 6000, //ms
        anchorOrigin: {
          vertical: 'top', //top bottom
          horizontal: 'center', //left center right
        },
        variant: variant, //success error info warning null
      })
    )
  }

  const handleOnRemove = () => {
    if(todo.submission){
      saveFile(true)
    }else{
      resetFile();
    }
  }

  const resetFile = () => {
    setFile(null)
    setInitialSubmission(null)
  }

  return (
    <>
      <Card
        className="mt-0 p-24"
        sx={{ position: "relative", marginBottom: "4rem" }}
      >
        <CardContent
          sx={{
            p: "0 !important",
          }}
        >
          <CardHeader>
            {user?.role === 'student' && headerImage?.image && (
							<CardHeaderImage
								component="img"
								src={headerImage?.image}
								alt={headerImage?.alt ? headerImage.alt : 'Detalles del examen'}
							/>
						)}
            <CardTitle role={user?.role}>¡Envía tu trabajo!</CardTitle>
          </CardHeader>

          {/*  */}
          {!isPremium || !todo.due_date || !(isPremium && !isFuture(todo.due_date * 1000) && !_.isNumber(todo.score) && !todo.submission) ?
            <>
          <Typography
              sx={{
                fontSize: "1.6rem",
                marginBottom: "2rem",
              }}
            >
            Aquí puedes la actividad. Arrastra o haz clic en el espacio para hacerlo.
            </Typography>
            {
              (file || initialSubmission) && <FileDownload
                attachment={file || {
                  name: initialSubmission.split('/')[initialSubmission.split('/').length - 1],
                  url: initialSubmission
                }}
                isRaw = {!!file}
                remove = {_.isNull(todo.score) || todo.score === 'NA'}
                // remove
                download = {!file}
                onRemove={handleOnRemove}
                isLoading={isFileLoading}
                />
            }

            { !file && !initialSubmission && (_.isNull(todo.score) || todo.score === 'NA') && user?.role === 'student' &&
              <DropzoneUpload 
              setUploadedFiles={setUploadedFiles}
            />
            }

            { !file && !todo.submission && (!_.isNull(todo.score) && todo.score !== 'NA')  &&
              <Box sx={{
                backgroundColor: "#F8F8F8",
                borderRadius: "30px",
                padding: "1rem 2rem",
                width: "100%"
              }}>
                <Typography
                sx={{
                  fontSize: "1.6rem",
                }}
              >
                Ya tienes calificación. No puedes enviar archivos.
              </Typography>
              </Box>
            }

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: "2rem",
            }}>
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  margin: "auto 0"
                }}
              >
                *Límite de tamaño: 150MB, solo se permiten formatos: .pdf, .docx, .ppt, .xlsx 
              </Typography>
              {
                (_.isNull(todo.score) || todo.score === 'NA') && <LoadingButton
                loading={isLoading}
                variant="contained"
                color="secondary"
                aria-label="Enviar"
                disabled={!file}
                type="submit"
                size="large"
                sx={{
                  color: theme.palette.common.white,
                  maxWidth: '180px',
                }}
                onClick={() => saveFile()}
              >
                Enviar
              </LoadingButton>
              }
            </Box>
            </> :  <Box sx={{
              padding: '1rem',
              backgroundColor: '#F1F0F0',
              borderRadius: '10px'
            }}>
              {"¡Vaya! Ya se terminó el tiempo para subir esta actividad."}
            </Box>
          }
        </CardContent>
      </Card>
    </>
  );
}

export default TodoUploadCard;