import { Menu } from 'react-admin';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

export const MyMenu = () => (
    <Menu >
        {/* Existing menu items */}
        <Menu.ResourceItems />
        <Menu.Item to="/settings" primaryText="Settings" leftIcon={<SettingsIcon />} component={Link} />
    </Menu>
);
