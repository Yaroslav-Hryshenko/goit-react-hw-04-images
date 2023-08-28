import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import css from './Modal.module.css';

const modalRoot = document.getElementById('modal');

export const Modal = ({ onClose, imgModal, modalTags }) => {
  const onClickOverlay = e => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className={css.overlay} onClick={onClickOverlay}>
      <div className={css.modal}>
        <img src={imgModal} alt={modalTags} loading="lazy" width="1200" />
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  imgModal: PropTypes.string.isRequired,
  onCloys: PropTypes.func.isRequired,
  modalTags: PropTypes.string.isRequired,
};
