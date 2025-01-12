import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const TodoPageActivity = lazy(() => import('./TodoPageActivity'));

/**
 * The Example page config.
 */
const TodoPageActivityConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/courses/:courseid/subjects/:subjectid/topics/:topicid/todos/:todoid/activity',
			element: <TodoPageActivity />
		}
	]
};

export default TodoPageActivityConfig;
