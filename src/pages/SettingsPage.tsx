import { useState, useCallback } from 'react';
import { useBlocker } from 'react-router';
import { PageHeader } from '@/components/shared';
import { ProfileSettingsForm, UnsavedChangesDialog } from '@/components/settings';

export default function SettingsPage() {
  const [dirtyForms, setDirtyForms] = useState<Record<string, boolean>>({});
  const isAnyDirty = Object.values(dirtyForms).some(Boolean);
  const blocker = useBlocker(isAnyDirty);

  const handleDirtyChange = useCallback((key: string, dirty: boolean) => {
    setDirtyForms((prev) => ({ ...prev, [key]: dirty }));
  }, []);

  return (
    <div className="py-7 space-y-4">
      <PageHeader title="Settings" subtitle="Manage your account and system preferences" />

      <ProfileSettingsForm onDirtyChange={(dirty) => handleDirtyChange('profile', dirty)} />

      <UnsavedChangesDialog
        open={blocker.state === 'blocked'}
        onConfirm={() => blocker.proceed?.()}
        onCancel={() => blocker.reset?.()}
      />
    </div>
  );
}
