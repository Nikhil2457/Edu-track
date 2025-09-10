import { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';


const Verify = () => {
  const { token } = useParams();
  const { verifyEmail, loading, error, success } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    if (!token || hasVerified) return;

    const verify = async () => {
      try {
        await verifyEmail(token);
        setHasVerified(true);
      } catch (err) {
        console.error('Verification error:', err);
        setHasVerified(true); // Prevent retry on error
      }
    };

    verify();

    return () => {
      // Cleanup to prevent further calls
    };
  }, [token, verifyEmail, hasVerified]);

  useEffect(() => {
    if (success && hasVerified) {
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [success, hasVerified, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <h2>Email Verification</h2>
        {loading && !hasVerified ? (
          <>
            <Spinner animation="border" />
            <p className="mt-3">Verifying your email...</p>
          </>
        ) : success ? (
          <p>Email verified! Redirecting to login...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <p>Email verification in progress...</p>
        )}
      </div>
    </Container>
  );
};

export default Verify;