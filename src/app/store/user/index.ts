import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';

/**
 * The type definition for a user object.
 */
export type UserType = {
	role: string[];
	data: {
		displayName: string;
		photoURL?: string;
		email?: string;
		shortcuts?: string[];
		settings?: Partial<FuseSettingsConfigType>;
	};
	loginRedirectUrl?: string;
};

export type CourseType = {
	id: string;
	name: string;
	grade: number;
	group: string;
	subject:{
		id: number;
		icon: string;
		name: string;
	};
	message?: string;
};
