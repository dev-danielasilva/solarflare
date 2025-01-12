export const progressStarsAndMedals = (value: number, baseCount: number = 3) => {
	let valueForEachItem = new Array<0 | 0.5 | 1>(baseCount).fill(0);

	valueForEachItem = valueForEachItem.map((v, i) => {
		const place = i + 1;
		if (value > place || value > place - 0.25) {
			return 1;
		}
		if (value >= place - 0.75 && value <= place - 0.25) {
			return 0.5;
		}

		return 0;
	});

	return valueForEachItem;
};
