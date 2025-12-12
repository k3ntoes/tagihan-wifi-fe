import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { verifySession } from "@/lib/auth/session";
import { ArrowRight, BarChart3, ShieldCheck, Wifi } from "lucide-react";
import Link from "next/link";

export default async function LandingPage() {
  const session = await verifySession();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Wifi className="h-6 w-6 text-primary" />
            <span>TagihanWiFi</span>
          </div>
          <nav className="flex items-center gap-4">
            {session ? (
              <Button asChild>
                <Link href="/dashboard">
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="default">
                <Link href="/auth/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto grid items-center gap-6 pt-6 pb-8 md:py-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
              Sistem Manajemen <br className="hidden sm:inline" />
              Tagihan Internet & WiFi
            </h1>
            <p className="max-w-[700px] text-muted-foreground text-lg sm:text-xl">
              Platform lengkap untuk mengelola pelanggan, paket internet, dan penagihan bulanan dengan mudah dan efisien.
            </p>
            <div className="flex gap-4 mt-4">
              {session ? (
                <Button asChild size="lg" className="h-12 px-8">
                  <Link href="/dashboard">
                    Akses Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="h-12 px-8">
                  <Link href="/auth/login">Mulai Sekarang</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card">
              <CardHeader>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wifi className="h-6 w-6" />
                </div>
                <CardTitle>Manajemen Paket</CardTitle>
                <CardDescription>
                  Atur berbagai jenis paket internet dengan kecepatan dan harga yang fleksibel sesuai kebutuhan bisnis Anda.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle>Data Pelanggan Aman</CardTitle>
                <CardDescription>
                  Simpan data pelanggan dengan aman dan terorganisir. Mudah dicari dan dikelola kapan saja.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle>Monitoring Tagihan</CardTitle>
                <CardDescription>
                  Pantau status pembayaran tagihan setiap bulan. Sistem pencatatan yang rapi untuk keuangan yang lebih baik.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row text-sm text-muted-foreground">
          <p>© 2024 TagihanWiFi. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
