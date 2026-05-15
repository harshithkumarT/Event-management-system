import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import http from '../../api/http';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: 'onChange' });

  const submitRequest = async (payload) => {
    try {
      const { data } = await http.post('/auth/register', {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: 'admin',
      });

      const nextUser = data.data.user;

      if (nextUser?.role === 'admin') {
        toast.success('Admin account created! Redirecting...');
        navigate('/admin/login');
      } else {
        toast.error('Admin account creation failed. Please try again.');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Admin registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="section-padding">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <PageHeader
          eyebrow="Admin access"
          title="Request an admin account"
          description="Create an admin account to manage events, users, and bookings."
        />
        <Card>
          <form className="space-y-4" onSubmit={handleSubmit(submitRequest)}>
            <Input label="Full name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
            <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
            <Input
              label="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
              error={errors.password?.message}
            />
            <Button type="submit" disabled={isSubmitting || !isValid} className="w-full">
              Create account
            </Button>
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link className="text-accent-300" to="/admin/login">
                Admin login
              </Link>
            </p>
            <p className="text-sm text-slate-400">
              User signup:{' '}
              <Link className="text-accent-300" to="/register">
                Create a user account
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
