import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import apiClient from '../api/apiClient.js';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.toggleBorder};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
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

// Basic styles for the modal
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#2a2a2a', // Default to dark theme style
    border: '1px solid #555',
    borderRadius: '12px',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};


Modal.setAppElement('#root'); // For accessibility

const AddBoardModal = ({ isOpen, onRequestClose, onBoardCreated }) => {
    const [boardName, setBoardName] = useState('');
    const { theme } = useTheme(); // Assuming you've exported useTheme

    // Dynamically adjust modal style based on theme
    const modalStyles = {
        ...customModalStyles,
        content: {
            ...customModalStyles.content,
            background: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
            color: theme === 'dark' ? '#FAFAFA' : '#121212',
            border: `1px solid ${theme === 'dark' ? '#555' : '#d1d1d1'}`
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!boardName.trim()) return;

        try {
            const response = await apiClient.post('/boards', { name: boardName });
            onBoardCreated(response.data); // Pass the new board back
            setBoardName(''); // Reset input
            onRequestClose(); // Close the modal
        } catch (error) {
            console.error("Failed to create board:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={modalStyles}
            contentLabel="Create New Board"
        >
            <h2>Create New Board</h2>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Enter board name..."
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    autoFocus
                />
                <Button type="submit">Create Board</Button>
            </Form>
        </Modal>
    );
};
// You might need to import useTheme from your ThemeContext if it's not globally available
import { useTheme } from '../contexts/ThemeContext.jsx'; 
export default AddBoardModal;