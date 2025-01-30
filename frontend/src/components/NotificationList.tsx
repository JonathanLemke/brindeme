// src/components/NotificationList.tsx
export default function NotificationList({ notifications }: { notifications: any[] }) {
  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id} className="border p-2 mb-2 rounded-md">
          {notification.message}
        </li>
      ))}
    </ul>
  );
}
