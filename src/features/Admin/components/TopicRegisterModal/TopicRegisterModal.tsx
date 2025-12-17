import { useState } from 'react';
import Image from 'next/image';

import styles from '../../styles/TopicRegisterModal.module.css';

type TopicRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (topic: string) => void;
};

const MAX_LENGTH = 35;

const TopicRegisterModal = ({ isOpen, onClose, onConfirm }: TopicRegisterModalProps) => {
  const [topic, setTopic] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setTopic(value);
    }
  };

  const handleConfirm = () => {
    if (topic.trim()) {
      onConfirm(topic.trim());
      setTopic('');
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    setTopic('');
    onClose();
  };

  if (!isOpen) return null;

  const isConfirmEnabled = topic.trim().length > 0;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* 상단 헤더 */}
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>주제 등록</h2>
            <span
              className={`${styles.charCount} ${topic.length >= MAX_LENGTH ? styles.charCountError : ''}`}
            >
              {topic.length}/{MAX_LENGTH}
            </span>
          </div>
          <button type="button" className={styles.closeButton} onClick={handleClose}>
            <Image src="/close.svg" alt="닫기" width={24} height={24} />
          </button>
        </div>

        {/* 입력 필드 */}
        <div
          className={`${styles.inputContainer} ${topic.length >= MAX_LENGTH ? styles.inputContainerError : ''}`}
        >
          <input
            type="text"
            className={styles.input}
            placeholder="주제를 입력해주세요.."
            value={topic}
            onChange={handleChange}
            maxLength={MAX_LENGTH}
          />
        </div>

        {/* 확인 버튼 */}
        <button
          type="button"
          className={`${styles.confirmButton} ${isConfirmEnabled ? styles.confirmButtonActive : ''}`}
          onClick={handleConfirm}
          disabled={!isConfirmEnabled}
        >
          <span
            className={`${styles.confirmButtonText} ${isConfirmEnabled ? styles.confirmButtonTextActive : ''}`}
          >
            확인
          </span>
        </button>
      </div>
    </div>
  );
};

export default TopicRegisterModal;
