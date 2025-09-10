import { useState, useContext } from 'react';
import { Form, Button, Card, Container, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import AlertBox from '../components/AlertBox';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { forgotPassword, loading } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setEmail('');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Forgot Password</h3>
          <AlertBox />
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Send Reset Link'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;