import PublisherType from './PublisherType';

export type LicenseType = {
	id: number;
	name: string;
	definition: string;
	publisher: PublisherType;
	type: 'standard' | 'premium';
};

export default LicenseType;
