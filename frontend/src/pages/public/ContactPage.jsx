import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/common/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async () => {
    toast.success('Your message was sent');
    reset();
  };

  return (
    <div className="section-padding">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <PageHeader eyebrow="Contact" title="Talk to the team" description="Use this form for sales, support, and partnership questions." />
        <Card>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
            <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
            <Input label="Message" {...register('message', { required: 'Message is required' })} error={errors.message?.message} />
            <Button type="submit" disabled={isSubmitting}>Send message</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}