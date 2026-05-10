import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { name: user?.name || '' } });

  return (
    <div>
      <PageHeader eyebrow="My profile" title="Personal information" description="Update your profile details and avatar URL." />
      <Card className="max-w-2xl">
        <form className="space-y-4" onSubmit={handleSubmit(updateProfile)}>
          <Input label="Name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
          <Input label="Profile image URL" {...register('profileImage')} placeholder="https://..." />
          <Button type="submit" disabled={isSubmitting}>Save changes</Button>
        </form>
      </Card>
    </div>
  );
}