import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import styled from 'styled-components';
import apiClient from '../api/apiClient.js';

import AddTaskModal from '../components/AddTaskModal.jsx';
import AssignTaskModal from '../components/AssignTaskModal.jsx';
import TaskCard from '../components/TaskCard.jsx';

const PageContainer = styled.div`
  padding: 2rem 4rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CreateTaskButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.gradient};
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s ease-in-out;
  &:hover { transform: scale(1.05); }
`;

const ColumnsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: flex-start;
`;

const Column = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 1rem;
  border-radius: 12px;
  width: 320px;
  display: flex;
  flex-direction: column;
  border-top: 4px solid ${props => props.color};
`;

const ColumnTitle = styled.h3`
  padding: 0 0.5rem;
  margin-top: 0;
`;

const TaskList = styled.div`
  background-color: ${props => props.isDraggingOver ? '#ffffff10' : 'transparent'};
  flex-grow: 1;
  min-height: 100px;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
`;


const BoardView = () => {
    const { boardId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [boardMembers, setBoardMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const stompClientRef = useRef(null);

    // Effect for fetching initial data (both tasks and members)
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const [tasksResponse, membersResponse] = await Promise.all([
                    apiClient.get(`/boards/${boardId}/tasks`),
                    apiClient.get(`/boards/${boardId}/members`)
                ]);
                setTasks(tasksResponse.data);
                setBoardMembers(membersResponse.data);
            } catch (err) {
                console.error("Failed to fetch board data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBoardData();
    }, [boardId]);
    
    // Effect for WebSocket connection
    useEffect(() => {
        const socket = new SockJS('https://taskboard-backend.onrender.com/ws');
        stompClientRef.current = Stomp.over(socket);
        const stompClient = stompClientRef.current;
        stompClient.connect({}, (frame) => {
            console.log('WebSocket Connected: ' + frame);
            stompClient.subscribe(`/topic/board/${boardId}`, (message) => {
                const receivedTask = JSON.parse(message.body);
                setTasks(prevTasks => {
                    const existingTaskIndex = prevTasks.findIndex(t => t.id === receivedTask.id);
                    if (existingTaskIndex !== -1) {
                        const newTasks = [...prevTasks];
                        newTasks[existingTaskIndex] = receivedTask;
                        return newTasks;
                    } else {
                        return [...prevTasks, receivedTask];
                    }
                });
            });
        });
        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.disconnect();
            }
        };
    }, [boardId]);

    // Handler for drag-and-drop completion
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const taskToUpdate = tasks.find(task => task.id === draggableId);
        const newStatus = destination.droppableId;

        const updatedTasks = tasks.map(task =>
            task.id === draggableId ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);

        apiClient.patch(`/tasks/${draggableId}`, { status: newStatus })
            .catch(err => {
                console.error("Failed to update task status", err);
                setTasks(tasks); // Revert on error
            });
    };
    
    // Handler to open the assign task modal
    const handleAssignClick = (task) => {
        setSelectedTask(task);
        setIsAssignTaskModalOpen(true);
    };

    if (loading) return <PageContainer><h2>Loading...</h2></PageContainer>;

    const columns = {
        'TO_DO': { name: 'To Do', color: '#4287f5'},
        'IN_PROGRESS': { name: 'In Progress', color: '#f5a142'},
        'DONE': { name: 'Done', color: '#42f55d'}
    };

    return (
        <PageContainer>
            <HeaderContainer>
                <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    Board: {boardId}
                </motion.h2>
                <CreateTaskButton onClick={() => setIsAddTaskModalOpen(true)}>+ Add New Task</CreateTaskButton>
            </HeaderContainer>

            <AddTaskModal isOpen={isAddTaskModalOpen} onRequestClose={() => setIsAddTaskModalOpen(false)} boardId={boardId} />
            <AssignTaskModal isOpen={isAssignTaskModalOpen} onRequestClose={() => setIsAssignTaskModalOpen(false)} boardMembers={boardMembers} task={selectedTask} />

            <DragDropContext onDragEnd={onDragEnd}>
                <ColumnsContainer>
                    {Object.entries(columns).map(([status, column]) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided, snapshot) => (
                                <Column color={column.color}>
                                    <ColumnTitle>{column.name}</ColumnTitle>
                                    <TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                                        {tasks.filter(t => t.status === status).map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <TaskCard task={task} onAssignClick={handleAssignClick} members={boardMembers} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </TaskList>
                                </Column>
                            )}
                        </Droppable>
                    ))}
                </ColumnsContainer>
            </DragDropContext>
        </PageContainer>
    );
};

export default BoardView;