import { 
    List, 
    Datagrid, 
    TextField,
    DateField
} from 'react-admin';


export const BalancehistoryList = () => (
    <List>
        <Datagrid bulkActionButtons={false} >
        <TextField source="name" label="Admin" />
        <TextField source="username" />
        <TextField source="amount" />
        <DateField source="createdAt" showTime />
        </Datagrid>
    </List>
);