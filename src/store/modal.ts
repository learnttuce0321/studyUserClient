import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export enum ModalState {
    CHECK_SCHEDULE = 'CHECK_SCHEDULE',
    ADD_ATTENDANCE = 'ADD_ATTENDANCE',
    DELETE_ATTENDANCE = 'DELETE_ATTENDANCE',
    MODIFY_ATTENDANCE = 'MODIFY_ATTENDANCE',
    ADD_MESSAGE = 'ADD_MESSAGE',
    CHECK_MESSAGE = 'CHECK_MESSAGE',
    ADD_USER = 'ADD_USER',
    FILTER_USER = 'FILTER_USER',
    ADD_ASSIGNMNET = 'ADD_ASSIGNMNET',
    DELETE_ASSIGNMNET = 'ADD_ASSIGNMENT',
    MODIFY_ASSIGNMENT = 'MODIFY_ASSIGNMENT',
    CHECK_ASSIGNMENT = 'CHECK_ASSIGNMENT',
    ADD_FINE = 'ADD_FINE',
    DELETE_FINE = 'DELETE_FINE',
    MODIFY_FINE = 'MODIFY_FINE',
    ADD_STUDY = 'ADD_STUDY',
    DELETE_STUDY = 'DELETE_STUDY',
    NONE = ''
}

interface Modal {
    type: ModalState
}

export interface ModalPayload {
    type: ModalState
}

const initialState: Modal = { type: ModalState.NONE }

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    // set modal-state
    reducers: {
        setModalState(state, action: PayloadAction<{type: ModalState}>) {
            const { type } = action.payload

            return { type }
        }
    }
})

export const modalActions = modalSlice.actions
export default modalSlice.reducer