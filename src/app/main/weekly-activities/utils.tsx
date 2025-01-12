export const getWeekBounds = (date = new Date()) => {
	// Clone the input date to avoid modifying the original
	const inputDate = new Date(date);

	// Get the current day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
	const dayOfWeek = inputDate.getDay();

	// Calculate the first day of the week (Sunday)
	const firstDay = new Date(inputDate);
	firstDay.setDate(inputDate.getDate() - dayOfWeek);

	// Calculate the last day of the week (Saturday)
	const lastDay = new Date(inputDate);
	lastDay.setDate(inputDate.getDate() + (6 - dayOfWeek));

	// Return an object with the first and last days
	return {
		firstDay,
		lastDay
	};
};

export const getMonthOrDay = (type: 'month' | 'dayOfWeek', num: number) => {
	if (type === 'month') {
		switch (num) {
			case 1:
				return 'Enero';
			case 2:
				return 'Febrero';
			case 3:
				return 'Marzo';
			case 4:
				return 'Abril';
			case 5:
				return 'Mayo';
			case 6:
				return 'Junio';
			case 7:
				return 'Julio';
			case 8:
				return 'Agosto';
			case 9:
				return 'Septiembre';
			case 10:
				return 'Octubre';
			case 11:
				return 'Noviembre';
			case 12:
				return 'Diciembre';
			default:
				return '-';
		}
	} else {
		switch (num) {
			case 0:
				return 'Domingo';
			case 1:
				return 'Lunes';
			case 2:
				return 'Martes';
			case 3:
				return 'Miércoles';
			case 4:
				return 'Jueves';
			case 5:
				return 'Viernes';
			case 6:
				return 'Sábado';
			default:
				return '-';
		}
	}
};
