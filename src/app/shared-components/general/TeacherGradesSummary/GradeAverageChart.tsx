import { Box, Paper, Typography, styled } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import { selectUser } from 'app/store/user/userSlice';
// import ReactApexChart from 'react-apexcharts';
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux/es/exports';
import { Link } from 'react-router-dom';

interface GradeAverageChartProps {
	grade?: number;
	subject: any;
	color: string;
	bgcolor: string;
	courseId: number;
}

const GradesChart = styled(Chart)<any>(({ color }) => ({
	'& #apexcharts-radialbarTrack-0':{
		stroke: color ? color : '#43B2AE',
		opacity: 0.3
	},
	'& .apexcharts-canvas': {
		marginTop: -10
	}
}));

export default function GradeAverageChart({ courseId, grade, subject, color, bgcolor }: GradeAverageChartProps) {
	const user = useSelector(selectUser);
	const gradePercentage: number = (grade * 100) / user.tenant.max_grade;

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				speed: 400,
				animateGradually: {
					enabled: false
				}
			},
			fontFamily: 'sofia-pro-soft',
			foreColor: 'inherit',
			height: '100%',
			type: 'donut',
			sparkline: {
				enabled: true
			}
		},
		states:{
			hover: {
				filter: {
					type: 'none',
				}
			},
			active: {
				filter: {
					type: 'none',
				}
			}
		},
		colors: [color],
		labels: [`${grade || '-'}/${user.tenant.max_grade}`],
		plotOptions: {
			radialBar: {
				hollow: {
					margin: 15,
					size: '55%'
				},

				dataLabels: {
					name: {
						offsetY: 5,
						show: true,
						color: '#000',
						fontSize: '15px'
					},
					value: {
						show: false
					}
				}
			}
		}
	};

	return (
		<Link to={`/courses/${courseId}/subjects/${subject.id}`} style={{ textDecoration: 'none' }}>
			<Paper
			elevation={0}
			className="course-chart-wrapper"
			sx={{
				backgroundColor: bgcolor ? bgcolor : '#E5F3F2',
				width: '170px',
				height: '200px',
				padding: '5px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				'& :hover': {
					boxShadow: 'none'
				}
			}}
		>
			<GradesChart
				options={chartOptions}
				series={[gradePercentage]}
				type="radialBar"
				color={color}
			/>
			<Typography
				variant="body1"
				textAlign="center"
			>
				{subject?.name}
			</Typography>
		</Paper>
		</Link>
	);
}
