"use client"

import Link from 'next/link';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

//redux stuff for editing&deleting items and containers
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import 
{ deleteContainer,
  addContainer, 
  moveItemWithinContainer, 
  moveItemToDifferentContainer, 
  moveContainer,
  addItem,
  deleteItem } 
from '@/store/reducers/containersReducer';
// import { deleteItem, } from '@/store/reducers/itemsReducer';
import EditContainerModal from '@/components/EditContainerModal';
import EditItemModal from '@/components/EditItemModal';


// DnD
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { Inter } from 'next/font/google';

// Components
import Container from '@/components/Container';
import Items from '@/components/Item';
import Modal from '@/components/Modal';
// import Input from '@/components/Input';
import { Button } from '@/components/Button';

import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';

const inter = Inter({ subsets: ['latin'] });

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
    category: string;
  }[];
};

export default function Home() {

  const dispatch = useDispatch();
  const containers = useSelector((state: RootState) => state.containers);
  const items = useSelector((state: RootState) => state.items);

  // const [containers, setContainers] = useState<DNDType[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();
  const [containerName, setContainerName] = useState('');
  const [itemName, setItemName] = useState('');
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditContainerModal, setShowEditContainerModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editContainerId, setEditContainerId] = useState<string>('');
  const [editContainerTitle, setEditContainerTitle] = useState<string>('');
  const [editItemId, setEditItemId] = useState<string>('');
  const [editItemTitle, setEditItemTitle] = useState<string>('');
  const [editItemCategory, setEditItemCategory] = useState<string>('');


  const form = useForm();

  const onAddContainer = () => {
    if (!containerName) return;
    const id = `container-${uuidv4()}`;
    dispatch(addContainer({ id, title: containerName, items: [] }));
    setContainerName('');
    setShowAddContainerModal(false);
  };

  // const onAddItem = () => {
  //   if (!itemName) return;
  //   const id = `item-${uuidv4()}`;
  //   const category = form.getValues('email');
  //   const container = containers.find((item) => item.id === currentContainerId);
  //   if (!container) return;
  //   container.items.push({
  //     id,
  //     title: itemName,
  //     category
  //   });
  //   setContainers([...containers]);
  //   setItemName('');
  //   setShowAddItemModal(false);
  // };

  const onAddItem = () => {
    if (!itemName || !currentContainerId) return;
    const id = `item-${uuidv4()}`;
    const category = form.getValues('email');
    dispatch(addItem({ containerId: currentContainerId.toString(), item: { id, title: itemName, category } }));
    setItemName('');
    setShowAddItemModal(false);
  };

  // Define the handleAddItem function
  const handleAddItem = (containerId: UniqueIdentifier) => {
    setCurrentContainerId(containerId);
    setShowAddItemModal(true);
  };


  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === 'container') {
      return containers.find((item) => item.id === id);
    }
    if (type === 'item') {
      return containers.find((container) =>
        container.items.find((item) => item.id === id),
      );
    }
  }

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.title;
  };

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return '';
    return container.title;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return [];
    return container.items;
  };

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (active.id.toString().includes('item') && over?.id.toString().includes('item') && active && over && active.id !== over.id) {
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'item');

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
      const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

      const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);
      const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id);

      if (activeContainerIndex === overContainerIndex) {
        dispatch(moveItemWithinContainer({ containerId: activeContainer.id, fromIndex: activeitemIndex, toIndex: overitemIndex }));
      } else {
        dispatch(moveItemToDifferentContainer({ fromContainerId: activeContainer.id, toContainerId: overContainer.id, fromIndex: activeitemIndex, toIndex: overitemIndex }));
      }
    }

    if (active.id.toString().includes('item') && over?.id.toString().includes('container') && active && over && active.id !== over.id) {
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'container');

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
      const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

      const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);

      dispatch(moveItemToDifferentContainer({ fromContainerId: activeContainer.id, toContainerId: overContainer.id, fromIndex: activeitemIndex, toIndex: overContainer.items.length }));
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id.toString().includes('container') && over?.id.toString().includes('container') && active && over && active.id !== over.id) {
      const activeContainerIndex = containers.findIndex((container) => container.id === active.id);
      const overContainerIndex = containers.findIndex((container) => container.id === over.id);
      dispatch(moveContainer({ fromIndex: activeContainerIndex, toIndex: overContainerIndex }));
    }

    if (active.id.toString().includes('item') && over?.id.toString().includes('item') && active && over && active.id !== over.id) {
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'item');

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
      const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

      const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);
      const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id);

      if (activeContainerIndex === overContainerIndex) {
        dispatch(moveItemWithinContainer({ containerId: activeContainer.id, fromIndex: activeitemIndex, toIndex: overitemIndex }));
      } else {
        dispatch(moveItemToDifferentContainer({ fromContainerId: activeContainer.id, toContainerId: overContainer.id, fromIndex: activeitemIndex, toIndex: overitemIndex }));
      }
    }

    if (active.id.toString().includes('item') && over?.id.toString().includes('container') && active && over && active.id !== over.id) {
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'container');

      if (!activeContainer || !overContainer) return;

      const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
      const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

      const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);

      dispatch(moveItemToDifferentContainer({ fromContainerId: activeContainer.id, toContainerId: overContainer.id, fromIndex: activeitemIndex, toIndex: overContainer.items.length }));
    }
    setActiveId(null);
  }

  //edit and delete functions

  const handleEditContainer = (id: string, title: string) => {
    setEditContainerId(id);
    setEditContainerTitle(title);
    setShowEditContainerModal(true);
  };

  const handleEditItem = (id: string, title: string, category: string) => {
    setEditItemId(id);
    setEditItemTitle(title);
    setEditItemCategory(category);
    setShowEditItemModal(true);
  };

  const handleDeleteContainer = (id: string) => {
    dispatch(deleteContainer(id));
  };

  const handleDeleteItem = (id: string) => {
    dispatch(deleteItem(id));
  };


  return (
    <div className="mx-auto max-w-7xl py-10 ">
      {/* Add Container Modal */}
      <Modal
        showModal={showAddContainerModal}
        setShowModal={setShowAddContainerModal}
      >
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-3xl font-bold">Add Container</h1>
          <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onAddContainer)}
            className='flex flex-col w-full items-start gap-y-4'
            >
              <FormField
              control={form.control}
              name="containername"
              render={({ field }) => (
                <Input
                  type="text"
                  className='border p-2 w-full rounded-lg shadow-lg hover:shadow-xl'
                  placeholder="Container Title"
                  name="containername"
                  value={containerName}
                  onChange={(e) => setContainerName(e.target.value)}
                />
              )}
              />

            <Button type='submit'>Add container</Button>

            </form>
          </Form>
          
        </div>
      </Modal>

      {/* Add Item Modal */}
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
          <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onAddItem)}
            className='flex flex-col w-full items-start gap-y-4'
            >
              <FormField
              control={form.control}
              name="itemname"
              render={({ field }) => (
                <Input
                  type="text"
                  className='border p-2 w-full rounded-lg shadow-lg hover:shadow-xl'
                  placeholder="Item Title"
                  name="itemname"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              )}
              />

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className='w-full rounded-lg shadow-lg hover:shadow-xl'>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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


              <Button type='submit'>Add Item</Button>
            </form>
          </Form>
        </div>
      </Modal>

      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-gray-800 text-3xl font-bold">Your Kanban</h1>
        <Button onClick={() => setShowAddContainerModal(true)}>
          Add Container
        </Button>
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-4 gap-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={containers.map((i) => i.id)}>
              {containers.map((container) => (
                <Container
                  id={container.id}
                  title={container.title}
                  key={container.id}
                  setShowEditContainerModal={setShowEditContainerModal}
                  handleEditContainer={handleEditContainer}
                  handleDeleteContainer={handleDeleteContainer}
                  onAddItem={() => {
                    setShowAddItemModal(true);
                    setCurrentContainerId(container.id);
                    handleAddItem(container.id);
                  }}
                >
                  <SortableContext items={container.items.map((i) => i.id)}>
                    <div className="flex items-start flex-col gap-y-4">
                      {container.items.map((i) => (
                          <div key={i.id} className="flex items-center justify-between w-full">
                            <Items 
                            title={i.title} 
                            category={i.category} 
                            id={i.id} 
                            key={i.id}
                            handleEditItem={handleEditItem}
                            handleDeleteItem={handleDeleteItem}
                            setShowEditItemModal={setShowEditItemModal} 
                            />
                            {/* <div className="flex items-center gap-2">
                              <Button onClick={() => handleEditItem(i.id, i.title, i.category)}>Edit</Button>
                              <Button onClick={() => handleDeleteItem(i.id)}>Delete</Button>
                            </div> */}
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              ))}
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes('item') && (
                <Items id={activeId} title={findItemTitle(activeId)} category={findItemTitle(activeId)} setShowEditItemModal={setShowEditItemModal} handleEditItem={handleEditItem} handleDeleteItem={handleAddItem}/>
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes('container') && (
                <Container id={activeId} title={findContainerTitle(activeId)} setShowEditContainerModal={setShowEditContainerModal} handleEditContainer={handleEditContainer} handleDeleteContainer={handleDeleteContainer}>
                  {findContainerItems(activeId).map((i) => (
                    <Items key={i.id} title={i.title} id={i.id} category={i.category} setShowEditItemModal={setShowEditItemModal} handleEditItem={handleEditItem} handleDeleteItem={handleAddItem}/>
                  ))}
                </Container>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
        
        {/* Edit Container Modal */}
        <EditContainerModal
          showModal={showEditContainerModal}
          setShowModal={setShowEditContainerModal}
          containerId={editContainerId}
          containerTitle={editContainerTitle}
        />

        {/* Edit Item Modal */}
        <EditItemModal
          showModal={showEditItemModal}
          setShowModal={setShowEditItemModal}
          itemId={editItemId}
          itemTitle={editItemTitle}
          itemCategory={editItemCategory}
        />

        
    </div>
  );
}