/**
 * Configuration object containing the authentication service API endpoints
 */
const jwtServiceConfig = {
	signIn: 'api/auth/sign-in',
	signUp: 'api/auth/sign-up',
	accessToken: 'api/auth/access-token',
	updateUser: 'api/auth/user/update',
	loginIn: 'v1/auth/login',
	verifyToken: 'v1/auth/login/verify/',
	getCourses: 'v1/courses/'
};

export default jwtServiceConfig;
