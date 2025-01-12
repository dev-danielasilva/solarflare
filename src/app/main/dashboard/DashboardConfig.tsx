// import i18next from 'i18next';
import { lazy } from 'react';
// import en from './i18n/en';
// import tr from './i18n/tr';
// import ar from './i18n/ar';

// i18next.addResourceBundle('en', 'dashboardPage', en);
// i18next.addResourceBundle('tr', 'dashboardPage', tr);
// i18next.addResourceBundle('ar', 'dashboardPage', ar);

const Dashboard = lazy(() => import('./Dashboard'));

/**
 * The Example page config.
 */
const DashboardConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'dashboard',
			element: <Dashboard />
		}
	]
};

export default DashboardConfig;
