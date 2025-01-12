import { Box } from '@mui/material';

interface MedalProgressSvgProps {
	value: 0 | 0.5 | 1;
	color: string;
	width?: string;
}

function MedalProgressSvg({ value, color, width = '100%' }: MedalProgressSvgProps) {
	return (
		<Box
			component="svg"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			// xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			viewBox="0 0 23 30"
			// style="enable-background:new 0 0 23 30;"
			// xml:space="preserve"
			sx={{ width, mx: 0.25 }}
		>
			{value === 1 && (
				<g id="full">
					<polygon
						style={{ fill: color }}
						points="3.3,0.7 1.7,2.2 2.4,4.1 3.6,5.2 4.2,8.9 4.6,11 6.2,13 2.8,18.9 3.2,22.9 6.5,27.6 10.8,29.2 
                    14.9,28.8 19.7,25.1 20.8,21.2 20.8,17.8 18.8,14.2 17.7,12.6 19.7,9.6 19.6,4.6 22.1,3.5 22.1,1.6 20.5,0.7 	"
					/>
				</g>
			)}
			{value === 0.5 && (
				<g id="half">
					<polygon
						style={{ fill: color }}
						points="11.9,0.7 12,29.2 5.9,26.9 2.8,21.5 3.6,16.5 5.9,13.3 4.9,11.2 4,8.5 4.2,4.6 2,4 1.7,2.1 2.7,0.7 	
                    "
					/>
				</g>
			)}
			<g id="Layer_1">
				<path
					style={{ fill: '#262626' }}
					d="M11.9,0c2.8,0,5.6,0,8.5,0c1.2,0,2.2,0.7,2.5,1.8c0.3,1,0,2.1-0.9,2.8C21.7,4.8,21.5,5,21.2,5
		c-0.7,0.1-0.9,0.4-0.8,1c0.1,0.8,0,1.5,0,2.3c0.1,1.5-0.3,2.8-1.4,3.9c-0.5,0.5-0.5,0.8,0,1.4c2.9,3,3.5,7.6,1.5,11.3
		c-2.1,3.8-6.3,5.8-10.5,4.9c-4.1-0.8-7.4-4.2-7.9-8.3c-0.4-3.1,0.5-5.8,2.7-8.1c0.4-0.4,0.5-0.7,0-1.1c-1.2-1.1-1.7-2.5-1.5-4.2
		c0.1-0.5,0-1,0-1.4c0.1-0.9,0-1.6-1.1-1.9C1.1,4.5,0.5,3.2,0.8,2.1C1,0.8,2,0,3.4,0C6.2,0,9.1,0,11.9,0L11.9,0z M11.8,28.4
		c4.6,0,8.2-3.6,8.3-8.1c0-4.5-3.7-8.2-8.2-8.2c-4.5,0-8.2,3.6-8.2,8.1C3.6,24.7,7.3,28.3,11.8,28.4L11.8,28.4z M11.9,1.6
		c-2.8,0-5.6,0-8.4,0c-0.7,0-1.1,0.3-1.1,1c0,0.7,0.4,0.9,1.1,0.9c5.6,0,11.2,0,16.8,0c0.5,0,0.8-0.1,1-0.6c0.3-0.7-0.2-1.3-1-1.3
		C17.5,1.6,14.7,1.6,11.9,1.6L11.9,1.6z M8.7,8.1c0-0.8,0-1.6,0-2.4c0-0.4-0.1-0.5-0.5-0.5c-0.9,0-1.8,0-2.7,0
		C5,5.1,4.9,5.3,4.9,5.7c0,1.2,0,2.4,0,3.6c0,1.2,0.9,1.8,1.6,2.5c0.4,0.4,0.9-0.4,1.4-0.5c0.1,0,0.1-0.1,0.2-0.1
		c0.5-0.1,0.6-0.4,0.6-0.9C8.6,9.6,8.7,8.9,8.7,8.1z M15.3,8.1c0,0.5,0.1,1,0,1.5c-0.2,1,0.1,1.8,1.2,2c0.2,0.1,0.5,0.4,0.6,0.2
		c0.6-0.7,1.5-1.3,1.6-2.3c0.1-1.3,0-2.7,0-4c0-0.3-0.1-0.4-0.4-0.4c-0.9,0-1.7,0-2.6,0c-0.3,0-0.4,0.1-0.4,0.4
		C15.3,6.4,15.3,7.3,15.3,8.1L15.3,8.1z M13.7,7.9c0-0.7,0-1.5,0-2.2c0-0.3-0.1-0.5-0.5-0.5c-0.8,0-1.7,0-2.5,0
		c-0.3,0-0.5,0.1-0.5,0.4c0,1.5,0,3.1,0,4.6c0,0.3,0.1,0.4,0.4,0.4c0.9-0.1,1.7-0.1,2.6,0.1c0.4,0.1,0.4-0.2,0.4-0.4
		C13.7,9.4,13.7,8.6,13.7,7.9z"
				/>
				<path
					style={{ fill: '#262626' }}
					d="M11.8,25.5c-3,0-5.3-2.3-5.3-5.3c0-2.9,2.4-5.2,5.4-5.2c2.9,0,5.3,2.4,5.3,5.3C17.2,23.1,14.8,25.5,11.8,25.5z
		 M15.5,20.2c0-2-1.6-3.6-3.7-3.6c-2,0-3.7,1.6-3.7,3.7c0,2,1.7,3.6,3.7,3.7C13.8,23.9,15.5,22.2,15.5,20.2z"
				/>
			</g>
		</Box>
	);
}

export default MedalProgressSvg;