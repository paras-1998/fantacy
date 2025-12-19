import { Card, CardContent, Typography } from '@mui/material';


import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import { TextField, Button } from '@mui/material';

const ConfigurationSettings = () => {
    const dataProvider = useDataProvider();
    const [settings, setSettings] = useState<{commissionPercentage?: number; }>({});

    useEffect(() => {
        dataProvider.getOne('config', { id: 'get' }).then(({ data }) => {
            setSettings(data);
        });
    }, [dataProvider]);

    const handleSave = () => {
        dataProvider.update('config', {
            id: 'set', data: settings,
            previousData: undefined
        });
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Configuration Settings
                </Typography>
                <form>
                 <TextField
    label="Commission Percentage"
    type="number"
    value={settings.commissionPercentage}
    onChange={(e) => {
        const value = e.target.value;
        // If input is empty, keep it as empty string to allow typing
        // Otherwise, convert to number
        setSettings(prev => ({
            ...prev,
            commissionPercentage: value === '' ? '' : Number(value),
        }));
    }}
    fullWidth
    margin="normal"
    InputLabelProps={{ shrink: settings.commissionPercentage !== '' }} // label floats only if value is not empty
/>

                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ConfigurationSettings;
