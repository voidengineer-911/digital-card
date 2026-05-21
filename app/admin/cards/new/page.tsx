import { CardForm } from '@/components/admin/CardForm';
import { createCardAction } from './actions';

export default function NewCardPage() {
  return (
    <>
      <h1 className="font-serif italic text-[32px] text-ink mb-8">New card</h1>
      <CardForm action={createCardAction} submitLabel="CREATE" />
    </>
  );
}
