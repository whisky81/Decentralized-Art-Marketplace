import { useState, useRef } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Chip,
    // Link as MuiLink, // MuiLink is not used, can be removed if not planned for future use
} from '@mui/material';
import {
    CloudUpload,
    Add,
    Close,
    Delete,
} from '@mui/icons-material';
import AutoProcess from '../components/AutoProcess';
import Value from '../components/Value';

const CreateNftFormV2 = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [isTraitModalOpen, setTraitModalOpen] = useState(false);
    const [newTraitType, setNewTraitType] = useState('');
    const [newTraitName, setNewTraitName] = useState('');
    const [open, setOpen] = useState(false)
    const [price, setPrice] = useState("0.005");
    const [unit, setUnit] = useState("ether");

    const [data, setData] = useState({
        name: "",
        description: "",
        external_url: "",
        attributes: []
    })

    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (f) {
            console.log(f.type);
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    const handleAddTrait = () => {
        if (newTraitType && newTraitName) {
            setData({
                ...data,
                attributes: [...data.attributes, { trait_type: newTraitType, value: newTraitName }]
            })
            setNewTraitType('');
            setNewTraitName('');
            setTraitModalOpen(false);
        }
    };

    const handleRemoveTrait = (index) => {
        setData({
            ...data,
            attributes: data.attributes.filter((_, i) => i !== index)
        })

    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>Create NFT</Typography>
            <Typography color="text.secondary" mb={4}>Once minted, item info is permanent.</Typography>
            <Grid container spacing={4}>
                <Grid>
                    <Box
                        onClick={() => fileInputRef.current.click()}
                        sx={{
                            border: '2px dashed grey',
                            borderRadius: 2,
                            height: 345, // MODIFIED: Increased height for the dropzone (was 300)
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            backgroundColor: '#fafafa',
                        }}
                    >
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                        />
                        {preview ? (
  file.type.includes("video/") ? (
    <Box mt={3} sx={{ width: 460, maxHeight: 460 }}> 
        src={preview}
        controls
        style={{ width: '100%', height: 'auto', maxHeight: '100%', display: 'block' }}
    </Box>
  ) : (
    <Box
      component="img"
      src={preview}
      alt="Preview"
      sx={{ maxHeight: 460, maxWidth: 460, width: 'auto', height: 'auto', display: 'block' }} 
    />
  )
) : (
  <Stack alignItems="center">
    <CloudUpload sx={{ fontSize: 50, mb: 1 }} />
    <Typography>Click or drag media to upload (MAX SIZE 20 MB)</Typography>
  </Stack>
)}

                    </Box>
                </Grid>
                <Grid>
                    <Value price={price} setUnit={setUnit} setPrice={setPrice} unit={unit} />
                    <br />
                    <Stack spacing={3}>
                        <TextField
                            label="Name"
                            fullWidth
                            required
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                        />

                        <TextField
                            label="External link"
                            fullWidth
                            value={data.external_url}
                            onChange={(e) => setData({ ...data, external_url: e.target.value })}
                        />

                        <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle1">Traits</Typography>
                                <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => setTraitModalOpen(true)}>Add</Button>
                            </Stack>
                            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                                {data.attributes && data.attributes.map((trait, index) => (
                                    <Chip
                                        key={index}
                                        label={`${trait.trait_type}: ${trait.value}`}
                                        onDelete={() => handleRemoveTrait(index)}
                                        deleteIcon={<Delete />}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>

            <Box textAlign="right" mt={4}>
                <AutoProcess open={open} setOpen={setOpen} data={data} file={file} price={price} unit={unit} />
            </Box>

            <Dialog open={isTraitModalOpen} onClose={() => setTraitModalOpen(false)}>
                <DialogTitle>
                    Add Trait
                    <IconButton
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                        onClick={() => setTraitModalOpen(false)}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} pt={1}>
                        <TextField
                            label="Trait Type"
                            value={newTraitType}
                            onChange={(e) => setNewTraitType(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Trait Name"
                            value={newTraitName}
                            onChange={(e) => setNewTraitName(e.target.value)}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button fullWidth variant="contained" onClick={handleAddTrait}>Add</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
export default CreateNftFormV2;