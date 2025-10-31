import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.body};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: ${({ theme }) => theme.shadow};
  user-select: none;
`;

const AssignButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.toggleBorder};
  color: ${({ theme }) => theme.text};
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 0.5rem;
  float: right;
`;

const AssignedUser = styled.p`
    font-size: 0.8rem;
    font-style: italic;
    opacity: 0.7;
    margin: 0.5rem 0 0 0;
`;


const TaskCard = ({ task, onAssignClick, members }) => {
    // Find the assigned user's username from the members list
    const assignedUser = task.assignedToId ? members.find(m => m.id === task.assignedToId) : null;

    return (
        <Card layout>
            <h4>{task.title}</h4>
            <AssignButton onClick={() => onAssignClick(task)}>Assign</AssignButton>
            {assignedUser && <AssignedUser>Assigned to: {assignedUser.username}</AssignedUser>}
        </Card>
    );
};

export default TaskCard;