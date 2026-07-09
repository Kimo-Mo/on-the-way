import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import type { User } from '@/types/users';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';
import { Card, CardContent } from '../ui';

interface UsersTableProps {
  users: User[];
  onViewDetails: (userId: string) => void;
}

export const UsersTable = ({ users, onViewDetails }: UsersTableProps) => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'trustScore', label: 'Trust Score' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <Card>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} className="w-auto whitespace-nowrap">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  {/* Backend returns `name`, not `fullName` */}
                  <TableCell className="whitespace-nowrap">{user.name ?? '—'}</TableCell>
                  <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <UserRoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{user.trustScore}%</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Button
                      onClick={() => onViewDetails(user.id)}
                      aria-label={`View details for ${user.name ?? 'user'}`}>
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
