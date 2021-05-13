import { useEffect, useState, useRef, ReactNode } from 'react';
import ReactModal from 'react-modal';

interface ModalProps{
  isOpen: boolean;
  children: ReactNode;
  setIsOpen:() => void;
}

export function Modal({ 
  isOpen, 
  setIsOpen,
  children,
}: ModalProps) {
  
  function usePrevious(value: boolean) {
    const ref = useRef<boolean>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const [ modalStatus, setModalStatus ] = useState(isOpen);
  const prevModalStatus = usePrevious(modalStatus)

  useEffect(() => {
    if (prevModalStatus !== isOpen) {
      setModalStatus(isOpen);
    }
  }, [prevModalStatus, isOpen]);
  // componentDidUpdate(prevProps) {
    // const { isOpen } = this.props;

    // if (prevProps.isOpen !== isOpen) {
    //   console.log(this.props)
    //   this.setState({ modalStatus: isOpen })
    // }
  // }

  // const { children, setIsOpen } = this.props;

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={setIsOpen}
      isOpen={modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#F0F0F5',
          color: '#000000',
          borderRadius: '8px',
          width: '736px',
          border: 'none',
        },
        overlay: {
          backgroundColor: '#121214e6',
        },
      }}
    >
      {children}
    </ReactModal>
  );

};