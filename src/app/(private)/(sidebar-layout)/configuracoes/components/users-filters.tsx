'use client';

import { Search } from 'lucide-react';
import useTranslator from '@/hooks/use-translator';
import * as Input from '@/components/common/input';
import { Select, SelectItem } from '@/components/common/select';

interface UsersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export const UsersFilters = ({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
}: UsersFiltersProps) => {
  const { t } = useTranslator();

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between w-full">
      <div className="flex-1 max-w-md">
        <Input.Root>
          <Input.Prefix>
            <Search className="h-4 w-4 text-zinc-400" />
          </Input.Prefix>
          <Input.Control
            placeholder={t('search-users')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Input.Root>
      </div>

      <div className="flex flex-row gap-3">
        <div className="w-44">
          <Select
            placeholder={t('filter-all-roles')}
            value={role}
            onValueChange={onRoleChange}
          >
            <SelectItem text={t('filter-all-roles')} value="all" />
            <SelectItem text={t('role-admin')} value="admin" />
            <SelectItem text={t('role-secretary')} value="secretary" />
            <SelectItem text={t('role-pastoral_agent')} value="pastoral_agent" />
            <SelectItem text={t('role-viewer')} value="viewer" />
          </Select>
        </div>

        <div className="w-44">
          <Select
            placeholder={t('filter-all-status')}
            value={status}
            onValueChange={onStatusChange}
          >
            <SelectItem text={t('filter-all-status')} value="all" />
            <SelectItem text={t('status-active')} value="active" />
            <SelectItem text={t('status-suspended')} value="suspended" />
            <SelectItem text={t('status-pending')} value="pending" />
          </Select>
        </div>
      </div>
    </div>
  );
};
