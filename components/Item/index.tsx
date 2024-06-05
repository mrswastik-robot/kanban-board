
import { UniqueIdentifier } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { Grip, Trash } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

import { Button } from '../ui/button';
import { Pencil } from 'lucide-react';

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  category: string;
  setShowEditItemModal: Dispatch<SetStateAction<boolean>>;
  handleEditItem: (id: string, title: string, category: string) => void;
  handleDeleteItem: (id: string) => void;
};

const Items = ({ id, title, category, setShowEditItemModal, handleEditItem, handleDeleteItem}: ItemsType) => {

  const categoryClass = {
    Low: ' bg-yellow-500',
    Medium: ' bg-orange-500',
    High: ' bg-red-600',
    Critical: ' bg-red-800',
  }[category] || 'bg-gray-200';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'px-2 py-4 bg-white relative w-full rounded-lg border-2  text-card-foreground shadow-sm hover:border-gray-300 cursor-pointer',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        {title}
        <Button variant="ghost" className='p-1' onClick={() => {
          handleEditItem(String(id), title, category);
          setShowEditItemModal(true);
        }}>
          <Pencil size={16} />
        </Button>
        <Button variant="ghost" className='p-1' onClick={() => handleDeleteItem(String(id)) }>
            <Trash size={16} />
          </Button>
        <button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
        >
          <span className="sr-only">Grip</span>
          <Grip size={16} />
        </button>
      </div>
      
      {category && 
      <div className={clsx('rounded-3xl p-1 w-[30%] items-center justify-center text-center mt-2 shadow-md', categoryClass)}>
       <span className={` text-white font-normal text-sm`}>{category}</span>
      </div>}

      {category && 
      <div className=' absolute right-4 bottom-4'>
        <Checkbox className="mt-2"/>
      </div>}

    </div>
  );
};

export default Items;
