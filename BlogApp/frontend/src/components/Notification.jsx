import {useSelector} from 'react-redux'
import { Alert } from '@mui/material';
const Notification = () => {
  const notification = useSelector(state => {
    if (!state.notification || state.notification === '') {
      return 
    } else {
      return state.notification
    }
  })

  if (notification === 'wrong username or password') {
    return <Alert severity='error'>{notification}</Alert>;
  } else if (notification) {
    return <Alert severity='success'>{notification}</Alert>;
  } else {
    return 
  }
};

export default Notification;
