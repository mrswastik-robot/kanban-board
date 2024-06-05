"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Modal from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

import { editContainer } from '@/store/reducers/containersReducer';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';

interface EditContainerModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  containerId: string;
  containerTitle: string;
}

const EditContainerModal: React.FC<EditContainerModalProps> = ({ showModal, setShowModal, containerId, containerTitle }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(containerTitle);
  const form = useForm();

  const containers = useSelector((state: RootState) => state.containers);

  useEffect(() => {
    setTitle(containerTitle);
  }, [containerTitle]);

  const onSubmit = () => {
    if (!title) return;
    const container = containers.find((container) => container.id === containerId);
    if (!container) return;
    dispatch(editContainer({ ...container, title }));
    setShowModal(false);
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="flex flex-col w-full items-start gap-y-4">
        <h1 className="text-gray-800 text-3xl font-bold">Edit Container</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full items-start gap-y-4'>
            <FormField
              control={form.control}
              name="containername"
              render={({ field }) => (
                <Input
                  type="text"
                  className='border p-2 w-full rounded-lg shadow-lg hover:shadow-xl'
                  placeholder="Container Title"
                  name="containername"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              )}
            />
            <Button type='submit'>Save Changes</Button>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default EditContainerModal;