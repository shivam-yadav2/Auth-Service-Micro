'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
    profilePicture: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    if (formData.email) data.append('email', formData.email);
    if (formData.phone) data.append('phone', formData.phone);
    data.append('password', formData.password);
    if (formData.name) data.append('name', formData.name);
    if (formData.profilePicture) data.append('profilePicture', formData.profilePicture);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || 'Failed to register');
        return;
      }
      setSuccess(result.message);
      router.push('/verify-otp'); // Redirect to OTP verification
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <Card className="mx-auto max-w-md mt-10">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
            <Input
              id="profilePicture"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={(e) => setFormData({ ...formData, profilePicture: e.target.files?.[0] || null })}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
      </CardContent>
    </Card>
  );
}