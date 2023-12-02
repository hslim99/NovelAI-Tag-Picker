import React, { CSSProperties, PointerEventHandler, PropsWithChildren } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface Props {
  id: UniqueIdentifier;
  overlay: boolean;
}

const SortableItem = ({ children, id, overlay = false }: PropsWithChildren<Props>) => {
  const { attributes, isDragging, listeners, setNodeRef, transition } = useSortable({ id });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : undefined,
    transition,
  };

  const { onPointerDown } = listeners as SyntheticListenerMap;
  const handlePointerDown = onPointerDown as PointerEventHandler<HTMLDivElement>;

  return (
    <div
      className={`nai-tag${overlay ? ' nai-tag-overlay' : ''}`}
      ref={setNodeRef}
      style={style}
      onPointerDown={handlePointerDown}
      {...attributes}>
      {children}
    </div>
  );
};

export { SortableItem };
