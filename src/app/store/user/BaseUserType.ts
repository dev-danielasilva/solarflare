import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import AvatarType from 'src/app/main/types/AvatarType';
import RoleType from 'src/app/main/types/RoleType';
import TenantType from 'src/app/main/types/TenantType';

/**
 * The type definition for a user object.
 */
export type BaseUserType = {
	tenant?: TenantType;
	id?: number;
	first_name?: string;
	middle_name?: string;
	last_name?: string;
	email_address?: string;
	username?: string;
	password?: string;
	active?: boolean;
	avatar?: AvatarType;
	role?: RoleType | string | string[] | null;
	is_demo?: boolean;
	loginRedirectUrl?: string;
	data: {
		displayName: string;
		photoURL: string;
		email: string;
		shortcuts: string[];
		settings?: Partial<FuseSettingsConfigType>;
	};
};

export default BaseUserType;
