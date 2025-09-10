import { Alert } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AlertBox = () => {
  const { error, success, clearMessages } = useContext(AuthContext);
  if (error) return <Alert variant="danger" onClose={clearMessages} dismissible>{error}</Alert>;
  if (success) return <Alert variant="success" onClose={clearMessages} dismissible>{success}</Alert>;
  return null;
};
export default AlertBox;