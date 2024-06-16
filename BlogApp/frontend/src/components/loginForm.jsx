import propTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { setCurrUsername, setCurrPassword } from "../reducers/userReducer";
import { InputLabel, Input, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginForm = ({
  handleLogin,
}) => {
  const {username, password} = useSelector(state => {
    return state.users
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    handleLogin()
    navigate('/')
  }
  return  (
    <form onSubmit={onSubmit}>
      <h1>Login</h1>
      <div>
        <InputLabel>username</InputLabel>
        <Input
          type="text"
          value={username}
          name="Username"
          data-testid="username"
          onChange={({ target }) => dispatch(setCurrUsername(target.value))}
        ></Input>
      </div>
      <div>
        <InputLabel>password</InputLabel>
        <Input
          type="password"
          value={password}
          name="Password"
          data-testid="password"
          onChange={({ target }) => dispatch(setCurrPassword(target.value))}
        ></Input>
      </div>
      <br></br>
      <Button variant="outlined" color="primary" type="submit">login</Button>
    </form>
  );
}

LoginForm.propTypes = {
  handleLogin: propTypes.func.isRequired,
};

export default LoginForm;
