import { useCallback, useEffect, useState } from 'react';
import PermissionsService from './PermissionsService';
import type { PermissionAlias, PermissionResult, NotificationOptions } from './types';

export interface UsePermissionReturn {
  status: PermissionResult;
  isGranted: boolean;
  loading: boolean;
  check: () => Promise<void>;
  request: (opts?: NotificationOptions) => Promise<void>;
  ensure: (opts?: { openSettingsIfBlocked?: boolean; notificationOptions?: NotificationOptions }) => Promise<boolean>;
  openSettings: () => Promise<void>;
}

export function usePermission(alias: PermissionAlias): UsePermissionReturn {
  const [status, setStatus] = useState<PermissionResult>('unavailable');
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const res = await PermissionsService.checkAlias(alias);
      setStatus(res.status);
      setIsGranted(res.isGranted);
    } finally {
      setLoading(false);
    }
  }, [alias]);

  const request = useCallback(async (notificationOptions?: NotificationOptions) => {
    setLoading(true);
    try {
      const res = await PermissionsService.requestAlias(alias, notificationOptions);
      setStatus(res.status);
      setIsGranted(res.isGranted);
    } finally {
      setLoading(false);
    }
  }, [alias]);

  const ensure = useCallback(async (opts?: { openSettingsIfBlocked?: boolean; notificationOptions?: NotificationOptions }) => {
    setLoading(true);
    try {
      const ok = await PermissionsService.ensureAlias(alias, { openSettingsIfBlocked: opts?.openSettingsIfBlocked });
      const res = await PermissionsService.checkAlias(alias);
      setStatus(res.status);
      setIsGranted(res.isGranted);
      return ok;
    } finally {
      setLoading(false);
    }
  }, [alias]);

  const openSettings = useCallback(async () => {
    await PermissionsService.openSettings();
  }, []);

  useEffect(() => {
    // 初始化时检查一次
    check();
  }, [check]);

  return { status, isGranted, loading, check, request, ensure, openSettings };
}

export default usePermission;