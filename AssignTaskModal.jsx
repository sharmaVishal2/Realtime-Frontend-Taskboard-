import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import apiClient from '../api/apiClient.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

const MemberList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MemberItem = styled.li`
  padding: 0.8rem 1rem;
  cursor: pointer;
  border-radius: 6px;
  &:hover {
    background-color: ${({ theme }) => theme.body};
  }
`;

Modal.setAppElement('#root');

const AssignTaskModal = ({ isOpen, onRequestClose, boardMembers, task }) => {
    const { theme } = useTheme();

    const modalStyles = {
        content: {
            top: '50%', left: '50%', right: 'auto', bottom: 'auto',
            marginRight: '-50%', transform: 'translate(-50%, -50%)',
            background: theme === 'dark' ? '#2a2a2a' : '#FFFFFF',
            color: theme === 'dark' ? '#FAFAFA' : '#121212',
            border: `1px solid ${theme === 'dark' ? '#555' : '#d1d1d1'}`,
            borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '400px'
        },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' }
    };

    const handleAssignUser = async (userId) => {
        if (!task) return;
        try {
            await apiClient.patch(`/tasks/${task.id}/assign`, { userId });
            onRequestClose(); // Close the modal on success
            // UI will update automatically via WebSocket
        } catch (error) {
            console.error("Failed to assign task:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyles} contentLabel="Assign Task">
            <h2>Assign Task to...</h2>
            <MemberList>
                {boardMembers.map(member => (
                    <MemberItem key={member.id} onClick={() => handleAssignUser(member.id)}>
                        {member.username} ({member.email})
                    </MemberItem>
                ))}
            </MemberList>
        </Modal>
    );
};

export default AssignTaskModal;