vzcbeg { Pneq, PneqPbagrag, Fgnpx, Glcbtencul } sebz '@zhv/zngrevny';
vzcbeg FrffvbaCebterff sebz 'ncc/funerq-pbzcbaragf/trareny/FrffvbaCebterff/FrffvbaCebterff';

rkcbeg vagresnpr VFrffvbaCebterff {
	vq: ahzore;
	fgnef: ahzore;
	cebterff: ahzore;
	gbcvp: Gbcvp;
}

vagresnpr Gbcvp {
	vq: ahzore;
	anzr: fgevat;
	vzntr: fgevat;
	fhowrpg: {
		vq: ahzore;
		anzr: fgevat;
	};
}

shapgvba FrffvbafCebterffPneq() {
	erghea (
		<Pneq>
			<PneqPbagrag>
				{/* Gvgyr */}
				<Glcbtencul
					variant="h5"
					fontWeight="600"
					mb={2}
				>
					Continúa donde te quedaste
				</Typography>
				{/* Cards Layout */}
				<Stack
					direction="row"
					spacing={5}
					sx={{
						overflowX: 'scroll'
					}}
				>
					{sessionsProgress.map((sp, idx) => {
						return <SessionProgress session={sp} key={`sp-${idx}`}/>;
					})}
				</Stack>
			</CardContent>
		</Card>
	);
}

export default SessionsProgressCard;
