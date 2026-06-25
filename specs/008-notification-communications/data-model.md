# Data Model: Notification & Communications

## Entities

### `Notification`
Represents an administrative message sent or drafted for users.

- **Fields**:
  - `id`: `string` (UUID)
  - `title`: `string` (Must not be empty)
  - `message`: `string` (Must not be empty, max 500 characters)
  - `status`: `'Published' | 'Draft' | 'Scheduled' | 'Failed'`
  - `targetAudience`: `'Broadcast' | 'Specific Roles' | 'Location'`
  - `roles`: `string[]` (Optional, required if targetAudience is 'Specific Roles')
  - `locationRadius`: `number` (Optional, required if targetAudience is 'Location')
  - `locationCoordinates`: `{ lat: number, lng: number }` (Optional, required if targetAudience is 'Location')
  - `deliveryChannels`: `('Push' | 'InApp')[]` (Always both per FR-008)
  - `scheduledAt`: `string` (ISO 8601 Date string, optional)
  - `createdAt`: `string` (ISO 8601 Date string)
  - `updatedAt`: `string` (ISO 8601 Date string)

## Validation Rules
- `title` is required and max 100 characters.
- `message` is required and max 500 characters.
- If `status` is `'Scheduled'`, `scheduledAt` must be a future date.
- If `targetAudience` is `'Specific Roles'`, `roles` array must have at least one element.
- If `targetAudience` is `'Location'`, `locationRadius` and `locationCoordinates` must be provided.

## State Transitions
- `'Draft'` -> `'Published'` (When admin publishes immediately)
- `'Draft'` -> `'Scheduled'` (When admin schedules for future)
- `'Scheduled'` -> `'Published'` (When system automatically sends at scheduled time)
- `'Scheduled'` -> `'Draft'` (If admin cancels schedule to edit)
- `*` -> `'Failed'` (When bulk sending fails after 3 automatic retries per FR-009)
