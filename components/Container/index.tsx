import React from 'react';
import ContainerProps from './container.type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { Button } from '../ui/button';
import { GripHorizontal, Plus, Pencil, Trash, Dot } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
        'w-full h-full  rounded-xl flex flex-col gap-y-4',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-800 text-xl font-semibold" {...listeners}>{title}</h1>
          <p className="text-gray-400 text-sm ">{description}</p>
        </div>

        <div className='flex gap-4'>
          {/* <button
            className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
            {...listeners}
          >
            <GripHorizontal size={16} />
          </button> */}

          <Popover>
            <PopoverTrigger className=''>
              <Button variant="link" className='w-full p-0 overflow-visible'>
                {/* <div className='overflow-visible '> */}
                <svg className="overflow-visible" fill="#4545457d" height="14px" width="14px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32.055 32.055" xmlSpace="preserve" stroke="#454545"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967 C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967 s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967 c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"></path> </g> </g></svg>
                {/* </div> */}
              </Button>  
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-y-2">
                <Button variant="ghost" className=' flex gap-2' onClick={() => {
                  handleEditContainer(String(id), title || '');
                  setShowEditContainerModal(true);
                }}>
                  <Pencil size={16} />
                  Edit
                </Button>

                <Button variant="ghost" className=' flex gap-2' onClick={() => handleDeleteContainer(String(id))}>
                  <Trash size={16} />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          

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
