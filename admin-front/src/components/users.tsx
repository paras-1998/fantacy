import { useState } from 'react';
import { List, Datagrid, TextField,
    SimpleForm,
    Edit,
    Create,
    Toolbar,
    SaveButton,
    
    PasswordInput,
    TextInput,
    DateField,
    required,
    NumberField,
    
    FunctionField,
    NumberInput,
    RadioButtonGroupInput,
    DeleteWithConfirmButton,
} from 'react-admin';

const requiredValidation = [required()];
const Filters = [
    <TextInput source="q" label="Search" alwaysOn />,
];




export const UserList = (props:any) => {

    
    
    return (
        <>
        <List filters={Filters}>
            <Datagrid  bulkActionButtons={false}  >
                <TextField source="username" />
                <TextField source="password" />
                <TextField source="balance" />
                <FunctionField
                    source="status"
                    render={record => `${record.status == 1 ? "Active" : "Block"}`}
                />
                <DateField source="createdAt" />
                <DeleteWithConfirmButton />
            </Datagrid>
        </List>

      
    </>
    )
};

export const UserCreate = () => (
    <Create >
            <SimpleForm  >
                <TextInput source="username" validate={requiredValidation} />
                <NumberField source="balance"  />
                <PasswordInput source="password" validate={requiredValidation} />
            </SimpleForm>
        </Create>
    );


const EditToolbar = () => (
    <Toolbar >
        <SaveButton />
    </Toolbar>
);

export const UserEdit = (props:any) => {
    const [diableBal, setDiableBal] = useState(true);
    
    const baltypechange = (e:any) => {
        e.target.value == "None" ? setDiableBal(true) : setDiableBal(false);
    };
    return (
        <Edit title="Edit User" >
            <SimpleForm  toolbar={<EditToolbar />} >
            <TextInput source="username" validate={requiredValidation} />
            <TextInput source="password"  />
            <RadioButtonGroupInput source="status"   choices={[
                { id: 1, name: 'Active' },
                { id: 0, name: 'Block' },
            ]} />
            <RadioButtonGroupInput source="balanceType" onChange={(e)=>baltypechange(e)}  choices={[
                { id: 'None', name: 'None' },
                { id: 'Add', name: 'Add' },
                { id: 'Remove', name: 'Remove' },
            ]} />
            <NumberInput disabled={diableBal} source="balance" value="0" />
            </SimpleForm>
        </Edit>
    )
};