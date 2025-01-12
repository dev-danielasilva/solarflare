/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { AppDispatchType, RootStateType } from 'app/store/types';
// eslint-disable-next-line unused-imports/no-unused-imports
import { UserType } from 'app/store/user';
import { PartialDeep } from 'type-fest';
import { AxiosError } from 'axios/index';
import themesConfig from 'app/configs/themesConfig';
import jwtService from '../../auth/services/jwtService';
import definitionService from '../../services/definitionService';
import createAppAsyncThunk from '../createAppAsyncThunk';
import BaseUserType from './BaseUserType';

type AppRootStateType = RootStateType<userSliceType>;

/**
 * Sets the user data in the Redux store and updates the login redirect URL if provided.
 */
export const setUser = createAsyncThunk('user/setUser', (user: BaseUserType) => {
	/*
    You can redirect the logged-in user to a specific route depending on his role
    */
	if (user.loginRedirectUrl) {
		settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
	}

	// --> Sets the background image and color on login
	definitionService.setBackground(user);

	return Promise.resolve(user);
});

/**
 * Updates the user's settings in the Redux store and returns the updated user object.
 */
export const updateUserSettings = createAppAsyncThunk(
	'user/updateSettings',
	async (settings: FuseSettingsConfigType, { dispatch, rejectWithValue, getState }) => {
		const AppState = getState() as AppRootStateType;
		const { user } = AppState;

		const isUserGuest = selectIsUserGuest(AppState);

		if (isUserGuest) {
			return null;
		}

		const userRequestData = { data: { ...user.data, settings } } as BaseUserType;

		try {
			const response = await jwtService.updateUserData(userRequestData);

			dispatch(showMessage({ message: 'User settings saved with api' }));

			return response.data as BaseUserType;
		} catch (error) {
			const axiosError = error as AxiosError;

			dispatch(showMessage({ message: axiosError.message }));

			return rejectWithValue(axiosError.message);
		}
	}
);

/**
 * Updates the user's shortcuts in the Redux store and returns the updated user object.
 */
export const updateUserShortcuts = createAppAsyncThunk(
	'user/updateShortucts',
	async (shortcuts: string[], { dispatch, getState, rejectWithValue }) => {
		const AppState = getState() as AppRootStateType;
		const { user } = AppState;

		const isUserGuest = selectIsUserGuest(AppState);

		if (isUserGuest) {
			return null;
		}

		const userRequestData = {
			data: { ...user.data, shortcuts }
		} as PartialDeep<BaseUserType>;

		try {
			const response = await jwtService.updateUserData(userRequestData);

			dispatch(showMessage({ message: 'User shortcuts saved with api' }));

			return response.data as BaseUserType;
		} catch (error) {
			const axiosError = error as AxiosError;

			dispatch(showMessage({ message: axiosError.message }));

			return rejectWithValue(axiosError.message);
		}
	}
);

/**
 * Logs the user out and resets the Redux store.
 */
export const logoutUser = () => async (dispatch: AppDispatchType, getState: () => RootStateType) => {
	// console.log('Logout user')
	const AppState = getState() as AppRootStateType;

	const isUserGuest = selectIsUserGuest(AppState);

	if (isUserGuest) {
		return null;
	}

	history.push({
		pathname: '/'
	});

	// --> Removes the image and color background on logout
	document.body.style.backgroundImage = '';
	document.body.style.backgroundColor = themesConfig.default.palette.background.default;

	dispatch(setInitialSettings());

	return Promise.resolve(dispatch(userLoggedOut()));
};

/**
 * Updates the user's data in the Redux store and returns the updated user object.
 */
export const updateUserData = createAppAsyncThunk<BaseUserType, PartialDeep<BaseUserType>>(
	'user/update',
	async (userRequestData, { dispatch, rejectWithValue, getState }) => {
		const AppState = getState() as AppRootStateType;

		const isUserGuest = selectIsUserGuest(AppState);

		if (isUserGuest) {
			return null;
		}

		try {
			const response = await jwtService.updateUserData(userRequestData);

			dispatch(showMessage({ message: 'User data saved with api' }));

			return response.data as BaseUserType;
		} catch (error) {
			const axiosError = error as AxiosError;

			dispatch(showMessage({ message: axiosError.message }));

			return rejectWithValue(axiosError.message);
		}
	}
);

/**
 * The initial state of the user slice.
 */
const initialState: BaseUserType = {
	role: [], // guest
	data: {
		displayName: 'John Doe',
		photoURL: 'assets/images/avatars/brian-hughes.jpg',
		email: 'johndoe@withinpixels.com',
		shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks']
	}
};

/**
 * The User slice
 */
export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		userLoggedOut: () => initialState
	},
	extraReducers: (builder) => {
		builder
			.addCase(setUser.fulfilled, (state, action) => action.payload)
			.addCase(updateUserData.fulfilled, (state, action) => action.payload)
			.addCase(updateUserShortcuts.fulfilled, (state, action) => {
				state.data.shortcuts = action.payload.data.shortcuts;
			})
			.addCase(updateUserSettings.fulfilled, (state, action) => {
				state.data.settings = action.payload.data.settings;
			});
	}
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = (state: AppRootStateType) => state.user;

export const selectUserRole = (state: AppRootStateType) => state.user.role;

export const selectIsUserGuest = (state: AppRootStateType) => {
	const { role } = state.user;

	return !role || (role as string[]).length === 0;
};

export const selectUserShortcuts = (state: AppRootStateType) => state.user.data.shortcuts;

export type userSliceType = typeof userSlice;

export default userSlice.reducer;
