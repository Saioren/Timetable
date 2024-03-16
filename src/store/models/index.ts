import { Action, Thunk, action, thunk } from "easy-peasy";

interface UpdateDataPayload {
    name: string;
    course: string;
}

export interface StoreModelState {
    name: string;
    course: string;
}

export interface StoreModelActions {
    setName: Action<this, string>;
    setCourse: Action<this, string>;
}

export interface StoreModelThunks {
    updateDataThunk: Thunk<this, UpdateDataPayload>
}

export interface StoreModel extends StoreModelState, StoreModelActions, StoreModelThunks {}

const storedName = localStorage.getItem('name') || 'evan';
const storedCourse = localStorage.getItem('course') || 'learn ez';

const model: StoreModel = {
    name: storedName,
    course: storedCourse,
    setName: action((state, payload) => {
        state.name = payload;
        localStorage.setItem('name', payload);
    }),
    setCourse: action((state, payload) => {
        state.course = payload;
        localStorage.setItem('course', payload);
    }),
    updateDataThunk: thunk((actions, payload) => {
        actions.setName(payload.name)
        actions.setCourse(payload.course)
    })
}

export default model;