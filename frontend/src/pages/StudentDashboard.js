import { useEffect, useState, useContext } from 'react';
import { Card, Form, Button, Container, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import AlertBox from '../components/AlertBox';

const StudentDashboard = () => {
  const { user, getProfile, updateProfile, changePassword, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', course: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      getProfile();
    } else {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        course: user.course || '',
      });
    }
  }, [user, getProfile]);

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (passwordData.newPassword.length < 6) newErrors.newPassword = 'New password must be at least 6 characters';
    if (!passwordData.oldPassword) newErrors.oldPassword = 'Old password is required';
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await updateProfile(formData);
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      console.error('Change password error:', err);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-4 text-center">Student Profile</h3>
          <AlertBox />
          {!user && loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Loading profile...</p>
            </div>
          ) : (
            <>
              <h5>Update Profile</h5>
              <Form onSubmit={handleProfileSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    isInvalid={!!errors.name}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    isInvalid={!!errors.email}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="course">
                  <Form.Label>Course</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    isInvalid={!!errors.course}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors.course}</Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                  {loading ? <Spinner animation="border" size="sm" /> : 'Update Profile'}
                </Button>
              </Form>

              <h5 className="mt-4">Change Password</h5>
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3" controlId="oldPassword">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    isInvalid={!!errors.oldPassword}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors.oldPassword}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    isInvalid={!!errors.newPassword}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                  {loading ? <Spinner animation="border" size="sm" /> : 'Change Password'}
                </Button>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentDashboard;