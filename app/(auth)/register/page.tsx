import { RegisterForm } from '../_components/RegisterForm';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function RegisterPage() {
  return (
    <RouteGuard redirectTo="/dashboard">
      <RegisterForm />
    </RouteGuard>
  );
}

