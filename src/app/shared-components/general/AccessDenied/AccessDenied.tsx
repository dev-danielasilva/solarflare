import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Container, LinearProgress, Stack, Typography } from '@mui/material';
import StarProgressSvg from '../StarProgress';
import { progressStarsAndMedals } from '../utils';

interface AccessDeniedProps {
	message?: string;
}

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function AccessDenied({ message }: AccessDeniedProps) {
	return (
<div className="flex flex-1 flex-col items-center justify-center p-16">
			<div className="w-full max-w-3xl text-center">
				<Typography
					variant="h5"
					color="text.secondary"
					className="mt-8 text-center text-lg font-medium tracking-tight md:text-xl"
				>
					No tienes acceso a esta página. 
				</Typography>
				<Link
					className="mt-48 block font-normal"
					to="/"
				>
					Regresar al inicio
					</Link>
			</div>
		</div>
	);
}

export default AccessDenied;
