import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import apiClient from '../api/apiClient.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

// You can reuse the styled components from AddBoardModal or define new ones
const Form = styled.form` display: flex; flex-direction: column; gap: 1rem; `;
const Input = styled.input` padding: 0.8rem; border-radius: 4px; border: 1px solid ${({ theme }) => theme.toggleBorder}; background: ${({ theme }) => theme.body}; color: ${({ theme }) => theme.text}; font-size: 1rem; `;
const Button = styled.button` padding: 0.8rem; border-radius: 4px; border: none; background: ${({ theme }) => theme.gradient}; color: white; font-weight: bold; cursor: pointer; `;

Modal.setAppElement('#root');

const AddTaskModal = ({ isOpen, onRequestClose, boardId }) => {
    const [title, setTitle] = useState('');
    const { theme } = useTheme();

    // Dynamically adjust modal style based on theme
    const modalStyles = {
        content: {
            top: '50%', left: '50%', right: 'auto', bottom: 'auto',
            marginRight: '-50%', transform: 'translate(-50%, -50%)',
            background: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
            color: theme === 'dark' ? '#FAFAFA' : '#121212',
            border: `1px solid ${theme === 'dark' ? '#555' : '#d1d1d1'}`,
            borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '500px'
        },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            // The service will set the boardId and default status
            await apiClient.post(`/boards/${boardId}/tasks`, { title });
            setTitle(''); // Reset input
            onRequestClose(); // Close the modal
            // We don't need to manually update the state here, the WebSocket will do it!
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyles} contentLabel="Create New Task">
            <h2>Create New Task</h2>
            <Form onSubmit={handleSubmit}>
                <Input type="text" placeholder="Enter task title..." value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
                <Button type="submit">Create Task</Button>
            </Form>
        </Modal>
    );
};

export default AddTaskModal;