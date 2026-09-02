'use client';

import { useEffect } from 'react';

export default function DragDropEnhancer() {
  useEffect(() => {
    let dragged = null;
    let over = null;

    const getBlocks = () => Array.from(document.querySelectorAll('.canvas .edit-block'));

    const prepare = () => {
      getBlocks().forEach((block) => {
        block.setAttribute('draggable', 'true');
        block.style.cursor = 'grab';
      });
    };

    const clear = () => {
      getBlocks().forEach((el) => {
        el.classList.remove('dragging-block', 'drag-over-top', 'drag-over-bottom');
        el.style.cursor = 'grab';
      });
      dragged = null;
      over = null;
    };

    const onDragStart = (e) => {
      const block = e.target.closest('.canvas .edit-block');
      if (!block) return;
      if (e.target.closest('button, input, textarea, select, a, label')) {
        e.preventDefault();
        return;
      }
      dragged = block;
      block.classList.add('dragging-block');
      block.style.cursor = 'grabbing';
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
      const controls = dragged.querySelectorAll('.block-head button');
      const moveButton = steps < 0 ? controls[0] : controls[1];
      if (!moveButton) return clear();
      for (let i = 0; i < Math.abs(steps); i += 1) moveButton.click();
      setTimeout(clear, 120);
    };

    prepare();
    const observer = new MutationObserver(prepare);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
    document.addEventListener('dragend', clear);

    return () => {
      observer.disconnect();
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDrop);
      document.querySelectorAll('.canvas .edit-block').forEach((el) => el.removeAttribute('draggable'));
    };
  }, []);

  return null;
}
