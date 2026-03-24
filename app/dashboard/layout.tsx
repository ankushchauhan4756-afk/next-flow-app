export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Demo mode - skip authentication
  return <>{children}</>;
}
