import { 
    List, 
    Datagrid, 
    TextField, 
    DateField,
    Create , 
    Edit,
    SimpleForm,
    SelectInput,
    SelectArrayInput,
    TextInput,
    required,
    ReferenceInput,
    FunctionField,
    useRecordContext,
    CheckboxGroupInput
    
} from 'react-admin';
import { Card, CardContent, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import moment from 'moment';
const requiredValidation = [required()];

const PostPanel = () => {
    const record = useRecordContext();
    return (
        <Card>
            <CardContent>
                <Typography variant="h5">User Wise Sold Tickets</Typography>
                <Datagrid bulkActionButtons={false} data={record.ticketsData} total={record.ticketsData.length} rowClick="edit">
                    <TextField source="username" />
                    <TextField source="totalShree" />
                    <TextField source="totalVashikaran" />
                    <TextField source="totalSudarshan" />
                    <TextField source="totalVastu" />
                    <TextField source="totalPlanet" />
                    <TextField source="totalLove" />
                    <TextField source="totalTara" />
                    <TextField source="totalGrah" />
                    <TextField source="totalMatsya" />
                    <TextField source="totalMeditation" />
                </Datagrid>
            </CardContent>
        </Card>
    );
};
const TimerCard = () => {
    const [time, setTime] = useState<any>(null);  
    useEffect(() => {
      const timer = setInterval(() => {
        const now = moment().utcOffset("+05:30");
        const minutesB = Math.floor(now.minutes() / 5) * 5; // Align to the nearest 5-minute interval
        const startB = now.clone().startOf('hour').add(minutesB, 'minutes');
        const endB = startB.clone().add(5, 'minutes');
        const differenceInSeconds = endB.diff(now, 'seconds');

        setTime(moment(endB).format('hh:mm A')+" / "+moment.utc(differenceInSeconds*1000).format('mm:ss'));
      }, 1000);
  
      return () => clearInterval(timer); // Cleanup on unmount
    }, []);
  
    return (
      <Card sx={{ textAlign: "center", p: 1, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" color="primary">
            Live Timer : {time}
          </Typography>
        </CardContent>
      </Card>
    );
  };

export const SessionsList = () => (
    <>
    <TimerCard/>
    <List>
        <Datagrid bulkActionButtons={false} expand={<PostPanel />}
            isRowExpandable={row => (row.ticketsData.length > 0) }  >
            <DateField source="startTime" showTime />
            <DateField source="endTime" showTime showDate={false} />
            <FunctionField
                source="Shree"
                render={record => `${record.Shree} (${record.ShreeAmount})`}
            />
            <FunctionField
                source="Vashikaran"
                render={record => `${record.Vashikaran} (${record.VashikaranAmount})`}
            />
            <FunctionField
                source="Sudarshan"
                render={record => `${record.Sudarshan} (${record.SudarshanAmount})`}
            />
            <FunctionField
                source="Vastu"
                render={record => `${record.Vastu} (${record.VastuAmount})`}
            />
            <FunctionField
                source="Planet"
                render={record => `${record.Planet} (${record.PlanetAmount})`}
            />
            <FunctionField
                source="Love"
                render={record => `${record.Love} (${record.LoveAmount})`}
            />
            <FunctionField
                source="Tara"
                render={record => `${record.Tara} (${record.TaraAmount})`}
            />
            <FunctionField
                source="Grah"
                render={record => `${record.Grah} (${record.GrahAmount})`}
            />
            <FunctionField
                source="Matsya"
                render={record => `${record.Matsya} (${record.MatsyaAmount})`}
            />
            <FunctionField
                source="Meditation"
                render={record => `${record.Meditation} (${record.MeditationAmount})`}
            />
            
            
            <TextField source="totalAmount" />
            <TextField source="payout" />
            <TextField source="winner" />
            <TextField source="winnerType" />
            <TextField source="createdDate" />


        </Datagrid>
    </List>
    </>
);

const choices = [
    { id: '1X', name: '1X' },
    { id: '2X', name: '2X' },
    { id: '3X', name: '3X' },
];

const WinnerChoice = [
    { id: 'Vashikaran', name: 'Vashikaran' },
    { id: 'Shree', name: 'Shree' },
    { id: 'Sudarshan', name: 'Sudarshan' },
    { id: 'Vastu', name: 'Vastu' },
    { id: 'Planet', name: 'Planet' },
    { id: 'Love', name: 'Love' },
    { id: 'Tara', name: 'Tara' },
    { id: 'Grah', name: 'Grah' },
    { id: 'Matsya', name: 'Matsya' },
    { id: 'Meditation', name: 'Meditation' }
];



export const SessionCreate = () => (
    <Create >
        <SimpleForm /* redirect="list" */ >
        <ReferenceInput reference="sessions/timeslots" source="startTime" label="timeslots">
        <SelectInput />
    </ReferenceInput>
            {/* <SelectInput source="winnerType" choices={choices}  validate={requiredValidation} /> */}
          <SelectInput
    source="winnerType"
    choices={choices}
    validate={requiredValidation}
    defaultValue={choices?.[0]?.id}
/>
 <CheckboxGroupInput
    source="winner"
    choices={WinnerChoice}
    validate={requiredValidation}
/>
            {/* <SelectArrayInput source="winner" choices={WinnerChoice}  validate={requiredValidation} /> */}
        </SimpleForm>
    </Create>
);



    const SessionTitle = () => {
        return <span>Edit </span>;
    };

import { useFormContext } from 'react-hook-form';


const WinnerTypeInput = ({ choices }) => {
    const record = useRecordContext();
    const { setValue } = useFormContext();

    useEffect(() => {
        // wait for record + choices
        if (!record || !choices?.length) return;

        // 🔒 DO NOTHING if API already sent value
        if (record.winnerType !== undefined && record.winnerType !== null && record.winnerType !== '') {
            return;
        }

        // ✅ only fallback when field is truly empty
        setValue('winnerType', choices[0].id, {
            shouldDirty: false,
            shouldValidate: true,
        });
    }, [record, choices, setValue]);

    return (
        <SelectInput
            source="winnerType"
            choices={choices}
            validate={requiredValidation}
        />
    );
};


export const SessionEdit = () => (
    <Edit title={<SessionTitle />}>
        <SimpleForm>
            <TextInput disabled source="startTime" />

            <WinnerTypeInput choices={choices} />

            <CheckboxGroupInput
                source="winner"
                choices={WinnerChoice}
                validate={requiredValidation}
            />
        </SimpleForm>
    </Edit>
);