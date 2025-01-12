import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import es from './i18n/es';

i18next.addResourceBundle('en', 'gradesPage', en);
i18next.addResourceBundle('es', 'gradesPage', es);

const Grades = lazy(() => import('./Grades'));

/**
 * The Profile page config.
 */
const GradesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'grades',
			element: <Grades />
		}
	]
};

export default GradesConfig;
