import { 
    List, 
    Datagrid, 
    TextField, 
    EmailField , 
    Create , 
    Edit,
    SimpleForm , 
    TextInput , 
    PasswordInput,
    required,
    email,
    

    useRecordContext
} from 'react-admin';

const requiredValidation = [required()];
const validateEmail = [required(),email()];
export const AdminList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <EmailField source="email" />
        </Datagrid>
    </List>
);

export const AdminCreate = () => (
    <Create >
            <SimpleForm /* redirect="list" */ >
                <TextInput source="name" validate={requiredValidation} />
                <TextInput source="email" validate={validateEmail} />
                <PasswordInput source="password" validate={requiredValidation} />
            </SimpleForm>
        </Create>
    );

    const AdminTitle = () => {
        const record = useRecordContext();
        return <span>Edit {record ? `"${record.name}"` : ''}</span>;
    };
export const AdminEdit = () => (
    <Edit title={<AdminTitle />}>
        <SimpleForm  >
            <TextInput disabled source="id" />
            <TextInput source="name" validate={requiredValidation} />
            <TextInput source="email" validate={validateEmail} />
            <PasswordInput source="password" />
        </SimpleForm>
    </Edit>
);