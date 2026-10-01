import Box from '@mui/material/Box';

interface CategoryDotProps {
  color?: string;
  size?: number;
}

export default function CategoryDot({ color = '#8A8577', size = 10 }: CategoryDotProps) {
  return (
    <Box
      aria-hidden
      sx={{ width: size, height: size, borderRadius: '50%', bgcolor: color, flexShrink: 0 }}
    />
  );
}
