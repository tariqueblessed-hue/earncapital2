import DashboardHeader from "@/components/admin/DashboardHeader";
import DashboardCards from "@/components/admin/DashboardCards";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      <main
        style={{
          flex: 1,
          padding: "30px",
          background: "#f8fafc",
        }}
      >
        <DashboardHeader />
        <DashboardCards />
      </main>
    </div>
  );
}