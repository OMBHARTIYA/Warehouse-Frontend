import { useEffect } from "react";

type Params = {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  createTitleInputRef: React.RefObject<HTMLInputElement | null>;
  editTitleInputRef: React.RefObject<HTMLInputElement | null>;
  createModalRef: React.RefObject<HTMLDivElement | null>;
  editModalRef: React.RefObject<HTMLDivElement | null>;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
};

export function useTaskModalFocus({
  isCreateModalOpen,
  isEditModalOpen,
  createTitleInputRef,
  editTitleInputRef,
  createModalRef,
  editModalRef,
  onCloseCreate,
  onCloseEdit,
}: Params) {
  useEffect(() => {
    if (isCreateModalOpen) createTitleInputRef.current?.focus();
  }, [isCreateModalOpen, createTitleInputRef]);

  useEffect(() => {
    if (isEditModalOpen) editTitleInputRef.current?.focus();
  }, [isEditModalOpen, editTitleInputRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isEditModalOpen) onCloseEdit();
        else if (isCreateModalOpen) onCloseCreate();
        return;
      }
      if (event.key !== "Tab") return;
      const activeModal = isEditModalOpen ? editModalRef.current : isCreateModalOpen ? createModalRef.current : null;
      if (!activeModal) return;
      const activeElement = document.activeElement as HTMLElement | null;

      const focusableElements = activeModal.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey) {
        if (activeElement === firstElement || !activeModal.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    if (isCreateModalOpen || isEditModalOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCreateModalOpen, isEditModalOpen, createModalRef, editModalRef, onCloseCreate, onCloseEdit]);
}
