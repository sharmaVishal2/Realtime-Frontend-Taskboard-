import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.p`
    color: #ff6b6b;
`;

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username: username,
                password: password,
            });

            // If login is successful, save the token and redirect
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            
            // Redirect to the dashboard
            navigate('/dashboard');

        } catch (err) {
            setError('Login failed. Please check your username and password.');
            console.error('Login error:', err);
        }
    };

    return (
        <PageContainer>
            <Form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">Login</Button>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </Form>
        </PageContainer>
    );
};

export default LoginPage;