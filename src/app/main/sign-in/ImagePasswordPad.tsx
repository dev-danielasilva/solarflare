import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

const LoginPasswordImages = [
	{
		src: 'assets/images/characters/login-pattern/bear_RIlBXPf.png',
		alt: 'Bear icon',
		value: 'bear1-'
	},
	{
		src: 'assets/images/characters/login-pattern/cat_9ebIjxU.png',
		alt: 'Cat icon',
		value: 'cat2-'
	},
	{
		src: 'assets/images/characters/login-pattern/chipmunk_ned1Hwr.png',
		alt: 'Chipmunk icon',
		value: 'chipmunk3-'
	},
	{
		src: 'assets/images/characters/login-pattern/fox_ttVPAt1.png',
		alt: 'Fox icon',
		value: 'fox4-'
	},
	{
		src: 'assets/images/characters/login-pattern/jiraffe_4l6qOjh.png',
		alt: 'Jiraffe icon',
		value: 'jiraffe5-'
	},
	{
		src: 'assets/images/characters/login-pattern/lion_dXBVuFl.png',
		alt: 'Lion icon',
		value: 'lion6-'
	},
	{
		src: 'assets/images/characters/login-pattern/monkey_mInPFJS.png',
		alt: 'Monkey icon',
		value: 'monkey-'
	},
	{
		src: 'assets/images/characters/login-pattern/ant.png',
		alt: 'Ant icon',
		value: 'ant8-'
	}
];

type ImagePasswordPadProps = {
	currentPassword?: string;
	onClearPassword?: () => void;
	onImageClick?: (imageid: string) => void;
	onTogglePassMode?: () => void;
};

/**
 * The sign in page.
 */
function ImagePasswordPad({
	currentPassword,
	onClearPassword,
	onImageClick,
	onTogglePassMode
}: ImagePasswordPadProps): JSX.Element {
	const theme = useTheme();

	return (
		<>
			<Box sx={{ marginBottom: '1rem' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography
						variant="caption"
						sx={{ color: 'rgb(161, 161, 161)' }}
					>
						Contraseña *
					</Typography>
					<Typography
						variant="caption"
						sx={{
							color: theme.palette.secondary.main,
							textDecoration: 'underline',
							cursor: 'pointer',
							zIndex: 999
						}}
						onClick={onTogglePassMode}
					>
						Usar teclado
					</Typography>
				</Box>
				<Button
					sx={{
						position: 'absolute',
						right: 0,
						marginTop: '0.5rem',
						maxHeight: '2.5rem',
						minHeight: '2.5rem',
						height: '2.5rem',
						boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.25)',
						borderRadius: '10px',
						backgroundColor: 'white'
					}}
				>
					<Typography
						variant="caption"
						sx={{ color: 'rgb(161, 161, 161)' }}
						onClick={onClearPassword}
					>
						Borrar
					</Typography>
				</Button>
				<Box
					sx={{
						borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
						height: 40,
						width: '100%',
						display: 'flex'
					}}
				>
					{currentPassword
						? currentPassword.split('-').map((value, idx) => {
								return value ? (
									<svg
										viewBox="0 0 2 2"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										key={value + idx}
										style={{
											width: '0.6rem',
											marginRight: '0.1rem',
											height: '100%'
										}}
									>
										<circle
											cx="1"
											cy="1"
											r="0.7"
										/>
									</svg>
								) : (
									''
								);
						  })
						: ''}
				</Box>
			</Box>

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: '25% 25% 25% 25%'
				}}
			>
				{LoginPasswordImages.map((image, idx) => {
					return (
						<Box
							component="img"
							onClick={() => onImageClick(image.value)}
							sx={{
								zIndex: 9999,
								borderRadius: '50px',
								maxWidth: 80,
								flexGrow: 1,
								padding: '0.5rem',
								'&:hover': {
									transform: 'scale(1.1)'
								},
								transition: 'all 0.3s ease-in-out',
								cursor: 'pointer'
							}}
							key={`icon-${idx}`}
							src={image.src}
							alt={image.alt}
						/>
					);
				})}
			</Box>
		</>
	);
}

export default ImagePasswordPad;
