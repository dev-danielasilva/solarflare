import i18next from 'i18next';
import { FuseNavigationType } from '@fuse/core/FuseNavigation/types/FuseNavigationType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */

const navigationConfig: FuseNavigationType = [
	{
		id: 'home',
		title: 'Inicio',
		translate: 'Inicio',
		type: 'item',
		icon: 'heroicons-outline:home',
		url: '/'
	},
	{
		id: 'profile',
		title: 'Perfil',
		translate: 'Perfil',
		type: 'item',
		icon: 'heroicons-outline:user'
		// url: '/dashboard'
	},
	{
		id: 'grades',
		title: 'Calificaciones',
		translate: 'Calificaciones',
		type: 'item',
		icon: 'heroicons-outline:chart-bar',
		url: '/grades'
	}
];

export default navigationConfig;
