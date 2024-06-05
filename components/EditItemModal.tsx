"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Modal from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { editItem } from '@/store/reducers/containersReducer';

interface EditItemModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  itemId: string;
  itemTitle: string;
  itemCategory: string;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ showModal, setShowModal, itemId, itemTitle, itemCategory }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(itemTitle);
  const [category, setCategory] = useState(itemCategory);
  const form = useForm();

  useEffect(() => {
    setTitle(itemTitle);
    setCategory(itemCategory);
  }, [itemTitle, itemCategory]);

  const onSubmit = () => {
    if (!title || !category) return;
    dispatch(editItem({ id: itemId, title, category }));
    setShowModal(false);
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="flex flex-col w-full items-start gap-y-4">
        <h1 className="text-gray-800 text-3xl font-bold">Edit Item</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full items-start gap-y-4'>
            <FormField
              control={form.control}
              name="itemname"
              render={({ field }) => (
                <Input
                  type="text"
                  className='border p-2 w-full rounded-lg shadow-lg hover:shadow-xl'
                  placeholder="Item Title"
                  name="itemname"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className='w-full rounded-lg shadow-lg hover:shadow-xl'>
                  <Select onValueChange={setCategory} defaultValue={category}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Save Changes</Button>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default EditItemModal;