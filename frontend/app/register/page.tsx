/**
 * Redirect to new signup page using Better Auth
 */

import { redirect } from 'next/navigation';

export default function RegisterPage() {
  redirect('/signup');
}