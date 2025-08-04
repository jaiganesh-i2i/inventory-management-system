import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission, hasRole, hasMinimumRole, UserRole } from '../../utils/roles';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: { resource: string; action: string };
  minimumRole?: UserRole;
  fallback?: React.ReactNode;
}

export default function PermissionGuard({
  children,
  requiredRole,
  requiredPermission,
  minimumRole,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuth();

  // Check role requirement
  if (requiredRole && !hasRole(user, requiredRole)) {
    return <>{fallback}</>;
  }

  // Check minimum role requirement
  if (minimumRole && !hasMinimumRole(user, minimumRole)) {
    return <>{fallback}</>;
  }

  // Check permission requirement
  if (requiredPermission) {
    const { resource, action } = requiredPermission;
    if (!hasPermission(user, resource, action)) {
      return <>{fallback}</>;
    }
  }

  // User has required permissions, render the component
  return <>{children}</>;
}

// Convenience components for common permission checks
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requiredRole="admin" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManagerOrAdmin({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard minimumRole="manager" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanCreate({ resource, children, fallback }: { 
  resource: string; 
  children: React.ReactNode; 
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGuard requiredPermission={{ resource, action: 'create' }} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanUpdate({ resource, children, fallback }: { 
  resource: string; 
  children: React.ReactNode; 
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGuard requiredPermission={{ resource, action: 'update' }} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanDelete({ resource, children, fallback }: { 
  resource: string; 
  children: React.ReactNode; 
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGuard requiredPermission={{ resource, action: 'delete' }} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanRead({ resource, children, fallback }: { 
  resource: string; 
  children: React.ReactNode; 
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGuard requiredPermission={{ resource, action: 'read' }} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
} 