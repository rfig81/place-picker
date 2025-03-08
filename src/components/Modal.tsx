import { useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  ref: React.ForwardedRef<{ open: () => void; close: () => void }>;
  children: React.ReactNode;
}
function Modal({ ref, children }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current?.showModal();
      },
      close: () => {
        dialog.current?.close();
      },
    };
  });

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
    </dialog>,
    document.getElementById("modal") as HTMLElement
  );
}

export default Modal;
