import { Box, Typography } from '@mui/material';
import { BoxProps } from '@mui/system';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import ActionMenuPopOver from './ActionMenuPopOver';

interface StyledTopImageProps extends BoxProps {
	alt?: string;
	src?: string;
}

const StyledTopImage = styled(Box)<StyledTopImageProps>(({ theme }) => ({
	maxHeight: 120,
	width: 200,
	maxWidth: 200,
	// maxWidth: 210,
	objectFit: 'cover',
	borderRadius: '16px'
	// marginBottom: '1rem',
	// [theme.breakpoints.up('xl')]: {
	// 	marginBottom: '5em'
	// }
}));

const SingleTopicWrapper = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	padding: '1rem',
	position: 'relative',
	borderRadius: '1rem',
	'&:hover': {
		backgroundColor: 'rgba(0,0,0,0.1)'
	}
}));

const TopicsWrapper = styled(Box)<any>(({ theme }) => ({
	marginTop: '2rem',
	position: 'relative',
	'& .single-topic-wrapper:not(:last-child) div': {
		marginBottom: '1rem'
	}
}));

const TopicDescription = styled(Box)<any>(({ theme }) => ({
	marginLeft: '1.5rem',
	color: '#000',
	'& .topic-name': {
		fontSize: '1.6rem',
		fontWeight: '700',
		color: '#000'
	}
}));

const LinkTopicWrapper = styled(Link)<any>(({ theme }) => ({
	textDecoration: 'none',
	'&.topic-hidden': {
		opacity: 0.5
	}
}));

const PlusAction = styled(Box)<any>(({ theme }) => ({
	position: 'absolute',
	right: '0.5rem',
	top: '0.5rem',
	backgroundColor: 'white',
	display: 'flex',
	borderRadius: '50px',
	boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
	'& .material-icons': {
		color: '#000',
		padding: '0.5rem'
	}
}));

const ActionMenuItem = styled(MenuItem)<any>(({ theme }) => ({
	// boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
}));

// const ActionMenuPopOver = styled(Popover)<any>(({ theme }) => ({
// 	'& .MuiPopover-paper':{
// 		boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
// 	},
// 	marginTop: '1rem'
// }));

function TodosTopicSummary({ topics, subjectid, courseid, sendUpdateTopic }) {
	const [open, setOpen] = useState(false);
	const [actionsMenu, setActionsMenu] = useState<HTMLElement | null>(null);
	const [selectedTopic, setSelectedTopic] = useState(null);

	const handleAction = (e, topic) => {
		e.preventDefault();
		setSelectedTopic(topic);
		setActionsMenu(e.currentTarget);
		// setOpen(true)
	};

	const handleClose = () => {
		setOpen(false);
	};

	const actionsMenuClose = () => {
		// e.preventDefault();
		setActionsMenu(null);
	};

	const updateTopic = (updatedTopic) => {
		sendUpdateTopic(updatedTopic);
	};

	return (
		<TopicsWrapper className="topics-wrapper">
			{topics.map((topic) => (
				<LinkTopicWrapper
					to={`topics/${topic?.id}`}
					style={{ textDecoration: 'none' }}
					className={`single-topic-wrapper ${topic.hidden ? 'topic-hidden' : ''}`}
				>
					<SingleTopicWrapper key={`topic-wrapper-${topic.id}`}>
						<PlusAction
							onClick={(e) => {
								handleAction(e, topic);
							}}
						>
							<i className="material-icons">add</i>
						</PlusAction>
						<StyledTopImage
							component="img"
							alt={topic.imageAlt}
							src={topic.image}
						/>
						<TopicDescription>
							<Typography className="topic-name">{topic.name}</Typography>
							<Typography>{topic.description}</Typography>
						</TopicDescription>

						{selectedTopic && (
							<ActionMenuPopOver
								topic={selectedTopic}
								actionsMenu={actionsMenu}
								setActionsMenu={actionsMenuClose}
								updateTopic={updateTopic}
							/>
						)}
					</SingleTopicWrapper>
				</LinkTopicWrapper>
			))}
		</TopicsWrapper>
	);
}

export default TodosTopicSummary;
