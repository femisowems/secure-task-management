import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole, ActionType } from './enums';

// --------------------------------------------------
// ORGANIZATION ENTITY
// --------------------------------------------------
@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'simple-json', nullable: true })
  settings!: any;

  @Column({ type: 'text', nullable: true })
  parentOrganizationId!: string;

  @ManyToOne(() => Organization, (org) => org.childOrganizations, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentOrganizationId' })
  parentOrganization!: Organization;

  @OneToMany(() => Organization, (org) => org.parentOrganization)
  childOrganizations!: Organization[];

  @OneToMany(() => User, (user) => user.organization)
  users!: User[];

  @OneToMany(() => Task, (task) => task.organization)
  tasks!: Task[];

  @OneToMany(() => Team, (team) => team.organization)
  teams!: Team[];
}

// --------------------------------------------------
// USER ENTITY
// --------------------------------------------------
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true, nullable: true })
  supabaseUserId!: string | null;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'text', nullable: true })
  passwordHash!: string | null;

  @Column({ type: 'text', nullable: true })
  name!: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role!: UserRole;

  @Column({ type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt!: Date | null;

  @Column({ type: 'boolean', default: false })
  mfaEnabled!: boolean;

  @Column({ type: 'integer', default: 30 })
  sessionTimeout!: number;

  @Column({ type: 'simple-json', nullable: true })
  preferences!: any;

  @Column({ type: 'text' })
  organizationId!: string;

  @ManyToOne(() => Organization, (org) => org.users)
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @ManyToMany(() => Team, (team) => team.members)
  teams!: Team[];

  @CreateDateColumn()
  createdAt!: Date;
}

// --------------------------------------------------
// TEAM ENTITY
// --------------------------------------------------
@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text' })
  organizationId!: string;

  @ManyToOne(() => Organization, (org) => org.teams)
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable({
    name: 'team_users',
    joinColumn: { name: 'teamId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members!: User[];

  @OneToMany(() => Task, (task) => task.assignedTeam)
  tasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

// --------------------------------------------------
// TASK ENTITY
// --------------------------------------------------
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  category!: string;

  @Column({ type: 'text' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  priority!: string;

  @Column({ type: 'text' })
  organizationId!: string;

  @ManyToOne(() => Organization, (org) => org.tasks)
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;

  @Column({ type: 'text' })
  createdBy!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator!: User;

  @Column({ type: 'text', nullable: true })
  assignedTeamId!: string | null;

  @ManyToOne(() => Team, (team) => team.tasks)
  @JoinColumn({ name: 'assignedTeamId' })
  assignedTeam!: Team | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

// --------------------------------------------------
// AUDIT LOG ENTITY
// --------------------------------------------------
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  userId!: string;

  @Column({
    type: 'simple-enum',
    enum: ActionType,
  })
  action!: ActionType;

  @Column({ type: 'text' })
  resourceType!: string;

  @Column({ type: 'text', nullable: true })
  resourceId!: string;

  @CreateDateColumn()
  timestamp!: Date;
}

// --------------------------------------------------
// PERMISSION ENTITY
// --------------------------------------------------
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
  })
  role!: UserRole;
}
