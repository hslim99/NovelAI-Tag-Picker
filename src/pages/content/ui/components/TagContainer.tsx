import React, { useEffect, useState } from 'react';
import { DndContext, UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { customCollisionDetectionAlgorithm } from '../utils/collision';
import FlipMove from 'react-flip-move';
import { SortableOverlay } from './SortableOverlay';

type Tag = {
  id: UniqueIdentifier;
};

const TagContainer = ({ textarea }: { textarea: HTMLTextAreaElement }) => {
  const [tags, setTags] = useState<Tag[]>([
    { id: 'masterpiece' },
    { id: '1girl' },
    { id: '1boy' },
    { id: 'best quality' },
    { id: 'amazing quality' },
    { id: 'very aesthetic' },
    { id: 'highres' },
    { id: 'incredibly absurdres' },
  ]);
  const [activeItem, setActiveItem] = useState<Tag | null>(null);
  const [prevTags, setPrevTags] = useState<Tag[]>([]);
  const [applyChanges, setApplyChanges] = useState<boolean>(true);

  useEffect(() => {
    textarea.value = tags.map(({ id }) => id).join(', ');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }, [tags]);

  const renderItem = (item: Tag, overlay = false) => (
    <SortableItem id={item.id} overlay={overlay}>
      {item.id}
    </SortableItem>
  );

  const handleDragStart = ({ active }) => {
    setActiveItem({ id: active.id });
  };

  const handleDragOver = ({ active, over }) => {
    if (over && active.id !== over?.id) {
      const activeIndex = tags.findIndex(({ id }) => id === active.id);
      const overIndex = tags.findIndex(({ id }) => id === over.id);
      const deleteIndex = activeIndex < overIndex ? overIndex - 1 : overIndex;
      setTags(prev => {
        const newTags = [...prev];
        const activeTag = prev[activeIndex];
        newTags.splice(activeIndex, 1);
        newTags.splice(deleteIndex, 0, activeTag);
        return newTags;
      });
    } else {
      setTags(prev => {
        const activeIndex = tags.findIndex(({ id }) => id === active.id);
        const newTags = [...prev];
        const activeTag = prev[activeIndex];
        newTags.splice(activeIndex, 1);
        newTags.push(activeTag);
        return newTags;
      });
    }
  };

  const handleDragEnd = () => {
    setActiveItem(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragEnd}
      collisionDetection={customCollisionDetectionAlgorithm}>
      <SortableContext items={tags}>
        <FlipMove className="nai-tag-container" duration={150} easing="cubic-bezier(0.42, 0.0, 0.58, 1.0)">
          {tags.map(v => (
            <div key={v.id}>{renderItem(v)}</div>
          ))}
        </FlipMove>
      </SortableContext>
      <SortableOverlay>{activeItem ? renderItem(activeItem, true) : null}</SortableOverlay>
    </DndContext>
  );
};

export { TagContainer };
