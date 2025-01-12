import FuseUtils from '@fuse/utils/FuseUtils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import UserType from 'app/store/user/UserType';
import { PartialDeep } from 'type-fest';
import BaseUserType from 'app/store/user/BaseUserType';
import TenantType from 'src/app/main/types/TenantType';
import RoleType from 'src/app/main/types/RoleType';
import jwtServiceConfig from './jwtServiceConfig';
/* eslint-disable camelcase, class-methods-use-this */

/**
 * The JwtService class is a utility class for handling JSON Web Tokens (JWTs) in the Fuse application.
 * It provides methods for initializing the service, setting interceptors, and handling authentication.
 */
class JwtService extends FuseUtils.EventEmitter {
	/**
	 * Initializes the JwtService by setting interceptors and handling authentication.
	 */
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	/**
	 * Sets the interceptors for the Axios instance.
	 */
	setInterceptors = () => {
		axios.interceptors.response.use(
			(response: AxiosResponse<unknown>) => response,
			(err: AxiosError) =>
				new Promise(() => {
					if (err?.response?.status === 403 && err.config) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						_setSession(null);
					}
					throw err;
				})
		);
	};

	/**
	 * Handles authentication by checking for a valid access token and emitting events based on the result.
	 */
	handleAuthentication = () => {
		const access_token = getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (isAuthTokenValid(access_token)) {
			_setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			_setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	/**
	 * Creates a new user account.
	 */
	createUser = (data: {
		displayName: UserType['data']['displayName'];
		password: string;
		email: UserType['data']['email'];
	}) =>
		new Promise((resolve, reject) => {
			axios.post(jwtServiceConfig.signUp, data).then(
				(
					response: AxiosResponse<{
						user: UserType;
						access_token: string;
						error?: {
							type: 'email' | 'password' | `root.${string}` | 'root';
							message: string;
						}[];
					}>
				) => {
					if (response.data.user) {
						_setSession(response.data.access_token);
						resolve(response.data.user);
						this.emit('onLogin', response.data.user);
					} else {
						reject(response.data.error);
					}
				}
			);
		});

	/**
	 * Signs in with the provided email and password.
	 */
	signInWithEmailAndPassword = (email: string, password: string) =>
		new Promise((resolve, reject) => {
			axios
				.get(jwtServiceConfig.signIn, {
					data: {
						email,
						password
					}
				})
				.then(
					(
						response: AxiosResponse<{
							user: UserType;
							access_token: string;
							error?: {
								type: 'email' | 'password' | `root.${string}` | 'root';
								message: string;
							}[];
						}>
					) => {
						if (response.data.user) {
							_setSession(response.data.access_token);
							this.emit('onLogin', response.data.user);
							resolve(response.data.user);
						} else {
							reject(response.data.error);
						}
					}
				);
		});

	/**
	 * Signs in with the provided email and password.
	 */
	getCourses = () =>
		new Promise((resolve, reject) => {
			const access_token = getAccessToken();
			const headers = { Authorization: `Bearer ${access_token}` };
			axios.get(`${jwtServiceConfig.getCourses}?expand=subject`, { headers }).then((response) => {
				if (response?.data?.length > 0) {
					resolve(response.data);
				} else {
					resolve(response?.data?.message);
				}
			});
		});

	/**
	 * Signs in with the provided email and password.
	 */
	getGradesSummary = (courseid, uid?) =>
		new Promise((resolve, reject) => {
			const access_token = getAccessToken();
			const headers = { Authorization: `Bearer ${access_token}` };
			const endpoint = uid
				? `/v1/courses/${courseid}/grades/summary/?uid=${uid}`
				: `/v1/courses/${courseid}/grades/summary/`;
			axios
				.get(endpoint, { headers })
				.then((response) => {
					if (response.data.id) {
						resolve(response.data);
					} else {
						reject(response.data.message);
					}
				})
				.catch((e) => {
					reject(e);
				});
		});

	getCourse = (courseid) =>
		new Promise((resolve, reject) => {
			const access_token = getAccessToken();
			const headers = { Authorization: `Bearer ${access_token}` };
			axios
				.get(`/v1/courses/${courseid}/?expand=subject.topics.sessions`, { headers })
				.then((response) => {
					if (response.data.id) {
						resolve(response.data);
					} else {
						reject(response);
					}
				})
				.catch((e) => {
					reject(e);
				});
		});

	updateTopic = (topicid: number, payload: any, courseid: string) =>
		new Promise((resolve, reject) => {
			axios
				.put(`/v1/courses/${courseid}/topics/${topicid}/`, payload)
				.then((response) => {
					if (response.data.id) {
						resolve(response);
					} else {
						reject(response);
					}
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					}
				});
		});

	createTopic = (courseid, subjectid, topic) =>
		new Promise((resolve, reject) => {
			axios
				.post(`v1/courses/${courseid}/topics/`, topic)
				.then((response) => {
					if (response.data.topic_data) {
						resolve(response.data.topic_data);
					} else {
						reject(response);
					}
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					}
				});
		});

	createTodo = (courseid, sessionid, todo) =>
		new Promise((resolve, reject) => {
			axios
				.post(`v1/courses/${courseid}/sessions/${sessionid}/session_items/`, todo)
				.then((response) => {
					if (response.data.session_item_data) {
						resolve(response.data.session_item_data);
					} else {
						reject(response);
					}
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					} else {
						reject(e);
					}
				});
		});

	updateTodo = (courseid, todoid, todo) =>
		new Promise((resolve, reject) => {
			axios
				.put(`v1/courses/${courseid}/session_items/${todoid}/update/`, todo)
				.then((response) => {
					if (response.data.id) {
						resolve(response.data);
					} else {
						reject(response);
					}
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					} else {
						reject(e);
					}
				});
		});

	updateTodoUser = (courseid, todoid, todo) =>
		new Promise((resolve, reject) => {
			axios
				.put(`v1/courses/${courseid}/session_items/${todoid}/user/`, todo)
				.then((response) => {
					if (response.data.id) {
						resolve(response.data);
					} else {
						reject(response);
					}
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					} else {
						reject(e);
					}
				});
		});

	getTopic = (courseid, topicid) =>
		new Promise((resolve, reject) => {
			axios
				.get(`v1/courses/${courseid}/topics/${topicid}/user`)
				.then((response) => {
					if (response.data.id) {
						resolve(response.data);
					} else {
						reject(response);
					}
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					} else {
						reject(e);
					}
				});
		});

	getSession = (courseid, topicid, sessionid) =>
		new Promise((resolve, reject) => {
			axios
				.get(`v1/courses/${courseid}/topics/${topicid}/sessions/${sessionid}`)
				.then((response) => {
					if (response.data.id) {
						resolve(response.data);
					} else {
						reject(response);
					}
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					}
				});
		});

	getSessionItem = (courseid, todoid, role) =>
		new Promise((resolve, reject) => {
			let endpoint = `v1/courses/${courseid}/session_items/${todoid}/`;

			if (role === 'student') {
				endpoint += 'user';
			}

			axios
				.get(endpoint)
				.then((response) => {
					if (response.data.id) {
						resolve(response.data);
					} else {
						reject(response);
					}
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					} else {
						reject(e);
					}
				});
		});

	getSubmissions = (courseid, todoid) =>
		new Promise((resolve, reject) => {
			axios
				.get(`/v1/courses/${courseid}/session_items/${todoid}/submissions`)
				.then((response) => {
					if (!response.data.message) {
						resolve(response.data);
					} else {
						reject(response);
					}
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					} else {
						reject(e);
					}
				});
		});

	updateGrades = (scores) =>
		new Promise((resolve, reject) => {
			axios
				.post(`/v1/todo/score`, scores)
				.then((response) => {
					resolve(response.data);
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					}
				});
		});

	updateQuizTodo = (courseid, todoid, quizFormData) =>
		new Promise((resolve, reject) => {
			axios
				.put(`v1/courses/${courseid}/session_items/${todoid}/quiz/`, quizFormData)
				.then((response) => {
					resolve(response.data);
				})
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						this.logout();
						reject(new Error('Token expired.'));
					} else {
						reject(e);
					}
				});
		});

	/**
	 * Sends request to log in user.
	 */
	clientLogin = (username: string, password: string) => {
		// axios.defaults.baseURL = 'https://greenhatmx.com'

		return new Promise((resolve, reject) => {
			axios({
				method: 'post', // or 'get', 'put', 'delete', etc.
				url: '/dv/gh-valida.php',
				baseURL: 'https://greenhatmx.com', // Override baseURL here
				data: {
					usr: username,
					pwd: password
				}
			})
				.then(
					(
						response: AxiosResponse<{
							schoolNumber: string;
							schoolName: string;
							firstName: string;
							lastName: string;
							lastNameExtended: string;
							email: string;
							isActive: boolean;
							userType: string;
							gradesGroups: string;
							productName: string;
							productCode: string;
							productType: string;
							Grupos: string[];
							success: boolean;
						}>
					) => {
						resolve(response);
					}
				)
				.catch((e: AxiosError) => {
					console.error('Error on client login ', e);
					resolve({
						success: false
					});
				});
		});
	};

	/**
	 * Sends request to log in user.
	 */
	logInWithUserProfile = (userprofile) =>
		new Promise((resolve, reject) => {
			axios
				.post(jwtServiceConfig.loginIn, userprofile)
				.then(
					(
						response: AxiosResponse<{
							user: BaseUserType;
							tenant: TenantType;
							access: {
								access_token: string;
								refresh_token: string;
							};
							message?: string;
						}>
					) => {
						if (response.data.user) {
							const { user } = response.data;
							user.role = (user.role as RoleType).name.toLocaleLowerCase();
							user.tenant = response.data.tenant;
							const accessToken: string = response?.data?.access?.access_token || '';
							_setSession(accessToken);
							this.emit('onLogin', response.data.user);
							resolve(response.data.user);
						} else {
							reject(response.data.message);
						}
					}
				)
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						reject(new Error('¡Vaya! Parece que ese usuario y contraseña no coinciden. Prueba de nuevo.'));
					} else {
						reject(
							new Error('Hubo un problema iniciando sesión. Por favor, inténtalo de nuevo más tarde.')
						);
					}
				});
		});

	/**
	 * Sends request to log in user.
	 */
	logInWithUsernameAndPassword = (username: string, password: string) =>
		new Promise((resolve, reject) => {
			axios
				.post(jwtServiceConfig.loginIn, {
					username,
					password
				})
				.then(
					(
						response: AxiosResponse<{
							user: BaseUserType;
							tenant: TenantType;
							access: {
								access_token: string;
								refresh_token: string;
							};
							message?: string;
						}>
					) => {
						if (response.data.user) {
							const { user } = response.data;
							user.role = (user.role as RoleType).name.toLocaleLowerCase();
							user.tenant = response.data.tenant;
							const accessToken: string = response?.data?.access?.access_token || '';
							_setSession(accessToken);
							this.emit('onLogin', response.data.user);
							resolve(response.data.user);
						} else {
							reject(response.data.message);
						}
					}
				)
				.catch((e: AxiosError) => {
					if (e?.response?.status === 403) {
						reject(new Error('¡Vaya! Parece que ese usuario y contraseña no coinciden. Prueba de nuevo.'));
					} else {
						reject(
							new Error('Hubo un problema iniciando sesión. Por favor, inténtalo de nuevo más tarde.')
						);
					}
				});
		});

	/**
	 * Verifies that token is still valid
	 */
	verifyToken = () =>
		new Promise<BaseUserType>((resolve, reject) => {
			axios
				.post(`${jwtServiceConfig.verifyToken}?expand=user.role&user.avatar&tenant.license`, {
					token: getAccessToken()
				})
				.then(
					(
						response: AxiosResponse<{
							user: BaseUserType;
							tenant: TenantType;
							access: {
								access_token: string;
								refresh_token: string;
							};
							message?: string;
						}>
					) => {
						const { user } = response.data;
						user.role = (user.role as RoleType).name.toLocaleLowerCase();
						user.tenant = response.data.tenant;
						const accessToken: string = response?.data?.access?.access_token || '';
						_setSession(accessToken);
						resolve(response.data.user);
					}
				)
				.catch(() => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});

	/**
	 * Signs in with the provided provider.
	 */
	signInWithToken = () =>
		new Promise<UserType>((resolve, reject) => {
			axios
				.get(jwtServiceConfig.accessToken, {
					data: {
						access_token: getAccessToken()
					}
				})
				.then((response: AxiosResponse<{ user: UserType; access_token: string }>) => {
					if (response.data.user) {
						_setSession(response.data.access_token);
						resolve(response.data.user);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(() => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});

	/**
	 * Updates the user data.
	 */
	updateUserData = (user: PartialDeep<BaseUserType>) =>
		axios.post(jwtServiceConfig.updateUser, {
			user
		});

	clearExamCache() {
		// window.localStorage.removeItem('exam')
		// window.localStorage.removeItem('examprogress')
	}

	/**
	 * Signs out the user.
	 */
	logout = () => {
		_setSession(null);
		this.emit('onLogout', 'Logged out');
	};
}

/**
 * Sets the session by storing the access token in the local storage and setting the default authorization header.
 */
function _setSession(access_token: string | null) {
	if (access_token) {
		setAccessToken(access_token);
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	} else {
		removeAccessToken();
		clearExamCache(); // To remove the exam responses from cache
		delete axios.defaults.headers.common.Authorization;
	}
}

/**
 * Checks if the access token is valid.
 */
function isAuthTokenValid(access_token: string) {
	if (!access_token) {
		return false;
	}
	const decoded = jwtDecode<JwtPayload>(access_token);
	const currentTime = Date.now() / 1000;

	if (decoded.exp < currentTime) {
		// eslint-disable-next-line no-console
		console.warn('access token expired');
		return false;
	}

	return true;
}

/**
 * Gets the access token from the local storage.
 */
function getAccessToken() {
	return window.localStorage.getItem('jwt_access_token');
}

/**
 * Sets the access token in the local storage.
 */
function setAccessToken(access_token: string) {
	return window.localStorage.setItem('jwt_access_token', access_token);
}

/**
 * Removes the access token from the local storage.
 */
function removeAccessToken() {
	return window.localStorage.removeItem('jwt_access_token');
}

/**
 * Removes the access token from the local storage.
 */
function clearExamCache() {
	window.localStorage.removeItem('exam');
	// window.localStorage.removeItem('examprogress');
	window.localStorage.clear();
}

const instance = new JwtService();

export default instance;
