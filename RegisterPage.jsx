import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.toggleBorder};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  padding: 0.8rem;
  border-radius: 4px;
  border: none;
  background: ${({ theme }) => theme.gradient};
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 1rem;
`;

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            await axios.post('https://realtime-taskboard-backend-80wa.onrender.com/api/auth/register', {
                username,
                email,
                password,
            });
            // Redirect to login page after successful registration
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username or email may already be in use.');
            console.error('Registration error:', err);
        }
    };

    return (
        <PageContainer>
            <Form onSubmit={handleSubmit}>
                <h2>Register New Account</h2>
                <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit">Register</Button>
                {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
                <Message>
                    Already have an account? <Link to="/login">Login here</Link>
                </Message>
            </Form>
        </PageContainer>
    );
};

export default RegisterPage;