'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Devices() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/auth/session', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) {
          setError(result.error || 'Failed to fetch sessions');
          return;
        }
        setSessions(result.sessions);
      } catch (err) {
        setError('An error occurred');
      }
    };
    fetchSessions();
  }, [router]);

  const handleRevoke = async (sessionId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/auth/session', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sessionId }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || 'Failed to revoke session');
        return;
      }
      setSessions(sessions.filter((session) => session.id !== sessionId));
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <Card className="mx-auto max-w-2xl mt-10">
      <CardHeader>
        <CardTitle>Manage Devices</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {sessions.length === 0 ? (
          <p>No active sessions</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.device.deviceName} ({session.device.deviceType})</TableCell>
                  <TableCell>{session.device.location}</TableCell>
                  <TableCell>{new Date(session.device.lastActiveAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleRevoke(session.id)}
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}