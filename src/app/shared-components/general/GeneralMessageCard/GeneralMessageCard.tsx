import { Box, Card, CardContent } from "@mui/material";
import _ from "@lodash";

type GeneralMessageCardProps = {
  message: string;
};

function GeneralMessageCard({ message}: GeneralMessageCardProps) {
  return (
    <Card
      className="mt-0 p-24">
    <CardContent sx={{ p: '0 !important' }}>

      <Box sx={{
						padding: '1rem',
						backgroundColor: '#F1F0F0',
						borderRadius: '10px'
					}}>
						{message}
					</Box>
    </CardContent>
  </Card>
  );
}

export default GeneralMessageCard;