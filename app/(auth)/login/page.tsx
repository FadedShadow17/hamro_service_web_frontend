import { LoginForm } from '../_components/LoginForm';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function LoginPage() {
  return (
    <RouteGuard redirectTo="/dashboard">
      <LoginForm />
    </RouteGuard>
  );
}

