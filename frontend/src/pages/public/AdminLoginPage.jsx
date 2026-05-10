import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: 'onChange' });

  return (
    <div className="section-padding">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <PageHeader
          eyebrow="Admin access"
          title="Sign in to the admin dashboard"
          description="Manage events, users, bookings, and analytics."
        />
        <Card>
          <form className="space-y-4" onSubmit={handleSubmit(loginAdmin)}>
            <Input
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />
            <Button type="submit" disabled={isSubmitting || !isValid} className="w-full">
              Login
            </Button>
            <p className="text-sm text-slate-400">
              Need an admin account?{' '}
              <Link className="text-accent-300" to="/admin/register">
                Request access
              </Link>
            </p>
            <p className="text-sm text-slate-400">
              User login:{' '}
              <Link className="text-accent-300" to="/login">
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
