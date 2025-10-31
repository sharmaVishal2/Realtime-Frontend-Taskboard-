import React from 'react';
import styled from 'styled-components';
import ThemeToggle from './ThemeToggle.jsx';

const Nav = styled.nav`
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.navbarBg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
  
  span {
    background: ${({ theme }) => theme.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Navbar = () => {
    return (
        <Nav>
            <Title>
                <span>TaskBoard</span>
            </Title>
            <ThemeToggle />
        </Nav>
    );
};

export default Navbar;