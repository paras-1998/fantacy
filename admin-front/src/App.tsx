import {
  Admin,
  Resource,
  CustomRoutes,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { Route } from 'react-router-dom';
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from './authProvider';



import { AdminList , AdminCreate , AdminEdit } from "./components/admins";
import {UserList , UserCreate, UserEdit} from "./components/users";
import { SessionsList , SessionCreate ,SessionEdit} from "./components/sessions";
import { BalancehistoryList } from "./components/balancehistory";

import ConfigurationSettings from './components/ConfigurationSettings';
import { MyLayout } from './components/MyLayout';

export const App = () => (
  <Admin 
    authProvider={authProvider} 
    layout={MyLayout} 
    dataProvider={dataProvider}
  >
    <Resource name="admins" list={AdminList} create={AdminCreate} edit={AdminEdit} />
    <Resource name="users"  list={UserList}  create={UserCreate} edit={UserEdit} />
    <Resource name="balancehistory"  list={BalancehistoryList}  />
    <Resource name="sessions"  list={SessionsList} create={SessionCreate}  edit={SessionEdit} />

    <CustomRoutes>
            <Route path="/settings" element={<ConfigurationSettings />} />
    </CustomRoutes>
  </Admin>
);
