import { useState, useContext } from 'react';
import { Form, Button, Card, Container, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import AlertBox from '../components/AlertBox';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Login</h3>
          <AlertBox />
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <a href="/forgot">Forgot Password?</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
export default Login;