import { useAppStore, ROLES, isAdmin, isSuperAdmin, hasAdminAccess, hasSuperAdminAccess } from '../store/appStore';

export const useUserRole = () => {
  const { currentUser, isAuthenticated } = useAppStore();

  const userRole = currentUser?.roleId;
  const userRoleName = currentUser?.roleName;

  return {
    // User info
    currentUser,
    isAuthenticated,
    userRole,
    userRoleName,
    
    // Role checking functions
    isAdmin: userRole ? isAdmin(userRole) : false,
    isSuperAdmin: userRole ? isSuperAdmin(userRole) : false,
    hasAdminAccess: userRole ? hasAdminAccess(userRole) : false,
    hasSuperAdminAccess: userRole ? hasSuperAdminAccess(userRole) : false,
    
    // Role constants for easy access
    ROLES,
    
    // Helper function to check specific role
    hasRole: (roleId: number) => userRole === roleId,
    
    // Helper function to check minimum role level
    hasMinimumRole: (minimumRoleId: number) => {
      if (!userRole) return false;
      // Higher role ID means higher permissions in this case
      return userRole >= minimumRoleId;
    },
  };
};

export default useUserRole;
