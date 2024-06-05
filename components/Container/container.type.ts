import { UniqueIdentifier } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';
export default interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: () => void;
  setShowEditContainerModal: Dispatch<SetStateAction<boolean>>;
  handleEditContainer: (id: string, title: string) => void;
  handleDeleteContainer: (id: string) => void;
}
