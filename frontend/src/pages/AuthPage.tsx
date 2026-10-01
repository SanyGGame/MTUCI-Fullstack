import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { AuthForm } from '../features/auth';

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
          Личный финучёт
        </Typography>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <AuthForm mode={mode} />
        </Paper>
      </Box>
    </Box>
  );
}
