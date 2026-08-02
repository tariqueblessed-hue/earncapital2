import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <AdminSidebar />

      <main
        style={{
          marginLeft: "260px",
          width: "100%",
          minHeight: "100vh",
          background: "#020617",
        }}
      >
        {children}
      </main>
    </div>
  );
}