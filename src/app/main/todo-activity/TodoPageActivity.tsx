import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import jwtService from 'src/app/auth/services/jwtService';
import { debug, getValueSafe } from 'src/app/utils';
import { Banner } from 'app/shared-components/general/Banner';
import _ from 'lodash';
import { useAppDispatch } from 'app/store';
import { selectUser } from 'app/store/user/userSlice';
import { useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import TodoInfoCard from 'app/shared-components/general/Cards/TodoInfoCard';
import TodoResultsCard from 'app/shared-components/general/Cards/TodoResultsCard';
import TodoGradesCard from 'app/shared-components/general/Cards/TodoGradesCard';
import TodoUploadCard from 'app/shared-components/general/Cards/TodoUploadCard';
import TodoPreviewCard from 'app/shared-components/general/Cards/TodoPreviewCard';
import GeneralMessageCard from 'app/shared-components/general/GeneralMessageCard/GeneralMessageCard';
import LoadingPage from 'app/shared-components/general/LoadingComponents/LoadingPage';

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function TodoPageActivity() {
	const { courseid, topicid, todoid, subjectid } = useParams();
	const [todo, setTodo] = useState(null);
	const [previewDoc, setPreviewDoc] = useState(null);
	const [studentTodo, setStudentTodo] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const user = useSelector(selectUser);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const errorMessage =
	user.role !== 'student'
		? 'Ocurrió un error al cargar la actividad. Por favor reporta este incidente.'
		: 'Ocurrió un error al cargar la actividad. Por favor repórtalo con tu maestro o maestra.';

	useEffect(() => {
		if (courseid && topicid && subjectid && todoid) {
			getTodo();
		}
	}, [courseid, topicid, subjectid, todoid]);

	async function getTodo() {
		setIsLoading(true)
		try {
			const [todo, submissions]: [any, any] = await Promise.all([
				jwtService.getSessionItem(courseid, todoid, user.role),
				jwtService.getSubmissions(courseid, todoid)
			]);

			setIsLoading(false)
			if (todo) {

				// TODO: Remove after fix on the MSD side.
				if(todo.submission){
					const submissionSplit = todo.submission?.split('.');
					const submissionExt = submissionSplit[submissionSplit?.length - 1];
	
					if(submissionExt === 'txt'){
						todo.submission = ''
					}
				}

				if(todo.start_date && user.role === 'student'){
					const currentDate = new Date();
					const startDate = new Date(todo.start_date * 1000);

					if(startDate < currentDate){
						setTodo(todo);
					}
				}else{
					setTodo(todo);
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
	}

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

	const updateStudentTodo = (studentTodo) => {
		setStudentTodo({...studentTodo, content: todo.content});
	};

	const updateTodo = (updatedTodo) => {
		setTodo(updatedTodo);
	}

	const updatePreviewDoc = (item) => {
		if(item?.file){
			setPreviewDoc({
				uri: item.file,
				user_full_name: item.full_name,
				user_id: item.user_id
			})
		}
	};

	useEffect(() => {
		if(previewDoc?.user_id){
			setTimeout(() => {
				document.getElementById('preview-card').scrollIntoView()
			}, 600);
		}
	}, [previewDoc])


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
				<Container maxWidth="lg">
					{_.isNumber(todo.score) && user.role === 'student' && <TodoGradesCard todo={todo} />}
					<TodoInfoCard 
						todo={todo}
						updateTodo={updateTodo}
					/>
					{
						user?.role !== 'student' && <TodoResultsCard
							onPreview={updatePreviewDoc}
						/>
					}
					{
						user?.role == 'student' && <TodoUploadCard
							todo={todo}
							updateTodo={updateTodo}
						/>
					}

					{
						previewDoc && <TodoPreviewCard
							docUri={previewDoc?.uri}
							userName={previewDoc?.user_full_name}
						/>
					}

				</Container>
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

export default TodoPageActivity;
