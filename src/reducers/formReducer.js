import { createFormReducer } from '../common';

export default createFormReducer({
    editingUser: {},
    addUser: {
        avator: '',
        email: '',
        password: '',
        name: '',
        mobile: '',
        role: 'webmaster',
        note: '',
        is_active: true,
    },
    profile: {},
    customer: {},
});
