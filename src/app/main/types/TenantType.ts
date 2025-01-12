import LicenceType from './LicenceType';

export type TenantType = {
	id: number;
	name: string;
	license: LicenceType;
	definition: any;
	max_grade: number;
};

export default TenantType;
