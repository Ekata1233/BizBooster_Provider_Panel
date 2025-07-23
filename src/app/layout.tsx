import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ModuleProvider } from './context/ModuleContext';
import { CategoryProvider } from './context/CategoryContext';
import { SubcategoryProvider } from './context/SubCategoryContext';
import { ServiceProvider } from './context/ServiceContext';
import { SubscribeProvider } from './context/SubscribeContext';
import { ProviderContextProvider } from '@/context/ProviderContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { ServiceManProvider } from './context/ServiceManContext';
import { ServiceCustomerProvider } from './context/ServiceCustomerContext';
import { LeadProvider } from './context/LeadContext';
import { WalletProvider } from './context/WalletContext';
import { AdProvider } from './context/AdContext';
import { ProviderGalleryProvider } from './context/ProviderGalleryContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <AuthProvider>
              <ModuleProvider>
                <CategoryProvider>
                  <SubcategoryProvider>
                    <ServiceProvider>
                      <SubscribeProvider>
                        <ProviderContextProvider>
                          <CheckoutProvider>
                            <ServiceManProvider>
                              <ServiceCustomerProvider>
                                <LeadProvider>
                                  <WalletProvider>
                                    <AdProvider>
                                      <ProviderGalleryProvider>
                                    {children}
                                    </ProviderGalleryProvider>
                                    </AdProvider>
                                  </WalletProvider>
                                </LeadProvider>
                              </ServiceCustomerProvider>
                            </ServiceManProvider>
                          </CheckoutProvider>
                        </ProviderContextProvider>
                      </SubscribeProvider>
                    </ServiceProvider>
                  </SubcategoryProvider>
                </CategoryProvider>
              </ModuleProvider>
            </AuthProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
