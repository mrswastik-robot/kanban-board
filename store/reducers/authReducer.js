

const initialState = {
    user: null,
    error: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'REGISTER_USER':
        return { ...state, user: action.payload };
      case 'LOGIN_USER':
        return { ...state, user: action.payload };
      case 'LOGIN_ERROR':
        return { ...state, error: 'Invalid credentials' };
      
      case 'LOGOUT_USER':
        return { ...state, user: null };
      
        default:
        return state;
    }
  };
  
  export default authReducer;