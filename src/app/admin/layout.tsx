import AdminSidebar from '@/components/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex w-full">
      <AdminSidebar />
      <div className="flex-grow lg:pl-64 pt-[53px] lg:pt-0 flex flex-col min-h-screen w-full overflow-x-hidden">
        <main className="flex-grow p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
