"use client";
import { useState } from "react";

import { UniqueIdentifier } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { BadgeCheck, Grip, Trash } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Pencil, Dot } from 'lucide-react';
import Image from "next/image";

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  category: string;
  setShowEditItemModal: Dispatch<SetStateAction<boolean>>;
  handleEditItem: (id: string, title: string, category: string) => void;
  handleDeleteItem: (id: string) => void;
};

const Items = ({ id, title, category, setShowEditItemModal, handleEditItem, handleDeleteItem}: ItemsType) => {

  const [badgeColor, setBadgeColor] = useState('#6a6a6a');
  const [showImage , setShowImage] = useState(false);

  const toggleBadgeColor = () => {
    setBadgeColor((prevColor) => (prevColor === '#6a6a6a' ? '#4785F8' : '#6a6a6a'));
    setShowImage(!showImage);
  };

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
      <div>

        <div className='flex justify-between '>
          <div className='pt-1 pb-2 flex gap-2'>
              <p className=' text-sm font-medium text-gray-600/90'>#8793</p>
              <svg
                      viewBox="0 0 48 48"
                      className=" mt-[0.29rem]  w-2 h-2 overflow-visible"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3725 30.6274 12 24 12C17.3726 12 12 17.3725 12 24C12 30.6274 17.3726 36 24 36Z"
                          fill="#3333336c"
                        ></path>{" "}
                      </g>
                </svg>
                <p className=' text-sm font-medium text-gray-600/70'>3 Jan, 4:35 PM</p>
          </div>

          <div className=' flex '>
            <Popover>
                <PopoverTrigger className=''>
                  <Button variant="link" className=''>
                  <svg 
                    fill="#4545457a" 
                    height="12px" width="12px" 
                    className=' overflow-visible mb-3'
                    version="1.1" id="Capa_1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 32.055 32.055" xmlSpace="preserve" 
                    stroke="#454545"><g id="SVGRepo_bgCarrier" 
                    strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" 
                    strokeLinecap="round" strokeLinejoin="round"></g><g 
                    id="SVGRepo_iconCarrier"> <g> 
                      <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967 C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967 s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967 c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"></path> </g> </g></svg>
                  </Button>  
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-y-2">
                    <Button variant="ghost" className=' flex gap-2' onClick={() => {
                      handleEditItem(String(id), title, category);
                    setShowEditItemModal(true);
                    }}>
                      <Pencil size={16} />
                      Edit
                    </Button>

                    <Button variant="ghost" className=' flex gap-2' onClick={() => handleDeleteItem(String(id))}>
                      <Trash size={16} />
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* <button
                className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
                {...listeners}
              >
                <span className="sr-only">Grip</span>
                <Grip size={16} />
              </button> */}
              <Image src="/dragit-evenbetter.png" alt="error" width={30} height={1} className=" h-7  rounded-full " {...listeners} />
          </div>
          
        </div>

        <div className="flex items-center ">
          <div>
            {title}
          </div>

          
          
        </div>
      </div>

      
      {category && 
      <div className=" flex gap-4">
        <div className={clsx('rounded-3xl p-1 w-[30%] items-center justify-center text-center mt-3 shadow-xl', categoryClass)}>
          <span className={` text-white font-normal text-sm`}>{category}</span>
        </div>
        <div className=" flex  mt-3">
          <Image src="/loader.png" alt="er" width={33} height={33} className=" rounded-full"/>
          <p className=" text-sm mt-2 font-medium">8.8</p>
        </div>
      </div>}

      {category && 
      <div className=' absolute right-3 bottom-4'>
        {/* <Checkbox className="mt-2"/> */}
        {!showImage && <BadgeCheck className="mt-2 cursor-pointer" color={badgeColor} onClick={toggleBadgeColor} />}
        {showImage && <Image src="/badge-check.png" alt="error" width={24} height={24} onClick={toggleBadgeColor} />}
      </div>}

    </div>
  );
};

export default Items;
