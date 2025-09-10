import { Navbar, Nav, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
  const { token, logout } = useContext(AuthContext);
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">EduTrack</Navbar.Brand>
      <Nav className="ml-auto">
        {token ? (
          <Button variant="outline-light" onClick={logout}>Logout</Button>
        ) : (
          <>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
          </>
        )}
      </Nav>
    </Navbar>
  );
};
export default AppNavbar;