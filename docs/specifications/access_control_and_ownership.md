[Back to Specifications](README.md)

# VestaCP Access Control and Ownership
VestaCP is built on the concept of federated access control and ownership for users. The hierarchy of ownership is as follows:
- **Admin**: The highest level of ownership in VestaCP. The admin has the ability to create and manage users, and assign them to organisations and team. The admin can also create and manage servers, and assign them to organisations and teams. The admin can also create and manage organizations.
- **Organization**: The second level of ownership in VestaCP. An organization can have multiple teams and projects. The organization can also have multiple users under teams. Organizations can be created by the admin.
- **Team**: The third level of ownership in VestaCP. A team can have multiple projects and users. Teams can be created by the admin or organization owner.
- **User**: The lowest level of ownership in VestaCP. A user can be assigned to an organisation or a team and can have access to projects. Users can be created by the admin, organization owner, or team owner.

## Access Control
Access control in VestaCP is based on the principle of least privilege. The admin, organization owner, and team owner can assign roles to users. Access control relies on a simple role-based access control (RBAC) model.

## Authentication
VestaCP uses a federated authentication model. Users can authenticate using their email address and password. The admin can also enable two-factor authentication for users. The API only accepts authentication using the header `Authorization: Bearer <token>`.

*Note: Additional authentication such as SSO, SAML, and OAuth will be part of the roadmap for VestaCP.*

