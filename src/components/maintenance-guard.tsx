import React from 'react';
import { useMaintenance } from '../hooks/use-maintenance';
import MaintenanceScreen from './maintenance-screen';
import BrandedLoader from './BrandedLoader';

interface MaintenanceGuardProps {
  pageId: string;
  children: React.ReactNode;
}

export default function MaintenanceGuard({ pageId, children }: MaintenanceGuardProps) {
  const { status, loading } = useMaintenance(pageId);
  const { status: globalStatus, loading: globalLoading } = useMaintenance('global');

  if (loading || globalLoading) return <BrandedLoader />;

  if (globalStatus?.is_active) {
    return (
      <MaintenanceScreen 
        messageAr={globalStatus.message_ar} 
        messageEn={globalStatus.message_en} 
        expectedReturn={globalStatus.expected_return} 
      />
    );
  }

  if (status?.is_active) {
    return (
      <MaintenanceScreen 
        messageAr={status.message_ar} 
        messageEn={status.message_en} 
        expectedReturn={status.expected_return} 
      />
    );
  }

  return <>{children}</>;
}
