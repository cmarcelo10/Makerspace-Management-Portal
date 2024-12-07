import {
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Grid2,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { Issue } from '../../models.ts';

interface IssueCardProps {
    issue: Issue;
    handleOOD?: () => void;
    handleResolve?: () => void;
}
const IconStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
};

const IssueCard: React.FC<IssueCardProps> = ({
    issue,
    handleOOD,
    handleResolve,
}) => {
    return (
        <Card
            className="request-card"
            sx={{
                backgroundColor: 'white',
                margin: '10px 0px 10px 0px',
                padding: '0px',
                borderRadius: '14px',
                width: '90%',
                boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.3)',
            }}
        >
            <CardContent>
                <Grid2 container spacing={4}>
                    <Grid2 size="auto">
                        <img
                            src={issue.equipment?.icon}
                            style={IconStyle}
                            alt={issue.equipment?.icon}
                        ></img>
                    </Grid2>
                    <Grid2 size="grow">
                        <Typography
                            variant="h6"
                            className="card-title"
                            sx={{
                                fontWeight: 'bolder',
                            }}
                        >
                            {issue.equipment?.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            className="card-description"
                            sx={{
                                margin: '10px 0',
                                color: '#757575',
                                wordWrap: 'break-word',
                            }}
                        >
                            {issue.description}
                        </Typography>
                        <Box
                            className="card-footer"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '10px',
                            }}
                        >
                            <Typography
                                variant="body2"
                                className="card-date"
                                sx={{
                                    flex: '1',
                                    color: '#757575',
                                }}
                            >
                                <EventIcon
                                    className="issue.equipment?.icon"
                                    sx={{
                                        verticalAlign: 'middle',
                                        color: '#757575',
                                    }}
                                />{' '}
                                {issue.createdAt.substring(0, 10)}
                            </Typography>
                        </Box>
                    </Grid2>
                </Grid2>
                <Grid2 container>
                    <Grid2 size="grow"></Grid2>
                    <Grid2>
                        {issue.equipment?.isUnderMaintenance === false &&
                            issue.equipment?.isBookable === true && (
                                <Button
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        boxShadow:
                                            '0px 1px 8px rgba(0, 0, 0, 0.7)',
                                        paddingLeft: '30px',
                                        paddingRight: '30px',
                                        fontWeight: 'bold',
                                    }}
                                    onClick={() => handleOOD?.()}
                                >
                                    Set Out-Of-Order
                                </Button>
                            )}

                        <Button
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                textTransform: 'none',
                                borderRadius: 2,
                                boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.7)',
                                marginLeft: '15px',
                                paddingLeft: '50px',
                                paddingRight: '50px',
                                fontWeight: 'bold',
                            }}
                            onClick={() => handleResolve?.()}
                        >
                            Resolve
                        </Button>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );
};

export default IssueCard;
