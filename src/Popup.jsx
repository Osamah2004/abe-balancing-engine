import { useAtom } from 'jotai';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { ModalChild } from './Atom';

// Required for accessibility: tells the modal which element to hide from screen readers
Modal.setAppElement('#root');
const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        padding: 0,
        border: 'none',
        background: 'transparent',
        maxWidth: '90vw',
        maxHeight: '90vh',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
    },
};
const Popup = () => {
    const [modalChild, setModalChild] = useAtom(ModalChild);

    return (
        <div>
            <Modal 
                isOpen={modalChild}
                style={modalStyles}
                onRequestClose={() => setModalChild(null)} // Closes on Esc or clicking outside
            >
                {modalChild}
            </Modal>
        </div>
    );
}

export default Popup;