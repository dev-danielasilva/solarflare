/**
 * The type definition for an avatar object.
 */
export type AvatarType = {
	id: number;
	name: string;
	image: string;
	level: string;
	target_role: {
		id: number;
		name: string;
	};
};

export default AvatarType;
