'use client';

import { ReactNode, useEffect, useState } from 'react';

// third-party
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// project-import
import Loader from 'ui-component/Loader';
import Locales from 'ui-component/Locales';
import Snackbar from 'ui-component/extended/Snackbar';

import ThemeCustomization from 'themes';
import { getMenu } from 'store/slices/menu';
import { persister, store, dispatch } from 'store';
import { ConfigProvider } from 'contexts/ConfigContext';
import NavigationScroll from 'layout/NavigationScroll';

import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getMenu()).then(() => {
      setLoading(true);
    });
  }, []);

  if (!loading) return <Loader />;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <ConfigProvider>
          <ThemeCustomization>
            <Locales>
              <NavigationScroll>
                <AuthProvider>
                  <>
                    <Snackbar />
                    {children}
                  </>
                </AuthProvider>
              </NavigationScroll>
            </Locales>
          </ThemeCustomization>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}
