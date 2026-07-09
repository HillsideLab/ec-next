export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screeen flex-col">
        <main className="flex-1 wrapper">
            { children }
        </main>
    </div>
  );
}
