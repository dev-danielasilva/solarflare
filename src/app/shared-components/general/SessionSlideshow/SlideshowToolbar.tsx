import { Box, Card, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { ReactNode, useMemo } from 'react';

export interface ToolbarAction {
	label: string;
	icon: ReactNode;
	onClick: () => void;
	shouldShow?: boolean;
	tooltipText?: string;
}

interface ISlideshowToolbarProps {
	actionButtons: ToolbarAction[];
}

export function SlideshowToolbar({ actionButtons }: ISlideshowToolbarProps) {
	const showButtons = useMemo(() => {
		return actionButtons.filter((button) => button.shouldShow === true || button.shouldShow === undefined);
	}, [actionButtons]);

	return (
		<Box
			sx={{
				position: 'fixed',
				top: '2em',
				right: '2em',
				zIndex: 99999999,
				opacity: 0.5,
				transition: 'opacity 0.3s',
				'&:hover': {
					opacity: 1
				}
			}}
		>
			<Card
				component={Paper}
				sx={{ width: 50, p: 1 }}
			>
				<Stack
					sx={{ justifyContent: 'center', alignItems: 'center' }}
					spacing={1}
				>
					{showButtons.map((button, index) => (
						<Tooltip
							key={index}
							title={button.tooltipText}
							placement="left"
							arrow
						>
							<IconButton
								size="small"
								onClick={button.onClick}
							>
								{button.icon}
							</IconButton>
						</Tooltip>
					))}
				</Stack>
			</Card>
		</Box>
	);
}
