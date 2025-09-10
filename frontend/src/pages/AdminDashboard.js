import { useEffect, useState, useContext, useCallback } from 'react';
import { Card, Table, Button, Form, Container, Spinner, Pagination } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import AlertBox from '../components/AlertBox';

const AdminDashboard = () => {
  const { getStudents, addStudent, deleteStudent, updateStudent, loading, students: cachedStudents } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', course: '' });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errors, setErrors] = useState({});

  const fetchStudents = useCallback(async () => {
    if (cachedStudents && cachedStudents.length > 0) {
      setStudents(cachedStudents);
      return;
    }
    const data = await getStudents(page);
    if (data) {
      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
    }
  }, [page, getStudents, cachedStudents]);

  useEffect(() => {
    fetchStudents();
  }, [page, fetchStudents]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';
    if (!editId && !formData.password) newErrors.password = 'Password is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (editId && students.some((student) => student.email === formData.email && student._id !== editId)) {
      newErrors.email = 'Email already in use';
    }
    return newErrors;
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      if (editId) {
        await updateStudent(editId, {
          name: formData.name,
          email: formData.email,
          course: formData.course,
        });
        setEditId(null);
      } else {
        await addStudent({ ...formData, role: 'student' });
      }
      setFormData({ name: '', email: '', password: '', course: '' });
      await fetchStudents();
    } catch (err) {
      console.error('Add/Update error:', err);
    }
  };

  const handleEdit = (student) => {
    setEditId(student._id);
    setFormData({ name: student.name, email: student.email, course: student.course, password: '' });
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      await fetchStudents();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="text-center mb-4">Admin Dashboard</h3>
          <AlertBox />
          <h4>{editId ? 'Edit Student' : 'Add Student'}</h4>
          <Form onSubmit={handleAddOrUpdate}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
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
            {!editId && (
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  isInvalid={!!errors.password}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>
            )}
            <Form.Group className="mb-3" controlId="course">
              <Form.Label>Course</Form.Label>
              <Form.Control
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                isInvalid={!!errors.course}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.course}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" disabled={loading} className="w-100">
              {loading ? <Spinner animation="border" size="sm" /> : editId ? 'Update' : 'Add'}
            </Button>
          </Form>
          <h4 className="mt-4">Student List</h4>
          {loading && !students.length ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <p className="text-center">No students found.</p>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleEdit(student)}
                          size="sm"
                          className="me-2"
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(student._id)}
                          size="sm"
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="justify-content-center">
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === page}
                    onClick={() => setPage(i + 1)}
                    disabled={loading}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;