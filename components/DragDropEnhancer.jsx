'use client';

import { useEffect } from 'react';

export default function DragDropEnhancer() {
  useEffect(() => {
    let dragged = null;
    let over = null;

    const style = document.createElement('style');
    style.textContent = `
      .canvas .edit-block[draggable="true"] { cursor: grab !important; transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease; }
      .canvas .edit-block.dragging-block { opacity: .55; transform: scale(.99); box-shadow: 0 12px 28px rgba(17,24,39,.12); cursor: grabbing !important; }
      .canvas .edit-block.drag-over-top { border-top: 3px solid #2563eb !important; margin-top: 8px; }
      .canvas .edit-block.drag-over-bottom { border-bottom: 3px solid #2563eb !important; margin-bottom: 8px; }
      .canvas .edit-block[draggable="true"] .block-head { cursor: grab; user-select: none; }
      .canvas .edit-block[draggable="true"] .block-head b::before { content: '☰ '; color: #98a2b3; font-weight: 900; }
    `;
    document.head.appendChild(style);

    const getBlocks = () => Array.from(document.querySelectorAll('.canvas .edit-block'));
    const prepare = () => getBlocks().forEach((block) => block.setAttribute('draggable', 'true'));

    const clear = () => {
      getBlocks().forEach((el) => el.classList.remove('dragging-block', 'drag-over-top', 'drag-over-bottom'));
      dragged = null;
      over = null;
    };

    const onDragStart = (e) => {
      const block = e.target.closest('.canvas .edit-block');
      if (!block || e.target.closest('button, input, textarea, select, a, label')) return;
      dragged = block;
      block.classList.add('dragging-block');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'adpage-block');
    };

    const onDragOver = (e) => {
      if (!dragged) return;
      const block = e.target.closest('.canvas .edit-block');
      if (!block || block === dragged) return;
      e.preventDefault();
      over = block;
      getBlocks().forEach((el) => el.classList.remove('drag-over-top', 'drag-over-bottom'));
      const r = block.getBoundingClientRect();
      block.classList.add(e.clientY < r.top + r.height / 2 ? 'drag-over-top' : 'drag-over-bottom');
      e.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (e) => {
      if (!dragged || !over || dragged === over) return clear();
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
      if (!moveButton || moveButton.disabled) return clear();
      for (let i = 0; i < Math.abs(steps); i += 1) moveButton.click();
      setTimeout(clear, 160);
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
      style.remove();
      getBlocks().forEach((el) => el.removeAttribute('draggable'));
    };
  }, []);

  return null;
}
