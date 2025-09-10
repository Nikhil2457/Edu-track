import { useState, useContext } from 'react';
import { useParams,  } from 'react-router-dom';
import { Form, Button, Card, Container, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import AlertBox from '../components/AlertBox';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const { resetPassword, loading } = useContext(AuthContext);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(token, password);
    setPassword('');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Reset Password</h3>
          <AlertBox />
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResetPassword;