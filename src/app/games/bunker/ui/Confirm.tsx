'use client';
import React from 'react';
import { Modal } from 'shared/ui/Modal';

export function Confirm({
  open, onClose, title='Подтверждение', message, onConfirm, confirmLabel='Подтвердить'
}:{
  open:boolean; onClose:()=>void; title?:string; message:React.ReactNode;
  onConfirm:()=>void; confirmLabel?:string;
}){
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="text-sm text-gray-200">{message}</div>
      <div className="text-right mt-4">
        <button className="btn" onClick={onClose}>Отмена</button>
        <button className="btn btn-primary ml-2" onClick={()=>{ onConfirm(); onClose(); }}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
