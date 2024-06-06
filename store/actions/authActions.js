

export const registerUser = (user) => {
    return (dispatch) => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      dispatch({ type: 'REGISTER_USER', payload: user });
    };
  };
  
  export const loginUser = (user) => {
    return (dispatch) => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const existingUser = users.find(
        (u) => u.email === user.email && u.password === user.password
      );
      if (existingUser) {
        dispatch({ type: 'LOGIN_USER', payload: existingUser });
      } else {
        dispatch({ type: 'LOGIN_ERROR' });
      }
    };
  };