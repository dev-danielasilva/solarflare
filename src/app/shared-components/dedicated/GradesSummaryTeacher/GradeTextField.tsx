import { TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface GradeTextFieldProps {
	score: number;
	maxGrade: number;
	sessionItemId: number;
	// setDisableSaveButton: Dispatch<SetStateAction<boolean>>;
	handleChange: (id: number, grade: number) => void;
}

function GradeTextField({ score, maxGrade, handleChange, sessionItemId }: GradeTextFieldProps) {
	const [newScore, setNewScore] = useState<number | null>(score || score === 0 ? score : null);
	const [helperText, setHelperText] = useState<string>('');

	useEffect(() => {
		if (newScore < 0) {
			setHelperText('La calificación debería de ser mayor o igual a 0');
		} else if (newScore > maxGrade) {
			setHelperText(`La calificación no puede ser mayor a ${maxGrade}.`);
		} else {
			setHelperText('');
		}
	}, [newScore]);

	return (
		<TextField
			type="number"
			size="small"
			value={newScore}
			defaultValue={newScore}
			inputProps={{ maxLength: maxGrade, sx: { maxWidth: '166px' } }}
			error={newScore > maxGrade || newScore < 0}
			helperText={
				<Typography
					variant="caption"
					// sx={{wrap: }}
				>
					{helperText}
				</Typography>
			}
			sx={{ maxWidth: '166px' }}
			onChange={(e) => {
				setNewScore(parseFloat(e.target.value));
				handleChange(sessionItemId, parseFloat(e.target.value));
			}}
		/>
	);
}

export default GradeTextField;
