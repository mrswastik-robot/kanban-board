import React from 'react';
import ContainerProps from './container.type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { Button } from '../ui/button';
import { GripHorizontal, Plus, Pencil, Trash } from 'lucide-react';

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
  setShowEditContainerModal,
  handleEditContainer,
  handleDeleteContainer,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'w-full h-full p-4 bg-gray-50 rounded-xl flex flex-col gap-y-4',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-800 text-xl font-semibold">{title}</h1>
          <p className="text-gray-400 text-sm ">{description}</p>
        </div>

        <div className='flex gap-1'>
          <button
            className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
            {...listeners}
          >
            <GripHorizontal size={16} />
          </button>

          <Button variant="ghost" className='p-1' onClick={() => {
            handleEditContainer(String(id), title || '');
            setShowEditContainerModal(true);
          }}>
            <Pencil size={16} />
          </Button>

          <Button variant="ghost" className='p-1' onClick={() => handleDeleteContainer(String(id))}>
            <Trash size={16} />
          </Button>

          <Button variant="ghost" className='p-1' onClick={onAddItem}>
            <Plus size={16} />
          </Button>
        </div>

      </div>
      
      {children}

      
    </div>
  );
};

export default Container;
