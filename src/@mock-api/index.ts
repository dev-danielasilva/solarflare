// This file should be imported at App.tsx is you want to enable this mock API

/* eslint-disable import/no-import-module-exports */
import history from '@history';
import mock from './mock';

// Import API modules
import './api/auth-api';
import './api/notifications-api';

// Used to validate as process.env.NODE_ENV === 'development'
if (process.env.REACT_APP_ENV === 'dev') {
	import('./api/auth-api').then(() => {
		mock.onAny().passThrough();
	});
	import('./api/notifications-api').then(() => {});
}

mock.onAny().passThrough();

// If the module is hot, redirect to the loading page and then back to the current page
if (module?.hot?.status() === 'apply') {
	const { pathname } = history.location;
	history.push('/loading');
	history.push({ pathname });
}
