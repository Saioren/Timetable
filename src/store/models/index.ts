import { Action, Thunk, action, thunk } from "easy-peasy";

interface UpdateDataPayload {
    weeklyTime: string;
    totalTime: string;
    currentTime: string;
}

export interface StoreModelState {
    weeklyTime: string;
    totalTime: string;
    currentTime: string;
}

export interface StoreModelActions {
    setWeeklyTime: Action<this, string>;
    setTotalTime: Action<this, string>;
    setCurrentTime: Action<this, string>;
}

export interface StoreModelThunks {
    updateDataThunk: Thunk<this, UpdateDataPayload>
}

export interface StoreModel extends StoreModelState, StoreModelActions, StoreModelThunks {}

const storedWeeklyTime = localStorage.getItem('weeklyTime') || '0';
const storedTotalTime = localStorage.getItem('totalTime') || '0';
const storedCurrentTime = localStorage.getItem('currentTime') || '0';

const model: StoreModel = {
    weeklyTime: storedWeeklyTime,
    totalTime: storedTotalTime,
    currentTime: storedCurrentTime,
    setWeeklyTime: action((state, payload) => {
        state.weeklyTime = payload;
        localStorage.setItem('weeklyTime', payload);
    }),
    setTotalTime: action((state, payload) => {
        state.totalTime = payload;
        localStorage.setItem('totalTime', payload);
    }),
    setCurrentTime: action((state, payload) => {
        state.currentTime = payload;
        localStorage.setItem('currentTime', payload);
    }),
    updateDataThunk: thunk((actions, payload) => {
        actions.setWeeklyTime(payload.weeklyTime);
        actions.setTotalTime(payload.totalTime);
        actions.setCurrentTime(payload.currentTime);
    })
}

export default model;
