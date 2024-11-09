// create-role.dto.ts
export class CreateRoleDto {
  name: string;
  description?: string;
}

// update-role.dto.ts
export class UpdateRoleDto {
  name?: string;
  description?: string;
}