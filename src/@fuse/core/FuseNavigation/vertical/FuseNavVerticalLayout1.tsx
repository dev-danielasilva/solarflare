import * as React from 'react';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { ProfileModal } from 'app/theme-layouts/shared-components/ProfileModal';
import { useState } from 'react';
import FuseNavItem from '../FuseNavItem';
import { FuseNavigationProps } from '../FuseNavigation';
import { FuseNavItemType } from '../types/FuseNavItemType';
import SubjectDialog from 'app/shared-components/dedicated/LHDialogs/SubjectDialog';

const StyledList = styled(List)(({ theme }) => ({
	'& .fuse-list-item': {
		'&:hover': {
			backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,.04)'
		},
		'&:focus:not(.active)': {
			backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,.05)'
		}
	},
	'& .fuse-list-item-text': {
		margin: 0
	},
	'& .fuse-list-item-text-primary': {
		lineHeight: '20px'
	},
	'&.active-square-list': {
		'& .fuse-list-item, & .active.fuse-list-item': {
			width: '100%',
			borderRadius: '0'
		}
	},
	'&.dense': {
		'& .fuse-list-item': {
			paddingTop: 0,
			paddingBottom: 0,
			height: 32
		}
	}
}));

/**
 * FuseNavVerticalLayout1
 * This component is used to render vertical navigations using
 * the Material-UI List component. It accepts the FuseNavigationProps props
 * and renders the FuseNavItem components accordingly
 */
function FuseNavVerticalLayout1(props: FuseNavigationProps) {
	const { navigation, active, dense, className, onItemClick, checkPermission } = props;
	const [openProfile, setOpenProfile] = useState<boolean>(false);
	const [open, setOpen] = React.useState(false);
	const [courseId, setCourseId] = React.useState('');

	function handleItemClick(item: FuseNavItemType) {
		handleClickAction(item);
	}

	const handleClickAction = (item: FuseNavItemType) => {
		if(item.action === 'subject-modal'){
			setOpen(true);
			setCourseId(item.courseId);
		}else if(item.id === 'profile'){
			setOpenProfile(true);
		}else{
			onItemClick?.(item);
		}
	}

	const handleClose = () => {
		setOpen(false);
	};


	return (
		<>
			<StyledList
				className={clsx(
					// 'navigation whitespace-nowrap px-12 py-0', --> Commented out to remove outer padding of sidebar
					'navigation whitespace-nowrap px-0 py-0',
					`active-${active}-list`,
					dense && 'dense',
					className
				)}
			>
				{navigation.map((_item) => (
					<FuseNavItem
						key={_item.id}
						type={`vertical-${_item.type}`}
						item={_item}
						nestedLevel={0}
						onItemClick={handleItemClick}
						checkPermission={checkPermission}
					/>
				))}
			</StyledList>
			<ProfileModal
				open={openProfile}
				onClose={() => setOpenProfile(false)}
			/>
			{courseId != '' &&
				<SubjectDialog
					open={open}
					handleClose={handleClose}
					courseId={courseId}
				/>
			}
		</>
	);
}

export default FuseNavVerticalLayout1;
