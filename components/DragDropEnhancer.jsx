'use client';

import { useEffect } from 'react';

export default function DragDropEnhancer() {
  useEffect(() => {
    let dragged = null;
    let over = null;

    const getBlocks = () => Array.from(document.querySelectorAll('.canvas .edit-block'));

    const clear = () => {
      getBlocks().forEach((el) => el.classList.remove('dragging-block', 'drag-over-top', 'drag-over-bottom'));
      dragged = null;
      over = null;
    };

    const onDragStart = (e) => {
      const handle = e.target.closest('.drag-handle');
      if (!handle) return;
      const block = handle.closest('.edit-block');
      if (!block) return;
      dragged = block;
      block.classList.add('dragging-block');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', block.dataset.blockId || 'block');
    };

    const onDragOver = (e) => {
      if (!dragged) return;
      const block = e.target.closest('.canvas .edit-block');
      if (!block || block === dragged) return;
      e.preventDefault();
      over = block;
      getBlocks().forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
      const rect = block.getBoundingClientRect();
      block.classList.add(e.clientY < rect.top + rect.height / 2 ? 'drag-over-top' : 'drag-over-bottom');
      e.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (e) => {
      if (!dragged || !over || dragged === over) return;
      e.preventDefault();

      const blocks = getBlocks();
      const from = blocks.indexOf(dragged);
      const target = blocks.indexOf(over);
      if (from < 0 || target < 0) return clear();

      const before = e.clientY < over.getBoundingClientRect().top + over.getBoundingClientRect().height / 2;
      let desired = before ? target : target + 1;
      if (from < desired) desired -= 1;
      const steps = desired - from;
      if (!steps) return clear();

      const buttons = dragged.querySelectorAll('.block-head button');
      const up = buttons[0];
      const down = buttons[1];
      const button = steps < 0 ? up : down;
      if (!button) return clear();

      for (let i = 0; i < Math.abs(steps); i += 1) button.click();
      setTimeout(clear, 80);
    };

    const onDragEnd = clear;

    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
    document.addEventListener('dragend', onDragEnd);

    return () => {
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDrop);
      document.removeEventListener('dragend', onDragEnd);
    };
  }, []);

  return null;
}
