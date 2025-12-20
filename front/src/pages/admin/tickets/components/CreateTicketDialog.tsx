import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { useTickets } from '../TicketsProvider';
export const CreateTicketDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const { addTicket } = useTickets();
  const handleCreate = () => {
    if (title && initialMessage) {
      addTicket({
        title,
        status: 'در انتظار',
        creator: 'ادمین',
        initialMessage,
      });
      setTitle('');
      setInitialMessage('');
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>ایجاد تیکت جدید</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد تیکت جدید</DialogTitle>
        </DialogHeader>
        <Input placeholder="عنوان تیکت" value={title} onChange={e => setTitle(e.target.value)} />
        <Textarea placeholder="پیام اولیه" value={initialMessage} onChange={e => setInitialMessage(e.target.value)} />
        <Button onClick={handleCreate}>ایجاد</Button>
      </DialogContent>
    </Dialog>
  );
};