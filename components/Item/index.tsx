import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { Grip } from 'lucide-react';

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  category: string;
};

const Items = ({ id, title, category }: ItemsType) => {
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
        'px-2 py-4 bg-white  w-full rounded-lg border-2 bg-card text-card-foreground shadow-sm hover:border-gray-300 cursor-pointer',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        {title}
        <button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
        >
          <Grip size={16} />
        </button>
      </div>
      
      <div>
       <span className={` text-black font-bold`}>{category}</span> {/* Add this line */}
      </div>
    </div>
  );
};

export default Items;
