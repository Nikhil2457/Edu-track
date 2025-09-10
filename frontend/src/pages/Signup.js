import { useState, useContext } from 'react';
import { Form, Button, Card, Container, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import AlertBox from '../components/AlertBox';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const { signup, loading } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Signup</h3>
          <AlertBox />
          <Form onSubmit={handleSubmit}>
            <Form.Group><Form.Label>Name</Form.Label><Form.Control value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Form.Group>
            <Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></Form.Group>
            <Form.Group><Form.Label>Password</Form.Label><Form.Control type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required /></Form.Group>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Signup'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
export default Signup;