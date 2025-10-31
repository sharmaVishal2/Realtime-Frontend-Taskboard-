import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiClient from '../api/apiClient.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AddBoardModal from '../components/AddBoardModal.jsx';

const PageContainer = styled.div`
  padding: 2rem 4rem;
`;

const BoardList = styled(motion.ul)`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const BoardItem = styled(motion.li)`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.toggleBorder};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1.5rem;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${({ theme }) => theme.gradient};
  }
`;

const CreateBoardButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.gradient};
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 2rem;
  font-size: 1rem;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const DashboardPage = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        apiClient.get('/boards')
            .then(response => {
                setBoards(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch boards. Please log in again.');
                setLoading(false);
                console.error(err);
            });
    }, []);

    const handleBoardCreated = (newBoard) => {
        setBoards(prevBoards => [...prevBoards, newBoard]);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 120 },
        },
    };

    if (loading) return <PageContainer><h2>Loading boards...</h2></PageContainer>;
    if (error) return <PageContainer><h2>{error}</h2></PageContainer>;

    return (
        <PageContainer>
            <motion.div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                    Your Boards
                </motion.h2>
                <CreateBoardButton onClick={() => setIsModalOpen(true)}>+ Create New Board</CreateBoardButton>
            </motion.div>

            <AddBoardModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onBoardCreated={handleBoardCreated}
            />

            <AnimatePresence>
                {boards.length > 0 ? (
                    <BoardList
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {boards.map(board => (
                            <Link to={`/board/${board.id}`} key={board.id} style={{ textDecoration: 'none' }}>
                                <BoardItem
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.2)" }}
                                >
                                    {board.name}
                                </BoardItem>
                            </Link>
                        ))}
                    </BoardList>
                ) : (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        You haven't created any boards yet. Click the button to create one!
                    </motion.p>
                )}
            </AnimatePresence>
        </PageContainer>
    );
};

export default DashboardPage;