# Data Model: Architecture Setup & Core Layout

## Entities

### Notification (UI Model)
Represents a system alert displayed in the Header dropdown.
- `id`: string (Unique identifier)
- `title`: string (Short summary)
- `description`: string (Detailed message)
- `timestamp`: Date (When it occurred)
- `isRead`: boolean (Read status)
- `type`: 'info' | 'warning' | 'error' | 'success'

### NavItem (UI Model)
Represents a link in the Sidebar.
- `label`: string (Display text)
- `icon`: LucideIcon (Visual representation)
- `href`: string (Navigation path)
- `badge`: number | string (Optional counter)

## State Transitions

### Notification Lifecycle
1. **Received**: Fetched from API (or mock) and displayed.
2. **Read**: User clicks notification or "Mark all as read".
3. **Dismissed**: User removes notification from the list.

### Sidebar State
- **Desktop**: Persistent (Fixed/Static).
- **Mobile**: Hidden -> Open (Drawer) -> Hidden.
