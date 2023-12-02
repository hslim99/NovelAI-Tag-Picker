import { ClientRect, CollisionDetection } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/utilities";

const MARGIN = 2;

export const customCollisionDetectionAlgorithm: CollisionDetection = (args) => {
  const { active, droppableContainers, pointerCoordinates } = args;
  const { x, y } = pointerCoordinates as Coordinates;

  droppableContainers.sort(
    (a, b) =>
      a?.data?.current?.sortable.index - b?.data?.current?.sortable.index
  );

  const droppableElements = droppableContainers.filter(
    ({ id }) => id !== active.id
  );

  const closestElement: { offset: number; element?: Element } =
    droppableElements.reduce(
      (closest, droppable, index) => {
        const {
          rect: { current: rectRef },
        } = droppable;
        const rect = rectRef as ClientRect;
        const inRow =
          y - (rect.bottom + MARGIN) <= 0 && y - (rect.top - MARGIN) >= 0;
        const offset = x - (rect.left - MARGIN + (rect.width + MARGIN * 2) / 2);
        if (inRow) {
          if (offset < 0 && offset > closest.offset) {
            return {
              offset: offset,
              element: droppable,
            };
          } else {
            if (droppableElements[index + 1]) {
              const {
                rect: { current: nextRectRef },
              } = droppableElements[index + 1];
              const nextRect = nextRectRef as ClientRect;
              if (
                y - (nextRect.top - MARGIN) <= 0 &&
                closest.offset === Number.NEGATIVE_INFINITY
              ) {
                return {
                  offset: 0,
                  element: droppableElements[index + 1],
                };
              }
            }
            return closest;
          }
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
      }
    );

  if (!closestElement.element) {
    return [];
  }

  const collision = {
    id: closestElement.element.id,
    data: {
      droppableContainer: closestElement.element,
      value: closestElement.offset,
    },
  };

  return [collision];
};
