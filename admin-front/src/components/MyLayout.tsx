import type { ReactNode } from 'react';
import { Layout } from 'react-admin';
import {MyMenu} from './MyMenu';

export const MyLayout = ({ children }: { children: ReactNode }) => (
    <Layout menu={MyMenu}>
        {children}
    </Layout>
);