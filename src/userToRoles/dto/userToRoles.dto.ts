// dto/create-user-to-role.dto.ts
export class CreateUserToRoleDto {
  userId: string;
  roleId: string;
}

// dto/update-user-to-role.dto.ts
export class UpdateUserToRoleDto {
  userId?: string;
  roleId?: string;
}

// dto/user-to-role-response.dto.ts
export class UserToRoleResponseDto {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
}
