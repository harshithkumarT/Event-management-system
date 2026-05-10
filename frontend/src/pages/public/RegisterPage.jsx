import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function RegisterPage() {
  const { register: registerAccount } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm({ mode: 'onChange' });

  return (
    <div className="section-padding">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <PageHeader eyebrow="Create account" title="Join EventFlow" description="Start booking events and managing your profile in minutes." />
        <Card>
          <form className="space-y-4" onSubmit={handleSubmit(registerAccount)}>
            <Input label="Full name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
            <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
            <Input label="Password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} error={errors.password?.message} />
            <Button type="submit" disabled={isSubmitting || !isValid} className="w-full">Create account</Button>
            <p className="text-sm text-slate-400">
              Already have an account? <Link className="text-accent-300" to="/login">Sign in</Link>
            </p>
            <p className="text-sm text-slate-400">
              Need admin access?{' '}
              <Link className="text-accent-300" to="/admin/register">
                Request admin access
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}