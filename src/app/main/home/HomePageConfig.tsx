import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
// import Dashboard from '';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const Dashboard = lazy(() => import('../dashboard/Dashboard'));

/**
 * The Example page config.
 */
const HomeConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/',
			element: <Dashboard />
		}
	]
};

export default HomeConfig;
