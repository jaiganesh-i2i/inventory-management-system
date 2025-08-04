// Role-based authorization utilities
import { User } from '../types';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'user';

// Define permissions for different features
export interface Permission {
  resource: string;
  actions: string[];
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'inventory', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'products', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'categories', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'warehouses', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'transactions', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'users', actions: ['read', 'create', 'update', 'delete'] },
    { resource: 'reports', actions: ['read', 'export'] },
    { resource: 'settings', actions: ['read', 'update'] },
    { resource: 'alerts', actions: ['read', 'create', 'update', 'delete'] },
  ],
  manager: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'inventory', actions: ['read', 'create', 'update'] },
    { resource: 'products', actions: ['read', 'create', 'update'] },
    { resource: 'categories', actions: ['read', 'create', 'update'] },
    { resource: 'warehouses', actions: ['read', 'create', 'update'] },
    { resource: 'transactions', actions: ['read', 'create', 'update'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'reports', actions: ['read', 'export'] },
    { resource: 'settings', actions: ['read'] },
    { resource: 'alerts', actions: ['read', 'update'] },
  ],
  user: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'inventory', actions: ['read'] },
    { resource: 'products', actions: ['read'] },
    { resource: 'categories', actions: ['read'] },
    { resource: 'warehouses', actions: ['read'] },
    { resource: 'transactions', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'alerts', actions: ['read'] },
  ],
};

// Menu items with role requirements
export interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: { resource: string; action: string };
  children?: MenuItem[];
}

// Check if user has permission for a specific resource and action
export const hasPermission = (user: User | null, resource: string, action: string): boolean => {
  if (!user) return false;
  
  const userRole = user.role as UserRole;
  const permissions = ROLE_PERMISSIONS[userRole];
  
  if (!permissions) return false;
  
  const resourcePermission = permissions.find(p => p.resource === resource);
  if (!resourcePermission) return false;
  
  return resourcePermission.actions.includes(action);
};

// Check if user has any permission for a resource
export const hasAnyPermission = (user: User | null, resource: string): boolean => {
  if (!user) return false;
  
  const userRole = user.role as UserRole;
  const permissions = ROLE_PERMISSIONS[userRole];
  
  if (!permissions) return false;
  
  return permissions.some(p => p.resource === resource);
};

// Check if user has role
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role as UserRole);
};

// Get user's role level (admin = 3, manager = 2, user = 1)
export const getRoleLevel = (role: UserRole): number => {
  const roleLevels: Record<UserRole, number> = {
    admin: 3,
    manager: 2,
    user: 1,
  };
  return roleLevels[role] || 0;
};

// Check if user has minimum role level
export const hasMinimumRole = (user: User | null, minimumRole: UserRole): boolean => {
  if (!user) return false;
  const userRoleLevel = getRoleLevel(user.role as UserRole);
  const minimumRoleLevel = getRoleLevel(minimumRole);
  return userRoleLevel >= minimumRoleLevel;
};

// Filter menu items based on user permissions
export const filterMenuItems = (menuItems: MenuItem[], user: User | null): MenuItem[] => {
  return menuItems.filter(item => {
    // Check role requirement
    if (item.requiredRole && !hasRole(user, item.requiredRole)) {
      return false;
    }
    
    // Check permission requirement
    if (item.requiredPermission) {
      const { resource, action } = item.requiredPermission;
      if (!hasPermission(user, resource, action)) {
        return false;
      }
    }
    
    // Recursively filter children
    if (item.children) {
      item.children = filterMenuItems(item.children, user);
    }
    
    return true;
  });
};

// Get user's display name
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Guest';
  return user.username || user.email || 'Unknown User';
};

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    user: 'User',
  };
  return roleNames[role] || role;
};

// Get role color for UI
export const getRoleColor = (role: UserRole): string => {
  const roleColors: Record<UserRole, string> = {
    admin: '#f44336', // Red
    manager: '#ff9800', // Orange
    user: '#2196f3', // Blue
  };
  return roleColors[role] || '#757575';
}; 