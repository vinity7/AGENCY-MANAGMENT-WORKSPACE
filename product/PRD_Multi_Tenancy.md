# Functional PRD: Manual Team Provisioning & Agile Roles

## 📋 Feature Overview
To scale AgencyOS for high-growth teams, we are moving from a reactive "Invite-only" system to a proactive "Direct Provisioning" model. This allows organization Owners and Admins to instantly create accounts for their team members, bypassing email latency and ensuring immediate access to workspace tools.

## 🎯 Product Value
> **"Reduced new user Time-to-Value (TTV) by eliminating email latency and enabling instant role-based onboarding."**

## 🏗️ Technical Architecture

### Multi-Tenant Isolation
- **Automatic orgId Association**: Every user created via the provisioning endpoint is automatically scoped to the creator's `orgId`.
- **RBAC v2**: Support for both Legacy roles and new Scrum-specific roles.

### User Roles & Permissions Matrix

| Role | Responsibility | Data View | Write Access | Delete Access |
|------|----------------|-----------|--------------|---------------|
| **Owner** | Workspace Admin | Everything | Everything | Everything |
| **Product Owner** | Value Maximizer | Projects, Backlogs | Priorities, Stories | Features |
| **Product Manager**| Strategy Owner | Analytics, Roadmap | Requirements | Roadmap Items |
| **Developer** | Implementation | Tasks, Capacity | Own Tasks, Code | Own Tasks |
| **Scrum Master** | Process Lead | Capacity, Velocity | Sprints, Retros | Sprints |
| **Contributor** | Legacy Team | Assigned Work | Own Tasks | Nothing |
| **Client** | Stakeholder | Own Projects | Feedback Only | Nothing |

## 🛠️ User Workflow: "Instant Access"
1. **Admin Action**: Clicks "Add Member" in Organization Settings.
2. **Identification**: Enters Name, Email, Department, and Job Title.
3. **Role Assignment**: Uses the **Role Selector** to pick a Scrum (Recommended) or Legacy role.
4. **Provisioning**: The system generates a secure 8-character password (or accepts a manual one).
5. **Instant Live**: User status is set to `active` immediately.
6. **Credential Sharing**: Admin receives a success modal with credentials to share via Slack, Teams, or internal channels.

## 📈 Success Metrics (KPIs)
- **TTV (Time-to-Value)**: Targeting < 2 minutes from Admin action to New User first action.
- **Role Adoption**: % of users created with Scrum roles vs Legacy roles.
- **Seat Utilization**: Average users per organization (Limit set to 20).

## 🔒 Security & Constraints
- **Organization Limits**: Enforced limit of 20 users per workspace to protect system resources.
- **Case-Insensitive RBAC**: Middleware has been updated to handle case-insensitive role matching to ensure backward compatibility with legacy data.
