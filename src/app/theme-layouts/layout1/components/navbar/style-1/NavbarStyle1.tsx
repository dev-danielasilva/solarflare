/* eslint-disabled */
import Hidden from '@mui/material/Hidden';
import { useEffect } from 'react';
import { Theme } from '@mui/system/createTheme';
import { styled, useTheme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useSelector } from 'react-redux';
import { navbarCloseMobile, selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import { selectFuseCurrentLayoutConfig } from 'app/store/fuse/settingsSlice';
import { useAppDispatch } from 'app/store';
import { Layout1ConfigDefaultsType } from 'app/theme-layouts/layout1/Layout1Config';
import { selectUser } from 'app/store/user/userSlice';
import jwtService from 'src/app/auth/services/jwtService';
import { appendNavigationItem, removeNavigationItem } from 'app/store/fuse/navigationSlice';
import NavbarStyle1Content from './NavbarStyle1Content';
import definitionService from 'src/app/services/definitionService';
import _ from 'lodash';

const navbarWidth = 280;

type StyledNavBarProps = {
	theme?: Theme;
	open: boolean;
	position: string;
};

const StyledNavBar = styled('div')<StyledNavBarProps>(({ theme, open, position }) => ({
	minWidth: navbarWidth,
	width: navbarWidth,
	maxWidth: navbarWidth,
	backgroundColor: theme.palette.background.paper,
	...(!open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.leavingScreen
		}),
		...(position === 'left' && {
			marginLeft: `-${navbarWidth}px`
		}),
		...(position === 'right' && {
			marginRight: `-${navbarWidth}px`
		})
	}),
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));

const StyledNavBarMobile = styled(SwipeableDrawer)(() => ({
	'& .MuiDrawer-paper': {
		minWidth: navbarWidth,
		width: navbarWidth,
		maxWidth: navbarWidth
	}
}));

/**
 * The navbar style 1.
 */
function NavbarStyle1() {
	const dispatch = useAppDispatch();
	const config = useSelector(selectFuseCurrentLayoutConfig) as Layout1ConfigDefaultsType;
	const navbar = useSelector(selectFuseNavbar);
	const user = useSelector(selectUser);
	const theme = useTheme();
	const bgColor = definitionService.getBackgroundColor()

	useEffect(() => {
		dispatch(removeNavigationItem('subjects'));
		dispatch(removeNavigationItem('courses'));
		getCourses();
	}, []);

	function getCourses() {
		jwtService
			.getCourses()
			.then((courses: any) => {
				const coursesWithSubject = courses.filter(course => !_.isUndefined(course?.subject?.id))
				const formattedCourses = buildCourses(coursesWithSubject);
				dispatch(appendNavigationItem(formattedCourses));
			})
			.catch((e) => {
				console.error('The courses error! ', e);
			});
	}

	const buildCourses = (courses) => {
		const groupedCourses = {};
		courses.forEach((course) => {
			const setKey = `${course.tenant}-${course.grade}-${course.group}`;
			if (!groupedCourses[setKey]) {
				groupedCourses[setKey] = [];
			}

			groupedCourses[setKey].push(course);
		});

		let result: any = {};

		if (Object.keys(groupedCourses).length === 1) {
			result = {
				id: 'subjects',
				title: 'Materias',
				icon: 'heroicons-outline:cube',
				type: 'group',
				translate: 'Materias',
				iconType: 'material',
				children: []
			};

			courses.forEach((course) => {
				const formattedCourse: any = {
					id: `subjects.${course.subject.id}`,
					title: course?.subject?.name.replaceAll(' ', '\u00A0'),
					type: 'item',
					// url: `/courses/${course.id}/subjects/${course.subject.id}`,
					action: user.role === 'student' ? 'subject-modal' : 'item',
					courseId: course.id,
					translate: course?.subject?.name.replaceAll(' ', '\u00A0')
				};

				if (user.role !== 'student') {
					formattedCourse.url = `/courses/${course.id}/subjects/${course.subject.id}`;
				}

				if (course?.subject?.icon) {
					formattedCourse.icon = course?.subject?.icon;
				}

				result.children.push(formattedCourse);
			});
		} else if (Object.keys(groupedCourses).length > 1) {
			result = {
				id: 'courses',
				title: 'Cursos',
				icon: 'heroicons-outline:cube',
				type: 'group',
				translate: 'Cursos',
				iconType: 'material',
				children: []
			};

			for (const [key, value] of Object.entries(groupedCourses)) {
				const keySplit = key.split('-');

				const subjects = [];
				value.forEach((course) => {
					const formattedCourse: any = {
						id: `subjects.${course.subject.id}`,
						title: course?.subject?.name.replaceAll(' ', '\u00A0'),
						type: 'item',
						translate: course?.subject?.name.replaceAll(' ', '\u00A0')
					};

					if (user?.role === 'student') {
						formattedCourse.action = 'subject-modal';
						formattedCourse.courseId = course.id;
					} else {
						formattedCourse.url = `/courses/${course.id}/subjects/${course.subject.id}`;
					}

					subjects.push(formattedCourse);
				});

				result.children.push({
					id: `course.${key}`,
					title: `${keySplit[1]}-${keySplit[2]}`,
					type: 'collapse',
					translate: `${keySplit[1]}-${keySplit[2]}`,
					children: subjects
				});
			}
		}

		return result;
	};

	return (
		<>
			<Hidden lgDown>
				<StyledNavBar
					className="sticky top-0 z-20 h-screen flex-auto shrink-0 flex-col overflow-hidden shadow-5"
					open={navbar.open}
					position={config.navbar.position}
				>
					<NavbarStyle1Content />
				</StyledNavBar>
			</Hidden>

			<Hidden lgUp>
				<StyledNavBarMobile
					classes={{
						paper: 'flex-col flex-auto h-full'
					}}
					anchor={config.navbar.position as 'left' | 'top' | 'right' | 'bottom'}
					variant="temporary"
					open={navbar.mobileOpen}
					onClose={() => dispatch(navbarCloseMobile())}
					onOpen={() => {}}
					disableSwipeToOpen
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
					slotProps={{
						backdrop: {
							style: {
								// backgroundColor: `${theme.palette.secondary.main}70`,
								backgroundColor: `${bgColor}70`,
								backdropFilter: 'blur(10px)'
							}
						}
					}}
				>
					<NavbarStyle1Content />
				</StyledNavBarMobile>
			</Hidden>
		</>
	);
}

export default NavbarStyle1;
