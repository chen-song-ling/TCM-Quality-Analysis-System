import { configureStore } from '@reduxjs/toolkit';
import globalSlice from '../slices/globalSlice';
import projectSlice from '../slices/projectSlice';
import characterSlice from '../slices/characterSlice';

export default configureStore({
    reducer: {
        global: globalSlice,
        project: projectSlice,
        character: characterSlice,
    }
});
